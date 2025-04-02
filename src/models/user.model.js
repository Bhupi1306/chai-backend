import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true // Make searching faster
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    fullname: {
        type: String,
        required: true,
        index: true, 
        trim: true
    },

    avatar: {
        type: String, //Use claudinary service
        required: true
    },

    coverImage: {
        type: String //Use claudinary service
    },

    watchHistory: [
        {
            type: Schema.Types.ObjectId,
            ref: "Video"
        }
    ],

    password: {
        type: String,
        required: [true, "Password is required"] 
    },

    refreshToken: {
        type: String
    }
}, 
{timestamps: true})


// We don't use arrow function as callback here because it does not have context. And context is IMPORTAAANNNTTT here.encryption takes time so written in async.middleware next is imp
userSchema.pre("save", async function(next){

    // Says if password is not modified , just go to next function 
    if(!this.isModified("password")) return next() // This avoids modification of password everytime user changes any field. 

    this.password = bcrypt.hash(this.password, 10)
    next()
}) 

// To add custom methods in mongoose
userSchema.methods.isPasswordCorrect = async function(password){
    // To check password returns boolean
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            // Payload (data)
            _id: this._id,
            email: this.email,
            username: this.username,
            fullname: this.fullname

        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,

        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema)