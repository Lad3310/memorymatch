import React from 'react';
import Game from './components/Game';
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #f5f5f5;
  }

  h1 {
    color: #333;
    margin-bottom: 20px;
  }

  h3 {
    color: #666;
    margin-bottom: 5px;
  }

  p {
    font-size: 1.2rem;
    color: #444;
  }
`;

const App: React.FC = () => {
  return (
    <>
      <GlobalStyle />
      <Game />
    </>
  );
};

export default App; 