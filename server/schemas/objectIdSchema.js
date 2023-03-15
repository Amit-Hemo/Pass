const z = require('zod');
const { Types } = require('mongoose');

const objectIdSchema = z.object({
  id: z
    .string()
    .nonempty()
    .optional()
    .refine((value) => Types.ObjectId.isValid(value)),
});

module.exports = objectIdSchema;
