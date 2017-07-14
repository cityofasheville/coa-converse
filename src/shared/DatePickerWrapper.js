import React from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';

class DatePickerWrapper extends React.Component {
  constructor (props) {
    super(props);
    let start = moment(new Date(), 'M/DD/YYYY');
    if (props.startDate) {
      start = moment(props.startDate, 'M/DD/YYYY');
    }
    this.state = {
      startDate: moment(start)
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(date) {
    this.setState({
      startDate: date
    });
    if (this.props.onChange !== undefined) {
      this.props.onChange(date);
    }
  }

  render() {
    return <DatePicker
        selected={this.state.startDate}
        onChange={this.handleChange}
        id={this.props.id}
        name={this.props.id}
    />;
  }
}

export default DatePickerWrapper;
