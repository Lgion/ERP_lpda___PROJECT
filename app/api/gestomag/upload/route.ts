import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configuration Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// POST /api/gestomag/upload - Upload image vers Cloudinary (sans stockage local)
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Convertir le fichier en buffer puis en base64 data URI
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64DataUri = `data:${file.type};base64,${buffer.toString('base64')}`;

    // Upload direct vers Cloudinary (sans fichier temporaire)
    const folderName = process.env.CLOUDINARY_CLOUD_FOLDER_NAME || 'gestomag_products';
    const result = await cloudinary.uploader.upload(base64DataUri, {
      folder: folderName
    });

    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id
    });
  } catch (error) {
    console.error('Upload Error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
