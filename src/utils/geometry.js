export const fitSquares = (x, y, n) =>{
  let sx, sy;

  let px = Math.ceil(Math.sqrt(n * x / y));
  if (Math.floor(px * y / x) * px < n) {
      sx = y / Math.ceil(px * y / x);
  } else {
      sx = x / px;
  }

  let py = Math.ceil(Math.sqrt(n * y / x));
  if (Math.floor(py * x / y) * py < n) {
      sy = x / Math.ceil(x * py / y);
  } else {
      sy = y / py;
  }

  return Math.floor(Math.max(sx, sy));
}