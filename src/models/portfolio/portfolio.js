import mongoose from "mongoose";

const PortfolioSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    logo: {
      asset_id: { type: String, required: true },
      secure_url: { type: String, required: true },
      public_id: { type: String, required: true },
    },
    link: { type: String, required: false }, // Optional link for the logo
    investmentTimeline: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InvestmentTimeline",
    },
    investmentYear: { type: Number, required: true }, // e.g., 2024
    overview: { type: String, required: true },
    mainDescription: { type: String, required: true },
    cards: [{ type: mongoose.Schema.Types.ObjectId, ref: "PortfolioCard" }],
    bottomSectionIcon: {
      asset_id: { type: String, required: true },
      secure_url: { type: String, required: true },
      public_id: { type: String, required: true },
    },
    bottomSectionContent: { type: String, required: true },
    coInvestedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "CoInvestor" }],
  },
  { timestamps: true }
);

const Portfolio = mongoose.model("Portfolio", PortfolioSchema);

export default Portfolio;
