// src/utils/math.js

export const lagrangeInterpolation = (points, x) => {
  let result = 0;
  
  for (let i = 0; i < points.length; i++) {
    let term = points[i].y;
    
    for (let j = 0; j < points.length; j++) {
      if (i !== j) {
        // SAFETY CHECK: Prevent division by zero if x matches a known point exactly
        if (points[j].x === points[i].x) continue;
        term = term * (x - points[j].x) / (points[j].x - points[i].x);
      }
    }
    result += term;
  }
  
  return result;
};