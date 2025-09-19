// AdminUsers.tsx

import { Button, CheckboxField, Flex, SearchField } from "@aws-amplify/ui-react";
import PageWrapper from "../components/PageWrapper";
import './AdminUsersPage.css'
import { ChangeEvent, SyntheticEvent, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { selectAllUsers, selectCurrentUserId, selectDesgnatedUser, setAllUsers, setDesignatedUserId, setUserIsAdmin, setUserIsBanned, SingleUserInfoType, UserBooleanPropertySettinPairType } from "../features/userInfo/userInfoSlice";
import { dbClient } from "../main";

interface UserTileProps {
  userId: string
  email: string
  name: string
  checked: boolean
  isBanned: boolean
  isAdmin: boolean
  onSelect: (id: string, b: boolean) => void
}

function UserTile(props: UserTileProps) {
  const { userId, email, name, checked,  isBanned, isAdmin, onSelect } = props;
  const [isChecked, setIsChecked] = useState(checked);

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newState = event.target.checked;
    setIsChecked(newState); // Update the state when the checkbox changes
    onSelect(userId, newState);
  }

  return(
    <div key={userId} className="userAdminTileDiv">
      <Flex className="UserTileFlex" direction="row">
        <CheckboxField className="userTileCheckbox" label="" name="pointlessName" checked={isChecked} onChange={handleCheckboxChange}/>
        <div className={isAdmin ? "adminUserTileEmailDiv" : isBanned ? "bannedUserTileEmailDiv" : "normalUserTileEmailDiv"}>
          {email}
        </div>
        <div className={isAdmin ? "adminUserTileNameDiv" : isBanned ? "bannedUserTileNameDiv" : "normalUserTileNameDiv"}>
          {name}
        </div>
      </Flex>
    </div>
  );
}

