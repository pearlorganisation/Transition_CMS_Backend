import mongoose from "mongoose";

const podcastSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description:{ type:String, required: true},
    link:{type: String, required:true},
    image:{
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
        }
   },
 { timestamps:true }
)

const Podcast = mongoose.model("Podcast", podcastSchema)

export default Podcast;