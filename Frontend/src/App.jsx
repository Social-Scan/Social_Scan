import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet, Link } from 'react-router-dom';
import './App.css';

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />, 
      children: [
        { path: "/", element: <DragAndDrop /> }, // Home 
        { path: "/history", element: <History /> }, 
      ],
    },
  ]);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
};

const Layout = () => {
  return (
    <div>
      <Navbar />
      <div className="content">
        <Outlet /> {/* Render child routes */}
      </div>
    </div>
  );
};

const Navbar = () => {
  return (
    <div className="bg-slate-500 p-6">
      <Link to="/" className="pr-4 text-white">
        Home
      </Link>
      <Link to="/history" className="text-white">
        History
      </Link>
    </div>
  );
};

const DragAndDrop = () => {
  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    console.log('Dropped files:', files);
  };

  return (
    <div
      className="drop-container"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <div className="drop-message">
        <div className="upload-icon">📂</div>
        Drag & Drop files here or click to upload
      </div>
    </div>
  );
};

const History = () => {
  return (
    <div>
      <h2>History Page</h2>
      <p>Here is the history of all actions or files uploaded.</p>
    </div>
  );
};

export default App;
