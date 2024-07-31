import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';


const Toast = () => {
  return (
    <ToastContainer
        position='top-right'
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        theme='light'
    />
  )
}

export default Toast