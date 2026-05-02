import Header from './components/Header';
import Footer from './components/Footer';
import Toast from './components/Toast';
import './App.css';



export const AppLayout = ({ children, toast, dismissToast }: any) => {
  return (
    <div className="min-h-screen flex flex-col bg-ibm-light">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        {children}
      </main>
      <Footer />
      {toast && (
        <Toast message={toast.message} type={toast.type} onDismiss={dismissToast} />
      )}
    </div>
  );
};
