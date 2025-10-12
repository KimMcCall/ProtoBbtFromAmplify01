// PromptDialog.tsx

import { TextAreaField } from '@aws-amplify/ui-react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { ChangeEvent, useState } from 'react';

interface PromptDialogProps {
  open: boolean;
  title: string;
  message: string;
  charLimit?: number;
  rows?: number;
  cols?: number;
  onClose: () => void;
  onSubmit: (text: string) => void;
}

const PromptDialog: React.FC<PromptDialogProps> = ({ open, title, message, charLimit = 0, rows = 6, cols = 60, onClose, onSubmit }) => {
  const [textAreaValue, setTextAreaValue] = useState('');

  const handleSubmit = () => {
    onSubmit(textAreaValue);
    setTextAreaValue(''); // Clear the text area after submission
    onClose();
  };

  const handleCancel = () => {
    setTextAreaValue(''); // Clear the text area after submission
    onClose();
  };

  const handleTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    if (charLimit > 0 && event.target.value.length > charLimit) {
      return; // Do not update if it exceeds char limit
    }
    setTextAreaValue(event.target.value);
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
        <TextAreaField
          label=""
          value={textAreaValue}
          onChange={handleTextChange}
          rows={rows}
          cols={cols}
        />
      {charLimit > 0 &&
        <div>Chars left: {charLimit - textAreaValue.length}</div>
      } 
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="primary">Cancel</Button>
        <Button onClick={handleSubmit} color="primary" autoFocus>Submit</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PromptDialog;
