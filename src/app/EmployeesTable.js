import React from 'react';
import PropTypes from 'prop-types';
import AccessibleReactTable from 'accessible-react-table';
import { Link } from 'react-router';
import moment from 'moment';
import Icon from '../shared/Icon';
import { IM_WARNING2, IM_HOURGLASS } from '../shared/iconConstants';

const getTimeSinceLastConversation = (employee) => {
  if (!employee.reviewable) {
    return <span>--</span>;
  }
  const lastReviewedDate = employee.last_reviewed ? moment.utc(employee.last_reviewed).format('M/DD/YYYY') : null;
  if (lastReviewedDate === null) {
    return <Link to={{ pathname: 'check-in', query: { emp: employee.id } }} style={{ color: 'orange' }}>Never</Link>;
  }
  const today = moment.utc(new Date(), 'M/DD/YYYY');
  const daysSinceLastReview = today.diff(moment.utc(lastReviewedDate, 'M/DD/YYYY'), 'days');
  if (daysSinceLastReview > 30) {
    return <Link to={{ pathname: 'check-in', query: { emp: employee.id } }} style={{ color: 'red' }}>{daysSinceLastReview} days <Icon path={IM_WARNING2} size={18} /></Link>;
  }
  if (daysSinceLastReview > 21) {
    return <Link to={{ pathname: 'check-in', query: { emp: employee.id } }}><span style={{ color: 'orange' }}>{daysSinceLastReview} days <Icon path={IM_HOURGLASS} size={18} /></span></Link>;
  }
  return <Link to={{ pathname: 'check-in', query: { emp: employee.id } }}><span className="text-primary">{daysSinceLastReview} days </span></Link>;
};

const dataColumns = [
  {
    Header: 'Name',
    accessor: 'name',
    minWidth: 300,
    Cell: row => (
      <Link to={{ pathname: '/', query: { emp: row.original.id } }}>
        <span>{row.original.name}</span>
      </Link>
    ),
  },
  {
    Header: (<div>Time Since<br />Last Check-in</div>),
    id: 'timeSinceLastReview',
    accessor: employee => getTimeSinceLastConversation(employee),
    maxWidth: 200,
    minWidth: 140,
  },
  {
    Header: (<div>Last Check-in<br />Completed</div>),
    accessor: 'last_reviewed',
    maxWidth: 200,
    minWidth: 130,
    Cell: row => (
      <span>{!row.original.last_reviewed ? '--' : moment.utc(row.original.last_reviewed).format('M/DD/YYYY')}</span>
    ),
  },
];

const EmployeesTable = (props) => {
  const employees = props.data.employee === null ? [] : props.data.employee.employees;
  return (
    <div className="row">
      <div className="col-sm-12">
        {employees.length > 0 &&
          <div alt="Table of supervised employees" style={{ marginTop: '10px' }}>
            <AccessibleReactTable
              data={employees}
              columns={dataColumns}
              pageSize={employees.length < 20 ? employees.length : 20}
              showPagination={employees.length >= 20}
            />
          </div>
        }
        {employees.length === 0 &&
          <div className="alert alert-warning">
            No employees found.
          </div>
        }
      </div>
    </div>
  );
};

EmployeesTable.propTypes = {
  data: PropTypes.object, // eslint-disable-line
};

export default EmployeesTable;
