import '../styles/globals.css';
import type { AppProps } from "next/app";
import Head from "next/head";
import Script from "next/script";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>My Rhai Landing</title>
        <meta name="description" content="Mi plataforma con Tawk.to chat en vivo" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Tawk.to – verifica que el src coincida con tu widget del panel */}
      <Script id="tawkto-chat-widget" strategy="afterInteractive">
        {`
          var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
          (function(){
            var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
            s1.async=true;
            s1.src='https://embed.tawk.to/683ad95ead4d94190a34c1c0/1isiu262i';
            s1.charset='UTF-8';
            s1.setAttribute('crossorigin','*');
            s0.parentNode.insertBefore(s1,s0);
          })();
        `}
      </Script>

      <Component {...pageProps} />
    </>
  );
}
