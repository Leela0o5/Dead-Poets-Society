import pkg from "jsonwebtoken";
const { verify } = pkg;

const verifyToken = (req, res, next) => {
  // Check for Session
  if (req.session && req.session.user) {
    req.user = req.session.user; // Attach session user to req.user
    return next();
  }

  //  If no session, Check for JWT
  const authHeader = req.headers["authorization"];
  if (authHeader && authHeader.startsWith("Bearer")) {
    try {
      const token = authHeader.split(" ")[1];
      const decoded = verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      return next();
    } catch (error) {
      // If token exists but is invalid, we continue to the 401 response
    }
  }

  // Fail if neither exists
  return res.status(401).json({ message: "Not authorized, please login" });
};

export default verifyToken;
