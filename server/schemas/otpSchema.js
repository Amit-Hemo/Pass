const z = require("zod");

const otpSchema = z
  .object({
    otp: z.string().length(4).trim().refine((value) => /^\d+$/.test(value), {
      message: 'OTP input should contain only numbers'
    }) 
  })
  .strict();

module.exports = otpSchema;
