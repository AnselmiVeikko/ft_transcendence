export class Ball {
  x: number;
  y: number;
  radius = 8;
  speedX = Math.random() + 6;
  speedY = Math.random() + 5;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  move() {
    this.x += this.speedX;
    this.y += this.speedY;
  }

  bounce(canvasHeight: number) {
    if (this.y - this.radius < 0) {
      this.y = this.radius;
      this.speedY *= -1;
    } else if (this.y + this.radius > canvasHeight) {
      this.y = canvasHeight - this.radius;
      this.speedY *= -1;
    }
  }

  reset(canvasWidth: number, canvasHeight: number) {
    this.x = canvasWidth;
    this.y = canvasHeight;
    this.speedX *= -1;
    this.speedY *= -1;
  }
}
