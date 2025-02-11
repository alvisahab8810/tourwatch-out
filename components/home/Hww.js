import React from "react";
import Link from "next/link";

export default function Hww() {
  return (
    <>
      <section className="how-we-work-container ptb-80">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="right-list">
                <div className="main-list">
                  <div className="numbers">
                    <div>1</div>
                  </div>
                  <div className="right-content-bx">
                    <h2>Get A Call</h2>
                    
                  </div>
                </div>

                <div className="main-list ">
                  <div className="numbers">
                    <div>2</div>
                  </div>
                  <div className="right-content-bx">
                    <h2>Choose Packages</h2>
                    
                  </div>
                </div>

                <div className="main-list ">
                  <div className="numbers">
                    <div>3</div>
                  </div>
                  <div className="right-content-bx">
                    <h2>Enjoy Your Journey</h2>
                  </div>
                </div>
              </div>

              <Link href="#" className="main-btn1 desktop-none">
                Book now
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
