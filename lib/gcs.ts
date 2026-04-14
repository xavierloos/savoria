import { Storage } from '@google-cloud/storage';

// Initialize storage
// In production, you would authenticate using a service account key
// process.env.GOOGLE_APPLICATION_CREDENTIALS
const storage = new Storage();

const bucketName = process.env.GCS_BUCKET_NAME || 'savoria-assets';

export async function uploadImage(file: Buffer, filename: string, contentType: string) {
  try {
    const bucket = storage.bucket(bucketName);
    const blob = bucket.file(`menu/${Date.now()}-${filename}`);
    
    const blobStream = blob.createWriteStream({
      resumable: false,
      contentType: contentType,
    });

    return new Promise<string>((resolve, reject) => {
      blobStream.on('error', (err) => {
        reject(err);
      });

      blobStream.on('finish', () => {
        // The public URL can be used to directly access the file via HTTP.
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
        resolve(publicUrl);
      });

      blobStream.end(file);
    });
  } catch (error) {
    console.error('Error uploading to GCS:', error);
    throw new Error('Failed to upload image');
  }
}
