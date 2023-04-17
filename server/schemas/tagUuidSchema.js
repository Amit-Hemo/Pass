const z = require("zod");
const { validate: uuidValidate, version: uuidVersion } = require("uuid");

const tagUuidSchema = z
  .object({
    tagUuid: z
      .string()
      .refine((value) => uuidValidate(value) && uuidVersion(value) === 4),
  })
  .strict();

module.exports = tagUuidSchema;
