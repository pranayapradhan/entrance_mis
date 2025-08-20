const bodyValidator = (schema) => {
  return async (req, res, next) => {
    try {
      const data = req.body;
      if (!data) {
        next({
          code: 422,
          message: "Empty payload...",
          status: "UNPROCESSABLE_ENTITY",
        });
      }
      let response = await schema.validateAsync(data, { abortEarly: false });
      // console.log(response)

      next();
    } catch (exception) {
      // console.log(exception)

      let messageBag = {};

      exception.details.map((error) => {
        // console.log(error)
        let key = error.path.pop();
        messageBag[key] = error.message;
      });

      next({
        code: 400,
        detail: messageBag,
        message: "Validation Error",
        status: "VALIDATION_ERR",
      });
    }
  };
};

export default bodyValidator
