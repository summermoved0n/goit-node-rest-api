import { Schema, model } from "mongoose";
import { handeSaveError, setUpdateSettings } from "./hooks.js";

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false, timestamps: true }
);

contactSchema.post("save", handeSaveError);

contactSchema.pre("findOneAndUpdate", setUpdateSettings);

contactSchema.post("findOneAndUpdate", handeSaveError);

const Contact = model("contact", contactSchema);

export default Contact;
