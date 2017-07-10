import React from 'react';
import EmployeesTable from './EmployeesTable';

const Employees = props => (
  <div>
    <div className="row">
      <div className="col-sm-12">
        <h1>Employees</h1>
      </div>
    </div>
    <EmployeesTable />
  </div>
);

export default Employees;
