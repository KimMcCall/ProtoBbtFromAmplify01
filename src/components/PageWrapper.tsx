import { Flex } from '@aws-amplify/ui-react';
import BannerBox from "../components/BannerBox.";
import NavBar from '../components/NavBar';

function PageWrapper(children: { children: React.ReactNode } ) {
  return (
    <main>
      <div className='pwGlobalDiv'>
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
