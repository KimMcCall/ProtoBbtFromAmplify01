import { Flex } from "@aws-amplify/ui-react";
import { MdStar, MdStarBorder, MdLabelImportantOutline, MdLabelImportant } from 'react-icons/md';
import PageWrapper from "../components/PageWrapper";
import './AdminSubmissions.css';
import { useState } from "react";



const fakeSubmissions = [
  {
    id: 'lksdfajpaij',
    isRead: false,
    isInteresting: false,
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
    isInteresting: false,
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
    isInteresting: false,
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
    isInteresting: false,
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
    isInteresting: false,
    isStarred: false,
    isArchived: true,
    isBanned: false,
    isTrashed: true,
    sender: 'person02@example.com',
    title: 'A heartbreaking work of whatever',
    content: 'Content of submision #5',
  },
];


type TilePropType = {
  id: string
  isRead: boolean
  isInteresting: boolean
  isStarred: boolean
  sender: string,
  title: string
  content: string
}

function GMailTile(props: TilePropType) {
  const {id, isRead, isInteresting, isStarred, sender, title, content} = props;

  return (
    <div key={id}>
      <Flex direction="row" gap="8px">
        { isStarred ? (<MdStar />) : ( <MdStarBorder />)}
        { isInteresting ? (<MdLabelImportant />) : ( <MdLabelImportantOutline />)}
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
  setChosen: any
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

const filterSubmissionsForCategory = (category: string) => {
  if (category === "inbox") {
    const filtered = fakeSubmissions.filter((sub) => !sub.isArchived && !sub.isBanned && !sub.isTrashed);
    return filtered;
  } else if (category === 'starred') {
    const filtered = fakeSubmissions.filter((sub) => sub.isStarred && !sub.isBanned && !sub.isTrashed);
    return filtered;
  } else if (category === 'important') {
    const filtered = fakeSubmissions.filter((sub) => sub.isInteresting && !sub.isBanned && !sub.isTrashed);
    return filtered;
  } else if (category === 'archived') {
    const filtered = fakeSubmissions.filter((sub) => sub.isArchived && !sub.isBanned && !sub.isTrashed);
    return filtered;
  } else if (category === 'banned') {
    const filtered = fakeSubmissions.filter((sub) => sub.isBanned);
    return filtered;
  } else if (category === 'trash') {
    const filtered = fakeSubmissions.filter((sub) => sub.isTrashed);
    return filtered;
  }
};

function AdminSubmissionsPage() {
  const [chosenCategory, setChosenCategory] = useState('inbox');

  console.log(`in AdminSubmissionsPage showing with chosenCategory: '${chosenCategory}'`)
  const submissionsToShow = filterSubmissionsForCategory(chosenCategory) || [];

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
                id={sub.id}
                isRead={sub.isRead}
                isInteresting={sub.isInteresting}
                isStarred={sub.isStarred}
                sender={sub.sender}
                title={sub.title}
                content={sub.content}
              />
            ))}
            </Flex>
          </div>
        </Flex>
      </div>
    </PageWrapper>
  );
}

export default AdminSubmissionsPage;
