"use client";

import { useEffect, useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import { YearGenderProvider } from "@/app/context/YearGenderContext";
import YearGenderDisplay from "@/app/components/YearGenderDisplay";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [showYearGenderDisplay, setShowYearGenderDisplay] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setShowYearGenderDisplay(window.location.href.includes('/rooms'));
    }
  }, []);

  return (
    // <YearGenderProvider>
      <div className="min-h-screen flex flex-col h-screen">
        <Header />
        {showYearGenderDisplay && <YearGenderDisplay />}
        <main className="flex-grow pb-28">
          {children}
        </main>
        <Footer />
      </div>
    // </YearGenderProvider>
  );
};

export default Layout;