"use server";

import { arrayOverlaps, eq, sql, count, desc, ilike, and } from "drizzle-orm";
import { tags, blogs, users } from "@/lib/drizzle/schema";
import connectToDb from "@/lib/drizzle";
import { Blog, Blogs } from "@/types";
import { revalidatePath } from "next/cache";
import { Response } from "@/types";

const createBlog = async (
  path: string,
  {
    author,
    title,
    tags,
    content,
    thumbnail,
  }: {
    author: string;
    title: string;
    tags: string[];
    content: string;
    thumbnail: string;
  },
): Promise<Response> => {
  try {
    const db = await connectToDb();

    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, author))
      .limit(1);
    if (!user || user.length === 0) {
      return { message: "Author not found", status: 404 };
    }

    await db.insert(blogs).values({ author, title, tags, content, thumbnail });

    revalidatePath(path);
    return { message: "Blog created successfully", status: 200 };
  } catch (error: any) {
    console.error(`Error creating blogs: ${error.message}`);
    return { message: "Failed to create Blog", status: 500 };
  }
};

// fetch blogs
const fetchBlogs = async ({
  pageNumber,
  pageSize = 10,
  author,
  tag,
  search,
}: {
  pageNumber: number;
  pageSize?: number;
  author?: string;
  tag?: string;
  search?: string;
}): Promise<Response<Blogs>> => {
  try {
    const db = await connectToDb();

    // just if(x) conditions.push(f(x))
    const conditions = [
      author && eq(blogs.author, author),
      tag && arrayOverlaps(blogs.tags, [tag]),
      search && ilike(blogs.title, `%${search}%`),
    ].filter(Boolean);

    // Get total count
    const totalRowsResult = await db
      .select({ total: count() })
      .from(blogs)
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    const totalRows = totalRowsResult[0]?.total ?? 0;

    if (
      Number(pageNumber) !== 1 &&
      Math.ceil(totalRows / pageSize) < Number(pageNumber)
    )
      return { message: "No more blogs to fetch", status: 404 };

    const skipAmount = (pageNumber - 1) * pageSize;

    const blogResult = await db
      .select({
        blog: blogs,
        tag: tags,
        author: {
          id: users.id,
          username: users.username,
        },
      })
      .from(blogs)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(blogs.updatedAt))
      .offset(skipAmount)
      .limit(pageSize)
      .innerJoin(users, eq(blogs.author, users.id))
      .leftJoin(tags, sql`${blogs.tags} && ARRAY[${tags.id}]::uuid[]`);

    // Process the result to group tags for each blog
    const processedBlogs = blogResult.reduce<Record<string, Blog>>(
      (acc, row) => {
        const blogId = row.blog.id;
        if (!acc[blogId]) {
          acc[blogId] = {
            ...row.blog,
            author: row.author,
            tags: [],
            createdAt: row.blog.createdAt.toISOString(),
            updatedAt: row.blog.updatedAt.toISOString(),
          };
        }
        if (row.tag) {
          acc[blogId].tags.push(row.tag);
        }

        return acc;
      },
      {},
    );

    const result = Object.values(processedBlogs);

    const hasNext = skipAmount + pageSize < totalRows;

    return {
      message: "Blogs fetched successfully",
      status: 200,
      data: { hasNext, blogs: result },
    };
  } catch (error: any) {
    console.error(`Error fetching blogs: ${error.message}`);
    return { message: "Error fetching blogs", status: 500 };
  }
};

const fetchBlog = async (id: string): Promise<Response<Blog>> => {
  try {
    const db = await connectToDb();
    const blogResult = await db
      .select({
        blog: blogs,
        tag: tags,
        author: {
          id: users.id,
          username: users.username,
        },
      })
      .from(blogs)
      .where(eq(blogs.id, id))
      .limit(1)
      .innerJoin(users, eq(blogs.author, users.id))
      .leftJoin(tags, sql`${blogs.tags} && ARRAY[${tags.id}]::uuid[]`);

    // Process the result to group tags for each blog
    const processedBlogs = blogResult.reduce<Record<string, Blog>>(
      (acc, row) => {
        const blogId = row.blog.id;
        if (!acc[blogId]) {
          acc[blogId] = {
            ...row.blog,
            author: row.author,
            tags: [],
            createdAt: row.blog.createdAt.toISOString(),
            updatedAt: row.blog.updatedAt.toISOString(),
          };
        }
        if (row.tag) {
          acc[blogId].tags.push(row.tag);
        }
        return acc;
      },
      {},
    );

    const result = Object.values(processedBlogs);

    if (result.length === 0) {
      return { message: "Blog not found", status: 404 };
    }

    return {
      message: "Blog fetched successfully",
      status: 200,
      data: result[0],
    };
  } catch (error: any) {
    console.error(`Error fetching blogs: ${error.message}`);
    return { message: "Error fetching blogs", status: 500 };
  }
};

const deleteBlog = async (id: string, path: string): Promise<Response> => {
  try {
    const db = await connectToDb();
    const result = await db.delete(blogs).where(eq(blogs.id, id)).returning();

    if (result.length === 0) {
      return { message: "Blog not found", status: 404 };
    }

    revalidatePath(path);
    return { message: "Blog deleted successfully", status: 200 };
  } catch (error: any) {
    console.error(`Error deleting blog: ${error.message}`);
    return { message: "Failed to delete blog", status: 500 };
  }
};

