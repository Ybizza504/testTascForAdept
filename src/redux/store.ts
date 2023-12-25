import { createStore, combineReducers } from 'redux';
import companyReducer from './companyReducer';
import employeeReducer from './employeeReducer';

const rootReducer = combineReducers({
  companies: companyReducer,
  employees: employeeReducer,
});

const store = createStore(rootReducer);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
