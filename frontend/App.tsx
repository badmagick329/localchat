import { bellSound } from './bell';
import './index.css';

import { useEffect, useRef, useState } from 'react';

const serverAddress = import.meta.env.VITE_SERVER_ADDRESS;

function App() {
  const [messages, setMessages] = useState<string[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    socketRef.current = new WebSocket(serverAddress);

    socketRef.current.onmessage = (event) => {
      const sound = new Audio(bellSound);
      sound.play();
      setMessages((prevMessages) => [...prevMessages, event.data]);
    };

    return () => {
      socketRef.current?.close();
    };
  }, []);

  const sendMessage = () => {
    if (inputMessage && socketRef.current) {
      socketRef.current.send(inputMessage);
      setInputMessage('');
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
      <div className='flex flex-col items-center max-w-96 gap-4'>
        <input
          className='text-black'
          type='text'
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button
          className='border-2 border-white px-4 py-2'
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
