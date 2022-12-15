const fakeAuthorizer = (req, res, next) => {
  req.userId = "638d560a1ae5ddd743624df8"; // Replace with your User id
  next();
};

module.exports = fakeAuthorizer;
