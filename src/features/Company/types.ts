// Company.types.ts
export interface Company {
  id: number;
  name: string;
  employeeCount: number;
  address: string;
}

export type CompanyAction =
  | { type: 'SELECT_COMPANY'; payload: number }
  | { type: 'TOGGLE_SELECT_ALL_COMPANIES' }
  | { type: 'DELETE_SELECTED_COMPANIES' }
  | { type: 'ADD_COMPANY'; payload: Company }
  | { type: 'UPDATE_COMPANY_EMPLOYEE_COUNT'; payload: { companyId: number; employeeCount: number } }
  | { type: 'EDIT_COMPANY'; payload: Company };

export interface CompanyState {
  list: Company[];
  selectedIds: number[];
}



