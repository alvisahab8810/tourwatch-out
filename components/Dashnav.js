import React from 'react'
import Link from 'next/link'

export default function Dashnav() {
  return (


    <div className='main-nav'>
      <nav className="navbar">
          <div className="col-12">
            <div className="navbar-header">
              <Link href="#" className="bars"></Link>
              <Link className="navbar-brand" href="/dashboard/dashboard">
            
                 <img src="/assets/images/logo.png" alt="Logo Image" />

                {/* <span className="m-l-10">Compass</span> */} 
              </Link>
            </div>
            <ul className="nav navbar-nav navbar-left">
              {/* <li>
                <a href="#" className="ls-toggle-btn" data-close="true">
                  <i className="zmdi zmdi-swap"></i>
                </a>
              </li> */}
              {/* <li className="hidden-sm-down">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search..."
                  />
                  <span className="input-group-addon">
                    <i className="zmdi zmdi-search"></i>
                  </span>
                </div>
              </li> */}
            </ul>
            <ul className="nav navbar-nav navbar-right">
              <li className="dropdown">
                <a
                  href="#"
                  className="dropdown-toggle"
                  data-toggle="dropdown"
                  role="button"
                >
                  <i className="zmdi zmdi-notifications"></i>
                  <div className="notify">
                    <span className="heartbit"></span>
                    <span className="point"></span>
                  </div>
                </a>
                <ul className="dropdown-menu dropdown-menu-right slideDown">
                  <li className="header">NOTIFICATIONS</li>
                  <li className="body">
                    <ul className="menu list-unstyled">
                      <li>
                        <a href="#">
                          <div className="icon-circle bg-blue">
                            <i className="zmdi zmdi-account"></i>
                          </div>
                          <div className="menu-info">
                            <h4>8 New Members joined</h4>
                            <p>
                              <i className="zmdi zmdi-time"></i> 14 mins ago
                            </p>
                          </div>
                        </a>
                      </li>
                      {/* Additional notification items... */}
                    </ul>
                  </li>
                  <li className="footer">
                    <a href="#">View All Notifications</a>
                  </li>
                </ul>
              </li>
              {/* Additional dropdowns and items... */}
              <li>
                <a
                  href="#"
                  className="fullscreen hidden-sm-down"
                  data-provide="fullscreen"
                  data-close="true"
                >
                  <i className="zmdi zmdi-fullscreen"></i>
                </a>
              </li>
              <li>
                <a href="/login" className="mega-menu" data-close="true">
                  <i className="zmdi zmdi-power"></i>
                </a>
              </li>
              <li>
                <a href="#" className="js-right-sidebar" data-close="true">
                  <i className="zmdi zmdi-settings zmdi-hc-spin"></i>
                </a>
              </li>
            </ul>
          </div>
        </nav>
    </div>
  )
}
