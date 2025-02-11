import mongoose from "mongoose";

const PageSchema = new mongoose.Schema(
  {
    pageName: {
      type: String,
      required: true,
      enum: ["HOME", "PORTFOLIO", "TEAM", "IMPACT", "INSIGHTS", "CONTACT_US"], // Ensures only these values are accepted
      unique: true, // Ensures no duplicate page names
    },
    mainTitle: {
      type: String,
      required: true,
    },
    body: [
      {
        type: String,
        required: true,
      },
    ],
    cards: [{ title: String, body: String, icon: String }],
  },
  { timestamps: true }
);

const Page = mongoose.model("Page", PageSchema);

export default Page;
