import React from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';

class DatePickerWrapper extends React.Component {
  constructor (props) {
    super(props);
    let selected = moment(new Date(), 'M/DD/YYYY');
    if (props.selected) {
      selected = moment(props.selected, 'M/DD/YYYY');
    }
    this.state = {
      selected: moment(selected)
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(date) {
    this.setState({
      selected: date
    });
    if (this.props.onChange !== undefined) {
      this.props.onChange(date);
    }
  }

  render() {
    return <DatePicker
        selected={this.state.selected}
        onChange={this.handleChange}
        id={this.props.id}
        name={this.props.id}
    />;
  }
}

export default DatePickerWrapper;
