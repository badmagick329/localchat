import { bellSound } from './bell';
import './index.css';

import { useEffect, useRef, useState } from 'react';

const serverAddress = import.meta.env.VITE_SERVER_ADDRESS;

type WebSocketData = {
  type: string;
  sender: string;
  data: string;
};

function App() {
  const [messages, setMessages] = useState<string[]>([]);
  const [user, setUser] = useState<string>('');
  const [inputMessage, setInputMessage] = useState('');
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    socketRef.current = new WebSocket(serverAddress);

    socketRef.current.onmessage = (event) => {
      handleMessage(JSON.parse(event.data));
    };

    return () => {
      socketRef.current?.close();
    };
  }, []);

  const sendMessage = () => {
    if (inputMessage && socketRef.current) {
      const data = {
        type: 'message',
        sender: user,
        data: inputMessage,
      };
      console.log(`Sending`, data);
      socketRef.current.send(JSON.stringify(data));
      setInputMessage('');
    }
  };

  const handleMessage = (data: WebSocketData) => {
    console.log('handling message', data);
    if (data.type === 'message') {
      console.log('updating messages', data.data);
      setMessages((prevMessages) => [
        ...prevMessages,
        `${data.sender}: ${data.data}`,
      ]);
    } else if (data.type === 'set_user') {
      console.log('settings user', data.data);
      setUser(data.data);
    } else if (data.type === 'notification') {
      const sound = new Audio(bellSound);
      sound.play();
    }
  };

  return (
    <div className='flex flex-col items-center gap-4 bg-gray-950 text-white min-h-screen'>
      <h1>Bun WebSocket Chat</h1>
      <div>
        {messages.map((message, index) => (
          <p key={index}>{message}</p>
        ))}
      </div>
      <div className='flex flex-col items-center max-w-[300px] gap-4'>
        <div className='flex w-full justify-around gap-4'>
          <span>{user}</span>
          <input
            className='text-black w-full'
            type='text'
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
        </div>
        <div className='flex justify-around gap-4'>
          <button
            className='border-2 border-white px-2 py-1'
            onClick={sendMessage}
          >
            Send
          </button>
          <button
            className='border-2 border-white px-2 py-1'
            onClick={() => {
              if (socketRef.current) {
                const data = {
                  type: 'notification',
                  sender: user,
                  data: '',
                };
                console.log(`Sending`, data);
                socketRef.current.send(JSON.stringify(data));
              }
            }}
          >
            Notify
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
