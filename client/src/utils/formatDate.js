const formatDate = {
  toNumber: (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return parseInt(`${year}${month}${day}`, 10);
  },
  toString(inputDate) {
    const date = new Date(inputDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${year}/${month}/${day}`
  },
  formatDateDefault(inputDate) {
    const day = inputDate.substring(0, 2);
    const month = inputDate.substring(3, 5);
    const year = inputDate.substring(inputDate.length - 4);
    return `${year}/${month}/${day}`
  },
  getDayNameFromDate: (dateString) => {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dateParts = dateString.split('/');
    const day = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10) - 1; // Months are zero-based (0-11)
    const year = parseInt(dateParts[2], 10);

    const date = new Date(year, month, day);
    const dayIndex = date.getDay();

    return daysOfWeek[dayIndex];
  },
  getDayMonthFromNumber: (dayNumber) => {
    const dateString = dayNumber.toString();
    const day = dateString.slice(6, 8);
    const month = dateString.slice(4, 6);

    return `${day}/${month}`;
  },
  getDateCurrentWeek: () => {
    const today = new Date();
    const firstDayOfWeek = new Date(today);
    firstDayOfWeek.setDate(today.getDate() - 3); // Monday
    const lastDayOfWeek = new Date(today);
    lastDayOfWeek.setDate(today.getDate() + 3); // Sunday

    // Convert the dates to the yyyymmdd number format
    const startDate = parseInt(
      firstDayOfWeek.toISOString().slice(0, 10).replace(/-/g, ''),
      10
    );
    const endDate = parseInt(
      lastDayOfWeek.toISOString().slice(0, 10).replace(/-/g, ''),
      10
    );

    function convertToDDMM(yyyymmdd) {
      const month = yyyymmdd.slice(4, 6);
      const day = yyyymmdd.slice(6, 8);

      return `${day}/${month}`;
    }
    return convertToDDMM(startDate.toString()) + " - " + convertToDDMM(endDate.toString())
  },
  getDayNameFromNumber: (dateNumber, isVietnamese = false) => {
    const dateString = dateNumber.toString();
    const year = dateString.slice(0, 4);
    const month = dateString.slice(4, 6) - 1; // Months are zero-based (0-11)
    const day = dateString.slice(6, 8);

    const date = new Date(year, month, day);
    const dayName = isVietnamese ? date.toLocaleDateString('vi', { weekday: 'long' }) : date.toLocaleDateString('en', { weekday: 'long' });

    return dayName;
  },
  getLastdayWeekNumber: () => {
    const today = new Date();
    const lastDayOfWeek = new Date(today);
    lastDayOfWeek.setDate(today.getDate() + (2 - today.getDay())); // Sunday

    return parseInt(
      lastDayOfWeek.toISOString().slice(0, 10).replace(/-/g, ''),
      10
    );
  },
  getFirstdayWeekNumber: () => {
    const today = new Date();
    const firstDayOfWeek = new Date(today);
    firstDayOfWeek.setDate(today.getDate() - today.getDay() - 2); // Sunday

    return parseInt(
      firstDayOfWeek.toISOString().slice(0, 10).replace(/-/g, ''),
      10
    );
  },
  getFirstDateOfWeek(date) {
    const dayOfWeek = date.getDay();
    const diff = (dayOfWeek === 0 ? 6 : dayOfWeek - 1); // Tính số ngày chênh lệch để tới ngày thứ 2 (0: Chủ nhật, 1: Thứ 2, ..., 6: Thứ 7)

    const monday = new Date(date);
    monday.setDate(date.getDate() - diff); // Trừ số ngày chênh lệch để tìm ngày thứ 2 trong tuần

    return monday;
  },
  getLastDateOfWeek(date) {
    const dayOfWeek = date.getDay();
    const diff = (dayOfWeek === 0 ? 0 : 7 - dayOfWeek); // Tính số ngày chênh lệch để tới ngày Chủ nhật (0: Chủ nhật, 1: Thứ 2, ..., 6: Thứ 7)

    const sunday = new Date(date);
    sunday.setDate(date.getDate() + diff); // Cộng số ngày chênh lệch để tìm ngày Chủ nhật trong tuần

    return sunday;
  },
  getCurrentMondayAndSunday: (currentDate) => {
    const monday = new Date(currentDate);
    const dayOfWeek = currentDate.getDay();

    // Calculate the difference between the current day and Monday (considering Sunday as 0)
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    monday.setDate(currentDate.getDate() + diff);

    // Calculate Sunday by adding 6 days to Monday
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    return {
      monday: formatDate(monday),
      sunday: formatDate(sunday)
    };

    function formatDate(inputDate) {
      const date = new Date(inputDate);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    }
  },
  convertToDate: (dateString) => {
    // Split the date string into date and time parts
    const [datePart, timePart] = dateString.split(' ');

    // Extract date components
    const [day, month, year] = datePart.split('/').map(Number);

    // Extract time components
    const [hours, minutes] = timePart.split(':').map(Number);

    // Create a new Date object using the extracted components
    // Months in JavaScript Date objects are 0-based, so we subtract 1 from the month number
    const dateObj = new Date(year, month - 1, day, hours, minutes);

    return dateObj;
  },
  listDaysFromMondayToSunday(week = 'this_week') {
    let currentDate
    if (week === 'this_week') currentDate = new Date()
    if (week === 'last_week') currentDate = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000)
    if (week === 'next_week') currentDate = new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)


    const monday = new Date(currentDate);
    const dayOfWeek = currentDate.getDay();

    // Calculate the difference between the current day and Monday (considering Sunday as 0)
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    monday.setDate(currentDate.getDate() + diff);

    const days = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      days.push(formatDate(date));
    }

    return days;

    function formatDate(inputDate) {
      const date = new Date(inputDate);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return { stringValue: `${day}/${month}/${year}`, numberValue: Number(year + month + day) };
    }
  },
  numberToString: (dayNumber) => {
    const dateString = dayNumber.toString();
    const day = dateString.slice(6, 8);
    const month = dateString.slice(4, 6);
    const year = dateString.slice(0, 4);

    return `${day}/${month}/${year}`;
  },
  numberToStringMMDDYY: (dayNumber) => {
    const dateString = dayNumber.toString();
    const day = dateString.slice(6, 8);
    const month = dateString.slice(4, 6);
    const year = dateString.slice(0, 4);

    return `${month}/${day}/${year}`;
  },
}

export default formatDate;