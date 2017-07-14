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
    if (this.props.onChange !== undefined) {
      this.props.onChange(newAnswer);
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
            onChange={this.props.onChange}
          />
        }
        {this.props.question.type === 'Y/N' &&
          <div>
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
  question: PropTypes.shape(questionShape),
  editable: PropTypes.bool,
  onChange: PropTypes.func,
};

Question.defaultProps = {
  editable: true,
};

export default Question;