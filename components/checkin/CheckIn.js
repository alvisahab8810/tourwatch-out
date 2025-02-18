import React from "react";

export default function CheckIn() {
  return (
    <>
      <section className="checkin-section">
        <div className="container ptb-50">
          <h1 className="check-heading">Seamless Check-In, Zero Delays</h1>
          <p className="check-para"> Optimize your travel—check-in before arrival.</p>

          <div className="checkinbox">
            <div className="form-container">
              <form>
                <div className="mb-3">
                  <label for="companyName" className="form-label">
                    Company Name
                  </label>
                  <input
                    type="text"
                    className="form-control form-control1"
                    id="companyName"
                  />
                </div>
                <div className="mb-3">
                  <label for="fullName" className="form-label">
                    Full Name
                  </label>
                  <input type="text" className="form-control" id="fullName" />
                </div>
                <div className="mb-3">
                  <label for="whatsappContact" className="form-label">
                    WhatsApp Contact
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="whatsappContact"
                  />
                </div>
                <div className="mb-3">
                  <label for="emailAddress" className="form-label">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="emailAddress"
                  />
                </div>
                <div className="row mb-3">
                  <div className="col">
                    <label for="occupancy" className="form-label">
                      Occupancy
                    </label>
                    <select className="form-select" id="occupancy">
                      <option selected>Select room</option>
                      <option value="1">Single</option>
                      <option value="2">Double</option>
                      <option value="3">Suite</option>
                    </select>
                  </div>
                  <div className="col">
                    <label for="selectRoom" className="form-label">
                      Select Room
                    </label>
                    <select className="form-select" id="selectRoom">
                      <option selected>Select room</option>
                      <option value="1">Room 101</option>
                      <option value="2">Room 102</option>
                      <option value="3">Room 103</option>
                    </select>
                  </div>
                </div>
                <div className="mb-3">
                  <label for="uploadId" className="form-label">
                    Please upload any Government ID, size less than 100KB
                  </label>
                  <input className="form-control" type="file" id="uploadId" />
                  <div className="form-text">
                    *This Doc. will be used for check-in purpose only
                  </div>
                </div>
                <button type="submit" className="btn btn-submit w-100">
                  Submit
                </button>
              </form>
            </div>
          </div>
          <div className="checkin-footer">
             <p>Let’s Stay in Touch! </p>
             <ul className="social-list-icons">
                <li><a href="#"><img src="./assets/images/icons/whatsapp.png" alt="Whatsapp Icon"></img></a></li>
                <li><a href="#"><img src="./assets/images/icons/facebook.png" alt="Facebook Icon"></img></a></li>
                <li><a href="#"><img src="./assets/images/icons/insta.png" alt="Instagram Icon"></img></a></li>
                <li><a href="#"><img src="./assets/images/icons/web.png" alt="Web Icon"></img></a></li>
                <li><a href="#"><img src="./assets/images/icons/x.png" alt="X Icon"></img></a></li>
             </ul>
          </div>
        </div>
      </section>
    </>
  );
}
