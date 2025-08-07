import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import timelineInitialItems from './constants/timelineItems';
import { TimelineProvider } from './context/TimelineContex';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <TimelineProvider initialItems={timelineInitialItems}>
      <App />
    </TimelineProvider>
  </React.StrictMode>
);