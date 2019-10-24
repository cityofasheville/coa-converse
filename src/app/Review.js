    const role = this.props.review.employee_id === this.props.userId ? 'Employee' : 'Supervisor';
    this.state = {
      periodStart: this.props.review.status === 'Closed' ? this.props.review.previousReviewDate : this.props.lastReviewed,
      periodEnd: this.props.review.periodEnd,
      questions: this.props.review.questions,
      responses: this.props.review.responses,
      answersEditable: this.props.review.status === 'Open' && role === 'Supervisor' ? true : false,
      responsesEditable: this.props.review.status === 'Ready' && role === 'Employee',
      actionRadio: 'saveprogress', // todo set appropriate action value based on other vars,
      validationErrors: initialErrors,
      formError: initialErrors.startDate || initialErrors.endDate || initialErrors.questions.length > 0 || initialErrors.responses.length > 0,
      modalIsOpen: false,
      stayOnPageAfterSave: true,
      changesSinceLastSave: 0,
      activeSaveId: 'saveSuccess2',
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleEndDateChange = this.handleEndDateChange.bind(this);
    this.handleTextEditorChange = this.handleTextEditorChange.bind(this);
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleModalContinue = this.handleModalContinue.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.actionRadio !== nextState.actionRadio) {
      return true;
    }
    return false;
  }

  componentWillUnmount() {
    clearInterval(autoSaveInterval);
  }

  handleOpenModal(submitFunction) {
    if (this.state.changesSinceLastSave > 0) {
      this.handleSubmit(submitFunction, true, 'none');
    }
    const path = ['check-in?emp=', this.props.review.employee_id, '&check-in=', this.props.review.id, '&printable=yes'].join('');
    browserHistory.push(path);
  }

  handleModalContinue() {
    this.setState({ modalIsOpen: false });
    const path = ['check-in?emp=', this.props.review.employee_id, '&check-in=', this.props.review.id, '&printable=yes'].join('');
    browserHistory.push(path);
  }

  handleCloseModal() {
    this.setState({ modalIsOpen: false });
  }

  handleSubmit(submitFunction, auto, saveId) {
    this.setState({ stayOnPageAfterSave: this.state.actionRadio === 'saveprogress' });
    if (auto === true) {
      this.setState({ stayOnPageAfterSave: true });
    }
    if (saveId !== undefined) {
      this.setState({ activeSaveId: saveId });
    } else {
      this.setState({ activeSaveId: 'saveSuccess2' });
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
    submitFunction({
      variables: {
        id: this.props.review.id,
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
      },
    });
  }

  handleEndDateChange(value, submitFunction) {
    this.setState({ periodEnd: value != null ? value.format('M/DD/YYYY') : value }, () => this.handleSubmit(submitFunction, true));
  }

  handleTextEditorChange(event, submitFunction) {
    let splitId;
    let content;
    if (event.type === 'blur') {
      splitId = event.target.id.split('-');
      content = event.target.getContent();
    } else {
      this.setState({ changesSinceLastSave: this.state.changesSinceLastSave + 1 });
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
      this.setState({ responses: newResponses }, () => {
        if (this.state.changesSinceLastSave > 50) {
          this.handleSubmit(submitFunction, true, 'none');
        }
      });
    } else {
      const newQuestions = [];
      for (let i = 0; i < this.state.questions.length; i += 1) {
        if (id == this.state.questions[i].id) {
          newQuestions.push(Object.assign({}, this.state.questions[i], { answer: content }));
        } else {
          newQuestions.push(Object.assign({}, this.state.questions[i]));
        }
      }
      this.setState({ questions: newQuestions }, () => {
        if (this.state.changesSinceLastSave > 50) {
          this.handleSubmit(submitFunction, true, 'none');
        }
      });
    }
  }

  handleRadioQuestionChange(value, questionId, submitFunction) {
    const newQuestions = [];
    for (let i = 0; i < this.state.questions.length; i += 1) {
      if (questionId == this.state.questions[i].id) {
        newQuestions.push(Object.assign({}, this.state.questions[i], {answer: value}));
      } else {
        newQuestions.push(Object.assign({}, this.state.questions[i]));
      }
    }
    this.setState({ questions: newQuestions }, () => this.handleSubmit(submitFunction, true, 'none'));
  }

  hasErrors() {
    const validationErrors = validate(this.state, true);
    this.setState({ validationErrors: validationErrors });
    const invalid = validationErrors.startDate || validationErrors.endDate || validationErrors.questions.length > 0 || validationErrors.responses.length > 0;
    this.setState({ formError: invalid });
    if (invalid) {
      document.getElementById('formValidationError').style.display = 'block';
    }
    return invalid;
  }

  render() {
    const dateErrors = validate(this.state);
    return (
      <Mutation
        mutation={submitReview}
        onError={(error) => {
          if (document.getElementById('errorDetails')) {
            document.getElementById('errorDetails').innerHTML = `<span>Error details: </span> ${error}`;
            document.getElementById('serverError').style.display = 'block';
          }
          scrollTo(document.body, 0, 100);
        }}
        onCompleted={(data) => {
          if (!this.state.stayOnPageAfterSave) {
            browserHistory.push(['/?emp=', data.updateReview.employee_id, '&mode=check-ins'].join(''));
          }
          this.setState({ changesSinceLastSave: 0 });
          if (this.state.activeSaveId !== 'none' && document.getElementById(this.state.activeSaveId)) {
            showSaveSuccess(this.state.activeSaveId);
          }
          if (document.getElementById('formValidationError')) {
            document.getElementById('formValidationError').style.display = 'none';
          }
          if (document.getElementById('serverError')) {
            document.getElementById('serverError').style.display = 'none';
          }
        }}
        ignoreResults
      >
        {(submit, { loading, error, data }) => {
          if (this.state.answersEditable || this.state.responsesEditable) {
            if (autoSaveInterval === null) {
              autoSaveInterval = setInterval(() => {
                if (this.state.changesSinceLastSave > 0) {
                  this.handleSubmit(submit, true, 'none');
                }
              }, 10000);
            }
          }
          return (
            <div>
              <form>
                <div className="row form-horizontal">
                  <h1>Check-in between {this.props.review.employee_name} <br /> and supervisor {this.props.review.reviewer_name}</h1>
                  <Link className="pull-right" style={{ fontSize: '20px' }} onClick={() => this.handleOpenModal(submit)}>Printable Version</Link>
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
                        <input type="button" value="Save your work" className="btn btn-primary btn-xs pull-right" onClick={() => this.handleSubmit(submit, true, 'saveSuccess1')} style={{ position: 'relative', top: '-10px', right: '-2px', marginBottom: '3px' }} ></input>
                        <div className="collapse" id="autosaveWarningText">
                          <div className="card card-body">
                            Autosave has been implemented.<br /> However you may still wish to save your progress frequently.
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
                              <DatePickerWrapper selected={moment.utc(this.state.periodEnd)} id="endDate" onChange={value => this.handleEndDateChange(value, submit)} />
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
                    <CheckInInstructions />
                    <div className="form-group">
                      {
                        this.props.review.questions.map((question, index) => {
                          const resp = getResponse(question.id, this.props.review.responses);
                          return (
                            <div key={['question', index].join('_')}>
                              <Question question={question} editable={this.state.answersEditable} onBlur={question.type === 'Text' ? (event => (this.handleTextEditorChange(event, submit))) : (value => (this.handleRadioQuestionChange(value, question.id, submit)))} />
                              {resp !== null &&
                                <Response response={resp} editable={this.state.responsesEditable} onChange={event => (this.handleTextEditorChange(event, submit))} />
                              }
                            </div>
                          );
                        })
                      }
                    </div>
                    <div className="form-group">
                      <Response response={getMainReviewResponse(this.props.review.responses)} standalone editable={this.state.responsesEditable} onChange={event => (this.handleTextEditorChange(event, submit))} />
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
                              <input type="button" className="btn btn-primary" value="Save" onClick={() => this.handleSubmit(submit)} />
                              <span id="formValidationError" style={{ color: 'red', marginLeft: '5px', display: 'none' }}>Required fields are missing. You must supply a Date of check-in and fill in at least one section before you can submit this check-in for employee input.</span>
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
                              <input type="button" className="btn btn-primary" value="Save" onClick={() => this.handleSubmit(submit)} />
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
                              <input type="button" className="btn btn-primary" value="Save" onClick={() => this.handleSubmit(submit)} />
                              <span id="formValidationError" style={{ color: 'red', marginLeft: '5px', display: 'none' }}>Required fields are missing. You must complete all required fields before you can submit your response to your supervisor.</span>
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
        }}
      </Mutation>
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
