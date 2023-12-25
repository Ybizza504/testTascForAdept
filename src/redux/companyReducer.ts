import { CompanyAction, CompanyState } from '../features/Company/types';

const initialState: CompanyState = {
  list: [
    { id: 1, name: 'Company A', employeeCount: 3, address: 'Address A' },
    { id: 2, name: 'Company B', employeeCount: 3, address: 'Address B' },
  ],
  selectedIds: [],
};

const companyReducer = (
  state = initialState,
  action: CompanyAction
): CompanyState => {
  switch (action.type) {
    case 'SELECT_COMPANY':
      const selectedCompanyId = action.payload;
      const isSelected = state.selectedIds.includes(selectedCompanyId);

      return {
        ...state,
        selectedIds: isSelected
          ? state.selectedIds.filter((id) => id !== selectedCompanyId)
          : [...state.selectedIds, selectedCompanyId],
      };

    case 'TOGGLE_SELECT_ALL_COMPANIES':
      return {
        ...state,
        selectedIds:
          state.selectedIds.length === state.list.length
            ? []
            : state.list.map((company) => company.id),
      };

    case 'DELETE_SELECTED_COMPANIES':
      return {
        ...state,
        list: state.list.filter(
          (company) => !state.selectedIds.includes(company.id)
        ),
        selectedIds: [],
      };

    case 'ADD_COMPANY':
      const newCompany = action.payload;
      return {
        ...state,
        list: [...state.list, newCompany],
      };

    case 'UPDATE_COMPANY_EMPLOYEE_COUNT':
      const { companyId, employeeCount } = action.payload;
      return {
        ...state,
        list: state.list.map((company) =>
          company.id === companyId
            ? {
                ...company,
                employeeCount: company.employeeCount + employeeCount,
              }
            : company
        ),
      };

   case 'EDIT_COMPANY':
      const editedCompany = action.payload;

      return {
        ...state,
        list: state.list.map((company) =>
          company.id === editedCompany.id ? editedCompany : company
        ),
      };

    default:
      return state;
  }
};

export default companyReducer;
