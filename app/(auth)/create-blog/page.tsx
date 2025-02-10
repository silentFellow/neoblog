import { PlateEditor } from "@/components/editor/plate-editor";

const CreateBlog = () => {
  return (
    <section className="col">
      <h1 className="text-2xl font-bold">Create Blog</h1>

      <div
        className="mt-6 h-[calc(100vh-10rem)] w-full rounded-lg"
        data-registry="plate"
      >
        <PlateEditor />
      </div>
    </section>
  );
};

export default CreateBlog;
