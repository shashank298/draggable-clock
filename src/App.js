import "./App.css";
import { useState, useRef, useEffect } from "react";

function App() {
  const [counter, setCounter] = useState(0);
  const [sec, setSec] = useState("");
  const [min, setMin] = useState("");
  const [isSecDraggable, setSecDraggable] = useState(false);
  const [isMinDraggable, setMinDraggable] = useState(false);
  const minRef = useRef();
  const secRef = useRef();
  const clockRef = useRef();
  const counterRef = useRef();

  function setClockTime() {
    try {
      const seconds = counter % 60;
      setSec(`0${counter % 60}`.slice(-2))
      const secondsDegree = 90 + (seconds / 60) * 360;
      secRef.current.style.transform = `rotate(${secondsDegree}deg)`;

      const minutes = Math.floor(counter / 60);
      setMin(`0${minutes%60}`.slice(-2))
      const minutesDegree = 90 + (minutes / 60) * 360;
      minRef.current.style.transform = `rotate(${minutesDegree}deg)`;
    } catch (error) {
      console.log(error);
    }
  }

  function startCounter() {
      clearInterval(counterRef.current);
      counterRef.current = setInterval(function () {
        setCounter((prev) => prev + 1);
      }, 1000);
  }

  function handleMouseUp() {
    setSecDraggable(false);
    setMinDraggable(false);
    clearInterval(counterRef.current);
    startCounter();
  }

  useEffect(() => {
    clockRef.current.addEventListener("mouseup", handleMouseUp);
    return () => clockRef.current?.removeEventListener("mouseup", handleMouseUp);
  }, []);

  useEffect(() => {
    setClockTime();
  }, [counter]);

  useEffect(() => {
    startCounter();
    return () => clearInterval(counterRef.current);
  }, []);

  function onSecondsMouseDown(e) {
    setSecDraggable(true);
    clearInterval(counterRef.current);
    secRef.current.style.zIndex = 100;
    minRef.current.style.zIndex = 10;
  }

  function moveSecondsHand(e) {
    if (!isSecDraggable) return;
    setCounter((prev) => prev + 1);
  }

  function onMinMouseDown(e) {
    setMinDraggable(true);
    clearInterval(counterRef.current);
    minRef.current.style.zIndex = 100;
    secRef.current.style.zIndex = 10;
  }

  function moveMinHand(e) {
    if (!isMinDraggable) return;
    setCounter((prev) => prev + 60);
  }

  function onMinChange(e){
    const val = Number(e.target.value)
   if(val > 60 || val <0){
    alert("NOT ALLOWED")
    return
   }
   setMin(val)
   const currSec = counter%60
   setCounter(currSec + val*60)
  }

  function onSecChange(e){
    const val = Number(e.target.value)
    if(val > 60  || val <0){
      alert("NOT ALLOWED")
      return
    }
    setSec(val)
    const currMin = Math.floor(counter/60)
    setCounter(currMin*60 + val)
  }

  function stopCounter(){
    clearInterval(counterRef.current);
  }

  return (
    <main className="main">
      <div className="clock-container">
        <div className="clock"  ref={clockRef}>
          <div
            ref={secRef}
            className="seconds hand"
            onMouseDown={onSecondsMouseDown}
            onMouseMove={moveSecondsHand}
          ></div>
          <div
            ref={minRef}
            className="minutes hand"
            onMouseDown={onMinMouseDown}
            onMouseMove={moveMinHand}
          ></div>
        </div>
        <div className="time-container">
            <input className="timer" name="min" type="number" placeholder="00" value={min} onFocus={stopCounter} onChange={onMinChange} onBlur={startCounter}/>
            <input className="timer" name="sec" type="number" placeholder="00" value={sec} onFocus={stopCounter} onChange={onSecChange} onBlur={startCounter}/>
        </div>
      </div>
    </main>
  );
}

export default App;
