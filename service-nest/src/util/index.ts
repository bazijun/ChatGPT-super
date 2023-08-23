import * as moment from "moment";

interface SendResponseOptions<T = any> {
	type: "Success" | "Fail";
	message?: string;
	data?: T;
}

export function formatDate(): string[] {
	const today = new Date();
	const year = today.getFullYear();
	const month = today.getMonth() + 1;
	const lastDay = new Date(year, month, 0);
	const formattedFirstDay = `${year}-${month.toString().padStart(2, "0")}-01`;
	const formattedLastDay = `${year}-${month
		.toString()
		.padStart(2, "0")}-${lastDay.getDate().toString().padStart(2, "0")}`;
	return [formattedFirstDay, formattedLastDay];
}

export function sendResponse<T>(options: SendResponseOptions<T>) {
	if (options.type === "Success") {
		return Promise.resolve({
			message: options.message ?? null,
			data: options.data ?? null,
			status: options.type,
		});
	}

	// eslint-disable-next-line prefer-promise-reject-errors
	return Promise.reject({
		message: options.message ?? "Failed",
		data: options.data ?? null,
		status: options.type,
	});
}

/** 是否为某天 */
export function isSomeDay(month: number, day: number) {
	const today = moment(new Date()).utcOffset(8);
	const Month = today.month() + 1;
	const Day = today.date();
	return Month === month && Day === day;
}

/** 是否为某时间 */
export function isSomeTime(hour: number, minute: number) {
	const today = moment(new Date()).utcOffset(8);
	const Hour = today.hour();
	const Minute = today.minute();
	return Hour === hour && Minute === minute;
}