const updateBlog = async (
  id: string,
  path: string,
  {
    title,
    tags,
    content,
    thumbnail,
  }: {
    title: string;
    tags: string[];
    content: string;
    thumbnail: string;
  },
): Promise<Response> => {
  try {
    const db = await connectToDb();

    const exists = await db.select().from(blogs).where(eq(blogs.id, id));
    if (!exists || exists.length === 0) {
      return { message: "Blog not found", status: 404 };
    }

    await db
      .update(blogs)
      .set({
        title,
        tags,
        content,
        thumbnail,
        updatedAt: new Date(),
      })
      .where(eq(blogs.id, id));

    revalidatePath(path);
    return { message: "Blog updated successfully", status: 200 };
  } catch (error: any) {
    console.error(`Error updating blogs: ${error.message}`);
    return { message: "Failed to update blog", status: 500 };
  }
};

const fetchBlogsOnTags = async ({
  tagId,
  pageNumber,
  pageSize = 10,
  search,
}: {
  tagId: string;
  pageNumber: number;
  pageSize?: number;
  search?: string;
}): Promise<Response<Blogs>> => {
  try {
    const db = await connectToDb();

    const skipAmount = (pageNumber - 1) * pageSize;
    const totalRowsResult = await db
      .select({ total: count() })
      .from(blogs)
      .where(
        search !== ""
          ? ilike(
              blogs.title,
              `%${search}%` && arrayOverlaps(blogs.tags, [tagId]),
            )
          : arrayOverlaps(blogs.tags, [tagId]),
      );
    const totalRows = totalRowsResult[0]?.total ?? 0;

    if (
      Number(pageNumber) !== 1 &&
      Math.ceil(totalRows / pageSize) < Number(pageNumber)
    )
      return { message: "No more blogs to fetch", status: 404 };

    const blogResult = await db
      .select({
        blog: blogs,
        tag: tags,
        author: {
          id: users.id,
          username: users.username,
        },
      })
      .from(blogs)
      .orderBy(desc(blogs.updatedAt))
      .offset(skipAmount)
      .limit(pageSize)
      .where(
        search !== ""
          ? ilike(
              blogs.title,
              `%${search}%` && arrayOverlaps(blogs.tags, [tagId]),
            )
          : arrayOverlaps(blogs.tags, [tagId]),
      )
      .innerJoin(users, eq(blogs.author, users.id))
      .leftJoin(tags, sql`${blogs.tags} && ARRAY[${tags.id}]::uuid[]`);

    // Process the result to group tags for each blog
    const processedBlogs = blogResult.reduce<Record<string, Blog>>(
      (acc, row) => {
        const blogId = row.blog.id;
        if (!acc[blogId]) {
          acc[blogId] = {
            ...row.blog,
            author: row.author,
            tags: [],
            createdAt: row.blog.createdAt.toISOString(),
            updatedAt: row.blog.updatedAt.toISOString(),
          };
        }
        if (row.tag) {
          acc[blogId].tags.push(row.tag);
        }
        return acc;
      },
      {},
    );

    const result = Object.values(processedBlogs);

    const hasNext = skipAmount + pageSize < totalRows;

    return {
      message: "Blogs fetched successfully",
      status: 200,
      data: { hasNext, blogs: result },
    };
  } catch (error: any) {
    console.error(`Error fetching blogs: ${error.message}`);
    return { message: "Error fetching blogs", status: 500 };
  }
};

const fetchBlogsOnAuthor = async ({
  authorId,
  pageNumber,
  pageSize = 10,
  search,
}: {
  authorId: string;
  pageNumber: number;
  pageSize?: number;
  search?: string;
}): Promise<Response<Blogs>> => {
  try {
    const db = await connectToDb();

    const skipAmount = (pageNumber - 1) * pageSize;
    const totalRowsResult = await db
      .select({ total: count() })
      .from(blogs)
      .where(
        search !== ""
          ? ilike(blogs.title, `%${search}%` && eq(blogs.author, authorId))
          : eq(blogs.author, authorId),
      );
    const totalRows = totalRowsResult[0]?.total ?? 0;

    if (
      Number(pageNumber) !== 1 &&
      Math.ceil(totalRows / pageSize) < Number(pageNumber)
    )
      return { message: "No more blogs to fetch", status: 404 };

    const blogResult = await db
      .select({
        blog: blogs,
        tag: tags,
        author: {
          id: users.id,
          username: users.username,
        },
      })
      .from(blogs)
      .orderBy(desc(blogs.updatedAt))
      .offset(skipAmount)
      .limit(pageSize)
      .where(
        search !== ""
          ? ilike(blogs.title, `%${search}%` && eq(blogs.author, authorId))
          : eq(blogs.author, authorId),
      )
      .innerJoin(users, eq(blogs.author, users.id))
      .leftJoin(tags, sql`${blogs.tags} && ARRAY[${tags.id}]::uuid[]`);

    // Process the result to group tags for each blog
    const processedBlogs = blogResult.reduce<Record<string, Blog>>(
      (acc, row) => {
        const blogId = row.blog.id;
        if (!acc[blogId]) {
          acc[blogId] = {
            ...row.blog,
            author: row.author,
            tags: [],
            createdAt: row.blog.createdAt.toISOString(),
            updatedAt: row.blog.updatedAt.toISOString(),
          };
        }
        if (row.tag) {
          acc[blogId].tags.push(row.tag);
        }
        return acc;
      },
      {},
    );

    const result = Object.values(processedBlogs);

    const hasNext = skipAmount + pageSize < totalRows;

    return {
      message: "Blogs fetched successfully",
      status: 200,
      data: { hasNext, blogs: result },
    };
  } catch (error: any) {
    console.error(`Error fetching blogs: ${error.message}`);
    return { message: "Error fetching blogs", status: 500 };
  }
};

export {
  createBlog,
  updateBlog,
  fetchBlogs,
  fetchBlog,
  fetchBlogsOnTags,
  fetchBlogsOnAuthor,
  deleteBlog,
};
