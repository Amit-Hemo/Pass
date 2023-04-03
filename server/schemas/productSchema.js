const z = require("zod");

const productSchema = z
  .object({
    name: z.string().min(2).max(100).trim(),
    price: z.string().min(1).max(10).trim().regex(/^\d+(\.\d{1,2})?$/),
    size: z.string().min(1).max(5).trim(),
    image: z.string().url(),
  })
  .strict();

module.exports = productSchema;
