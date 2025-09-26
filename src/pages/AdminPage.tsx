// AdminPage.tsx

import { useNavigate } from 'react-router-dom'
import PageWrapper from '../components/PageWrapper'
import './AdminPage.css'
import { Button } from '@aws-amplify/ui-react';
import { SyntheticEvent } from 'react';

function AdminPage() {
  const navigate = useNavigate();

  const handleAdminUrlsButtonClick = (event: SyntheticEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    navigate('/adminUrlSubmissions')
  }

  return(

    <PageWrapper>
      <div className='adminPageRootDiv'>
        <Button onClick={handleAdminUrlsButtonClick}>
          Admin URL Submissions
        </Button>
      </div>
    </PageWrapper>
  )
}

export default AdminPage
