import React from 'react'
import Topbar from '../components/header/Header'
import Footer from '../components/footer/Footer'
import Hero from '../components/blogs/Hero'
import BlogList from '../components/blogs/BlogList'
import About from '../components/blogs/About'

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
