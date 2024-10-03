// define error handling fir asynchronous route handlers for avoid try/catch
const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => {
      res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'something went wrong',
      });
    });
  }
}

export default asyncHandler;