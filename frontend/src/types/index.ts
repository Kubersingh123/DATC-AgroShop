export type Role = 'admin' | 'manager' | 'staff';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
}

export interface Supplier {
  _id: string;
  name: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
  gstNumber?: string;
  accountBalance?: number;
  notes?: string;
  createdAt?: string;
}

export interface Product {
  _id: string;
  name: string;
  sku: string;
  category?: string;
  unit?: string;
  description?: string;
  image?: string;
  costPrice?: number;
  salePrice?: number;
  gstRate?: number;
  stock: number;
  supplier?: Supplier;
}

export interface Customer {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  gstNumber?: string;
  outstandingBalance?: number;
  tags?: string[];
  createdAt?: string;
}

export interface InventoryTransaction {
  _id: string;
  product: Product;
  type: 'purchase' | 'sale' | 'adjustment';
  quantity: number;
  unitCost?: number;
  note?: string;
  transactionDate: string;
  createdAt: string;
}

export interface SaleItem {
  product: Product;
  quantity: number;
  rate: number;
  gstRate: number;
  gstAmount: number;
  lineTotal: number;
}

export interface Sale {
  _id: string;
  invoiceNumber: string;
  customer?: Customer;
  items: SaleItem[];
  subtotal: number;
  gstTotal: number;
  total: number;
  paymentStatus: 'pending' | 'paid' | 'partial';
  saleDate: string;
  createdAt: string;
}

export interface Payment {
  _id: string;
  type: 'incoming' | 'outgoing';
  entityType: 'customer' | 'supplier';
  entity?: Customer | Supplier;
  method: 'cash' | 'bank' | 'upi' | 'cheque';
  amount: number;
  reference?: string;
  notes?: string;
  paymentDate: string;
}

export interface DashboardData {
  user: User;
  stats: {
    productCount: number;
    saleCount: number;
    customerCount: number;
    supplierCount: number;
  };
  lowStock: Product[];
}

export interface ReportOverview {
  salesTotal: number;
  paymentsTotal: {
    _id: string;
    total: number;
  }[];
  productCount: number;
  recentSales: Sale[];
}

