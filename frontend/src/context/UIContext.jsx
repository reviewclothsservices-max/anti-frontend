import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const UIContext = createContext(null);

export function UIProvider({ children }) {
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [authRedirect, setAuthRedirect] = useState(null);
  const [toasts, setToasts] = useState([]);

  const openCart = () => setCartOpen(true);
  const closeCart = () => setCartOpen(false);
  const openSearch = () => setSearchOpen(true);
  const closeSearch = () => setSearchOpen(false);
  const openAuth = (mode = 'login', redirect = null) => { 
    setAuthMode(mode); 
    setAuthRedirect(redirect);
    setAuthOpen(true); 
  };
  const closeAuth = () => {
    setAuthOpen(false);
    setAuthRedirect(null);
  };
  const openProduct = (product) => setSelectedProduct(product);
  const closeProduct = () => setSelectedProduct(null);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') {
        if (selectedProduct) closeProduct();
        else if (searchOpen) closeSearch();
        else if (cartOpen) closeCart();
        else if (authOpen) closeAuth();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [cartOpen, searchOpen, authOpen, selectedProduct]);

  return (
    <UIContext.Provider value={{
      cartOpen, openCart, closeCart,
      searchOpen, openSearch, closeSearch,
      authOpen, authMode, authRedirect, openAuth, closeAuth,
      selectedProduct, openProduct, closeProduct,
      toasts, showToast,
    }}>
      {children}
    </UIContext.Provider>
  );
}

export const useUI = () => useContext(UIContext);
