import React from 'react';
import './App.css';
import Canvas from './Canvas';

const App = () => {
  return (
    <div className='main'>
      <div className='header'>
        <h2 className='text-color-gray align-center'>Sketch on Image</h2>
      </div>
      <Canvas />
    </div>
  );
};

export default App;
