export const LoadTypes = {
	POINT: 'point',
	UNIFORM: 'uniform',
	LINEAR: 'linear',
	PARABOLIC: 'parabolic',
	MOMENT: 'moment'
};

export class Load {
	constructor(type) {
		if (!Object.values(LoadTypes).includes(type)) {
			throw new Error(`Invalid load type: ${type}`);
		}
		this.type = type;
	}

	describe() {
		throw new Error('Describe method not implemented for base Load class');
	}
}

export class PointLoad extends Load {
	constructor(pos, mag) {
		super(LoadTypes.POINT);
		this.mag = mag; // Positive is downward
		this.pos = pos; // pos along the beam
	}

	describe() {
		return `Point Load: ${this.mag} kN at ${this.pos} m`;
	}
}

export class UniformLoad extends Load {
	constructor(start, end, mag) {
		super(LoadTypes.UNIFORM);
		this.mag = mag; // Positive is downward
		this.start = start; // Start position along the beam
		this.end = end; // End position along the beam
	}

	describe() {
		return `Uniform Load: ${this.mag} kN/m from ${this.start} m to ${this.end} m`;
	}
}

export class LinearLoad extends Load {
	constructor(start, end, startmag, endmag) {
		super(LoadTypes.LINEAR);
		this.startMag = startmag; // mag at start position
		this.endMag = endmag; // mag at end position
		this.start = start; // Start position along the beam
		this.end = end; // End position along the beam
	}

	describe() {
		return `Linear Load: from ${this.startMag} kN/m at ${this.start} m to ${this.endMag} kN/m at ${this.end} m`;
	}
}

export class ParabolicLoad extends Load {
	constructor(start, end, peakmag) {
		super(LoadTypes.PARABOLIC);
		this.peakmag = peakmag; // Peak mag of the parabolic load
		this.start = start; // Start position along the beam
		this.end = end; // End position along the beam
	}

	describe() {
		return `Parabolic Load: peak ${this.peakmag} kN/m from ${this.start} m to ${this.end} m`;
	}
}

export class MomentLoad extends Load {
	constructor(pos, mag) {
		super(LoadTypes.MOMENT);
		this.mag = mag; // Positive is clockwise
		this.pos = pos; // pos along the beam
	}

	describe() {
		return `Moment Load: ${this.mag} kN·m at ${this.pos} m`;
	}
}
