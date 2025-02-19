import React from "react";

export default function CheckInFamily() {
  return (
    <>
      <section className="checkin-section">
        <div className="container ptb-50">
          <h1 className="check-heading">Skip the Wait, Check-In Now</h1>
          <p className="check-para">
            {" "}
            Check-in early and enjoy your trip stress-free!
          </p>

          <div className="checkinbox">
            <div class="container">
              <div className="form-container">
                <form>
                  <div className="row mb-3">
                    <div className="col">
                      <label for="people" className="form-label">
                        No. of people
                      </label>
                      <select className="form-select" id="selectpeople">
                        <option selected>Select Item</option>
                        <option value="1">01</option>
                        <option value="2">02</option>
                        <option value="3">03</option>
                        <option value="4">04</option>
                        <option value="5">05</option>
                      </select>
                    </div>
                    <div className="col">
                      <label for="selectRoom" className="form-label">
                        No of kids
                      </label>
                      <select className="form-select" id="selectkids">
                        <option selected>Select Item</option>
                        <option value="1">01</option>
                        <option value="2">02</option>
                        <option value="3">03</option>
                        <option value="4">04</option>
                        <option value="5">05</option>
                      </select>
                    </div>
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
                  <h5 className="person-heading">Person 1</h5>

                  <div class="mt-3  person1">
                    <div className="mb-3">
                      <label for="fullName" className="form-label">
                        Full Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="fullName"
                      />
                    </div>

                    <div class="mb-3">
                      <label for="person1-contact" className="form-label">Contact</label>
                      <input
                        type="text"
                        class="form-control"
                        id="person1-contact"
                      />
                    </div>

                    <div className="mb-3">
                      <label for="uploadId" className="form-label">
                        Please upload any Government ID, size less than 100KB
                      </label>
                      <input
                        className="form-control"
                        type="file"
                        id="uploadId"
                      />
                      <div className="form-text">
                        *This Doc. will be used for check-in purpose only
                      </div>
                    </div>
                  </div>
                  <h5 className="person-heading mt-3">Person 2</h5>

                  <div class="mt-3 person1">
                    <div class="mb-3">
                      <label for="person2-name" className="form-label">Full Name</label>
                      <input
                        type="text"
                        class="form-control"
                        id="person2-name"
                      />
                    </div>
                    <div class="mb-3">
                      <label for="person2-contact" className="form-label">Contact</label>
                      <input
                        type="text"
                        class="form-control"
                        id="person2-contact"
                      />
                    </div>

                    <div className="mb-3">
                      <label for="uploadId" className="form-label">
                        Please upload any Government ID, size less than 100KB
                      </label>
                      <input
                        className="form-control"
                        type="file"
                        id="uploadId"
                      />
                      <div className="form-text">
                        *This Doc. will be used for check-in purpose only
                      </div>
                    </div>
                  </div>

                  <h5 className="mt-3 person-heading">Child 1</h5>

                  <div class="mt-3 person1">
                    <div class="row">
                      <div class=" col-md-6">
                        <label for="child1-name" className="form-label">Full Name</label>
                        <input
                          type="text"
                          class="form-control"
                          id="child1-name"
                        />
                      </div>
                      <div className="col-md-6">
                        <label for="selectRoom" className="form-label">
                          Child Age
                        </label>
                        <select className="form-select" id="selectkids">
                          <option selected>Select Item</option>
                          <option value="1">01</option>
                          <option value="2">02</option>
                          <option value="3">03</option>
                          <option value="4">04</option>
                          <option value="5">05</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <h5 className="person-heading mt-3">Child 2</h5>
                  <div class="mt-3 person1">
                    
                    <div class="row">
                      <div class="col-md-6">
                        <label for="child2-name" className="form-label">Full Name</label>
                        <input
                          type="text"
                          class="form-control"
                          id="child2-name"
                        />
                      </div>
                      <div className="col-md-6">
                        <label for="selectRoom" className="form-label">
                          Child Age
                        </label>
                        <select className="form-select" id="selectkids">
                          <option selected>Select Item</option>
                          <option value="1">01</option>
                          <option value="2">02</option>
                          <option value="3">03</option>
                          <option value="4">04</option>
                          <option value="5">05</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div class="mt-4">
                    <button type="submit" className="btn btn-submit w-100">
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="checkin-footer">
            <p>Let’s Stay in Touch! </p>
            <ul className="social-list-icons">
              <li>
                <a href="#">
                  <img
                    src="./assets/images/icons/whatsapp.png"
                    alt="Whatsapp Icon"
                  ></img>
                </a>
              </li>
              <li>
                <a href="#">
                  <img
                    src="./assets/images/icons/facebook.png"
                    alt="Facebook Icon"
                  ></img>
                </a>
              </li>
              <li>
                <a href="#">
                  <img
                    src="./assets/images/icons/insta.png"
                    alt="Instagram Icon"
                  ></img>
                </a>
              </li>
              <li>
                <a href="#">
                  <img src="./assets/images/icons/web.png" alt="Web Icon"></img>
                </a>
              </li>
              <li>
                <a href="#">
                  <img src="./assets/images/icons/x.png" alt="X Icon"></img>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
