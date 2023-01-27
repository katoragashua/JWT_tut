const asyncWrapper = (controller) => {
  return async (req, res, next) => {
    try {
      controller(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};
