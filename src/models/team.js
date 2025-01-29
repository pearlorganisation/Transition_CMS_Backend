import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: {
      asset_id: { type: String, required: true },
      secure_url: { type: String, required: true },
      public_id: { type: String, required: true },
    },

    bio: { type: String, required: true },
    link: { type: String, required: true },
    type: { type: String, required: true },
  },
  { timestamps: true }
);

const Team = mongoose.model("Team", teamSchema);

export default Team;
