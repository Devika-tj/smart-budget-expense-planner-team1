const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  const header = req.header("Authorization");
  const token = header ? header.split(" ")[1] : null;
  if (!token) return res.status(401).json({ msg: "No token provided" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
    req.user = {
      id: decoded.id || decoded.userId || decoded.id,
      role: decoded.role,
      email: decoded.email,
      userId: decoded.id || decoded.userId || decoded.id,
    };
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Invalid or expired token" });
  }
};

module.exports = {protect}

