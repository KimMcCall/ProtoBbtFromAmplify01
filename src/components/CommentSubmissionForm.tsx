// src/components/CommentSubmissionForm.tsx

import { Button, Flex, TextAreaField } from "@aws-amplify/ui-react";
import { MdClose } from "react-icons/md";
import './CommentSubmissionForm.css'
import { ChangeEvent, SyntheticEvent, useState } from "react";

const charLimit = 1200;

type MyPropsType = {
  cancelF: () => void
  submitF: (text: string) => void
}

function CommentSubmissionForm (props: MyPropsType) {
  const { cancelF, submitF } = props;

  const [myText, setMyText] = useState('');
  const [nChars, setNChars] = useState(0);

  const handleCloseClick = (event: { stopPropagation: () => void; }) => {
    event.stopPropagation();
    setMyText('');
    setNChars(0);
    cancelF();
  }

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    event.stopPropagation();
    const newText = event.target.value;
    if (newText.length <= charLimit) {
      setMyText(newText);
      setNChars(newText.length);
    }
  }

  const handleCancelButtonClick = (event: SyntheticEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setMyText('');
    setNChars(0);
    cancelF();
  }

  const handleSubmitButtonClick = (event: SyntheticEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    submitF(myText);
    setMyText('');
  }

  return (
    <div className='commentFormRootRoot'>
      <Flex direction="column">
        <div className="topBlackBar">
          <div className='submissionFormCloseIconDiv'>
            <MdClose className="submissionFormCloseIcon" color='white' onClick={handleCloseClick}/>
          </div>
        </div>
        <div className="invitation">
          Please feel free to leave a (<span className="emphasizedSpan">non-abusive</span>) comment
        </div>
        <TextAreaField className="submissionFormTextArea" label="" direction="column" rows={12} value={myText} onChange={handleChange} />

        <Flex className="buttonRow" direction='row' gap="20px">
          <Button onClick={handleCancelButtonClick}>
            Cancel
          </Button>
          <Button onClick={handleSubmitButtonClick}>
            Submit
          </Button>
          <div className="remainingCharsDiv">
            {charLimit - nChars} chars left
          </div>
        </Flex>
      </Flex>
    </div>
  )
}

export default CommentSubmissionForm;
