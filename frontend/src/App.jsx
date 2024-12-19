import React from 'react';
import DynamicForm from './components/dynamicForm';
import CardDisplay from './components/CardDisplay';
import { Toaster } from 'react-hot-toast';



const App = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-3xl p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          LilyPad: Find your vehicle
        </h1>
        <Toaster />
        <DynamicForm />
        <CardDisplay />
      </div>
    </div>
  );
};

export default App;

