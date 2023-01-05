import * as prismic from '@prismicio/client'

export function getPrismicClient() {
  return prismic.createClient(String(process.env.PRISMIC_API_URL), {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN
  })
}
