import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    // Await the upload
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto"
    });

    // Remove file after successful upload
    fs.unlinkSync(localFilePath);

    return response;
  } catch (error) {
    console.error("Cloudinary upload failed:", error);

    // Cleanup even if upload fails
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return null;
  }
};

export { uploadOnCloudinary }; 



// import {v2 as cloudinary} from "cloudinary"
// import fs from "fs"

// cloudinary.config({ 
//     cloud_name: 'process.env.CLOUDINARY_CLOUD_NAME', 
//     api_key: 'process.env.CLOUDINARY_API_KEY', 
//     api_secret: 'process.env.CLOUDINARY_API_SECRET' // Click 'View API Keys' above to copy your API secret
// });


// const uploadOnCloudinary = async(localFilepath) =>{
//     try{
//         if(!loclafilepath) return null
//         //upload the file to cloudinary
//         const response = cloudinary.uploader.upload(localFilepath, {
//             resource_type: "auto"
            
//          });
//          //file has been uploaded sucessfully
//         //  console.log("File is uploaded on cloudinary",
          
//         //     response.Url);
//         fs.unlinkSync(localFilePath);

//             return response;

//     }
//     catch (error){
//         fs.unlinkSync(loclafilepath) // remove the localy saved temporary file as the upload operation got failed
//         return null;

//     }
// }

// export {uploadOnCloudinary}

    // Configuration
