import { parser } from "mathjs";

export const LoadTypes = {
	POINT: "point",
	UNIFORM: "uniform",
	LINEAR: "linear",
	PARABOLIC: "parabolic",
	MOMENT: "moment",
	CUSTOM: "custom"
};

export class LoadEffect {
	constructor(force, moment) {
		this.force = force; // Shear force at a point
		this.moment = moment; // Bending moment at a point
	}
}

export class Load {
	constructor(type) {
		if (!Object.values(LoadTypes).includes(type)) {
			throw new Error(`Invalid load type: ${type}`);
		}
		this.type = type;
		this.maxMag = 0;
	}

	describe() {
		throw new Error("Describe method not implemented for base Load class");
	}
}

export class PointLoad extends Load {
	constructor(pos, mag) {
		super(LoadTypes.POINT);
		this.mag = mag; // Positive is downward
		this.pos = pos; // pos along the beam
		this.maxMag = mag;
	}

	describe() {
		return `${this.mag} kN at ${this.pos} m`;
	}

	calculateEffectAt(x) {
		if (x < this.pos) {
			return new LoadEffect(0, 0);
		}

		let w = this.mag;
		let m = this.mag * (x - this.pos);
		return new LoadEffect(w, m);
	}
}

export class UniformLoad extends Load {
	constructor(start, end, mag) {
		super(LoadTypes.UNIFORM);
		this.mag = mag; // Positive is downward
		this.start = start; // Start position along the beam
		this.end = end; // End position along the beam
		this.maxMag = mag;
	}

	describe() {
		return `${this.mag} kN/m from ${this.start} m to ${this.end} m`;
	}

	calculateEffectAt(x) {
		if (x < this.start) {
			return new LoadEffect(0, 0);
		}

		let w = 0;
		let m = 0;
		if (x >= this.start && x <= this.end) {
			let length = x - this.start;
			w = this.mag * length;
			m = (this.mag * length * length) / 2;
		} else if (x > this.end) {
			let length = this.end - this.start;
			w = this.mag * length;
			m = this.mag * length * (x - this.start - length / 2);
		}

		return new LoadEffect(w, m);
	}
}

export class LinearLoad extends Load {
	constructor(start, end, startmag, endmag) {
		super(LoadTypes.LINEAR);
		this.startMag = startmag; // mag at start position
		this.endMag = endmag; // mag at end position
		this.start = start; // Start position along the beam
		this.end = end; // End position along the beam
		this.maxMag = Math.max(Math.abs(startmag), Math.abs(endmag));
	}

	describe() {
		return `from ${this.startMag} kN/m at ${this.start} m to ${this.endMag} kN/m at ${this.end} m`;
	}

	calculateEffectAt(x) {
		if (x < this.start) {
			return new LoadEffect(0, 0);
		}

		// h stores the deviation of the force at position x from startMag
		// length is the length from start to x (or to end if x > end)
		let h, length;

		if (x >= this.start && x <= this.end) {
			// linear interpolation
			h = ((this.endMag - this.startMag) * (x - this.start)) / (this.end - this.start);
			length = x - this.start;
		} else if (x > this.end) {
			h = this.endMag - this.startMag;
			length = this.end - this.start;
		}

		let rectangleArea;
		// IF h is negative, startMag > endMag
		// so the rectangle area is (startMag - h) * length
		// otherwise it's startMag * length
		if (h < 0) {
			h = -h;
			rectangleArea = (this.startMag - h) * length;
		} else {
			rectangleArea = this.startMag * length;
		}
		let rectangleCentroid = this.start + length / 2;

		// Triangle area is (1/2) * base * height
		let triangleArea = (h * length) / 2;
		// Triangle centroid is located at 1/3 from the base to the peak
		// If startMag < endMag, centroid is at 2/3 from start to end
		// If startMag > endMag, centroid is at 1/3 from start to end
		let triangleCentroid =
			this.startMag < this.endMag ? this.start + (2 * length) / 3 : this.start + length / 3;

		let centroid =
			(triangleArea * triangleCentroid + rectangleArea * rectangleCentroid) /
			(triangleArea + rectangleArea);

		let w = triangleArea + rectangleArea;
		let m = w * (x - centroid);

		return new LoadEffect(w, m);
	}
}

export class ParabolicLoad extends Load {
	constructor(start, end, startmag, endmag) {
		super(LoadTypes.PARABOLIC);
		this.startMag = startmag; // mag at start position
		this.endMag = endmag; // mag at end position
		this.start = start; // Start position along the beam
		this.end = end; // End position along the beam
		this.maxMag = Math.max(Math.abs(startmag), Math.abs(endmag));
	}

