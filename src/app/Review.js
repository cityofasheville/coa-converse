import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { Radio, RadioGroup } from 'react-radio-group';
import moment from 'moment';
import DatePickerWrapper from '../shared/DatePickerWrapper';
import Question from './Question';
import Response from './Response';

const getResponse = (questionId, responses) => {
  //assumes 1:1 relationship between a question and a response
  for (let response of responses) {
    if (questionId === response.question_id) {
      return response;
    }
  }
  return null;
}

const getMainReviewResponse = (responses) => {
  for (let response of responses) {
    if (response.question_id === null) {
      return response;
    }
  }
  return null;
}

const validate = (startDate, endDate) => {
  return {
    startDate: startDate == null,
    endDate: endDate == null,
  };
}

class Review extends React.Component {
  constructor(props) {
    super(props);
    //figure out if the answers are editable, etc
    let role = 'Employee'; //todo set properly according to if employee_id matches the logged in user's or not
    this.state = {
      periodStart: this.props.review.periodStart,
      periodEnd: this.props.review.periodEnd,
      questions: this.props.review.questions,
      responses: this.props.review.responses,
      role: this.props.review.employee_id === this.props.userId ? 'Employee' : 'Supervisor',
      answersEditable: this.props.review.status === 'Open' && role === 'Supervisor' ? true : false,
      responsesEditable: this.props.review.status === 'Ready' && role === 'Employee' ? true : false,
      actionRadio: 'saveonly', //todo set appropriate action value based on other vars
    }
    console.log(this.props, this.state);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    if (this.hasErrors()) {
      event.preventDefault();
      console.log('errors on form!');
      return;
    }
    console.log('you are submitting');
  }

  handleStartDateChange(value) {
    this.setState({ periodStart: value !== null ? value.format('M/DD/YYYY') : value});
  }

  handleEndDateChange(value) {
    this.setState({ periodEnd: value != null ? value.format('M/DD/YYYY') : value });
  }

  hasErrors() {
    const validationErrors = validate(this.state.periodStart, this.state.periodEnd);
    const invalid = Object.keys(validationErrors).some(x => validationErrors[x]);
    return invalid;
  }
  
