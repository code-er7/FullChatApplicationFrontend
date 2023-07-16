import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {ChakraProvider} from "@chakra-ui/react"

export const server = "https://talkative-7ykb.onrender.com";
// export const server = "http://127.0.0.1:5000";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
      <ChakraProvider>
          <App />
      </ChakraProvider>
);
