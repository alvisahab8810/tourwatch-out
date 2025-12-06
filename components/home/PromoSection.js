import React from 'react'

export default function PromoSection() {
  return (
     <div className='promo-container'>
       <div className='mobile-none'>
        <div class="mini-container1">
     <section class="promo-section">
    
        <h2 class="promo-title">Flat 20% Off</h2>
        <p class="promo-subtitle">on Your First Tour Package!</p>
        <button class="promo-button interactive" data-bs-toggle="modal"
                    data-bs-target="#exampleModalCenter">Get a Callback</button>
    </section>
      </div>
       </div>


       <div className='desktop-none mobile-promoe'>

     <section class="promo-section">
    
        <div className='promot-contant-area'>
          <h2 class="promo-title">Flat<br/> 20% Off</h2>
        <p class="promo-subtitle">on Your First Tour Package!</p>
        <button class="promo-button interactive" data-bs-toggle="modal"
                    data-bs-target="#exampleModalCenter">Get a Callback</button>
        </div>
    </section>
       </div>
     </div>


  )
}
