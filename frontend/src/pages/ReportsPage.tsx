import React, { useEffect, useMemo, useState } from 'react';
import {
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
import type { ReportOverview, Sale } from '../types';
import { formatCurrency } from '../utils/format';

interface TrendPoint {
  label: string;
  total: number;
}

const ReportsPage: React.FC = () => {
  const [overview, setOverview] = useState<ReportOverview | null>(null);
  const [salesTrend, setSalesTrend] = useState<TrendPoint[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [overviewRes, trendRes, salesRes] = await Promise.all([
        api.get<ReportOverview>('/api/reports/overview'),
        api.get<{ _id: { year: number; month: number }; total: number }[]>(
          '/api/reports/sales-by-month'
        ),
        api.get<Sale[]>('/api/sales')
      ]);
      setOverview(overviewRes.data);
      setSales(salesRes.data);
      setSalesTrend(
        trendRes.data.map((item) => ({
          label: `${new Date(item._id.year, item._id.month - 1).toLocaleString('en-US', {
            month: 'short'
          })}`,
          total: item.total
        }))
      );
    };
    fetchData();
  }, []);

  const topCustomers = useMemo(() => {
    const totals = new Map<string, { name: string; total: number }>();
    sales.forEach((sale) => {
      if (!sale.customer) return;
      const existing = totals.get(sale.customer._id) || { name: sale.customer.name, total: 0 };
      existing.total += sale.total;
      totals.set(sale.customer._id, existing);
    });
    return Array.from(totals.values())
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  }, [sales]);

  if (!overview) {
    return <div className="page-loader">Compiling analytics…</div>;
  }

  return (
    <div className="page-stack">
      <header className="page-header">
        <div>
          <h2>Reporting & Analytics</h2>
          <p>Financial pulse of AgroShop with GST-billed revenue visibility.</p>
        </div>
      </header>

      <div className="chart-grid">
        <SectionCard title="Sales trend" description="Last 12 months billing">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={salesTrend}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="label" />
              <YAxis tickFormatter={(value) => `${Math.round(value / 1000)}K`} />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Bar dataKey="total" fill="#0f9d58" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Top customers" description="Contribution by billed amount">
          {topCustomers.length === 0 ? (
            <p className="empty-state">No customer invoices yet.</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Lifetime billing</th>
                </tr>
              </thead>
              <tbody>
                {topCustomers.map((row) => (
                  <tr key={row.name}>
                    <td>{row.name}</td>
                    <td>{formatCurrency(row.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </SectionCard>
      </div>

      <SectionCard title="Cashflow breakdown" description="Based on payment module classifications">
        <table className="data-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {overview.paymentsTotal.map((row) => (
              <tr key={row._id}>
                <td>{row._id}</td>
                <td>{formatCurrency(row.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>
    </div>
  );
};

export default ReportsPage;

