import 'dotenv/config';
import * as joi from 'joi';

interface EnvConfig {
    PORT: number;
    CLOUDINARY_NAME: string;
    CLOUDINARY_API_KEY: string;
    CLOUDINARY_SECRET: string;
}

const envVarsSchema = joi.object({
    PORT: joi.number().required(),
    CLOUDINARY_NAME: joi.string().required(),
    CLOUDINARY_API_KEY: joi.string().required(),
    CLOUDINARY_SECRET: joi.string().required()
})
.unknown(true);

const { error, value } = envVarsSchema.validate(process.env);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}
const envVars: EnvConfig = value;

export const envs={
port: envVars.PORT,
cloudinaryName: envVars.CLOUDINARY_NAME,
cloudinaryApiKey: envVars.CLOUDINARY_API_KEY,
cloudinarySecret: envVars.CLOUDINARY_SECRET
}