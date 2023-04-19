const z = require("zod");

const transactionSchema = z
  .object({
    transactionId: z.string().min(2).max(100).trim(),
  })
  .strict();

module.exports = transactionSchema;
