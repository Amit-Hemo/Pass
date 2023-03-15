const { ZodError } = require("zod");

function validateResource(validatorObj) {
  return async (req, res, next) => {
    try {
      const [body, params, query] = await Promise.all([
        validatorObj.body?.parseAsync(req.body),
        validatorObj.params?.parseAsync(req.params),
        validatorObj.query?.parseAsync(req.query),
      ])
      req.body = body ?? req.body
      req.params = params ?? req.params
      req.query = query ?? req.query
      next();
    } catch (error) {
      let statusCode = 500;
      if (error instanceof ZodError) {
        statusCode = 422;
      }
      res.status(statusCode).send(error);
    }
  };
}

module.exports = validateResource