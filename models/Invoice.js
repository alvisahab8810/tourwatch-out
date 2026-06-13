import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  { id: String, particulars: String, hsn: String, qty: String, rate: String, amount: String },
  { _id: false }
);
const paymentSchema = new mongoose.Schema(
  { date: String, amount: Number, mode: String, note: String },
  { _id: false }
);

const InvoiceSchema = new mongoose.Schema(
  {
    _id:            { type: String },
    invoiceNo:      String,
    invoiceDate:    String,
    paymentMode:    String,
    // CRM links (stored as strings for UUID-based _id compatibility)
    leadId:         { type: String, default: "" },
    quotationId:    { type: String, default: "" },
    quotationNo:    { type: String, default: "" },
    leadDisplayId:  { type: String, default: "" },
    // Client
    clientName:     String,
    clientAddress:  String,
    clientState:    String,
    clientGstin:    String,
    destination:    String,
    contact:        { type: String, default: "" },
    // Line items
    items:          [itemSchema],
    // Tax
    cgstPct:        String,
    sgstPct:        String,
    igstPct:        String,
    tcsPct:         String,
    // Part payments
    payments:       [paymentSchema],
  },
  { timestamps: true }
);

InvoiceSchema.index({ createdAt: -1 });

delete mongoose.models.Invoice;
export default mongoose.model("Invoice", InvoiceSchema);
