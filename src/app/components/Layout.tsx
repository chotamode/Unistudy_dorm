"use client";

import { useEffect, useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import { ReservationContextProvider } from "@/app/context/ReservationContext";
import ReservationContextDisplay from "@/app/components/ReservationContextDisplay";
import CookieConsent from "./CookieConsent";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [showYearGenderDisplay, setShowYearGenderDisplay] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setShowYearGenderDisplay(window.location.href.includes('/rooms'));
    }
  }, []);

  return (
    // <YearGenderProvider>
      <div className="min-h-screen overflow-x-hidden flex flex-col h-screen">
        <Header />
        {showYearGenderDisplay && <ReservationContextDisplay />}
        <main className="flex-grow pb-28">
          {children}
        </main>
        <Footer />
          <CookieConsent/>
      </div>

    // </YearGenderProvider>
  );
};

export default Layout;