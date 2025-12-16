import { Schema } from "mongoose";
declare const User: import("mongoose").Model<{
    name: string;
    email: string;
    password: string;
    role: "admin" | "user";
    isActive: boolean;
} & import("mongoose").DefaultTimestampProps, {}, {}, {}, import("mongoose").Document<unknown, {}, {
    name: string;
    email: string;
    password: string;
    role: "admin" | "user";
    isActive: boolean;
} & import("mongoose").DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    name: string;
    email: string;
    password: string;
    role: "admin" | "user";
    isActive: boolean;
} & import("mongoose").DefaultTimestampProps & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    name: string;
    email: string;
    password: string;
    role: "admin" | "user";
    isActive: boolean;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    name: string;
    email: string;
    password: string;
    role: "admin" | "user";
    isActive: boolean;
} & import("mongoose").DefaultTimestampProps>, {}, import("mongoose").ResolveSchemaOptions<{
    timestamps: true;
}>> & import("mongoose").FlatRecord<{
    name: string;
    email: string;
    password: string;
    role: "admin" | "user";
    isActive: boolean;
} & import("mongoose").DefaultTimestampProps> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>>;
export default User;
//# sourceMappingURL=userSchema.d.ts.map