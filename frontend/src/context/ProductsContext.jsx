import { createContext, useContext, useState, useEffect } from 'react';

const ProductsContext = createContext(null);

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products`);
      const data = await res.json();
      if (data.ok) setProducts(data.products);
    } catch (e) {
      console.error('Fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (formData) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.ok) {
        await fetchProducts();
        return { success: true };
      }
      return { success: false, error: data.error };
    } catch (e) {
      console.error(e);
      return { success: false, error: e.message };
    }
  };

  const updateProduct = async (id, formData) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${id}`, {
        method: 'PUT',
        body: formData
      });
      const data = await res.json();
      if (data.ok) {
        await fetchProducts();
        return { success: true };
      }
      return { success: false, error: data.error };
    } catch (e) {
      console.error(e);
      return { success: false, error: e.message };
    }
  };

  const deleteProduct = async (id) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.ok) {
        setProducts(prev => prev.filter(p => p.id !== id));
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  const getByCategory = (category) => products.filter(p => p.category === category);

  return (
    <ProductsContext.Provider value={{
      products,
      loading,
      addProduct,
      updateProduct,
      deleteProduct,
      getByCategory,
      refresh: fetchProducts
    }}>
      {children}
    </ProductsContext.Provider>
  );
}

export const useProducts = () => useContext(ProductsContext);
