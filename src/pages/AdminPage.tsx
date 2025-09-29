// AdminPage.tsx

import { useNavigate } from 'react-router-dom'
import PageWrapper from '../components/PageWrapper'
import './AdminPage.css'
import { Button, Flex } from '@aws-amplify/ui-react';
import { SyntheticEvent } from 'react';

function AdminPage() {
  const navigate = useNavigate();

  const handleAdminUrlsButtonClick = (event: SyntheticEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    navigate('/adminUrlSubmissions')
  }

  const handleAdminUncloisteredButtonClick = (event: SyntheticEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    navigate('/adminUncloistered')
  }

  return(

    <PageWrapper>
      <div className='adminPageRootDiv'>
          <h2>General Admin Page</h2>
        <Flex direction="row" justifyContent="center" alignItems="center" gap="1rem" wrap="wrap">
          <Button onClick={handleAdminUrlsButtonClick}>
            Admin URL Submissions
          </Button>
          <Button onClick={handleAdminUncloisteredButtonClick}>
            Admin Uncloistered
          </Button>
        </Flex>
        {/* Add your admin page content here */}
        <Flex direction="column" alignItems="center" gap="1rem"></Flex>
      </div>
    </PageWrapper>
  )
}

export default AdminPage
