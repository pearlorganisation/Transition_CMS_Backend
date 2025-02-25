import mongoose from "mongoose";
import ApiErrorResponse from "../utils/errors/ApiErrorResponse.js";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title Is Required Field"],
      trim: true,
    },
    shortTitle: {
      type: String,
    },
    dateMetaData: {
      type: String,
      validate: {
        validator: function () {
          if (this?.blogType == "PODCAST")
            if (this?.dateMetaData) return false;
            else return true;
        },
        message: "In Podcast,DateMetaData Should Not Be Provided",
      },
      trim: true,
    },
    link: {
      type: String,
      trim: true,
    },
    blogType: {
      type: String,
      uppercase: true,
      trim: true,
      validate: {
        validator: function () {
          return !(this?.blogType == "PODCAST" && this?.blogBody);
        },
        message: "In Podcast, only a link should be provided.",
      },
      required: [true, "Blog Type Is Required Field"],
      enum: ["ARTICLES", "PRESS", "PODCAST"],
    },
    icon: {
      asset_id: { type: String, required: true },
      secure_url: { type: String, required: true },
      public_id: { type: String, required: true },
    },
    blogBody: {
      type: String,
    },
    order: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

blogSchema.pre("save", function (next) {
  if (this?.link && this?.blogBody) {
    return next(
      new ApiErrorResponse("Link and Blog Body Both Cannot Exist", 400)
    );
  } else if (!this?.link && !this?.blogBody) {
    return next(
      new ApiErrorResponse(
        "Provide any of one value Link and Blog  As it is required Field",
        400
      )
    );
  }

  next();
});

export const BlogModel = new mongoose.model("Blog", blogSchema);
