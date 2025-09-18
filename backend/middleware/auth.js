import jwt from "jsonwebtoken";

export function auth(req, res, next) {
  const token = req.cookies[process.env.COOKIE_NAME || "token"];
  if (!token) return res.status(401).json({ message: "Auth required" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}
