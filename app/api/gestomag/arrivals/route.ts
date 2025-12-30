import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import Arrival from '@/models/gestomag/Arrival';
import Product from '@/models/gestomag/Product';

// GET /api/gestomag/arrivals - Liste tous les arrivages
export async function GET() {
  try {
    await dbConnect();
    const arrivals = await Arrival.find({})
      .populate('supplierId')
      .populate('lines.productId')
      .sort({ date: -1 });
    
    const formatted = arrivals.map(a => ({
      ...a.toObject(),
      id: a._id,
      supplier: a.supplierId,
      lines: a.lines.map((l: { productId: unknown; _id: unknown }) => ({
        ...l,
        product: l.productId
      }))
    }));
    
    return NextResponse.json(formatted);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

// POST /api/gestomag/arrivals - Créer un arrivage avec lignes
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const { date, reference, supplierId, lines } = body;

    // Calcul du montant total
    const totalAmount = lines.reduce(
      (sum: number, line: { quantity: number; unitPrice: number }) =>
        sum + line.quantity * line.unitPrice,
      0
    );

    // Créer l'arrivage avec ses lignes
    const arrival = await Arrival.create({
      date: new Date(date),
      reference,
      supplierId,
      totalAmount,
      lines: lines.map((line: { productId: string; quantity: number; unitPrice: number }) => ({
        productId: line.productId,
        quantity: parseInt(String(line.quantity)),
        unitPrice: parseFloat(String(line.unitPrice))
      }))
    });

    // Mettre à jour le stock de chaque produit
    for (const line of lines) {
      await Product.findByIdAndUpdate(line.productId, {
        $inc: { stock: parseInt(String(line.quantity)) },
        status: 'available'
      });
    }

    const populated = await Arrival.findById(arrival._id)
      .populate('supplierId')
      .populate('lines.productId');

    return NextResponse.json({
      ...populated.toObject(),
      id: populated._id,
      supplier: populated.supplierId
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
