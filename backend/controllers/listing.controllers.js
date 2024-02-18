import { Listing } from "../models/listing.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";

export const createListing = AsyncHandler(async (req, res) => {
    const {name, description, address, regularPrice} = req.body;

    if(!name || !description || !address || !regularPrice) throw new ApiError(400, "Necessary details needs to be filled");

    const userId = req.user._id;

    if(!userId) throw new ApiError(400, "unauthenticated user")

    const listing = await Listing.create({
        ...req.body,
        userRef: userId
    })

    if(!listing) throw new ApiError(500, "Error occured while creating the listing")

    res
    .status(200)
    .json(
        new ApiResponse(200, "Successfully created listings", listing)
    )

})

export const deleteListing = AsyncHandler(async (req, res) => {
    const listingId = req.params.id;
    if(!listingId) throw new ApiError(400, "listing Id not provided")

    const listing = await Listing.findById(listingId)
    if(!listing) throw new ApiError(404, "Listing Id is invalid")

    if(!req.user._id.equals(listing.userRef)) throw new ApiError(400, "Unauthorised request")

    const deleteListing = await Listing.findByIdAndDelete(listingId);
    if(!deleteListing) throw new ApiError(500, "Unable to delete listing")

    res
    .status(200)
    .json(
        new ApiResponse(200, "Successfully deleted listing", deleteListing)
    )

})

export const updateListing = AsyncHandler(async (req, res) => {
    const listingId = req.params.id;
    if(!listingId) throw new ApiError(400, "listingId not provided")

    const listing = await Listing.findById(listingId);
    if(!listing) throw new ApiError(400, "Invalid listing id")

    if(!req.user._id.equals(listing.userRef)) throw new ApiError(400, "Unauthorised request")

    const updatedListing = await Listing.findByIdAndUpdate(
        listingId,
        {
            $set: {
                ...req.body
            }
        },
        {new: true}
    )

    if(!updatedListing) throw new ApiError(200, "Unable to update listing")

    res
    .status(200)
    .json(
        new ApiResponse(200, "Listing updated successfully updated", updatedListing)
    )

})

export const getListingById = AsyncHandler(async (req, res) => {
    const listingId = req.params.id;

    if(!listingId) throw new ApiError(400, "ListingId not provided")
    const listing = await findById(listingId)

    if(!listing) throw new ApiError(400, "Invalid listingId")

    res
    .status(200)
    .json(
        new ApiResponse(200, "Listing found", listing)
    )
})

export const getListings = AsyncHandler(async (req, res, next) => {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    let offer = req.query.offer;

    if (offer === undefined || offer === 'false') {
    offer = { $in: [false, true] };
    }

    let furnished = req.query.furnished;

    if (furnished === undefined || furnished === 'false') {
    furnished = { $in: [false, true] };
    }

    let parking = req.query.parking;

    if (parking === undefined || parking === 'false') {
    parking = { $in: [false, true] };
    }

    let type = req.query.type;

    if (type === undefined || type === 'all') {
    type = { $in: ['sale', 'rent'] };
    }

    const searchTerm = req.query.searchTerm || '';

    const sort = req.query.sort || 'createdAt';

    const order = req.query.order || 'desc';

    const listings = await Listing.find({
    name: { $regex: searchTerm, $options: 'i' },
    offer,
    furnished,
    parking,
    type,
    })
    .sort({ [sort]: order })
    .limit(limit)
    .skip(startIndex);

    return res.status(200).json(listings);
})