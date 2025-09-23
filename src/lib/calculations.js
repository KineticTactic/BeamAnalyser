import { range } from 'mathjs';
import { LoadTypes } from './Load';
import { e } from 'mathjs';

export function calculateBeam(length, loads, joints) {
	const dx = 0.1;
	console.log(length, loads, joints);

	let shear = [];
	let moment = [];

	for (let x = 0; x <= length; x += dx) {
		let v = 0;
		let m = 0;
		for (let load of loads) {
			if (load.type === LoadTypes.POINT) {
				if (x >= load.pos) {
					v -= load.mag;
					m -= load.mag * (x - load.pos);
				}
			} else if (load.type === LoadTypes.UNIFORM) {
				if (x >= load.start) {
					let loadLength = Math.min(x, load.end) - load.start;
					if (loadLength > 0) {
						let w = load.mag * loadLength;
						v -= w;
						m -= w * (x - (load.start + loadLength / 2));
					}
				}
			} else if (load.type === LoadTypes.LINEAR) {
				if (x >= load.start) {
					let loadLength = Math.min(x, load.end) - load.start;
					if (loadLength > 0) {
						let w =
							((load.startMag +
								(load.endMag - load.startMag) * (loadLength / (load.end - load.start))) /
								2) *
							loadLength;
						v -= w;
						m -= w * (x - (load.start + loadLength / 3)); // centroid of triangular load
					}
				}
			} else if (load.type === LoadTypes.MOMENT) {
				if (x >= load.pos) {
					m -= load.mag;
				}
			}
		}
		shear.push({ x, y: v });
		moment.push({ x, y: m });
	}

	return { sfd: shear, bmd: moment };
}
