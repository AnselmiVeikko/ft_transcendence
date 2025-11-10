export class Ball {
  x: number;
  y: number;
  radius = 8;
  speedX = 5;
  speedY = 3;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  move() {
    this.x += this.speedX;
    this.y += this.speedY;
  }

  bounce(canvasHeight: number) {
    if (this.y - this.radius < 0 || this.y + this.radius > canvasHeight)
      this.speedY *= -1;
  }

  reset(canvasWidth: number, canvasHeight: number) {
    this.x = canvasWidth / 2;
    this.y = canvasHeight / 2;
    this.speedX *= -1;
  }
}
