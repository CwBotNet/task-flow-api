import { Document, Schema, Types, model } from "mongoose";

export interface IProject extends Document {
  owner: Types.ObjectId;
  name: string;
  description?: string;
  status: "pending" | "in-progress" | "completed";
  priority: "low" | "medium" | "high";
  dueDate: Date;
  assignDate: Date;
  codeLink: string;
  liveLink: string;
}

export const ProjectSchema = new Schema<IProject>(
  {
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    description: { type: String },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    dueDate: {
      type: Date,
      required: true,
      min: [new Date(), "Due date cannot be in the past"],
    },
    assignDate: { type: Date, default: Date.now },
    codeLink: { type: String, required: true, trim: true },
    liveLink: { type: String, trim: true },
  },
  { timestamps: true },
);

export default model<IProject>("Project", ProjectSchema);
