import { setDirection } from "./state.js";

export function inputHandler(e) {
  switch (e.keyCode) {
    case 37:
      setDirection(-1, 0);
      break;
    case 38:
      setDirection(0, -1);
      break;
    case 39:
      setDirection(1, 0);
      break;
    case 40:
      setDirection(0, 1);
      break;
  }
}
