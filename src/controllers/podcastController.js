import Podcast from "../models/podcast.js";
import { uploadFileToCloudinary } from "../utils/cloudinaryConfig.js";
import ApiErrorResponse from "../utils/errors/ApiErrorResponse.js";
import { asyncHandler } from "../utils/errors/asyncHandler.js";


export const createPodcast = asyncHandler(async(req,res,next)=>{
    const { image } = req.files
    let uploadedImage
    if(image){
        uploadedImage = await uploadFileToCloudinary(image)
    };

    const podcastData = await Podcast.create({
        ...req.body,
        image: uploadedImage[0]
    })
    if(!podcastData){
        return next(new ApiErrorResponse("Failed to create the podcast", 400))
    }res.status(201).json({
        success:true,
        message:"Podcast created successfully",
        data:podcastData
    })
})

export const getAllPodcasts = asyncHandler(async(req,res,next)=>{
    const data = await Podcast.find()
    if(!data){
        return next(new ApiErrorResponse("No data available",404))
    }res.status(201).json({
        success:true,
        message:"Podcasts found successfully",
        data:data          
    })
})