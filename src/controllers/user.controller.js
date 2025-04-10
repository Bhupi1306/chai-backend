import { asyncHandler } from "../utils/asyncHandler.js";
import {apiError} from "../utils/apiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { apiResponse } from "../utils/apiResponse.js";

const registerUser = asyncHandler( async (req,res) => {
    
    // get user detail from frontend
    //validation - not empty
    //check if user already exist: username/email
    //check for images, check for avatar
    //upload them to cloudinary, avatar
    //create user object: create entry in db
    //remove password and refresh token field from response
    //check for user creation
    //return res


    const {fullName, email, username, password} = req.body
    console.log("email: ",email)

    // if(fullName === ""){
    //     throw new ApiError(400, "Fullname is required")
    // }

    //More advance way to write the same code is 

    if(
        [fullName,email,username,password].some((field) => field?.trim() === "")
    ){
        throw new apiError(400, "All fields are required")
    }


    // This method find the object passed in data base and returns boolean
    // $ helps to use operators Without it code will be User.findOne({email})
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if(existedUser) {
        throw new apiError(409, "user with email or username already exists")
    }

    // Multer gives access to req.files
    //Req.files optionally then ask for .avatar first field then optionally ask for path at which file is stored in local server
    const avatarLocalPath = req.files?.avatar[0]?.path
    // const coverImageLocalPath = req.files?.coverImage[0]?.path

    let coverImageLocalPath;

    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage[0].length > 0) 
    {
        coverImageLocalPath = req.files?.coverImage[0]?.pa
    }


    if(!avatarLocalPath) {
        throw new apiError(400, "Avatar file is required while submitting the form")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new apiError(400, "Avatar file is required in local path")
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new apiError(500, "Something went wrong while registering a user")
    }

    return res.status(201).json(
        new apiResponse(200,createdUser, "User was successfully registered")
    )
} )

export {registerUser}