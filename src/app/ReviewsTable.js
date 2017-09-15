import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import moment from 'moment';
import { Link } from 'react-router';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import LoadingAnimation from '../shared/LoadingAnimation';
import Icon from '../shared/Icon';
import { IM_WARNING2, IM_HOURGLASS } from '../shared/iconConstants';

const getTimeSinceLastConversation = (reviewDate, reviewable) => {
  if (!reviewable) {
    return <span>--</span>;
  }
  const lastReviewedDate = reviewDate ? moment.utc(reviewDate).format('M/DD/YYYY') : null;
  if (!lastReviewedDate) {
    return <span style={{ color: 'orange' }}>Never</span>;
  }
  const today = moment.utc(new Date(), 'M/DD/YYYY');
  const daysSinceLastReview = today.diff(moment.utc(lastReviewedDate, 'M/DD/YYYY'), 'days');
  if (daysSinceLastReview >= 90) {
    return <span style={{ color: 'red' }}>{daysSinceLastReview} days <Icon path={IM_WARNING2} size={18} /></span>
  }
  if (daysSinceLastReview > 83) {
    return <span style={{ color: 'orange'}}>{daysSinceLastReview} days <Icon path={IM_HOURGLASS} size={18} /></span>
  }
  return <span>{daysSinceLastReview} days </span>
};

const dataColumnsCurrent = [
  {
    Header: (<div>Check-in Date</div>),
    id: 'periodEnd',
    accessor: (review) => (<span title="View check-in">{moment.utc(review.periodEnd).format('M/DD/YYYY')}</span>),
    minWidth: 160,
    Cell: (row) => (
      <Link to={{ pathname: 'check-in', query: { emp: row.original.employee_id, 'check-in': row.original.id } }}>{row.value}</Link>
    ),
  },
  {
    Header: 'Status',
    id: 'status',
    accessor: (review) => {
      switch (review.status) {
        case 'Open':
          return <span>Waiting for supervisor comments</span>
        case 'Ready':
          return <span>Waiting for employee acknowledgement</span>
        case 'Acknowledged':
          return <span>Waiting for supervisor to finalize</span>
        case 'Closed':
          return <span>Completed</span>
        default:
          return <span></span>
      }
    },
    minWidth: 300,
  },
  {
    Header: 'Last Change',
    id: 'status_date',
    accessor: (review) => (<span>{moment.utc(review.status_date).format('M/DD/YYYY')}</span>),
    maxWidth: 200,
    minWidth: 130,
  },
];

const dataColumns = [
  {
    Header: (<div>Check-in Date</div>),
    id: 'periodEnd',
    accessor: (review) => (<span title="View check-in">{moment.utc(review.periodEnd).format('M/DD/YYYY')}</span>),
    minWidth: 200,
    Cell: (row) => (
      <Link to={{ pathname: 'check-in', query: { emp: row.original.employee_id, 'check-in': row.original.id } }}>{row.value}</Link>
    ),
  },
  {
    Header: 'Supervisor',
    accessor: 'reviewer_name',
    minWidth: 300,
  }
];

const ReviewsTable = props => {
  if (props.data.loading) { // eslint-disable-line react/prop-types
    return <LoadingAnimation />;
  }
  if (props.data.error) { // eslint-disable-line react/prop-types
    return <p>{props.data.error.message}</p>; // eslint-disable-line react/prop-types
  }

  const reviews = props.reviews === null ? [] : props.reviews;
  const loggedInEmpId = props.data.employee.id;
  return (
    <div className="row">
      <div className="col-sm-12">
        <h2>
          {props.current ? 'Current Check-in' : 'Past Check-ins'}
          {props.current &&
            <span style={{ fontSize: '16px', marginLeft: '15px', fontStyle: 'italic' }}>Time since last check-in: {getTimeSinceLastConversation(props.lastReviewed, props.reviewable)}</span>
          }
        </h2>
        {reviews.length === 0 &&
          <div className="alert alert-warning">
            <span className="alert-text">{props.current ? 'No current check-in found' : 'No past check-ins found'}</span>
            {props.current && (props.supervisorId === loggedInEmpId) &&
              <Link to={{ pathname: 'check-in', query: { emp: props.emp } }}><div className="btn btn-primary btn-sm" style={{ marginLeft: '10px' }}>Begin a check-in</div></Link>
            }
          </div>
        }
        {props.reviews.length > 0 &&
          <div alt={props.current ? 'Table displaying current check-in' : 'Table of past check-ins'} style={{ marginTop: '10px' }}>
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

const getLoggedInEmpIdQuery = gql`
  query getLoggedInEmpIdQuery {
    employee {
      id
      name
    }
  }
`;

export default graphql(getLoggedInEmpIdQuery, {})(ReviewsTable);
