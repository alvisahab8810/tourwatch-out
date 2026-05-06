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
        <title>Travel Blogs — TourWatchOut</title>
        <meta name="description" content="Travel tips, stories and inspiration from TourWatchOut." />
        <link rel="stylesheet" href="/assets/css/blogs.css" />
      </Head>
      <Topbar />
      <Offcanvas />
      <Hero />
      <About />
      <BlogList />
      <NewFooter />
    </>
  );
}
