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
    if (this.props.standalone) {
      return (
        <fieldset className="reviewQuestionFieldset">
          <legend>Employee Comments</legend>
          <RichTextEditor
            id={['response', this.props.response.question_id].join('-')}
            content={this.props.response.Response}
            editable={this.props.editable}
            onChange={this.props.onChange}
          />
        </fieldset>
      );
    } else {
      return (
        <div style={{ marginBottom: '25px' }}>
          <h3>Employee Response</h3>
          <RichTextEditor
            id={['response', this.props.response.question_id].join('-')}
            content={this.props.response.Response}
            editable={this.props.editable}
            onChange={this.props.onChange}
          />
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
  onChange: PropTypes.func,
};

Response.defaultProps = {
  editable: false,
  standalone: false,
};

export default Response;