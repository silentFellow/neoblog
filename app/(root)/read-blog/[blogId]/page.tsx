import { PlateEditor } from "@/components/editor/plate-editor";
import { fetchBlog } from "@/lib/actions/blog.actions";
import { JetBrains_Mono } from "next/font/google";
import Link from "next/link";
import { redirect } from "next/navigation";

const jetbrain_mono = JetBrains_Mono({ subsets: ["latin"], weight: "800" });

const ReadBlog = async (props: { params: Promise<{ blogId: string }> }) => {
  const params = await props.params;
  const blogRes = await fetchBlog(params.blogId);

  if (blogRes.status !== 200) redirect("/");

  const blog = blogRes.data;

  return (
    <section className="full">
      <div className="col gap-3">
        <h2 className={`text-3xl ${jetbrain_mono.className}`}>{blog?.title}</h2>
        <div className="flex gap-2 items-center">
          <Link
            href={`/profile/${blog?.author.id}`}
            className="text-md text-light-1"
          >
            #{blog?.author.username}
          </Link>

          {blog?.tags.map((tag, idx) => (
            <Link
              href={`/?page-number=1&tag=${tag.id}`}
              key={idx}
              className="text-md text-light-1"
            >
              #{tag.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-3 min-h-screen w-full" data-registry="plate">
        <PlateEditor
          editable={false}
          initialValue={JSON.parse(blog?.content || "")}
        />
      </div>
    </section>
  );
};

export default ReadBlog;
