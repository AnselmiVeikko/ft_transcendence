export class Paddle {
  name: string;
  x: number;
  y: number;
  width = 12;
  height = 100;
  speed = 10;
  defaultLife = 3;
  life = 3;


  constructor(name: string, x: number, y: number) {
    this.name = name;
    this.x = x;
    this.y = y;
  }

  moveUp() {
    this.y -= this.speed;
  }

  moveDown() {
    this.y += this.speed;
  }
}
