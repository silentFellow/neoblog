import { Button } from "@/components/ui/button";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { Blogs, Session, Response, Blog } from "@/types";
import Link from "next/link";
import Profile from "@/components/home/profile";
import { fetchUser } from "@/lib/actions/user.actions";
import { fetchBlogs } from "@/lib/actions/blog.actions";
import { redirect } from "next/navigation";
import Pagination from "@/components/Pagination";
import Image from "next/image";
import { JetBrains_Mono } from "next/font/google";
import BlogCard from "@/components/cards/BlogCard";
import { RiResetRightLine } from "react-icons/ri";
import { joinQuery } from "@/lib/utils";
import Search from "@/components/Search";

const jetbrains_mono = JetBrains_Mono({ subsets: ["latin"], weight: "800" });

const Home = async (props: {
  searchParams: Promise<{
    "page-number": number;
    "page-size"?: number;
    author?: string;
    tag?: string;
    search?: string;
  }>;
}) => {
  const searchParams = await props.searchParams;

  const query = joinQuery({
    "page-number": searchParams["page-number"] || "1",
    "page-size": searchParams["page-size"] || "10",
    author: searchParams["author"],
    tag: searchParams["tag"],
    search: searchParams["search"],
  });
  const currentQuery = joinQuery(searchParams);
  if (query !== currentQuery) redirect(query);

  const [session, blogRes] = (await Promise.all([
    await getServerSession(authOptions),
    await fetchBlogs({
      pageNumber: searchParams["page-number"],
      pageSize: searchParams["page-size"] || 10,
      author: searchParams.author || "",
      tag: searchParams.tag || "",
      search: searchParams.search || "",
    }),
  ])) as [Session | null, Response<Blogs>];

  const user = session
    ? await fetchUser({ field: "id", identity: session.id })
    : null;

  if (blogRes.status === 404) redirect("/?page-number=1");
  if (blogRes.status !== 200 || !blogRes.data) return null;

  return (
    <section className="col gap-3">
      <div className="between">
        <Link href={"/"}>
          <header className="center gap-3">
            <div className="relative h-9 w-9">
              <Image src="/logo.png" alt="neoblog" fill />
            </div>
            <h1 className={`text-3xl font-bold ${jetbrains_mono.className}`}>
              NeoBlog
            </h1>
          </header>
        </Link>

        {session && user && user.data ? (
          <Profile user={user.data} />
        ) : (
          <Link href="/sign-in">
            <Button>Sign in</Button>
          </Link>
        )}
      </div>

      {/* search section */}
      <div className="my-4 full flex gap-3">
        <Search />

        <Link href="/">
          <Button>
            <RiResetRightLine />
            Reset
          </Button>
        </Link>
      </div>

      <div className="full col gap3">
        {searchParams.search && (
          <h2 className="font-bold text-xl">
            Search results for:{" "}
            <span className="text-lg">&quot;{searchParams.search}&quot;</span>
          </h2>
        )}

        {blogRes.data.blogs.length < 1 ? (
          <h2 className="text-center mt-3 text-[rgb(33,33,33)]">
            No Blogs found...
          </h2>
        ) : (
          <div className="my-6 grid gap-3 grid-cols-1 md:grid-cols-2">
            {blogRes.data.blogs.map((blog: Blog, idx) => (
              <BlogCard
                key={idx}
                userId={user?.data?.id || ""}
                blog={blog}
                path={"/"}
              />
            ))}
          </div>
        )}
      </div>

      {blogRes.data.blogs.length > 1 && (
        <Pagination
          path="/"
          pageNumber={searchParams["page-number"]}
          isNext={blogRes?.data?.hasNext}
        />
      )}
    </section>
  );
};

export default Home;
