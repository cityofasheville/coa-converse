import React from 'react';
import PropTypes from 'prop-types';
import { Radio, RadioGroup } from 'react-radio-group';
import Question from './Question';

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
        status: 'Open',
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
            question: '<legend>Up to par</legend><p>Is this employee up to par?</p>',
            answer: '1',
            required: true,
          }
        ],
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
  for (response of responses) {
    if (questionId === response.question_id) {
      return response;
    }
  }
  return null;
}

const Review = props => (
  <div>
    <div className="row">
      <div className="col-sm-12">
        <h1>Conversation between {props.review.employee_name} and supervisor {props.review.reviewer_name}</h1>
      </div>
    </div>
    <div className="row">
      <div className="col-sm-12">
        <h2>Period</h2>
        TODO: daterange
      </div>
    </div>
    <div className="row">
      <div className="col-sm-12">
        {props.review.questions.map((question, index) => (
          <Question key={['question', index].join('_')} question={question} response={getResponse(question.id, props.review.responses)} />
        ))}
      </div>
    </div>
    <div className="row">
      <div className="col-sm-12">
        <h2>Action</h2>
        TODO: Depending on Status determine the options here
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

Review.propTypes = {
  review: PropTypes.shape(reviewShape), // eslint-disable-line
};

Review.defaultProps = {
  review: testEmployees[1].reviews[0],
};

export default Review;