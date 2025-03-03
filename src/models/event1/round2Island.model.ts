import mongoose, { Document, ObjectId, Schema } from "mongoose";

export interface round2Island extends Document {
    teamLeaderId: ObjectId;
    teamLeaderEmail: string;
    cost: number;
    island:number;
    batch:number;
    insurance:number;
    startTime: Date;
    endTime: Date;
    modeOfTransport: number;
    totalQuantity: number;
    elementQuantity: number[];
}

const TeamSchema: Schema<round2Island> = new Schema(
    {
        teamLeaderId: {
            type: Schema.Types.ObjectId,
            ref: "Users",
            required: [true, "Team leader is required"],
        },
        teamLeaderEmail: {
            type: String,
            required: [true, "Team leader email is required"],
        },
        island:{
            type:Number,
        },
        cost: {
            type: Number,
        },
        startTime: {
            type: Date,
            default: Date.now,
        },
        endTime: {
            type: Date,
        },
        modeOfTransport: {
            type: Number,
        },
        batch: {
            type: Number,
        },
        insurance: {
            type: Number,
        },
        totalQuantity: {
            type: Number,
        },
        elementQuantity: {
            type: [Number],
            default:[],
        },
    },
    { collection: "TeamsEvent1Round2" , timestamps:true}
);

const IslandRound2 = (mongoose.models.TeamsEvent1Round2 as mongoose.Model<round2Island>) || (mongoose.model<round2Island>("TeamsEvent1Round2", TeamSchema));

export default IslandRound2;