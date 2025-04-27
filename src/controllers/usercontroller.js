import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User} from "../models/user.model.js"; // make sure 'user' is exported as lowercase
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const generateAcessAndRefreshTokens = async(userId) =>{
    try {
    const user = await User.findById(userId)
    const acessToken = user.generateAccessToken()
    const refereshToken = user.generateRefreshToken ()


    user.refereshToken = refereshToken
    await user.save({validateBeforeSave: false})

    
    return(acessToken, refereshToken)

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating acess and refresh tokens")
    }
}

const registerUser = asyncHandler(async (req, res) => {
    // res.status(200).json({message:"ok"}) This is used to check small data if the data are going to postman or not through api
    const { fullname, email, username, password } = req.body;
    console.log("email:", email);

    // Validation
    if (
     [fullname, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    // Check if user already exists
    const existedUser = await User.findOne({
        $or: [{ username }, { email }],
    });

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists");
    }

    // Get uploaded file paths
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    console.log("FILES RECEIVED:", req.files);

    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required");
    }

    // Upload to Cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if (!avatar) {
        throw new ApiError(500, "Failed to upload avatar to cloud");
    }

    // Create User
    const newUser = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase(),
    });

    const createdUser = await User.findById(newUser._id).select(
        "-password -refreshToken"
    );

    if (!createdUser) {
        throw new ApiError(500, "User creation failed");
    }

    return res
        .status(201)
        .json(new ApiResponse(200, createdUser, "User registered successfully"));
});

    const loginUser =asyncHandler(async(req,res) => {
        // req body -> data
        // username or email
        // find the USer
        //password check 
        //acess and refresh token 
        // send cookie

        const {email, username, password} =req.body

        if (!username && ! email){
            throw new ApiError(400, "Username or email is required")
        }

        const user = await User.findOne({
            $or: [{username}, {email}]
        })
    if (!user) {
        throw new ApiError(404, "User does not exist")
    }

    
const isPasswordValid = await user.isPasswordCorrect(password)
if (!isPasswordValid) {
    throw new ApiError(401, "password is incorrect")
   
}
    const {acessToken, refereshToken} = await generateAcessAndRefreshTokens(user._id).
    select("-password -refereshToken")

    const options = {
        httpOnly: true,
        secure: true,

    }
    return res
    .status(200)
    .cookie("acessToken",acessToken, options)
    .cookie("refereshToken", refereshToken, options)
    .json(
        new ApiResponse(
            200,
        {
            user: loggedInUser, acessToken , 
            refereshToken
        }),
        "user logged In Sucessfully"
    )

})

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user_id,
        {
            $set:{
                refereshToken: undefined
            }
        },
        {
            new: true
        }

        )

        const options = {
            httpOnly: true,
            secure: true,
    
        }

        return res
        .status(200)
        .clearCookie("acessToken", options)
        .clearCookie("refereshToken", options)
        .json(
            new ApiResponse(200, {}, "User logged out successfully")
        )



        

})

const refreshAcessToken = asyncHandler(async(req, res) =>{
    const incomingRefreshToken = req.cookies.
    refereshToken || req.body.refreshAcessToken

    if (incomingRefreshToken){
        throw new ApiError(400, "Unauthorized acess")
    } 
   try {
     const decodedToken = jwt.verify(
         incomingRefreshToken,
         process.env.REFERSH_TOKEN_SECRET
     )
 
     const user = await User.findById(decodedToken?._id)
 
     if (!user){
         throw new ApiError(401, "Invalid referesh token")
     } 
     if (incomingRefreshToken !== user.refreshtoken) {
         throw new ApiError(401, "referesh token is expired")
     }
 
     const options = {
         httpOnly: true,
         secure: true,
     }
 
     const {acessToken, newrefereshToken} = await generateAcessAndRefreshTokens(user._id)
 
     return res
         .status(200)
         .cookie("acessToken", acessToken, options)
         .cookie("refereshToken", newrefereshToken, options)
         .json(
             new ApiResponse(200, { acessToken, newrefereshToken }, " acess token refreshed sucessfully")
         )
   } catch (error) {
        throw new ApiError(4011, error?.message || "Invalid refresh token")
    
   }
})



export { registerUser,
         loginUser,
         logoutUser,
         refreshAcessToken
};




// import { asyncHandler } from "../utils/asyncHandler";
// import {ApiError} from "../utils/ApiError.js";
// import {user} from "../models/user.model.js";
// import { uploadOnCloudinary } from "../utils/cloudinary.js";
// import { ApiResponse } from "../utils/ApiResponse.js";

// const registerUser = asyncHandler( async(req , res ) =>{
    
//     //get user details from frontend
//     // validation -not empty 
//     // check if user already exists: username, email
//     // check for images, check for avatar
//     //upoad them to cloudinary, avatar
//     // create user objet - create entry in db
//     //remove password and refresh token field from response
//     // check for user creation
//     // return response

//     const {fullname, email, username, password} = req.body
//     console.log("email:", email);

//     if(fullname === ""){
//         throw new ApiError(400, "fullname is required")
//     }
// })

// const existeduser = await User.findOne({
//     $or: [{username},  {email}]
// })

// if (existedUser){
//     throw new ApiError(409, "User with email or username already exists")
// }

// const avatarLocalPath = req.files?.avatar[0]?.path;
// const CoverImagePath = req.files?.coverImage[0]?.path;

// if(!avataLocalPath) {
//     throw new ApiError(400, "Avatar is required")
// }

// const avatar = await uploadOnCloudinary(avatarLocalPath)
// const covetImage = await uploadOnCloudinary(coverImageLocalPath)

// if(!avatar){
//     throw new ApiError(500, "Avatar file is required")
// }

// const user = await User.create({
//     fullname,
//     avatar: avatar.url,
//     coverImage:coverImage?.url|| "",
//     email,
//     password,
//     username: username.toLoserCase(),

// })

// const createdUser = await User.findById(user._id).select(
//     "-password -refereshToken"
// )
// if (!createdUser){
//     throw new ApiError(500, "User creation failed")
// }

// return res.status(201).json(
//     new ApiResponse(200, createdUser, "User registerd Sucessfully")
// )

// export {registerUser}