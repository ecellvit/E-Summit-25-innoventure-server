import mongoose, { Document, ObjectId, Schema } from "mongoose";

export interface round1Qualified extends Document {
    teamLeaderId: ObjectId;
    teamLeaderName: string;
    teamLeaderEmail: string;
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
    hasUpgraded: boolean;
    wallet: number;
    portfolio: number[];
    page: number;
    startTime: Date;
    totalQuantity: number;
    islandBatch1: (ObjectId | null)[];
    islandBatch2: (ObjectId | null)[];
    islandBatch3: (ObjectId | null)[];
    insuranceType: number[];
    batch: number;
}

const TeamSchema: Schema<round1Qualified> = new Schema(
{
    teamLeaderId: {
        type: Schema.Types.ObjectId,
        ref: "Users",
        required: [true, "Team leader is required"],
    },
    teamLeaderName: {
        type: String,
        required: [true, "Team leader name is required"],
    },
    teamLeaderEmail: {
        type: String,
        required: [true, "Team leader email is required"],
        unique: true,
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
    hasUpgraded: {
        type: Boolean,
        default: false,
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
    },
    page:
    {
        type: Number,
        required: [true, "Page is required"],
    },
    startTime: {
        type: Date,
        default: Date.now,
    },
    totalQuantity: 
    {
        type: Number,
    },
    islandBatch1: [
        {
          type: Schema.Types.ObjectId,
          ref: "IslandRound2",
          default:[],
        },
      ],
      islandBatch2: [
        {
          type: Schema.Types.ObjectId,
          ref: "IslandRound2",
          default:[],
        },
      ],
      islandBatch3: [
        {
          type: Schema.Types.ObjectId,
          ref: "IslandRound2",
          default:[],
        },
      ],
    insuranceType: 
    {
        type: [Number],
    },
    batch:{
        type: Number,
        default:1,
    }
},
    { collection: "TeamsEvent1Round1",timestamp:true }
);

const TeamModelRound1 = (mongoose.models.TeamsEvent1Round1 as mongoose.Model<round1Qualified>) || (mongoose.model<round1Qualified>("TeamsEvent1Round1", TeamSchema));

export default TeamModelRound1;