const { solution, dateToMonIndex, DAY_NAMES } = require('./solution');

describe('dateToMonIndex', () => {
	test('maps known dates in 2020 week 1 correctly (Mon-based)', () => {
		expect(dateToMonIndex('2020-01-06')).toBe(0); // Mon
		expect(dateToMonIndex('2020-01-07')).toBe(1); // Tue
		expect(dateToMonIndex('2020-01-08')).toBe(2); // Wed
		expect(dateToMonIndex('2020-01-09')).toBe(3); // Thu
		expect(dateToMonIndex('2020-01-10')).toBe(4); // Fri
		expect(dateToMonIndex('2020-01-11')).toBe(5); // Sat
		expect(dateToMonIndex('2020-01-12')).toBe(6); // Sun
	});
});

describe('solution basic aggregation', () => {
	test('sums by weekday and keeps known values', () => {
		const D = {
			'2020-01-01': 4, // Wed
			'2020-01-02': 4, // Thu
			'2020-01-03': 6, // Fri
			'2020-01-04': 8, // Sat
			'2020-01-05': 2, // Sun
			'2020-01-06': -6, // Mon
			'2020-01-07': 2, // Tue
			'2020-01-08': -2, // Wed (adds to 4)
		};
		const out = solution(D);
		expect(out).toEqual({
			Mon: -6,
			Tue: 2,
			Wed: 2, // 4 + (-2)
			Thu: 4,
			Fri: 6,
			Sat: 8,
			Sun: 2,
		});
	});
});

describe('solution interpolation for missing days', () => {
	test('fills Thu & Fri when missing using mean of prev and next day (linear interpolation)', () => {
		const D = {
			'2020-01-01': 6, // Wed
			'2020-01-04': 12, // Sat
			'2020-01-05': 14, // Sun
			'2020-01-06': 2, // Mon
			'2020-01-07': 4, // Tue
		};
		const out = solution(D);
		expect(out).toEqual({
			Mon: 2,
			Tue: 4,
			Wed: 6,
			Thu: 8,
			Fri: 10,
			Sat: 12,
			Sun: 14,
		});
	});

	test('interpolates through wrap-around (Sun to Mon gap)', () => {
		const D = {
			'2020-01-07': 14, // Tue
			'2020-01-11': -7, // Sat
		};
		const out = solution(D);
		expect(out).toEqual({ Mon: 7, Tue: 14, Wed: 9, Thu: 4, Fri: -2, Sat: -7, Sun: 0 });
	});
});

describe('aggregation across multiple weeks', () => {
	test('sums values for same weekday from different weeks before interpolation', () => {
		const D = {
			'2020-01-06': 3, // Mon week1
			'2020-01-13': 7, // Mon week2
			'2020-01-08': 10, // Wed week1
			'2020-01-15': -5, // Wed week2
			'2020-01-10': 1, // Fri week1

		};
		const out = solution(D);
		// Known: Mon=10, Wed=5, Fri=1
		expect(out.Mon).toBe(10);
		expect(out.Wed).toBe(5);
		expect(out.Fri).toBe(1);
		expect(out.Tue).toBe(8);
		expect(out.Thu).toBe(3);
	});
});

describe('input validation', () => {
	test('throws on invalid date', () => {
		expect(() => solution({ 'not-a-date': 1 })).toThrow(/Invalid date/);
	});
	test('throws on non-numeric value', () => {
		expect(() => solution({ '2020-01-01': 'x' })).toThrow(/Invalid value/);
	});
});

