import { Ball } from "./ball";
import { Paddle } from "./paddle";

export function checkCollision(ball: Ball, paddle: Paddle) {
  // check collision area between ball and paddle
  if (
    ball.x - ball.radius < paddle.x + paddle.width &&
    ball.x + ball.radius > paddle.x &&
    ball.y + ball.radius > paddle.y &&
    ball.y - ball.radius < paddle.y + paddle.height
  ) {
    // x reflect
    ball.speedX *= -1;

    // push the ball
    if (ball.speedX > 0) {
      // if the ball is flying to the right
      ball.x = paddle.x + paddle.width + ball.radius;
    } else {
      // if the ball is flying to the left
      ball.x = paddle.x - ball.radius;
    }

    // calculate the reflect angle
    const impactPoint = ball.y - (paddle.y + paddle.height / 2);
    const normalized = impactPoint / (paddle.height / 2);
    const bounceAngle = normalized * (Math.PI / 4); // ±45°

    const currentSpeed = Math.sqrt(ball.speedX ** 2 + ball.speedY ** 2);
    const direction = ball.speedX > 0 ? 1 : -1; // determine the ball direction
    ball.speedX = direction * currentSpeed * Math.cos(bounceAngle);
    ball.speedY = currentSpeed * Math.sin(bounceAngle);
  }
}
