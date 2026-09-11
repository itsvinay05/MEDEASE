
import { NextRequest, NextResponse } from 'next/server';
import { globalStore } from '@/lib/serverStore';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const rx = globalStore.prescriptions[id];
  const filename = rx?.original_filename || 'actual_prescription.png';
  return NextResponse.redirect(new URL(`/fixtures/${filename}`, request.url));
}
