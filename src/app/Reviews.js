import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { connect } from 'react-redux';
import ReviewsTable from './ReviewsTable';
import LoadingAnimation from '../shared/LoadingAnimation';

// const testEmployees = [
//     {
//     id: 6409,
//     reviewable: false,
//     active: true,
//     name: 'ADAM D GRIFFITH',
//     email: 'agriffith@ashevillenc.gov',
//     position: null,
//     department: 'IT',
//     division: 'BPT',
//     last_reviewed: '',
//     review_by: '',
//     supervisor_id: 123,
//     supervisor_name: 'Scott Barnwell',
//     supervisor_email: 'sbarnwell@ashevillenc.gov',
//     employees: [],
//     reviews: [],
//   },
//   {
//     id: 6645,
//     active: true,
//     reviewable: true,
//     name: 'FRANCES C RUIZ',
//     email: 'fruiz@ashevillenc.gov',
//     position: 'Most Awesomest Coder Ever',
//     department: 'IT',
//     division: 'BPT',
//     last_reviewed: '06/23/2017',
//     review_by: 'Scott Barnwell',
//     supervisor_id: 123,
//     supervisor_name: 'Scott Barnwell',
//     supervisor_email: 'sbarnwell@ashevillenc.gov',
//     employees: [],
//     reviews: [
//       {
//         id: 56,
//         status: 'Open',
//         supervisor_id: 123,
//         employee_id: 6645,
//         position: 'Most Awesomest Coder Ever',
//         periodStart: '6/23/2017',
//         periodEnd: '9/21/2017',
//         reviewer_name: 'Scott Barnwell',
//         employee_name: 'sbarnwell@ashevillenc.gov',
//         questions: [],
//         responses: [],
//       }
//     ],
//   },
//   {
//     id: 1337,
//     active: true,
//     reviewable: true,
//     name: 'CHRISTEN E MCNAMARA',
//     email: 'cmcnamara@ashevillenc.gov',
//     position: 'Most Awesomest GIS Whiz Ever',
//     department: 'IT',
//     division: 'BPT',
//     last_reviewed: '',
//     review_by: '',
//     supervisor_id: 123,
//     supervisor_name: 'Scott Barnwell',
//     supervisor_email: 'sbarnwell@ashevillenc.gov',
//     employees: [],
//     reviews: [],
//   },
//   {
//     id: 5912,
//     active: false,
//     reviewable: false,
//     name: 'EDWARD C CARLYLE',
//     email: '',
//     position: 'The One who Went to Utah',
//     department: 'IT',
//     division: 'BPT',
//     last_reviewed: '',
//     review_by: '',
//     supervisor_id: 123,
//     supervisor_name: 'Scott Barnwell',
//     supervisor_email: 'sbarnwell@ashevillenc.gov',
//     employees: [],
//     reviews: [],
//   },
//   {
//     id: 6507,
//     active: true,
//     reviewable: true,
//     name: 'PHILIP E JACKSON',
//     email: 'ejackson@ashevillenc.gov',
//     position: 'Most Awesomest Tech Guru Ever',
//     department: 'IT',
//     division: 'BPT',
//     last_reviewed: '6/29/2017',
//     review_by: 'Scott Barnwell',
//     supervisor_id: 123,
//     supervisor_name: 'Scott Barnwell',
//     supervisor_email: 'sbarnwell@ashevillenc.gov',
//     employees: [],
//     reviews: [
//       {
//         id: 15,
//         status: 'Open',
//         supervisor_id: 123,
//         employee_id: 6507,
//         position: 'Most Awesomest Tech Guru Ever',
//         periodStart: '6/29/2017',
//         periodEnd: '9/27/2017',
//         reviewer_name: 'Scott Barnwell',
//         employee_name: 'sbarnwell@ashevillenc.gov',
//         questions: [],
//         responses: [],
//       },
//       {
//         id: 152,
//         status: 'Closed',
//         supervisor_id: 123,
//         employee_id: 6507,
//         position: 'Most Awesomest Tech Guru Ever',
//         periodStart: '4/06/2017',
//         periodEnd: '7/07/2017',
//         reviewer_name: 'Scott Barnwell',
//         employee_name: 'sbarnwell@ashevillenc.gov',
//         questions: [],
//         responses: [],
//       }
//     ],
//   },
// ];

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
          <h1>Conversations with {props.data.employee.name}</h1>
          <span style={{ fontSize: '25px', marginTop: '10px' }} className="pull-right">Current Supervisor: {props.data.employee.supervisor_name || '--'}</span>
        </div>
      </div>
      <ReviewsTable reviews={getCurrentReview(props.data.employee.reviews)} current/>
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
      supervisor_name
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
