import { Router } from 'express';
import { verifyUser } from '../middlewares/VerifyUser.middleware.js';
import { createListing, deleteListing, getListingById, getListings, updateListing } from '../controllers/listing.controllers.js';

const router = Router();

router.post('/create', verifyUser, createListing);
router.delete('/delete/:id', verifyUser, deleteListing);
router.post('/update/:id', verifyUser, updateListing);
router.get('/get/:id', getListingById);
router.get('/get', getListings);

export default router;