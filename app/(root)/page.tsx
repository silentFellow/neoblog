import { Button } from "@/components/ui/button";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { Session } from "@/types";
import Link from "next/link";
import Profile from "@/components/home/profile";
import { fetchUser } from "@/lib/actions/user.actions";

const Home = async () => {
  const session: Session | null = await getServerSession(authOptions);
  const user = session
    ? await fetchUser({ field: "id", identity: session.id })
    : null;

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
