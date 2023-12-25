export interface Employee {
  id: number;
  companyId: number;
  lastName: string;
  firstName: string;
  position: string;
}

export interface EmployeeState {
  list: Employee[];
  selectedIds: number[];
}

export type EmployeeAction =
  | { type: 'SELECT_EMPLOYEE'; payload: number }
  | { type: 'TOGGLE_SELECT_ALL_EMPLOYEES' }
  | { type: 'DELETE_SELECTED_EMPLOYEES' }
  | { type: 'ADD_EMPLOYEE'; payload: Employee & { employeeCount: number } }
  | { type: 'EDIT_EMPLOYEE'; payload: Employee };
