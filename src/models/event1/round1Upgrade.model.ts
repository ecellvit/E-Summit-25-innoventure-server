import mongoose, { Schema, Document } from "mongoose";

export interface UpgradeModel extends Document {
    id: number;
    name: string;
    cost: number;
    description: string;
}

const UpgradeSchema: Schema = new Schema({
    id: { 
        type: Number, 
         unique: true },
    name: { 
        type: String, 
    },
    cost: { 
        type: Number, 
    },
    description: { 
        type: String, 
    },
});

export default mongoose.models.Upgrade || mongoose.model<UpgradeModel>("Upgrade", UpgradeSchema);
