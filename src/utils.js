import words from './words';

 export function getRandomWord() {
  return words[Math.floor(Math.random() * words.length)];
}

export default function farewell(avenger) {
  const options = [
    `${avenger} is gone.`,
    `${avenger} has fallen.`,
    `${avenger} eliminated.`,
    `${avenger} is out.`,
    `${avenger} didn't make it.`,
    `${avenger} down.`,
    `${avenger} lost.`,
    `${avenger} has been snapped.`,
    `${avenger} is no longer with us.`,
    `${avenger} has left the fight.`,
  ];

  const randomIndex = Math.floor(Math.random() * options.length);
  return options[randomIndex];
}
