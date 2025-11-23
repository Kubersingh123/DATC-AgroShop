import React, { useEffect, useState } from 'react';
import api from '../api/client';
import SectionCard from '../components/SectionCard';
import { formatCurrency, formatDate } from '../utils/format';
import type { InventoryTransaction, Product } from '../types';

const InventoryPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [transactions, setTransactions] = useState<InventoryTransaction[]>([]);
  const [form, setForm] = useState({
    productId: '',
    type: 'purchase',
    quantity: 0,
    unitCost: 0,
    note: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      const [productRes, transactionRes] = await Promise.all([
        api.get<Product[]>('/api/products'),
        api.get<InventoryTransaction[]>('/api/inventory')
      ]);
      setProducts(productRes.data);
      setTransactions(transactionRes.data);
    };
    fetchData();
  }, []);

  const refreshTransactions = async () => {
    const { data } = await api.get<InventoryTransaction[]>('/api/inventory');
    setTransactions(data);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await api.post('/api/inventory', {
      productId: form.productId,
      type: form.type,
      quantity: Number(form.quantity),
      unitCost: Number(form.unitCost),
      note: form.note
    });
    setForm({
      productId: '',
      type: 'purchase',
      quantity: 0,
      unitCost: 0,
      note: ''
    });
    refreshTransactions();
  };

  return (
    <div className="page-stack">
      <header className="page-header">
        <div>
          <h2>Inventory Control</h2>
          <p>Capture inward/outward flows with audit history.</p>
        </div>
      </header>
      <div className="two-col-grid">
        <SectionCard title="Log movement" description="Automates stock ledger and valuation">
          <form className="grid-form" onSubmit={handleSubmit}>
            <label className="full-width">
              <span>Product</span>
              <select
                value={form.productId}
                onChange={(e) => setForm({ ...form, productId: e.target.value })}
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
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option value="purchase">Purchase/Inward</option>
                <option value="sale">Sale/Outward</option>
                <option value="adjustment">Adjustment</option>
              </select>
            </label>
            <label>
              <span>Quantity</span>
              <input
                type="number"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
                required
              />
            </label>
            <label>
              <span>Unit cost</span>
              <input
                type="number"
                value={form.unitCost}
                onChange={(e) => setForm({ ...form, unitCost: Number(e.target.value) })}
              />
            </label>
            <label className="full-width">
              <span>Note</span>
              <textarea
                rows={2}
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
              />
            </label>
            <button type="submit" className="btn-primary">
              Record transaction
            </button>
          </form>
        </SectionCard>

        <SectionCard title="Recent transactions" description="Last 10 movements">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Product</th>
                <th>Type</th>
                <th>Qty</th>
                <th>Unit cost</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              {transactions.slice(0, 10).map((txn) => (
                <tr key={txn._id}>
                  <td>{formatDate(txn.transactionDate)}</td>
                  <td>{txn.product?.name}</td>
                  <td>
                    <span className={`status-pill ${txn.type}`}>{txn.type}</span>
                  </td>
                  <td>{txn.quantity}</td>
                  <td>{formatCurrency(txn.unitCost || 0)}</td>
                  <td>{txn.note || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </SectionCard>
      </div>
    </div>
  );
};

export default InventoryPage;

