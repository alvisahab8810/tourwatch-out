// import mongoose from "mongoose";

// const MONGODB_URI = process.env.MONGODB_URI;

// if (!MONGODB_URI) {
//   throw new Error("Please define MONGODB_URI in .env file");
// }

// let cached = global.mongoose || { conn: null, promise: null };

// async function dbConnect() {
//   if (cached.conn) return cached.conn;
//   if (!cached.promise) {
//     cached.promise = mongoose.connect(MONGODB_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     }).then((mongoose) => mongoose);
//   }
//   cached.conn = await cached.promise;
//   return cached.conn;
// }

// export default dbConnect;



// utils/mongodb.js

import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in .env file");
}

// Reuse the existing global connection if available
let cached = global.mongoose || { conn: null, promise: null };

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 8000,   // fail fast — 8s instead of default 30s
      connectTimeoutMS: 8000,
    }).then((mongoose) => mongoose);
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null; // reset so next request retries
    throw e;
  }
  return cached.conn;
}

global.mongoose = cached;

export default connectDB;
