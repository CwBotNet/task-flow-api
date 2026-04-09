import { Schema, Document, Types, model } from "mongoose";

export interface ITask extends Document {
  title: string;
  description: string;
  status: "todo" | "in-progress" | "done";
  priority: "low" | "medium" | "high";
  projectId: Types.ObjectId;
  assignedTo: Types.ObjectId[];
  dueDate: Date;
}

const taskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["todo", "in-progress", "done"],
      default: "todo",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    assignedTo: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    dueDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true },
);

export default model<ITask>("Task", taskSchema);
