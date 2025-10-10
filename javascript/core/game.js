import { loop } from "./loop.js";
import { config } from "./config.js";
import { inputHandler } from "./input.js";
import { controller } from "./controller.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

export function startGame() {
  document.addEventListener("keydown", inputHandler);
  loop(() => controller(canvas, ctx, config.gridSize), config.startSpeed);
}
