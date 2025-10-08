import Stripe from 'stripe'
import dotenv from 'dotenv'

dotenv.config()

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null

export async function createCheckoutSession(email, plan) {
  if (!stripe) {
    throw new Error('Stripe not configured')
  }

  const prices = {
    premium: {
      amount: 499, // $4.99
      currency: 'usd',
      interval: 'month'
    },
    onetime: {
      amount: 99, // $0.99
      currency: 'usd'
    }
  }

  const priceData = prices[plan]
  if (!priceData) {
    throw new Error('Invalid plan')
  }

  const sessionConfig = {
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: priceData.currency,
          product_data: {
            name: plan === 'premium' ? 'ConvertAI Premium' : 'One-Time Conversion',
            description: plan === 'premium' 
              ? 'Unlimited conversions with advanced AI features'
              : 'Single file conversion'
          },
          unit_amount: priceData.amount,
          ...(priceData.interval && {
            recurring: {
              interval: priceData.interval
            }
          })
        },
        quantity: 1
      }
    ],
    mode: plan === 'premium' ? 'subscription' : 'payment',
    success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND_URL}/`,
    customer_email: email,
    metadata: {
      plan
    }
  }

  const session = await stripe.checkout.sessions.create(sessionConfig)
  return session
}

export async function createCustomerPortalSession(customerId) {
  if (!stripe) {
    throw new Error('Stripe not configured')
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.FRONTEND_URL}/account`
  })

  return session
}

export async function handleWebhook(payload, signature) {
  if (!stripe) {
    throw new Error('Stripe not configured')
  }

  const event = stripe.webhooks.constructEvent(
    payload,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET
  )

  return event
}

export async function cancelSubscription(subscriptionId) {
  if (!stripe) {
    throw new Error('Stripe not configured')
  }

  const subscription = await stripe.subscriptions.cancel(subscriptionId)
  return subscription
}

