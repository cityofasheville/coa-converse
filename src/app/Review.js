import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import Collapsible from 'react-collapsible';
import { Link, browserHistory } from 'react-router';
import { graphql, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { Radio, RadioGroup } from 'react-radio-group';
import moment from 'moment';
import DatePickerWrapper from '../shared/DatePickerWrapper';
import Question from './Question';
import Response from './Response';
import PrintableReview from './PrintableReview';

const getResponse = (questionId, responses) => {
  // assumes 1:1 relationship between a question and a response
  for (let response of responses) {
    if (questionId === response.question_id) {
      return response;
    }
  }
  return null;
};

const getMainReviewResponse = (responses) => {
  for (let response of responses) {
    if (response.question_id === null) {
      return response;
    }
  }
  return null;
};

const showSaveSuccess = (id) => {
  document.getElementById(id).style.display = 'block';
  //document.querySelectorAll("*[data-type='saveSuccess']").forEach((item) => { item.style.display = 'block' });
  setTimeout(() => {
    //document.querySelectorAll("*[data-type='saveSuccess']").forEach((item) => { item.style.display = 'none' });
    document.getElementById(id).style.display = 'none';
  }, 3000);
};

const validate = (state, onSubmit) => {
  let invalidQuestions = [];
  const answeredQuestions = [];

  if (onSubmit) {
    if (state.answersEditable) {
      for (let question of state.questions) {
        if (!question.answer || question.answer === '') { // && question.required) {
          invalidQuestions.push(question.id);
        } else {
          answeredQuestions.push(question.id);
        }
      }
      if (answeredQuestions.length > 0) {
        invalidQuestions = [];
      }
    }
  }

  return {
    endDate: state.periodEnd == null,
    questions: onSubmit ? invalidQuestions : state.questions,
    responses: onSubmit ? [] : state.responses,
  };
};

const changesPresent = (state, original) => {
  if (state.periodEnd !== original.periodEnd) {
    return true;
  }
  for (let i = 0; i < state.questions.length; i += 1) {
    if (state.questions[i].answer !== original.questions[i].answer) {
      return true;
    }
  }
  for (let i = 0; i < state.responses.length; i += 1) {
    if (state.responses[i].Response !== original.responses[i].Response) {
      return true;
    }
  }
  return false;
};

//let autoSaveInterval;

class Review extends React.Component {
  constructor(props) {
    super(props);
    const initialErrors = validate({ periodEnd: this.props.review.periodEnd, questions: [], responses: [] });
    const role = this.props.review.employee_id === this.props.userId ? 'Employee' : 'Supervisor';
    this.state = {
      periodStart: this.props.review.status === 'Closed' ? this.props.review.previousReviewDate : this.props.lastReviewed,
      periodEnd: this.props.review.periodEnd,
      questions: this.props.review.questions,
      responses: this.props.review.responses,
      role: this.props.review.employee_id === this.props.userId ? 'Employee' : (this.props.userId === this.props.review.supervisor_id ? 'Supervisor' : 'Viewer'),
      answersEditable: this.props.review.status === 'Open' && role === 'Supervisor' ? true : false,
      responsesEditable: this.props.review.status === 'Ready' && role === 'Employee',
      actionRadio: 'saveprogress', // todo set appropriate action value based on other vars,
      validationErrors: initialErrors,
      formError: initialErrors.startDate || initialErrors.endDate || initialErrors.questions.length > 0 || initialErrors.responses.length > 0,
      modalIsOpen: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleEndDateChange = this.handleEndDateChange.bind(this);
    this.handleTextEditorChange = this.handleTextEditorChange.bind(this);
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleModalContinue = this.handleModalContinue.bind(this);
  }

  // componentDidMount() {
  //   if (this.state.answersEditable || this.state.responsesEditable) {
  //     //autoSaveInterval = setInterval(() => this.handleSubmit(true), 30000);
  //     setTimeout(() => showReminder(), 10000);
  //   }
  // }

  //componentWillUnmount() {
    //clearInterval(autoSaveInterval);
  //}

  handleOpenModal() {
    if (changesPresent(this.state, this.props.review)) {
      this.setState({ modalIsOpen: true });
    } else {
      const path = ['check-in?emp=', this.props.review.employee_id, '&check-in=', this.props.review.id, '&printable=yes'].join('');
      browserHistory.push(path);
    }
  }

  handleModalContinue() {
    this.setState({ modalIsOpen: false });
    const path = ['check-in?emp=', this.props.review.employee_id, '&check-in=', this.props.review.id, '&printable=yes'].join('');
    browserHistory.push(path);
  }

  handleCloseModal() {
    this.setState({ modalIsOpen: false });
  }

  handleSubmit(auto) {
    let stayOnPage = this.state.actionRadio === 'saveprogress';
    let successId = 'saveSuccess2';
    if (auto === true) {
      stayOnPage = true;
      successId = 'saveSuccess1';
    }
    let newStatus = this.props.review.status;
    if (auto !== true) {
      if (this.state.actionRadio !== 'saveonly' && this.state.actionRadio !== 'saveprogress' && this.hasErrors()) {
        return;
      }
      if (this.state.actionRadio !== 'saveonly' && this.state.actionRadio !== 'saveprogress') {
        newStatus = this.state.actionRadio;
      }
    }
    this.props.submit({
      id: this.props.review.id,
      apolloClient: this.props.client,
      reviewInput: {
        status: newStatus,
        periodEnd: this.state.periodEnd,
        questions: this.state.questions.map(question => ({
          answer: question.answer,
          id: question.id,
        })),
        responses: this.state.responses.map(response => ({
          question_id: response.question_id,
          Response: response.Response,
        })),
      },
    }, stayOnPage, successId);
  }

  handleEndDateChange(value) {
    this.setState({ periodEnd: value != null ? value.format('M/DD/YYYY') : value });
  }

  handleTextEditorChange(event) {
    let splitId;
    let content;
    if (event.type === 'blur') {
      splitId = event.target.id.split('-');
      content = event.target.getContent();
    } else {
      splitId = event.target.getAttribute('data-id').split('-');
      content = event.target.innerHTML;
    }
    const questionOrResponse = splitId[0];
    const id = splitId[1] === '' ? null : splitId[1];
    if (questionOrResponse === 'response') {
      const newResponses = [];
      for (let i = 0; i < this.state.responses.length; i += 1) {
        if (id == this.state.responses[i].question_id) {
          newResponses.push(Object.assign({}, this.state.responses[i], { Response: content }));
        } else {
          newResponses.push(Object.assign({}, this.state.responses[i]));
        }
      }
      this.setState({ responses: newResponses });
    } else {
      const newQuestions = [];
      for (let i = 0; i < this.state.questions.length; i += 1) {
        if (id == this.state.questions[i].id) {
          newQuestions.push(Object.assign({}, this.state.questions[i], { answer: content }));
        } else {
          newQuestions.push(Object.assign({}, this.state.questions[i]));
        }
      }
      this.setState({ questions: newQuestions });
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
    this.setState({ questions: newQuestions });
  }

  hasErrors() {
    const validationErrors = validate(this.state, true);
    this.setState({ validationErrors: validationErrors });
    const invalid = validationErrors.startDate || validationErrors.endDate || validationErrors.questions.length > 0 || validationErrors.responses.length > 0;
    this.setState({ formError: invalid });
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
              <h1>Check-in between {this.props.review.employee_name} <br /> and supervisor {this.props.review.reviewer_name}</h1>
              <Link className="pull-right" style={{ fontSize: '20px' }} onClick={this.handleOpenModal}>Printable Version</Link>
              <Modal
                isOpen={this.state.modalIsOpen}
                contentLabel="Discard check-in changes?"
              >
                <h1 ref={subtitle => this.subtitle = subtitle}>Discard changes to this check-in?</h1>
                <p>There are unsaved changes to this check-in. Navigating away from this page will cause these changes to be lost.</p>
                  <button className="btn btn-primary" onClick={this.handleCloseModal}>Cancel</button>
                  <button className="btn btn-warning btn-sm" style={{ marginLeft: '10px' }} onClick={this.handleModalContinue}>Disgard changes and proceed to printable check-in</button>
              </Modal>
              <div className="col-sm-12">
                <div className="form-group" id="serverError" hidden>
                  <div className="alert alert-danger alert-sm">
                    <p>
                      There was an error processing your submission. Please contact <a href="mailto:Helpdesk@ashevillenc.gov" target="_blank" style={{ color: '#fff', textDecoration: 'underline' }}>help desk</a> and inform them of the time and date you tried to submit the form.
                    </p>
                    <p id="errorDetails">
                      ERROR
                    </p>
                  </div>
                </div>
                <div className="form-group" hidden={!(this.state.answersEditable || this.state.responsesEditable)} style={{ position: 'fixed', bottom: '2%', right: '5%', zIndex: '1' }}>
                  <div className="alert alert-info alert-xs" style={{ paddingBottom: '20px', paddingLeft: '5px' }}>
                    <span className="alert alert-info alert-xs" style={{ padding: '3px' }} data-type="saveSuccess" id="saveSuccess1" hidden>
                      Progress successfully saved.
                    </span>
                    <button className="btn btn-primary btn-xs pull-right" style={{ position: 'relative', top: '-10px', right: '-10px' }} type="button" id="plus" onClick={() => { document.getElementById('autosaveWarningText').classList.toggle('show'); document.getElementById('plus').classList.toggle('hidden'); document.getElementById('minus').classList.toggle('hidden'); }}>
                      +
                    </button>
                    <button className="btn btn-primary btn-xs hidden pull-right" type="button" id="minus" style={{ position: 'relative', top: '-10px', right: '-10px' }} onClick={() => { document.getElementById('autosaveWarningText').classList.toggle('show'); document.getElementById('minus').classList.toggle('hidden'); document.getElementById('plus').classList.toggle('hidden'); }}>
                      -
                    </button>
                    <input type="button" value="Save your work" className="btn btn-primary btn-xs pull-right" onClick={() => this.handleSubmit(true)} style={{ position: 'relative', top: '-10px', right: '-2px', marginBottom: '3px' }} ></input>
                    <div className="collapse" id="autosaveWarningText">
                      <div className="card card-body">
                        Autosave has not yet been implemented.<br /> Remember to save your progress frequently.
                      </div>
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <fieldset className="reviewQuestionFieldset">
                    <legend>Check-in Details</legend>
                    <div className="col-sm-12" style={{ marginBottom: '10px' }}>
                      <label htmlFor="startDate" className="col-sm-4" style={{ textAlign: 'right' }}>Previous check-in completed: </label>
                      <div className={dateErrors.startDate ? 'col-sm-8 invalid' : 'col-xs-8'}>
                        <span>{(!this.state.periodStart || moment.utc(this.state.periodStart).format('M/DD/YYYY') === '1/01/1970') ? 'Never' : moment.utc(this.state.periodStart).format('M/DD/YYYY')}</span>
                      </div>
                    </div>
                    <div className={dateErrors.endDate ? 'col-sm-12 invalid' : 'col-sm-12'}>
                      <label htmlFor="endDate" className="col-sm-4" style={{ textAlign: 'right' }}>Date of this check-in: </label>
                      <div className="col-sm-8">
                        {this.state.answersEditable &&
                          <DatePickerWrapper selected={moment.utc(this.state.periodEnd)} id="endDate" onChange={value => this.handleEndDateChange(value)} />
                        }
                        {this.state.answersEditable && dateErrors.endDate &&
                          <span style={{ color: 'red', fontWeight: 'bold', marginLeft: '10px' }}>&apos;Date of this check-in&apos; is required</span>
                        }
                        {!this.state.answersEditable &&
                          <span>{moment.utc(this.state.periodEnd).format('M/DD/YYYY')}</span>
                        }
                      </div>
                    </div>
                  </fieldset>
                </div>
                <div className="form-group">
                  <Collapsible trigger="Click here for your Check-in Reminder">
                    <div>
                      <p>
                        The purpose of the check-in is to provide an opportunity for regular conversations between supervisors and employees. During a check-in employees and supervisors can set or clarify expectations, share observations, and discuss career aspirations and development needs that will enhance the employee&apos;s performance for success.
                      </p>
                      <p>
                        Check-in core areas:
                        <ol>
                          <li>Observations and Reflections: Share frequent, two-way feedback between employee and supervisor, providing observations and reflections about current expectations, responsibilities and goals.</li>
                          <li>Looking Forward: Identify any new or revised expectations, goals, responsibilities or special projects. A new project may be identified based on the discussion.</li>
                          <li>Career: Discuss any career goals or aspirations, and/or how the employee can continue to grow in their role.</li>
                          <li>Development: The employee and supervisor can discuss and set actionable goals for professional development.</li>
                        </ol>
                      </p>
                      <p>
                        Best Practices:
                        <ul>
                          <li>Provide timely, specific, balanced observations.</li>
                          <li>Actively listen; listen to understand.</li>
                          <li>Ask questions to ensure you are clear about the feedback you&apos;re receiving.</li>
                          <li>Value different perspectives and be open to hearing constructive feedback.</li>
                          <li>Create mutually agreed upon actions and time lines.</li>
                          <li>Be sure to talk about successes and accomplishments as well as any areas where improvement is necessary.</li>
                        </ul>
                      </p>
                    </div>
                  </Collapsible>
                </div>
                <div className="form-group">
                  {
                    this.props.review.questions.map((question, index) => {
                      const resp = getResponse(question.id, this.props.review.responses);
                      return (
                        <div key={['question', index].join('_')}>
                          <Question question={question} editable={this.state.answersEditable} onBlur={question.type === 'Text' ? (event => (this.handleTextEditorChange(event))) : (value => (this.handleRadioQuestionChange(value, question.id)))} />
                          {resp !== null &&
                            <Response response={resp} editable={this.state.responsesEditable} onChange={event => (this.handleTextEditorChange(event))} />
                          }
                        </div>
                      );
                    })
                  }
                </div>
                <div className="form-group">
                  <Response response={getMainReviewResponse(this.props.review.responses)} standalone editable={this.state.responsesEditable} onChange={event => (this.handleTextEditorChange(event))} />
                </div>
                {this.props.review.status !== 'Closed' && this.state.role !== 'Viewer' &&
                  <div className="form-group">
                    <fieldset className="reviewQuestionFieldset">
                      <legend>Action</legend>
                      {this.state.role === 'Supervisor' && this.props.review.status === 'Open' &&
                        <div>
                          <p><i>Please discuss your feedback with your employee before submission for their input.</i></p>
                          <RadioGroup
                            name="workflow"
                            selectedValue={this.state.actionRadio}
                            onChange={val => (this.setState({ actionRadio: val }))}
                          >
                            <label>
                              <Radio value="saveprogress" />Save progress
                            </label>
                            <label>
                              <Radio value="saveonly" />Save &amp; exit
                            </label>
                            <label>
                              <Radio value="Ready" />Submit for employee input
                            </label>
                          </RadioGroup>
                          <div className="alert alert-success alert-sm" data-type="saveSuccess" id="saveSuccess2" hidden>
                            <p>
                              Your progress was saved.
                            </p>
                          </div>
                          <input type="button" className="btn btn-primary" value="Save" onClick={this.handleSubmit} />
                          <span hidden={!this.state.formError} style={{ color: 'red', marginLeft: '5px' }}>Required fields are missing. You must supply a Date of check-in and fill in at least one section before you can submit this check-in for employee input.</span>
                        </div>
                      }
                      {this.state.role === 'Supervisor' && this.props.review.status === 'Acknowledged' &&
                        <div>
                          <RadioGroup
                            name="workflow"
                            selectedValue={this.state.actionRadio}
                            onChange={val => (this.setState({ actionRadio: val }))}
                          >
                            <label>
                              <Radio value="Open" />Re-open
                            </label>                          
                            <label>
                              <Radio value="Closed" />Submit to HR record
                            </label>
                          </RadioGroup>
                          <input type="button" className="btn btn-primary" value="Save" onClick={this.handleSubmit} />
                        </div>
                      }
                      {this.state.role === 'Supervisor' && this.props.review.status === 'Ready' &&
                        <div className="alert alert-info">
                          You must wait for your employee to respond before further actions can be taken.
                        </div>
                      }
                      {this.state.role === 'Employee' && this.props.review.status === 'Ready' &&
                        <div>
                          <p><i>By acknowledging, you affirm that you have read your supervisor&apos;s feedback and discussed it with your supervisor.</i></p>
                          <RadioGroup
                            name="workflow"
                            selectedValue={this.state.actionRadio}
                            onChange={val => (this.setState({ actionRadio: val }))}
                          >
                            <label>
                              <Radio value="saveprogress" />Save progress
                            </label>
                            <label>
                              <Radio value="saveonly" />Save &amp; exit
                            </label>
                            <label>
                              <Radio value="Acknowledged" />Acknowledge
                            </label>
                            <label>
                              <Radio value="Open" />Further discussion requested
                            </label>                          
                          </RadioGroup>
                          <div className="alert alert-success alert-sm" data-type="saveSuccess" id="saveSuccess2" hidden>
                            <p>
                              Your progress was saved.
                            </p>
                          </div>
                          <input type="button" className="btn btn-primary" value="Save" onClick={this.handleSubmit} />
                          <span hidden={!this.state.formError} style={{ color: 'red', marginLeft: '5px' }}>Required fields are missing. You must complete all required fields before you can submit your response to your supervisor.</span>
                        </div>
                      }
                      {this.state.role === 'Employee' && this.props.review.status === 'Open' &&
                        <div className="alert alert-info">
                          Your supervisor has not yet released their feedback for your response.
                        </div>
                      }
                      {this.state.role === 'Employee' && this.props.review.status === 'Acknowledged' &&
                        <div className="alert alert-info">
                          You have acknowledged this check-in. When your supervisor closes the check-in, it will appear in your HR record.
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
            <Link style={{ fontSize: '20px' }} to={{ pathname: '/', query: { emp: this.props.review.employee_id, mode: 'check-ins' } }}>Back to {this.props.review.employee_name}&apos;s check-ins<br /></Link>
            <Link style={{ fontSize: '20px' }} to={{ pathname: '/', query: { mode: 'employees' } }}>Back to all my employees</Link>
          </div>
        }
        {this.state.role === 'Employee' &&
          <Link style={{ fontSize: '20px' }} to={{ pathname: '/', query: { mode: 'check-ins' } }}>Back to my check-ins</Link>
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

const ReviewGraphQL = graphql(submitReview, {
  props: ({ mutate }) => ({
    submit: (reviewData, auto, saveId) => mutate({
      variables: { id: reviewData.id, reviewInput: reviewData.reviewInput },
    }).then(({ data }) => {
      if (auto !== true) {
        browserHistory.push(['/?emp=', data.updateReview.employee_id, '&mode=check-ins'].join(''));
      } else {
        showSaveSuccess(saveId);
      }
    }).catch((error) => {
      document.getElementById('errorDetails').innerHTML = '<span>Error details: </span>' + error;
      document.getElementById('serverError').style.display = 'block';
      scrollTo(document.body, 0, 100);
    }),
  }),
})(Review);

export default withApollo(ReviewGraphQL);
