import React from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import Review from './Review';
import LoadingAnimation from '../shared/LoadingAnimation';
import Error from '../shared/Error';

const ReviewContainer = (props) => {
  if (props.reviewQuery.loading || props.lastReviewed.loading) { // eslint-disable-line react/prop-types
    return <LoadingAnimation />;
  }
  if (props.reviewQuery.error) {
    return <Error message={props.reviewQuery.error.message} />;
  }
  if (props.lastReviewed.error) { // eslint-disable-line react/prop-types
    return <Error message={props.lastReviewed.error.message} /> // eslint-disable-line react/prop-types
  }
  return (
    <Review review={props.reviewQuery.review} userId={props.reviewQuery.employee.id} printable={props.location.query.printable === 'yes'} lastReviewed={props.lastReviewed.employee.last_reviewed} location={props.location} />
  );
};

const getReviewQuery = gql`
  query getReviewQuery($id: Int, $employee_id: Int) {
    employee {
      id
    }
    review (id: $id, employee_id: $employee_id) {
      id
      status
      status_date
      supervisor_id
      employee_id
      position
      previousReviewDate
      periodStart
      periodEnd
      reviewer_name
      employee_name
      questions {
        id
        type
        question
        answer
        required
      }
      responses {
        question_id
        Response
      }
    }
  }
`;

const getLastReviewedQuery = gql`
  query getLastReviewedQuery($id: Int) {
    employee (id: $id) {
      last_reviewed
    }
  }
`;

const ReviewContainerGQL = compose(
  graphql(getReviewQuery, {
    name: 'reviewQuery',
    options: ownProps => ({
      variables: {
        id: ownProps.location.query['check-in'] || -1,
        employee_id: ownProps.location.query.emp,
      },
      fetchPolicy: 'network-only',
    }),
  }),
  graphql(getLastReviewedQuery, { name: 'lastReviewed',
    options: ownProps => ({
      variables: {
        id: ownProps.location.query.emp,
      },
    }),
  }),
)(ReviewContainer);

export default ReviewContainerGQL;