function AdminUsersPage() {
  const [searchBarText, setSearchBarText] = useState('');
  // const [adminOnlyIsChecked, setAdminOnlyIsChecked] = useState(false);
  const emptyUserArray: SingleUserInfoType[] = [];
  const [filteredUsers, setFilteredUsers] = useState(emptyUserArray);
  // const [checkedUserId, setCheckedUserId] = useState("");
  
  const dispatch = useAppDispatch();

  let designatedUserId = useAppSelector(selectCurrentUserId); // just to have something reasonable
  console.log(`Initialized designatedUserId as ${designatedUserId}`);
  let designatedUser = useAppSelector(selectDesgnatedUser); // currentUser, which is SuperAdmin
  
    useEffect(() => {
      console.log('calling list()');
      dbClient.models.RegisteredUser.list().then(
        (result) => { 
          // @ts-expect-error Maybe some fields are missing, but I think it'll be alright
          const allUsers = sortByEmail(result.data);
          dispatch(setAllUsers(allUsers));
          setFilteredUsers(allUsers);
          enableButtons(false);
          filterString = searchBarText;
        }
      );
    }, [dispatch]);

  const handleSearchBarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newText = event.target.value;
    console.log(`calling setSearchBarText('${newText}')`)
    setSearchBarTextAndFilterString(newText);
    runSearch();
  }

  const setSearchBarTextAndFilterString = (text: string) => {
    setSearchBarText(text);
    filterString = text;
  }

  const handleSearchBarClear = () => {
    setSearchBarTextAndFilterString('');
    runSearch();
  }

  const toggleBanned = async () => {
    if (designatedUser.id === '0e5de473-b488-4ede-a3da-c1b79e7a9eb0') {
      console.log('Have Kim as desgnatedUser, so aborting update()');
      return;
    }
    const oldState = designatedUser.isBanned;
    const newState = !oldState;
    const myUpdate =  {
      id: designatedUserId,
      isBanned: newState,
    };
    console.log(`setting isBanned: ${newState}`);
    await dbClient.models.RegisteredUser.update(myUpdate).then(
      (response) => {
        console.log(' back from update()');
        // @ts-expect-error It will not be undefined if the .update() succeeded!
        const modifiedUser: SingleUserInfoType = response.data;
        const { id, isBanned } = modifiedUser;
        console.log(` new value of isBanned: ${isBanned}`)
        dispatch(setDesignatedUserId(id));
        const pair: UserBooleanPropertySettinPairType = { userId: id, value: isBanned}
        dispatch(setUserIsBanned(pair));

        setButtonTextsForUser(modifiedUser);
      }
    );
  }

  const toggleAdmin = async () => {
    if (designatedUser.id === '0e5de473-b488-4ede-a3da-c1b79e7a9eb0') {
      console.log('Have Kim as desgnatedUser, so aborting update()');
      return;
    }
    const oldState = designatedUser.isAdmin;
    const newState = !oldState;
    const myUpdate =  {
      id: designatedUserId,
      isAdmin: newState,
    };
    console.log(`setting isAdmin: ${newState}`);
    await dbClient.models.RegisteredUser.update(myUpdate).then(
      (response) => {
        console.log(' back from update()');
        // @ts-expect-error It will not be undefined if the .update() succeeded!
        const modifiedUser: SingleUserInfoType = response.data;
        const { id, isAdmin } = modifiedUser;
        console.log(` new value of isAdmin: ${isAdmin}`)
        dispatch(setDesignatedUserId(id));
        const pair: UserBooleanPropertySettinPairType = { userId: id, value: isAdmin}
        dispatch(setUserIsAdmin(pair));
        setButtonTextsForUser(modifiedUser);
      }
    );
  }

  const handleTileCheckboxClicked = (userId: string, chosen: boolean) => {
    console.log(`checkbox for user ${userId} was ${chosen ? '' : 'un-'}chosen`);
    if (chosen) {
      // setCheckedUserId(userId);
      console.log(`setting designatedUserId to ${userId}`);
      designatedUserId = userId;
      // @ts-expect-error We have to find a match!
      designatedUser =  getUserWithId(userId);
      console.log(`set designatedUser to user with email ${designatedUser.canonicalEmail}`)
      dispatch(setDesignatedUserId(userId));
      turnOffOtherCheckboxes(userId);
      setButtonTextsForUser(designatedUser);
    }
    enableButtons(chosen);
  }

  const getUserWithId = (userId:  string) => {
    const foundUser = allUsers.find((user) => user.id === userId);
    return foundUser;
  }

  const setButtonTextsForUser = (user: SingleUserInfoType) => {
    const isBanned = user.isBanned;
    const isAdmin = user.isAdmin;
    if (window && window.document) {
      const d = window.document;
      // @ts-expect-error I know it's a button!
      const banButton: HTMLButtonElement = d.getElementById("banButton");
      banButton.textContent = isBanned ? 'Unban User' : 'BanUser';
      // @ts-expect-error I know it's a button!
      const adminButton: HTMLButtonElement = d.getElementById("adminButton");
      adminButton.textContent = isAdmin ? 'Unset as Admin' : 'Set as Admin';
    } else {
      console.log('couldn\'t find document')
    }
  }

  const enableButtons = (enable: boolean) => {
    if (window && window.document) {
      const d = window.document;
      // @ts-expect-error I know it's a button!
      const b1: HTMLButtonElement = d.getElementById("banButton");
      b1.disabled = !enable;
      // @ts-expect-error I know it's a button!
      const b2: HTMLButtonElement = d.getElementById("adminButton");
      b2.disabled = !enable;
      // @ts-expect-error I know it's a button!
      const b3: HTMLButtonElement = d.getElementById("emailButton");
      b3.disabled = !enable;
    } else {
      console.log('couldn\'t find document')
    }
  }

  const turnOffOtherCheckboxes = (idOfUserToLeaveChecked: string) => {
    console.log(`should now turn off all checkboxes besides ${idOfUserToLeaveChecked}`);
    /*
    if (window && window.document) {
      const w = window;
      const d = w.document;
      const tileBoxes: HTMLCollectionOf<Element> = d.getElementsByClassName("userTileCheckbox");
      const nBoxes = tileBoxes.length;
      console.log(`# boxes: ${nBoxes}`)
    }
    */
  }

  const filterUsers = () => {
    const haveFilterString = filterString.length > 0;
    console.log(`In filterUsers(); #unfiltered: ${allUsers.length}; filterString: '${filterString}'; adminOnlly: ${adminsOnly}`);
    if (haveFilterString && adminsOnly) {
      return allUsers.filter((user) => {
        if (!user.isAdmin) {
          return false;
        }
        const email = user.canonicalEmail;
        const name = user.name;
        const haveEmailMatch = email && email.toLowerCase().includes(filterString.toLowerCase());
        const haveNameMatch = name && name.toLowerCase().includes(filterString.toLowerCase());
        return haveEmailMatch || haveNameMatch;
      })
    } else if (haveFilterString && !adminsOnly) {
      return allUsers.filter((user) => {
        const email = user.canonicalEmail;
        const name = user.name;
        const haveEmailMatch = email && email.toLowerCase().includes(filterString.toLowerCase());
        const haveNameMatch = name && name.toLowerCase().includes(filterString.toLowerCase());
        return haveEmailMatch || haveNameMatch;
      })
    } else if (!haveFilterString && adminsOnly) {
      return allUsers.filter((user) => user.isAdmin)
    } else /* (!haveFilterString && !adminsOnly) */ {
      console.log("skipping search because filterString is empty string and we're not asking for Admins Only")
      return allUsers;
    }
  }

  const sortByEmail = (users: SingleUserInfoType[]) => {
    let clonedList: SingleUserInfoType[] = [];
    for (let i = 0; i < users.length; i++) {
      clonedList = clonedList.concat(users[i]);
    }
    clonedList.sort((uA, uB) => uA.canonicalEmail.localeCompare(uB.canonicalEmail))
    return clonedList;
  }

  const allUsers = sortByEmail(useAppSelector(selectAllUsers));
  let filterString = '';
  let adminsOnly = false;

  const runSearch = () => {
    setFilteredUsers(filterUsers());
  }

  const handleBanButtonClick = (event: SyntheticEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    console.log('should now toggle the isBanned field of the user with id: ' + designatedUserId);
    toggleBanned();
  }

  const handleAdminButtonClick = (event: SyntheticEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    console.log('should now toggle the isAdmin field of the object');
    toggleAdmin();
  }

  const handleEmailButtonClick = (event: SyntheticEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    console.log('should now send an Email to the user');
  }

  const handleAdminOnlyCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newState = event.target.checked;
    console.log(`new checkbox state: ${newState}`);
    // setAdminOnlyIsChecked(newState); // Update the state when the checkbox changes 
    adminsOnly = newState;
    runSearch();
  }

  return (
    <PageWrapper>
      <div className="userAdminPageRoot">
        <Flex className="userAdminPageFlex" direction="column">
          <Flex className="userAdminTopRow" direction="row" gap="40px">
            <div className="userAdminSearchBarHolder">
              <SearchField
                className="searchInput"
                label="Search"
                value={searchBarText}
                onChange={handleSearchBarChange}
                onClear={handleSearchBarClear}
              />
            </div>
            <div className="adminOnlyHolderDiv">
              <CheckboxField label="Admins Only" name="adminsOnly" onChange={handleAdminOnlyCheckboxChange} />
            </div>
          </Flex>
          <Flex className="listAndButtonsFlex" direction="row">
            <div className="userAdminListHolderDiv">
              <div className="userAdminListDiv">
                {
                filteredUsers.map(user => (
                  <UserTile key={user.id}
                    userId={user.id}
                    email={user.canonicalEmail}
                    name={user.name}
                    checked={false}
                    isBanned={user.isBanned}
                    isAdmin={user.isAdmin || user.isSuperAdmin}
                    onSelect={handleTileCheckboxClicked}
                  />
              ))}
              </div>
            </div>
            <div className="userAdminButtonHolderDiv">
              <Flex className="userAdminButtonHolderFlex" direction="column">
                <Button id="banButton" className="userAdminActionButton" onClick={handleBanButtonClick} >
                  Ban User
                </Button>
                <Button id="adminButton" className="userAdminActionButton" onClick={handleAdminButtonClick} >
                  Set as Admin
                </Button>
                <Button id="emailButton" className="userAdminActionButton" onClick={handleEmailButtonClick}  >
                  Send Email
                </Button>
              </Flex>
            </div>
          </Flex>
        </Flex>
      </div>
    </PageWrapper>
  );
}

export default AdminUsersPage;
