import { Listing } from "../models/listing.models.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";

export const updateUser = AsyncHandler(async (req, res) => {
    const { username, email, password, avatar } = req.body;

    if(!req.user._id.equals(req.params.id)) throw new ApiError(400, 'unauthorized access');

    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                username,
                email,
                password,
                avatar
            },
        },
        {new: true}
    ).select('-password')

    if(!updatedUser) throw new ApiError(500, "Unable to update user details");

    res
    .status(200)
    .json(
        new ApiResponse(200, "Updated user details successfully", updatedUser)
    )
})

export const deleteUser = AsyncHandler(async (req, res) => {
    if(!req.user._id.equals(req.params.id)) throw new ApiError(400, "Unauthorised user");

    const deletedUser = await User.findByIdAndDelete(req.user._id);

    if(!deletedUser) throw new ApiError(500, "Problems in deleting user");

    res
    .status(200)
    .clearCookie('access_token')
    .json(
        new ApiResponse(200, "User Successfully Deleted", deletedUser)
    )
})

export const getUserListings = AsyncHandler(async (req, res) => {
    const userId = req.user._id;
    if(!userId) throw new ApiError(400, "Unauthorised user")

    const userListings = await Listing.find({
        userRef: userId
    })

    if(userListings.length < 0) throw new ApiError(404, "no listings foound")

    res
    .status(200)
    .json(
        new ApiResponse(200, "listings found successfully", userListings)
    )
})

export const getUser = AsyncHandler(async (req, res) => {
    const userId = req.params.id;
    if(!userId) throw new ApiError(400, "User Id not provideded");

    const user = await User.findById(userId).select('-password');

    if(!user) throw new ApiError(404, "User not found");

    res
    .status(200)
    .json(
        new ApiResponse(200, "User found successfully", user)
    )
})