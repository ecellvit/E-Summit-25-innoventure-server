import mongoose, { Document, Schema } from "mongoose";
 // Import basePrice from JSON

export interface MarketData extends Document {
    elementId: number;
    currentTeams: number;
    marketPrice: number;
    basePrice: number;
    marketHistory: number[];
}

const MarketSchema: Schema<MarketData> = new Schema(
    {
        elementId: {
            type: Number,
            required: true,
        },
        currentTeams: {
            type: Number,
            required: true,
        },
        basePrice: {
            type: Number,
            // default: basePriceData, // Set basePrice from JSON file
            immutable: true, // Prevent modifications
        },
        marketPrice: {
            type: Number,
            required: true,
        },
        marketHistory: {
            type: [Number],
            required: true,
        }
    },
    { collection: "MarketData" }
);

// Ensure only one document exists for all teams
const MarketModel = mongoose.models.MarketData as mongoose.Model<MarketData> || mongoose.model<MarketData>("MarketData", MarketSchema);

export default MarketModel;
