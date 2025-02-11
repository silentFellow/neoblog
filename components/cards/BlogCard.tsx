import Link from "next/link";
import { Blog } from "@/types";
import { Button } from "@/components/ui/button";
import DeleteBlog from "@/components/buttons/DelteBlog";
import { FaReadme } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import ImageLoader from "../loaders/ImageLoader";

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
    <article className="w-full bg-[#f5f5f5] shadow-md flex gap-4 md:gap-6 p-3 md:p-4 rounded-md">
      {/* Image Section */}
      <section className="flex justify-center md:justify-start">
        <div className="relative h-28 w-28 lg:h-40 lg:w-40 rounded-md overflow-hidden">
          <ImageLoader src={blog.thumbnail} alt={blog.title} fill />
        </div>
      </section>

      {/* Content Section */}
      <section className="flex flex-col w-full">
        <div className="flex flex-col gap-2 flex-grow">
          <h3 className="font-extrabold text-lg md:text-xl line-clamp-2">
            {blog.title}
          </h3>

          <div className="flex flex-wrap gap-2">
            {blog.tags.map((tag, idx) => (
              <Link
                href={`/?page-number=1&tag=${tag.id}`}
                key={idx}
                className="text-xs md:text-sm text-light-1"
              >
                #{tag.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Buttons Section */}
        <section className="flex flex-wrap gap-2 mt-2 md:mt-4 end">
          {blog.author.id === userId && (
            <DeleteBlog blogId={blog.id} path={path} />
          )}

          {blog.author.id === userId && (
            <Link href={`/edit-blog/${blog.id}`}>
              <Button className="flex items-center gap-1">
                <FaEdit />
                <span className="max-lg:hidden">Edit</span>
              </Button>
            </Link>
          )}

          <Link href={`/read-blog/${blog.id}`}>
            <Button className="flex items-center gap-1">
              <FaReadme />
              <span className="max-lg:hidden">Read</span>
            </Button>
          </Link>
        </section>
      </section>
    </article>
  );
};

export default BlogCard;
