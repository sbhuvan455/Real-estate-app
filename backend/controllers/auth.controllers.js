import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import jwt from "jsonwebtoken"


export const signup = AsyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    if(!username || !email || !password) throw new ApiError(400, "All the feilds are required for signup");

    const presentUser = await User.findOne({
        $or: [{username}, {email}]
    });

    if(presentUser) throw new ApiError(400, "User already exists");

    const newUser = await User.create({
        username,
        email,
        password
    })

    if(!newUser) throw new ApiError(500, "Unable to create user");

    res
    .status(200)
    .json(
        new ApiResponse(200, "User Reagistered successfully", newUser)
    )
})

export const signin = AsyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if(!email) throw new ApiError(400, "Email is required")

    const user = await User.findOne({email})
    if(!user) throw new ApiError(400, "Invalid email address")

    const verifiedUser = await user.isPasswordCorrect(password);
    if(!verifiedUser) throw new ApiError(400, "Invalid password")

    const token = jwt.sign(
        {
            id: user._id
        },
        process.env.JWT_SECRET
    )

    if(!token) throw new ApiError(500, "Error while creating token")

    const options = {
        httpOnly: true,
        secure: true
    }

    res
    .status(200)
    .cookie('access_token', token, options)
    .json(
        new ApiResponse(200, "successfully logged in", user)
    )

})

export const signout = AsyncHandler((req, res) => {

    const user = req.user;
    if(user) throw new ApiError(400, "User not Authorized");

    res
    .clearCookie('access_token')
    .status(200)
    .json(
        new ApiResponse(200, "successfully logged out", user)
    )
})