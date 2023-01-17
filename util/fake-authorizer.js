const fakeAuthorizer = (req, _, next) => {
  req.userId = "63b8541f4944ae3126d99ebd"; // Replace with your User id
  next();
};

module.exports = fakeAuthorizer;