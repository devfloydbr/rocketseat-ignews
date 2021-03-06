import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { SubscribeButton } from '../components/SubscribeButton'
import { stripe } from '../services/stripe'

import styles from './home.module.scss'

interface HomeProps {
  product: {
    priceId: string;
    amount: number;
  }
}

export default function Home({ product }: HomeProps) {
  return (
    <>
      <Head>
        <title>dev.floyd Next App</title>
      </Head>

      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏 Hey, welcome</span>
          <h1>News about the <span>React</span> world.</h1>
          <p>
            Get access to all publications <br/>
            <span>for {product.amount} month</span>
          </p>
          <SubscribeButton priceId={product.priceId}/>
        </section>

        <img src="/images/avatar.svg" alt="Girl coding"/>
      </main>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const data = await stripe.prices.retrieve('price_1IZJWyCcGpC65xFlEhN5T2Iu', {
    expand: ['product']
  });

  const product = {
    priceId: data.id,
    amount: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(data.unit_amount / 100)
  }

  return {
    props: {
      product
    }
  }
}
