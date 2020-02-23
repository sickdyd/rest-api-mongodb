// This is not required anymore since express-async-errors will catch errors
module.exports = function(handler) {
  return async (req, res, next) => {
    try { 
      await handler(req, res);
    }
    catch (ex) {
      next(ex);
    }
  };
}