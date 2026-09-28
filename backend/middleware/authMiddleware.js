import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { AppError } from "../utils/errorHandler.js";

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("You are not authorized to access this route", 401)
    );
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (error) {
    return next(new AppError("Invalid or expired token", 401));
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return next(
      new AppError("You are not authorized to perform this action", 403)
    );
  }
};

export { protect, admin };
