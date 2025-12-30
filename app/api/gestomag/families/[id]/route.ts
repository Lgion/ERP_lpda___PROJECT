import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import Family from '@/models/gestomag/Family';

type RouteParams = { params: Promise<{ id: string }> };

// PUT /api/gestomag/families/:id - Mettre à jour une famille
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();
    const { code, label, image } = body;

    const family = await Family.findByIdAndUpdate(
      id,
      { code, label, image },
      { new: true }
    );

    return NextResponse.json({
      ...family.toObject(),
      id: family._id
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

// DELETE /api/gestomag/families/:id - Supprimer une famille
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    await dbConnect();
    const { id } = await params;
    await Family.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
