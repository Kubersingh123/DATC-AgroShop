import React, { useEffect, useState } from 'react';
import api from '../api/client';
import SectionCard from '../components/SectionCard';
import StatCard from '../components/StatCard';
import { useAuth } from '../context/AuthContext';
import type { Product, Supplier } from '../types';
import { formatCurrency } from '../utils/format';

const emptyProduct = {
  name: '',
  sku: '',
  category: '',
  unit: 'kg',
  description: '',
  image: '',
  costPrice: 0,
  salePrice: 0,
  gstRate: 5,
  stock: 0,
  supplier: ''
};

const initialStockForm = {
  productId: '',
  type: 'purchase',
  quantity: 0,
  unitCost: 0,
  note: ''
};

const ProductsPage: React.FC = () => {
  const { user } = useAuth();
  const canManage = user?.role !== 'staff';
  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [productForm, setProductForm] = useState({ ...emptyProduct });
  const [stockForm, setStockForm] = useState({ ...initialStockForm });
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, supplierRes] = await Promise.all([
          api.get<Product[]>('/api/products'),
          api.get<Supplier[]>('/api/suppliers')
        ]);
        setProducts(productRes.data);
        setSuppliers(supplierRes.data);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const refreshProducts = async () => {
    const { data } = await api.get<Product[]>('/api/products');
    setProducts(data);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductForm({ ...productForm, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProductSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage(null);
    await api.post('/api/products', {
      ...productForm,
      costPrice: Number(productForm.costPrice),
      salePrice: Number(productForm.salePrice),
      gstRate: Number(productForm.gstRate),
      stock: Number(productForm.stock) || 0,
      supplier: productForm.supplier || undefined,
      image: productForm.image || undefined
    });
    setProductForm({ ...emptyProduct });
    setMessage('Product created successfully.');
    refreshProducts();
  };

  const handleStockAdjust = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stockForm.productId) return;
    await api.post(`/api/products/${stockForm.productId}/adjust`, {
      type: stockForm.type,
      quantity: Number(stockForm.quantity),
      unitCost: Number(stockForm.unitCost),
      note: stockForm.note
    });
    setStockForm({ ...initialStockForm });
    refreshProducts();
  };

  if (loading) {
    return <div className="page-loader">Loading product catalogue…</div>;
  }

  return (
    <div className="page-stack">
      <header className="page-header">
        <div>
          <h2>Product Management</h2>
          <p>Maintain Agro inputs, pricing, GST slabs and supplier linkage.</p>
        </div>
        <StatCard title="Active SKUs" value={products.length} />
      </header>

      {canManage && (
        <div className="two-col-grid">
          <SectionCard title="Create product" description="Define SKU with pricing and tax">
            <form className="grid-form" onSubmit={handleProductSubmit}>
              <label>
                <span>Name</span>
                <input
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  required
                />
              </label>
              <label>
                <span>SKU</span>
                <input
                  value={productForm.sku}
                  onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                  required
                />
              </label>
              <label>
                <span>Category</span>
                <input
                  value={productForm.category}
                  onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                />
              </label>
              <label>
                <span>Unit</span>
                <input
                  value={productForm.unit}
                  onChange={(e) => setProductForm({ ...productForm, unit: e.target.value })}
                />
              </label>
              <label>
                <span>Cost price</span>
                <input
                  type="number"
                  value={productForm.costPrice}
                  onChange={(e) =>
                    setProductForm({ ...productForm, costPrice: Number(e.target.value) })
                  }
                />
              </label>
              <label>
                <span>Sale price</span>
                <input
                  type="number"
                  value={productForm.salePrice}
                  onChange={(e) =>
                    setProductForm({ ...productForm, salePrice: Number(e.target.value) })
                  }
                />
              </label>
              <label>
                <span>GST %</span>
                <input
                  type="number"
                  value={productForm.gstRate}
                  onChange={(e) =>
                    setProductForm({ ...productForm, gstRate: Number(e.target.value) })
                  }
                />
              </label>
              <label>
                <span>Opening stock</span>
                <input
                  type="number"
                  value={productForm.stock}
                  onChange={(e) =>
                    setProductForm({ ...productForm, stock: Number(e.target.value) })
                  }
                />
              </label>
              <label>
                <span>Supplier</span>
                <select
                  value={productForm.supplier}
                  onChange={(e) => setProductForm({ ...productForm, supplier: e.target.value })}
                >
                  <option value="">Select supplier</option>
                  {suppliers.map((supplier) => (
                    <option key={supplier._id} value={supplier._id}>
                      {supplier.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="full-width">
                <span>Description</span>
                <textarea
                  rows={2}
                  value={productForm.description}
                  onChange={(e) =>
                    setProductForm({ ...productForm, description: e.target.value })
                  }
                />
              </label>
              <label className="full-width">
                <span>Product Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {productForm.image && (
                  <div style={{ marginTop: '8px' }}>
                    <img
                      src={productForm.image}
                      alt="Preview"
                      style={{
                        width: '100px',
                        height: '100px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        border: '1px solid #dbe5d6'
                      }}
                    />
                  </div>
                )}
              </label>
              <button type="submit" className="btn-primary">
                Save product
              </button>
              {message && <p className="form-success">{message}</p>}
            </form>
          </SectionCard>

          <SectionCard title="Adjust stock" description="Purchase, sale or manual adjustment">
            <form className="grid-form" onSubmit={handleStockAdjust}>
              <label className="full-width">
                <span>Product</span>
                <select
                  value={stockForm.productId}
                  onChange={(e) => setStockForm({ ...stockForm, productId: e.target.value })}
                  required
                >
                  <option value="">Select product</option>
                  {products.map((product) => (
                    <option key={product._id} value={product._id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span>Type</span>
                <select
                  value={stockForm.type}
                  onChange={(e) => setStockForm({ ...stockForm, type: e.target.value })}
                >
                  <option value="purchase">Purchase</option>
                  <option value="sale">Sale</option>
                  <option value="adjustment">Adjustment</option>
                </select>
              </label>
              <label>
                <span>Quantity</span>
                <input
                  type="number"
                  value={stockForm.quantity}
                  onChange={(e) =>
                    setStockForm({ ...stockForm, quantity: Number(e.target.value) })
                  }
                  required
                />
              </label>
              <label>
                <span>Unit cost</span>
                <input
                  type="number"
                  value={stockForm.unitCost}
                  onChange={(e) =>
                    setStockForm({ ...stockForm, unitCost: Number(e.target.value) })
                  }
                />
              </label>
              <label className="full-width">
                <span>Note</span>
                <textarea
                  rows={2}
                  value={stockForm.note}
                  onChange={(e) => setStockForm({ ...stockForm, note: e.target.value })}
                />
              </label>
              <button type="submit" className="btn-secondary">
                Update stock
              </button>
            </form>
          </SectionCard>
        </div>
      )}

      <SectionCard title="Product catalogue" description="Searchable, filterable master list">
        <div className="products-grid">
          {products.map((product) => (
            <div key={product._id} className="product-card">
              <div className="product-card-image">
                {product.image ? (
                  <img src={product.image} alt={product.name} />
                ) : (
                  <div className="product-card-placeholder">
                    <span>🌾</span>
                  </div>
                )}
                {product.stock <= 0 && (
                  <div className="product-card-badge out-of-stock">Out of Stock</div>
                )}
                {product.stock > 0 && product.stock < 10 && (
                  <div className="product-card-badge low-stock">Low Stock</div>
                )}
              </div>
              <div className="product-card-content">
                <h3 className="product-card-name">{product.name}</h3>
                <p className="product-card-sku">SKU: {product.sku}</p>
                {product.category && (
                  <p className="product-card-category">{product.category}</p>
                )}
                <div className="product-card-details">
                  <div className="product-card-detail-item">
                    <span className="detail-label">Stock:</span>
                    <span className="detail-value">{product.stock} {product.unit || 'kg'}</span>
                  </div>
                  <div className="product-card-detail-item">
                    <span className="detail-label">Price:</span>
                    <span className="detail-value price">{formatCurrency(product.salePrice || 0)}</span>
                  </div>
                  <div className="product-card-detail-item">
                    <span className="detail-label">GST:</span>
                    <span className="detail-value">{product.gstRate ?? 0}%</span>
                  </div>
                </div>
                {product.supplier && (
                  <p className="product-card-supplier">Supplier: {product.supplier.name}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
};

export default ProductsPage;

