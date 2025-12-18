import { Schema, model } from "mongoose";

const taskSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: ["pending", "inprogress", "completed"],
    },
    notifiedToAdmin: {
        type: Boolean,
        required: true,
        default: false,
    },
}, { timestamps: true });

const Task = model("Task", taskSchema);
export default Task;