import mongoose from "mongoose";

const pageCardSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    icon: {
      asset_id: { type: String, required: true },
      secure_url: { type: String, required: true },
      public_id: { type: String, required: true },
    },
  },
  { timestamps: true }
);

const PageCard = mongoose.model("PageCard", pageCardSchema);

export default PageCard;
