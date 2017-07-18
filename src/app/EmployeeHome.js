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
    browserHistory.push([props.location.pathname, '?mode=', value].join(''));
  };

  const displayContents = () => {
    if (isSupervisor()) {
      if (props.location.query.mode == 'conversations') {
        return <Reviews {...props} />
      }
      return <Employees {...props} />
    }
    return <Reviews {...props} />
  }

  return (
    <div className="row">
      <div className="col-sm-12">
        {isSupervisor(props.user) && 
          <RadioGroup name="modeRadio" selectedValue={props.location.query.mode || 'employees'} onChange={refreshLocation}>
            <label>
              <Radio value="employees" />My employees
            </label>
            <label>
              <Radio value="conversations" />My conversations
            </label>
          </RadioGroup>
        }
        {displayContents()}
      </div>
    </div>
  );
};

const getEmployeeQuery = gql`
  query getEmployeeQuery {
    employee {
      id
      employees {
        id
      }
    }
  }
`;

export default graphql(getEmployeeQuery, {})(EmployeeHome);