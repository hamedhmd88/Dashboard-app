import React from 'react';

export default function Loading() {
  return (
    <>
      <div className="fixed top-0 left-0 w-full h-1 bg-blue-800 animate-loading"></div>
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    </>
  );
}

