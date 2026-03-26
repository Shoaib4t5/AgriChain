export type Role = 'Farmer' | 'Distributor' | 'Retailer';

export type ProductStatus = 'In-Stock' | 'In-Transit' | 'In-Warehouse' | 'Sold';

export interface User {
  name: string;
  email: string;
  password?: string;
  role: Role;
}

export interface Product {
  id: string;
  name: string;
  qty: number;
  status: ProductStatus;
  currentHolderEmail: string;
  createdBy: string;
  role: Role;
  history?: {
    status: ProductStatus;
    holder: string;
    timestamp: number;
  }[];
}
