import jwt from "jsonwebtoken";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";

export const verifyUser = AsyncHandler(async(req, res, next) => {
    const accessToken = req.cookies?.access_token;
    
    if(!accessToken) throw new ApiError(400, "unauthorized user");

    const verifiedUser = jwt.verify(accessToken, process.env.JWT_SECRET);

    if(!verifiedUser) throw new ApiError(400, "unauthorized user");

    const user = await User.findById(verifiedUser.id).select("-password");
    if(!user) throw new ApiError(400, "unauthorized user");

    req.user = user;
    next();
})