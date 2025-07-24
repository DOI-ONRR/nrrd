export default function getFiscalYear() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0 = Jan, 9 = Oct

  return (month >= 9) ? year + 1 : year;
}