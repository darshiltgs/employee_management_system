// define error handling fir asynchronous route handlers for avoid try/catch
const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  }
}

export default asyncHandler;