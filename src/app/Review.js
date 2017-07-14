import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { Radio, RadioGroup } from 'react-radio-group';
import DatePickerWrapper from '../shared/DatePickerWrapper';
import Question from './Question';
import Response from './Response';

const testEmployees = [
    {
    id: 6409,
    reviewable: false,
    active: true,
    name: 'ADAM D GRIFFITH',
    email: 'agriffith@ashevillenc.gov',
    position: null,
    department: 'IT',
    division: 'BPT',
    last_reviewed: '',
    review_by: '',
    supervisor_id: 123,
    supervisor_name: 'Scott Barnwell',
    supervisor_email: 'sbarnwell@ashevillenc.gov',
    employees: [],
    reviews: [],
  },
  {
    id: 6645,
    active: true,
    reviewable: true,
    name: 'FRANCES C RUIZ',
    email: 'fruiz@ashevillenc.gov',
    position: 'Most Awesomest Coder Ever',
    department: 'IT',
    division: 'BPT',
    last_reviewed: '06/23/2017',
    review_by: 'Scott Barnwell',
    supervisor_id: 123,
    supervisor_name: 'Scott Barnwell',
    supervisor_email: 'sbarnwell@ashevillenc.gov',
    employees: [],
    reviews: [
      {
        id: 56,
        status: 'Ready',
        supervisor_id: 123,
        employee_id: 6645,
        position: 'Most Awesomest Coder Ever',
        periodStart: '6/23/2017',
        periodEnd: '9/21/2017',
        reviewer_name: 'Scott Barnwell',
        employee_name: 'FRANCES C RUIZ',
        questions: [
          {
            id: 1,
            type: 'Text',
            question: '<legend>Current Responsibilities</legend><p>Describe any significant changes in responsibilities since last 1:1 meeting.',
            answer: 'No changes, but she does everything under the sun and then some.',
            required: true,
          },
          {
            id: 2,
            type: 'Text',
            question: '<legend>Performance</legend><p>General comments regarding job performance based on:</p><ul style="list-style-type: circle;"><li>Technical job</li><li>Progress / achievement of established expectations &amp; goals since the last 1:1</li><li>Assessment of accomplishments and any behavioral competencies</li></ul><p>General comments regarding the staff member&apos;s job performance.</p><p>Describe any areas of performance needing more attention or improvement.(provide specific examples)</p><p>Describe any areas of exceptional performance. (provide specific examples)</p>',
            answer: 'Best employee EVER!!!!',
            required: true,
          },
          {
            id: 3,
            type: 'Y/N',
            question: '<legend>Satisfactory</legend><p>Is this employee satisfactorily fullfilling their duties?</p>',
            answer: '1',
            required: true,
          }
        ],
        responses: [
          {
            question_id: 2,
            review_id: 56,
            Response: 'This is a resposne to the question for testing.',
          },
          {
            question_id: -1,
            review_id: 56,
            Response: 'My overall response is that I do not like getting reviewed at all!',
          }

        ],
      }
    ],
  },
  {
    id: 1337,
    active: true,
    reviewable: true,
    name: 'CHRISTEN E MCNAMARA',
    email: 'cmcnamara@ashevillenc.gov',
    position: 'Most Awesomest GIS Whiz Ever',
    department: 'IT',
    division: 'BPT',
    last_reviewed: '',
    review_by: '',
    supervisor_id: 123,
    supervisor_name: 'Scott Barnwell',
    supervisor_email: 'sbarnwell@ashevillenc.gov',
    employees: [],
    reviews: [],
  },
  {
    id: 5912,
    active: false,
    reviewable: false,
    name: 'EDWARD C CARLYLE',
    email: '',
    position: 'The One who Went to Utah',
    department: 'IT',
    division: 'BPT',
    last_reviewed: '',
    review_by: '',
    supervisor_id: 123,
    supervisor_name: 'Scott Barnwell',
    supervisor_email: 'sbarnwell@ashevillenc.gov',
    employees: [],
    reviews: [],
  },
  {
    id: 6507,
    active: true,
    reviewable: true,
    name: 'PHILIP E JACKSON',
    email: 'ejackson@ashevillenc.gov',
    position: 'Most Awesomest Tech Guru Ever',
    department: 'IT',
    division: 'BPT',
    last_reviewed: '6/29/2017',
    review_by: 'Scott Barnwell',
    supervisor_id: 123,
    supervisor_name: 'Scott Barnwell',
    supervisor_email: 'sbarnwell@ashevillenc.gov',
    employees: [],
    reviews: [
      {
        id: 15,
        status: 'Ready',
        supervisor_id: 123,
        employee_id: 6507,
        position: 'Most Awesomest Tech Guru Ever',
        periodStart: '6/29/2017',
        periodEnd: '9/27/2017',
        reviewer_name: 'Scott Barnwell',
        employee_name: 'sbarnwell@ashevillenc.gov',
        questions: [],
        responses: [],
      },
      {
        id: 152,
        status: 'Closed',
        supervisor_id: 123,
        employee_id: 6507,
        position: 'Most Awesomest Tech Guru Ever',
        periodStart: '4/06/2017',
        periodEnd: '7/07/2017',
        reviewer_name: 'Scott Barnwell',
        employee_name: 'sbarnwell@ashevillenc.gov',
        questions: [],
        responses: [],
      }
    ],
  },
];

