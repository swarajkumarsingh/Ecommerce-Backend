const fakeAuthorizer = (req, _, next) => {
  req.userId = "640a18e5fc030e598576e46e"; // Replace with your User id
  next();
};

module.exports = fakeAuthorizer;