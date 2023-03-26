import { LoginForm } from '../components/LoginForm';
import { login } from '../services/auth.service';
import { LoginFormBody } from '../types';
import { useUserContext } from './../context/UserContext';

export const Login = () => {
  const { setUser } = useUserContext();

  const handleSubmitForm = async (loginFormBody: LoginFormBody) => {
    const response = await login(loginFormBody);
    setUser(response.data);
  }

  return (
    <div className='flex justify-content-center align-items-center flex-grow-1'>
      <LoginForm className='xl:col-3 lg:col-5 md:col-7 sm:col-9' onSubmit={handleSubmitForm} />
    </div>
  );
}
