import mongoose from "mongoose";

const coInvestorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    logo: {
      asset_id: { type: String, required: true },
      secure_url: { type: String, required: true },
      public_id: { type: String, required: true },
    },
  },
  { timestamps: true }
);

const CoInvestor = mongoose.model("CoInvestor", coInvestorSchema);

export default CoInvestor;
