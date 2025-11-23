import React, { useEffect, useState } from 'react';
import api from '../api/client';
import SectionCard from '../components/SectionCard';
import type { Customer, Payment, Supplier } from '../types';
import { formatCurrency, formatDate } from '../utils/format';

const PaymentsPage: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [form, setForm] = useState({
    type: 'incoming',
    entityType: 'customer',
    entity: '',
    method: 'cash',
    amount: 0,
    reference: '',
    notes: '',
    paymentDate: new Date().toISOString().slice(0, 10)
  });

  useEffect(() => {
    const fetchData = async () => {
      const [paymentRes, customerRes, supplierRes] = await Promise.all([
        api.get<Payment[]>('/api/payments'),
        api.get<Customer[]>('/api/customers'),
        api.get<Supplier[]>('/api/suppliers')
      ]);
      setPayments(paymentRes.data);
      setCustomers(customerRes.data);
      setSuppliers(supplierRes.data);
    };
    fetchData();
  }, []);

  const refreshPayments = async () => {
    const { data } = await api.get<Payment[]>('/api/payments');
    setPayments(data);
  };

  const linkedEntities: Array<Customer | Supplier> =
    form.entityType === 'customer' ? customers : suppliers;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await api.post('/api/payments', {
      ...form,
      amount: Number(form.amount),
      entity: form.entity,
      paymentDate: new Date(form.paymentDate)
    });
    setForm({
      type: 'incoming',
      entityType: 'customer',
      entity: '',
      method: 'cash',
      amount: 0,
      reference: '',
      notes: '',
      paymentDate: new Date().toISOString().slice(0, 10)
    });
    refreshPayments();
  };

  return (
    <div className="page-stack">
      <header className="page-header">
        <div>
          <h2>Payments & Accounts</h2>
          <p>Record cash, bank, UPI movements mapped to customers and suppliers.</p>
        </div>
      </header>

      <SectionCard title="Create payment entry" description="Impacts customer/supplier balances automatically">
        <form className="grid-form" onSubmit={handleSubmit}>
          <label>
            <span>Type</span>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              <option value="incoming">Incoming</option>
              <option value="outgoing">Outgoing</option>
            </select>
          </label>
          <label>
            <span>Entity</span>
            <select
              value={form.entityType}
              onChange={(e) => setForm({ ...form, entityType: e.target.value, entity: '' })}
            >
              <option value="customer">Customer</option>
              <option value="supplier">Supplier</option>
            </select>
          </label>
          <label className="full-width">
            <span>{form.entityType === 'customer' ? 'Customer' : 'Supplier'}</span>
            <select
              value={form.entity}
              onChange={(e) => setForm({ ...form, entity: e.target.value })}
              required
            >
              <option value="">Select</option>
              {linkedEntities.map((entity) => (
                <option key={entity._id} value={entity._id}>
                  {entity.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Method</span>
            <select
              value={form.method}
              onChange={(e) => setForm({ ...form, method: e.target.value })}
            >
              <option value="cash">Cash</option>
              <option value="bank">Bank</option>
              <option value="upi">UPI</option>
              <option value="cheque">Cheque</option>
            </select>
          </label>
          <label>
            <span>Amount</span>
            <input
              type="number"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
            />
          </label>
          <label>
            <span>Reference</span>
            <input value={form.reference} onChange={(e) => setForm({ ...form, reference: e.target.value })} />
          </label>
          <label>
            <span>Date</span>
            <input
              type="date"
              value={form.paymentDate}
              onChange={(e) => setForm({ ...form, paymentDate: e.target.value })}
            />
          </label>
          <label className="full-width">
            <span>Notes</span>
            <textarea
              rows={2}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </label>
          <button type="submit" className="btn-primary">
            Save entry
          </button>
        </form>
      </SectionCard>

      <SectionCard title="Payment register" description="With auto-linked party information">
        <table className="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Entity</th>
              <th>Method</th>
              <th>Amount</th>
              <th>Reference</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment._id}>
                <td>{formatDate(payment.paymentDate)}</td>
                <td>
                  <span className={`status-pill ${payment.type}`}>{payment.type}</span>
                </td>
                <td>
                  {payment.entityType === 'customer'
                    ? (payment.entity as Customer)?.name
                    : (payment.entity as Supplier)?.name}
                </td>
                <td>{payment.method.toUpperCase()}</td>
                <td>{formatCurrency(payment.amount)}</td>
                <td>{payment.reference || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>
    </div>
  );
};

export default PaymentsPage;

