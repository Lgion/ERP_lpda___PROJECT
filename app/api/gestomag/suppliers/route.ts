import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import Supplier from '@/models/gestomag/Supplier';

// GET /api/gestomag/suppliers - Liste tous les fournisseurs
export async function GET() {
  try {
    await dbConnect();
    const suppliers = await Supplier.find({}).sort({ createdAt: -1 });
    
    const formatted = suppliers.map(s => ({
      ...s.toObject(),
      id: s._id
    }));
    
    return NextResponse.json(formatted);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

// POST /api/gestomag/suppliers - Créer un fournisseur
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const { name, contact, phone, email, city } = body;

    const supplier = await Supplier.create({ name, contact, phone, email, city });

    return NextResponse.json({
      ...supplier.toObject(),
      id: supplier._id
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
