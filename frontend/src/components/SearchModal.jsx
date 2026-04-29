import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { useUI } from '../context/UIContext';
import { useProducts } from '../context/ProductsContext';
import './SearchModal.css';

export default function SearchModal() {
  const { searchOpen, closeSearch, openProduct } = useUI();
  const { products } = useProducts();
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (searchOpen) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [searchOpen]);

  if (!searchOpen) return null;

  const results = query.trim().length > 1
    ? products.filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
    : [];

  const handleSelect = (product) => {
    closeSearch();
    openProduct(product);
  };

  return (
    <div className="search-overlay" onClick={closeSearch}>
      <div className="search-modal" onClick={e => e.stopPropagation()}>
        <div className="search-input-wrap">
          <Search size={20} strokeWidth={1.5} className="search-icon" />
          <input
            ref={inputRef}
            id="search-input"
            type="text"
            placeholder="Search for products..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="search-input"
          />
          <button className="search-close-btn" onClick={closeSearch} aria-label="Close search">
            <X size={20} />
          </button>
        </div>

        {query.trim().length > 1 && (
          <div className="search-results">
            {results.length === 0 ? (
              <p className="search-no-results">No products found for &ldquo;{query}&rdquo;</p>
            ) : (
              <>
                <p className="search-count">{results.length} result{results.length !== 1 ? 's' : ''}</p>
                <div className="search-grid">
                  {results.slice(0, 8).map(product => (
                    <button key={product.id} className="search-result-item" onClick={() => handleSelect(product)}>
                      <img src={product.image} alt={product.name} />
                      <div>
                        <p className="search-result-name">{product.name}</p>
                        <p className="search-result-price">₹{product.price.toFixed(2)}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {query.trim().length <= 1 && (
          <div className="search-hints">
            <p>Popular searches:</p>
            <div className="search-tags">
              {['Dresses', 'Jackets', 'Knitwear', 'Trousers', 'Sale'].map(tag => (
                <button key={tag} className="search-tag" onClick={() => setQuery(tag)}>{tag}</button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
