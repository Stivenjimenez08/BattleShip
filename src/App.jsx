import React from 'react';
import {BattleshipGame}  from './BattleshipGame'; 
import "./index.css";

export const App = () => {
  return (
    <div className='container'>
      <h1>Juego de Batalla Naval</h1>
      <BattleshipGame />
    </div>
  );
};