const getResponse = (questionId, responses) => {
  //assumes 1:1 relationship between a question and a response
  for (let response of responses) {
    if (questionId === response.question_id) {
      return response;
    }
  }
  return null;
}

//will main response have question_id as -1? will it exist always or do we need to return an empty obj here
const getMainReviewResponse = (responses) => {
  for (let response of responses) {
    if (response.question_id === -1) {
      return response;
    }
  }
  return null;
}

class Review extends React.Component {
  constructor(props) {
    super(props);
    //figure out if the answers are editable, etc
    let role = 'Employee'; //todo set properly according to if employee_id matches the logged in user's or not
    this.state = {
      periodStart: this.props.review.startDate,
      periodEnd: this.props.review.endDate,
      questions: this.props.review.questions,
      responses: this.props.review.responses,
      validationErrors: {},
      role: role,
      answersEditable: this.props.review.status === 'Open' && role === 'Supervisor' ? true : false,
      responsesEditable: this.props.review.status === 'Ready' && role === 'Employee' ? true : false,
      actionRadio: 'saveonly', //todo set appropriate action value based on other vars
    }
    this.handleSubmit = this.handleSubmit.bind(this);
  }
    
  handleSubmit(event) {
    console.log('you are submitting');
  }
  
  render() {
    return (
      <div>
        <form>
          <div className="row form-horizontal">
            <h1>Conversation between {this.props.review.employee_name} and supervisor {this.props.review.reviewer_name}</h1>
            <Link className="pull-right" style={{ fontSize: '20px' }} to={{ pathname: 'printableReview', query: {emp: this.props.review.employee_id, rev: this.props.review.id}} }>Printable Version</Link>
            <div className="col-sm-12">
              <div className="form-group">
                <fieldset className="reviewQuestionFieldset">
                  <legend>Period</legend>
                  <div className="col-sm-6 col-xs-12" style={{ marginBottom: '10px' }}>
                    <label htmlFor="startDate" className="col-xs-2" style={{ textAlign: 'right'}}>From: </label>
                    <div className="col-xs-4">
                      <DatePickerWrapper startDate={this.props.review.periodStart} id="startDate" onChange={(value) => (console.log(value._i))} />
                    </div>
                  </div>
                  <div className="col-sm-6 col-xs-12">
                    <label htmlFor="endDate" className="col-xs-2" style={{ textAlign: 'right'}}>To: </label>
                    <div className="col-xs-4">
                      <DatePickerWrapper endDate={this.props.review.periodEnd} id="startDate" onChange={(value) => (console.log(value._i))} />
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
                        <p><i>By acknowledging, you affirm that you have read your supervisor's answers and discussed them with your supervisor.</i></p>
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
                        Your supervisor has not yet released their answers for your response.
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

Review.defaultProps = {
  review: testEmployees[1].reviews[0],
};

export default Review;