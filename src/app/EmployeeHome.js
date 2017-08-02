import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { browserHistory } from 'react-router';
import { RadioGroup, Radio } from 'react-radio-group';
import Reviews from './Reviews';
import Employees from './Employees';
import LoadingAnimation from '../shared/LoadingAnimation';

const EmployeeHome = (props) => {
  if (props.data.loading) { // eslint-disable-line react/prop-types
    return <LoadingAnimation />;
  }
  if (props.data.error) { // eslint-disable-line react/prop-types
    return <p>{props.data.error.message}</p>; // eslint-disable-line react/prop-types
  }

  const isSupervisor = () => {
    return props.data.employee.employees.length > 0;
  }

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
          return <Employees {...props} userId={props.data.employee.id} />
        }
        return <Reviews {...props} />
      }
      if (props.location.query.emp) {
        return <Reviews {...props} />
      }
      return <Employees {...props} userId={props.data.employee.id} />
    }
    return <Reviews {...props} />
  }

  return (
    <div className="row">
      <div className="col-sm-12">
        {isSupervisor(props.user) && 
          <RadioGroup name="modeRadio" selectedValue={props.location.query.mode || (props.location.query.emp ? 'conversations' : 'employees')} onChange={refreshLocation}>
            <label>
              <Radio value="employees" />{props.location.query.emp ? [props.data.employee.name, '\'s'].join('') : 'My'} employees
            </label>
            <label>
              <Radio value="conversations" />{props.location.query.emp ?  [props.data.employee.name, '\'s'].join('') : 'My'} conversations
            </label>
          </RadioGroup>
        }
        {displayContents()}
      </div>
    </div>
  );
};

const getEmployeeQuery = gql`
  query getEmployeeQuery($id: Int) {
    employee (id: $id) {
      id
      name
      employees {
        id
      }
    }
  }
`;

export default graphql(getEmployeeQuery, {
  options: (ownProps) => ({
    variables: {
      id: ownProps.location.query.emp,
    }
  })
})(EmployeeHome);