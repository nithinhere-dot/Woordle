import { useState } from "react";
import play from '../assets/play.png';
import Play from './Play.jsx';

function Hero() {
  const [isGameStarted, setIsGameStarted] = useState(false);

  const handlePlayClick = () => {
    setIsGameStarted(true);
  };

  if (isGameStarted) {
    return <Play />;
  }

  return (
    <div className="bg-green-200 h-[91vh] w-full flex flex-col items-center justify-between p-4 relative overflow-hidden">
      {/* Background overlay - removed unless actually needed */}
      {/* <div className="absolute inset-0 text-black opacity-30"></div> */}
      
      {/* Main content container */}
      <div className="flex flex-col items-center justify-center flex-grow">
        <h1 className="sm:text-5xl text-2xl font-bold text-center text-green-800 z-10">
          Welcome to Wordle Game
        </h1>
        <h1 className="sm:text-xl text-center mt-4 text-green-500 opacity-80 z-10">
          Can you guess the secret word? Click below to start!
        </h1>
        <div className="mt-8 z-10">
          <button 
            className="inline-flex items-center text-5xl font-bold text-yellow-500 relative group"
            onClick={handlePlayClick}
          >
            <img 
              src={play} 
              alt="Play" 
              className="h-16 w-16 flex items-center justify-center cursor-pointer transition-transform duration-300 transform hover:scale-125" 
            />
            <span className="ml-4 text-xl hidden sm:block opacity-0 group-hover:opacity-100 group-hover:translate-x-0 translate-x-full transition-all duration-500 ease-in-out">
              Ready to Play?
            </span>
          </button>
        </div>
      </div>

      <div className="w-full mb-auto flex items-center justify-center text-center text-white text-lg py-4">
        Nithin_Here
      </div>
    </div>
  );
}

export default Hero;