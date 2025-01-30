import mongoose from "mongoose";

const PortfolioSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    // banner: {
    //   asset_id: { type: String, required: true },
    //   secure_url: { type: String, required: true },
    //   public_id: { type: String, required: true },
    // },
    logo: {
      asset_id: { type: String, required: true },
      secure_url: { type: String, required: true },
      public_id: { type: String, required: true },
    },
    logoLink: { type: String, required: false }, // Optional link for the logo
    // investmentTimeline: {
    //   description: { type: String, required: true },
    //   cards: [
    //     {
    //       icon: {
    //         asset_id: { type: String, required: true },
    //         secure_url: { type: String, required: true },
    //         public_id: { type: String, required: true },
    //       },
    //       title: { type: String, required: true },
    //       body: { type: String, required: true },
    //     },
    //   ],
    // },
    investmentYear: { type: Number, required: true }, // e.g., 2024
    overview: { type: String, required: true },
    mainDescription: { type: String, required: true },
    cards: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
        icon: {
          asset_id: { type: String, required: true },
          secure_url: { type: String, required: true },
          public_id: { type: String, required: true },
        },
      },
    ],
    bottomSection: {
      icon: {
        asset_id: { type: String, required: true },
        secure_url: { type: String, required: true },
        public_id: { type: String, required: true },
      },
      content: { type: String, required: true },
    },
    coInvestedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "CoInvestor" }],
  },
  { timestamps: true }
);

const Portfolio = mongoose.model("Portfolio", PortfolioSchema);

export default Portfolio;
