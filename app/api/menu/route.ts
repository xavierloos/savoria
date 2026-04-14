import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  if (!process.env.DATABASE_URL || !process.env.DATABASE_URL.startsWith('mongo')) {
    return NextResponse.json({ 
      error: 'Database not configured. Please add a valid MongoDB connection string to the DATABASE_URL secret.' 
    }, { status: 500 });
  }

  try {
    const menuItems = await prisma.menuItem.findMany({
      include: {
        category: true,
      },
      where: {
        isAvailable: true,
      },
    });
    return NextResponse.json(menuItems);
  } catch (error: any) {
    console.error('Failed to fetch menu items:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch menu items' }, { status: 500 });
  }
}
