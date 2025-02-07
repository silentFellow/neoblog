import { Button } from "@/components/ui/button";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { Session } from "@/types";
import Link from "next/link";

const Home = async () => {
  const user: Session | null = await getServerSession(authOptions);
  console.log(user);

  return (
    <section className="col">
      <div className="between">
        <h1 className="text-2xl font-bold">NeoBlog</h1>

        <Link href={user ? "/create-blog" : "/sign-in"}>
          <Button>{user ? "Create Blog" : "Sign In"}</Button>
        </Link>
      </div>
    </section>
  );
};

export default Home;
