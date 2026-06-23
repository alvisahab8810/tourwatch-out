import { createContext, useContext, useState, useLayoutEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Sidebar from "./Sidebar";
import { isAuthenticated } from "../../utils/voucherAuth";

const SidebarCtx = createContext(() => {});

export function useOpenSidebar() {
  return useContext(SidebarCtx);
}

/* Determine the right login page when a session is missing or expired.
   We peek at localStorage: if the SP key exists (even stale) the user is
   likely a salesperson, otherwise send them to the admin login. */
function loginRedirectPath() {
  try {
    if (typeof window !== "undefined" && localStorage.getItem("tw_sp_auth")) {
      return "/salesperson/login";
    }
  } catch {}
  return "/dashboard/login";
}

export default function DashboardLayout({ children, active }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  useLayoutEffect(() => {
    if (!isAuthenticated()) {
      router.replace(loginRedirectPath());
    }
  }, []);

  return (
    <SidebarCtx.Provider value={() => setIsOpen(true)}>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
          key="inter-font"
        />
        <link rel="stylesheet" href="/assets/css/backend.css" key="backend-css" />
      </Head>
      <div className="bk-page">
        <Sidebar active={active} isOpen={isOpen} onClose={() => setIsOpen(false)} />
        <main className="bk-main">
          {children}
        </main>
      </div>
    </SidebarCtx.Provider>
  );
}
