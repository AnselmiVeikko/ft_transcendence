export class Paddle {
  x: number;
  y: number;
  width = 12;
  height = 100;
  speed = 10;
  defaultLife = 3;
  life = 3;


  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  moveUp() {
    this.y -= this.speed;
  }

  moveDown() {
    this.y += this.speed;
  }

  clamp(canvasHeight: number) {
    if (this.y < 0) this.y = 0;
    if (this.y + this.height > canvasHeight)
      this.y = canvasHeight - this.height;
  }
}
