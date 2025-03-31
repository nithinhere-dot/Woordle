import React, { useState, useEffect } from 'react';

function Play() {
  const [word, setWord] = useState('');
  const [wordLength, setWordLength] = useState(5);
  const [inputRows, setInputRows] = useState(
    Array(5).fill().map(() => Array(5).fill({ char: '', color: 'bg-gray-200' }))
  );
  const [currentRow, setCurrentRow] = useState(0);
  const [message, setMessage] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [shakeRow, setShakeRow] = useState(-1); // Track which row to shake

  const initializeGame = () => {
    const length = Math.floor(Math.random() * 5) + 3; // 3 to 7
    setWordLength(length);
    setCurrentRow(0);
    setMessage('');
    setGameOver(false);
    setShakeRow(-1);
  
    setInputRows(
      Array(5).fill().map(() => 
        Array(length).fill({ char: '', color: 'bg-gray-200' })
      ))
  
    fetch(`https://random-word-api.herokuapp.com/word?length=${length}`)
      .then(response => response.json())
      .then(data => {
        setWord(data[0].toUpperCase());
      })
      .catch(() => {
        const fallbackWords = {
          3: ['CAT', 'DOG', 'BAT', 'BAG', 'BAR'],
          4: ['FROG', 'DUCK', 'BEAR', 'BALL'],
          5: ['APPLE', 'TIGER', 'HONEY'],
          6: ['BANANA', 'ORANGE', 'MONKEY'],
          7: ['CHERRY', 'ELEPHANT', 'GIRAFFE']
        };
        const fallbackList = fallbackWords[length] || ['EXAMPLE'];
        const fallback = fallbackList[Math.floor(Math.random() * fallbackList.length)];
        setWord(fallback);
      });
  };

  useEffect(() => {
    initializeGame();
  }, []);

  const handleKeyDown = (event, rowIndex, colIndex) => {
    if (gameOver || rowIndex !== currentRow) return;

    const char = event.key.toUpperCase();
    if (/^[A-Z]$/.test(char)) {
      const newRows = [...inputRows];
      newRows[rowIndex] = [...newRows[rowIndex]];
      newRows[rowIndex][colIndex] = { ...newRows[rowIndex][colIndex], char };
      setInputRows(newRows);
      
      if (colIndex < wordLength - 1) {
        const nextInput = document.getElementById(`input-${rowIndex}-${colIndex + 1}`);
        if (nextInput) nextInput.focus();
      }
    } else if (event.key === 'Backspace') {
      const newRows = [...inputRows];
      newRows[rowIndex] = [...newRows[rowIndex]];
      newRows[rowIndex][colIndex] = { ...newRows[rowIndex][colIndex], char: '' };
      setInputRows(newRows);
      
      if (colIndex > 0) {
        const prevInput = document.getElementById(`input-${rowIndex}-${colIndex - 1}`);
        if (prevInput) prevInput.focus();
      }
    } else if (event.key === 'Enter' && colIndex === wordLength - 1) {
      const currentGuess = inputRows[rowIndex].map(cell => cell.char).join('');
      if (currentGuess.length === wordLength) {
        validateWord(currentGuess, rowIndex);
      } else {
        setMessage(`Word must be ${wordLength} letters`);
        setShakeRow(rowIndex);
        setTimeout(() => setShakeRow(-1), 500);
      }
    }
    event.preventDefault();
  };

  const validateWord = async (userWord, rowIndex) => {
    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${userWord.toLowerCase()}`);
      if (response.ok) {
        setMessage('');
        applyColors(userWord, rowIndex);
      } else {
        setMessage('Not a valid English word');
        setShakeRow(rowIndex);
        setTimeout(() => setShakeRow(-1), 500);
      }
    } catch (error) {
      setMessage('Error validating word');
      setShakeRow(rowIndex);
      setTimeout(() => setShakeRow(-1), 500);
    }
  };

  const applyColors = (userWord, rowIndex) => {
    const wordArray = word.split('');
    const userArray = userWord.split('');
    const colors = Array(wordLength).fill('bg-gray-400');
    
    const remainingLetters = [...wordArray];
    
    userArray.forEach((char, index) => {
      if (char === wordArray[index]) {
        colors[index] = 'bg-green-500';
        remainingLetters[index] = null;
      }
    });
    
    userArray.forEach((char, index) => {
      if (colors[index] !== 'bg-green-500') {
        const foundIndex = remainingLetters.indexOf(char);
        if (foundIndex !== -1) {
          colors[index] = 'bg-yellow-400';
          remainingLetters[foundIndex] = null;
        }
      }
    });
    
    const newRows = inputRows.map((row, rIdx) => {
      if (rIdx === rowIndex) {
        return row.map((cell, cIdx) => ({
          ...cell,
          color: colors[cIdx]
        }));
      }
      return row;
    });
    
    setInputRows(newRows);
    
    if (userWord === word) {
      setMessage('You won!');
      setGameOver(true);
      return;
    }
    
    if (rowIndex === 4) {
      setMessage(`Game over! The word was ${word}`);
      setGameOver(true);
    } else {
      setCurrentRow(rowIndex + 1);
      setTimeout(() => {
        const nextInput = document.getElementById(`input-${rowIndex + 1}-0`);
        if (nextInput) nextInput.focus();
      }, 0);
    }
  };

  return (
    <div className='bg-green-200 gap-2 min-h-screen w-full flex flex-col items-center justify-center p-4'>
      {/* Error message container with better styling */}
      {message && (
        <div className={`mb-4 px-6 py-3 rounded-lg ${
          message.includes('won') ? 'bg-green-100 text-green-800' : 
          message.includes('over') ? 'bg-red-100 text-red-800' : 
          'bg-yellow-100 text-yellow-800'
        }`}>
          <p className="font-semibold text-center">
            {message.includes('won') ? '🎉 ' : ''}
            {message.includes('over') ? '😢 ' : ''}
            {message}
            {message.includes('won') ? ' 🎉' : ''}
          </p>
        </div>
      )}

      {/* Game board */}
      {inputRows.map((row, rowIndex) => (
        <div 
          key={rowIndex} 
          className={`flex flex-row gap-2 justify-center items-center ${
            shakeRow === rowIndex ? 'animate-shake' : ''
          }`}
        >
          {row.map((cell, colIndex) => (
            <input
              key={colIndex}
              id={`input-${rowIndex}-${colIndex}`}
              type='text'
              className={`border-2 rounded-lg sm:h-12 sm:w-12 h-10 w-10 text-center focus:outline-none font-bold text-xl ${cell.color}`}
              maxLength={1}
              onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
              value={cell.char}
              readOnly={rowIndex !== currentRow || gameOver}
              autoFocus={rowIndex === 0 && colIndex === 0}
            />
          ))}
        </div>
      ))}

      {/* Play Again button */}
      <button
        onClick={initializeGame}
        className='mt-6 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-md hover:shadow-lg'
      >
        Play Again
      </button>

      {/* Add this to your global CSS or CSS-in-JS */}
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-5px); }
          40%, 80% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s linear;
        }
      `}</style>
    </div>
  );
}

export default Play;