import mongoose from "mongoose";

const teamDetailsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    image: {
      asset_id: { type: String, required: true },
      secure_url: { type: String, required: true },
      public_id: { type: String, required: true },
    },

    description: { type: String, required: true },
  },
  { timestamps: true }
);

const TeamDetails = mongoose.model("TeamDetails", teamDetailsSchema);

export default TeamDetails;
