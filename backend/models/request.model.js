const mongoose = require("mongoose");

const requestDistributer = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    cnic: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [
        /^\d{5}-\d{7}-\d{1}$/,
        "Invalid CNIC format (e.g., 12345-1234567-1)",
      ],
    },
    email: { type: String, required: true, unique: true, trim: true },
    EmployID: { type: String, required: true, trim: true },
    phoneNo: {
      type: String,
      required: true,
      match: [/^03\d{9}$/, "Invalid phone number format (e.g., 03001234567)"],
    },
    City: { type: String, required: true, trim: true },
    bikeColor: { type: String, required: true, trim: true },
    bikeVarient: { type: String, required: true, trim: true },
    engineNo: { type: Number },
    chasisNo: { type: Number },
    status: { type: String },
    distributerNo: {
      type: String,
      required: true,
    },
    isSendAutherizedToUser: { type: Boolean },
    isSendInvoiceToUser: { type: Boolean },
    deliveryDate: { type: String },
    isUserAcceptDelivery: { type: Boolean },
    isSendConfirmationTouser: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const requestToDistributer = mongoose.model(
  "requestDistributer",
  requestDistributer
);

module.exports = requestToDistributer;
