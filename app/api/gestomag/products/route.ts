import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import Product from '@/models/gestomag/Product';

// GET /api/gestomag/products - Liste tous les produits
export async function GET() {
  try {
    await dbConnect();
    const products = await Product.find({})
      .populate('familyId')
      .sort({ createdAt: -1 });
    
    const formatted = products.map(p => ({
      ...p.toObject(),
      id: p._id,
      family: p.familyId
    }));
    
    return NextResponse.json(formatted);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

// POST /api/gestomag/products - Créer un produit
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const { ref, name, price, stock, minStock, vat, familyId, image, cloudinaryId } = body;

    const product = await Product.create({
      ref,
      name,
      price: parseFloat(price) || 0,
      stock: parseInt(stock) || 0,
      minStock: parseInt(minStock) || 0,
      vat: parseFloat(vat) || 0,
      familyId,
      image,
      cloudinaryId,
      status: parseInt(stock) > 0 ? 'available' : 'out_of_stock'
    });

    const populated = await Product.findById(product._id).populate('familyId');

    return NextResponse.json({
      ...populated.toObject(),
      id: populated._id,
      family: populated.familyId
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
