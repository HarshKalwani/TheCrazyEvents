import express from "express";
import { getProfile, getRSVPs, getUsersGroupsController, updateProfile } from "../../controllers/user.controller";
import multer from "multer";
import { authMiddleware } from "../../middlewares/authMiddleware";

const storage = multer.diskStorage({

})
const upload = multer({storage});
const router = express.Router();
router.use(authMiddleware);




router.get("/profile", getProfile);
router.get("/rsvps",getRSVPs);
router.patch("/profile",upload.single('profilePic'),updateProfile)
router.get("/groups",getUsersGroupsController)

export default router;

