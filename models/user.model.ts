import { Document, model, Schema } from "mongoose";
import bcrypt from "bcrypt";

// User Interface
export interface IUser extends Document {
  name: string;
  avatar?: string;
  email: string;
  password: string;
  comparePassword(UserPassword: string): Promise<boolean>;
}

// User Schema
export const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  { timestamps: true },
);

UserSchema.pre("save", async function () {
  const user = this as IUser;

  if (!user.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
});

UserSchema.methods.comparePassword = async function (
  UserPassword: string,
): Promise<boolean> {
  return await bcrypt.compare(UserPassword, this.password);
};

// User Model

export default model<IUser>("User", UserSchema);
