import React, { useEffect, useState } from 'react';
import api from '../api/client';
import SectionCard from '../components/SectionCard';
import StatCard from '../components/StatCard';
import type { Supplier } from '../types';
import { formatCurrency, formatDate } from '../utils/format';

const SuppliersPage: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [form, setForm] = useState({
    name: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    gstNumber: ''
  });

  useEffect(() => {
    refreshSuppliers();
  }, []);

  const refreshSuppliers = async () => {
    const { data } = await api.get<Supplier[]>('/api/suppliers');
    setSuppliers(data);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await api.post('/api/suppliers', form);
    setForm({
      name: '',
      contactPerson: '',
      phone: '',
      email: '',
      address: '',
      gstNumber: ''
    });
    refreshSuppliers();
  };

  return (
    <div className="page-stack">
      <header className="page-header">
        <div>
          <h2>Supplier Network</h2>
          <p>Track procurement partners with account balances.</p>
        </div>
        <StatCard title="Vendors" value={suppliers.length} accent="orange" />
      </header>

      <div className="two-col-grid">
            <SectionCard title="Add supplier" description="Store GST, contact and routing info">
          <form className="grid-form" onSubmit={handleSubmit}>
            <label>
              <span>Business name</span>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </label>
            <label>
              <span>Contact person</span>
              <input
                value={form.contactPerson}
                onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
              />
            </label>
            <label>
              <span>Phone</span>
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
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
              Save supplier
            </button>
          </form>
        </SectionCard>

        <SectionCard title="Supplier ledger">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact</th>
                <th>GST</th>
                <th>Balance</th>
                <th>Onboarded</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((supplier) => (
                <tr key={supplier._id}>
                  <td>{supplier.name}</td>
                  <td>{supplier.phone || supplier.email || '-'}</td>
                  <td>{supplier.gstNumber || '-'}</td>
                  <td>{formatCurrency(supplier.accountBalance || 0)}</td>
                  <td>{formatDate(supplier.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </SectionCard>
      </div>
    </div>
  );
};

export default SuppliersPage;

