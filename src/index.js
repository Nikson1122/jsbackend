// require("dotenv").config({path: "./.env"}); This is old method
import dotenv from "dotenv"

import connectDb from "./db/index.js";

dotenv.config({
    path: "./.env"}); // Load environment variables from .env file

connectDb();




/*
const app = express();
(() =>{
   try{
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
    app.on("error", (error) => {
        console.log("ERR:", err);
        throw error;
    })
    app.listen(process.env.PORT, () => {
        console.log(`App is listening on port ${process.env.PORT}`);
    })
   }
    catch(error){
        console.error("Error: ", error);
        throw err
    }
}) ()
    */