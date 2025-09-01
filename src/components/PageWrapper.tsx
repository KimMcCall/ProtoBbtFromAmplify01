import { Flex } from '@aws-amplify/ui-react';
import BannerBox from "../components/BannerBox.";
import NavBar from '../components/NavBar';

const globalDiv: React.CSSProperties = {
  width: '1208px',
  border: '1px solid gray',
  backgroundColor: '#f0f0f0',
};

function PageWrapper(children: { children: React.ReactNode } ) {
  return (
    <main>
      <div style={globalDiv}>
        <BannerBox />
        <Flex direction="row" justifyContent="flex-start" alignItems="flex-start" alignContent="top" wrap="nowrap" gap="6px">
          <NavBar />
          {children.children}
        </Flex>
      </div>
    </main>
  );
}

export default PageWrapper;
