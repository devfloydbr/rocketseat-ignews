import * as prismic from '@prismicio/client'

export function getPrismicClient(req?: unknown) {
  return prismic.createClient(String(process.env.PRISMIC_API_URL), {
    // @ts-ignore
    req,
    accessToken: process.env.PRISMIC_ACCESS_TOKEN
  })
}
