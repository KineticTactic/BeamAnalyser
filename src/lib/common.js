export function formatMag(val) {
	return Number(val) % 1 === 0 ? Number(val).toString() : Number(val).toFixed(2);
}
