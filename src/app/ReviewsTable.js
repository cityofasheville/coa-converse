import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import moment from 'moment';
import { Link } from 'react-router';

const dataColumnsCurrent = [
  {
    Header: 'Period',
    id: 'period',
    accessor: (review) => (<span>{moment(review.periodStart).format('M/DD/YYYY')} - {moment(review.periodEnd).format('M/DD/YYYY')}</span>),
    minWidth: 200,
    Cell: (row) => (
      <Link to={{ pathname: 'conversation', query: { emp: row.original.employee_id, rev: row.original.id } }}>{row.value}</Link>
    ),
  },
  {
    Header: 'Status',
    accessor: 'status',
    minWidth: 300,
  },
  {
    Header: 'Last Change',
    id: 'status_date',
    accessor: (review) => (<span>{moment(review.status_date).format('M/DD/YYYY')}</span>),
    maxWidth: 200,
    minWidth: 130,
  },
];

const dataColumns = [
  {
    Header: 'Period',
    id: 'period',
    accessor: (review) => (<span>{moment(review.periodStart).format('M/DD/YYYY')} - {moment(review.periodEnd).format('M/DD/YYYY')}</span>),
    minWidth: 200,
    Cell: (row) => (
      <Link to={{ pathname: 'conversation', query: { emp: row.original.employee_id, rev: row.original.id } }}>{row.value}</Link>
    ),
  },
  {
    Header: 'Date Completed',
    id: 'date_completed',
    accessor: (review) => (<span>{moment(review.status_date).format('M/DD/YYYY')}</span>),
    maxWidth: 200,
    minWidth: 130,
  },
  {
    Header: 'Supervisor',
    accessor: 'reviewer_name',
    minWidth: 300,
  }
];

const ReviewsTable = props => {
  const reviews = props.reviews === null ? [] : props.reviews;
  return (
    <div className="row">
      <div className="col-sm-12">
        <h2>{props.current ? 'Current Conversation' : 'Past Conversations'}</h2>
        {reviews.length === 0 &&
          <div className="alert alert-warning">
            <span className="alert-text">{props.current ? 'No current conversation found' : 'No past conversations found'}</span>
          </div>
        }
        {props.reviews.length > 0 &&
          <div alt={props.current ? 'Table displaying current conversation' : 'Table of past conversations'} style={{ marginTop: '10px' }}>
            <ReactTable
              data={reviews}
              columns={props.current ? dataColumnsCurrent : dataColumns}
              pageSize={reviews.length < 20 ? props.reviews.length : 20}
              showPagination={reviews.length >= 20 ? true : false}
            />
          </div>
        }
      </div>
    </div>
  );
}

const questionShape = {
  id: PropTypes.number,
  type: PropTypes.string,
  question: PropTypes.string,
  answer: PropTypes.string,
  required: PropTypes.bool,
};

const responseShape = {
  question_id: PropTypes.number,
  review_id: PropTypes.number,
  Response: PropTypes.string,
};

const reviewShape = {
  id: PropTypes.number,
  status: PropTypes.string,
  status_date: PropTypes.string,
  supervisor_id: PropTypes.number,
  employee_id: PropTypes.number,
  position: PropTypes.string,
  periodStart: PropTypes.string,
  periodEnd: PropTypes.string,
  reviewer_name: PropTypes.string,
  employee_name: PropTypes.string,
  questions: PropTypes.arrayOf(PropTypes.shape(questionShape)),
  responses: PropTypes.arrayOf(PropTypes.shape(responseShape)),
};

ReviewsTable.propTypes = {
  reviews: PropTypes.arrayOf(PropTypes.shape(reviewShape)),
  current: PropTypes.bool,
};

ReviewsTable.defaultProps = {
  current: false,
};

export default ReviewsTable;
