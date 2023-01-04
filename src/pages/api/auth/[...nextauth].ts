import { query as q } from 'faunadb'
import NextAuth, { NextAuthOptions } from 'next-auth'
import GitHubProvider from 'next-auth/providers/github'

import { fauna } from '../../../services/fauna'

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: String(process.env.GITHUB_ID),
      clientSecret: String(process.env.GITHUB_SECRET)
    })
  ],
  callbacks: {
    async session({ session, user, token }) {
      try {
        const userActiveSubscription = await fauna.query(
          q.Get(
            q.Intersection([
              q.Match(
                q.Index('subscription_by_user_ref'),
                q.Select(
                  'ref',
                  q.Get(
                    q.Match(
                      q.Index('user_by_email'),
                      q.Casefold(session.user?.email ?? '')
                    )
                  )
                )
              ),
              q.Match(q.Index('subscription_by_status'), 'active')
            ])
          )
        )

        return {
          ...session,
          activeSubscription: userActiveSubscription
        }
      } catch {
        return {
          ...session,
          activeSubscription: null
        }
      }
    },
    async signIn({ user, account, profile, email, credentials }) {
      try {
        await fauna.query(
          q.If(
            q.Not(
              q.Exists(
                q.Match(q.Index('user_by_email'), q.Casefold(user.email ?? ''))
              )
            ),
            q.Create(q.Collection('users'), { data: { email: user.email } }),
            q.Get(
              q.Match(q.Index('user_by_email'), q.Casefold(user.email ?? ''))
            )
          )
        )

        return true
      } catch {
        return false
      }
    }
  }
}

export default NextAuth(authOptions)