	describe() {
		return `from ${this.startMag} kN/m at ${this.start} m to ${this.endMag} kN/m at ${this.end} m`;
	}

	calculateEffectAt(x) {
		if (x < this.start) {
			return new LoadEffect(0, 0);
		}

		if (this.endMag > this.startMag) {
			// assume y = ax^2
			// find a using boundary conditions
			// h is height at x = loadLength
			let a = (this.endMag - this.startMag) / (this.end - this.start) ** 2;
			let length = Math.min(x, this.end) - this.start;
			let h = a * length ** 2;

			let parabolaCentroid = this.start + (3 * length) / 4;
			let parabolaArea = (length * h) / 3;

			let rectangleCentroid = (this.start + this.end) / 2;
			let rectangleArea = length * this.startMag;

			let centroid =
				(rectangleArea * rectangleCentroid + parabolaArea * parabolaCentroid) /
				(rectangleArea + parabolaArea);

			let w = rectangleArea + parabolaArea;
			let m = w * (x - centroid);
			return new LoadEffect(w, m);
		} else if (this.startMag > this.endMag) {
			// y = ax^2
			let a = (this.startMag - this.endMag) / (this.end - this.start) ** 2;
			let length = Math.min(x, this.end) - this.start;
			let h = a * (this.end - this.start - length) ** 2;

			let fullParabolaCentroid = this.start + (this.end - this.start) / 4;
			let fullParabolaArea = ((this.end - this.start) * (this.startMag - this.endMag)) / 3;

			let smallParabolaCentroid = this.start + length + (this.end - this.start - length) / 4;
			let smallParabolaArea = ((this.end - this.start - length) * h) / 3;

			let rectangleCentroid = (this.start + this.end) / 2;
			let rectangleArea = length * this.endMag;

			let totalArea = rectangleArea + fullParabolaArea - smallParabolaArea;
			let totalMoment =
				rectangleArea * rectangleCentroid +
				fullParabolaArea * fullParabolaCentroid -
				smallParabolaArea * smallParabolaCentroid;

			let centroid = totalMoment / totalArea;

			let w = rectangleArea + fullParabolaArea - smallParabolaArea;
			let m = w * (x - centroid);
			return new LoadEffect(w, m);
		} else {
			// startMag == endMag, treat as uniform load
			let length = Math.min(x, this.end) - this.start;
			let w = this.startMag * length;
			let m = w * (x - (this.start + length / 2));
			return new LoadEffect(w, m);
		}
	}
}

export class MomentLoad extends Load {
	constructor(pos, mag) {
		super(LoadTypes.MOMENT);
		this.mag = mag; // Positive is clockwise
		this.pos = pos; // pos along the beam
	}

	describe() {
		return `${this.mag} kN·m at ${this.pos} m`;
	}

	calculateEffectAt(x) {
		if (x < this.pos) {
			return new LoadEffect(0, 0);
		}

		let m = this.mag;
		return new LoadEffect(0, m);
	}
}

export class CustomLoad extends Load {
	constructor(start, end, loadExpr) {
		super(LoadTypes.CUSTOM);
		this.start = start; // Start position along the beam
		this.end = end; // End position along the beam
		this.loadExpr = loadExpr; // Expression defining load intensity at position x
		this.parser = parser();
		this.parser.evaluate(`f(x) = ${this.loadExpr}`);
		this.loadFunc = this.parser.get("f");

		this.dx = 0.001;
		this.effectsCache = [];
	}

	describe() {
		return `custom load ${this.loadExpr} from ${this.start} m to ${this.end} m`;
	}

	preCalculateEffects(length, dx) {
		this.effectsCache = Array(Math.ceil(length / dx) + 1).fill(0);
		this.dx = dx;
		this.maxMag = 0;

		let wSum = 0;
		let wxSum = 0;
		console.log("Precalculating...");

		for (let i = 0; i < this.effectsCache.length; i++) {
			let x = i * dx;

			if (x < this.start) {
				this.effectsCache[i] = new LoadEffect(0, 0);
			} else if (x >= this.start && x <= this.end) {
				let forcePerUnit = this.loadFunc(x);

				this.maxMag = Math.max(this.maxMag, Math.abs(forcePerUnit));

				let w = forcePerUnit * dx;
				wSum += w;

				wxSum += w * x;

				let centroid = wxSum / wSum;
				let m = wSum * (x - centroid);
				this.effectsCache[i] = new LoadEffect(wSum, m);
			} else if (x > this.end) {
				let centroid = wxSum / wSum;
				let m = wSum * (x - centroid);
				this.effectsCache[i] = new LoadEffect(wSum, m);
			}
		}
	}

	calculateEffectAt(x) {
		return this.effectsCache[Math.floor(x / this.dx)];
	}
}
