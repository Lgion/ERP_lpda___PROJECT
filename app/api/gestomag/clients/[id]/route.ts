import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import Client from '@/models/gestomag/Client';

type RouteParams = { params: Promise<{ id: string }> };

// GET /api/gestomag/clients/:id - Récupérer un client
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await dbConnect();
    const { id } = await params;
    const client = await Client.findById(id);

    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    return NextResponse.json({
      ...client.toObject(),
      id: client._id
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

// PUT /api/gestomag/clients/:id - Mettre à jour un client
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();
    const { name, type, phone, city } = body;

    const client = await Client.findByIdAndUpdate(
      id,
      { name, type, phone, city },
      { new: true }
    );

    return NextResponse.json({
      ...client.toObject(),
      id: client._id
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

// DELETE /api/gestomag/clients/:id - Supprimer un client
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    await dbConnect();
    const { id } = await params;
    await Client.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
