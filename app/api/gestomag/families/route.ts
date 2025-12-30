import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import Family from '@/models/gestomag/Family';
import Product from '@/models/gestomag/Product';

// GET /api/gestomag/families - Liste toutes les familles
export async function GET() {
  try {
    await dbConnect();
    const families = await Family.find({});
    
    const formatted = await Promise.all(families.map(async (f) => {
      const productsCount = await Product.countDocuments({ familyId: f._id });
      return {
        ...f.toObject(),
        id: f._id,
        _count: { products: productsCount }
      };
    }));
    
    return NextResponse.json(formatted);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

// POST /api/gestomag/families - Créer une famille
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const { code, label, image } = body;

    const family = await Family.create({ code, label, image });

    return NextResponse.json({
      ...family.toObject(),
      id: family._id
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
