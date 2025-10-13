import { useEffect, useState } from "react";
import { Button, Flex } from "@aws-amplify/ui-react";
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
import './AdminSubmissionsPage.css';
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

type SingleSubmissionUiPropType = {
  submission: SubmissionWithDateAndSenderType
}

type TilePropType = {
  submission: SubmissionWithDateAndSenderType
  singleUiSetter: (arg: boolean) => void
  submissionSetter: (arg: SubmissionWithDateAndSenderType) => void
}

function GMailTile(props: TilePropType) {
  const { submission, singleUiSetter, submissionSetter } = props;
  const { id, sender, title, content, isRead, isImportant, isStarred } = submission;

  const [starred, setStarred] = useState(isStarred);
  const [important, setImportant] = useState(isImportant);

  const toggleStarred = (event: { stopPropagation: () => void; }) => {
    event.stopPropagation();
    const newState = !starred;
    const myUpdate =  {
      id: id,
      isStarred: newState,
    };
    setStarred(newState);
    console.log(`DBM: calling Submission.update() at ${Date.now() % 10000}`);
    dbClient.models.Submission.update(myUpdate);
  };

  const toggleImportant = (event: { stopPropagation: () => void; }) => {
    event.stopPropagation();
    const newState = !important;
    const myUpdate =  {
      id: id,
      isImportant: newState,
    };
    setImportant(newState);
    console.log(`DBM: calling Submission.update() at ${Date.now() % 10000}`);
    dbClient.models.Submission.update(myUpdate);
  };

  const showSingleSibmissionUI = (event: { stopPropagation: () => void; }) => {
    event.stopPropagation();
    submissionSetter(submission);
    singleUiSetter(true);
    if (!submission.isRead) {
      submission.isRead = true;
      const myUpdate =  {
        id: id,
        isRead: true,
      };
      console.log(`DBM: calling Submission.update() at ${Date.now() % 10000}`);
      dbClient.models.Submission.update(myUpdate);
    }
  };

  const contentDivStyle = isRead ? "aspTileContentRead" : "aspTileContentUnread";

  return (
    <div key={id} onClick={showSingleSibmissionUI}>
      <Flex className='tileDiv' direction="row" gap="8px">
        { starred ?
          (<MdStar color='#ffbb00eb' size='22px' onClick={toggleStarred} />) :
          (<MdStarBorder size='22px' onClick={toggleStarred} />)}
        { important ?
          (<MdLabelImportant color='#ffbb00eb' size='22px' onClick={toggleImportant} />) :
          (<MdLabelImportantOutline size='22px' onClick={toggleImportant} />)}
        <div className={contentDivStyle}>
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

type CategoryButtonPropType = {
  label: string
  name: string
  chosen: string
  setChosen: (str: string) => void 
  showSingle: (b: boolean) => void 
}

function CategoryButton (props: CategoryButtonPropType) {
  
  const { label, name, chosen, setChosen, showSingle} = props;
  const isSelected = chosen === name;

  const handleButtonClick = (event: { stopPropagation: () => void; }) => {
    event.stopPropagation();
    setChosen(name);
    showSingle(false);
  }

  const clName = isSelected ? 'categoryButtonSelected' : 'categoryButton';

  return (
    <div className={clName} onClick={handleButtonClick}>
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

export type SubmissionWithDateType = {
    id: string;
    userId: string;
    // sender: string;
    category: string;
    title: string | null;
    content: string;
    createdAt: string;
    isRead: boolean;
    isImportant: boolean;
    isStarred: boolean;
    isArchived: boolean;
    isBanned: boolean;
    isTrashed: boolean;
}

type SubmissionWithDateAndSenderType = {
    id: string;
    userId: string | null;
    sender: string;
    category: string;
    title: string | null;
    content: string;
    createdAt: string;
    isRead: boolean;
    isImportant: boolean;
    isStarred: boolean;
    isArchived: boolean;
    isBanned: boolean;
    isTrashed: boolean;
}

const emptySubmissions: SubmissionWithDateAndSenderType[] = [];
const protoSubmission: SubmissionWithDateAndSenderType = {
    id: '',
    userId: '',
    sender: '',
    category: '',
    title: '',
    content: '',
    createdAt: '',
    isRead: false,
    isImportant: false,
    isStarred: false,
    isArchived: false,
    isBanned: false,
    isTrashed: false,
};

function SingleSubmissionUI(props: SingleSubmissionUiPropType) {
  const { submission  } = props;
  const [isStarred, setIsStarred] = useState(submission.isStarred);
  const [isImportant, setIsImportant] = useState(submission.isImportant);
  const [isArchived, setIsArchived] = useState(submission.isArchived);
  const [isBanned, setIsBanned] = useState(submission.isBanned);
  const [isTrashed, setIsTrashed] = useState(submission.isTrashed);

  const toggleStarred = (event: { stopPropagation: () => void; }) => {
    event.stopPropagation();
    const newState = !isStarred;
    const myUpdate =  {
      id: submission.id,
      isStarred: newState,
    };
    setIsStarred(newState);
    submission.isStarred = newState;
    console.log(`DBM: calling Submission.update() at ${Date.now() % 10000}`);
    dbClient.models.Submission.update(myUpdate);
  }

  const toggleImportant = (event: { stopPropagation: () => void; }) => {
    event.stopPropagation();
    const newState = !isImportant;
    const myUpdate =  {
      id: submission.id,
      isImportant: newState,
    };
    setIsImportant(newState);
    submission.isImportant = newState;
    console.log(`DBM: calling Submission.update() at ${Date.now() % 10000}`);
    dbClient.models.Submission.update(myUpdate);
  }

  const toggleArchived = (event: { stopPropagation: () => void; }) => {
    event.stopPropagation();
    const newState = !isArchived;
    const myUpdate =  {
      id: submission.id,
      isArchived: newState,
    };
    setIsArchived(newState);
    submission.isArchived = newState;
    console.log(`DBM: calling Submission.update() at ${Date.now() % 10000}`);
    dbClient.models.Submission.update(myUpdate);
  }

  const toggleBanned = (event: { stopPropagation: () => void; }) => {
    event.stopPropagation();
    const newState = !isBanned;
    const myUpdate =  {
      id: submission.id,
      isBanned: newState,
    };
    setIsBanned(newState);
    submission.isBanned = newState;
    console.log(`DBM: calling Submission.update() at ${Date.now() % 10000}`);
    dbClient.models.Submission.update(myUpdate);
  }

  const toggleTrashed = (event: { stopPropagation: () => void; }) => {
    event.stopPropagation();
    const newState = !isTrashed;
    const myUpdate =  {
      id: submission.id,
      isTrashed: newState,
    };
    setIsTrashed(newState);
    submission.isTrashed = newState;
    console.log(`DBM: calling Submission.update() at ${Date.now() % 10000}`);
    dbClient.models.Submission.update(myUpdate);
  }

  return (
    <Flex className='singleMessageUI' direction='row'>
      <Flex className='singleMessageDataFlex' direction='column'>
        <div className='singleMsgTitleDiv' >
          {submission.title}
        </div>
        <div className='singleMsgSenderDiv' >
          From: {submission.sender}
        </div>
        <div className='singleMsgContenteDiv' >
          {submission.content}
        </div>
      </Flex>
      <Flex className='singleSubmissionButtonFlex' direction='column'>
        <Button className='singleMsgButtonseDiv' onClick={toggleStarred} >
          { submission.isStarred  ? ( 'Unstar' ) : ( 'Star' )}
        </Button>
        <Button className='singleMsgButtonseDiv' onClick={toggleImportant}>
          { submission.isImportant  ? ( 'Unmark Important' ) : ( 'Mark Important' )}
        </Button>
        <Button className='singleMsgButtonseDiv' onClick={toggleArchived}>
          { submission.isArchived  ? ( 'Unarchive' ) : ( 'Archive' )}
        </Button>
        <Button className='singleMsgButtonseDiv' onClick={toggleBanned}>
          { submission.isBanned  ? ( 'Unban' ) : ( 'Ban' )}
        </Button>
        <Button className='singleMsgButtonseDiv' onClick={toggleTrashed}>
          { submission.isTrashed  ? ( 'Untrash' ) : ( 'Trash' )}
        </Button>
      </Flex>
    </Flex>
  );
}

function AdminSubmissionsPage() {
  const [chosenCategory, setChosenCategory] = useState('inbox');
  const [submissionsToShow, setSubmissionsToShow] = useState(emptySubmissions);
  const [singleSubmissionToShow, setSingleSubmissionToShow] = useState(protoSubmission);
  const [shouldShowSingleSubmission, setShouldShowSingleSubmission] = useState(false);

  useEffect(() => {
      const fetchSubmissions = async () => {
        console.log(`DBM: calling Submission.list() at ${Date.now() % 10000}`);
        await dbClient.models.Submission.list().then(
        (submissionsResponse) => {
          const submissions: SubmissionWithDateType[] = submissionsResponse.data;
          const filteredSubmissions = filterSubmissionsForCategory(submissions, chosenCategory);
          // now build the userId2EmailMap
          console.log(`DBM: calling RegisteredUser.list() at ${Date.now() % 10000}`);
          dbClient.models.RegisteredUser.list().then(
            (usersResponse) => {
              const allUsers = usersResponse.data;
              const userId2EmailMap = new Map();
              allUsers.forEach((user) => {userId2EmailMap.set(user.id, user.canonicalEmail)});
              // and use the map to populate all the submissions records with values for 'sender'
              const submissionWithSenders: SubmissionWithDateAndSenderType[] = filteredSubmissions.map((sub) => {
                const senderId = sub.userId;
                const senderEmail = userId2EmailMap.get(senderId);
                const senderObj = { sender: senderEmail };
                const submissionWithSender = {...sub, ...senderObj};
                return submissionWithSender;
              });
              setSubmissionsToShow(submissionWithSenders);
            }
          );
        }
      )
      };
  
      fetchSubmissions(); // Call the async function
  }, [chosenCategory]
);

// GATOR: Find a way not to have to do these DB queries every time the user switches categories

  return (
    <PageWrapper>
      <div>
        <Flex direction="row" gap="4px">
          <div className='categoryBar'>
            <CategoryButton label='Inbox' name='inbox' chosen={chosenCategory} setChosen={setChosenCategory} showSingle={setShouldShowSingleSubmission} />
            <CategoryButton label='Starred' name='starred' chosen={chosenCategory} setChosen={setChosenCategory} showSingle={setShouldShowSingleSubmission} />
            <CategoryButton label='Important' name='important' chosen={chosenCategory} setChosen={setChosenCategory} showSingle={setShouldShowSingleSubmission} />
            <CategoryButton label='Archived' name='archived' chosen={chosenCategory} setChosen={setChosenCategory} showSingle={setShouldShowSingleSubmission} />
            <CategoryButton label='Banned' name='banned' chosen={chosenCategory} setChosen={setChosenCategory} showSingle={setShouldShowSingleSubmission} />
            <CategoryButton label='Trash' name='trash' chosen={chosenCategory} setChosen={setChosenCategory} showSingle={setShouldShowSingleSubmission} />
            <CategoryButton label='All' name='all' chosen={chosenCategory} setChosen={setChosenCategory} showSingle={setShouldShowSingleSubmission} />
          </div>
          <div>
            { shouldShowSingleSubmission
            ?
            (
              <SingleSubmissionUI submission={singleSubmissionToShow} />
            )
            :
            (
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
                      singleUiSetter={setShouldShowSingleSubmission}
                      submissionSetter={setSingleSubmissionToShow}
                    />
                ))}
                </Flex>
              </div>
            )
            }
            
          </div>
        </Flex>
      </div>
    </PageWrapper>
  );
}

export default AdminSubmissionsPage;
