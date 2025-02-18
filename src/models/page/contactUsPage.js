import mongoose from "mongoose";

const contactUsPageSchema = new mongoose.Schema(
  {
    mainTitle: { type: String, required: true },
    contactIcon: {
      asset_id: { type: String, required: true },
      secure_url: { type: String, required: true },
      public_id: { type: String, required: true },
    },
    card: {
      heading: { type: String, required: true },
      description: { type: String, required: true },
      buttonText: { type: String, required: true },
    },
    sections: [
      {
        heading: { type: String, required: true },
        body: [
          {
            text: { type: String, required: true },
            highLightedText: { type: String, required: true },
            form: {
              type: String,
              enum: ["FORM_1", "FORM_2", "FORM_3", "FORM_4", "FORM_5"],
            },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

const ContactUsPage = mongoose.model("ContactUs", contactUsPageSchema);

export default ContactUsPage;
