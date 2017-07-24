import React from 'react';
import { RadioGroup, Radio } from 'react-radio-group';
import PropTypes from 'prop-types';
import Response from './Response';
import RichTextEditor from '../shared/RichTextEditor';

const markup = (stringValue) => {
  return { __html: stringValue };
}

class Question extends React.Component {
  constructor(props) {
    super(props);
    this.state = { answer: props.question.answer };
    this.updateYNAnswer = this.updateYNAnswer.bind(this);
  }

  updateYNAnswer(newAnswer) {
    this.setState({
      answer: newAnswer,
    });
    if (this.props.onBlur !== undefined) {
      this.props.onBlur(newAnswer);
    }
  }

  render() {
    return (
      <fieldset className="reviewQuestionFieldset">
        <div dangerouslySetInnerHTML={markup(this.props.question.question)} />
        {this.props.question.type === 'Text' &&
          <RichTextEditor
            id={['qanswer', this.props.question.id].join('-')}
            content={this.props.question.answer}
            editable={this.props.editable}
            invalid={this.props.invalid}
            onChange={this.props.onBlur}
          />
        }
        {this.props.question.type === 'Y/N' &&
          <div style={this.props.invalid ? { backgroundColor: '#ffe2e2'} : {}}>
            <div style={{ display: 'inline-block' }}>
  `           <RadioGroup
                name={['ynanswer', this.props.question.id].join('-')}
                selectedValue={this.state.answer}
                onChange={this.updateYNAnswer}
                disabled={!this.props.editable}
                >
                  <label>
                    <Radio value="1" disabled={!this.props.editable} />Yes
                  </label>
                  <label>
                    <Radio value="0" disabled={!this.props.editable} />No
                  </label>
              </RadioGroup>
            </div>
            <span style={{ marginLeft: '10px' }}>
              {this.props.editable &&
                <a onClick={() => this.updateYNAnswer('')}>Clear</a>
              }
            </span>
          </div>
        }
        {this.props.required && this.props.requiredText.length !== 0 &&
          <div style={{ fontStyle: 'italic', marginTop: '5px' }}>
            <span style={this.props.invalid ? {color: 'red'} : {}}>{this.props.requiredText}</span>
          </div>
        }
      </fieldset>
    );
  }
};

const questionShape = {
  id: PropTypes.number,
  type: PropTypes.string,
  question: PropTypes.string,
  answer: PropTypes.string,
  required: PropTypes.bool,
};

Question.propTypes = {
  invalid: PropTypes.bool,
  question: PropTypes.shape(questionShape),
  editable: PropTypes.bool,
  requiredText: PropTypes.string,
  onChange: PropTypes.func,
};

Question.defaultProps = {
  editable: true,
  required: true,
  requiredText: "",
  invalid: false,
};

export default Question;