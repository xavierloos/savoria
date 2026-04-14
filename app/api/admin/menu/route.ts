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
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(menuItems);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch menu items' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, description, price, image, tags, categoryId, isAvailable } = body;

    const menuItem = await prisma.menuItem.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        image,
        tags: tags || [],
        categoryId,
        isAvailable: isAvailable ?? true,
      },
    });

    return NextResponse.json(menuItem);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create menu item' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, name, description, price, image, tags, categoryId, isAvailable } = body;

    const menuItem = await prisma.menuItem.update({
      where: { id },
      data: {
        name,
        description,
        price: parseFloat(price),
        image,
        tags: tags || [],
        categoryId,
        isAvailable,
      },
    });

    return NextResponse.json(menuItem);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update menu item' }, { status: 500 });
  }
}
