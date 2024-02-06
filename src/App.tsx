import React, { useEffect, useState } from 'react';

function App() {
  const [text, setText] = useState<string>("");
  const [samplePara, setSamplePara] = useState<string>("");
  const [timeRemaining, setTimeRemaining] = useState<number>(60);
  const [isTimeRunning, setIsTimeRunning] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(3);
  const [WPM, setWPM] = useState<number>(0);
  const [accuracy, setAccuracy] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(parseInt(localStorage.getItem('highScore') || "0", 10));
  const [duration, setDuration] = useState<number>(60);

  useEffect(() => {
    fetchRandomPara();
  }, []);

  useEffect(() => {
    if (isTimeRunning && countdown > 0) {
      setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0 && timeRemaining > 0 && isTimeRunning) {
      setTimeout(() => setTimeRemaining((prev) => prev - 1), 1000);
    } else if (timeRemaining === 0) {
      endGame();
    }
  }, [countdown, timeRemaining, isTimeRunning]);

  async function fetchRandomPara() {
    try {
      const response = await fetch("https://baconipsum.com/api/?type=meat-and-filler&paras=1&format=text");
      const data = await response.text();
      setSamplePara(data);
    } catch (error) {
      console.error('Error fetching random paragraph:', error);
    }
  }

  function startGame() {
    fetchRandomPara();
    setIsTimeRunning(true);
    setCountdown(3);
    setText("");
    setTimeRemaining(duration)
    setWPM(0)
    setAccuracy(0)
  }

  function endGame() {
    setIsTimeRunning(false);
    const wordTyped = text.trim().split(" ").length;
    const typeSpeed = (wordTyped/(duration-timeRemaining))*60
    setWPM(Math.round(typeSpeed));
    const accuracyPercentage = ((wordTyped / samplePara.split(" ").length) * 100).toFixed(2);
    setAccuracy(parseFloat(accuracyPercentage));
    if (wordTyped > highScore) {
      setHighScore(wordTyped);
      localStorage.setItem('highScore', wordTyped.toString());
    }
    
  }

  function renderFeedbackText() {

    return Array.from(samplePara).map((char, index) => {
      if (index < text.length) {

        if (char === text[index]) {

          return <span className='text-green-500' key={index}>{char}</span>;
      
        } else {

          return <span className='text-red-500' key={index}>{char}</span>;
        }
      }
      return <span key={index}>{char}</span>;
    });
  }

  return (
    <>
      <div className='h-screen bg-gray-100 flex flex-col items-center justify-center'>
        <div className='p-8 bg-white shadow-lg rounded-md space-y-4 w-2/3'>
          <h2 className='text-2xl font-bold text-center mb-4'>Type Speed Test</h2>
          <div className='whitespace-pre-wrap overflow-x-hidden text-gray-700'>
            {renderFeedbackText()}
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={!isTimeRunning || countdown > 0}
            className="w-full p-4 border rounded-md transition duration-300 hover:border-blue-500 focus:border-blue-500 focus:outline-none"
            placeholder={
              countdown > 0 ? `Starting in ${countdown}....` : "Start typing here ...."
            }
          ></textarea>
          <div className='flex justify-between items-center mt-4'>
          <div className='flex justify-between mt-4'>
            <p> Timer: {timeRemaining}s</p> 
          </div>
            <button
              onClick={isTimeRunning ? endGame : startGame}
              className={`px-6 py-2 bg-blue-500 text-white rounded-md transition duration-300 ${isTimeRunning ? "bg-red-500" : ""}`}
            >
              {isTimeRunning ? "Stop" : "Start"}
            </button>
          </div>
          <div className=' flex justify-between mt-4'>
            <p>WPM:{WPM}</p>
            <p>Accuracy:{accuracy}%</p>
          </div>
        </div>
      </div>
    </>                   
  );
}

export default App;


