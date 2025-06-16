import z from "zod";

export const registerSchema =
  z.object({
    email: z.string().email(),
    username: z
      .string() // [username].shop.com,
      .min(3, "Username must be at least 3 characters")
      .max(63, "Username must be less than 63 characters")
      .regex(
        /^[a-z0-9][a-z0-9-]*[a-z0-9]$/,
        "Username can only contain lowercase letters, numbers or hyphens. It must start and end with a letter or number"
      )
      // define special constraint
      .refine(
        (val) => !val.includes("--"),
        "Username cannot contain consencutive hyphens"
      )
      .transform((val) => val.toLowerCase()),
    password: z.string().min(5),
  });

export const loginSchema =
  z.object({
    email: z.string().email(),
    password: z.string(),
  });
