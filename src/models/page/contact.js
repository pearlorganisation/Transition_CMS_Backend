import mongoose from "mongoose";

const contact = new mongoose.Schema(
  {
    mainTitle: { type: String, required: true },
    fieldArr: [
      {
        title: { type: String, required: true },
        buttonText: { type: String, required: true },
        type: {
          type: String,
          enum: ["FORM", "LINK", "MAIL"],
        },
        value: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Contact = mongoose.model("Contact", contact);
