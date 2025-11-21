import mongoose, { mongo, Mongoose } from "mongoose";

const connectDB = async (uri)=>{
    if(!uri){
        throw new Error("MongoDB URI not provided")
    }
    try {
        await mongoose.connect(uri);
        console.log("MongoDB Connected");
    } catch (error) {
        console.error("MongoDB connection failed",error)
        process.exit(1);
    }
};

export default connectDB;