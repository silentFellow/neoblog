import Link from "next/link";
import { Blog } from "@/types";
import Image from "next/image";
import { Button } from "../ui/button";
import DeleteBlog from "../buttons/DelteBlog";
import { FaReadme } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const BlogCard = ({
  userId,
  blog,
  path,
}: {
  userId: string;
  blog: Blog;
  path: string;
}) => {
  return (
    <article className="h-48 w-full bg-[#f5f5f5] shadow-md flex gap-6 p-2 rounded-md">
      <section className="center">
        <div className="relative h-36 w-36">
          <Image src={blog.thumbnail} alt={blog.title} fill />
        </div>
      </section>

      <section className="col w-full">
        <div className="h-[70%] col gap-1">
          <h3 className="font-extrabold text-xl text-clip">{blog.title}</h3>

          <div className="flex gap-2 items-center">
            {blog.tags.map((tag, idx) => (
              <Link
                href={`/?page-number=1&tag=${tag.id}`}
                key={idx}
                className="text-xs text-light-1"
              >
                #{tag.name}
              </Link>
            ))}
          </div>
        </div>

        <section className="h-[20%] end gap-2">
          {blog.author.id === userId && (
            <DeleteBlog blogId={blog.id} path={path} />
          )}

          {blog.author.id === userId && (
            <Link href={`/edit-blog/${blog.id}`}>
              <Button>
                <FaEdit />
                Edit
              </Button>
            </Link>
          )}

          <Link href={`/read-blog/${blog.id}`}>
            <Button>
              <FaReadme />
              Read
            </Button>
          </Link>
        </section>
      </section>
    </article>
  );
};

export default BlogCard;
