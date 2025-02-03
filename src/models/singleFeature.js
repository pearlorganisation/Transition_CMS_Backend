import mongoose from "mongoose";

const singleFeatureSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    features: [{ type: String, required: true }],
    image: {
      asset_id: { type: String, required: true },
      secure_url: { type: String, required: true },
      public_id: { type: String, required: true },
    },
  },
  { timestamps: true }
);

const SingleFeature = mongoose.model("SingleFeature", singleFeatureSchema);

export default SingleFeature;
