import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import Supplier from '@/models/gestomag/Supplier';
import Arrival from '@/models/gestomag/Arrival';

type RouteParams = { params: Promise<{ id: string }> };

// GET /api/gestomag/suppliers/:id - Récupérer un fournisseur
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await dbConnect();
    const { id } = await params;
    const supplier = await Supplier.findById(id);

    if (!supplier) {
      return NextResponse.json({ error: 'Supplier not found' }, { status: 404 });
    }

    return NextResponse.json({
      ...supplier.toObject(),
      id: supplier._id
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

// PUT /api/gestomag/suppliers/:id - Mettre à jour un fournisseur
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();
    const { name, contact, phone, email, city } = body;

    const supplier = await Supplier.findByIdAndUpdate(
      id,
      { name, contact, phone, email, city },
      { new: true }
    );

    return NextResponse.json({
      ...supplier.toObject(),
      id: supplier._id
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

// DELETE /api/gestomag/suppliers/:id - Supprimer un fournisseur
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    await dbConnect();
    const { id } = await params;

    // Vérifier si le fournisseur a des arrivages
    const arrivalsCount = await Arrival.countDocuments({ supplierId: id });

    if (arrivalsCount > 0) {
      return NextResponse.json(
        { error: 'Impossible de supprimer : ce fournisseur a des arrivages associés' },
        { status: 400 }
      );
    }

    await Supplier.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
