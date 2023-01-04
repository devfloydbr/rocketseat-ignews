import Stripe from 'stripe'

import packageinfo from '../../../../package.json'

export const stripe = new Stripe(String(process.env.STRIPE_API_KEY), {
  apiVersion: '2022-11-15',
  appInfo: {
    name: 'igNews',
    url: 'https://localhost:3000',
    version: packageinfo.version
  },
  typescript: true
})
