import type { AppProps } from 'next/app'
import Script from 'next/script'

import Head from 'next/head'
import { inter } from "@/utils/fonts"

import 'node_modules/xterm/css/xterm.css'
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

      <Script src="node_modules/xterm/lib/xterm.js" />

      <Component {...pageProps} className={`App ${pageProps.className}`} />
    </>
  )
}
