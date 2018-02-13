import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import EmployeesTable from './EmployeesTable';
import LoadingAnimation from '../shared/LoadingAnimation';
import Error from '../shared/Error';

const Employees = (props) => {
  if (props.data.loading) { // eslint-disable-line react/prop-types
    return <LoadingAnimation />;
  }
  if (props.data.error) { // eslint-disable-line react/prop-types
    return <Error message={props.data.error.message} />; // eslint-disable-line react/prop-types
  }

  return (
    <div>
      <div className="row">
        <div className="col-sm-12">
          <h1>Employees</h1>
        </div>
      </div>
      <EmployeesTable {...props} />
    </div>
  );
};

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
  options: ownProps => ({
    variables: {
      id: ownProps.userId,
    },
  }),
})(Employees);

export default EmployeesGQL;
