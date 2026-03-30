import { NextResponse } from 'next/server';
import { getCurrentUserId } from '@/lib/session';
import { stripe } from '@/lib/stripe';
import prisma from '@/lib/prisma';

export async function POST() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { subscription: true },
    });

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const priceId = process.env.STRIPE_PREMIUM_PRICE_ID;
    if (!priceId) {
      return NextResponse.json({ error: 'Stripe price ID not configured' }, { status: 500 });
    }

    let customerId = user.subscription?.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email || undefined,
        name: user.name || undefined,
        metadata: { userId: user.id },
      });
      customerId = customer.id;

      await prisma.subscription.upsert({
        where: { userId },
        update: { stripeCustomerId: customerId },
        create: { userId, stripeCustomerId: customerId, plan: 'free' },
      });
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/en/settings?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/en/settings?canceled=true`,
      metadata: { userId },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
