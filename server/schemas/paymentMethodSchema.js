const z = require('zod');

const paymentMethodSchema = z
  .object({
    paymentMethodNonce: z.string(),
  })
  .strict();

module.exports = paymentMethodSchema;
