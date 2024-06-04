export function convertDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const formattedDate = `${day}/${month}/${year}`;
  return formattedDate;
}

export function inputDateFormat(dateString) {
  if (dateString !== "") {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  }
  return "";
}

export function inputToDayFormat() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
}

export function compareDates(date1, date2) {
  if (date2) {
    const date1WithoutTime = new Date(date1.slice(0, 10));
    const date2Object = new Date(date2);

    return (
      date1WithoutTime.getFullYear() === date2Object.getFullYear() &&
      date1WithoutTime.getMonth() === date2Object.getMonth() &&
      date1WithoutTime.getDate() === date2Object.getDate()
    );
  } else {
    return true;
  }
}

export function localFormat(dateString) {
  if (dateString !== "") {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const formattedDate = `${day}-${month}-${year}`;
    return formattedDate;
  }
  return "";
}

export function convertDateToLocalTime(utcDateString) {
  const utcDate = new Date(utcDateString);

  const localDate = new Date(utcDate.getTime() + utcDate.getTimezoneOffset() * 60 * 1000);

  localDate.setHours( localDate.getHours());
  localDate.setMinutes(localDate.getMinutes());
  localDate.setSeconds(localDate.getSeconds());

  const year = localDate.getFullYear();
  const month = String(localDate.getMonth() + 1).padStart(2, '0');
  const day = String(localDate.getDate()).padStart(2, '0');
  const hours = localDate.getHours().toString().padStart(2, '0');
  const minutes = localDate.getMinutes().toString().padStart(2, '0');
  const seconds = localDate.getSeconds().toString().padStart(2, '0');

  const formattedDate = `${day}/${month}/${year}`;

  const formattedTime = `${hours}:${minutes}:${seconds}`;

  return `${formattedDate} ${formattedTime}`;
}