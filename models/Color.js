import mongoose from "mongoose";

const Color = new mongoose.Schema(
  {
    colorName: {
      type: String,
      required: true,
    },
    colorCode: {
      type: String,
      require: true,
    },
    status: {
      type: String,
      default: "Active",
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

Color.virtual("CreateUserObject", {
  ref: "User",
  localField: "createdBy",
  foreignField: "_id",
  justOne: true,
});

Color.virtual("UpdateUserObject", {
  ref: "User",
  localField: "updatedBy",
  foreignField: "_id",
  justOne: true,
});

Color.set("toObject", { virtuals: true });
Color.set("toJSON", { virtuals: true });

export default mongoose.model("Color", Color);
