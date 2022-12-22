const fakeAuthorizer = (req, _, next) => {
  req.userId = "63a480c0ab5d92f2e51844f0"; // Replace with your User id
  next();
};

module.exports = fakeAuthorizer;