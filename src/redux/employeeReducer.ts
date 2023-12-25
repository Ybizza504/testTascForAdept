import { EmployeeAction, EmployeeState } from '../features/Employee/types';

const initialState: EmployeeState = {
  list: [
    { id: 1, companyId: 1, lastName: 'Doe', firstName: 'John', position: 'Developer' },
    { id: 2, companyId: 1, lastName: 'Smith', firstName: 'Jane', position: 'Designer' },
    { id: 3, companyId: 1, lastName: 'Johnson', firstName: 'Bob', position: 'Manager' },
    { id: 4, companyId: 2, lastName: 'Brown', firstName: 'Alice', position: 'Developer' },
    { id: 5, companyId: 2, lastName: 'Williams', firstName: 'Charlie', position: 'Designer' },
    { id: 6, companyId: 2, lastName: 'Lee', firstName: 'David', position: 'Manager' },
    
  ],
  selectedIds: [],
};

const employeeReducer = (state = initialState, action: EmployeeAction): EmployeeState => {
  switch (action.type) {
    case 'SELECT_EMPLOYEE':
      const selectedEmployeeId = action.payload;
      const isSelected = state.selectedIds.includes(selectedEmployeeId);

      return {
        ...state,
        selectedIds: isSelected
          ? state.selectedIds.filter((id) => id !== selectedEmployeeId)
          : [...state.selectedIds, selectedEmployeeId],
      };

    case 'TOGGLE_SELECT_ALL_EMPLOYEES':
      return {
        ...state,
        selectedIds: state.selectedIds.length === state.list.length ? [] : state.list.map((employee) => employee.id),
      };

    case 'DELETE_SELECTED_EMPLOYEES':
      return {
        ...state,
        list: state.list.filter((employee) => !state.selectedIds.includes(employee.id)),
        selectedIds: [],
      };

      case 'ADD_EMPLOYEE':
        return {
          ...state,
          list: [...state.list, action.payload],
        };
        case 'EDIT_EMPLOYEE':
      const editedEmployee = action.payload;
      return {
        ...state,
        list: state.list.map((employee) =>
          employee.id === editedEmployee.id ? { ...employee, ...editedEmployee } : employee
        ),
      };

    default:
      return state;
  }
};

export default employeeReducer;

