
import React, { useState } from 'react';
import CompanyList from '../features/Company/CompanyTable';
import EmployeeList from '../features/Employee/EmployeeTable';
import './App.css';

const App: React.FC = () => {
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null);

  const handleCompanySelection = (companyId: number) => {
    setSelectedCompanyId(companyId);
  };

  const handleClearCompanySelection = () => {
    setSelectedCompanyId(null);
  };

  return (
    <div className="container">
      <CompanyList onCompanySelect={handleCompanySelection} />
      {selectedCompanyId !== null && <EmployeeList />}
      <button onClick={handleClearCompanySelection}>Убрать список сотрудников</button>
    </div>
  );
};

export default App;
