import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import ReviewsTable from './ReviewsTable';
import LoadingAnimation from '../shared/LoadingAnimation';
import Error from '../shared/Error';

const getClosedReviews = (reviews) => {
  const closedReviews = [];
  for (let review of reviews) {
    if (review.status === 'Closed') {
      closedReviews.push(review);
    }
  }
  return closedReviews;
};

const getCurrentReview = (reviews) => {
  // assumes there is ever only one non-closed review
  for (let review of reviews) {
    if (review.status !== 'Closed') {
      return [review];
    }
  }
  return [];
};

const GET_REVIEWS = gql`
  query employee($id: Int) {
    employee (id: $id) {
      name
      id
      supervisor_name
      supervisor_id
      last_reviewed
      reviewable
      reviews {
        id
        status
        status_date
        employee_id
        periodStart
        periodEnd
        reviewer_name
      }
    }
  }
`;

const Reviews = (props) => (
  <Query
    query={GET_REVIEWS}
    variables={{
      id: props.location.query.emp,
    }}
    fetchPolicy="network-only"
  >
    {({ loading, error, data }) => {
      if (loading) return <LoadingAnimation />;
      if (error) return <Error message={error.message} />;

      return (
        <div>
          <div className="row">
            <div className="col-sm-12">
              <h1>Check-ins with {data.employee.name}</h1>
              <span style={{ fontSize: '25px', marginTop: '10px' }} className="pull-right">Current Supervisor: {data.employee.supervisor_name || '--'}</span>
            </div>
          </div>
          <ReviewsTable reviews={getCurrentReview(data.employee.reviews)} current lastReviewed={data.employee.last_reviewed} reviewable={data.employee.reviewable} supervisorId={data.employee.supervisor_id} emp={data.employee.id} />
          <ReviewsTable reviews={getClosedReviews(data.employee.reviews)} />
        </div>
      );
    }}
  </Query>
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

const employeeShape = {
  id: PropTypes.number,
  reviewable: PropTypes.bool,
  status: PropTypes.string,
  supervisor_id: PropTypes.number,
  employee_id: PropTypes.number,
  position: PropTypes.string,
  periodStart: PropTypes.string,
  periodEnd: PropTypes.string,
  reviewer_name: PropTypes.string,
  employee_name: PropTypes.string,
  employees: PropTypes.arrayOf(PropTypes.shape(employeeShape)),
  reviews: PropTypes.arrayOf(PropTypes.shape(reviewShape)),
};

Reviews.propTypes = {
  employee: PropTypes.shape(employeeShape), // eslint-disable-line
};

export default Reviews;
