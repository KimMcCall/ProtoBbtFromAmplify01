import { Button, Flex, TextField } from "@aws-amplify/ui-react";
import PageWrapper from "../components/PageWrapper";
import './AdminIssuesPage.css'
import { SetStateAction, useState } from "react";
import { createIssue } from "../utils/dynamodb_operations";
import { getRandomIntegerInRange } from "../utils/utils";
import ToastNotifier from "../components/ToastNotifier";
  
const innerHandleSubmit = async (
  event: React.SyntheticEvent<HTMLFormElement>,
  toastSetter: { (value: SetStateAction<string>): void; (arg0: string): void; },
  toastShower: { (value: SetStateAction<boolean>): void; (arg0: boolean): void; }) => {
  event.preventDefault(); // Prevent default form submission behavior
  // Handle form data here, e.g., send to an API or update state
  const form: HTMLFormElement = event.currentTarget
  const formData = new FormData(form);
  const formJson = Object.fromEntries(formData.entries());
  const submittedProUrl = formJson.proUrl;
  const convertedProUrl = submittedProUrl.toString();
  const submittedConUrl = formJson.conUrl;
  const convertedConUrl = submittedConUrl.toString();
  if (convertedConUrl.length === 0 && convertedProUrl.length ===0) {
    toastSetter('Sorry! You need to fill in at least one URL');
    toastShower(true);
    return;
  }
  
  const priority = getRandomIntegerInRange(1, 1000000);
  
  await createIssue(
    priority,
    convertedProUrl,
    convertedConUrl,
    'truthLover@example.com',
    'denier@example.com');
  toastSetter('Your issue has been received');
  toastShower(false);
};

function AdminIssuesPage() {
  const [toastMessage, setToastMessage] = useState('Sorry! You need to fill in at least one URL');
  const [shouldShowAcceptanceToast, setShouldShowAcceptanceToast] = useState(false);

  const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    innerHandleSubmit(event, setToastMessage, setShouldShowAcceptanceToast)
  }

  return (
    <PageWrapper>
      <div>
        <Flex as="form" direction='column' onSubmit={handleSubmit}> 
          <Button type="submit" width='200px'>
            Create New Issue
          </Button>
          <Flex className='urlsBlock' direction='column'>
            <Flex direction='row'>
              <div>
                Pro URL: 
              </div>
              <TextField label='' name='proUrl' width='700px'/>
            </Flex>
            <Flex>
              <div>
                Con URL: 
              </div>
              <TextField label='' name='conUrl' width='700px'/>
            </Flex>
          </Flex>
        </Flex>
      </div>
      <ToastNotifier
        message={toastMessage}
        shouldShow={shouldShowAcceptanceToast}
        showF={setShouldShowAcceptanceToast} />
    </PageWrapper>
  );
}

export default AdminIssuesPage;
