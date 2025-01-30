import mongoose from "mongoose";

const investmentTimelineSchema = new mongoose.Schema(
  {
    description: { type: String, required: true },
    banner: {
      asset_id: { type: String, required: true },
      secure_url: { type: String, required: true },
      public_id: { type: String, required: true },
    },
    cards: [
      {
        icon: {
          asset_id: { type: String, required: true },
          secure_url: { type: String, required: true },
          public_id: { type: String, required: true },
        },
        title: { type: String, required: true },
        body: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

const InvestmentTimeline = mongoose.model(
  "InvestmentTimeline",
  investmentTimelineSchema
);

export default InvestmentTimeline;
