import { Button } from "@/components/ui/button";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { Blogs, Session, Response } from "@/types";
import Link from "next/link";
import Profile from "@/components/home/profile";
import { fetchUser } from "@/lib/actions/user.actions";
import { fetchBlogs } from "@/lib/actions/blog.actions";
import { redirect } from "next/navigation";

const Home = async () => {
  const [session, blogs] = (await Promise.all([
    await getServerSession(authOptions),
    await fetchBlogs({ pageNumber: 1, pageSize: 10 }),
  ])) as [Session | null, Response<Blogs>];

  const user = session
    ? await fetchUser({ field: "id", identity: session.id })
    : null;

  if (blogs.status === 404) redirect("/?page-number=1");
  if (blogs.status !== 200 || !blogs.data) return null;

  return (
    <section className="col">
      <div className="between">
        <h1 className="text-2xl font-bold">NeoBlog</h1>

        {session && user && user.data ? (
          <Profile user={user.data} />
        ) : (
          <Link href="/sign-in">
            <Button>Sign in</Button>
          </Link>
        )}
      </div>
    </section>
  );
};

export default Home;
