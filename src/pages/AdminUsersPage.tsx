// AdminUsers.tsx

import { Button, CheckboxField, Flex, SearchField } from "@aws-amplify/ui-react";
import PageWrapper from "../components/PageWrapper";
import './AdminUsersPage.css'
import { ChangeEvent, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { selectAllUsers, setAllUsers, SingleUserInfoType } from "../features/userInfo/userInfoSlice";
import { dbClient } from "../main";

interface UserTileProps {
  userId: string
  email: string
  name: string
  isBanned: boolean
  isAdmin: boolean
  onSelect: (id: string, b: boolean) => void
}

function UserTile(props: UserTileProps) {
  const { userId, email, name, isBanned, isAdmin, onSelect } = props;
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newState = event.target.checked;
    console.log(`new button state: ${newState}`)
    setIsChecked(newState); // Update the state when the checkbox changes
    onSelect(userId, newState);
  }
  return(
    <div key={userId} className="userAdminTileDiv">
      <Flex className="UserTileFlex" direction="row">
        <CheckboxField label="" name="pointlessName" checked={isChecked} onChange={handleCheckboxChange}/>
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
  const emptyUserArray: SingleUserInfoType[] = [];
  const [filteredUsers, setFilteredUsers] = useState(emptyUserArray);
  
  const dispatch = useAppDispatch();
  
    useEffect(() => {
      dbClient.models.RegisteredUser.list().then(
        (result) => {
          const allUsers = result.data;
          console.log(`# allUsers: ${allUsers.length}`)
          // @ts-expect-error Maybe some fields are missing, but I think it'll be alright
          dispatch(setAllUsers(allUsers));
          // @ts-expect-error Maybe some fields are missing, but I think it'll be alright
          setFilteredUsers(allUsers);
        }
      );
    }, [dispatch]);

  const handleSearchBarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newText = event.target.value;
    console.log(`calling setSearchBarText('${newText}')`)
    setSearchBarTextAndFilterString(newText);
    console.log(` after call to setSearchBarText(), filterString:'${filterString}'`)
    runDelayedSearch();
    console.log(` after runDelayedSearch(), filterString:'${filterString}'`)
  }

  const setSearchBarTextAndFilterString = (text: string) => {
    setSearchBarText(text);
    filterString = text;
  }

  const runDelayedSearch = () => [
    setTimeout(() => {runSearch()}, 1)
  ]

  const handleSearchBarClear = () => {
    setSearchBarTextAndFilterString('');
    runDelayedSearch();
  }

  const handleTileCheckboxChosen = (userId: string, chosen: boolean) => {
    console.log(`checkbox for user ${userId} was ${chosen ? '' : 'un-'}chosen`);
    turnOffOtherCheckboxes(userId);
    enableButtons(chosen);
  }

  const enableButtons = (enable: boolean) => {
    if (window && window.document) {
      const w = window;
      const d = w.document;
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
  }

  const filterUsers = () => {
    console.log(`in filterUsers() for filterString: '${filterString}'`);
    console.log(`In filterUsers(); #unfiltered: ${allUsers.length}; searchText: '${filterString}'`);
    if (filterString.length == 0) {
      console.log("skipping search because filterString is empty string")
      return allUsers;
    }
    return allUsers.filter((user) => {
      const email = user.canonicalEmail;
      const name = user.name;
      console.log(` searching for '${filterString}' in '${email}' or '${name}'`)
      const haveEmailMatch = email && email.includes(filterString);
      const haveNameMatch = name && name.includes(filterString);
      return haveEmailMatch || haveNameMatch;
    })
  }

  const allUsers = useAppSelector(selectAllUsers);
  let filterString = '';

  const runSearch = () => {
    console.log(`in Search handler for filterString: '${filterString}'`);
    setFilteredUsers(filterUsers());
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
              <CheckboxField label="Admins Only" name="adminsOnly" />
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
                    isBanned={user.isBanned}
                    isAdmin={user.isAdmin || user.isSuperAdmin}
                    onSelect={handleTileCheckboxChosen}
                  />
              ))}
              </div>
            </div>
            <div className="userAdminButtonHolderDiv">
              <Flex className="userAdminButtonHolderFlex" direction="column">
                <Button id="banButton" className="userAdminActionButton"  disabled>
                  Ban User
                </Button>
                <Button id="adminButton" className="userAdminActionButton"  disabled>
                  Set as Admin
                </Button>
                <Button id="emailButton" className="userAdminActionButton"  disabled>
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
