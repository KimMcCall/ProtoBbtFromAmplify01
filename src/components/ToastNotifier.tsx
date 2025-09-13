// ToastNotifier.tsx

import { Flex } from "@aws-amplify/ui-react";
import { MdClose } from "react-icons/md";
import './ToastNotifier.css'

type MyPropsType = {
  message: string
  shouldShow: boolean
  showF: (b: boolean) => void
}

function ToastNotifier (props: MyPropsType) {
  const { message, shouldShow, showF } = props;

  const handleCloseClick = (event: { stopPropagation: () => void; }) => {
    event.stopPropagation();
    showF(false);
  }

  return (
    <div className='toastNotifierRoot' style={{ display: shouldShow ? 'block' : ''}}>
      <Flex direction='row' >
        <div className="toastMessage">
          {message}
        </div>
        <div className='toastCloseIcon'>
          <MdClose color='white' onClick={handleCloseClick}/>
        </div>
      </Flex>
    </div>
  )
}

export default ToastNotifier;
