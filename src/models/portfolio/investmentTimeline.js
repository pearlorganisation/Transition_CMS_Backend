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
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "InvestmentTimelineCard",
        },
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
