import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Flex, TextField } from "@aws-amplify/ui-react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import PageWrapper from "../components/PageWrapper";
import { selectIsSuperAdmin, setAsSuperAdmin } from "../features/userInfo/userInfoSlice";
import { selecNext, setNextPath } from "../features/navigation/navigationSlice";

function PlayPage02() {
  const [ savedPath, setSavedPath] = useState("/donate");
  const dispatch = useAppDispatch();
  const isNowSuperAdmin = useAppSelector(selectIsSuperAdmin);
  const newPath = useAppSelector(selecNext);
  const navigateTo = useNavigate();

  const toggleIsAdmin = () => {
    dispatch(setAsSuperAdmin(!isNowSuperAdmin))
  }

  const goThere = () => { navigateTo(newPath); }

  return (
    <PageWrapper>
      <Flex direction="column">
        <Flex direction={"row"}>
          <button onClick={() => toggleIsAdmin()}>Toggle isSuperAdmin</button>
          value:
          <TextField
            label=""
            value={'' + isNowSuperAdmin}
            readOnly
            placeholder="??"
            width="120px"
          />
        </Flex>
        <Flex direction={"row"}>
          <button onClick={() => dispatch(setNextPath(savedPath))}>Set as next path</button>
          <TextField
            label=""
            value={savedPath}
            onChange={(e) => setSavedPath(e.target.value)}
            width="200px"
          />
          <button onClick={() => goThere()}>Go to the path</button>
        </Flex>
      </Flex>
    </PageWrapper>
  );
}

export default PlayPage02;
