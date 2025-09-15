import { Button, CheckboxField, Flex, TextAreaField, TextField } from "@aws-amplify/ui-react";
import PageWrapper from "../components/PageWrapper";
import './AdminIssuesPage.css'
import { SetStateAction, useState } from "react";
import { createIssue } from "../utils/dynamodb_operations";
import { getRandomIntegerInRange } from "../utils/utils";
import ToastNotifier from "../components/ToastNotifier";

// Claim: There is no meaningful sense in which Tyler Robinson is left-wing. To claim that he is is irresponsible and intentionally divisive.
// Priority: 999000
// ProURL: https://www.youtube.com/embed/H3g_kpQHr4M?si=dBR-FdfIJ1NuXryY
// ConURL: https://drive.google.com/file/d/1CFM6-2h3vrdqx4TVkRZWh7RUTNU3bsMb/preview
  
const innerHandleSubmit = async (
  event: React.SyntheticEvent<HTMLFormElement>,
  toastSetter: { (value: SetStateAction<string>): void; (arg0: string): void; },
  toastShower: { (value: SetStateAction<boolean>): void; (arg0: boolean): void; }) => {
  event.preventDefault(); // Prevent default form submission behavior
  // Handle form data here, e.g., send to an API or update state
  const form: HTMLFormElement = event.currentTarget
  const formData = new FormData(form);
  const formJson = Object.fromEntries(formData.entries());
  const submittedClaim = formJson.claim;
  const convertedClaim = submittedClaim.toString();
  if (convertedClaim.length === 0) {
    toastSetter('Sorry! You need to fill in the "Claim:" field');
    toastShower(true);
    return;
  }
  const submittedPriority = formJson.priority;
  const convertedPriority = submittedPriority.toString();
  const priority = convertedPriority ? Number(convertedPriority) : getRandomIntegerInRange(1, 1000000);
  console.log(`priority: ${priority}`);
  const submittedProUrl = formJson.proUrl;
  const convertedProUrl = submittedProUrl.toString();
  const submittedConUrl = formJson.conUrl;
  const convertedConUrl = submittedConUrl.toString();
  if (convertedConUrl.length === 0 && convertedProUrl.length ===0) {
    toastSetter('Sorry! You need to fill in at least one URL');
    toastShower(true);
    return;
  }
  const submittedProIsPdf = formJson.proIsPdf;
  const convertedProIsPdf = submittedProIsPdf.toString();
  const submittedConIsPdf = formJson.conIsPdf;
  const convertedConIsPdf = submittedConIsPdf.toString();
  const proIsPdf = convertedProIsPdf === 'yes';
  const conIsPdf = convertedConIsPdf === 'yes';
    
  /*
    priority: number,
    claim: string,
    proUrl: string,
    conUrl: string,
    proIsPdf: boolean,
    conIsPdf: boolean,
    proAuthorId: string,
    conAuthorId: string,
    makeAvailable: boolean,
  */
  await createIssue(
    priority,
    convertedClaim,
    convertedProUrl,
    convertedConUrl,
    proIsPdf,
    conIsPdf,
    'truthLover@example.com',
    'denier@example.com',
    false, // makeAvailable.  We'll set this later.
  );
  toastSetter('Your issue has been received');
  toastShower(true);
};

function AdminIssuesPage() {
  const [toastMessage, setToastMessage] = useState('Sorry! You need to fill in at least one URL');
  const [shouldShowAcceptanceToast, setShouldShowAcceptanceToast] = useState(false);

  const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    innerHandleSubmit(event, setToastMessage, setShouldShowAcceptanceToast)
  }

  return (
    <PageWrapper>
      <div className='formRoot'>
        <Flex as="form" direction='column' onSubmit={handleSubmit}>
          <Flex className='urlsBlock' direction='column'>
            <Flex direction='row'>
              <div className="textFieldLabel">
                Claim: 
              </div>
              <TextAreaField label='' name='claim' cols={40} rows={4}/>
              <div className="textFieldLabel">
                Priority:
              </div>
              <TextField label='' name='priority' width='140px'/>
            </Flex>
            <Flex direction='row'>
              <div className="textFieldLabel">
                Pro URL: 
              </div>
              <TextField label='' name='proUrl' width='800px'/>
              <CheckboxField
                label="isPdf"
                name="proIsPdf"
              />
            </Flex>
            <Flex>
              <div className="textFieldLabel">
                Con URL: 
              </div>
              <TextField label='' name='conUrl' width='800px'/>
              <CheckboxField
                label="isPdf"
                name="conIsPdf"
              />
            </Flex>
          </Flex>
          <Button type="submit" width='200px'>
            Create New Issue
          </Button>
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
