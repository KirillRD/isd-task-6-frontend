import { FormEvent, useState } from 'react';
import { AutoComplete, AutoCompleteCompleteEvent, AutoCompleteChangeEvent } from 'primereact/autocomplete';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { getUsersByNameLike } from '../services/user.service';
import { useUserContext } from './../context/UserContext';
import { MessageFormBody } from '../types';
import { sendMessages } from './../services/message.service';
import { Dialog } from 'primereact/dialog';

type MessageFormProps = {
  className?: string;
}

export type SelectUser = {
  code: string;
  name: string;
}

export const MessageForm = ({ className }: MessageFormProps) => {
  const { user } = useUserContext();
  const [selectedUsers, setSelectedUsers] = useState<SelectUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<SelectUser[]>([]);
  const [title, setTitle] = useState<string>('');
  const [body, setBody] = useState<string>('');
  const [modalEmptyTitle, setModalEmptyTitle] = useState<boolean>(false);

  const clearForm = () => {
    setSelectedUsers([]);
    setTitle('');
    setBody('');
  }

  const sendForm = () => {
    const messages = selectedUsers.map(selectedUser => ({
      senderId: user!.id,
      recipientId: +selectedUser.code,
      title,
      body,
    } as MessageFormBody));
    sendMessages(messages);
  }

  const handleMessageFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (title) {
      sendForm();
      clearForm();
    } else {
      setModalEmptyTitle(true);
    }
  }

  const handleSelectSearch = async (event: AutoCompleteCompleteEvent) => {
    const response = await getUsersByNameLike(event.query);
    const users = response.data
      .map(user => ({
        code: user.id,
        name: user.name,
      } as unknown as SelectUser))
    setFilteredUsers(users);
  }

  const handleSelectChange = (event: AutoCompleteChangeEvent) => {
    if (event.value) {
      setSelectedUsers(event.value);
    }
  }

  const handleTitleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  }

  const handleBodyInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBody(event.target.value);
  }

  const handleCLearButtonClick = () => {
    clearForm();
  }

  const handleModalHide = () => {
    setModalEmptyTitle(false);
  }

  const handleModalSubmit = () => {
    setModalEmptyTitle(false);
    sendForm();
    clearForm();
  }

  return (
    <div className={`border-round-md surface-0 shadow-1 ${className}`}>
      <div className='p-panel'>
        <div className='p-panel-header surface-0 justify-content-start py-2 pl-3'>
          <h3 className='p-panel-title my-2 text-primary'>New message</h3>
        </div>
      </div>
      <form className='flex flex-column px-4 py-3' onSubmit={handleMessageFormSubmit}>
        <div className='field grid p-fluid'>
          <label htmlFor='recipient' className='col-2 m-0 align-self-start'>Recipient</label>
          <div className='col'>
            <AutoComplete
              inputId='recipient'
              field='name'
              multiple
              value={selectedUsers}
              suggestions={filteredUsers}
              completeMethod={handleSelectSearch}
              onChange={handleSelectChange}
              forceSelection />
          </div>
        </div>
        <div className='field grid p-fluid'>
          <label htmlFor='title' className='col-2 m-0 align-self-start'>Title</label>
          <div className='col'>
            <InputText id='title' value={title} onChange={handleTitleInputChange} />
          </div>
        </div>
        <div className='field grid p-fluid mb-2'>
          <label htmlFor='body' className='col-2 m-0 align-self-start'>Body</label>
          <div className='col'>
            <InputTextarea
              id='body'
              value={body}
              onChange={handleBodyInputChange}
              rows={3}
              style={{resize: 'vertical'}}
              autoResize />
          </div>
        </div>
        <div className='flex justify-content-end flex-wrap gap-2'>
          <Button
            type='button'
            label='Clear'
            icon='pi pi-trash'
            className='col-2'
            outlined
            disabled={!selectedUsers.length && !title && !body}
            onClick={handleCLearButtonClick} />
          <Button
            type='submit'
            label='Send'
            className='col-2'
            icon='pi pi-send'
            disabled={!selectedUsers.length} />
        </div>
        <Dialog header='Sending message' className='w-3' visible={modalEmptyTitle} onHide={handleModalHide} footer={(
          <>
            <Button label='Cancel' type='button' icon='pi pi-times' onClick={handleModalHide} className='p-button-text' />
            <Button label='OK' type='submit' icon='pi pi-check' onClick={handleModalSubmit} />
          </>
        )}>
          <p className='m-0'>
            Do you really want to send message without title?
          </p>
        </Dialog>
    </form>
    </div>
  );
}
