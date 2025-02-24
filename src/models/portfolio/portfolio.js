import mongoose from "mongoose";

const PortfolioSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    image: {
      asset_id: { type: String, required: true },
      secure_url: { type: String, required: true },
      public_id: { type: String, required: true },
    },
    bg: {
      asset_id: { type: String, required: true },
      secure_url: { type: String, required: true },
      public_id: { type: String, required: true },
    },
    link: { type: String, required: false }, // Optional link for the logo
    investmentTimeline: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InvestmentTimeline",
      required: true,
    },
    overview: { type: String, required: true },
    mainDescription: { type: String, required: true },
    cards: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "PortfolioCard",
        },
        portfoliocardname: { type: String, required: true },
      },
    ],
    coInvestedBy: {
      type: [
        {
          _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CoInvestor",
          },
          coInvestorname: { type: String },
        },
      ],
      default: [],
    },

    bottomSectionIcon: {
      asset_id: { type: String, required: true },
      secure_url: { type: String, required: true },
      public_id: { type: String, required: true },
    },
    bottomSectionContent: { type: String, required: true },
  },
  { timestamps: true }
);

const Portfolio = mongoose.model("Portfolio", PortfolioSchema);

export default Portfolio;
