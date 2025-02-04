import mongoose from "mongoose";
import ApiErrorResponse from "../utils/errors/ApiErrorResponse.js";

const blogSchema = new mongoose.Schema({

    title:{
        type:String,
        required:[true,"Title Is Required Field"],
        trim:true
    },
    shortTitle:{
     type:String
    },
    dateMetaData:{
        type:String
    },
    link:{
        type:String,
        trim:true
    },
    blogType:{
        type:String,
        uppercase:true,
        trim:true,
        required:[true,"Blog Type Is Required Field"],
        enum:['ARTICLES','PRESS','PODCAST']
    },
    icon: {
        asset_id: { type: String, required: true },
        secure_url: { type: String, required: true },
        public_id: { type: String, required: true },
      },
    blogBody:{
        type:String,
    }


},{
    timestamps:true
});


blogSchema.pre('save', function (next) {
    if (this?.link && this?.blogBody) {
        return next(new ApiErrorResponse("Link and Blog Body Both Cannot Exist", 400));
    }
    else if (!this?.link && !this?.blogBody) {
        return next(new ApiErrorResponse("Provide any of one value Link and Blog  As it is required Field", 400));
    }

    
    
    next();
});


export const BlogModel = new mongoose.model('Blog',blogSchema);