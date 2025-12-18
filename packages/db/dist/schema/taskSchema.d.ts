import { Schema } from "mongoose";
declare const Task: import("mongoose").Model<{
    title: string;
    description: string;
    author: import("mongoose").Types.ObjectId;
    status: "pending" | "inprogress" | "completed";
    notifiedToAdmin: boolean;
} & import("mongoose").DefaultTimestampProps, {}, {}, {}, import("mongoose").Document<unknown, {}, {
    title: string;
    description: string;
    author: import("mongoose").Types.ObjectId;
    status: "pending" | "inprogress" | "completed";
    notifiedToAdmin: boolean;
} & import("mongoose").DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    title: string;
    description: string;
    author: import("mongoose").Types.ObjectId;
    status: "pending" | "inprogress" | "completed";
    notifiedToAdmin: boolean;
} & import("mongoose").DefaultTimestampProps & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    title: string;
    description: string;
    author: import("mongoose").Types.ObjectId;
    status: "pending" | "inprogress" | "completed";
    notifiedToAdmin: boolean;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    title: string;
    description: string;
    author: import("mongoose").Types.ObjectId;
    status: "pending" | "inprogress" | "completed";
    notifiedToAdmin: boolean;
} & import("mongoose").DefaultTimestampProps>, {}, import("mongoose").ResolveSchemaOptions<{
    timestamps: true;
}>> & import("mongoose").FlatRecord<{
    title: string;
    description: string;
    author: import("mongoose").Types.ObjectId;
    status: "pending" | "inprogress" | "completed";
    notifiedToAdmin: boolean;
} & import("mongoose").DefaultTimestampProps> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>>;
export default Task;
//# sourceMappingURL=taskSchema.d.ts.map