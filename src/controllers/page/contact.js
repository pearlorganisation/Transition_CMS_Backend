import { Contact } from "../../models/page/contact.js";
import ApiErrorResponse from "../../utils/errors/ApiErrorResponse.js";
import { asyncHandler } from "../../utils/errors/asyncHandler.js";

/** for cotact us page by manish */
export const createContact = asyncHandler(async (req, res, next) => {
  const contactData = await Contact.create(req.body);

  if (!contactData) {
    return next(new ApiErrorResponse("Failed to create the document", 401));
  }
  res.status(201).json({
    success: true,
    message: "Created Successfully",
    data: contactData,
  });
});

export const getContacts = asyncHandler(async (req, res, next) => {
  const contactData = await Contact.find();
  if (!contactData) {
    return next(new ApiErrorResponse("Failed to get the data", 404));
  }
  res.status(200).json({
    success: true,
    message: "Data is recieved",
    data: contactData,
  });
});

export const updateContactById = asyncHandler(async (req, res, next) => {
  const contactData = await Contact.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!contactData) {
    return next(
      new ApiErrorResponse(
        "Failed to update the data or contact not found",
        404
      )
    );
  }
  res.status(200).json({
    success: true,
    message: "Contact data is updated successfully",
    data: contactData,
  });
});

export const deleteContactById = asyncHandler(async (req, res, next) => {
  const contactData = await Contact.findByIdAndDelete(req.params.id);
  if (!contactData) {
    return next(
      new ApiErrorResponse(
        "Failed to delete the data or contact not found",
        404
      )
    );
  }

  res.status(200).json({
    success: true,
    message: "Contact data is deleted successfully",
  });
});
