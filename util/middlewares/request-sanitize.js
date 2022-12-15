module.exports.paginateParams = () => {
  return (req, _, next) => {
    if (req && req.query) {
      const page = req.query.page;
      const limit = req.query.limit;
      if (page && typeof page === "string") {
        req.query.page = parseInt(page);
      }
      if (limit && typeof limit === "string") {
        req.query.limit = Math.min(parseInt(limit), 30); // Max limit for page size
      }
    }
    next();
  };
};