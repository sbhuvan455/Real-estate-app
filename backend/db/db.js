import mongoose from 'mongoose';

export const connectDB = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to Database Successfully");
    } catch (error) {
        console.log("Error occurred while connecting to DataBase", error);
        process.exit(1);
    }
}