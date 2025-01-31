import mongoose from "mongoose";

const investmentTimelineCardSchema = new mongoose.Schema(
  {
    icon: {
      asset_id: { type: String, required: true },
      secure_url: { type: String, required: true },
      public_id: { type: String, required: true },
    },
    title: { type: String, required: true },
    body: { type: String, required: true },
  },
  { timestamps: true }
);
const InvestmentTimelineCard = mongoose.model(
  "InvestmentTimelineCard",
  investmentTimelineCardSchema
);

export default InvestmentTimelineCard;
