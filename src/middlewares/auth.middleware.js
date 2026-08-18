import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const authenticate = asyncHandler(async (req, _res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    throw new ApiError(401, "Unauthorized: No token provided");
  }
  try{
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;
    next();
  }
  catch(err){
    throw new ApiError(401, err.name === "TokenExpiredError" ? "Token expired. Please log in again." : "Token invalid. Please log in again.");
  }
});