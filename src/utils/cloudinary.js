import {v2 as cloudinary} from "cloudinary"
import fs from "fs"



const uploadOnCloudinary = async(loclafilepath) =>{
    try{
        if(!loclafilepath) return null
        //upload the file to cloudinary
         cloudinary.uploader.upload(loclafilepath, {
            resource_type: "auto"
            
         })
         //file has been uploaded sucessfully
         console.log("File is uploaded on cloudinary",
            response.Url);
            return response;

    }
    catch (error){
        fs.unlinkSync(loclafilepath) // remove the localy saved temporary file as the upload operation got failed

    }
}

export {uploadOnCloudinary}

    // Configuration
    cloudinary.config({ 
        cloud_name: 'process.env.CLOUDINARY_CLOUD_NAME', 
        api_key: 'process.env.CLOUDINARY_API_KEY', 
        api_secret: 'process.env.CLOUDINARY_API_SECRET' // Click 'View API Keys' above to copy your API secret
    });