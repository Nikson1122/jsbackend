// require("dotenv").config({path: "./.env"}); This is old method
import dotenv from "dotenv"

import connectDb from "./db/index.js";

dotenv.config({
    path: "./.env"}); // Load environment variables from .env file

connectDb()
.then(() =>{
    app.listen(process.env.PORT ||8000, () => {

        console.log(` Serve is running at port: ${process.env.PORT ||8000}`, () => {
            process.env.PORT
        });
        
    })

})
.catch((err) => {
    console.log("Mongo DB connection error:", err);
})




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