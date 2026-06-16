// import Head from "next/head";
// import Script from "next/script";

// function MyApp({ Component, pageProps }) {
//   return (
//     <>
//       <Head>

//         <link rel="preconnect" href="https://fonts.googleapis.com"/>
//         {/* <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin/> */}
//         <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap" rel="stylesheet"></link>
//         <link
//           rel="icon"
//           type="image/x-icon"
//           href="./assets/images/favicon.png"
//         />
//         {/* <meta
//           name="robots"
//           content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
//         /> */}

//         <meta name="robots" content="noindex, nofollow"/>
//         {/* Inline critical CSS if applicable */}
//         <link rel="stylesheet" href="/assets/css/bootstrap.min.css" />
//         <link rel="stylesheet" href="/assets/css/style.css" />
//         <link rel="stylesheet" href="/assets/css/home.css" />

//         <link rel="stylesheet" href="/assets//css/responsive.css" />
//         <link rel="stylesheet" href="/assets//css/responsive-new.css" />


//         <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css"/>

//         <link
//           rel="stylesheet"
//           href="https://fonts.googleapis.com/css2?family=Material+Icons+Round"
//         />
//         <link
//           href="https://cdn.jsdelivr.net/npm/remixicon@2.2.0/fonts/remixicon.css"
//           rel="stylesheet"
//         />

//         <link
//           rel="stylesheet"
//           href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css"
//         />

        

//         <title>tourwatchout</title>
//       </Head>

//       {/* Non-Critical Scripts */}
//       <Script src="/assets/js/jquery.min.js" defer />
//       <Script src="/assets/js/bootstrap.bundle.min.js" defer />
//       <Script src="/assets/js/main.js" defer />
//       <Script
//         src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"
//         strategy="lazyOnload"
//       />

//       <Component {...pageProps} />
//     </>
//   );
// }

// export default MyApp;


import Head from "next/head";
import Script from "next/script";
import { Toaster } from "react-hot-toast";

function MyApp({ Component, pageProps }) {
  const getLayout = Component.getLayout ?? ((page) => page);
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        

        <link rel="preconnect" href="https://fonts.googleapis.com"></link>
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap"
          rel="stylesheet"
        ></link>

        <link
          rel="icon"
          type="image/x-icon"
          href="/assets/images/favicon.png"
        />

        {/* IMPORTANT: allow indexing */}
        <meta
          name="robots"
          content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        />

        <link rel="stylesheet" href="/assets/css/bootstrap.min.css"></link>
        <link rel="stylesheet" href="/assets/css/style.css"></link>
        <link rel="stylesheet" href="/assets/css/home.css"></link>
        <link rel="stylesheet" href="/assets/css/responsive.css"></link>
        <link rel="stylesheet" href="/assets/css/responsive-new.css"></link>

        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css"
        ></link>

        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Icons+Round"
        ></link>

        <link
          href="https://cdn.jsdelivr.net/npm/remixicon@2.2.0/fonts/remixicon.css"
          rel="stylesheet"
        ></link>

        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css"
        ></link>


        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
        <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet"/>



        <title>Tourwatchout</title>
      </Head>

      {/* Google Tag Manager — must live outside next/head's <Head>, next/script handles injection itself */}
      <Script
        id="gtm-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-WF5WRLK3');`,
        }}
      />
      {/* End Google Tag Manager */}

      {/* Scripts */}
      <Script src="/assets/js/jquery.min.js" strategy="afterInteractive" />
      <Script src="/assets/js/bootstrap.bundle.min.js" strategy="afterInteractive" />
      <Script src="/assets/js/main.js" strategy="afterInteractive" />
      <Script
        src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"
        strategy="lazyOnload"
      />

      <Toaster
        position="top-right"
        gutter={10}
        containerStyle={{ top: 20, right: 20 }}
        toastOptions={{
          duration: 4500,
          style: {
            fontFamily: "-apple-system, 'SF Pro Display', 'Segoe UI', sans-serif",
            fontSize: 13,
            fontWeight: 500,
            background: "rgba(255,255,255,0.92)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            color: "#1d1d1f",
            borderRadius: 14,
            padding: "12px 16px",
            boxShadow: "0 4px 24px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.08), inset 0 0 0 0.5px rgba(0,0,0,0.08)",
            maxWidth: 360,
            lineHeight: 1.45,
            border: "none",
          },
          success: {
            iconTheme: { primary: "#34c759", secondary: "#fff" },
          },
          error: {
            iconTheme: { primary: "#ff3b30", secondary: "#fff" },
          },
        }}
      />
      {getLayout(<Component {...pageProps} />)}
    </>
  );
}

export default MyApp;
