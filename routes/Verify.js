const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.headers.token;
  if (!token) {
    return res.status(403).send("token is not valid");
  }
  try {
    var decoded = jwt.verify(token, "hunny");
    if (decoded.user.id) next();
  } catch (error) {
    res.status(403).send(error);
  }
};
