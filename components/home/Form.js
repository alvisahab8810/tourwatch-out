import React from "react";

export default function Form() {
  return (
    <>
      <section className="form-section">
        <div className="container p-relative">
          <div className="container-form">
            <form>
              <div className="form-row">
                <div className="form-group col-md-3">
                  <label htmlFor="full-name">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="full-name"
                    placeholder="Madhav Singh"
                  />
                </div>
                <div className="form-group col-md-3">
                  <label htmlFor="destination">Destination</label>
                  <select
                    className="form-select"
                    aria-label="Default select example"
                  >
                    <option>Dubai</option>
                    <option>One</option>
                    <option>Two</option>
                    <option>Three</option>
                  </select>
                </div>

                <div className="form-group col-md-3">
                  <label htmlFor="contact">Contact</label>
                  <input
                    type="text"
                    className="form-control"
                    id="contact"
                    placeholder="9876543210"
                  />
                </div>
                <div className="form-group col-md-3">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    placeholder="madhavsingh365@rediffmail.com"
                  />
                </div>

                <div className="form-group col-md-3 margin-bottom d-flex justify-content-end">
                  <button type="submit" className="btn btn-danger">
                    Get A Call
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
