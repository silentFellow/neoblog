"use client";

import { User } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { signOut } from "next-auth/react";
import { CgProfile } from "react-icons/cg";
import { IoIosLogOut } from "react-icons/io";
import { IoCreateOutline } from "react-icons/io5";
import { MdOutlinePhotoCameraFront } from "react-icons/md";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChangeEvent } from "react";
import { Input } from "../plate-ui/input";
import { useUploadFile } from "@/lib/uploadthing";
import { useObject } from "@/hooks";
import { updateUser } from "@/lib/actions/user.actions";
import { toast } from "sonner";

const Profile = ({ user }: { user: User }) => {
  const router = useRouter();

  const [updateProfileImage, setUpdateProfileImage] = useObject({
    image: user.profileImage,
    file: null as File | null,
  });
  const [flow, setFlow] = useObject({
    dropdownOpen: false,
    imageDropdownOpen: false,
    isSubmitting: false,
  });
  const { uploadFile } = useUploadFile({
    onUploadComplete: async (file) => {
      const res = await updateUser({
        userid: user.id,
        data: { profileImage: file.url },
        path: "/",
      });
      if (res.status !== 200) throw new Error("Failed to update profile image");
    },
  });

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const fileReader = new FileReader();

    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setUpdateProfileImage("file", file);

      if (!file.type.includes("image")) return;

      fileReader.onload = async (event) => {
        const imageUrl = event.target?.result?.toString() || "";
        setUpdateProfileImage("image", imageUrl);
      };

      fileReader.readAsDataURL(file);
    }
  };

  const updateImage = async () => {
    if (updateProfileImage.file === null) return;
    if (!((updateProfileImage.file as unknown) instanceof File))
      throw new Error("Invalid file type");

    try {
      setFlow("isSubmitting", true);

      // @ts-expect-error - File type is checked above
      await uploadFile(updateProfileImage.file);

      setFlow("imageDropdownOpen", false);
      setFlow("dropdownOpen", false);
    } catch (error: any) {
      console.log(`Error updating profile image: ${error.message}`);
      throw new Error(error.message);
    } finally {
      setFlow("isSubmitting", false);
    }
  };

  return (
    <DropdownMenu
      open={flow.dropdownOpen}
      onOpenChange={(open) => setFlow("dropdownOpen", open)}
    >
      <DropdownMenuTrigger asChild>
        <Avatar>
          <AvatarImage src={user.profileImage} alt={user.username} />
          <AvatarFallback>
            {user.username.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="center"
        className="p-2 font-semibold space-y-1 mt-3"
      >
        {/* Prevent dropdown from closing when clicking */}
        <DropdownMenuItem
          className="text-md"
          onSelect={(e) => e.preventDefault()} // Prevent dropdown from closing
          onClick={() => setFlow("imageDropdownOpen", true)}
        >
          <span className="text-2xl">
            <MdOutlinePhotoCameraFront />
          </span>
          Update Photo
        </DropdownMenuItem>

        {/* Dialog should remain open properly */}
        <Dialog
          open={flow.imageDropdownOpen}
          onOpenChange={(open) => setFlow("imageDropdownOpen", open)}
        >
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Profile Picture</DialogTitle>
              <DialogDescription>
                Make changes to {user.username} profile here. Click save when
                you&apos;re done.
              </DialogDescription>
            </DialogHeader>
            <div className="flex gap-3 bg-[#f5f5f5] rounded-md p-3">
              <Avatar
                className="full border border-[rgb(33,33,33)]"
                id="profile-image-update"
              >
                <AvatarImage
                  src={updateProfileImage.image as string}
                  alt={user.username}
                />
                <AvatarFallback>
                  {user.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <Input
                type="file"
                accept=".png, .jpg, .webp, .svg, .jpeg"
                className="no-focus"
                onChange={(e) => handleImageChange(e)}
              />
            </div>
            <DialogFooter>
              <Button
                type="submit"
                disabled={flow.isSubmitting}
                onClick={() => {
                  toast.promise(updateImage, {
                    loading: "Updating profile",
                    success: "Profile updated successfully",
                    error: (err: any) => `${err.message}`,
                  });
                }}
              >
                Save changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <DropdownMenuItem
          className="text-md"
          onClick={() => router.push(`/profile/${user.id}`)}
        >
          <span className="text-2xl">
            <CgProfile />
          </span>
          My Blogs
        </DropdownMenuItem>

        <DropdownMenuItem
          className="text-md"
          onClick={() => router.push("/create-blog")}
        >
          <span className="text-2xl">
            <IoCreateOutline />
          </span>
          Create Blog
        </DropdownMenuItem>

        <DropdownMenuItem className="text-md" onClick={() => signOut()}>
          <span className="text-2xl">
            <IoIosLogOut />
          </span>
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Profile;
