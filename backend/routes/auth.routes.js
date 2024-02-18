import { Router } from "express"; 
import { signin, signout, signup } from "../controllers/auth.controllers.js";
import { verifyUser } from "../middlewares/VerifyUser.middleware.js";


const router = Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.get('/signout', verifyUser, signout)

export default router;