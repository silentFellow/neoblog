"use client";

import { Session } from "@/types";
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

const Profile = ({ user }: { user: Session }) => {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar>
          <AvatarImage src={user.user.image} alt="@shadcn" />
          <AvatarFallback>
            {user.user.name?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="center"
        className="p-2 font-semibold space-y-1"
      >
        <DropdownMenuItem
          className="text-md"
          onClick={() => console.log("update profile picture.")}
        >
          <span className="text-2xl">
            <MdOutlinePhotoCameraFront />
          </span>
          Update Photo
        </DropdownMenuItem>

        <DropdownMenuItem
          className="text-md"
          onClick={() => router.push(`/user-blogs/${user.user.id}`)}
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
