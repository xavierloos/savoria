import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  if (!process.env.DATABASE_URL || !process.env.DATABASE_URL.startsWith('mongo')) {
    return NextResponse.json({ 
      error: 'Database not configured. Please add a valid MongoDB connection string to the DATABASE_URL secret.' 
    }, { status: 500 });
  }

  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
      },
    });
    return NextResponse.json(orders);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch orders' }, { status: 500 });
  }
}
