export interface FilterBarConfig {
  filters: Filter[];
}

export interface Filter {
  id: string;
  label: string;
  icon?: string;
  type: 'SELECT' | 'INPUT' | 'AUTOCOMPLETE' | 'MULTISELECT';
  options: FilterOption[];
}

export interface FilterOption {
  id: string;
  label: string;
}

export type FilterQuery = Record<string, string>;
