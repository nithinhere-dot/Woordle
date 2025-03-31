import React from 'react';

function Nav() {
  return (
    <div className="bg-green-500 h-[9vh] p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-white text-3xl font-bold fredoka-bold mr-auto">Woordle</h1>
        <a 
          href="#contact" 
          className="text-white text-lg hover:text-yellow-400"
        >
          Contact Me
        </a>
      </div>
    </div>
  );
}

export default Nav;
