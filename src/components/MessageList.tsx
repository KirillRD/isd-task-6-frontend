import { useState, useEffect, useRef } from 'react';
import { DataTable, DataTableCellClickEvent, DataTableRowClassNameOptions, DataTableRowData, DataTableStateEvent, DataTableValue } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Message } from '../types';
import { getLastMessageIdByRecipient, getMessageCountByRecipient, getMessagesByRecipient, updateIsRead } from '../services/message.service';
import { useUserContext } from './../context/UserContext';
import { getNewMessages } from './../services/message.service';
import useInterval from './../hooks/useInterval';
import { Toast } from 'primereact/toast';
import { PAGE_SIZE, SCHEDULER_DELAY, TOAST_LIFE_TIME } from '../constants';

type MessageListProps = {
  className?: string;
}

const TITLE_COLUMN_INDEX = 2;

export const MessageList = ({ className }: MessageListProps) => {
  const { user } = useUserContext();
  const [lastMessageId, setLastMessageId] = useState<number>(0);
  const [first, setFirst] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageCount, setMessageCount] = useState<number>(0);
  const toast = useRef<Toast>(null);
  const [expandedRows, setExpandedRows] = useState<any>({});

  const loadLastMessageId = async () => {
    const response = await getLastMessageIdByRecipient(user!.id);
    if (response.data) {
      setLastMessageId(response.data);
    }
  }

  const loadMessages = async () => {
    const response = await getMessagesByRecipient(lastMessageId, user!.id, page, PAGE_SIZE);
    setMessages(response.data);
  }

  const loadMessageCount = async () => {
    const response = await getMessageCountByRecipient(user!.id);
    setMessageCount(response.data);
  }

  const loadPage = async () => {
    await loadMessages();
    await loadMessageCount();
  }

  const loadNewMessages = async () => {
    const response = await getNewMessages(lastMessageId, user!.id);
    const newMessages = response.data;
    if (newMessages.length) {
      setLastMessageId(newMessages[newMessages.length - 1].id);
      showToasts(newMessages);
    }
  }

  useEffect(() => {
    const load = async () => {
      await loadLastMessageId();
      await loadPage();
    }
    load();
  }, [page, lastMessageId])

  useInterval(loadNewMessages, SCHEDULER_DELAY);

  const handleOnPage = (event: DataTableStateEvent) => {
    setFirst(event.first);
    setPage(++event.page!);
  }

  const formatDate = (value: Date) => {
    return new Date(value).toLocaleDateString('UTC', {
      year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'
    }).toString();
  }

  const dateTemplate = (rowData: Message) => {
    return formatDate(rowData.date);
  }

  const showToasts = (messages: Message[]) => {
    toast.current!.show(messages.map(message => ({
      summary: `Message from ${message.sender?.name}`,
      detail: message.title,
      severity: 'info',
      life: TOAST_LIFE_TIME
    })));
  }

  const bodyExpanderTemplate = (data: DataTableRowData<DataTableValue[]>) => {
    return <pre className='p-component px-6 message-body'>{data.body}</pre>;
  }

  const updateIsReadOfMessage = async (id: number): Promise<Message> => {
    const response = await updateIsRead(id, true);
    return response.data;
  }

  const replaceMessage = (message: Message) => {
    return messages.map(mes => {
      if (mes.id == message.id) {
        return message;
      } else {
        return mes;
      }
    });
  }

  const addExpandedRow = (id: number) => {
    setExpandedRows({
      ...expandedRows,
      [id]: true
    });
  }

  const removeExpandedRow = (id: number) => {
    setExpandedRows({
      ...expandedRows,
      [id]: undefined
    });
  }

  const handleCellClick = async (event: DataTableCellClickEvent<DataTableValue[]>) => {
    if (event.cellIndex == TITLE_COLUMN_INDEX) {
      const id = event.rowData.id;
      if (!expandedRows[id]) {
        if (!event.rowData.isRead) {
          const message = await updateIsReadOfMessage(id);
          setMessages(replaceMessage(message));
        }
        addExpandedRow(id);
      } else {
        removeExpandedRow(id);
      }
    }
  }

  const isReadColumnTemplate = (rowData: Message) => {
    return (rowData.isRead ? 
      <span className='material-symbols-outlined text-400'>drafts</span> : 
      <span className='material-symbols-outlined text-primary'>mail</span>)
  }

  const rowStyle = (event: DataTableRowData<DataTableValue[]>, options: DataTableRowClassNameOptions<DataTableValue[]>) => {
    return !event.isRead ? 'font-bold bg-primary-50' : '';
  }

  return (
    <div className={`border-round-md surface-0 shadow-1 ${className}`}>
      <div className='p-panel'>
        <div className='p-panel-header surface-0 justify-content-start py-2 pl-3'>
          <h3 className='p-panel-title my-2 text-primary'>Messages</h3>
        </div>
      </div>
      <DataTable
        value={messages}
        dataKey='id'
        className='mx-4 mt-2'
        lazy
        paginator
        rows={PAGE_SIZE}
        totalRecords={messageCount}
        onPage={handleOnPage}
        first={first}
        expandedRows={expandedRows}
        rowExpansionTemplate={bodyExpanderTemplate}
        onCellClick={handleCellClick}
        cellSelection
        selectionMode='single'
        size='small'
        rowHover
        rowClassName={rowStyle}
      >
        <Column field='isRead' className='is-read-column' body={isReadColumnTemplate} />
        <Column field='sender.name' header='Sender' className='sender-column' />
        <Column field='title' header='Title' className='title-column' />
        <Column field='date' header='Date' className='date-column' dataType='date' body={dateTemplate} />
      </DataTable>
      <Toast ref={toast} position='bottom-right' />
    </div>
  );
}
