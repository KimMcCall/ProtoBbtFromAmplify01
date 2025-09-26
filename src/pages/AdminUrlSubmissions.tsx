// AdminUrlSubmissions.txt

import { Flex, TextField } from '@aws-amplify/ui-react';
import PageWrapper from '../components/PageWrapper'
import './AdminUrlSubmissions.css'
import { ChangeEvent, useState } from 'react';

function AdminSubmissionsPage() {
  const [filterText, setFilterText] = useState('');

  const handleFilterTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    setFilterText(event.target.value)
  }

  return (
    <PageWrapper>
      <div className='adminSubmissionsPageRoot'>
        <Flex direction='column'>
          <h1>Administer Submitted URLs</h1>
          <Flex direction='row'>
            <Flex direction='column'>
              <TextField
                label='Filter'
                value={filterText}
                onChange={handleFilterTextChange}
                />
                <div className='urlSubmissionListDiv'>

                </div>
            </Flex>

          </Flex>
        </Flex>
      </div>
    </PageWrapper>
  )
}

export default AdminSubmissionsPage;
