import { Button } from "@/components/ui/button";

const Home = () => {
  return (
    <section className="col">
      <div className="between">
        <h1 className="text-2xl font-bold">NeoBlog</h1>

        <Button>Create Blog</Button>
      </div>
    </section>
  );
};

export default Home;
