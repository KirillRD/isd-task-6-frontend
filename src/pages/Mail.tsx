import { MessageForm } from '../components/MessageForm';
import { MessageList } from '../components/MessageList';

export const Mail = () => {
  return (
    <div className='flex flex-column align-items-center'>
      <div className='xl:col-6 lg:col-8 md:col-10 sm:col-11'>
        <MessageForm className='mt-2' />
        <MessageList className='mt-3' />
      </div>
    </div>
  );
}
