import mongoose from "mongoose";

const investmentTimelineSchema = new mongoose.Schema(
  {
    description: { type: String, required: true },
    investmentYear: { type: Number, required: true },
    image: {
      asset_id: { type: String, required: true },
      secure_url: { type: String, required: true },
      public_id: { type: String, required: true },
    },
    cards: [
      { type: mongoose.Schema.Types.ObjectId, ref: "InvestmentTimelineCard" },
    ],
  },
  { timestamps: true }
);

const InvestmentTimeline = mongoose.model(
  "InvestmentTimeline",
  investmentTimelineSchema
);

export default InvestmentTimeline;
