import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  { src: String, alt: String },
  { _id: false }
);

const daySchema = new mongoose.Schema(
  { day: Number, title: String, icon: String, description: String },
  { _id: false }
);

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
    webBanner:            imageSchema,
    mobileBanner:         imageSchema,
    gallery:              [imageSchema],
    priceImage:           imageSchema,
    advertisement:        { type: mongoose.Schema.Types.Mixed, default: {} },
    aboutImages:          [imageSchema],
    bucketImages:         [imageSchema],
    status:               { type: String, default: "Inactive" },
  },
  { timestamps: true }
);

export default mongoose.models.Package || mongoose.model("Package", PackageSchema);
