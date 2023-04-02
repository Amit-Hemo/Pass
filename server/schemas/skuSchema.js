// catalog number is based on uuid for now - need to be change in the future
const z = require("zod");
const { validate: uuidValidate, version: uuidVersion } = require("uuid");

const skuSchema = z
  .object({
    sku: z
      .string()
      .refine((value) => uuidValidate(value) && uuidVersion(value) === 4),
  })
  .strict();

module.exports = skuSchema;
