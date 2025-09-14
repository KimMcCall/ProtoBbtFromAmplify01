import { useNavigate } from 'react-router-dom';
import { Flex } from '@aws-amplify/ui-react';
import { useAppSelector } from "../app/hooks";
import { selectIsAdmin, selectIsSuperAdmin } from "../features/userInfo/userInfoSlice";
import './NavBar.css';

/*
const buttonDiv: React.CSSProperties = {
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: '140%',
};
*/

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
  const isSuperAdmin =  useAppSelector(selectIsSuperAdmin);
  const isAdmin = useAppSelector(selectIsAdmin);

  return (
    <div className='bar'>
      <Flex
        direction="column"
        justifyContent="space-between"
        alignItems="left"
        wrap="nowrap"
        gap="1rem"
      >
        <NavBarItem dest="/" label="Home" />
        <NavBarItem dest="/mission" label='Mission' />
        <NavBarItem dest="/suggest" label='Suggest' />
        <NavBarItem dest="/finances" label="Finances" />
        <NavBarItem dest="/donate" label="Donate" />
        {isAdmin && <NavBarItem  dest="/adminUsers"  label="Admin Users" />}
        {isAdmin && <NavBarItem  dest="/adminIssues"  label="Admn Issues" />}
        {isAdmin && <NavBarItem  dest="/adminSubmissions"  label="Admin Texts" />}
        {isSuperAdmin && <NavBarItem  dest="/play01"  label="Play 1" />}
        {isSuperAdmin && <NavBarItem  dest="/play02"  label="Play 2" />}
        {isSuperAdmin && <NavBarItem  dest="/play03"  label="Play 3" />}
        {isSuperAdmin && <NavBarItem  dest="/play04"  label="Play 4" />}
        {isSuperAdmin && <NavBarItem  dest="/todos"  label="ToDos" />}
      </Flex>
    </div>
  );
}

export default NavBar;
