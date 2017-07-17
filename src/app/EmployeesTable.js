import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import { Link } from 'react-router';
import moment from 'moment';
import Icon from '../shared/Icon';
import { IM_WARNING2, IM_HOURGLASS } from '../shared/iconConstants';

// const testEmployees = [
//     {
//     id: 6409,
//     reviewable: false,
//     active: true,
//     name: 'ADAM D GRIFFITH',
//     email: 'agriffith@ashevillenc.gov',
//     position: null,
//     department: 'IT',
//     division: 'BPT',
//     last_reviewed: '',
//     review_by: '',
//     supervisor_id: 123,
//     supervisor_name: 'Scott Barnwell',
//     supervisor_email: 'sbarnwell@ashevillenc.gov',
//     employees: [],
//     reviews: [],
//   },
//   {
//     id: 6645,
//     active: true,
//     reviewable: true,
//     name: 'FRANCES C RUIZ',
//     email: 'fruiz@ashevillenc.gov',
//     position: 'Most Awesomest Coder Ever',
//     department: 'IT',
//     division: 'BPT',
//     last_reviewed: '06/23/2017',
//     review_by: 'Scott Barnwell',
//     supervisor_id: 123,
//     supervisor_name: 'Scott Barnwell',
//     supervisor_email: 'sbarnwell@ashevillenc.gov',
//     employees: [],
//     reviews: [
//       {
//         id: 56,
//         status: 'Closed',
//         supervisor_id: 123,
//         employee_id: 6645,
//         position: 'Most Awesomest Coder Ever',
//         periodStart: '6/23/2017',
//         periodEnd: '9/21/2017',
//         reviewer_name: 'Scott Barnwell',
//         employee_name: 'sbarnwell@ashevillenc.gov',
//         questions: [],
//         responses: [],
//       }
//     ],
//   },
//   {
//     id: 1337,
//     active: true,
//     reviewable: true,
//     name: 'CHRISTEN E MCNAMARA',
//     email: 'cmcnamara@ashevillenc.gov',
//     position: 'Most Awesomest GIS Whiz Ever',
//     department: 'IT',
//     division: 'BPT',
//     last_reviewed: '',
//     review_by: '',
//     supervisor_id: 123,
//     supervisor_name: 'Scott Barnwell',
//     supervisor_email: 'sbarnwell@ashevillenc.gov',
//     employees: [],
//     reviews: [],
//   },
//   {
//     id: 5912,
//     active: false,
//     reviewable: false,
//     name: 'EDWARD C CARLYLE',
//     email: '',
//     position: 'The One who Went to Utah',
//     department: 'IT',
//     division: 'BPT',
//     last_reviewed: '',
//     review_by: '',
//     supervisor_id: 123,
//     supervisor_name: 'Scott Barnwell',
//     supervisor_email: 'sbarnwell@ashevillenc.gov',
//     employees: [],
//     reviews: [],
//   },
//   {
//     id: 6507,
//     active: true,
//     reviewable: true,
//     name: 'PHILIP E JACKSON',
//     email: 'ejackson@ashevillenc.gov',
//     position: 'Most Awesomest Tech Guru Ever',
//     department: 'IT',
//     division: 'BPT',
//     last_reviewed: '6/29/2017',
//     review_by: 'Scott Barnwell',
//     supervisor_id: 123,
//     supervisor_name: 'Scott Barnwell',
//     supervisor_email: 'sbarnwell@ashevillenc.gov',
//     employees: [],
//     reviews: [
//       {
//         id: 15,
//         status: 'Open',
//         supervisor_id: 123,
//         employee_id: 6507,
//         position: 'Most Awesomest Tech Guru Ever',
//         periodStart: '6/29/2017',
//         periodEnd: '9/27/2017',
//         reviewer_name: 'Scott Barnwell',
//         employee_name: 'sbarnwell@ashevillenc.gov',
//         questions: [],
//         responses: [],
//       },
//       {
//         id: 152,
//         status: 'Closed',
//         supervisor_id: 123,
//         employee_id: 6507,
//         position: 'Most Awesomest Tech Guru Ever',
//         periodStart: '4/06/2017',
//         periodEnd: '7/07/2017',
//         reviewer_name: 'Scott Barnwell',
//         employee_name: 'sbarnwell@ashevillenc.gov',
//         questions: [],
//         responses: [],
//       }
//     ],
//   },
// ];

const getTimeSinceLastConversation = (employee) => {
  if (!employee.active) { //if (!employee.reviewable) {
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
      <Link to={{ pathname: 'conversations', query: { emp: row.original.id } }}>
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
