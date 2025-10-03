export const JointTypes = {
	ROLLER: 'roller',
	PINNED: 'pinned',
	FIXED: 'fixed'
};

class Joint {
	constructor(type) {
		if (!Object.values(JointTypes).includes(type)) {
			throw new Error(`Invalid Joint type: ${type}`);
		}
		this.type = type;
	}

	describe() {
		throw new Error('Describe method not implemented for base Joint class');
	}
}

export class RollerJoint extends Joint {
	constructor(pos) {
		super(JointTypes.ROLLER);
		this.pos = pos; // pos along the beam
		this.ry = 0; // Vertical reaction
	}

	describe() {
		return `Roller Joint at ${this.pos} m`;
	}
}

export class PinnedJoint extends Joint {
	constructor(pos) {
		super(JointTypes.PINNED);
		this.pos = pos; // pos along the beam
		this.ry = 0; // Vertical reaction
		this.rx = 0; // Horizontal reaction
	}

	describe() {
		return `Pinned Joint at ${this.pos} m`;
	}
}

export class FixedJoint extends Joint {
	constructor(pos) {
		super(JointTypes.FIXED);
		this.pos = pos; // pos along the beam
		this.ry = 0; // Vertical reaction
		this.rx = 0; // Horizontal reaction
		this.rm = 0; // Moment reaction
	}

	describe() {
		return `Fixed Joint at ${this.pos} m`;
	}
}
