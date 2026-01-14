import Head from "next/head";
import Script from "next/script";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>

        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        {/* <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin/> */}
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap" rel="stylesheet"></link>
        <link
          rel="icon"
          type="image/x-icon"
          href="./assets/images/favicon.png"
        />
        {/* <meta
          name="robots"
          content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        /> */}

        <meta name="robots" content="noindex, nofollow"/>
        {/* Inline critical CSS if applicable */}
        <link rel="stylesheet" href="/assets/css/bootstrap.min.css" />
        <link rel="stylesheet" href="/assets/css/style.css" />
        <link rel="stylesheet" href="/assets/css/home.css" />

        <link rel="stylesheet" href="/assets//css/responsive.css" />
        <link rel="stylesheet" href="/assets//css/responsive-new.css" />


        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css"/>

        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Icons+Round"
        />
        <link
          href="https://cdn.jsdelivr.net/npm/remixicon@2.2.0/fonts/remixicon.css"
          rel="stylesheet"
        />

        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css"
        />

        

        <title>tourwatchout</title>
      </Head>

      {/* Non-Critical Scripts */}
      <Script src="/assets/js/jquery.min.js" defer />
      <Script src="/assets/js/bootstrap.bundle.min.js" defer />
      <Script src="/assets/js/main.js" defer />
      <Script
        src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"
        strategy="lazyOnload"
      />

      <Component {...pageProps} />
    </>
  );
}

export default MyApp;


