const z = require('zod');
const { validate: uuidValidate, version: uuidVersion } = require('uuid');

const uuidSchema = z.object({
  uuid: z
    .string()
    .refine((value) => uuidValidate(value) && uuidVersion(value) === 4),
});

module.exports = uuidSchema;
