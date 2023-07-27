import jwt from "jsonwebtoken";
import { createError } from "./error.js";
export const verifyToken = (req, res, next) => {
  const authHeader = req.header("Authorization");
  //console.log("check authHeader:", req);
  const token = authHeader && authHeader.split(" ")[1];
  //console.log(req.cookies);
  if (!token) {
    return next(createError(401, "You are not authenticated"));
  }
  jwt.verify(token, process.env.JWT, (err, user) => {
    if (err) {
      return next(createError(403, "Token is not valid"));
    }
    req.user = user;
    next();
  });
};
