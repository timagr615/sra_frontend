import React from 'react';
import Analytics from './components_ui/Analytics';
import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import 'normalize.css/normalize.css';
import "./App.css"
import { Route, Routes } from 'react-router-dom';
import { SignIn } from './components_ui/SignIn';
import { Registration } from './components_ui/Registration';
import { Upload } from './components_ui/Upload';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  
    return (
        <AuthProvider>
        <Routes>
            <Route path="/" element={<Analytics/>} />
            <Route path="sign-in" element={<SignIn/>} />
            <Route path="registration" element={<Registration/>} />
            <Route path="upload" element={<Upload/>} />
        </Routes>
        </AuthProvider>
    );
}

export default App;
