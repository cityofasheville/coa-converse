import React from 'react';
import { RadioGroup, Radio } from 'react-radio-group';
import PropTypes from 'prop-types';
import RichTextEditor from '../shared/RichTextEditor';

const markup = (stringValue) => {
  return { __html: stringValue };
}

class Response extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange(newResponse) {
    if (this.props.onChange !== undefined) {
      this.props.onChange(newResponse);
    }
  }

  render() {
    if (this.props.response === null) return null;
    if (this.props.standalone) {
      return (
        <fieldset className="reviewQuestionFieldset">
          <legend>Employee Comments</legend>
          <RichTextEditor
            id={['response', this.props.response.question_id].join('-')}
            content={this.props.response.Response}
            editable={this.props.editable}
            invalid={this.props.invalid}
            onChange={this.props.onChange}
          />
          {this.props.required && this.props.requiredText.length !== 0 &&
            <div style={{ fontStyle: 'italic', marginTop: '5px' }}>
              <span style={this.props.invalid ? {color: 'red'} : {}}>{this.props.requiredText}</span>
            </div>
          }
        </fieldset>
      );
    } else {
      return (
        <div style={{ marginBottom: '25px' }}>
          <h3>Employee</h3>
          <RichTextEditor
            id={['response', this.props.response.question_id].join('-')}
            content={this.props.response.Response}
            editable={this.props.editable}
            invalid={this.props.invalid}
            onChange={this.props.onChange}
          />
          {this.props.required && this.props.requiredText.length !== 0 &&
            <div style={{ fontStyle: 'italic', marginTop: '5px' }}>
              <span style={this.props.invalid ? {color: 'red'} : {}}>{this.props.requiredText}</span>
            </div>
          }
        </div>
      );
    }
  }
};

const responseShape = {
  question_id: PropTypes.number,
  review_id: PropTypes.number,
  Response: PropTypes.string,
};

Response.propTypes = {
  response: PropTypes.shape(responseShape),
  editable: PropTypes.bool,
  required: PropTypes.bool,
  requiredText: PropTypes.string,
  onChange: PropTypes.func,
  invalid: PropTypes.bool,
};

Response.defaultProps = {
  editable: false,
  required: true,
  requiredText: "",
  standalone: false,
  invalid: false,
};

export default Response;
