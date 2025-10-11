import { useNavigate } from 'react-router-dom';
import { Flex } from '@aws-amplify/ui-react';
import { useAppSelector } from "../app/hooks";
import { selectCurrentUserIsAdmin, selectCurrentUserIsSuperAdmin } from "../features/userInfo/userInfoSlice";
import './NavBar.css';

type NavBarItemProps = {
  dest: string;
  label: string;
};

function NavBarItem({ dest, label }: NavBarItemProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(dest); // Navigate to the new route
  };

  const path = window.location.pathname;
  const onThisPath = path === dest;
  const cName = onThisPath ? "stuckOnItem" : "navBarItem";

  return (
    <div className={cName}  onClick={handleClick}>{label}</div>
  );

}

function NavBar() {
  const isSuperAdmin =  useAppSelector(selectCurrentUserIsSuperAdmin);
  const isAdmin = useAppSelector(selectCurrentUserIsAdmin);
  // GATOR: eventually uncomment this and allow all logged-in users to see Finances
  // const isLoggedIn = useAppSelector(selectCurrentUserIsLoggedIn)

  return (
    <div className='bar'>
      <Flex
        className='navBarFlex'
        direction="column"
        justifyContent="space-between"
        alignItems="left"
        wrap="nowrap"
        gap="0.8rem"
      >
        <NavBarItem dest="/" label="Issues" />
        <NavBarItem dest="/mission" label='Mission' />
        <NavBarItem dest="/suggest" label='Suggest' />
        <NavBarItem dest="/critique" label='Critique' />
        {isSuperAdmin && <NavBarItem dest="/finances" label="Finances" />}
        {isAdmin && <NavBarItem  dest="/admin"  label="Admin" />}
        {isAdmin && <NavBarItem  dest="/adminUsers"  label="Admin Users" />}
        {isAdmin && <NavBarItem  dest="/adminIssues"  label="Admin Issues" />}
        {isAdmin && <NavBarItem  dest="/adminSubmissions"  label="Admin Texts" />}
        {isSuperAdmin && <NavBarItem  dest="/play01"  label="Play 1" />}
        {isSuperAdmin && <NavBarItem  dest="/play02"  label="Play 2" />}
        {isSuperAdmin && <NavBarItem  dest="/play03"  label="Play 3" />}
        {isSuperAdmin && <NavBarItem  dest="/play04"  label="Play 4" />}
        {isSuperAdmin && <NavBarItem  dest="/todos"  label="ToDos" />}
        <NavBarItem dest="/contactUs" label='Contact Us' />
      </Flex>
    </div>
  );
}

export default NavBar;
