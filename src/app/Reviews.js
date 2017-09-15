import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { connect } from 'react-redux';
import ReviewsTable from './ReviewsTable';
import LoadingAnimation from '../shared/LoadingAnimation';

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
  //assumes there is ever only one non-closed review
  for (let review of reviews) {
    if (review.status !== 'Closed') {
      return [review];
    }
  }
  return [];
}

const Reviews = props => {
  if (props.data.loading) { // eslint-disable-line react/prop-types
    return <LoadingAnimation />;
  }
  if (props.data.error) { // eslint-disable-line react/prop-types
    return <p>{props.data.error.message}</p>; // eslint-disable-line react/prop-types
  }

  return (
    <div>
      <div className="row">
        <div className="col-sm-12">
          <h1>Check-ins with {props.data.employee.name}</h1>
          <span style={{ fontSize: '25px', marginTop: '10px' }} className="pull-right">Current Supervisor: {props.data.employee.supervisor_name || '--'}</span>
        </div>
      </div>
      <ReviewsTable reviews={getCurrentReview(props.data.employee.reviews)} current lastReviewed={props.data.employee.last_reviewed} reviewable={props.data.employee.reviewable} supervisorId={props.data.employee.supervisor_id} emp={props.data.employee.id} />
      <ReviewsTable reviews={getClosedReviews(props.data.employee.reviews)} />
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
}

Reviews.propTypes = {
  employee: PropTypes.shape(employeeShape), // eslint-disable-line
};

const getReviewsQuery = gql`
  query getReviewsQuery($id: Int) {
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

const ReviewsGQL = graphql(getReviewsQuery, {
  options: (ownProps)=> ({
    variables: {
      id: ownProps.location.query.emp,
    }
  })
})(Reviews);

export default ReviewsGQL;
