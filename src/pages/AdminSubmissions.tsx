import { Flex } from "@aws-amplify/ui-react";
import {
  MdStar,
  MdStarBorder,
  MdLabelImportantOutline,
  MdLabelImportant,
//  MdArchive,
//  MdDelete,
// MdPersonOff,
// MdOutlinePersonOff
} from 'react-icons/md';
import PageWrapper from "../components/PageWrapper";
import './AdminSubmissions.css';
import { useEffect, useState } from "react";
import { dbClient } from "../main";

/*
const fakeSubmissions = [
  {
    id: 'lksdfajpaij',
    isRead: false,
    isImportant: false,
    isStarred: false,
    isArchived: false,
    isBanned: false,
    isTrashed: false,
    sender: 'person01@example.com',
    title: 'Title IX',
    content: 'Content of submision #1',
    date: '',
  },
  {
    id: 'peroifhnfn',
    isRead: true,
    isImportant: false,
    isStarred: true,
    isArchived: false,
    isBanned: false,
    isTrashed: false,
    sender: 'person02@example.com',
    title: 'A heartbreaking work of whatever',
    content: 'Content of submision #2',
  },
  {
    id: '7688yuighjnrkjwle',
    isRead: true,
    isImportant: false,
    isStarred: false,
    isArchived: false,
    isBanned: true,
    isTrashed: false,
    sender: 'person02@example.com',
    title: 'A heartbreaking work of whatever',
    content: 'Content of submision #3',
  },
  {
    id: 'ert0poflsjdkhck',
    isRead: false,
    isImportant: false,
    isStarred: false,
    isArchived: true,
    isBanned: false,
    isTrashed: false,
    sender: 'person02@example.com',
    title: 'A heartbreaking work of whatever',
    content: 'Content of submision #4',
  },
  {
    id: 'lkloiew475wro3r4u8oi',
    isRead: false,
    isImportant: false,
    isStarred: false,
    isArchived: true,
    isBanned: false,
    isTrashed: true,
    sender: 'person02@example.com',
    title: 'A heartbreaking work of whatever',
    content: 'Content of submision #5',
  },
];
*/

type TilePropType = {
  submission: SubmissionWithDateType
  sender: string,
}

function GMailTile(props: TilePropType) {
  const { submission, sender, } = props;
  const { id, isRead, isImportant, isStarred, content } = submission;
  // GATOR: get title from submission
  const title = 'Untitled';

  return (
    <div key={id}>
      <Flex className='tileDiv' direction="row" gap="8px">
        { isStarred ? (<MdStar color='#ffbb00eb' size='22px' onClick={() => {console.log('clicked')}} />) : ( <MdStarBorder size='22px' />)}
        { isImportant ? (<MdLabelImportant color='#ffbb00eb' size='22px' />) : ( <MdLabelImportantOutline size='22px' />)}
        <div style={{ fontWeight: isRead ? 'normal' : 'bold' }}>
          <Flex direction="row" >
            <div className='senderDiv'>{sender}</div>
            <div className='titleDiv'>
              {title}
            </div>
            <div>
              {content}             
            </div>
          </Flex>
        </div>
      </Flex>
    </div>
  );
}

const selectedColor = '#818080ff';

type CategoryButtonPropType = {
  label: string
  name: string
  chosen: string
  setChosen: (str: string) => void 
}

function CategoryButton (props: CategoryButtonPropType) {
  
  const { label, name, chosen, setChosen} = props;
  const isSelected = chosen === name;

  const handleButtonClick = (xyz: string) => {
    console.log(`Should now respond to click on ${xyz} button`);
    setChosen(name);
  }

  // GOOD: style={{ fontWeight: isRead ? 'normal' : 'bold' }}>
  //         <div style={{ backgroundColor: isSelected ? selectedColor : 'white' }}>
  // style={{ backgroundColor: isSelected ? selectedColor : 'white' }}
  // style={{ isSelected ? 'abc' : '' }}>

  const conditionalStyle = {
    backgroundColor: selectedColor,
  };

  return (
    <div className='categoryButton'
        onClick={() => handleButtonClick(name)}
        style={isSelected ? conditionalStyle : {}} >
      {label}
    </div>
  );
}

