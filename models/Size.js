import mongoose from "mongoose";

const Size = new mongoose.Schema(
  {
    sizeName: {
      type: String,
      required: true,
    },
    sizeCode: {
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

Size.virtual("CreateUserObject", {
  ref: "User",
  localField: "createdBy",
  foreignField: "_id",
  justOne: true,
});

Size.virtual("UpdateUserObject", {
  ref: "User",
  localField: "updatedBy",
  foreignField: "_id",
  justOne: true,
});

Size.set("toObject", { virtuals: true });
Size.set("toJSON", { virtuals: true });

export default mongoose.model("Size", Size);
