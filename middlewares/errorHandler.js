const { StatusCodes } = require("http-status-codes");
const CustomError = require("./customErrorClass");

const notFound = (req, res, next) => {
  res.render("404", {title: "404"});
};

const errorHandler = (error, req, res, next) => {
  if (error instanceof CustomError) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: error.message, status: error.statusCode });
  }
  res.statusCode(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
};

module.exports = {
  notFound,
  errorHandler,
};
