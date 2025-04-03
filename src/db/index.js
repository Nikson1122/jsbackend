



import mongoose from "mongoose";
import {DB_NAME} from "../constants.js";

const connectDb =async() => {
    try {
           const ConnectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);

       
            console.log(`\n MongoDB connected !! DB HOST: ${ConnectionInstance.connection.host}`);

         

    }
    catch(error){
        console.log("MongoDB connection failed: ", error);
        process.exit(1);

    }
}

export default connectDb;