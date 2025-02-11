import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";

const InfographicsSlider = () => {
    return (
        <section className="ux-section ux-container mt-5 margin-top-15 ">
            <h3 className="text-orange main-heading text-center font-size-28">
                Our Approach to Infographics Design
            </h3>
            <p className="textfff text-center max-width100 mt-3">
                At Viralon, we believe that infographics should not only present data
                but also tell a compelling story. Here's how we approach infographic
                design.
            </p>
            <div className="container">
                {/* Swiper */}
                <Swiper
          spaceBetween={30}
          centeredSlides={true}
          slidesPerView={1}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable:true
          }}
          navigation={{
            nextEl: ".swiper-button-next2",
            prevEl: ".swiper-button-prev2",
            
          }}
          modules={[Autoplay, Navigation]}
          className="mySwiper footer-ux-con swiper-initialized swiper-horizontal swiper-backface-hidden"
        >
                    {/* Slide 1 */}
                    <SwiperSlide>
                        <div className="slider-row">
                            <div className="slider-row-content">
                                <h4>1 / 6</h4>
                                <div className="under-r-content">
                                    <h2>Understanding Your Message</h2>
                                    <p>
                                        We begin by thoroughly understanding the message you want
                                        to convey and the audience you want to reach.
                                    </p>
                                </div>
                            </div>
                            <div className="slider-row-img">
                                <img
                                    src="/images/design/ui-ux/slider/info-img1.jpg"
                                    alt="Understanding Message Image"
                                />
                            </div>
                        </div>
                    </SwiperSlide>

                    {/* Slide 2 */}
                    <SwiperSlide>
                        <div className="slider-row">
                            <div className="slider-row-content">
                                <h4>2 / 6</h4>
                                <div className="under-r-content">
                                    <h2>Data Analysis</h2>
                                    <p>
                                        If your infographic includes data, we analyze and
                                        structure it in a way that is easy to understand and
                                        highlights key insights.
                                    </p>
                                </div>
                            </div>
                            <div className="slider-row-img">
                                <img
                                    src="/images/design/ui-ux/slider/info-img2.jpg"
                                    alt="Data Analysis"
                                />
                            </div>
                        </div>
                    </SwiperSlide>

                    {/* Slide 3 */}
                    <SwiperSlide>
                        <div className="slider-row">
                            <div className="slider-row-content">
                                <h4>3 / 6</h4>
                                <div className="under-r-content">
                                    <h2>Visual Concept</h2>
                                    <p>
                                        Our experienced designers brainstorm creative visual
                                        concepts, considering color schemes, typography, and
                                        graphical elements that align with your brand.
                                    </p>
                                </div>
                            </div>
                            <div className="slider-row-img">
                                <img
                                    src="/images/design/ui-ux/slider/info-img3.jpg"
                                    alt="Visual Concept Image"
                                />
                            </div>
                        </div>
                    </SwiperSlide>

                    {/* Slide 4 */}
                    <SwiperSlide>
                        <div className="slider-row">
                            <div className="slider-row-content">
                                <h4>4 / 6</h4>
                                <div className="under-r-content">
                                    <h2>Engaging Design</h2>
                                    <p>
                                        We craft engaging and visually appealing infographics that
                                        effectively communicate your message, whether it's a
                                        process explanation, data visualization, or a storytelling
                                        piece.
                                    </p>
                                </div>
                            </div>
                            <div className="slider-row-img">
                                <img
                                    src="/images/design/ui-ux/slider/info-img4.jpg"
                                    alt=" Engaging Design Image"
                                />
                            </div>
                        </div>
                    </SwiperSlide>

                    {/* Slide 5 */}
                    <SwiperSlide>
                        <div className="slider-row">
                            <div className="slider-row-content">
                                <h4>5 / 6</h4>
                                <div className="under-r-content">
                                    <h2>Feedback and Iteration</h2>
                                    <p>
                                        We value your input and work closely with you to refine
                                        the design until it perfectly represents your vision.
                                    </p>
                                </div>
                            </div>
                            <div className="slider-row-img">
                                <img
                                    src="/images/design/ui-ux/slider/info-img5.jpg"
                                    alt="Feedback Image"
                                />
                            </div>
                        </div>
                    </SwiperSlide>

                    {/* Slide 6 */}
                    <SwiperSlide>
                        <div className="slider-row">
                            <div className="slider-row-content">
                                <h4>6 / 6</h4>
                                <div className="under-r-content">
                                    <h2>High-Quality Files</h2>
                                    <p>
                                        We provide you with high-resolution infographic files in
                                        various formats, ensuring they look sharp and professional
                                        across different media.
                                    </p>
                                </div>
                            </div>
                            <div className="slider-row-img">
                                <img
                                    src="/images/design/ui-ux/slider/info-img6.jpg"
                                    alt=" High-Quality Files Image"
                                />
                            </div>
                        </div>
                    </SwiperSlide>
                </Swiper>
                 {/* Navigation Buttons */}
               <div
          className="swiper-button-next2"
          tabIndex="0"
          role="button"
          aria-label="Next slide"
          aria-controls="swiper-wrapper-e82ff2c1ac46839d"
          aria-disabled="false"
        >
          <img src="/images/icons/right-arrow.png" alt="Next" />
        </div>
        <div
          className="swiper-button-prev2"
          tabIndex="0"
          role="button"
          aria-label="Previous slide"
          aria-controls="swiper-wrapper-e82ff2c1ac46839d"
          aria-disabled="false"
        >
          <img src="/images/icons/left-arrow.png" alt="Previous" />
        </div>

        {/* Notification span */}
            </div>
        </section>
    );
};

export default InfographicsSlider;
