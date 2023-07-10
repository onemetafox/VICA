import React, { useState } from 'react';
import Popup from 'reactjs-popup';
import { useSendFeedback } from 'src/queries/trades';

type Props = {
  isOpen: boolean;
  onClose:
    | ((
        event?:
          | KeyboardEvent
          | TouchEvent
          | MouseEvent
          | React.SyntheticEvent<Element, Event>
          | undefined
      ) => void)
    | undefined;
  orderId: string;
};

const Feedback = ({ isOpen, onClose, orderId }: Props) => {
  const mutation = useSendFeedback(orderId);
  const [feedbackObject, setFeedbackObject] = useState({
    feedback: true,
    comment: '',
  });

  const onChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    if (e.target.name === 'feedback-radio') {
      setFeedbackObject({
        ...feedbackObject,
        feedback: e.target.value === 'positive',
      });
    } else {
      setFeedbackObject({ ...feedbackObject, comment: e.target.value });
    }
  };

  const onSubmit = () => {
    mutation.mutate(feedbackObject);
    if (onClose) onClose();
  };

  return (
    <Popup position="right center" open={isOpen} onClose={onClose}>
      <div className="p-5">
        <h1 className="text-lg font-bold mb-5">Leave Feedback</h1>
        <h2 className="mb-5">How was your experience ?</h2>
        <div className="flex items-center mb-2 ">
          <input
            defaultChecked
            id="feedback-radio-1"
            type="radio"
            value="positive"
            onChange={onChange}
            name="feedback-radio"
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2"
          />
          <label
            htmlFor="feedback-radio-1"
            className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300 cursor-pointer"
          >
            Positive
          </label>
        </div>
        <div className="flex items-center ">
          <input
            id="feedback-radio-2"
            type="radio"
            value="negative"
            onChange={onChange}
            name="feedback-radio"
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2"
          />
          <label
            htmlFor="feedback-radio-2"
            className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300 cursor-pointer"
          >
            Negative
          </label>
        </div>
        <h2 className="mb-2 mt-7">Comment :</h2>
        <textarea
          value={feedbackObject?.comment}
          placeholder="write a message..."
          className="outline-none w-full resize-none"
          onChange={onChange}
        />
        <button
          type="button"
          onClick={onSubmit}
          className="bg-blue-700 hover:bg-blue-500 text-white rounded font-bold py-2 px-4 ml-auto mt-7"
        >
          Submit
        </button>
      </div>
    </Popup>
  );
};

export default Feedback;
