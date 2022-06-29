import React from 'react';
import logo from './logo.svg';
import './App.css';
import Presentation from './components/presentation'
import { app, database } from './firebaseConfig';

function App() {
  return (
    <Presentation  database={database}/>
  );
}

export default App;