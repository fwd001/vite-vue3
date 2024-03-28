// 风险等级字符串更改为数组
export function splitStringToIntArray(str: string): number[] {
  // 使用 "-" 分割字符串
  const parts = str.split('-');

  // 将分割后的每个部分转换为数字，并存储在新的数组中
  const numbers = parts.map((part) => parseFloat(part));

  // 返回数字数组
  return numbers;
}
