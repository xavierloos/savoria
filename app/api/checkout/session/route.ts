import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';
import { checkoutSchema } from '@/validators/checkout';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // 1. Validate input
    const result = checkoutSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: 'Invalid input', details: result.error.issues }, { status: 400 });
    }

    const { customerName, customerEmail, customerPhone, items } = result.data;

    // 2. Fetch menu items from DB to ensure prices are accurate
    const menuItemIds = items.map((item) => item.menuItemId);
    const menuItems = await prisma.menuItem.findMany({
      where: { id: { in: menuItemIds }, isAvailable: true },
    });

    if (menuItems.length !== items.length) {
      return NextResponse.json({ error: 'Some items are unavailable or invalid' }, { status: 400 });
    }

    // 3. Calculate total and prepare order items
    let totalAmount = 0;
    const orderItemsData = items.map((item) => {
      const menuItem = menuItems.find((m) => m.id === item.menuItemId)!;
      totalAmount += menuItem.price * item.quantity;
      return {
        menuItemId: menuItem.id,
        quantity: item.quantity,
        price: menuItem.price,
      };
    });

    // 4. Create Order in DB (Pending status)
    const order = await prisma.order.create({
      data: {
        customerName,
        customerEmail,
        customerPhone,
        totalAmount,
        status: 'NEW',
        paymentStatus: 'PENDING',
        items: {
          create: orderItemsData,
        },
      },
    });

    // 5. Create Stripe Checkout Session
    const lineItems = items.map((item) => {
      const menuItem = menuItems.find((m) => m.id === item.menuItemId)!;
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: menuItem.name,
            images: [menuItem.image],
          },
          unit_amount: Math.round(menuItem.price * 100), // Stripe expects cents
        },
        quantity: item.quantity,
      };
    });

    const appUrl = process.env.APP_URL || 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${appUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/cart?canceled=true`,
      customer_email: customerEmail,
      metadata: {
        orderId: order.id,
      },
    });

    // 6. Update order with Stripe Session ID
    await prisma.order.update({
      where: { id: order.id },
      data: { stripeSessionId: session.id },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
