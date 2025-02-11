import React from 'react'
import Topbar from '../components/header/Header'
import Footer from '../components/footer/Footer'
import Hero from '../components/blogs/Hero'
import About from '../components/blogs/about'
import BlogList from '../components/blogs/BlogList'

export default function blogs() {
  return (
    <>
      <Topbar/>
       <Hero/>
       <About/>
       <BlogList/>
      
      <Footer/>
    </>
  )
}
