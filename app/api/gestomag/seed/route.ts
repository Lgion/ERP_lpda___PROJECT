import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import Family from '@/models/gestomag/Family';

// POST /api/gestomag/seed - Initialiser les familles par défaut
export async function POST() {
  try {
    await dbConnect();
    
    const families = [
      { code: 'ELEC', label: 'Électronique' },
      { code: 'MÉNAG', label: 'Électroménager' },
      { code: 'INFO', label: 'Informatique' },
      { code: 'TEL', label: 'Téléphonie' },
      { code: 'AUTRE', label: 'Autres' },
    ];

    for (const family of families) {
      await Family.findOneAndUpdate(
        { code: family.code },
        family,
        { upsert: true, new: true }
      );
    }

    return NextResponse.json({ message: 'Seeding completed' });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
