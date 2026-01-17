import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import { Product, StockMovement } from '@/models/gestomag';

// GET history for a specific product
export async function GET(request, { params }) {
  await dbConnect();
  try {
    const { id } = params;
    const history = await StockMovement.find({ productId: id }).sort({ createdAt: -1 });
    return NextResponse.json(history);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stock history' }, { status: 500 });
  }
}

// PUT update stock for a specific product
export async function PUT(request, { params }) {
  await dbConnect();
  try {
    const { id } = params;
    const { newStock, reason } = await request.json();

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const previousStock = product.stock;
    const delta = newStock - previousStock;

    // Update product stock
    product.stock = newStock;
    if (newStock <= 0) product.status = 'out_of_stock';
    else product.status = 'available';
    await product.save();

    // Create movement trace
    const movement = await StockMovement.create({
      productId: id,
      previousStock,
      newStock,
      delta,
      type: 'manual_adjustment',
      reason: reason || 'Ajustement manuel'
    });

    return NextResponse.json({ product, movement });
  } catch (error) {
    console.error('Stock update error:', error);
    return NextResponse.json({ error: 'Failed to update stock' }, { status: 500 });
  }
}
