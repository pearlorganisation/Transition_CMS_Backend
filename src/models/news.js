import mongoose from "mongoose";

const newsSchema = new mongoose.Schema(
  {
    name:{type: String, required:true},
    title: { type: String, required: true },
    image: {
      asset_id: { type: String, required: true },
      secure_url: { type: String, required: true },
      public_id: { type: String, required: true },
    },
    type:{type: String, required:true},
    date:{type: Date, required:true},
    read_time:{type:Number, required: true},
    link: { type: String, required: true },
  },
  { timestamps: true }
);

const News = mongoose.model("News", newsSchema);

export default News;
