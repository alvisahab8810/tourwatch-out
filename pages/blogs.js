import Head from "next/head";
import Topbar from "../components/header/Header";
import Offcanvas from "../components/header/Offcanvas";
import Hero from "../components/blogs/Hero";
import About from "../components/blogs/About";
import BlogList from "../components/blogs/BlogList";
import NewFooter from "../components/footer/NewFooter";

export default function BlogsPage() {
  return (
    <>
      <Head>
        <title>Travel Blogs — Tourwatchout</title>
        <meta name="description" content="Travel tips, stories and inspiration from Tourwatchout." />
        <link rel="stylesheet" href="/assets/css/blogs.css" />
      </Head>
      <Topbar />
      <Offcanvas />
      {/* <Hero /> */}
      <div className="packages-hero-area">
        <img
          src="/assets/images/blogs/blog-hero.webp"
          alt="Blogs Hero"
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      </div>
      {/* <About /> */}
      <BlogList />
      <NewFooter />
    </>
  );
}
