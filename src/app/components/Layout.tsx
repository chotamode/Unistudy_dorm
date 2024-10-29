import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col h-screen">
      <Header />
      <main className="flex-grow pb-28">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;