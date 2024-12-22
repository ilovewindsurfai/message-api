import React, { useState } from 'react';
import { MessageType } from './types/Message';
import MessageList from './components/MessageList/MessageList';
import MessageFilters from './components/MessageFilters/MessageFilters';
import './App.css';

function App() {
    const [selectedType, setSelectedType] = useState<MessageType>();
    const [selectedActive, setSelectedActive] = useState<boolean>();
    const [selectedApplication, setSelectedApplication] = useState<string>();

    return (
        <div className="app">
            <header className="app-header">
                <h1>Message Dashboard</h1>
            </header>
            
            <main className="app-content">
                <MessageFilters
                    onTypeChange={setSelectedType}
                    onActiveChange={setSelectedActive}
                    onApplicationChange={setSelectedApplication}
                    selectedType={selectedType}
                    selectedActive={selectedActive}
                    selectedApplication={selectedApplication}
                />
                
                <MessageList
                    filterType={selectedType}
                    filterActive={selectedActive}
                    applicationName={selectedApplication}
                />
            </main>
        </div>
    );
}

export default App;
