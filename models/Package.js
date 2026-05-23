import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  { src: String, alt: String },
  { _id: false }
);

const schemaEntrySchema = new mongoose.Schema(
  { type: String, content: String },
  { _id: false }
);

const faqItemSchema = new mongoose.Schema(
  { question: String, answer: String },
  { _id: false }
);

const daySchema = new mongoose.Schema(
  { day: Number, title: String, icon: String, description: String },
  { _id: false }
);

const staySchema = new mongoose.Schema({
  vendorId:     String,
  vendorName:   String,
  roomCategory: String,
  roomName:     String,
  bedType:      String,
  roomSize:     String,
  starRating:   Number,
  amenities:    [String],
  address:      String,
  phone:        String,
  price:        Number,
  nights:       { type: Number, default: 1 },
  rooms:        { type: Number, default: 1 },
  gstPct:       { type: Number, default: 0 },
  subTotal:     Number,
  gstAmt:       Number,
  total:        Number,
}, { _id: false });

const transferSchema = new mongoose.Schema({
  vendorId:    String,
  vendorName:  String,
  vehicleType: String,
  pricePerDay: Number,
  days:        { type: Number, default: 1 },
  gstPct:      { type: Number, default: 0 },
  subTotal:    Number,
  gstAmt:      Number,
  total:       Number,
  inclusions:  [String],
}, { _id: false });

const activityBookingSchema = new mongoose.Schema({
  vendorId:       String,
  vendorName:     String,
  activityName:   String,
  pricePerPerson: Number,
  persons:        { type: Number, default: 1 },
  gstPct:         { type: Number, default: 0 },
  subTotal:       Number,
  gstAmt:         Number,
  total:          Number,
}, { _id: false });

const PackageSchema = new mongoose.Schema(
  {
    _id:                  { type: String },
    destination:          { type: String, required: true },
    packageType:          { type: String, required: true },
    packageSubtype:       { type: String, required: true },
    packageName:          String,
    duration:             String,
    basePrice:            String,
    finalPrice:           String,
    priceType:            String,
    itineraryTitle:       String,
    destinationHighlights:String,
    amenities:            { type: mongoose.Schema.Types.Mixed, default: [] },
    days:                 [daySchema],
    inclusions:           String,
    exclusions:           String,
    aboutText:            String,
    bucketListText:       String,
    bookingPolicy:        String,
    cancellationPolicy:   String,
    termsConditions:      String,
    metaTitle:            String,
    metaDescription:      String,
    metaKeywords:         String,
    metaRobots:           { type: String, default: "index, follow, max-image-preview:large, max-snippet:-1" },
    xRobotsTag:           { type: String, default: "index, follow, max-image-preview:large, max-snippet:-1" },
    schemas:              [schemaEntrySchema],
    faqs:                 [faqItemSchema],
    featureImage:         imageSchema,
    webBanner:            imageSchema,
    mobileBanner:         imageSchema,
    gallery:              [imageSchema],
    priceImage:           imageSchema,
    advertisement:        { type: mongoose.Schema.Types.Mixed, default: {} },
    aboutImages:          [imageSchema],
    bucketImages:         [imageSchema],
    stays:                [staySchema],
    transfers:            [transferSchema],
    activityBookings:     [activityBookingSchema],
    status:               { type: String, default: "Inactive" },
    popular:              { type: Boolean, default: false },
  },
  { timestamps: true }
);

PackageSchema.index({ createdAt: -1 });

if (process.env.NODE_ENV !== "production") delete mongoose.models["Package"];
export default mongoose.models.Package || mongoose.model("Package", PackageSchema);
