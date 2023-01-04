import { query as q } from 'faunadb'
import { fauna } from '../../../services/fauna'
import { Stripe } from 'stripe'

import packageinfo from '../../../../package.json'

const stripe = new Stripe(String(process.env.STRIPE_API_KEY), {
  apiVersion: '2022-11-15',
  appInfo: {
    name: 'igNews',
    version: packageinfo.version
  }
})
export async function saveSubscription(
  subscriptionId: string,
  customerId: string,
  createAction = false
) {
  console.log('saveSubscription')
  const userRef = await fauna.query(
    q.Select(
      'ref',
      q.Get(q.Match(q.Index('user_by_stripe_customer_id'), customerId))
    )
  )

  const subscription = await stripe.subscriptions.retrieve(subscriptionId)

  const subscriptionData = {
    id: subscription.id,
    userId: userRef,
    status: subscription.status,
    price_id: subscription.items.data[0].price.id
  }

  if (createAction) {
    await fauna.query(
      q.Create(q.Collection('subscriptions'), { data: subscriptionData })
    )
  } else {
    await fauna.query(
      q.Replace(
        q.Select(
          'ref',
          q.Get(q.Match(q.Index('subscription_by_id'), subscription.id))
        ),
        { data: subscriptionData }
      )
    )
  }
}
