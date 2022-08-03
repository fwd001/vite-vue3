/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-ignore
Array.prototype.at = function at(n: any): any {
  // Convert the argument to an integer
  n = Math.trunc(n) || 0 // 去掉小数点
  // Allow negative indexing from the end
  if (n < 0) n += this.length
  // Out-of-bounds access returns undefined
  if (n < 0 || n >= this.length) return undefined
  // Otherwise, this is just normal property access
  return this[n]
}
