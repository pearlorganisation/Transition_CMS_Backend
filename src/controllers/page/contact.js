import { Contact } from "../../models/page/contact.js";
import ApiErrorResponse from "../../utils/errors/ApiErrorResponse.js";
import { asyncHandler } from "../../utils/errors/asyncHandler.js";

/** for cotact us page by manish */
export const createContact = asyncHandler(async(req,res, next)=>{
    const contactData = await Contact.create(req.body);

    if(!contactData){
        return next(new ApiErrorResponse("Failed to create the document", 401));
    }res.status(201).json({
        success:true,
        message:"Created Successfully",
        data: contactData
    })
})

export const getContacts = asyncHandler(async(req,res,next)=>{
    const contactData  = await Contact.find();
    if(!contactData){
        return next(new ApiErrorResponse("Failed to get the data", 404))
    }res.status(201).json({
        success: true,
        message:"Data is recieved",
        data: contactData
    })
})