import { JointTypes } from './Joint.js';
import { LoadTypes } from './Load.js';

export class Beam {
	constructor(length, loads = [], joints = []) {
		this.length = length; // Length of the beam in meters
		this.loads = loads; // Array to hold loads applied to the beam
		this.joints = joints; // Array to hold joints on the beam
	}

	addLoad(load) {
		this.loads.push(load);
	}

	addJoint(joint) {
		this.joints.push(joint);
	}

	verifyBeam() {
		// Ensure all loads and joints are within the beam length
		for (let load of this.loads) {
			if (load.type === LoadTypes.POINT || load.type === LoadTypes.MOMENT) {
				if (load.pos < 0 || load.pos > this.length) {
					throw new Error(`Load at position ${load.pos} m is out of beam bounds.`);
				}
			} else if (
				load.type === LoadTypes.UNIFORM ||
				load.type === LoadTypes.LINEAR ||
				load.type === LoadTypes.PARABOLIC
			) {
				if (load.start < 0 || load.end > this.length || load.start >= load.end) {
					throw new Error(
						`Load from ${load.start} m to ${load.end} m is out of beam bounds or invalid.`
					);
				}
			}
		}

		for (let joint of this.joints) {
			if (joint.pos < 0 || joint.pos > this.length) {
				throw new Error(`Joint at position ${joint.pos} m is out of beam bounds.`);
			}
		}

		// Verify if the number of unknowns in reactions at joints is equal to the number of equations available (3 for 2D problems)
		let unknowns = 0;
		for (let joint of this.joints) {
			if (joint.type === 'fixed') {
				unknowns += 3; // Vertical, Horizontal, Moment
			} else if (joint.type === 'pinned') {
				unknowns += 2; // Vertical, Horizontal
			} else if (joint.type === 'roller') {
				unknowns += 1; // Vertical only
			}
		}

		if (unknowns > 3) {
			throw new Error(`The beam is statically indeterminate with ${unknowns} unknowns.`);
		} else if (unknowns < 3) {
			throw new Error(`The beam is unstable with only ${unknowns} unknowns.`);
		}

		// Solve for reactions at joints and verify equilibrium.

		// Find net downward force
		this.solveReactions();

		// All roller joint reactions should be positive (upward)
		for (let joint of this.joints) {
			if (joint.type === JointTypes.ROLLER && joint.ry < 0) {
				throw new Error('Roller joint reaction cannot be negative (downward).');
			}
		}

		return true; // Beam is valid
	}

	solveReactions() {
		// Find net downward force
		let netForce = 0;
		for (let load of this.loads) {
			if (load.type === LoadTypes.POINT) {
				netForce += load.mag;
			} else if (load.type === LoadTypes.UNIFORM) {
				netForce += load.mag * (load.end - load.start);
			} else if (load.type === LoadTypes.LINEAR) {
				netForce += ((load.startMag + load.endMag) / 2) * (load.end - load.start);
			} else if (load.type === LoadTypes.PARABOLIC) {
				// Assuming parabolic load defined by startMag and endMag
				netForce +=
					((load.startMag + 4 * ((load.startMag + load.endMag) / 2) + load.endMag) / 6) *
					(load.end - load.start);
			}
		}

		// Find net moment about left end
		let netMoment = 0;
		for (let load of this.loads) {
			if (load.type === LoadTypes.POINT) {
				netMoment += load.mag * load.pos;
			} else if (load.type === LoadTypes.UNIFORM) {
				let w = load.mag * (load.end - load.start);
				let centroid = (load.start + load.end) / 2;
				netMoment += w * centroid;
			} else if (load.type === LoadTypes.LINEAR) {
				let w = ((load.startMag + load.endMag) / 2) * (load.end - load.start);
				let centroid = load.start + (2 / 3) * (load.end - load.start); // centroid of triangular load
				netMoment += w * centroid;
			} else if (load.type === LoadTypes.PARABOLIC) {
				let w =
					((load.startMag + 4 * ((load.startMag + load.endMag) / 2) + load.endMag) / 6) *
					(load.end - load.start);
				let centroid = load.start + (3 / 4) * (load.end - load.start); // centroid of parabolic load
				netMoment += w * centroid;
			} else if (load.type === LoadTypes.MOMENT) {
				netMoment += load.mag; // Moment applied directly
			}
		}

		if (
			this.joints.length === 2 &&
			this.joints.some((j) => j.type === JointTypes.PINNED) &&
			this.joints.some((j) => j.type === JointTypes.ROLLER)
		) {
			let pinnedJoint = this.joints.find((j) => j.type === JointTypes.PINNED);
			let rollerJoint = this.joints.find((j) => j.type === JointTypes.ROLLER);

			pinnedJoint.rx = 0; // No horizontal loads in this scenario
			pinnedJoint.ry =
				(netMoment - netForce * rollerJoint.pos) / (pinnedJoint.pos - rollerJoint.pos);
			rollerJoint.ry = netForce - pinnedJoint.ry;
		} else if (this.joints.length === 1 && this.joints[0].type === JointTypes.FIXED) {
			let fixedJoint = this.joints[0];
			fixedJoint.ry = netForce;
			fixedJoint.rx = 0;
			fixedJoint.rm = netMoment;
		} else {
			throw new Error('Unsupported joint configuration for reaction calculation.');
		}

		console.log('Net downward force on beam: ', netForce, ' kN');
	}

	calculateBeam() {
		try {
			this.verifyBeam();
		} catch (error) {
			console.error('Beam verification failed:', error.message);
			alert(`Beam verification failed: ${error.message}`);
			return null;
		}

		const dx = 0.01;
		console.log(this.length, this.loads, this.joints);

		let shear = [];
		let moment = [];

		for (let x = 0; x <= this.length; x += dx) {
			let v = 0;
			let m = 0;
			for (let load of this.loads) {
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

			for (let joint of this.joints) {
				if (joint.pos <= x) {
					if (joint.type === JointTypes.ROLLER || joint.type === JointTypes.PINNED) {
						v += joint.ry;
						m += joint.ry * (x - joint.pos);
					} else if (joint.type === JointTypes.FIXED) {
						v += joint.ry;
						m += joint.rm;
					}
				}
			}

			shear.push({ x, y: v });
			moment.push({ x, y: m });
		}

		return { sfd: shear, bmd: moment };
	}
}
