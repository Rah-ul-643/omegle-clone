import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { Toaster, toast } from 'sonner';
import { 
  Sparkles, 
  MessageCircle, 
  UserPlus, 
  XCircle, 
  Send 
} from 'lucide-react';
import ChatBox from './components/ChatBox';

const Nexus = () => {
  const [socket, setSocket] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [currentReceiverId, setCurrentReceiverId] = useState(null);
  const [currentTheme, setCurrentTheme] = useState({
    name: 'Cosmic', 
    colors: 'from-blue-500 to-purple-600'
  });

  useEffect(() => {
    const newSocket = io('http://localhost:4000');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to socket server');
    });

    newSocket.on('response', handleServerResponse);
    newSocket.on('receiverMsg', handleIncomingMessage);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleServerResponse = (response) => {
    switch(response.status) {
      case 1:
        setIsLoading(true);
        toast.info('Connecting Cosmic Nodes...', {
          description: 'Bridging parallel communication streams...',
          icon: <Sparkles className="text-cosmic-600" />
        });
        setConnectionStatus(1);
        break;
      case 2:
        setIsLoading(false);
        setCurrentReceiverId(response.receiverId);
        toast.success('Quantum Connection Established!', {
          description: 'Synchronizing communication channels.',
          icon: <MessageCircle className="text-cosmic-500" />
        });
        setConnectionStatus(2);
        break;
      case 3:
        resetChat();
        toast.warning('Connection Flux Terminated', {
          description: 'Quantum entanglement disrupted.',
          icon: <XCircle className="text-red-500" />
        });
        break;
      default:
        console.warn('Received unknown response status:', response.status);
        toast.warning('Unexpected Communication', {
          description: 'An anomaly in the communication protocol detected.',
        });
    }
  };

  const handleIncomingMessage = (message) => {
    setMessages(prev => [...prev, { type: 'received', text: message }]);
  };

  const sendMessage = (text) => {
    if (socket && currentReceiverId) {
      socket.emit('sendMsg', currentReceiverId, text);
      setMessages(prev => [...prev, { type: 'sent', text }]);
    }
  };

  const requestConnection = () => {
    if (socket) {
      socket.emit('requestConnection');
    }
  };

  const closeChat = () => {
    if (socket) {
      socket.emit('closeChat');
      resetChat();
    }
  };

  const resetChat = () => {
    setConnectionStatus(0);
    setCurrentReceiverId(null);
    setMessages([]);
    setIsLoading(false);
  };

  const handleThemeChange = (theme) => {
    setCurrentTheme(theme);
    toast.success(`Theme changed to ${theme.name}`, {
      description: 'Your chat environment has been updated.'
    });
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentTheme.colors} 
      flex items-center justify-center p-4 font-display transition-all duration-500`}>
      <Toaster position="top-right" richColors />
      
      <div className="bg-black/90 backdrop-blur-lg shadow-2xl rounded-3xl 
        w-full max-w-4xl p-8 space-y-6 animate-fade-in border border-cosmic-200/50">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-white 
            tracking-tight mb-2 animate-slide-up">
            Nexus
          </h1>
          <p className="text-base text-white/80 font-medium 
            animate-slide-up delay-100">
            Connecting Strangers, Creating Moments
          </p>
        </div>

        {isLoading && (
          <div className="flex flex-col items-center justify-center space-y-4 
            animate-pulse-slow">
            <div className="w-16 h-16 border-4 border-white/30 
              border-t-white rounded-full animate-spin"></div>
            <p className="text-white text-center font-semibold text-lg">
              Quantum Networking...
            </p>
          </div>
        )}

        {connectionStatus === 2 && (
          <ChatBox 
            messages={messages} 
            onSendMessage={sendMessage} 
            onCloseChat={closeChat}
            onChangeTheme={handleThemeChange}
          />
        )}

        {connectionStatus === 0 && (
          <button 
            onClick={requestConnection}
            className="w-full bg-white/20 text-white py-4 rounded-xl 
              hover:bg-white/30 transition-all duration-300 
              flex items-center justify-center space-x-2 
              group animate-bounce-soft text-lg font-semibold"
          >
            <UserPlus className="mr-3 w-6 h-6 group-hover:rotate-12 transition-transform" />
            Connect Randomly
          </button>
        )}

        <div className="text-center text-sm text-white/70 font-medium">
          Every connection is a unique quantum event
        </div>
      </div>
    </div>
  );
};

export default Nexus;