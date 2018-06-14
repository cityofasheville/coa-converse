import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import EmployeesTable from './EmployeesTable';
import LoadingAnimation from '../shared/LoadingAnimation';
import Error from '../shared/Error';

const GET_EMPLOYEES = gql`
  query employee($id: Int) {
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

const Employees = props => (
  <Query
    query={GET_EMPLOYEES}
    variables={{
      id: props.userId,
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
              <h1>Employees</h1>
            </div>
          </div>
          <EmployeesTable data={data} />
        </div>
      );
    }}
  </Query>
);

export default Employees;
