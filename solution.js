"use strict";

const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function dateToMonIndex(dateStr) {
	const d = new Date(dateStr + "T00:00:00Z");
	if (Number.isNaN(d.getTime())) {
		throw new Error(`Invalid date string: ${dateStr}`);
	}
	const js = d.getUTCDay();
	return (js + 6) % 7;
}

function solution(D) {
	if (!D || typeof D !== "object") throw new Error("Input must be an object");

	const sums = new Array(7).fill(0);
	const present = new Array(7).fill(false);

	for (const [k, v] of Object.entries(D)) {
		const idx = dateToMonIndex(k);
		const val = Number(v);
		if (!Number.isFinite(val)) throw new Error(`Invalid value for ${k}`);
		sums[idx] += val;
		present[idx] = true;
	}

	const values = sums.slice();

	const knownIdxs = [];
	for (let i = 0; i < 7; i++) if (present[i]) knownIdxs.push(i);

	if (knownIdxs.length === 0) {
		return DAY_NAMES.reduce((acc, name) => ({ ...acc, [name]: 0 }), {});
	}

	for (let g = 0; g < knownIdxs.length; g++) {
		const start = knownIdxs[g];
		const end = knownIdxs[(g + 1) % knownIdxs.length];
		const startVal = values[start];
		const endVal = values[end];

		let gapLen = end - start - 1;
		if (gapLen < 0) gapLen += 7;

		if (gapLen <= 0) continue;

		const step = (endVal - startVal) / (gapLen + 1);
		for (let t = 1; t <= gapLen; t++) {
			const idx = (start + t) % 7;
			values[idx] = Math.round(startVal + step * t);
		}
	}

	const result = {};
	for (let i = 0; i < 7; i++) {
		result[DAY_NAMES[i]] = values[i];
	}
	return result;
}

module.exports = { solution, DAY_NAMES, dateToMonIndex };

if (require.main === module) {
	const D = {
		"2020-01-01": 4,
		"2020-01-02": 4,
		"2020-01-03": 6,
		"2020-01-04": 8,
		"2020-01-05": 2,
		"2020-01-06": -6,
		"2020-01-07": 2,
		"2020-01-08": -2,
	};
	console.log(solution(D));
}

