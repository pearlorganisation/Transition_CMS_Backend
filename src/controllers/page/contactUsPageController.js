import ContactUsPage from "../../models/page/contactUsPage.js";
import { uploadFileToCloudinary } from "../../utils/cloudinaryConfig.js";
import ApiErrorResponse from "../../utils/errors/ApiErrorResponse.js";
import { asyncHandler } from "../../utils/errors/asyncHandler.js";

export const createContactUsPage = asyncHandler(async (req, res) => {
  const { contactIcon } = req.files;
  const uploadedContactIcon = contactIcon
    ? await uploadFileToCloudinary(contactIcon)
    : null;

  const contactUsPage = await ContactUsPage.create({
    ...req.body,
    contactIcon: uploadedContactIcon ? uploadedContactIcon[0] : null,
  });

  if (!contactUsPage) {
    return next(new ApiErrorResponse("Contact Us page creation failed", 400));
  }
  res.status(201).json({
    success: true,
    message: "Contact Us Page created successfully",
    data: contactUsPage,
  });
});

export const getContactUsPage = asyncHandler(async (req, res) => {
  const contactUsPage = await ContactUsPage.find(); // Find all contact us pages

  if (!contactUsPage) {
    return next(new ApiErrorResponse("No data is found", 404));
  }
  res.status(200).json({
    success: true,
    message: "Contact Us Page found successfully",
    data: contactUsPage,
  });
});
