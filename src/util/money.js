export function formatToVND(number) {
  const formatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });

  return formatter.format(number);
}

export function formatNumber(number) {
  const formatter = new Intl.NumberFormat("vi-VN", {
    style: 'decimal', 
    minimumFractionDigits: 0, 
    maximumFractionDigits: 0, 
  });

  return formatter.format(number);
}
