import React, { useEffect, useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import api from '../api/client';
import SectionCard from '../components/SectionCard';
import StatCard from '../components/StatCard';
import { useAuth } from '../context/AuthContext';
import type { DashboardData, ReportOverview, Sale } from '../types';
import { formatCurrency, formatDate, formatNumber } from '../utils/format';

interface SalesTrendPoint {
  name: string;
  total: number;
}

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [overview, setOverview] = useState<ReportOverview | null>(null);
  const [salesTrend, setSalesTrend] = useState<SalesTrendPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashboardRes, overviewRes, trendRes] = await Promise.all([
          api.get<DashboardData>('/api/dashboard'),
          api.get<ReportOverview>('/api/reports/overview'),
          api.get<{ _id: { year: number; month: number }; total: number }[]>(
            '/api/reports/sales-by-month'
          )
        ]);

        setDashboard(dashboardRes.data);
        setOverview(overviewRes.data);
        setSalesTrend(
          trendRes.data.map((entry) => ({
            name: new Date(entry._id.year, entry._id.month - 1).toLocaleString('en-US', {
              month: 'short'
            }),
            total: entry.total
          }))
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const paymentsBreakdown = useMemo(() => {
    if (!overview) return [];
    return overview.paymentsTotal.map((row) => ({
      name: row._id === 'incoming' ? 'Incoming' : 'Outgoing',
      total: row.total
    }));
  }, [overview]);

  if (loading || !dashboard || !overview) {
    return <div className="page-loader">Preparing control room…</div>;
  }

  return (
    <div className="page-grid">
      <section className="page-hero">
        <div>
          <p className="hero-eyebrow">Administrator Console</p>
          <h1>Welcome back, {user?.name.split(' ')[0]}!</h1>
          <p>
            Track AgroShop operations across products, procurement, sales and accounts for Deepak
            Agriculture & Trading Company.
          </p>
        </div>
        <div className="hero-badge">
          <p className="hero-metric">{formatNumber(overview.salesTotal)}</p>
          <p className="hero-label">Total billed (₹) all time</p>
        </div>
      </section>

      <div className="stat-grid">
        <StatCard title="Products live" value={dashboard.stats.productCount} meta="SKUs" />
        <StatCard title="Customers" value={dashboard.stats.customerCount} accent="yellow" />
        <StatCard
          title="Suppliers"
          value={dashboard.stats.supplierCount}
          meta="Active partners"
          accent="blue"
        />
        <StatCard
          title="Invoices generated"
          value={dashboard.stats.saleCount}
          meta="Total bills"
          accent="orange"
        />
      </div>

      <div className="chart-grid">
        <SectionCard title="Monthly sales trend" description="With GST inclusive totals">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={salesTrend}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0f9d58" stopOpacity={0.7} />
                  <stop offset="95%" stopColor="#0f9d58" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => `${value / 1000}K`} />
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Area
                type="monotone"
                dataKey="total"
                stroke="#0f9d58"
                fillOpacity={1}
                fill="url(#colorSales)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Cashflow" description="Incoming vs outgoing payments">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={paymentsBreakdown}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => `${value / 1000}K`} />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Bar dataKey="total" radius={[8, 8, 0, 0]} fill="#ffb300" />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>

      <div className="two-col-grid">
        <SectionCard title="Low stock alerts" description="Below safety threshold (10 units)">
          {dashboard.lowStock.length === 0 ? (
            <p className="empty-state">All products are sufficiently stocked.</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Stock</th>
                  <th>Supplier</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.lowStock.map((item) => (
                  <tr key={item._id}>
                    <td>{item.name}</td>
                    <td>{item.sku}</td>
                    <td className="danger-text">{item.stock}</td>
                    <td>{item.supplier?.name || 'NA'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </SectionCard>

        <SectionCard title="Recent invoices">
          {overview.recentSales.length === 0 ? (
            <p className="empty-state">No invoices yet.</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Invoice</th>
                  <th>Customer</th>
                  <th>Status</th>
                  <th>Total</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {overview.recentSales.map((sale: Sale) => (
                  <tr key={sale._id}>
                    <td>{sale.invoiceNumber}</td>
                    <td>{sale.customer?.name || 'Walk-in'}</td>
                    <td>
                      <span className={`status-pill ${sale.paymentStatus}`}>{sale.paymentStatus}</span>
                    </td>
                    <td>{formatCurrency(sale.total)}</td>
                    <td>{formatDate(sale.saleDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </SectionCard>
      </div>
    </div>
  );
};

export default DashboardPage;

