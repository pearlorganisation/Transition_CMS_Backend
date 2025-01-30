import Article from "../models/article.js";
import { uploadFileToCloudinary } from "../utils/cloudinaryConfig.js";
import ApiErrorResponse from "../utils/errors/ApiErrorResponse.js";
import { asyncHandler } from "../utils/errors/asyncHandler.js";


export const createArticle = asyncHandler(async(req, res,next)=>{
    const  { image } = req.files;
    console.log("the requested body is ", req.body)
    const uploadedImage = image ? await uploadFileToCloudinary(image) : null;
    const articleToCreate = await Article.create({
        ...req.body,
        image:uploadedImage[0]
    });

    if(!articleToCreate){
        return next(new ApiErrorResponse("Failed yo create a Article", 400))
    }
    return res.status(201).json({
        success: true,
        message:"Article created successfully",
        data: articleToCreate
    });
})
/** to get all the articles */
export const getAllArticles = asyncHandler(async (req, res, next) => {
    const articledata = await Article.find()

    if(!articledata){
        return next(new ApiErrorResponse("No data is found",404))
    }
    return res.status(201).json({
        success:true,
        message:"Data found",
        data: articledata
    })
})