"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  userSigninValidation,
  userSignupValidation,
} from "@/lib/validation/users.validation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { useState } from "react";
import { Label } from "../ui/label";
import { createUser } from "@/lib/actions/user.actions";

const UserForm = ({ type }: { type: "login" | "sign-up" }) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const router = useRouter();

  const form = useForm({
    resolver:
      type === "login"
        ? zodResolver(userSigninValidation)
        : zodResolver(userSignupValidation),
    defaultValues:
      type == "login"
        ? {
            username: "",
            password: "",
          }
        : {
            username: "",
            password: "",
            confirmPassword: "",
          },
  });

  const onSubmit = async (value: z.infer<typeof userSigninValidation>) => {
    try {
      setIsSubmitting(true);

      if (type == "login") {
        const res = await signIn("credentials", {
          username: value.username,
          password: value.password,
          redirect: false,
        });

        if (!res || !res.ok) {
          throw new Error(res?.error ?? "An unknown error occurred");
        }
      } else {
        const res = await createUser(value.username, value.password);
        if (res.status !== 200) {
          throw new Error(res?.message ?? "An unknown error occurred");
        }
      }

      router.push("/");
    } catch (error: any) {
      console.log(`Error loging in: ${error.message}`);
      throw new Error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(async (value) => {
          toast.promise(onSubmit(value), {
            loading: type === "login" ? "Signing in..." : "Creating user...",
            success:
              type === "login"
                ? "Login successful"
                : "User created successfully",
            error: (err: any) => `${err.message}`,
          });
        })}
        className="flex flex-col justify-start gap-6 w-full"
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1 w-full">
              <FormLabel className="text-[16px] leading-[140%] font-[600px] text-light-2">
                Username
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Enter your username..."
                  className="no-focus"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1 w-full">
              <FormLabel className="text-base-semibold text-light-2">
                Password
              </FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter password..."
                  className="no-focus"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {type == "sign-up" && (
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1 w-full">
                <FormLabel className="text-base-semibold text-light-2">
                  Confirm Password
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter confirm password..."
                    className="no-focus"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {type === "login" ? (
          <div className="flex items-center whitespace-nowrap text-xs">
            <Label className="font-bold">New to NeoBlog? </Label>
            <Button
              className="p-2"
              asChild
              variant="link"
              onClick={() => {
                router.push("/sign-up");
              }}
            >
              <span>Sign-up</span>
            </Button>
          </div>
        ) : (
          <div className="flex items-center whitespace-nowrap text-xs">
            <Label className="font-bold">Have Link? </Label>
            <Button
              className="p-2"
              asChild
              variant="link"
              onClick={() => {
                router.push("/sign-in");
              }}
            >
              <span>Login in</span>
            </Button>
          </div>
        )}

        <Button type="submit" className="bg-black" disabled={isSubmitting}>
          {type === "login" && (isSubmitting ? "Logging in..." : "Login")}
          {type === "sign-up" && (isSubmitting ? "Creating user..." : "Signup")}
        </Button>
      </form>
    </Form>
  );
};

export default UserForm;
