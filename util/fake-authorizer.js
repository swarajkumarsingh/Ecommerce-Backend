const fakeAuthorizer = (req, _, next) => {
  req.userId = "63a481258ad6685ae44f92af"; // Replace with your User id
  next();
};

module.exports = fakeAuthorizer;