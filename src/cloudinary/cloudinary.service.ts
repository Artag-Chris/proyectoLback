import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { Request, Express } from 'express';
import {Multer} from 'multer';
import { CloudinaryResponse } from './cloudinaryResponse';
import { streamifier } from 'streamifier';

@Injectable()
export class CloudinaryService {

 uploadFile(file: Express.Multer.File): Promise<CloudinaryResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'lproyect',
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }


}
