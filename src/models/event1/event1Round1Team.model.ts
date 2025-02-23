import mongoose, { Document, ObjectId, Schema } from "mongoose";

export interface round1Qualified extends Document {
    teamId: ObjectId;
    teamName: string;
    primaryElement: number;
    secondaryElement: number;
    lease1Element: number;
    lease2Element: number;
    primaryRate: number;
    secondaryRate: number;
    lease1Rate: number;
    lease2Rate: number;
    primaryStartTime: Date;
    secondaryStartTime: Date;
    lease1StartTime: Date;
    lease2StartTime: Date;
    wallet: number;
    portfolio: number[];
}

const TeamSchema: Schema<round1Qualified> = new Schema(
{
    teamId: {
        type: Schema.Types.ObjectId,
        ref: "TeamsEvent1",
        required: [true, "Team name is required"],
    },
    teamName:{
        type: String,
        required: [true, "Team name is required"],
    },
    primaryElement: {
        type: Number,
    },
    secondaryElement: {
        type: Number,
    },
    lease1Element: {
        type: Number,
    },
    lease2Element: {
        type: Number,
    },
    primaryRate: {
        type: Number,
    },
    secondaryRate: {
        type: Number,
    },
    lease1Rate: {
        type: Number,
    },
    lease2Rate: {
        type: Number,
    },
    primaryStartTime: {
        type: Date,
    },
    secondaryStartTime: {
        type: Date,
    },
    lease1StartTime: {
        type: Date,
    },
    lease2StartTime: {
        type: Date,
    },
    wallet:
    {
        type: Number,
        required: [true, "Wallet is required"],
    },
    portfolio:
    {
        type: [Number],
        required: [true, "Portfolio is required"],
    }
},
    { collection: "TeamsEvent1Round1" }
);

const TeamModelRound1 = (mongoose.models.TeamsEvent1Round1 as mongoose.Model<round1Qualified>) || (mongoose.model<round1Qualified>("TeamsEvent1Round1", TeamSchema));

export default TeamModelRound1;
