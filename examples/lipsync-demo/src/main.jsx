import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import './index.css';

import PollyApp from './PollyApp';
import ChatbotApp from './ChatbotApp';
import ChatbotAppV2 from './ChatbotAppV2'; // ChatbotAppV2 import

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/aws2lip" element={<PollyApp />} />
        <Route path="/chatbot" element={<ChatbotApp />} />
        <Route path="/v2/chatbot" element={<ChatbotAppV2 />} /> {/* v2 챗봇 라우트 추가 */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
