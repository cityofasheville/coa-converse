import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import { Link } from 'react-router';

// const getLastConversationCompleted = (employee) => {
//   // of the reviews with status closed, return one with latest periodStart value
//   let latestReview = null;
//   for (let review of employee.reviews) {
//     if (review.status === 'Closed' && latestReview !== null) {
//       if (moment(latestReview.periodStart, 'M/DD/YYYY') > moment(review.periodStart, 'M/DD/YYYY')) {
//         latestReview = review;
//       }
//     } else {
//       latestReview = review;
//     }
//   }
//   if (latestReview === null) {
//     return null;
//   }
//   return latestReview.periodStart;
// };

const dataColumnsCurrent = [
  {
    Header: 'Period',
    id: 'period',
    accessor: (review) => (<span>{review.periodStart} - {review.periodEnd}</span>),
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
    accessor: 'status_date',
    maxWidth: 200,
    minWidth: 130,
  },
];

const dataColumns = [
  {
    Header: 'Period',
    id: 'period',
    accessor: (review) => (<span>{review.periodStart} - {review.periodEnd}</span>),
    minWidth: 200,
    Cell: (row) => (
      <Link to={{ pathname: 'conversation', query: { emp: row.original.employee_id, rev: row.original.id } }}>{row.value}</Link>
    ),
  },
  {
    Header: 'Date Completed',
    accessor: 'status_date',
    maxWidth: 200,
    minWidth: 130,
  },
  {
    Header: 'Reviewer',
    accessor: 'reviewer_name',
    minWidth: 300,
  }
];

const ReviewsTable = props => (
  <div className="row">
    <div className="col-sm-12">
      <h2>{props.current ? 'Current Conversation' : 'Past Conversations'}</h2>
      {props.reviews.length === 0 &&
        <div className="alert alert-warning">
          <span className="alert-text">{props.current ? 'No current conversation found' : 'No past conversations found'}</span>
        </div>
      }
      {props.reviews.length > 0 &&
        <div alt={props.current ? 'Table displaying current conversation' : 'Table of past conversations'} style={{ marginTop: '10px' }}>
          <ReactTable
            data={props.reviews}
            columns={props.current ? dataColumnsCurrent : dataColumns}
            pageSize={props.reviews.length < 20 ? props.reviews.length : 20}
            showPagination={props.reviews.length >= 20 ? true : false}
          />
        </div>
      }
    </div>
  </div>
);

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
};

export default ReviewsTable;
