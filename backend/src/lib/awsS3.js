import AWS from 'aws-sdk';

export const s3 = new AWS.S3({
    region : process.env.AWS_REGION,
    credentials:{
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
})

export const getParsedURL = (req,res,key) =>{
    if(!key) {
        return res.status(400).json({ message: "Key is required" });
    }
    const params = {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: key,
    };
    try {
        const url = s3.getSignedUrl('getObject', params);
        return url
    } catch (error) {
        return "Error generating signed URL: " + error.message;
    }
}