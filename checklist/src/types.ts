export interface Product {
  id: string;
  name: string;
  category: string;
  location?: string;
  sortOrder?: number;
  active: boolean;
}

export type ViewMode = 'list' | 'fetch';

export interface AppState {
  products: Product[];
  items: Record<string, { quantity: number; completed: boolean }>;
  viewMode: ViewMode;
  loading: boolean;
  error: any | null;
}
