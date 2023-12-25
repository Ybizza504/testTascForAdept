import React, { useCallback, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { CompanyAction } from './types';
import './styles/companyListStyles.css';

interface CompanyTableProps {
  onCompanySelect: (companyId: number) => void;
}

const CompanyTable: React.FC<CompanyTableProps> = ({ onCompanySelect }) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [editingCompanyId, setEditingCompanyId] = useState<number | null>(null);
  const dispatch = useDispatch();
  const companies = useSelector((state: RootState) => state.companies);
  const employees = useSelector((state: RootState) => state.employees);

  const { list, selectedIds } = companies;

  const editingCompany = useMemo(
    () => list.find((company) => company.id === editingCompanyId),
    [list, editingCompanyId]
  );

  const handleCheckboxChange = useCallback(
    (companyId: number) => {
      dispatch({ type: 'SELECT_COMPANY', payload: companyId });
    },
    [dispatch]
  );

  const handleSelectAllChange = useCallback(() => {
    dispatch({ type: 'TOGGLE_SELECT_ALL_COMPANIES' });
  }, [dispatch]);

  const handleDeleteSelected = useCallback(() => {
    dispatch({ type: 'DELETE_SELECTED_COMPANIES' });
  }, [dispatch]);

  const handleAddCompany: React.FormEventHandler<HTMLFormElement> = useCallback(
    (e) => {
      e.preventDefault();

      const newCompany = {
        id: Date.now(),
        name: name,
        employeeCount: 0,
        address: address,
      };
      dispatch({ type: 'ADD_COMPANY', payload: newCompany });

      setName('');
      setAddress('');
    },
    [dispatch, name, address]
  );

  const handleEditClick = useCallback(
    (companyId: number) => {
      const companyToEdit = list.find((company) => company.id === companyId);
      if (companyToEdit) {
        setName(companyToEdit.name);
        setAddress(companyToEdit.address);
        setEditingCompanyId(companyId);
      }
    },
    [list]
  );

  const handleEditCompany: React.FormEventHandler<HTMLFormElement> = useCallback(
    (e) => {
      e.preventDefault();

      if (editingCompanyId !== null) {
        const updatedCompany = {
          id: editingCompanyId,
          name: name,
          employeeCount: editingCompany?.employeeCount || 0,
          address: address,
        };

        dispatch({ type: 'EDIT_COMPANY', payload: updatedCompany });

        // Reset the form and editing state
        setName('');
        setAddress('');
        setEditingCompanyId(null);
      }
    },
    [dispatch, editingCompanyId, name, address, editingCompany]
  );

  const handleCompanyClick = (companyId: number) => {
    onCompanySelect(companyId);
  };

  return (
    <div className="company-list">
      <h2>Список Компаний</h2>
      <form onSubmit={editingCompanyId !== null ? handleEditCompany : handleAddCompany}>
        <input type="text" value={name} placeholder='Имя компании' onChange={(e) => setName(e.target.value)} />
        <input type="text" value={address} placeholder='Адрес компании' onChange={(e) => setAddress(e.target.value)} />
        <button type="submit">{editingCompanyId !== null ? 'Изменить компанию' : 'Добавить компанию'}</button>
      </form>
      <button onClick={handleDeleteSelected} disabled={selectedIds.length === 0}>
        Удалить выбраное
      </button>
      <table>
        <thead>
          <tr>
            <th>
              <input type="checkbox" onChange={handleSelectAllChange} />
            </th>
            <th>Имя компании</th>
            <th>Количество сотрудников</th>
            <th>Адрес компании</th>
            <th>Изменения</th>
          </tr>
        </thead>
        <tbody>
          {list.map((company) => (
            <tr
              key={company.id}
              style={{
                backgroundColor: selectedIds.includes(company.id) ? 'lightblue' : 'white',
              }}
              onClick={() => handleCompanyClick(company.id)}
            >
              <td>
                <input
                  type="checkbox"
                  checked={selectedIds.includes(company.id)}
                  onChange={() => handleCheckboxChange(company.id)}
                />
              </td>
              <td>{company.name}</td>
              <td>{company.employeeCount}</td>
              <td>{company.address}</td>
              <td>
                <button onClick={() => handleEditClick(company.id)}>Изменить</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CompanyTable;