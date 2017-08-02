import React from 'react';
import PropTypes from 'prop-types';
import { Link, browserHistory } from 'react-router';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { Radio, RadioGroup } from 'react-radio-group';
import moment from 'moment';
import DatePickerWrapper from '../shared/DatePickerWrapper';
import Question from './Question';
import Response from './Response';
import PrintableReview from './PrintableReview';

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

const validate = (state, onSubmit) => {
  const invalidQuestions = [];
  const invalidResponses = [];

  if (onSubmit) {
    if (state.answersEditable) {
      for (let question of state.questions) {
        if (!question.answer || question.answer === '') { // && question.required) {
          invalidQuestions.push(question.id);
        }
      }
    }

    if (state.responsesEditable) {
      for (let response of state.responses) {
        if (!response.Response || response.Response === '') {
          invalidResponses.push(response.question_id);
        }
      }
    }
  }

  return {
    startDate: state.periodStart == null,
    endDate: state.periodEnd == null,
    questions: onSubmit ? invalidQuestions : state.questions,
    responses: onSubmit ? invalidResponses : state.responses,
  };
}

class Review extends React.Component {
  constructor(props) {
    super(props);
    const initialErrors = validate( { periodStart: this.props.review.periodStart, periodEnd: this.props.review.periodEnd, questions: [], responses: []});
    let role = this.props.review.employee_id === this.props.userId ? 'Employee' : 'Supervisor';
    this.state = {
      periodStart: this.props.review.periodStart,
      periodEnd: this.props.review.periodEnd,
      questions: this.props.review.questions,
      responses: this.props.review.responses,
      role: this.props.review.employee_id === this.props.userId ? 'Employee' : (this.props.userId === this.props.review.supervisor_id ? 'Supervisor' : 'Viewer'),
      answersEditable: this.props.review.status === 'Open' && role === 'Supervisor' ? true : false,
      responsesEditable: this.props.review.status === 'Ready' && role === 'Employee' ? true : false,
      actionRadio: 'saveonly', //todo set appropriate action value based on other vars,
      validationErrors: initialErrors,
      formError: initialErrors.startDate || initialErrors.endDate || initialErrors.questions.length > 0 || initialErrors.responses.length > 0,
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.handleEndDateChange = this.handleEndDateChange.bind(this);
    this.handleTextEditorChange = this.handleTextEditorChange.bind(this);
  }

  handleSubmit(event) {
    if (this.state.actionRadio !== 'saveonly' && this.hasErrors()) {
      return;
    }
    const newStatus = this.state.actionRadio === 'saveonly' ? this.props.review.status : this.state.actionRadio;
    this.props.submit({
      id: this.props.review.id,
      reviewInput: {
        status: newStatus,
        periodStart: this.state.periodStart,
        periodEnd: this.state.periodEnd,
        questions: this.state.questions.map(question => ({
          answer: question.answer,
          id: question.id,
        })),
        responses: this.state.responses.map(response => ({
          question_id: response.question_id,
          Response: response.Response,
        })),
      }
    })
  }

  handleStartDateChange(value) {
    this.setState({ periodStart: value !== null ? value.format('M/DD/YYYY') : value});
  }

  handleEndDateChange(value) {
    this.setState({ periodEnd: value != null ? value.format('M/DD/YYYY') : value });
  }

  handleTextEditorChange(event) {
    const splitId = event.target.id.split('-'); 
    const questionOrResponse = splitId[0];
    const id = splitId[1] === '' ? null : splitId[1];
    if (questionOrResponse === 'response') {
      const newResponses = [];
      for (let i = 0; i < this.state.responses.length; i += 1) {
        if (id == this.state.responses[i].question_id) {
          newResponses.push(Object.assign({}, this.state.responses[i], {Response: event.target.getContent()}));
        } else {
          newResponses.push(Object.assign({}, this.state.responses[i]));
        }
      }
      this.setState({responses: newResponses});
    } else {
      const newQuestions = [];
      for (let i = 0; i < this.state.questions.length; i += 1) {
        if (id == this.state.questions[i].id) {
          newQuestions.push(Object.assign({}, this.state.questions[i], {answer: event.target.getContent()}));
        } else {
          newQuestions.push(Object.assign({}, this.state.questions[i]));
        }
      }
      this.setState({questions: newQuestions});
    }
  }

  handleRadioQuestionChange(value, questionId) {
    const newQuestions = [];
    for (let i = 0; i < this.state.questions.length; i += 1) {
      if (questionId == this.state.questions[i].id) {
        newQuestions.push(Object.assign({}, this.state.questions[i], {answer: value}));
      } else {
        newQuestions.push(Object.assign({}, this.state.questions[i]));
      }
    }
    this.setState({questions: newQuestions});
  }

  hasErrors() {
    const validationErrors = validate(this.state, true);
    this.setState({validationErrors: validationErrors})
    const invalid = validationErrors.startDate || validationErrors.endDate || validationErrors.questions.length > 0 || validationErrors.responses.length > 0;
    this.setState({formError: invalid});
    return invalid;
  }

  render() {
    const dateErrors = validate(this.state);

    return (
      <div>
        {this.props.location.query.printable === 'yes' && 
          <PrintableReview review={this.props.review} />
        }
        {this.props.location.query.printable !== 'yes' &&
          <form>
            <div className="row form-horizontal">
              <h1>Conversation between {this.props.review.employee_name} and supervisor {this.props.review.reviewer_name}</h1>
              <Link className="pull-right" style={{ fontSize: '20px' }} to={{ pathname: 'conversation', query: {emp: this.props.review.employee_id, rev: this.props.review.id, printable: 'yes'}} }>Printable Version</Link>
              <div className="col-sm-12">
                <div className="form-group">
                  <fieldset className="reviewQuestionFieldset">
                    <legend>Period</legend>
                    <div className="col-sm-6 col-xs-12" style={{ marginBottom: '10px' }}>
                      <label htmlFor="startDate" className="col-xs-2" style={{ textAlign: 'right'}}>From: </label>
                      <div className={dateErrors.startDate ? "col-xs-4 invalid" : "col-xs-4"}>
                        {this.state.answersEditable &&
                          <DatePickerWrapper startDate={new Date(this.state.periodStart)} id="startDate" onChange={(value) => this.handleStartDateChange(value)} />
                        }
                        {this.state.answersEditable && dateErrors.startDate &&
                          <span style={{ color: 'red', fontWeight: 'bold'}}>&apos;From&apos; date is required</span>
                        }                        
                        {!this.state.answersEditable && 
                          <span>{moment(new Date(this.state.periodStart)).format('M/DD/YYYY')}</span>
                        }
                      </div>
                    </div>
                    <div className={dateErrors.endDate ? "col-sm-6 col-xs-12 invalid" : "col-sm-6 col-xs-12"}>
                      <label htmlFor="endDate" className="col-xs-2" style={{ textAlign: 'right'}}>To: </label>
                      <div className="col-xs-4">
                        {this.state.answersEditable &&
                          <DatePickerWrapper endDate={new Date(this.props.review.periodEnd)} id="endDate" onChange={(value) => this.handleEndDateChange(value)} />
                        }
                        {this.state.answersEditable && dateErrors.endDate &&
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
                      <Question question={question} required={true} requiredText={this.state.role === "Supervisor" ? "This question must be answered before submitting for employee acknowledgement" : ""} invalid={this.state.validationErrors.questions.includes(question.id)} editable={this.state.answersEditable} onBlur={question.type === 'Text' ? ((event) => (this.handleTextEditorChange(event))) : ((value) => (this.handleRadioQuestionChange(value, question.id)))}/>
                      {getResponse(question.id, this.state.responses) !== null &&
                        <Response response={getResponse(question.id, this.state.responses)} invalid={this.state.validationErrors.responses.includes(question.id)} requiredText="This response must be completed before acknowledgement or request for further discussion." required={this.state.responsesEditable} editable={this.state.responsesEditable} onChange={(event) => (this.handleTextEditorChange(event))} />
                      }
                    </div>
                  ))}
                </div>
                <div className="form-group">
                  <Response response={getMainReviewResponse(this.state.responses)} invalid={this.state.validationErrors.responses.includes(null)} requiredText="This response must be completed before acknowledgement or request for further discussion." required={this.state.responsesEditable} standalone editable={this.state.responsesEditable} onChange={(event) => (this.handleTextEditorChange(event))} />
                </div>
                {this.props.review.status !== 'Closed' &&
                  <div className="form-group">
                    <fieldset className="reviewQuestionFieldset">
                      <legend>Action</legend>
                      {this.state.role === 'Supervisor' && this.props.review.status === 'Open' &&
                        <div>
                          <p><i>Please discuss your feedback with your employee before submission for their acknowledgement.</i></p>
                          <RadioGroup
                            name="workflow"
                            selectedValue={this.state.actionRadio}
                            onChange={(val) => (this.setState({actionRadio: val}))}
                            >
                              <label>
                                <Radio value="saveonly" />Save only
                              </label>
                              <label>
                                <Radio value="Ready" />Submit for employee acknowledgement
                              </label>
                          </RadioGroup>
                          <input type="button" className="btn btn-primary" value="Save" onClick={this.handleSubmit}/>
                          <span hidden={!this.state.formError} style={{ color: 'red', marginLeft: '5px'}}>Required fields are missing. You must complete all required fields before you can submit this conversation for employee acknowledgement.</span>
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
                                <Radio value="Open" />Re-open
                              </label>                          
                              <label>
                                <Radio value="Closed" />Submit to HR record
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
                                <Radio value="Acknowledged" />Acknowledge
                              </label>
                              <label>
                                <Radio value="Open" />Further discussion requested
                              </label>                          
                          </RadioGroup>
                          <input type="button" className="btn btn-primary" value="Save" onClick={this.handleSubmit}/>
                          <span hidden={!this.state.formError} style={{ color: 'red', marginLeft: '5px'}}>Required fields are missing. You must complete all required fields before you can submit your response to your supervisor.</span>
                        </div>
                      }
                      {this.state.role === 'Employee' && this.props.review.status === 'Open' &&
                        <div className="alert alert-info">
                          Your supervisor has not yet released their feedback for your response.
                        </div>
                      }     
                      {this.state.role === 'Employee' && this.props.review.status === 'Acknowledged' &&
                        <div className="alert alert-info">
                          You have acknowledged this conversation. When your supervisor closes the conversation, it will appear in your HR record.
                        </div>
                      }                                           
                    </fieldset>
                  </div>
                }
              </div>
            </div>
          </form>
        }
        {this.state.role === 'Supervisor' &&
          <div>
            <Link style={{ fontSize: '20px' }} to={{ pathname: '/conversations', query: { emp: this.props.review.employee_id }}}>Back to {this.props.review.employee_name}&apos;s conversations<br /></Link>        
            <Link style={{ fontSize: '20px' }} to={{ pathname: '/', query: { mode: 'employees' }}}>Back to all my employee conversations</Link>
          </div>
        }
        {this.state.role === 'Employee' &&
          <Link style={{ fontSize: '20px' }} to={{ pathname: '/' }}>Back to my conversations</Link>
        }
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

const submitReview = gql`
  mutation updateReview($id: Int, $reviewInput: ReviewInput!) {
    updateReview (id: $id, review: $reviewInput) {
      id
      status
      status_date
      supervisor_id
      employee_id
      position
      periodStart
      periodEnd
      reviewer_name
      employee_name
      questions {
        id
        type
        question
        answer
        required
      }
      responses {
        question_id
        Response
      }
    }
  }
`;

export default graphql(submitReview, {
  props: ({ mutate }) => ({
    submit: (reviewData) => mutate({ variables: { id: reviewData.id, reviewInput: reviewData.reviewInput }}).then(({ data }) => {
        browserHistory.push(['/conversations?emp', data.updateReview.employee_id].join('='));
      }).catch((error) => {
        console.log('there was an error sending the query', error);
      }),
  })
})(Review);