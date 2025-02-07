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

      <DropdownMenuContent align="center" className="p-2 font-semibold">
        <DropdownMenuItem
          className="text-md"
          onClick={() => router.push(`/user-blogs/${user.user.id}`)}
        >
          My Blogs
        </DropdownMenuItem>

        <DropdownMenuItem
          className="text-md"
          onClick={() => router.push("/create-blog")}
        >
          Create Blog
        </DropdownMenuItem>

        <DropdownMenuItem className="text-md" onClick={() => signOut()}>
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Profile;
