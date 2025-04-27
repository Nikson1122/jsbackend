import { Router } from "express";
import { loginUser, logoutUser, registerUser,refreshAcessToken } from "../controllers/userController.js";// adjust the path as needed
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()


// router.route("/register").post(registerUser);

router.route("/register").post(
    upload.fields([
        {name: "avatar",
            maxCount: 1
            
        },
         {
            name: "coverImage",
            maxCount: 1
         }
    ]),
    registerUser)

router.route("/login").post(loginUser)

// secured routes
router.route("/logout").post(verifyJWT , logoutUser)
router.route("/refresh_token").post(refreshAcessToken) 

export default router;

