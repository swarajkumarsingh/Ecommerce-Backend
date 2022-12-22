const fakeAuthorizer = (req, res, next) => {
  req.userId = "63a44cf96b27f75282010e6a"; // Replace with your User id
  next();
};

module.exports = fakeAuthorizer;