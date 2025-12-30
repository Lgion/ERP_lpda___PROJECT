import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import Client from '@/models/gestomag/Client';

// GET /api/gestomag/clients - Liste tous les clients
export async function GET() {
  try {
    await dbConnect();
    const clients = await Client.find({}).sort({ createdAt: -1 });
    
    const formatted = clients.map(c => ({
      ...c.toObject(),
      id: c._id
    }));
    
    return NextResponse.json(formatted);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

// POST /api/gestomag/clients - Créer un client
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const { name, type, phone, city } = body;

    const client = await Client.create({ name, type, phone, city });

    return NextResponse.json({
      ...client.toObject(),
      id: client._id
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
