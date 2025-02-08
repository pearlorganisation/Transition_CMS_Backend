import mongoose from "mongoose";
import ApiErrorResponse from "../utils/errors/ApiErrorResponse.js";


const impactSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title Is Required Field"],
      trim: true,
    },
    shortDescription: {
      type: String,
      validate: {
        validator: function () {
          return this?.impactDataType == "POLICIES" && this?.shortDescription;
        },
        message: "In Policies, Short Description  should be provided.",
      },
    },
    impactDataType: {
        type: String,
        uppercase: true,
        trim: true,
        validate: {
          validator: function () {
            if (this?.impactDataType == "POLICIES") {
              return Boolean(this?.icon && this?.shortDescription);
            }
            return true; // Other values are valid without `icon` and `shortDescription`
          },
          message: "For POLICIES, both 'icon' and 'shortDescription' are required.",
        },
        required: [true, "Impact DataType is a required field"],
        enum: ["MISSION", "SDGS", "ESGS", "POLICIES"],
      },
    icon: {
      type: {},
    },
  },
  {
    timestamps: true,
  }
);

impactSchema.pre("save", async function (next) {
    if (this.impactDataType != "POLICIES") {
      const existing = await this.constructor.findOne({ impactDataType: this.impactDataType });
      if (existing) {
        return next(new ApiErrorResponse(`${this.impactDataType} already exists!`,400));
      }
    }
    next();
  });

export const ImpactModel = new mongoose.model("ImpactData", impactSchema);
