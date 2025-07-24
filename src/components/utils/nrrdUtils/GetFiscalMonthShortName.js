export default function getFiscalMonthShortName(monthNumber) {
  const shortMonths = [
    "Oct", "Nov", "Dec", "Jan", "Feb", "Mar",
    "Apr", "May", "Jun", "Jul", "Aug", "Sep"
  ];

  if (monthNumber < 1 || monthNumber > 12) {
    return null;
  }
  return shortMonths[monthNumber - 1];
}