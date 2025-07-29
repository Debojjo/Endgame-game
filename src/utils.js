import words from './words';

 export function getRandomWord() {
  return words[Math.floor(Math.random() * words.length)];
}