const filterSubmissionsForCategory = (submissions: SubmissionWithDateType[], category: string) => {
if (category === "inbox") {
    const filtered = submissions.filter((sub) => sub && !sub.isArchived && !sub.isBanned && !sub.isTrashed);
    return filtered;
  } else if (category === 'starred') {
    const filtered = submissions.filter((sub) => sub && sub.isStarred && !sub.isBanned && !sub.isTrashed);
    return filtered;
  } else if (category === 'important') {
    const filtered = submissions.filter((sub) => sub && sub.isImportant && !sub.isBanned && !sub.isTrashed);
    return filtered;
  } else if (category === 'archived') {
    const filtered = submissions.filter((sub) => sub && sub.isArchived && !sub.isBanned && !sub.isTrashed);
    return filtered;
  } else if (category === 'banned') {
    const filtered = submissions.filter((sub) => sub && sub.isBanned);
    return filtered;
  } else if (category === 'trash') {
    const filtered = submissions.filter((sub) => sub && sub.isTrashed);
    return filtered;
  } else if (category === 'all') {
    const filtered = submissions.filter((sub) => sub);
    return filtered;
  } else {
    return emptySubmissions;
  }
  
};

type SubmissionWithDateType = {
    id: string;
    userId: string | null;
    isRead: boolean;
    isImportant: boolean;
    isStarred: boolean;
    isArchived: boolean;
    isBanned: boolean;
    isTrashed: boolean;
    // sender: string;
    // title: string;
    category: string;
    content: string;
    createdAt: string;
}

const emptySubmissions: SubmissionWithDateType[] = [];

function AdminSubmissionsPage() {
  const [chosenCategory, setChosenCategory] = useState('inbox');
  const [submissionsToShow, setSubmissionsToShow] = useState(emptySubmissions);

  useEffect(() => {
      const fetchSubmissions = async () => {
        await dbClient.models.Submission.list().then(
        (response) => {
          const submissions: SubmissionWithDateType[] = response.data;
          const filteredSubmissions = filterSubmissionsForCategory(submissions, chosenCategory);
          setSubmissionsToShow(filteredSubmissions);
        }
      )
      };
  
      fetchSubmissions(); // Call the async function
    console.log('running useEffect')
  }, [chosenCategory]
);

  return (
    <PageWrapper>
      <div>
        <Flex direction="row" gap="4px">
          <div className='categoryBar'>
            <CategoryButton label='Inbox' name='inbox' chosen={chosenCategory} setChosen={setChosenCategory} />
            <CategoryButton label='Starred' name='starred' chosen={chosenCategory} setChosen={setChosenCategory} />
            <CategoryButton label='Important' name='important' chosen={chosenCategory} setChosen={setChosenCategory} />
            <CategoryButton label='Archived' name='archived' chosen={chosenCategory} setChosen={setChosenCategory} />
            <CategoryButton label='Banned' name='banned' chosen={chosenCategory} setChosen={setChosenCategory} />
            <CategoryButton label='Trash' name='trash' chosen={chosenCategory} setChosen={setChosenCategory} />
            <CategoryButton label='All' name='all' chosen={chosenCategory} setChosen={setChosenCategory} />
          </div>
          <div className='listDiv'>
            <Flex
              direction="column"
              justifyContent="space-between"
              alignItems="left"
              wrap="nowrap"
            >
              {
              submissionsToShow.map(sub => (
              <GMailTile key={sub.id}
                submission={sub}
                sender='tempEmail@example.com'
              />
            ))}
            </Flex>
          </div>
        </Flex>
      </div>
    </PageWrapper>
  );
}

// GATOR: eleven lines above, find a real way to get sender (include as part of submission object)
// That was synthesized by client-side JOIN, constituting an object of a new type

export default AdminSubmissionsPage;
