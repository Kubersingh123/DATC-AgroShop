import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProductsPage from './pages/ProductsPage';
import InventoryPage from './pages/InventoryPage';
import SalesPage from './pages/SalesPage';
import CustomersPage from './pages/CustomersPage';
import PaymentsPage from './pages/PaymentsPage';
import SuppliersPage from './pages/SuppliersPage';
import ReportsPage from './pages/ReportsPage';

const App: React.FC = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />

    <Route element={<ProtectedRoute />}>
      <Route element={<Layout />}>
        <Route index element={<DashboardPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route
          path="inventory"
          element={
            <ProtectedRoute roles={['admin', 'manager']}>
              <InventoryPage />
            </ProtectedRoute>
          }
        />
        <Route path="sales" element={<SalesPage />} />
        <Route path="customers" element={<CustomersPage />} />
        <Route
          path="payments"
          element={
            <ProtectedRoute roles={['admin', 'manager']}>
              <PaymentsPage />
            </ProtectedRoute>
          }
        />
        <Route path="suppliers" element={<SuppliersPage />} />
        <Route
          path="reports"
          element={
            <ProtectedRoute roles={['admin', 'manager']}>
              <ReportsPage />
            </ProtectedRoute>
          }
        />
      </Route>
    </Route>

    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default App;