  render() {
    const validationErrors = validate(this.state.periodStart, this.state.periodEnd);

    return (
      <div>
        <form>
          <div className="row form-horizontal">
            <h1>Conversation between {this.props.review.employee_name} and supervisor {this.props.review.reviewer_name}</h1>
            <Link className="pull-right" style={{ fontSize: '20px' }} to={{ pathname: 'printableConversation', query: {emp: this.props.review.employee_id, rev: this.props.review.id}} }>Printable Version</Link>
            <div className="col-sm-12">
              <div className="form-group">
                <fieldset className="reviewQuestionFieldset">
                  <legend>Period</legend>
                  <div className="col-sm-6 col-xs-12" style={{ marginBottom: '10px' }}>
                    <label htmlFor="startDate" className="col-xs-2" style={{ textAlign: 'right'}}>From: </label>
                    <div className={validationErrors.startDate ? "col-xs-4 invalid" : "col-xs-4"}>
                      {this.state.answersEditable &&
                        <DatePickerWrapper startDate={new Date(this.state.periodStart)} id="startDate" onChange={(value) => this.handleStartDateChange(value)} />
                      }
                      {this.state.answersEditable && validationErrors.startDate &&
                        <span style={{ color: 'red', fontWeight: 'bold'}}>&apos;From&apos; date is required</span>
                      }                        
                      {!this.state.answersEditable && 
                        <span>{moment(new Date(this.state.periodStart)).format('M/DD/YYYY')}</span>
                      }
                    </div>
                  </div>
                  <div className={validationErrors.endDate ? "col-sm-6 col-xs-12 invalid" : "col-sm-6 col-xs-12"}>
                    <label htmlFor="endDate" className="col-xs-2" style={{ textAlign: 'right'}}>To: </label>
                    <div className="col-xs-4">
                      {this.state.answersEditable &&
                        <DatePickerWrapper endDate={new Date(this.props.review.periodEnd)} id="endDate" onChange={(value) => this.handleEndDateChange(value)} />
                      }
                      {this.state.answersEditable && validationErrors.endDate &&
                        <span style={{ color: 'red', fontWeight: 'bold'}}>&apos;To&apos; date is required</span>
                      }
                      {!this.state.answersEditable && 
                        <span>{moment(new Date(this.state.periodEnd)).format('M/DD/YYYY')}</span>
                      }
                    </div>
                  </div>
                </fieldset>
              </div>
              <div className="form-group">
                {this.props.review.questions.map((question, index) => (
                  <div key={['question', index].join('_')}>
                    <Question question={question} editable={this.state.answersEditable} onChange={question.type === 'Text' ? ((value) => (console.log(value.level.content))) : ((value) => (console.log(value)))}/>
                    {getResponse(question.id, this.props.review.responses) !== null &&
                      <Response response={getResponse(question.id, this.props.review.responses)} editable={this.state.responsesEditable} onChange={(value) => (console.log(value.level.content))} />
                    }
                  </div>
                ))}
              </div>
              <div className="form-group">
                <Response response={getMainReviewResponse(this.props.review.responses)} standalone editable={this.state.responsesEditable} onChange={(value) => (console.log(value.level.content))} />
              </div>
              {this.props.review.status !== 'Closed' &&
                <div className="form-group">
                  <fieldset className="reviewQuestionFieldset">
                    <legend>Action</legend>
                    {this.state.role === 'Supervisor' && this.props.review.status === 'Open' &&
                      <div>
                        <p><i>Please discuss your answers with your employee before submittion for their acknowledgement.</i></p>
                        <RadioGroup
                          name="workflow"
                          selectedValue={this.state.actionRadio}
                          onChange={(val) => (this.setState({actionRadio: val}))}
                          >
                            <label>
                              <Radio value="saveonly" />Save only
                            </label>
                            <label>
                              <Radio value="sendack" />Submit for employee acknowledgement
                            </label>
                        </RadioGroup>
                        <input type="button" className="btn btn-primary" value="Save" onClick={this.handleSubmit}/>
                      </div>
                    }
                    {this.state.role === 'Supervisor' && this.props.review.status === 'Acknowledged' &&
                      <div>
                        <RadioGroup
                          name="workflow"
                          selectedValue={this.state.actionRadio}
                          onChange={(val) => (this.setState({actionRadio: val}))}
                          >
                            <label>
                              <Radio value="saveonly" />Save only
                            </label>
                            <label>
                              <Radio value="reopen" />Re-open
                            </label>                          
                            <label>
                              <Radio value="close" />Submit to HR record
                            </label>
                        </RadioGroup>
                        <input type="button" className="btn btn-primary" value="Save" onClick={this.handleSubmit}/>
                      </div>
                    }
                    {this.state.role === 'Supervisor' && this.props.review.status === 'Ready' &&
                      <div className="alert alert-info">
                        You must wait for your employee to respond before further actions can be taken.
                      </div>
                    }            
                    {this.state.role === 'Employee' && this.props.review.status === 'Ready' &&
                      <div>
                        <p><i>By acknowledging, you affirm that you have read your supervisor's feedback and discussed it with your supervisor.</i></p>
                        <RadioGroup
                          name="workflow"
                          selectedValue={this.state.actionRadio}
                          onChange={(val) => (this.setState({actionRadio: val}))}
                          >
                            <label>
                              <Radio value="saveonly" />Save only
                            </label>
                            <label>
                              <Radio value="acknowledge" />Acknowledge
                            </label>
                            <label>
                              <Radio value="return" />Further discussion requested
                            </label>                          
                        </RadioGroup>
                        <input type="button" className="btn btn-primary" value="Save" onClick={this.handleSubmit}/>
                      </div>
                    }
                    {this.state.role === 'Employee' && this.props.review.status === 'Open' &&
                      <div className="alert alert-info">
                        Your supervisor has not yet released their feedback for your response.
                      </div>
                    }                        
                  </fieldset>
                </div>
              }
            </div>
          </div>
        </form>
      </div>
    );
  }
}

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

const reviewShape = {
  id: PropTypes.number,
  status: PropTypes.string,
  status_date: PropTypes.string,
  supervisor_id: PropTypes.number,
  employee_id: PropTypes.number,
  position: PropTypes.string,
  periodStart: PropTypes.string,
  periodEnd: PropTypes.string,
  reviewer_name: PropTypes.string,
  employee_name: PropTypes.string,
  questions: PropTypes.arrayOf(PropTypes.shape(questionShape)),
  responses: PropTypes.arrayOf(PropTypes.shape(responseShape)),
};

Review.propTypes = {
  review: PropTypes.shape(reviewShape), // eslint-disable-line
};

export default Review;

// const mapStateToProps = state => (
//   {
//     userId: state.employee.employeeId,
//   }
// );

// export default connect(mapStateToProps)(Review);