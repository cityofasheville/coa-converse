import React from 'react';
import { RadioGroup, Radio } from 'react-radio-group';
import PropTypes from 'prop-types';
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
  }

  render() {
    return (
      <fieldset className="reviewQuestionFieldset">
        <div dangerouslySetInnerHTML={markup(this.props.question.question)} />
        {this.props.question.type === 'Text' &&
          <RichTextEditor
            id={['qanswer', this.props.question.id].join('-')}
            content={this.props.question.answer}
            answereditable={this.props.editable}
          />
        }
        {this.props.question.type === 'Y/N' &&
          <div>
            <div style={{ display: 'inline-block' }}>
  `           <RadioGroup
                name={['ynanswer', this.props.question.question_id].join('-')}
                selectedValue={this.state.answer}
                onChange={this.updateYNAnswer}
                >
                  <label>
                    <Radio value="1" />Yes
                  </label>
                  <label>
                    <Radio value="0" />No
                  </label>
              </RadioGroup>
            </div>
            <span style={{ marginLeft: '10px' }}><a onClick={() => this.updateYNAnswer('')}>Clear</a></span>
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

const responseShape = {
  question_id: PropTypes.number,
  review_id: PropTypes.number,
  Response: PropTypes.string,
};

Question.propTypes = {
  question: PropTypes.shape(questionShape),
  editable: PropTypes.bool,
};

Question.defaultProps = {
  editable: true,
};

export default Question;