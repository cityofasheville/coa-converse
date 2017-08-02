import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import { Link } from 'react-router';
import moment from 'moment';
import Icon from '../shared/Icon';
import { IM_WARNING2, IM_HOURGLASS } from '../shared/iconConstants';

const getTimeSinceLastConversation = (employee) => {
  if (!employee.reviewable) {
    return <span>--</span>;
  }
  const lastReviewedDate = moment(employee.last_reviewed).format('M/DD/YYYY');
  if (lastReviewedDate === '12/31/1969') {
    return <Link to={{ pathname: 'conversation', query: { emp: employee.id } }}><span style={{ color: 'red' }}>Never Reviewed <Icon path={IM_WARNING2} size={18} /></span></Link>;
  }
  const today = moment(new Date(), 'M/DD/YYYY');
  const daysSinceLastReview = today.diff(moment(lastReviewedDate, 'M/DD/YYYY'), 'days');
  if (daysSinceLastReview >= 90) {
    return <Link to={{ pathname: 'conversation', query: { emp: employee.id } }}><span style={{ color: 'red' }}>{daysSinceLastReview} days <Icon path={IM_WARNING2} size={18} /></span></Link>
  }
  if (daysSinceLastReview > 83) {
    return <Link to={{ pathname: 'conversation', query: { emp: employee.id } }}><span style={{ color: 'orange'}}>{daysSinceLastReview} days <Icon path={IM_HOURGLASS} size={18} /></span></Link>
  }
  return <Link to={{ pathname: 'conversation', query: { emp: employee.id } }}><span className="text-primary">{daysSinceLastReview} days </span></Link>
};

const dataColumns = [
  {
    Header: 'Name',
    accessor: 'name',
    minWidth: 300,
    Cell: (row) => (
      <Link to={{ pathname: '/', query: { emp: row.original.id } }}>
        <span>{row.original.name}</span>
      </Link>
    ),
  },
  {
    Header: (<div>Time Since<br />Last Conversation</div>),
    id: 'timeSinceLastReview',
    accessor: (employee) => ( getTimeSinceLastConversation(employee) ),
    maxWidth: 200,
    minWidth: 140,
  },
  {
    Header: (<div>Last Conversation<br />Completed</div>),
    accessor: 'last_reviewed',
    maxWidth: 200,
    minWidth: 130,
    Cell: (row) => (
      <span>{moment(row.original.last_reviewed).format('M/DD/YYYY') === '12/31/1969' ? '--' : moment(row.original.last_reviewed).format('M/DD/YYYY')}</span>
    ),
  },
];

const EmployeesTable = props => {
  const employees = props.data.employee === null ? [] : props.data.employee.employees;
  return (
    <div className="row">
      <div className="col-sm-12">
        {employees.length > 0 &&
          <div alt="Table of supervised employees" style={{ marginTop: '10px' }}>
            <ReactTable
              data={employees}
              columns={dataColumns}
              pageSize={employees.length < 20 ? employees.length : 20}
              showPagination={employees.length >= 20 ? true : false}
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
  )
};

EmployeesTable.propTypes = {
  data: PropTypes.object, // eslint-disable-line
};

// EmployeesTable.defaultProps = {
//   data: testEmployees,
// }

export default EmployeesTable;
