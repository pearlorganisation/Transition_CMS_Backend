import mongoose from "mongoose";

const focusAreaSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    focusAreas: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "SingleFeature",
        },
        title: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

const FocusArea = mongoose.model("FocusArea", focusAreaSchema);

export default FocusArea;
