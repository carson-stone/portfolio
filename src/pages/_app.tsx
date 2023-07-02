import type { AppProps } from 'next/app'

import Head from 'next/head'
import { inter } from "@/utils/fonts"

import '@/styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      {/* global font */}
      <style
        jsx
        global
      >
        {`
        html {
          font-family: ${inter.style.fontFamily};
        }
      `}
      </style>

      <Head>
        <title>Carson Stone</title>
      </Head>

      <Component {...pageProps} className={`App ${pageProps.className}`} />
    </>
  )
}
