import { useState } from "react";
import { useEffect, useRef } from "react";
import "./App.css";
import Avengers from "./avengers";
import { clsx } from "clsx";
import { getRandomWord } from "./utils";
import Confetti from "react-confetti";
import { useWindowSize } from "@react-hook/window-size";

function App() {
  const [currWordObj, setCurrWordObj] = useState(() => getRandomWord());
  const [currWord, setCurrWord] = useState(currWordObj.word);
  const [hint, setHint] = useState(currWordObj.hint);
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);

  const alphabets = "abcdefghijklmnopqrstuvwxyz";

  const wrongGuesses = guessedLetters.filter(
    (letter) => !currWord.includes(letter)
  ).length;

  const isGameWon = currWord
    .split("")
    .every((letter) => guessedLetters.includes(letter));
  const isGameLost = wrongGuesses >= 10 || timeLeft === 0;

  const isGameOver = isGameLost || isGameWon;

  const [width] = useWindowSize();
  const height = document.documentElement.scrollHeight;

  const resultRef = useRef(null);

  useEffect(() => {
    if (isGameOver && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [isGameOver]);

  useEffect(() => {
    if (!isGameStarted || isGameOver) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isGameStarted, isGameOver]);

  function addLetters(letter) {
    if (!isGameStarted || isGameOver) return;
    setGuessedLetters((prevGuessedLetters) =>
      prevGuessedLetters.includes(letter)
        ? prevGuessedLetters
        : [...prevGuessedLetters, letter]
    );
  }

  function newGame() {
    const newWordObj = getRandomWord();
    setCurrWord(newWordObj.word);
    setHint(newWordObj.hint);
    setGuessedLetters([]);
    setTimeLeft(60);
    setIsGameStarted(false);
  }

  const avengersList = Avengers.map((avenger, index) => {
    const isGone = index < wrongGuesses;
    const styles = {
      backgroundColor: avenger.backgroundColor,
      color: avenger.textColor,
    };

    return (
      <span
        key={avenger.name}
        className={`avengers ${isGone ? "lost" : ""}`}
        style={styles}
      >
        {avenger.name}
      </span>
    );
  });

  const wordEls = currWord.split("").map((letter, index) => {
    const revealWord = isGameLost || guessedLetters.includes(letter);
    const wordClassName = clsx("letter", {
      "missed-letters": isGameLost && !guessedLetters.includes(letter),
    });

    return (
      <span key={index} className={wordClassName}>
        {revealWord ? letter.toUpperCase() : ""}
      </span>
    );
  });

  const alphabetEls = alphabets.split("").map((letter) => {
    const isGuessed = guessedLetters.includes(letter);
    const isCorrect = isGuessed && currWord.includes(letter);
    const isWrong = isGuessed && !currWord.includes(letter);
    const className = clsx({
      correct: isCorrect,
      wrong: isWrong,
    });

    return (
      <button
        className={className}
        disabled={isGameOver}
        onClick={() => addLetters(letter)}
        key={letter}
      >
        {letter.toUpperCase()}
      </button>
    );
  });

  return (
    <main>
      {isGameWon && <Confetti width={width} height={height} />}

      <div className="app-container">
        <header>
          <h1>Endgame</h1>
          <p>
            Guess the word correctly to keep <span>Iron Man </span>alive!
          </p>
          <p className="game-rule">
            For every incorrect guess, an Avenger will fall.
          </p>

          <div className="game-instructions">
            <h2>Instructions -</h2>
            <ul>
              <li>
                You can’t make more than <strong>9 incorrect guesses</strong>.
              </li>
              <li>Each wrong guess eliminates an Avenger.</li>
              <li>
                The word is related to the Avengers universe — heroes, weapons,
                places, or events.
              </li>
            </ul>
          </div>
        </header>

        <section className="avengers-list">{avengersList}</section>

        {!isGameStarted && !isGameOver && (
          <section className="start-screen">
            <button
              className="start-btn"
              onClick={() => setIsGameStarted(true)}
            >
              Start Game
            </button>
          </section>
        )}

        <section className="word">{wordEls}</section>

        {isGameStarted && !isGameLost && !isGameWon && (
          <div className="hint-section">
            <p className="hint-text">[Hint : {hint}]</p>
          </div>
        )}

        {isGameStarted && !isGameOver && (
          <div className="timer-display">Time Left :- {timeLeft} s</div>
        )}

        <p className="wrong-guesses-info">
          Wrong guesses : <span className="wrong-guesses">{wrongGuesses}</span>
        </p>
        <section className="alphabet">{alphabetEls}</section>
        <br />

        {isGameWon && (
          <section ref={resultRef} aria-live="polite" className="status">
            <h3>You Win🎊</h3>
            <p>You saved Iron Man!</p>
          </section>
        )}

        {isGameLost && (
          <section
            ref={resultRef}
            aria-live="polite"
            className={clsx("status-lost", {
              "lost-by-time": timeLeft === 0,
              "lost-by-guesses": timeLeft > 0,
            })}
          >
            <h3>
              {timeLeft === 0
                ? "⏱️ Time’s up !"
                : "❌ You reached the maximum number of incorrect guesses!"}
            </h3>
            <p>You couldn't save Iron Man ⚠️</p>
            <p>Click on New Game button to try again!</p>
          </section>
        )}

        {isGameOver && (
          <section className="new-game">
            <button onClick={newGame}>New Game</button>
          </section>
        )}
      </div>
    </main>
  );
}

export default App;
