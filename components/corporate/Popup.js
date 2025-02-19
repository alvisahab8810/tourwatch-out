import React from "react";

export default function Popup() {
  return (
    <>
      <div
        className="modal popup-modal fade "
        id="exampleModalCenter"
        tabIndex="-1"
        aria-labelledby="exampleModalCenterTitle"
        aria-modal="true"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="popup-img">
                <img src="./assets/images/corporate/ad.png" alt="Ad Image" />
              </div>

              <div className="form-pop">
                <h2>Get A Callback</h2>
                <p>Let us help you decide your Dream Vacation</p>
                <form>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                      Your Name
                    </label>
                    <input type="name" className="form-control" />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="exampleInputPassword1" className="form-label">
                      Phone Number
                    </label>
                    <input type="password" className="form-control" />
                  </div>

                  <button type="submit" className="btn submit-btn">
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}



