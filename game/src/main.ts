import './style.css'
import { Game } from "./core/game";

const canvas = document.getElementById("pongCanvas") as HTMLCanvasElement;
const play2PButton = document.getElementById("play2PButton");
const playAIButton = document.getElementById("playAIButton");

if (!canvas || !play2PButton || !playAIButton) {
  throw new Error("Missing required DOM elements to start the game");
}

const game = new Game(canvas);

play2PButton.addEventListener("click", () => {
  game.start("2P", "Player1", "Player2");
});

playAIButton.addEventListener("click", () => {
  game.start("AI", "Player1");
});
