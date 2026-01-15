/**
 * Handler to catch `async` operation errors.
 * Reduces having to write `try-catch` all the time.
 */
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

export default catchAsync;
