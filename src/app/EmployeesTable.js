import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';

const testData = [
  {
    name: 'Adam D Griffith',
    timeSinceLastReview: 'N/A',
    reviewDate: '',
  },
  {
    name: 'Christen E McNamara',
    timeSinceLastReview: 'Never Reviewed',
    reviewDate: '',
  },
  {
    name: 'Frances C Ruiz',
    timeSinceLastReview: '14 days',
    reviewDate: '6/23/2017',
  },    
]

const dataColumns = [
  {
    Header: 'Name',
    accessor: 'name',
  },
  {
    Header: (<div>Time Since<br />Last Conversation</div>),
    accessor: 'timeSinceLastReview', //this might need to be a function to calculate that
    maxWidth: 120,
    Cell: row => (
      <span>Test</span>
    ),
  },
  {
    Header: (<div>Last Conversation<br />Completed</div>),
    accessor: 'reviewDate',
    maxWidth: 120,
  },
];

const EmployeesTable = props => (
  <div className="row">
    <div className="col-sm-12">
      <div alt={['Table of', props.type, props.subType || '', 'supervised employees'].join(' ')} style={{ marginTop: '10px' }}>
        <ReactTable
          data={props.data}
          columns={dataColumns}
          pageSize={props.data.length < 10 ? props.data.length : 10}
          showPagination={props.data.length >= 10 ? true : false}
        />
      </div>
    </div>
  </div>
);

EmployeesTable.propTypes = {
  data: PropTypes.array, // eslint-disable-line
};

EmployeesTable.defaultProps = {
  data: testData,
}

export default EmployeesTable;
