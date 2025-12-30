import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import Arrival from '@/models/gestomag/Arrival';
import Product from '@/models/gestomag/Product';

type RouteParams = { params: Promise<{ id: string }> };

// GET /api/gestomag/arrivals/:id - Récupérer un arrivage
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await dbConnect();
    const { id } = await params;
    const arrival = await Arrival.findById(id)
      .populate('supplierId')
      .populate('lines.productId');

    if (!arrival) {
      return NextResponse.json({ error: 'Arrival not found' }, { status: 404 });
    }

    return NextResponse.json({
      ...arrival.toObject(),
      id: arrival._id,
      supplier: arrival.supplierId
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

// DELETE /api/gestomag/arrivals/:id - Supprimer un arrivage (et annuler les stocks)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    await dbConnect();
    const { id } = await params;

    // Récupérer l'arrivage avec ses lignes
    const arrival = await Arrival.findById(id);

    if (!arrival) {
      return NextResponse.json({ error: 'Arrival not found' }, { status: 404 });
    }

    // Annuler les modifications de stock
    for (const line of arrival.lines) {
      const product = await Product.findByIdAndUpdate(
        line.productId,
        { $inc: { stock: -line.quantity } },
        { new: true }
      );

      // Mettre à jour le statut si stock <= 0
      if (product && product.stock <= 0) {
        await Product.findByIdAndUpdate(line.productId, { status: 'out_of_stock' });
      }
    }

    // Supprimer l'arrivage
    await Arrival.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
