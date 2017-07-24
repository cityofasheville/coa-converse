import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { connect } from 'react-redux';
import Review from './Review';
import PrintableReview from './Review';
import LoadingAnimation from '../shared/LoadingAnimation';

const ReviewContainer = props => {
  if (props.data.loading) { // eslint-disable-line react/prop-types
    return <LoadingAnimation />;
  }
  if (props.data.error) { // eslint-disable-line react/prop-types
    return <p>{props.data.error.message}</p>; // eslint-disable-line react/prop-types
  }

  return (
    <Review review={props.data.review} userId={props.data.employee.id} printable={props.location.query.printable === 'yes'} location={props.location} />
  );
}

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

const ReviewContainerGQL = graphql(getReviewQuery, {
  options: (ownProps)=> ({
    variables: {
      id: ownProps.location.query.rev || -1,
      employee_id: ownProps.location.query.emp,
    }
  })
})(ReviewContainer);

export default ReviewContainerGQL;
