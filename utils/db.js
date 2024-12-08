import mongoose from "mongoose";

let isConnected;

export const connectToDatabase = async () => {
  if (isConnected) {
    console.log("=> using existing database connection");
    return;
  }

  console.log("=> using new database connection");
  try {
    const db = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = db.connections[0].readyState;
    console.log("=> database connected");
  } catch (error) {
    console.error("=> database connection error", error);
    throw error;
  }
};
