import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  { id: String, particulars: String, hsn: String, qty: String, rate: String, amount: String },
  { _id: false }
);

const InvoiceSchema = new mongoose.Schema(
  {
    _id:           { type: String },
    invoiceNo:     String,
    invoiceDate:   String,
    paymentMode:   String,
    clientName:    String,
    clientAddress: String,
    clientState:   String,
    clientGstin:   String,
    destination:   String,
    items:         [itemSchema],
    cgstPct:       String,
    sgstPct:       String,
    igstPct:       String,
    tcsPct:        String,
  },
  { timestamps: true }
);

InvoiceSchema.index({ createdAt: -1 });

export default mongoose.models.Invoice || mongoose.model("Invoice", InvoiceSchema);
