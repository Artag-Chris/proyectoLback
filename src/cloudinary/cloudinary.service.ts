import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier';
import { Multer } from 'multer';
import { CloudinaryResponse } from './cloudinaryResponse';

@Injectable()
export class CloudinaryService {

  /*******************************************************************
    clase para guardar imagenes en cloudinary usa multer para ayudar
    a subir archivos y cloudinary para subir a la nube
   ********************************************************************/

  constructor() {
    // Configuration de cloudinary
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }
async uploadImage(file: Express.Multer.File): Promise<  CloudinaryResponse > {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: "image" },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          
          resolve(result);
        }
      }
    );

    streamifier.createReadStream(file.buffer).pipe(uploadStream);
  });
}
}
