export interface Sale {
  name?: string;
  sales?: number;
}

export interface Category {
  name?: string;
  value?: number;
}

export interface OrderStatus {
  name?: string;
  value?: number;
}

export interface ProductPerformance {
  name?: string;
  Retention?: number;
  Revenue?: number;
  Profit?: number;
}

export interface Order {
  id?: string;
  client?: string;
  email?: string;
  total?: number;
  status?: string;
  date?: string;
  country?: string;
}

export interface OrderStat {
  name?: string;
  value?: string;
  icon?: string;
}

export interface Product {
  id?: string;
  name?: string;
  category?: string;
  price?: number;
  stock?: number;
  sales?: number;
  image?: string;
}

export interface SalesByCategory {
  name?: string;
  value?: number;
}

export interface Client {
  id?: number;
  name?: string;
  email?: string;
  phoneNumber?: string;
  country?: string;
  image?: string;
}

export interface SidebarItem {
  name?: string;
  icon?: string;
  href?: string;
}

export interface DashboardData {
  sales?: Sale[];
  categories?: Category[];
  orderStatus?: OrderStatus[];
  productPerformance?: ProductPerformance[];
  orders?: Order[];
  orderStats?: OrderStat[];
  products?: Product[];
  salesByCategory?: SalesByCategory[];
  clients?: Client[];
  sidebarItems?: SidebarItem[];
}
