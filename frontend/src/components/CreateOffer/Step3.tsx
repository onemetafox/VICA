import React, { useState, useContext } from 'react';
import { OfferContext } from 'src/hooks/useStepReducer';
import OfferContainer from 'src/components/CreateOffer/Container';
import LeftSide from './LeftSide';
import RightSide from './RightSide';
import ActionButtons from './ActionButtons';
import Input from './Input';
import TextArea from './TextArea';

const Step3 = () => {
  const { stepState, stepDispatch } = useContext(OfferContext);
  const [label, setLabel] = useState(stepState.label);
  const [terms, setTerms] = useState(stepState.terms);
  const [instructions, setInstructions] = useState(stepState.instructions);
  const disabledButton = label === '' || terms === '' || instructions === '';

  return (
    <OfferContainer>
      <LeftSide>
        <h1 className="text-2xl font-bold text-blue-800 mb-7">
          Trade Instructions
        </h1>
        <h2 className="text-lg font-bold mb-5">Your Offer Label</h2>
        <Input state={label} setState={setLabel} />
        <p className="text-sm text-darkGray mt-3 mb-7">
          Make your offer stand out to other users with a catchy label. Your
          offer label can be up to 25 characters long and can contain letters,
          numbers, the apostrophe and the hyphen.
        </p>
        <h2 className="text-lg font-bold mb-5">Offer Terms</h2>
        <TextArea
          state={terms}
          setState={setTerms}
          placeholder="Write your terms here"
        />
        <p className="text-sm text-darkGray mt-3 mb-7">
          Anybody who views your offer will see these terms. Keep them simple
          and clear to make your offer sound attractive.
        </p>
        <h2 className="text-lg font-bold mb-5">Trade Instructions</h2>
        <TextArea
          state={instructions}
          setState={setInstructions}
          placeholder="List your instructions for your trade partner"
        />
        <p className="text-sm text-darkGray mt-3 mb-7">
          To ensure a successful trade be transparent about what you expect from
          your trade partner and list out what you need.
        </p>
      </LeftSide>
      <RightSide>
        <ActionButtons
          data={{ ...stepState, label, terms, instructions }}
          stepDispatch={stepDispatch}
          disabledButton={disabledButton}
        />
      </RightSide>
    </OfferContainer>
  );
};

export default Step3;
