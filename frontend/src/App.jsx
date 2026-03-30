import { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import {
  Search, Plus, Package, Edit2, Trash2,
  Tag, Box, IndianRupee, X, Bot, LogOut
} from 'lucide-react';
import {
  getProducts, addProduct, updateProduct,
  deleteProduct, searchProducts, getCategories
} from './services/api';
import EnhancedDashboard from './components/EnhancedDashboard';
import CategoryManagement from './components/CategoryManagement';
import AIChat from './components/AIChat';
import AuthScreen from './components/AuthScreen';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    quantity: 0,
    price: 0.0
  });

  // Fetch Data Routine
  const isSafari = () => {
    if (typeof navigator === 'undefined') return false;
    return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  };

  const createNetworkErrorMessage = () => {
    const safariNote = isSafari()
      ? ' (Safari may block local connections; allow local network access or use the backend URL directly.)'
      : '';
    return `Failed to load products. Ensure backend is running at http://localhost:8081${safariNote}`;
  };

  const fetchProductsAndCategories = async () => {
    try {
      setLoading(true);
      const [prodData, catData] = await Promise.all([
        getProducts(),
        getCategories()
      ]);
      setProducts(prodData);
      setCategories(catData);
    } catch (error) {
      const message = error?.message?.includes('Network Error')
        ? createNetworkErrorMessage()
        : 'Failed to load products.';
      toast.error(message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsAndCategories();
  }, []);

  // Handlers
  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value.trim() === '') {
      const data = await getProducts();
      setProducts(data);
      return;
    }

    try {
      const results = await searchProducts(value);
      setProducts(results);
    } catch (error) {
      console.error(error);
    }
  };

  const openForm = (product = null) => {
    if (product) {
      setEditingItem(product);
      setFormData({
        name: product.name,
        categoryId: product.category?.id || '',
        quantity: product.quantity,
        price: product.price
      });
    } else {
      setEditingItem(null);
      setFormData({ name: '', categoryId: '', quantity: 0, price: 0 });
    }
    setIsModalOpen(true);
  };

  const closeForm = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await updateProduct(editingItem.id, formData);
        toast.success('Product updated beautifully!');
      } else {
        await addProduct(formData);
        toast.success('Product added successfully!');
      }
      closeForm();
      const updatedProducts = await getProducts();
      setProducts(updatedProducts);
    } catch (error) {
      if (error.response?.data) {
        const errs = error.response.data;
        Object.values(errs).forEach(msg => toast.error(msg));
      } else if (error.message?.includes('Network Error')) {
        toast.error(createNetworkErrorMessage());
      } else {
        toast.error('Operation failed.');
      }
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you certain you wish to delete this product?')) {
      try {
        await deleteProduct(id);
        toast.success('Product deleted.');
        const updatedProducts = await getProducts();
        setProducts(updatedProducts);
      } catch (error) {
        if (error.message?.includes('Network Error')) {
          toast.error(createNetworkErrorMessage());
        } else {
          toast.error('Delete failed.');
        }
        console.error(error);
      }
    }
  };

  const handleQuantityChange = async (product, change) => {
    const newQuantity = product.quantity + change;
    if (newQuantity < 0) return;
    
    try {
      await updateProduct(product.id, {
        name: product.name,
        categoryId: product.category?.id || '',
        quantity: newQuantity,
        price: product.price
      });
      const updatedProducts = await getProducts();
      setProducts(updatedProducts);
    } catch (error) {
      toast.error('Failed to update quantity.');
      console.error(error);
    }
  };

  if (!isAuthenticated) {
    return (
      <>
        <Toaster position="top-right" toastOptions={{
          style: { background: '#1e293b', color: '#f8fafc', border: '1px solid rgba(255,255,255,0.1)' }
        }} />
        <AuthScreen onLoginSuccess={(userData) => { setIsAuthenticated(true); setCurrentUser(userData); }} />
      </>
    );
  }

  return (
    <div className="app-container">
      <Toaster position="top-right" toastOptions={{
        style: {
          background: '#1e293b',
          color: '#f8fafc',
          border: '1px solid rgba(255,255,255,0.1)'
        }
      }} />

      <header className="header animate-fade-in">
        <h1>
          <Package className="text-primary" size={32} color="#3b82f6" />
          Inventory Hub
        </h1>

        <div className="controls">
          <div className="search-box">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          <button className="btn btn-ghost" onClick={() => setIsAIChatOpen(true)}>
            <Bot size={18} /> AI Assistant
          </button>
          <button className="btn btn-ghost" onClick={() => setIsCategoryModalOpen(true)}>
            <Tag size={18} /> Categories
          </button>
          <button className="btn btn-primary" onClick={() => openForm()}>
            <Plus size={18} /> Add Product
          </button>
          <button className="btn btn-ghost" style={{ color: 'var(--danger)' }} onClick={() => { setIsAuthenticated(false); setCurrentUser(null); }}>
            <LogOut size={18} /> Logout
          </button>
        </div>
      </header>

      <EnhancedDashboard />

      <main className="products-wrapper">
        {loading ? (
          <div className="empty-state">
            <div className="spinner"></div>
            <p>Loading inventory...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state animate-fade-in">
            <Package size={64} />
            <h3>No products found</h3>
            <p>Try adjusting your search or add a new product.</p>
          </div>
        ) : (
          <div className="product-grid">
            {products.map((product, idx) => (
              <div
                key={product.id}
                className="product-card glass-panel animate-fade-in"
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <div className="card-header">
                  <h3 className="card-title">{product.name}</h3>
                  <span className="badge">{product.category?.name || 'Uncategorized'}</span>
                </div>

                <div className="card-body">
                  <div className="card-stat">
                    <span className="stat-label">
                      <Box size={16} /> Quantity
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <button 
                        className="btn btn-ghost" 
                        style={{ padding: '0 8px', minWidth: 'auto', height: '28px', border: '1px solid rgba(255,255,255,0.2)' }}
                        onClick={() => handleQuantityChange(product, -1)}
                        disabled={product.quantity <= 0}
                      >
                        -
                      </button>
                      <span className="stat-value" style={{ margin: 0 }}>{product.quantity}</span>
                      <button 
                        className="btn btn-ghost" 
                        style={{ padding: '0 8px', minWidth: 'auto', height: '28px', border: '1px solid rgba(255,255,255,0.2)' }}
                        onClick={() => handleQuantityChange(product, 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="card-stat">
                    <span className="stat-label">
                      <IndianRupee size={16} /> Price
                    </span>
                    <span className="stat-value price">₹ {product.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                </div>

                <div className="card-actions">
                  <button className="btn btn-ghost" onClick={() => openForm(product)}>
                    <Edit2 size={16} /> Edit
                  </button>
                  <button className="btn btn-ghost" style={{ color: 'var(--danger)' }} onClick={() => handleDelete(product.id)}>
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay animate-fade-in">
          <div className="modal glass-panel">
            <button className="btn-close" onClick={closeForm}>
              <X size={24} />
            </button>
            <h2 style={{ marginTop: 0, marginBottom: '2rem' }}>
              {editingItem ? 'Edit Product' : 'Add New Product'}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Product Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                <select
                  className="form-control"
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  required
                >
                  <option value="" disabled>Select a category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Quantity</label>
                  <input
                    type="number"
                    min="0"
                    className="form-control"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                    required
                  />
                </div>

                <div className="form-group" style={{ flex: 1 }}>
                  <label>Price (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className="form-control"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    required
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-ghost" onClick={closeForm}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingItem ? 'Save Changes' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Management Modal */}
      {isCategoryModalOpen && (
        <CategoryManagement onClose={() => {
          setIsCategoryModalOpen(false);
          fetchProductsAndCategories(); // Refresh dropdowns and metrics
        }} />
      )}

      {/* AI Chat Modal */}
      <AIChat isOpen={isAIChatOpen} onClose={() => setIsAIChatOpen(false)} />
    </div>
  );
}

export default App;
