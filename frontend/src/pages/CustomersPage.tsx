import React, { useEffect, useState } from 'react';
import api from '../api/client';
import SectionCard from '../components/SectionCard';
import StatCard from '../components/StatCard';
import type { Customer } from '../types';
import { formatCurrency, formatDate } from '../utils/format';

const CustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    gstNumber: ''
  });

  useEffect(() => {
    refreshCustomers();
  }, []);

  const refreshCustomers = async () => {
    const { data } = await api.get<Customer[]>('/api/customers');
    setCustomers(data);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await api.post('/api/customers', form);
    setForm({
      name: '',
      email: '',
      phone: '',
      address: '',
      gstNumber: ''
    });
    refreshCustomers();
  };

  return (
    <div className="page-stack">
      <header className="page-header">
        <div>
          <h2>Customer Management</h2>
          <p>Central CRM with GST and outstanding balance tracking.</p>
        </div>
        <StatCard title="Total customers" value={customers.length} accent="blue" />
      </header>

      <div className="two-col-grid">
        <SectionCard title="Create customer" description="Auto syncs with sales and payments">
          <form className="grid-form" onSubmit={handleSubmit}>
            <label>
              <span>Name</span>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </label>
            <label>
              <span>Email</span>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </label>
            <label>
              <span>Phone</span>
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </label>
            <label>
              <span>GST number</span>
              <input
                value={form.gstNumber}
                onChange={(e) => setForm({ ...form, gstNumber: e.target.value })}
              />
            </label>
            <label className="full-width">
              <span>Address</span>
              <textarea
                rows={2}
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </label>
            <button type="submit" className="btn-primary">
              Save customer
            </button>
          </form>
        </SectionCard>

        <SectionCard title="Customer health" description="Outstanding balances">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>GST</th>
                <th>Outstanding</th>
                <th>Since</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer._id}>
                  <td>{customer.name}</td>
                  <td>{customer.phone || '-'}</td>
                  <td>{customer.gstNumber || '-'}</td>
                  <td>{formatCurrency(customer.outstandingBalance || 0)}</td>
                  <td>{formatDate(customer.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </SectionCard>
      </div>
    </div>
  );
};

export default CustomersPage;

