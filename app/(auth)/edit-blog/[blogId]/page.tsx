import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import BlogForm from "@/components/forms/BlogForm";
import { fetchBlog } from "@/lib/actions/blog.actions";
import { fetchAllTags } from "@/lib/actions/tag.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { Response, Session, Tag } from "@/types";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const EditBlog = async (props: { params: Promise<{ blogId: string }> }) => {
  const [params, session, tags] = await Promise.all([
    await props.params,
    await getServerSession(authOptions),
    await fetchAllTags(),
  ] as [{ blogId: string }, Session | null, Response<Tag[]>]);

  const user = session
    ? await fetchUser({ field: "id", identity: session.id })
    : null;

  const blogRes = await fetchBlog(params.blogId);
  if (blogRes.status !== 200) redirect("/");

  if (!user || !user.data) return null;
  if (!tags || !tags.data) return null;
  if (!blogRes || !blogRes.data) return null;

  const blog = blogRes.data;

  return (
    <section className="col">
      <h1 className="text-2xl font-bold">Create Blog</h1>

      <BlogForm
        user={user.data}
        tags={tags.data}
        edit
        editData={{
          id: params.blogId,
          title: blog.title,
          tags: blog.tags.map((tag) => tag.id),
          thumbnail: blog.thumbnail,
          content: blog.content,
        }}
      />
    </section>
  );
};

export default EditBlog;
