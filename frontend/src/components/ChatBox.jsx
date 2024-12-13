import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  XCircle,
  Smile,
  Zap,
  Star
} from 'lucide-react';

const QUICK_RESPONSES = [
  "👋 Hey there!",
  "🌟 Interesting chat...",
  "🤔 Tell me more",
  "😄 Cool!",
  "🚀 Fascinating!"
];

const THEMES = [
  {
    name: 'Ocean',
    colors: 'from-teal-500 to-blue-600',
    textBg: {
      sent: 'bg-teal-600 text-white',
      received: 'bg-blue-100 text-gray-800'
    }
  },
  {
    name: 'Fire',
    colors: 'from-orange-500 to-red-600',
    textBg: {
      sent: 'bg-orange-600 text-white',
      received: 'bg-red-100 text-gray-800'
    }
  },
  {
    name: 'Emerald',
    colors: 'from-green-500 to-emerald-600',
    textBg: {
      sent: 'bg-green-600 text-white',
      received: 'bg-emerald-100 text-gray-800'
    }
  },
  {
    name: 'Royal',
    colors: 'from-indigo-600 to-purple-700',
    textBg: {
      sent: 'bg-indigo-700 text-white',
      received: 'bg-purple-100 text-gray-800'
    }
  }
];

const ChatBox = ({ 
  messages, 
  onSendMessage, 
  onCloseChat, 
  onChangeTheme,
  currentTheme = THEMES[0] 
}) => {
  const [inputMessage, setInputMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showQuickResponses, setShowQuickResponses] = useState(false);
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [messageTimer, setMessageTimer] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      onSendMessage(inputMessage);
      setInputMessage('');
    }
  };

  const EMOJIS = ['😀', '👍', '❤️', '🚀', '🌈', '🤖', '🌟', '🍕'];

  return (
    <div className="relative flex flex-col h-[480px] w-full max-w-2xl mx-auto animate-fade-in">
      {/* Messages Container with Custom Scrollbar */}
      <div className={`flex-grow overflow-y-auto 
        bg-white/10 backdrop-blur-sm 
        rounded-xl p-4 mb-4 
        border border-white/20 
        custom-scrollbar relative`}>
        
        {messages.length === 0 && (
          <div className="text-center text-white/70 
            flex items-center justify-center h-full text-lg font-medium">
            Initiate the quantum dialogue...
          </div>
        )}
        
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`flex ${msg.type === 'sent' ? 'justify-end' : 'justify-start'} 
              mb-2 animate-slide-up`}
          >
            <div 
              className={`max-w-[70%] px-4 py-2 rounded-xl text-base shadow-md 
                ${msg.type === 'sent' 
                  ? currentTheme.textBg.sent 
                  : currentTheme.textBg.received
                }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Theme Picker */}
      {showThemePicker && (
        <div className="flex space-x-2 mb-2 justify-center">
          {THEMES.map((theme, index) => (
            <button 
              key={index}
              onClick={() => {
                onChangeTheme(theme);
                setShowThemePicker(false);
              }}
              className={`w-8 h-8 rounded-full bg-gradient-to-br ${theme.colors} 
                hover:scale-110 transition-transform`}
            />
          ))}
        </div>
      )}

      {/* Input and Action Buttons */}
      <div className="flex space-x-2">
        {/* Emoji Button */}
        <button 
          onClick={() => {
            setShowEmojiPicker(prev => !prev); // Toggle the emoji picker
            setShowQuickResponses(false); // Hide quick responses
            setShowThemePicker(false); // Hide theme picker
          }}
          className="bg-white/10 backdrop-blur-sm text-white p-2 rounded-lg 
            hover:bg-white/20 transition-colors"
        >
          <Smile className="w-5 h-5" />
        </button>

        {/* Emoji Picker */}
        {showEmojiPicker && (
          <div className="absolute bottom-[60px] left-0 w-auto flex justify-center z-50">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 flex space-x-2">
              {EMOJIS.map((emoji, index) => (
                <button 
                  key={index}
                  onClick={() => {
                    setInputMessage(prev => prev + emoji);
                    setShowEmojiPicker(false);
                  }}
                  className="text-2xl hover:scale-125 transition-transform"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Theme Picker Button */}
        <button 
          onClick={() => {
            setShowThemePicker(!showThemePicker);
            setShowEmojiPicker(false);
            setShowQuickResponses(false);
          }}
          className="bg-white/10 backdrop-blur-sm text-white p-2 rounded-lg 
            hover:bg-white/20 transition-colors"
        >
          <Star className="w-5 h-5" />
        </button>

        {/* Main Input */}
        <input 
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Type your message..."
          className="flex-grow px-4 py-2 bg-white/10 backdrop-blur-sm 
            border border-white/20 text-white 
            rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 
            placeholder-white/50"
        />

        {/* Send Button */}
        <button 
          onClick={handleSendMessage}
          className="bg-white/10 backdrop-blur-sm text-white p-2 rounded-lg 
            hover:bg-white/20 transition-colors group"
        >
          <Send className="w-5 h-5 group-hover:rotate-12 transition-transform" />
        </button>

        {/* Close Chat Button */}
        <button 
          onClick={onCloseChat}
          className="bg-red-500/20 text-red-300 p-2 rounded-lg 
            hover:bg-red-500/30 transition-colors group"
        >
          <XCircle className="w-5 h-5 group-hover:rotate-6 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
