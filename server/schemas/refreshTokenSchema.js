const z = require("zod");

const refreshTokenSchema = z
  .object({
    refreshToken: z.string().nonempty(),
  })
  .strict();

module.exports = refreshTokenSchema;
