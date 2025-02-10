import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import BlogForm from "@/components/forms/BlogForm";
import { fetchAllTags } from "@/lib/actions/tag.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { Session } from "@/types";
import { getServerSession } from "next-auth";

const CreateBlog = async () => {
  const session: Session | null = await getServerSession(authOptions);
  const user = session
    ? await fetchUser({ field: "id", identity: session.id })
    : null;
  const tags = await fetchAllTags();

  if (!user || !user.data) return null;
  if (!tags || !tags.data) return null;

  return (
    <section className="col">
      <h1 className="text-2xl font-bold">Create Blog</h1>

      <BlogForm user={user.data} tags={tags.data} />
    </section>
  );
};

export default CreateBlog;
