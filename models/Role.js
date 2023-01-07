import mongoose from "mongoose";

const RoleSchema = new mongoose.Schema(
  {
    roleName: {
      type: String,
      require: true,
    },
    roleCode: {
      type: String,
      require: true,
    },
    permission: {
      type: [],
      require: false,
    },
    status: {
      type: String,
      require: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: false,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);
RoleSchema.virtual("CreateUserObject", {
  ref: "User",
  localField: "createdBy",
  foreignField: "_id",
  justOne: true,
});

RoleSchema.virtual("UpdateUserObject", {
  ref: "User",
  localField: "updatedBy",
  foreignField: "_id",
  justOne: true,
});
RoleSchema.set("toObject", { virtuals: true });
RoleSchema.set("toJSON", { virtuals: true });
export default mongoose.model("Role", RoleSchema);
