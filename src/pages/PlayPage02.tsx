import { Flex, TextField } from "@aws-amplify/ui-react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import PageWrapper from "../components/PageWrapper";
import { selectIsSuperAdmin, setAsSuperAdmin } from "../features/userInfo/userInfoSlice";

function PlayPage02() {
  const dispatch = useAppDispatch();
  const isNowSuperAdmin = useAppSelector(selectIsSuperAdmin);

  const toggleIsAdmin = () => {
    dispatch(setAsSuperAdmin(!isNowSuperAdmin))
  }

  return (
    <PageWrapper>
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
    </PageWrapper>
  );
}

export default PlayPage02;
