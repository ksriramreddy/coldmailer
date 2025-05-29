import mongoose from "mongoose";

const mailSchema = new mongoose.Schema({
    sender : {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    title : {
        type: [String],
        required: true,
    },
    body : {
        type: [String],
        required: true,
    },
    file : {
        type: [Object],
        required: true,
    }   
})

const Mail = mongoose.model("Mail",mailSchema)
export default Mail;