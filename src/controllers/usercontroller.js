import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User} from "../models/user.model.js"; // make sure 'user' is exported as lowercase
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
    res.status(200).json({message:"ok"})
    // const { fullname, email, username, password } = req.body;
    // console.log("email:", email);

    // Validation
    if (!fullname || !email || !username || !password) {
        throw new ApiError(400, "All fields are required");
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

export { registerUser };



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