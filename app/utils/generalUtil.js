
export default function sortDatesAscending(date1, date2) {
  // This is a comparison function that will result in dates being sorted in
  // ASCENDING order.
  if (date1 > date2) return 1;
  if (date1 < date2) return -1;
  return 0;
};

export function dateExists(date, data) {
		for (var dc=0; dc<data.length; dc++) {
			var dateEntry = data[dc];
			if (new Date(dateEntry.date).getTime() === date.getTime()) {
				return true;
			}
		}
		return false;
	}
