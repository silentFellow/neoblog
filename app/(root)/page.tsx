import { Button } from "@/components/ui/button";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { Blogs, Session, Response } from "@/types";
import Link from "next/link";
import Profile from "@/components/home/profile";
import { fetchUser } from "@/lib/actions/user.actions";
import { fetchBlogs } from "@/lib/actions/blog.actions";
import { redirect } from "next/navigation";
import Pagination from "@/components/Pagination";
import Image from "next/image";
import { JetBrains_Mono } from "next/font/google";

const lobster = JetBrains_Mono({ subsets: ["latin"], weight: "800" });

const Home = async (props: {
  searchParams: Promise<{ "page-number": number; "page-size"?: number }>;
}) => {
  const searchParams = await props.searchParams;
  if (!searchParams["page-number"]) redirect("?page-number=1");

  const [session, blogs] = (await Promise.all([
    await getServerSession(authOptions),
    await fetchBlogs({
      pageNumber: searchParams["page-number"],
      pageSize: searchParams["page-size"] || 10,
    }),
  ])) as [Session | null, Response<Blogs>];

  const user = session
    ? await fetchUser({ field: "id", identity: session.id })
    : null;

  if (blogs.status === 404) redirect("/?page-number=1");
  if (blogs.status !== 200 || !blogs.data) return null;

  return (
    <section className="col">
      <div className="between">
        <header className="center gap-3">
          <div className="relative h-9 w-9">
            <Image src="/logo.png" alt="neoblog" fill />
          </div>
          <h1 className={`text-3xl font-bold ${lobster.className}`}>NeoBlog</h1>
        </header>

        {session && user && user.data ? (
          <Profile user={user.data} />
        ) : (
          <Link href="/sign-in">
            <Button>Sign in</Button>
          </Link>
        )}
      </div>

      <Pagination
        path="/"
        pageNumber={searchParams["page-number"]}
        isNext={blogs?.data?.hasNext}
      />
    </section>
  );
};

export default Home;
