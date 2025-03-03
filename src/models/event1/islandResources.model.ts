import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface IslandResourceModel extends Document {
  islandNumber: number;
  teamLeaderId: ObjectId;
  teamLeaderName: string;
  teamLeaderEmail: string;
  resourcesAvailable: number[];
  maxResources: number[];
}

const islandResourceSchema: Schema = new Schema({
  islandNumber: {
    type: Number,
    required: [true, "Island number is required"],
  },
  teamLeaderId: {
    type: Schema.Types.ObjectId,
    ref: "Users",
  },
  teamLeaderName: {
    type: String,
    required: [true, "Team leader name is required"],
  },
  teamLeaderEmail: {
    type: String,
    required: [true, "Team leader email is required"],
  },
  resourcesAvailable: {
    type: [Number],
    required: true,
    default: [],
  },
  maxResources: {
    type: [Number],
    default: [],
  },
}, { timestamps: true });

const IslandResources = (mongoose.models.IslandResource as mongoose.Model<IslandResourceModel>) || (mongoose.model<IslandResourceModel>("IslandResource", islandResourceSchema));

export default IslandResources;