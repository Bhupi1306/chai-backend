import mongoose, {Schema} from "mongoose";  
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";


const videoSchema = new Schema(
    {
        videoFile: {
            type: String, //claudinary true
            required: true,
        },

        thumbnail: {
            type: String,
            required: true
        },
        
        title: {
            type: String,
            required: true
        },
        
        description: {
            type: String,
            required: true
        },
        
        description: {
            type: Number, // Extract from claudinary
            required: true
        },

        views: {
            type: Number,
            default: 0
        },

        isPublished: {
            type: Boolean,
            default: true
        },

        owner: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }

    },
    {timestamps: true})



// Mongoose allows us to use middlewares which includes some third party plugings. We can write aggregation queries with this plugin
videoSchema.plugin(mongooseAggregatePaginate)  

export const Video = mongoose.model("Video", videoSchema)