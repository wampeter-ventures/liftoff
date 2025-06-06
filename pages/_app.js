import '../styles/globals.css';
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta charset="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
        <title>Liftoff - Build. Boost. Blast...or BOOM!</title>
        <meta name="description" content="A collaborative dice game where players work together to assemble rockets and reach for the stars. Will you launch to victory or explode in spectacular failure?" />
        <meta name="keywords" content="dice game, rocket, multiplayer, collaborative, space, board game" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Liftoff - Build. Boost. Blast...or BOOM!" />
        <meta property="og:description" content="A collaborative dice game where players work together to assemble rockets and reach for the stars." />
        <meta property="og:image" content="/rocket_big.png" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Liftoff - Build. Boost. Blast...or BOOM!" />
        <meta name="twitter:description" content="A collaborative dice game where players work together to assemble rockets and reach for the stars." />
        <meta name="twitter:image" content="/rocket_big.png" />

        {/* PWA & Mobile */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1a1a2e" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/icon-192.png" />

        {/* External Resources */}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;