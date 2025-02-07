import { z } from "zod";

export const userSigninValidation = z.object({
  username: z
    .string()
    .min(3, "mininmum 3 character long")
    .max(12, "maximum 12 character long"),
  password: z
    .string()
    .min(3, "mininmum 3 character long")
    .max(20, "maximum 20 character long"),
});

export const userSignupValidation = z
  .object({
    username: z
      .string()
      .min(3, "mininmum 3 character long")
      .max(12, "maximum 12 character long"),
    password: z
      .string()
      .min(3, "mininmum 3 character long")
      .max(20, "maximum 20 character long"),
    confirmPassword: z
      .string()
      .min(3, "mininmum 3 character long")
      .max(20, "maximum 20 character long"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
  });
