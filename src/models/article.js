import mongoose from "mongoose";

const articleSchema = new mongoose.Schema({
    name:{type: String, required: true},
    image: {
        asset_id: {
            type: String,
            required: true
        },
        secure_url: {
            type: String,
            required: true
        },
        public_id: {
            type: String,
            required: true
        },
    },
    title:{ type: String, required: true},
    // date:{type: Date, required: true},
    readTime: {type: Number, required: true},
    link:{ type: String, required: true},
},
{
    timestamps: true
}
)

const Article = mongoose.model("Article", articleSchema)

export default Article;