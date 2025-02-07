import { Button } from "@/components/ui/button";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { Session } from "@/types";
import Link from "next/link";
import Profile from "@/components/home/profile";

const Home = async () => {
  const user: Session | null = await getServerSession(authOptions);

  return (
    <section className="col">
      <div className="between">
        <h1 className="text-2xl font-bold">NeoBlog</h1>

        {user ? (
          <Profile user={user} />
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
