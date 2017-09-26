import React from 'react';
import { Link } from 'react-router';
import moment from 'moment';
import PropTypes from 'prop-types';

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
      <h1>Check-in between {props.review.employee_name} <br /> and supervisor {props.review.reviewer_name}</h1>
      <Link className="pull-right" style={{ fontSize: '20px' }} to={{ pathname: 'check-in', query: {emp: props.review.employee_id, 'check-in': props.review.id, printable: 'no'}} }>Back to check-in</Link>
      <div className="col-sm-12">
        <div className="form-group">
          <fieldset className="reviewQuestionFieldset">
            <legend>Check-in Details</legend>
            <div className="col-sm-12" style={{ marginBottom: '10px' }}>
              <label htmlFor="startDate" className="col-sm-4" style={{ textAlign: 'right' }}>Previous check-in completed: </label>
              <div className="col-sm-8">
                {console.log('test', props.lastReviewed)}
                <span>{!(props.review.status === 'Closed' ? props.review.periodStart : props.lastReviewed) ? 'Never' : moment.utc(props.review.periodStart).format('M/DD/YYYY')} </span>
              </div>
            </div>
            <div className="col-sm-12">
              <label htmlFor="endDate" className="col-sm-4" style={{ textAlign: 'right' }}>Date of this check-in: </label>
              <div className="col-sm-8">
                 <span>{moment.utc(props.review.periodEnd).format('M/DD/YYYY')} </span>
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
                  <div dangerouslySetInnerHTML={{__html : question.answer}} />
                </div>
              </fieldset>
              {getResponse(question.id, props.review.responses) !== null &&
                <div style={{ marginBottom: '25px'}}>
                  <h3>Employee Response</h3>
                  <div style={{ border: '1px solid #e5e5e5', padding: '10px' }}>
                    <div dangerouslySetInnerHTML={{__html : getResponse(question.id, props.review.responses).Response}} />
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
              {getMainReviewResponse(props.review.responses) !== null &&
                <div dangerouslySetInnerHTML={{__html : getMainReviewResponse(props.review.responses).Response}} />
              }
            </div>
            {props.review.status !== 'Closed' &&
              <div style={{ marginTop: '25px', marginBottom: '25px' }}><strong>NOTE:</strong> This check-in has not yet been closed, therefore this printout may not reflect the final version of this check-in.</div>
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

export default PrintableReview;
