import { v2 as cloudinary } from 'cloudinary';
import { envs } from 'src/config';

export class CloudinaryProvider {
    constructor() {
        // Configuration
        cloudinary.config({ 
            cloud_name: envs.cloudinaryName, 
            api_key: envs.cloudinaryApiKey,
            api_secret: envs.cloudinarySecret
        });
    }

    async uploadImage(imageUrl: string, publicId: string) {
        try {
            const uploadResult = await cloudinary.uploader.upload(imageUrl, {
                public_id: publicId,
            });
            console.log('Image uploaded to cloudinary');
            console.log(uploadResult);
            return uploadResult;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    getOptimizedUrl(publicId: string) {
        const optimizeUrl = cloudinary.url(publicId, {
            fetch_format: 'auto',
            quality: 'auto'
        });
        console.log(optimizeUrl);
        return optimizeUrl;
    }

    getAutoCropUrl(publicId: string, width: number, height: number) {
        const autoCropUrl = cloudinary.url(publicId, {
            crop: 'auto',
            gravity: 'auto',
            width,
            height,
        });
        console.log(autoCropUrl);
        return autoCropUrl;
    }
}

