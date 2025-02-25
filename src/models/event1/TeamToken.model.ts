import mongoose, { Document, ObjectId, Schema } from "mongoose";

export interface TeamToken extends Document {
  teamId: ObjectId,
  teamCode: string,
  createdAt: Date,
  expiresAt: Date,
};

const TeamTokenSchema: Schema<TeamToken> = new mongoose.Schema(
  {
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teams',
      required: [true, "teamId is required"],
    },
    teamCode: {
      type: String,
      required: [true, "team code is required"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 3 * 60 * 60 * 1000), // 3 hours from now
    },
  },
  { collection: "TeamTokensEvent1" }
);

const TeamTokenModel = (mongoose.models.TeamTokensEvent1 as mongoose.Model<TeamToken>) || (mongoose.model<TeamToken>("TeamTokensEvent1", TeamTokenSchema));

export default TeamTokenModel;