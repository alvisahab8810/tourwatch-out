import React from 'react'
import Link from 'next/link'
export default function Leftbar() {
  return (
    <>
       <aside id="leftsidebar" className="sidebar">
          {/* <!-- Menu --> */}
          <div className="menu">
            <ul className="list">
              <li>
                <div className="user-info">
                  <div className="image">
                    <a
                      href="profile.html"
                      className=" waves-effect waves-block"
                    >
                      <img src="/asets/images/profile_av.jpg" alt="User" />
                    </a>
                  </div>
                  <div className="detail">
                    <h4>Riyaz Alvi</h4>
                    <small></small>
                  </div>
                  <a
                    href="events.html"
                    title="Events"
                    className=" waves-effect waves-block"
                  >
                    <i className="zmdi zmdi-calendar"></i>
                  </a>
                  <a
                    href="mail-inbox.html"
                    title="Inbox"
                    className=" waves-effect waves-block"
                  >
                    <i className="zmdi zmdi-email"></i>
                  </a>
                  <a
                    href="contact.html"
                    title="Contact List"
                    className=" waves-effect waves-block"
                  >
                    <i className="zmdi zmdi-account-box-phone"></i>
                  </a>
                  <a
                    href="chat.html"
                    title="Chat App"
                    className=" waves-effect waves-block"
                  >
                    <i className="zmdi zmdi-comments"></i>
                  </a>
                  <Link
                    href="/"
                    title="Sign out"
                    className="waves-effect waves-block"
                  >
                    <i className="zmdi zmdi-power"></i>
                  </Link>
                </div>
              </li>
              <li className="header">MAIN NAVIGATION</li>
              <li>
                <Link href="/dashboard/dashboard" className=" waves-effect waves-block">
                  <i className="zmdi zmdi-home"></i>
                  <span>Home</span>{" "}
                </Link>{" "}
              </li>
              <li>
                <Link
                  href="/dashboard/blog-dashboard"
                  className=" waves-effect waves-block"
                >
                  <i className="zmdi zmdi-blogger"></i>
                  <span>Blog Dashboard</span>{" "}
                </Link>{" "}
              </li>
              <li className="active open">
                <Link
                  href="/dashboard/new-post"
                  className="toggled waves-effect waves-block"
                >
                  <i className="zmdi zmdi-plus-circle"></i>
                  <span>New Post</span>{" "}
                </Link>{" "}
              </li>
              <li>
                <a href="#" className=" waves-effect waves-block">
                  <i className="zmdi zmdi-sort-amount-desc"></i>
                  <span>Blog List</span>{" "}
                </a>{" "}
              </li>
             
           

              <li className="header">CATEGORIES</li>
              <li>
                <a href="#" className="waves-effect waves-block">
                  <i className="zmdi zmdi-label col-green"></i>
                  <span>Web Design</span>
                </a>
              </li>
              <li>
                <a href="#" className="menu-toggle waves-effect waves-block">
                  <i className="zmdi zmdi-label col-red"></i>
                  <span>Photography</span>{" "}
                </a>
                <ul className="ml-menu">
                  <li>
                    <a href="#" className=" waves-effect waves-block">
                      Wild
                    </a>{" "}
                  </li>
                  <li>
                    <a href="#" className=" waves-effect waves-block">
                      Marriage
                    </a>{" "}
                  </li>
                </ul>
              </li>
              <li>
                <a href="#" className="menu-toggle waves-effect waves-block">
                  <i className="zmdi zmdi-label col-amber"></i>
                  <span>Technology</span>{" "}
                </a>
                <ul className="ml-menu">
                  <li>
                    <a href="#" className=" waves-effect waves-block">
                      UI UX Design
                    </a>{" "}
                  </li>
                  <li>
                    <a href="#" className=" waves-effect waves-block">
                      Android
                    </a>{" "}
                  </li>
                  <li>
                    <a href="#" className=" waves-effect waves-block">
                      iOS
                    </a>{" "}
                  </li>
                  <li>
                    <a href="#" className=" waves-effect waves-block">
                      Wordpress
                    </a>{" "}
                  </li>
                </ul>
              </li>
              <li>
                <a href="#" className="waves-effect waves-block">
                  <i className="zmdi zmdi-label col-purple"></i>
                  <span>Lifestyle</span>
                </a>
              </li>
              <li>
                <a href="#" className="waves-effect waves-block">
                  <i className="zmdi zmdi-label col-lime"></i>
                  <span>Sports</span>
                </a>
              </li>
            </ul>
          </div>
          {/* <!-- #Menu -->  */}
        </aside>
    </>
  )
}
