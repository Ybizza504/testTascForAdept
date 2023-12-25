import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import './styles/employeeListStyles.css';


interface EmployeeTableProps {}

const EmployeeTable: React.FC<EmployeeTableProps> = () => {
  const employees = useSelector((state: RootState) => state.employees.list);
  const selectedEmployeeIds = useSelector((state: RootState) => state.employees.selectedIds);
  const selectedCompanyIds = useSelector((state: RootState) => state.companies.selectedIds);
  const dispatch: AppDispatch = useDispatch();

  const [newEmployee, setNewEmployee] = useState({
    companyId: 0,
    lastName: '',
    firstName: '',
    position: '',
  });

  const [editingEmployeeId, setEditingEmployeeId] = useState<number | null>(null);

  useEffect(() => {
    setNewEmployee((prevEmployee) => ({
      ...prevEmployee,
      companyId: selectedCompanyIds[0] || 0,
    }));
  }, [selectedCompanyIds]);

  const handleCheckboxChange = useCallback(
    (employeeId: number) => {
      dispatch({ type: 'SELECT_EMPLOYEE', payload: employeeId });
    },
    [dispatch]
  );

  const handleSelectAllChange = useCallback(() => {
    dispatch({ type: 'TOGGLE_SELECT_ALL_EMPLOYEES' });
  }, [dispatch]);

  const handleDeleteClick = useCallback(() => {
    const uniqueCompanyIds = Array.from(
      new Set(
        employees
          .filter((employee) => selectedEmployeeIds.includes(employee.id))
          .map((employee) => employee.companyId)
      )
    );

    dispatch({ type: 'DELETE_SELECTED_EMPLOYEES' });

    uniqueCompanyIds.forEach((companyId) => {
      const deletedEmployeesCount = selectedEmployeeIds.filter(
        (id) => employees.find((employee) => employee.id === id)?.companyId === companyId
      ).length;

      if (deletedEmployeesCount > 0) {
        dispatch({
          type: 'UPDATE_COMPANY_EMPLOYEE_COUNT',
          payload: { companyId, employeeCount: -deletedEmployeesCount },
        });
      }
    });
  }, [dispatch, employees, selectedEmployeeIds]);

  const updateCompanyEmployeeCount = useCallback(
    (companyId: number) => {
      dispatch({
        type: 'UPDATE_COMPANY_EMPLOYEE_COUNT',
        payload: { companyId, employeeCount: 1 },
      });
    },
    [dispatch]
  );

  const handleAddEmployeeSubmit: React.FormEventHandler<HTMLFormElement> = useCallback(
    (e) => {
      e.preventDefault();
      const temporaryId = Date.now();
      const newEmployeeWithId = {
        ...newEmployee,
        id: temporaryId,
        employeeCount: 1,
      };

      dispatch({ type: 'ADD_EMPLOYEE', payload: newEmployeeWithId });
      updateCompanyEmployeeCount(newEmployeeWithId.companyId);

      setNewEmployee({
        companyId: selectedCompanyIds[0] || 0,
        lastName: '',
        firstName: '',
        position: '',
      });
    },
    [dispatch, newEmployee, selectedCompanyIds, updateCompanyEmployeeCount]
  );

  const handleEditClick = useCallback(
    (employeeId: number) => {
      const employeeToEdit = employees.find((employee) => employee.id === employeeId);
      if (employeeToEdit) {
        setNewEmployee({
          companyId: employeeToEdit.companyId,
          lastName: employeeToEdit.lastName,
          firstName: employeeToEdit.firstName,
          position: employeeToEdit.position,
        });
        setEditingEmployeeId(employeeId);
      }
    },
    [employees]
  );

  const handleEditEmployee: React.FormEventHandler<HTMLFormElement> = useCallback(
    (e) => {
      e.preventDefault();

      if (editingEmployeeId !== null) {
        const updatedEmployee = {
          ...newEmployee,
          id: editingEmployeeId,
        };

        dispatch({ type: 'EDIT_EMPLOYEE', payload: updatedEmployee });

        // Reset the form and editing state
        setNewEmployee({
          companyId: selectedCompanyIds[0] || 0,
          lastName: '',
          firstName: '',
          position: '',
        });
        setEditingEmployeeId(null);
      }
    },
    [dispatch, editingEmployeeId, newEmployee, selectedCompanyIds]
  );

  return (
    <div className="employee-list">
      <h2>Список сотрудников</h2>
      <form onSubmit={editingEmployeeId !== null ? handleEditEmployee : handleAddEmployeeSubmit}>
        <label>
          Фамилия:
          <input
            type="text"
            value={newEmployee.lastName}
            onChange={(e) => setNewEmployee({ ...newEmployee, lastName: e.target.value })}
            required
          />
        </label>
        <label>
          Имя:
          <input
            type="text"
            value={newEmployee.firstName}
            onChange={(e) => setNewEmployee({ ...newEmployee, firstName: e.target.value })}
            required
          />
        </label>
        <label>
          Должность:
          <input
            type="text"
            value={newEmployee.position}
            onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
            required
          />
        </label>
        <button type="submit">
          {editingEmployeeId !== null ? 'Редактировать сотрудника' : 'Добавить сотрудника'}
        </button>
      </form>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>
              <input type="checkbox" onChange={handleSelectAllChange} />
            </th>
            <th>Фамилия</th>
            <th>Имя</th>
            <th>Должность</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {employees
            .filter((employee) => selectedCompanyIds.includes(employee.companyId))
            .map((employee) => (
              <tr
                key={employee.id}
                style={{
                  background: selectedEmployeeIds.includes(employee.id) ? '#ffcccc' : 'white',
                }}
              >
                <td>
                  <input
                    type="checkbox"
                    onChange={() => handleCheckboxChange(employee.id)}
                    checked={selectedEmployeeIds.includes(employee.id)}
                  />
                </td>
                <td>{employee.lastName}</td>
                <td>{employee.firstName}</td>
                <td>{employee.position}</td>
                <td>
                  <button onClick={() => handleEditClick(employee.id)}>Редактировать</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <button onClick={handleDeleteClick} disabled={selectedEmployeeIds.length === 0}>
        Удалить выделенных сотрудников
      </button>
    </div>
  );
};

export default EmployeeTable;