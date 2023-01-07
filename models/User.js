import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    displayName: {
      type: String,
      require: true,
    },
    telephone: {
      type: String,
      require: false,
    },
    email: {
      type: String,
      required: false,
    },
    userCode: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    gender: {
      type: String,
      require: false,
    },
    address: {
      type: String,
      require: false,
    },
    role: {
      type: String,
      ref: "Role",
      require: true,
    },
    img: {
      type: String,
    },
    fromGoogle: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "USer",
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);
UserSchema.virtual("RoleObject", {
  ref: "Role",
  localField: "role",
  foreignField: "roleCode",
  justOne: true,
});

UserSchema.set("toObject", { virtuals: true });
UserSchema.set("toJSON", { virtuals: true });

export default mongoose.model("User", UserSchema);
