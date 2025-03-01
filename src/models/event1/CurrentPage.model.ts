import mongoose, { Document, Schema } from "mongoose";

export interface CurrentPage extends Document {
  creator?: boolean;
  round: number;
  page: number;
  sellingStarted?: boolean;
  startedAt: Date;
}

const CurrentPageSchema: Schema<CurrentPage> = new Schema(
  {
    creator: {
      type: Boolean,
      default: true,
    },
    round: {
      type: Number,
      required: true,
      default: 0,
    },
    page: {
      type: Number,
      required: true,
      default: 0,
    },
    sellingStarted: {
      type: Boolean,
      default: false,
    },
    startedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  { collection: "CurrentPage" }
);

const CurrentPageModel = (mongoose.models.CurrentPage as mongoose.Model<CurrentPage>) || (mongoose.model<CurrentPage>("CurrentPage", CurrentPageSchema));

export default CurrentPageModel;
