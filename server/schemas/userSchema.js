const z = require("zod");

const userSchema = z
  .object({
    firstName: z.string().min(2).max(100).trim(),
    lastName: z.string().min(2).max(100).trim(),
    email: z.string().trim().email(),
    password: z
      .string()
      .min(8)
      .max(100)
      .refine(
        (value) => {
          const uppercaseRegex = /[A-Z]/;
          const lowercaseRegex = /[a-z]/;
          const digitRegex = /\d/;
          const specialCharRegex = /[!@#$%^&*]/;

          return (
            uppercaseRegex.test(value) &&
            lowercaseRegex.test(value) &&
            digitRegex.test(value) &&
            specialCharRegex.test(value)
          );
        },
        {
          message:
            "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character",
          path: ["password"],
        }
      ),
    confirmPassword: z.string().min(8),
    braintreeCustomerId: z.string().nonempty().optional(),
  })
  .strict();

module.exports = userSchema;
