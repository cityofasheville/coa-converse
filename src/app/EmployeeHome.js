import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import queryString from 'query-string';
import { browserHistory } from 'react-router';
import { RadioGroup, Radio } from 'react-radio-group';
import Reviews from './Reviews';
import Employees from './Employees';
import LoadingAnimation from '../shared/LoadingAnimation';
import Error from '../shared/Error';

const GET_EMPLOYEE = gql`
  query employee($id: Int) {
    employee (id: $id) {
      id
      name
      employees {
        id
      }
    }
  }
`;

const EmployeeHome = props => (
  <Query
    query={GET_EMPLOYEE}
    variables={{
      id: queryString.parse(location.search).emp,
    }}
    fetchPolicy="network-only"
  >
    {({ loading, error, data }) => {
      if (loading) return <LoadingAnimation />;
      if (error) return <Error message={error.message} />;
      const queryParams = queryString.parse(location.search);

      const isSupervisor = () => (
        data.employee !== undefined && data.employee.employees.length > 0
      );

      const refreshLocation = (value) => {
        let paramsString = ['?mode=', value].join('');
        if (queryParams.emp) {
          paramsString = [paramsString, '&emp=', queryParmas.emp].join('');
        }
        browserHistory.push([props.location.pathname, paramsString].join(''));
      };

      const displayContents = () => {
        if (isSupervisor()) {
          if (queryParams.mode) {
            if (queryParams.mode === 'employees') {
              return <Employees {...props} userId={data.employee.id} />;
            }
            return <Reviews {...props} />;
          }
          if (queryParams.emp) {
            return <Reviews {...props} />;
          }
          return <Employees {...props} userId={data.employee.id} />;
        }
        return <Reviews {...props} />;
      };

      return (
        <div className="row">
          <div className="col-sm-12">
            {isSupervisor(props.user) &&
              <RadioGroup name="modeRadio" selectedValue={queryParams.mode || (queryParams.emp ? 'check-ins' : 'employees')} onChange={refreshLocation}>
                <label>
                  <Radio value="employees" />{queryParams.emp ? [data.employee.name, '\'s'].join('') : 'My'} employees
                </label>
                <label>
                  <Radio value="check-ins" />{queryParams.emp ?  [data.employee.name, '\'s'].join('') : 'My'} check-ins
                </label>
              </RadioGroup>
            }
            {displayContents()}
          </div>
        </div>
      );
    }}
  </Query>
);

export default EmployeeHome;
