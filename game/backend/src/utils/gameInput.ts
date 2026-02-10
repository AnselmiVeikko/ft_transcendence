/**
 * Converts INPUT messages from Game FE into key events for the Game engine.
 */

import type { InputMessage } from "../types/gameState.js";
import type { InputEvent } from "../core/game.js";

/**
 * Apply an InputMessage to the game by calling handleInput with the
 * corresponding keydown/keyup events. Left player uses w/s, right player uses ArrowUp/ArrowDown.
 */
export function applyInputToGame(
  message: InputMessage,
  isLeftPlayer: boolean,
  handleInput: (event: InputEvent) => void
): void {
  if (message.action === "MOVE_UP") {
    const key = isLeftPlayer ? "w" : "ArrowUp";
    handleInput({ type: "keydown", key });
  } else if (message.action === "MOVE_DOWN") {
    const key = isLeftPlayer ? "s" : "ArrowDown";
    handleInput({ type: "keydown", key });
  } else if (message.action === "STOP") {
    if (isLeftPlayer) {
      handleInput({ type: "keyup", key: "w" });
      handleInput({ type: "keyup", key: "s" });
    } else {
      handleInput({ type: "keyup", key: "ArrowUp" });
      handleInput({ type: "keyup", key: "ArrowDown" });
    }
  }
}
