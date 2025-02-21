import mongoose, { Schema, Document, Types } from "mongoose";

export interface IUser extends Document {
  email: string;
  name: string;
  regNo: string;
  mobNo: number;
  event1TeamRole: number; // 0 for leader, 1 for member
  event1TeamId: Types.ObjectId | null;
  event2TeamRole: number; // 0 for leader, 1 for member
  event2TeamId: Types.ObjectId | null;
  hasFilledDetails: boolean;
  events: number[];
  event1Consent: boolean;
  event2Consent: boolean;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    regNo: {
      type: String,
      required: false,
    },
    mobNo: {
      type: Number,
      required: false,
    },
    event1TeamRole: {
      type: Number, // 0 for leader, 1 for member
      required: false,
    },
    event1TeamId: {
      type: Schema.Types.ObjectId,
      ref: "TeamsEvent1",
      required: false,
    },
    event2TeamRole: {
      type: Number, // 0 for leader, 1 for member
      required: false,
    },
    event2TeamId: {
      type: Schema.Types.ObjectId,
      ref: "TeamsEvent2",
      required: false,
    },
    hasFilledDetails: {
      type: Boolean,
      default: false,
    },
    events: {
      type: [Number],
      default: [],
    },
    event1Consent: {
      type: Boolean,
      default: false,
    },
    event2Consent: {
      type: Boolean,
      default: false,
    },
  },
  { collection: "Users" }
);

export const Users =
  mongoose.models.Users || mongoose.model<IUser>("Users", userSchema);
