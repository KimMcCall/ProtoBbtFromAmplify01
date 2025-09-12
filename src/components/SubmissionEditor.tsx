// SubmissionEditor.tsx

import { useState, useEffect } from 'react';
import { Flex, Button, TextField, TextAreaField } from '@aws-amplify/ui-react';
import {SubmissionWithDateType as SubmissionType} from '../pages//AdminSubmissionsPage'
import { dbClient } from "../main";
import './SubmissionEditor.css'

type SubmissionEditorProps = {
  submission: SubmissionType;
  editorShowOrHide: (b: boolean) => void
}

function SubmissionEditor(props: SubmissionEditorProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const { submission, editorShowOrHide} = props;

  const handleCloseClick = (event: { stopPropagation: () => void; }) => {
    event.stopPropagation();
    editorShowOrHide(false);
  }

  const handleSaveClick = async (event: { stopPropagation: () => void; }) => {
    event.stopPropagation();
        const myUpdate =  {
          id: submission.id,
          title: title,
          content: content,
        };
        console.log(`calling   update() at ${Date.now() % 10000}`);
        await dbClient.models.Submission.update(myUpdate);
        console.log(`back from update() at ${Date.now() % 10000}`);
        submission.title = title;
        submission.content= content;
        editorShowOrHide(false);
  }

  useEffect(() => {
    setTitle(submission.title);
    setContent(submission.content);
  }, [submission.title, submission.content]);

  return (
    <div key={submission.id} className="editorPanel">
      <Flex direction='column'>
        <Flex direction='row' gap='6px'>
          <div className='titleLabelDiv'>
            Title:
          </div>
          <TextField label=''
          name='title'
          value={title}
          onChange={(e) => {setTitle(e.target.value);}}
        />
        </Flex>
        <div>
          <TextAreaField
            label=""
            value={content}
            onChange={(e) => {setContent(e.target.value)}}
            rows={17}/>
        </div>
        <Flex direction='row'>
          <Button onClick={handleCloseClick}>
            Close
          </Button>
          <Button onClick={handleSaveClick}>
            Save
          </Button>
        </Flex>
      </Flex>
    </div>
  )
}

export default SubmissionEditor;
