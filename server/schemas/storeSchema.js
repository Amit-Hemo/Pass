const z = require("zod");

const storeSchema = z
  .object({
    merchantID: z.string().min(1).max(50).trim(),
    name: z.string().min(1).max(50),
    address: z.string().min(1).max(50),
  })
  .strict();

module.exports = storeSchema;
