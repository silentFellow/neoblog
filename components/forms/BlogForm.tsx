"use client";

import { ChangeEvent, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { usePathname, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  blogValidation,
  tagValidation,
} from "@/lib/validation/blogs.validation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlateEditor } from "@/components/editor/plate-editor";
import { createBlog, updateBlog } from "@/lib/actions/blog.actions";
import { createTag } from "@/lib/actions/tag.actions";

import Image from "next/image";
import { isBase64Image } from "@/lib/utils";
import { IoMdAdd } from "react-icons/io";
import { toast } from "sonner";
import MultipleSelector from "../ui/multi-select";
import { useUploadThing } from "@/lib/uploadthing";

interface Props {
  user: {
    id: string;
    username: string;
    profileImage: string;
  };
  tags: {
    id: string;
    name: string;
  }[];
  edit?: boolean;
  editData?: {
    id: string;
    title: string;
    tags: string[];
    content: string;
    thumbnail: string;
  };
}

const BlogForm = ({ user, tags, edit, editData }: Props) => {
  const [phase, setPhase] = useState<"metadata" | "content">("metadata");
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<{
    tag: boolean;
    blog: boolean;
  }>({
    tag: false,
    blog: false,
  });
  const editorRef = useRef<HTMLTextAreaElement | null>(null);
  const defaultTags = edit
    ? editData?.tags.reduce((acc: { label: string; value: string }[], tag) => {
        const foundTag = tags.find((t) => t.id === tag);
        return foundTag
          ? acc.concat({
              label: foundTag.name,
              value: foundTag.id,
            })
          : acc;
      }, [])
    : [];

  const { startUpload } = useUploadThing("editorUploader");

  const pathname = usePathname();
  const router = useRouter();

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const blogForm = useForm({
    resolver: zodResolver(blogValidation),
    defaultValues: {
      author: user.id,
      title: edit ? editData?.title || "" : "",
      content: "", // only manged by editor
      thumbnail: edit ? editData?.thumbnail || "" : "",
      tags: edit ? editData?.tags || [] : [],
    },
  });

  const tagForm = useForm({
    resolver: zodResolver(tagValidation),
    defaultValues: {
      name: "",
    },
  });

  const handleImageChange = (
    e: ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void,
  ) => {
    e.preventDefault();

    const fileReader = new FileReader();

    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFiles(Array.from(e.target.files));

      if (!file.type.includes("image")) return;

      fileReader.onload = async (event) => {
        const imageUrl = event.target?.result?.toString() || "";
        fieldChange(imageUrl);
      };

      fileReader.readAsDataURL(file);
    }
  };

  const handleNext = async () => {
    // title, tags verification
    const isValid = await blogForm.trigger(["title", "tags", "thumbnail"]);
    if (!isValid) return;

    // validation of max image size
    if (files.length > 0) {
      const fileSize = Number((files[0].size / 1024 / 1024).toFixed(2));
      if (fileSize > 4) {
        toast.error("Thumbnail too large");
        return;
      }
    }

    if (isValid) {
      setPhase("content");
    }
  };

  const blogSubmit = async (value: z.infer<typeof blogValidation>) => {
    // content validation
    if (
      !editorRef.current ||
      !editorRef.current.value ||
      editorRef.current.value === ""
    ) {
      blogForm.setError("content", {
        type: "manual",
        message: "Content cannot be empty",
      });

      return;
    }
    value.content = JSON.stringify(editorRef.current.value);

    // uploading image
    if (!edit || (edit && files.length > 0)) {
      // Only upload image if it has changed
      try {
        setIsSubmitting((prev) => ({ ...prev, blog: true }));

        const blob = value.thumbnail;
        const hasChanged = isBase64Image(blob);

        if (hasChanged) {
          const file = await startUpload([files[0]]);
          if (!file || file.length < 1 || file[0].appUrl === "")
            throw new Error("Failed to upload thumbnail image");
          value.thumbnail = file[0].appUrl;
        }
      } catch (error: any) {
        throw new Error(`Failed to upload image: ${error.message}`);
      } finally {
        setIsSubmitting((prev) => ({ ...prev, blog: false }));
      }
    }

    // posting blog
    try {
      setIsSubmitting((prev) => ({ ...prev, blog: true }));

      let res;
      if (edit) {
        res = await updateBlog(editData?.id as string, pathname, {
          title: value.title,
          tags: value.tags,
          content: value.content,
          thumbnail: value.thumbnail,
        });
      } else {
        res = await createBlog(pathname, {
          title: value.title,
          author: value.author,
          tags: value.tags,
          content: value.content,
          thumbnail: value.thumbnail,
        });
      }
      if (!res || res.status !== 200) throw new Error(res.message);
      router.push("/");
    } catch (error: any) {
      console.error(`Failed to create blog: ${error.message}`);
      throw new Error(error.message);
    } finally {
      setIsSubmitting((prev) => ({ ...prev, blog: false }));
    }
  };

  const tagSubmit = async (value: z.infer<typeof tagValidation>) => {
    try {
      setIsSubmitting((prev) => ({ ...prev, tag: true }));

      const res = await createTag(value.name, pathname);
      if (!res || res.status !== 200) throw new Error(res.message);
      setIsDialogOpen(false); // Close the dialog
    } catch (error: any) {
      console.error(`Failed to create tag: ${error.message}`);
      throw new Error(error.message);
    } finally {
      setIsSubmitting((prev) => ({ ...prev, tag: false }));
    }
  };

  return (
    // container contains create tag and create blog
    <div className="col items-center p-3">
      {phase === "metadata" ? (
        <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6 space-y-6">
          <Form {...blogForm}>
            <form
              className="space-y-6"
              onSubmit={blogForm.handleSubmit(async (value) => {
                toast.promise(blogSubmit(value), {
                  loading: edit ? "updating blogs..." : "posting blogs...",
                  success: edit
                    ? "successfully updated blog"
                    : "successfully posted blog",
                  error: (err: any) => `${err.message}`,
                });
              })}
            >
              <FormField
                control={blogForm.control}
                name="thumbnail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block text-lg font-semibold">
                      Thumbnail
                    </FormLabel>
                    <label htmlFor="imageUpload" className="cursor-pointer">
                      {field.value ? (
                        <div className="relative h-44 w-44">
                          <Image
                            src={field.value}
                            alt="Thumbnail"
                            fill
                            className="rounded-md shadow-md object-cover"
                          />
                        </div>
                      ) : (
                        <div className="h-44 w-44 bg-gray-200 rounded-md flex items-center justify-center text-gray-500">
                          Click to upload image
                        </div>
                      )}
                    </label>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        placeholder="upload profile picture"
                        className="hidden"
                        id="imageUpload"
                        onChange={(e) => handleImageChange(e, field.onChange)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={blogForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block text-lg font-semibold">
                      Title
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter blog title..."
                        className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={blogForm.control}
                name="tags"
                render={() => (
                  <FormItem>
                    <FormLabel className="block text-lg font-semibold">
                      Tags
                    </FormLabel>
                    <div className="flex gap-4">
                      <MultipleSelector
                        value={defaultTags}
                        options={tags.map((tag) => ({
                          label: tag.name,
                          value: tag.id,
                        }))}
                        placeholder="Select tags..."
                        onChange={(val) => {
                          const v: string[] = val.map((v) => v.value);
                          blogForm.setValue("tags", v);
                        }}
                        emptyIndicator={
                          <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                            no results found.
                          </p>
                        }
                      />
                      <Dialog
                        open={isDialogOpen}
                        onOpenChange={setIsDialogOpen}
                      >
                        <DialogTrigger asChild>
                          <Button variant="outline" className="rounded-md">
                            <IoMdAdd />
                            <span className="font-bold uppercase">Add Tag</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-sm">
                          <DialogHeader>
                            <DialogTitle>Create Tag</DialogTitle>
                          </DialogHeader>

                          <Form {...tagForm}>
                            <form
                              onSubmit={(e) => {
                                e.preventDefault();
                                tagForm.handleSubmit(async (value) => {
                                  toast.promise(tagSubmit(value), {
                                    loading: "Creating tag...",
                                    success: "Successfully created tag",
                                    error: (err: any) => `${err.message}`,
                                  });
                                })(e);
                                e.stopPropagation();
                              }}
                              className="space-y-4"
                            >
                              <FormField
                                control={tagForm.control}
                                name="name"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-md font-semibold">
                                      Tag Name
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        type="text"
                                        placeholder="Enter tag name..."
                                        className="border rounded-md px-3 py-2"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <DialogFooter>
                                <Button
                                  type="submit"
                                  disabled={isSubmitting.tag}
                                >
                                  {isSubmitting.tag ? "Creating..." : "Create"}
                                </Button>
                              </DialogFooter>
                            </form>
                          </Form>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="mt-5 flex justify-end items-center gap-5">
                <Button type="button" className="bg-black" disabled>
                  Prev
                </Button>

                <Button type="submit" className="bg-black" onClick={handleNext}>
                  Next
                </Button>
              </div>
            </form>
          </Form>
        </div>
      ) : (
        <div className="w-full h-full bg-white shadow-lg rounded-lg p-6 space-y-6">
          <Form {...blogForm}>
            <form
              onSubmit={blogForm.handleSubmit(async (value) => {
                toast.promise(blogSubmit(value), {
                  loading: "posting blogs...",
                  success: "successfully posted blog",
                  error: (err: any) => `${err.message}`,
                });
              })}
              className="flex flex-col justify-start gap-6 full"
            >
              <FormField
                control={blogForm.control}
                name="content"
                render={() => (
                  <FormItem className="col">
                    <FormControl>
                      <div className="full h-[27rem]">
                        <PlateEditor
                          changeRef={editorRef}
                          initialValue={
                            edit && JSON.parse(editData?.content || "")
                          }
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end items-center gap-5">
                <Button
                  type="button"
                  className="bg-black"
                  onClick={() => setPhase("metadata")}
                >
                  Prev
                </Button>

                <Button
                  type="submit"
                  disabled={isSubmitting.blog}
                  className="bg-black"
                >
                  {edit
                    ? isSubmitting.blog
                      ? "Updating Blog..."
                      : "Update Blog"
                    : isSubmitting.blog
                      ? "Posting Blog..."
                      : "Post Blog"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      )}
    </div>
  );
};

export default BlogForm;
