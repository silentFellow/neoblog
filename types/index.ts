import { Value } from "@udecode/plate";
import { PlateEditor } from "@udecode/plate/react";

export interface Response<T = undefined> {
  message: string;
  status: number;
  data?: T;
}

export interface User {
  id: string;
  username: string;
  password: string | null;
  providerLogin: boolean;
  profileImage: string;
}

export interface Blogs {
  hasNext: boolean;
  blogs: {
    id: string;
    title: string;
    content: string;
    thumbnail: string;
    createdAt: string;
    updatedAt: string;
    author: {
      id: string;
      username: string;
    };
    tags: {
      id: string;
      name: string;
    }[];
  }[];
}

export interface Blog {
  id: string;
  title: string;
  content: string;
  thumbnail: string;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    username: string;
  };
  tags: {
    id: string;
    name: string;
  }[];
}

export interface Tag {
  id: string;
  name: string;
}

export interface Session {
  id: string;
}

export type EditorState =
  | string
  | Value
  | ((editor: PlateEditor) => Value)
  | undefined;
