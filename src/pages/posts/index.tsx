import { GetStaticProps } from 'next'
import Head from 'next/head'
import { predicate } from '@prismicio/client'
import { getPrismicClient } from '../../services/prismic'
import styles from './styles.module.scss'
import { asText } from '@prismicio/helpers'

import Link from 'next/link'

interface Post {
  slug: string
  title: string
  excerpt: string
  updatedAt: string
}

interface Props {
  posts: Post[]
}

export default function Posts({ posts }: Props) {
  return (
    <>
      <Head>
        <title>Posts | IgNews</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          {posts.map(post => (
            <Link key={post.slug} href={`/posts/${post.slug}`} legacyBehavior>
              <a>
                <time>{post.updatedAt}</time>
                <strong>{post.title}</strong>
                <p>{post.excerpt}</p>
              </a>
            </Link>
          ))}
        </div>
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient()

  const response = await prismic.query(
    [predicate.at('document.type', 'posts')],
    {
      fetch: ['posts.title', 'posts.content'],
      pageSize: 100
    }
  )

  const posts = response.results.map(post => {
    return {
      slug: post.uid,
      title: asText(post.data.title),
      excerpt:
        post.data.content.find(
          (content: { type: string }) => content.type === 'paragraph'
        )?.text ?? '',
      updatedAt: new Date(post.last_publication_date).toLocaleDateString(
        'pt-BR',
        {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        }
      )
    }
  })

  return {
    props: {
      posts
    }
  }
}
