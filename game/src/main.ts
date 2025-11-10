import './style.css'
import { initGame } from './game';

const canvas = document.getElementById('pongCanvas') as HTMLCanvasElement
const ctx = canvas.getContext('2d')
if (!ctx) throw new Error('Cannot get canvas context')

// Welcome windows
ctx.fillStyle = '#ffffff';
ctx.font = '24px Arial';
ctx.fillText('Welcome to Pong!', 300, 300);

initGame();