// AdminPage.tsx

import { useNavigate } from 'react-router-dom'
import PageWrapper from '../components/PageWrapper'
import './AdminPage.css'
import { Button, Flex } from '@aws-amplify/ui-react';
import { SyntheticEvent } from 'react';
import { useAppSelector } from '../app/hooks';
import { selectCurrentUserIsAdmin } from '../features/userInfo/userInfoSlice';

function AdminPage() {
  const navigate = useNavigate();
  const isAdmin = useAppSelector(selectCurrentUserIsAdmin); // Replace with actual admin check logic

  if (!isAdmin) {
    return (
      <PageWrapper>
        <div className='adminPageRootDiv'>
          <h2>Access Denied</h2>
          <p>You do not have permission to view this page.</p>
        </div>
      </PageWrapper>
    );
  }
  
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
          <Button onClick={handleAdminUncloisteredButtonClick}>
            Admin Uncloistered
          </Button>
          <Button onClick={handleAdminUrlsButtonClick}>
            Admin URL Submissions
          </Button>
        </Flex>
        {/* Add your admin page content here */}
        <Flex direction="column" alignItems="center" gap="1rem"></Flex>
      </div>
    </PageWrapper>
  )
}

export default AdminPage
