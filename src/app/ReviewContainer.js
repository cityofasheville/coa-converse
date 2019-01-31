import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import queryString from 'query-string';
import Review from './Review';
import PrintableReview from './PrintableReview';
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

const ReviewContainer = (props) => {
  let fetched = false;
  const search = queryString.parse(location.search);
  const { emp, printable } = search;
  const id = search['check-in'] || -1;
  return (
    <Query
      query={GET_REVIEW}
      variables={{
        id,
        employee_id: emp,
      }}
      fetchPolicy="network-only"
      skip={fetched}
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
              id: emp,
            }}
            skip={fetched}
          >
            {({ loading, error, data }) => {
              if (loading) return <LoadingAnimation />;
              if (error) return <Error message={error.message} />;
              fetched = true;
              const lastReviewed = data.employee.last_reviewed;
              if (printable !== 'yes') {
                return (
                  <Review review={review} userId={loggedInEmployee.id} printable={printable === 'yes'} lastReviewed={lastReviewed} location={props.location} />
                );
              }
              return <PrintableReview review={review} userId={loggedInEmployee.id} lastReviewed={lastReviewed} />;
            }}
          </Query>
        );
      }}
    </Query>);
};

export default ReviewContainer;

