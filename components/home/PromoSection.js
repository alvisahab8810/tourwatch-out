import React from 'react'

export default function PromoSection() {
  return (
     <div className='promo-container'>
       <div className='mobile-none'>
        <div className="mini-container1">
     <section className="promo-section">

        <h2 className="promo-title">Flat 20% Off</h2>
        <p className="promo-subtitle">on Your First Tour Package!</p>
        <button className="promo-button interactive" data-bs-toggle="modal"
                    data-bs-target="#exampleModalCenter">Get a Callback</button>
    </section>
      </div>
       </div>


       <div className='desktop-none mobile-promoe'>

     <section className="promo-section">

        <div className='promot-contant-area'>
          <h2 className="promo-title">Flat<br/> 20% Off</h2>
        <p className="promo-subtitle">on Your First Tour Package!</p>
        <button className="promo-button interactive" data-bs-toggle="modal"
                    data-bs-target="#exampleModalCenter">Get a Callback</button>
        </div>
    </section>
       </div>
     </div>


  )
}
