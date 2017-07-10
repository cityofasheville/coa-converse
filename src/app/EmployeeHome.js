import React from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { RadioGroup, Radio } from 'react-radio-group';
import Reviews from './Reviews';
import Employees from './Employees';

const EmployeeHome = (props) => {
  const isSupervisor = (user) => {
    // depending on if supervisor or not, start on My Employees page or My Conversations
    // should just be an attribute of user but this function is for testing
    return true;
  }

  const refreshLocation = (value) => {
    browserHistory.push([props.location.pathname, '?mode=', value].join(''));
  };

  const displayContents = () => {
    if (isSupervisor(props.user)) {
      if (props.location.query.mode == 'conversations') {
        return <Reviews />
      }
      return <Employees />
    }
    return <Reviews />
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

const mapStateToProps = state => (
  {
    user: state.auth.user,
  }
);

export default connect(mapStateToProps)(EmployeeHome);
