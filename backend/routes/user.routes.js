import { Router } from "express";
import { verifyUser } from "../middlewares/VerifyUser.middleware.js";
import { deleteUser, getUser, getUserListings, updateUser } from "../controllers/user.controllers.js";

const router = Router();

router.use(verifyUser);

router.post('/update/:id', updateUser)
router.delete('/delete/:id', deleteUser)
router.get('/listings', getUserListings)
router.get('/:id', getUser)

export default router;