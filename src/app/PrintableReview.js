import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';

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
            answer: 'Y',
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
        status: 'Open',
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

const PrintableReview = props => (
  <div>
    <div className="row form-horizontal">
      <h1>Conversation between {props.review.employee_name} and supervisor {props.review.reviewer_name}</h1>
      <Link className="pull-right" style={{ fontSize: '20px' }} to={{ pathname: 'conversation', query: {emp: props.review.employee_id, rev: props.review.id}} }>Back to conversation</Link>
      <div className="col-sm-12">
        <div className="form-group">
          <fieldset className="reviewQuestionFieldset">
            <legend>Period</legend>
            <div className="col-sm-6 col-xs-12" style={{ marginBottom: '10px' }}>
              <label htmlFor="startDate" className="col-xs-2" style={{ textAlign: 'right' }}>From: </label>
              <div className="col-xs-4">
                <span>{props.review.periodStart} </span>
              </div>
            </div>
            <div className="col-sm-6 col-xs-12">
              <label htmlFor="endDate" className="col-xs-2" style={{ textAlign: 'right' }}>To: </label>
              <div className="col-xs-4">
                 <span>{props.review.periodEnd} </span>
              </div>
            </div>
          </fieldset>
        </div>
        <div className="form-group">
          {props.review.questions.map((question, index) => (
            <div key={['question', index].join('_')}>
              <fieldset className="reviewQuestionFieldset">
                <div dangerouslySetInnerHTML={{__html : question.question}} />
                <div style={{ border: '1px solid #e5e5e5', padding: '10px' }}>
                  {question.answer}
                </div>
              </fieldset>
              {getResponse(question.id, props.review.responses) !== null &&
                <div style={{ marginBottom: '25px'}}>
                  <h3>Employee Response</h3>
                  <div style={{ border: '1px solid #e5e5e5', padding: '10px' }}>
                    {getResponse(question.id, props.review.responses).Response}
                  </div>
                </div>
              }
            </div>
          ))}
        </div>
        <div className="form-group">
          <fieldset className="reviewQuestionFieldset">
            <legend>Employee Comments</legend>
            <div style={{ border: '1px solid #e5e5e5', padding: '10px' }}>
              {getMainReviewResponse(props.review.responses).Response}
            </div>
            {props.review.status !== 'Closed' &&
              <div style={{ marginTop: '25px', marginBottom: '25px' }}><strong>NOTE:</strong> This conversation has not yet been closed, therefore this printout may not reflect the final version of this conversation.</div>
            }
          </fieldset>
        </div>
      </div>
    </div>
  </div>
);

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

PrintableReview.propTypes = {
  review: PropTypes.shape(reviewShape), // eslint-disable-line
};

PrintableReview.defaultProps = {
  review: testEmployees[1].reviews[0],
};

export default PrintableReview;
