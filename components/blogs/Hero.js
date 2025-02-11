import React from 'react'

export default function Hero() {
  return (
    <>
       <section className="blogs-hero ">
        <div className="container">
            <div className="row align-items-center pt-200">
                <div className="col-md-12 about-contennt">
                    <h2 className="fs-64 text-white fw-bold ">Travel Tips, Stories & Inspiration</h2>
                    <p>Find Travel Tips, Stories & Inspiration</p>
                    <div className="blogs-searchbx">
                       <input type="search" alt="Search Blog" placeholder="Search Blog"/>
                       <button><img src="./assets/images/blogs/icons/search.png" alt="Search Icon"/>Search</button>
                    </div>

                </div>
            </div>
        </div>
    </section>
    </>
  )
}
