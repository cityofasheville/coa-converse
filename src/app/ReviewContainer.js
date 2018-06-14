import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import Review from './Review';
import LoadingAnimation from '../shared/LoadingAnimation';
import Error from '../shared/Error';

const GET_REVIEW = gql`
  query reviewQuery($id: Int, $employee_id: Int) {
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

const GET_LAST_REVIEWED = gql`
  query lastReviewed($id: Int) {
    employee (id: $id) {
      last_reviewed
    }
  }
`;

const ReviewContainer = (props) => (
  <Query
    query={GET_REVIEW}
    variables={{
      id: props.location.query['check-in'] || -1,
      employee_id: props.location.query.emp,
    }}
    fetchPolicy="network-only"
  >
    {({ loading, error, data }) => {
      if (loading) return <LoadingAnimation />;
      if (error) return <Error message={error.message} />;
      const loggedInEmployee = data.employee;
      const review = data.review;

      return (
        <Query
          query={GET_LAST_REVIEWED}
          variables={{
            id: props.location.query.emp,
          }}
        >
          {({ loading, error, data }) => {
            if (loading) return <LoadingAnimation />;
            if (error) return <Error message={error.message} />;
            const lastReviewed = data.employee.last_reviewed;
            return (
              <Review review={review} userId={loggedInEmployee.id} printable={props.location.query.printable === 'yes'} lastReviewed={lastReviewed} location={props.location} />
            );
          }}
        </Query>
      );
    }}
  </Query>
);

export default ReviewContainer;

