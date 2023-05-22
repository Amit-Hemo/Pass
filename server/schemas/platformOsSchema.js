const z = require('zod');

const platformOsSchema = z
  .object({
    platformOs: z.union([z.literal('ios'), z.literal('android')]),
  })
  .strict();

module.exports = platformOsSchema;
