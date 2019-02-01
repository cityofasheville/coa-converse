import React from 'react';
import Collapsible from 'react-collapsible';

const CheckInInstructions = () => (
  <div className="form-group">
    <Collapsible trigger="Click here for your Check-in Reminder">
      <div>
        <p>
          The purpose of the check-in is to provide an opportunity for regular conversations between supervisors and employees. During a check-in employees and supervisors can set or clarify expectations, share observations, and discuss career aspirations and development needs that will enhance the employee&apos;s performance for success.
        </p>
        <p>
          Check-in core areas:
        </p>
        <ol>
        <li>Observations and Reflections: Share frequent, two-way feedback between employee and supervisor, providing observations and reflections about current expectations, responsibilities and goals.</li>
        <li>Looking Forward: Identify any new or revised expectations, goals, responsibilities or special projects. A new project may be identified based on the discussion.</li>
        <li>Career: Discuss any career goals or aspirations, and/or how the employee can continue to grow in their role.</li>
        <li>Development: The employee and supervisor can discuss and set actionable goals for professional development.</li>
        </ol>
        <p>
          Best Practices:
        </p>
        <ul>
        <li>Provide timely, specific, balanced observations.</li>
        <li>Actively listen; listen to understand.</li>
        <li>Ask questions to ensure you are clear about the feedback you&apos;re receiving.</li>
        <li>Value different perspectives and be open to hearing constructive feedback.</li>
        <li>Create mutually agreed upon actions and time lines.</li>
        <li>Be sure to talk about successes and accomplishments as well as any areas where improvement is necessary.</li>
        </ul>
      </div>
    </Collapsible>
  </div>
);

export default CheckInInstructions;
