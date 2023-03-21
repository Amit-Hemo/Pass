const z = require("zod");

const changePasswordSchema = z
  .object({
    newPassword: z
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
    confirmNewPassword: z.string().min(8),
  })
  .strict();

module.exports = changePasswordSchema;
