import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { connect } from 'react-redux';
import EmployeesTable from './EmployeesTable';
import LoadingAnimation from '../shared/LoadingAnimation';

const Employees = props => {
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
          <h1>Employees</h1>
        </div>
      </div>
      <EmployeesTable {...props}/>
    </div>
  );
}

const getEmployeesQuery = gql`
  query getEmployeesQuery($id: Int) {
    employee (id: $id) {
      employees {
        id
        active
        name
        current_review
        reviewable
        review_by
        last_reviewed
      }
    }
  }
`;
const EmployeesGQL = graphql(getEmployeesQuery, {
  options: (ownProps)=> ({
    variables: {
      id: ownProps.userId //for testing
    }
  })
})(Employees);

export default EmployeesGQL;
