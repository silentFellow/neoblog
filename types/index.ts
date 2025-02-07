export interface Response<T = undefined> {
  message: string;
  status: number;
  data?: T;
}

export interface User {
  id: string;
  username: string;
  password: string | null;
}

export interface Session {
  user: {
    name?: string;
    email?: string;
    image?: string;
    id: string;
    username: string;
  };
}
