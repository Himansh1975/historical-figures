import React, { useState } from 'react';
import { Send, ArrowLeft, Search, User2 } from 'lucide-react';

const historicalFigures = [
  {
    id: 1,
    name: 'Marcus Aurelius',
    era: 'Roman Emperor & Philosopher',
    category: 'Philosophy',
    description: 'Roman Emperor and Stoic philosopher known for "Meditations"'
  },
  {
    id: 2,
    name: 'Buddha',
    era: '5th Century BCE',
    category: 'Spiritual',
    description: 'Founder of Buddhism, teacher of the path to enlightenment'
  },
  {
    id: 3,
    name: 'Adi Shankaracharya',
    era: '8th Century CE',
    category: 'Philosophy',
    description: 'Indian philosopher who consolidated the doctrine of Advaita Vedanta'
  },
  {
    id: 4,
    name: 'Jesus Christ',
    era: '1st Century CE',
    category: 'Spiritual',
    description: 'Central figure of Christianity and influential spiritual teacher'
  },
  {
    id: 5,
    name: 'Krishna',
    era: 'Ancient India',
    category: 'Spiritual',
    description: 'Divine figure in Hinduism, speaker of the Bhagavad Gita'
  },
  {
    id: 6,
    name: 'Albert Einstein',
    era: '20th Century',
    category: 'Science',
    description: 'Revolutionary physicist, father of modern physics'
  },
  {
    id: 7,
    name: 'Leonardo da Vinci',
    era: 'Renaissance',
    category: 'Arts & Science',
    description: 'Renaissance polymath, artist, and inventor'
  },
  {
    id: 8,
    name: 'Cleopatra',
    era: 'Ancient Egypt',
    category: 'Leadership',
    description: 'Last active ruler of the Ptolemaic Kingdom of Egypt'
  }
];

const apiUrl = import.meta.env.VITE_API_URL;

const HistoricalFigureChat = () => {
  const [selectedFigure, setSelectedFigure] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...new Set(historicalFigures.map(figure => figure.category))];

  const filteredFigures = historicalFigures.filter(figure => {
    const matchesSearch = figure.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      figure.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || figure.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSelectFigure = (figure) => {
    setSelectedFigure(figure);
    setMessages([{
      text: `Greetings, I am ${figure.name}. Through the wisdom of ages, I am here to share knowledge and insights from my era. What would you like to discuss?`,
      sender: 'ai'
    }]);
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim() !== '') {
      const userMessage = { text: inputMessage, sender: 'user' };
      setMessages(prev => [...prev, userMessage]);
      setInputMessage('');
      setIsLoading(true);

      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            figure: selectedFigure,
            message: inputMessage
          })
        });

        const data = await response.json();
        const aiResponse = { text: data.response, sender: 'ai' };
        setMessages(prev => [...prev, aiResponse]);
      } catch (error) {
        console.error('Error sending message:', error);
        const errorMessage = { text: 'Sorry, something went wrong. Please try again later.', sender: 'ai' };
        setMessages(prev => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    }
  };


  if (!selectedFigure) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Wisdom Through Time
          </h1>
          <p className="text-gray-600">Engage in meaningful conversations with history's greatest minds</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search historical figures..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            />
            <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
          </div>
          <div className="flex gap-2 overflow-x-auto md:overflow-visible">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm transition-all whitespace-nowrap ${selectedCategory === category
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFigures.map(figure => (
            <div
              key={figure.id}
              onClick={() => handleSelectFigure(figure)}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-100"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                  <User2 className="text-white" size={24} />
                </div>
                <div>
                  <h2 className="font-semibold text-lg">{figure.name}</h2>
                  <p className="text-sm text-gray-500">{figure.era}</p>
                </div>
              </div>
              <p className="mt-4 text-gray-600 text-sm">{figure.description}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 flex items-center">
        <button
          onClick={() => setSelectedFigure(null)}
          className="mr-4 hover:bg-white/20 p-2 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-bold">{selectedFigure.name}</h1>
          <p className="text-sm opacity-90">{selectedFigure.era}</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs md:max-w-md p-4 rounded-2xl shadow-sm ${message.sender === 'user'
              ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white ml-12'
              : 'bg-white border border-gray-100 mr-12'
              }`}>
              {message.text}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto flex items-center gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={`Ask ${selectedFigure.name} anything...`}
            className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            onKeyUp={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading}
            className="p-3 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <Send size={20} />
          </button>
        </div>
        {isLoading && (
          <div className="mt-2 text-center text-sm text-gray-500 flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-purple-600 rounded-full animate-spin"></div>
            {selectedFigure.name} is contemplating your question...
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoricalFigureChat;