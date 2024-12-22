import React from 'react';
import MessageList from '@components/MessageList/MessageList';
import MessageFilters from '@components/MessageFilters/MessageFilters';
import { useMessageFilters } from '@hooks/useMessageFilters';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const App: React.FC = () => {
  const { filters, resetFilters } = useMessageFilters();

  return (
    <div className="container py-4">
      <header className="mb-4">
        <h1 className="text-primary">Message Dashboard</h1>
      </header>
      <div className="row">
        <div className="col-md-3">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Filters</h5>
              <MessageFilters
                filters={filters}
                onResetFilters={resetFilters}
              />
            </div>
          </div>
        </div>
        <div className="col-md-9">
          <MessageList filters={filters} />
        </div>
      </div>
    </div>
  );
};

export default App;
