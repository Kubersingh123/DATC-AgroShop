import React, { useEffect, useMemo, useState } from 'react';
import api from '../api/client';
import SectionCard from '../components/SectionCard';
import Bill from '../components/Bill';
import type { Customer, Product, Sale } from '../types';
import { formatCurrency, formatDate } from '../utils/format';

interface DraftItem {
  productId: string;
  quantity: number;
  rate: number;
  gstRate: number;
}

const emptyItem: DraftItem = { productId: '', quantity: 1, rate: 0, gstRate: 5 };

const SalesPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [saleForm, setSaleForm] = useState({
    customerId: '',
    paymentStatus: 'pending',
    saleDate: new Date().toISOString().slice(0, 10)
  });
  const [items, setItems] = useState<DraftItem[]>([{ ...emptyItem }]);

  useEffect(() => {
    const fetchData = async () => {
      const [customerRes, productRes, saleRes] = await Promise.all([
        api.get<Customer[]>('/api/customers'),
        api.get<Product[]>('/api/products'),
        api.get<Sale[]>('/api/sales')
      ]);
      setCustomers(customerRes.data);
      setProducts(productRes.data);
      setSales(saleRes.data);
    };
    fetchData();
  }, []);

  const addItemRow = () => setItems((prev) => [...prev, { ...emptyItem }]);

  const removeItemRow = (index: number) =>
    setItems((prev) => prev.filter((_, idx) => idx !== index));

  const handleItemChange = (index: number, field: keyof DraftItem, value: string | number) => {
    setItems((prev) =>
      prev.map((item, idx) => {
        if (idx !== index) return item;
        const updated = { ...item, [field]: value };
        if (field === 'productId') {
          const product = products.find((prod) => prod._id === value);
          if (product) {
            updated.rate = product.salePrice || 0;
            updated.gstRate = product.gstRate || 0;
          }
        }
        return updated;
      })
    );
  };

  const computedItems = useMemo(() => {
    return items
      .filter((item) => item.productId)
      .map((item) => {
        const product = products.find((prod) => prod._id === item.productId);
        const rate = item.rate || product?.salePrice || 0;
        const gstRate = item.gstRate ?? product?.gstRate ?? 0;
        const quantity = item.quantity || 0;
        const line = rate * quantity;
        const gst = line * (gstRate / 100);
        return {
          ...item,
          product,
          lineAmount: line,
          gstAmount: gst,
          total: line + gst
        };
      });
  }, [items, products]);

  const invoiceSummary = useMemo(() => {
    const subtotal = computedItems.reduce((sum, row) => sum + row.lineAmount, 0);
    const gstTotal = computedItems.reduce((sum, row) => sum + row.gstAmount, 0);
    return {
      subtotal,
      gstTotal,
      total: subtotal + gstTotal
    };
  }, [computedItems]);

  const refreshSales = async () => {
    const { data } = await api.get<Sale[]>('/api/sales');
    setSales(data);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (computedItems.length === 0) return;

    await api.post('/api/sales', {
      customerId: saleForm.customerId || undefined,
      paymentStatus: saleForm.paymentStatus,
      saleDate: new Date(saleForm.saleDate),
      items: computedItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        rate: item.rate,
        gstRate: item.gstRate
      }))
    });

    setSaleForm({
      customerId: '',
      paymentStatus: 'pending',
      saleDate: new Date().toISOString().slice(0, 10)
    });
    setItems([{ ...emptyItem }]);
    refreshSales();
  };

  return (
    <div className="page-stack">
      <header className="page-header">
        <div>
          <h2>Sales & GST Billing</h2>
          <p>Raise invoices with automatic GST breakup and inventory deductions.</p>
        </div>
      </header>

      <SectionCard title="Create invoice" description="Multi-item billing with customer ledger">
        <form className="invoice-form" onSubmit={handleSubmit}>
          <div className="grid-form">
            <label>
              <span>Customer</span>
              <select
                value={saleForm.customerId}
                onChange={(e) => setSaleForm({ ...saleForm, customerId: e.target.value })}
              >
                <option value="">Walk-in</option>
                {customers.map((customer) => (
                  <option key={customer._id} value={customer._id}>
                    {customer.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>Payment status</span>
              <select
                value={saleForm.paymentStatus}
                onChange={(e) => setSaleForm({ ...saleForm, paymentStatus: e.target.value })}
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="partial">Partial</option>
              </select>
            </label>
            <label>
              <span>Sale date</span>
              <input
                type="date"
                value={saleForm.saleDate}
                onChange={(e) => setSaleForm({ ...saleForm, saleDate: e.target.value })}
              />
            </label>
          </div>

          <div className="invoice-items">
            <div className="invoice-items-header">
              <p>Line items</p>
              <button type="button" className="btn-ghost" onClick={addItemRow}>
                + Add item
              </button>
            </div>
            {items.map((item, index) => (
              <div className="invoice-item-row" key={`item-${index}`}>
                <select
                  value={item.productId}
                  onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                >
                  <option value="">Select product</option>
                  {products.map((product) => (
                    <option key={product._id} value={product._id}>
                      {product.name}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))}
                  placeholder="Qty"
                />
                <input
                  type="number"
                  value={item.rate}
                  onChange={(e) => handleItemChange(index, 'rate', Number(e.target.value))}
                  placeholder="Rate"
                />
                <input
                  type="number"
                  value={item.gstRate}
                  onChange={(e) => handleItemChange(index, 'gstRate', Number(e.target.value))}
                  placeholder="GST %"
                />
                {items.length > 1 && (
                  <button type="button" className="btn-icon" onClick={() => removeItemRow(index)}>
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="invoice-summary">
            <div>
              <p>Subtotal</p>
              <p>{formatCurrency(invoiceSummary.subtotal)}</p>
            </div>
            <div>
              <p>GST</p>
              <p>{formatCurrency(invoiceSummary.gstTotal)}</p>
            </div>
            <div className="total-line">
              <p>Total</p>
              <p>{formatCurrency(invoiceSummary.total)}</p>
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={computedItems.length === 0}>
            Post invoice
          </button>
        </form>
      </SectionCard>

      <SectionCard title="Sales ledger" description="Latest invoices with GST split">
        <table className="data-table">
          <thead>
            <tr>
              <th>Invoice</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Subtotal</th>
              <th>GST</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale) => (
              <tr key={sale._id}>
                <td data-label="Invoice">{sale.invoiceNumber}</td>
                <td data-label="Customer">{sale.customer?.name || 'Walk-in'}</td>
                <td data-label="Items">{sale.items.length}</td>
                <td data-label="Subtotal">{formatCurrency(sale.subtotal)}</td>
                <td data-label="GST">{formatCurrency(sale.gstTotal)}</td>
                <td data-label="Total">{formatCurrency(sale.total)}</td>
                <td data-label="Status">
                  <span className={`status-pill ${sale.paymentStatus}`}>{sale.paymentStatus}</span>
                </td>
                <td data-label="Date">{formatDate(sale.saleDate)}</td>
                <td data-label="Action">
                  <button
                    type="button"
                    className="btn-ghost"
                    onClick={() => setSelectedSale(sale)}
                    style={{ fontSize: '0.85rem', padding: '6px 12px' }}
                  >
                    📄 View Bill
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>

      {selectedSale && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, overflow: 'auto', padding: '20px' }}>
          <Bill sale={selectedSale} onClose={() => setSelectedSale(null)} />
        </div>
      )}
    </div>
  );
};

export default SalesPage;

