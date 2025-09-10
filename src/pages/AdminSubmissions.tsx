import { Flex } from "@aws-amplify/ui-react";
import { MdStar, MdStarBorder, MdLabelImportantOutline, MdLabelImportant } from 'react-icons/md';
import PageWrapper from "../components/PageWrapper";
import './AdminSubmissions.css';



const fakeSubmissions = [
  {
    id: 'lksdfajpaij',
    status: 'inbox',
    isRead: false,
    isInteresting: false,
    isStarred: false,
    rating: 5,
    sender: 'person01@example.com',
    title: 'Title IX',
    content: 'Content of submision #1',
    date: '',
  },
  {
    id: 'peroifhnfn',
    status: 'inbox',
    isRead: true,
    isInteresting: false,
    isStarred: true,
    rating: 8,
    sender: 'person02@example.com',
    title: 'A heartbreaking work of whatever',
    content: 'Content of submision #2',
  },
  {
    id: '7688yuighjnrkjwle',
    status: 'banned',
    isRead: true,
    isInteresting: false,
    isStarred: false,
    rating: 2,
    sender: 'person02@example.com',
    title: 'A heartbreaking work of whatever',
    content: 'Content of submision #3',
  },
  {
    id: 'ert0poflsjdkhck',
    status: 'archived',
    isRead: false,
    isInteresting: false,
    isStarred: false,
    rating: 2,
    sender: 'person02@example.com',
    title: 'A heartbreaking work of whatever',
    content: 'Content of submision #4',
  },
  {
    id: 'lkloiew475wro3r4u8oi',
    status: 'archived',
    isRead: false,
    isInteresting: false,
    isStarred: false,
    rating: 3,
    sender: 'person02@example.com',
    title: 'A heartbreaking work of whatever',
    content: 'Content of submision #5',
  },
];


type TilePropType = {
  id: string
  status: string
  isRead: boolean
  isInteresting: boolean
  isStarred: boolean
  rating: number,
  sender: string,
  title: string
  content: string
}

function GMailTile(props: TilePropType) {
  const {id, /*status,*/ isRead, isInteresting, isStarred, /*rating,*/ sender, title, content} = props;

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

function AdminSubmissionsPage() {
  return (
    <PageWrapper>
      <div>
        <Flex direction="row">
          <div className='categoryBar'>
            selectable list of categories
          </div>
          <div className='listDiv'>
            <Flex
              direction="column"
              justifyContent="space-between"
              alignItems="left"
              wrap="nowrap"
              
            >
              {
              fakeSubmissions.map(sub => (
              <GMailTile key={sub.id}
                id={sub.id}
                status={sub.status}
                isRead={sub.isRead}
                isInteresting={sub.isInteresting}
                isStarred={sub.isStarred}
                rating={sub.rating}
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
