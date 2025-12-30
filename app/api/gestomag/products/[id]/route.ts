import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import Product from '@/models/gestomag/Product';

type RouteParams = { params: Promise<{ id: string }> };

// GET /api/gestomag/products/:id - Récupérer un produit
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await dbConnect();
    const { id } = await params;
    const product = await Product.findById(id).populate('familyId');

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({
      ...product.toObject(),
      id: product._id,
      family: product.familyId
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

// PUT /api/gestomag/products/:id - Mettre à jour un produit
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();
    const { ref, name, price, stock, minStock, vat, familyId, image, cloudinaryId } = body;

    const updateData: Record<string, unknown> = {};
    if (ref !== undefined) updateData.ref = ref;
    if (name !== undefined) updateData.name = name;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (stock !== undefined) {
      updateData.stock = parseInt(stock);
      updateData.status = parseInt(stock) > 0 ? 'available' : 'out_of_stock';
    }
    if (minStock !== undefined) updateData.minStock = parseInt(minStock);
    if (vat !== undefined) updateData.vat = parseFloat(vat);
    if (familyId !== undefined) updateData.familyId = familyId;
    if (image !== undefined) updateData.image = image;
    if (cloudinaryId !== undefined) updateData.cloudinaryId = cloudinaryId;

    const product = await Product.findByIdAndUpdate(id, updateData, { new: true })
      .populate('familyId');

    return NextResponse.json({
      ...product.toObject(),
      id: product._id,
      family: product.familyId
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

// DELETE /api/gestomag/products/:id - Supprimer un produit
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    await dbConnect();
    const { id } = await params;
    await Product.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
