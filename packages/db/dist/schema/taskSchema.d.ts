import { Schema } from "mongoose";
declare const Task: import("mongoose").Model<{
    description: string;
    title: string;
    author: import("mongoose").Types.ObjectId;
    status: "pending" | "inprogress" | "completed";
} & import("mongoose").DefaultTimestampProps, {}, {}, {}, import("mongoose").Document<unknown, {}, {
    description: string;
    title: string;
    author: import("mongoose").Types.ObjectId;
    status: "pending" | "inprogress" | "completed";
} & import("mongoose").DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    description: string;
    title: string;
    author: import("mongoose").Types.ObjectId;
    status: "pending" | "inprogress" | "completed";
} & import("mongoose").DefaultTimestampProps & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    description: string;
    title: string;
    author: import("mongoose").Types.ObjectId;
    status: "pending" | "inprogress" | "completed";
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    description: string;
    title: string;
    author: import("mongoose").Types.ObjectId;
    status: "pending" | "inprogress" | "completed";
} & import("mongoose").DefaultTimestampProps>, {}, import("mongoose").ResolveSchemaOptions<{
    timestamps: true;
}>> & import("mongoose").FlatRecord<{
    description: string;
    title: string;
    author: import("mongoose").Types.ObjectId;
    status: "pending" | "inprogress" | "completed";
} & import("mongoose").DefaultTimestampProps> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>>;
export default Task;
//# sourceMappingURL=taskSchema.d.ts.map