import mongoose from "mongoose";

const portfolioCardSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    icon: {
      asset_id: { type: String, required: true },
      secure_url: { type: String, required: true },
      public_id: { type: String, required: true },
    },
  },
  { timestamps: true }
);

const PortfolioCard = mongoose.model("PortfolioCard", portfolioCardSchema);

export default PortfolioCard;
