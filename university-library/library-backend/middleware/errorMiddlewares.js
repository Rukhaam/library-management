class ErrorHandler extends Error {
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  export const errorMiddleware = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";
  
    // 1. MySQL Duplicate Entry Error (Equivalent to Mongo 11000)
    if (err.code === 'ER_DUP_ENTRY') {
      const message = "Duplicate field value entered. This record already exists.";
      const statusCode = 400;
      err = new ErrorHandler(message, statusCode);
    }
  
    // 2. MySQL Foreign Key Constraint Error (Optional but helpful)
    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
      const message = "Invalid reference: The linked record (User or Book) does not exist.";
      const statusCode = 400;
      err = new ErrorHandler(message, statusCode);
    }
  
    // 3. Handle Invalid JWT error
    if (err.name === "JsonWebTokenError") {
      const message = "Json Web Token is invalid. Try again!";
      const statusCode = 400;
      err = new ErrorHandler(message, statusCode);
    }
  
    // 4. Handle JWT Token Expired error
    if (err.name === "TokenExpiredError") {
      const message = "Json Web Token is expired. Try again!";
      const statusCode = 400;
      err = new ErrorHandler(message, statusCode);
    }
  
    // Format error messages (handling potential validation arrays)
    const errorMessages = err.errors 
      ? Object.values(err.errors).map((e) => e.message).join(" ") 
      : err.message;
  
    return res.status(err.statusCode).json({
      success: false,
      message: errorMessages,
    });
  };
  
  export { ErrorHandler }; 