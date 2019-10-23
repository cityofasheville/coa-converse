import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
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
      id: props.location.query.emp,
    }}
  >
    {({ loading, error, data }) => {
      if (loading) return <LoadingAnimation />;
      if (error) return <Error message={error.message} />;

      const isSupervisor = () => (
        data.employee.employees.length > 0
      );

      const refreshLocation = (value) => {
        let paramsString = ['?mode=', value].join('');
        if (props.location.query.emp) {
          paramsString = [paramsString, '&emp=', props.location.query.emp].join('');
        }
        browserHistory.push([props.location.pathname, paramsString].join(''));
      };

      const displayContents = () => {
        if (isSupervisor()) {
          if (props.location.query.mode) {
            if (props.location.query.mode === 'employees') {
              return <Employees {...props} userId={data.employee.id} />;
            }
            return <Reviews {...props} />;
          }
          if (props.location.query.emp) {
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
              <RadioGroup name="modeRadio" selectedValue={props.location.query.mode || (props.location.query.emp ? 'check-ins' : 'employees')} onChange={refreshLocation}>
                <label>
                  <Radio value="employees" />{props.location.query.emp ? [data.employee.name, '\'s'].join('') : 'My'} employees
                </label>
                <label>
                  <Radio value="check-ins" />{props.location.query.emp ?  [data.employee.name, '\'s'].join('') : 'My'} check-ins
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
