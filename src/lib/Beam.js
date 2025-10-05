import { JointTypes } from "./Joint.js";
import { LoadTypes } from "./Load.js";

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
			if (joint.type === "fixed") {
				unknowns += 3; // Vertical, Horizontal, Moment
			} else if (joint.type === "pinned") {
				unknowns += 2; // Vertical, Horizontal
			} else if (joint.type === "roller") {
				unknowns += 1; // Vertical only
			}
		}

		if (unknowns > 3) {
			throw new Error(`The beam is statically indeterminate with ${unknowns} unknowns.`);
		} else if (unknowns < 3) {
			throw new Error(`The beam is unstable with only ${unknowns} unknowns.`);
		}

		// Solve for reactions at joints and verify equilibrium.
		this.solveReactions();

		// All roller joint reactions should be positive (upward)
		for (let joint of this.joints) {
			if (joint.type === JointTypes.ROLLER && joint.ry < 0) {
				throw new Error("Roller joint reaction cannot be negative (downward).");
			}
		}

		return true; // Beam is valid
	}

	solveReactions() {
		// Find net downward force and moment about right end
		let netForce = 0,
			netMoment = 0;
		for (let load of this.loads) {
			netForce += load.calculateEffectAt(this.length).force;
			netMoment += load.calculateEffectAt(this.length).moment;
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
				(rollerJoint.pos * netForce + netMoment - this.length * netForce) /
				(rollerJoint.pos - pinnedJoint.pos);
			rollerJoint.ry = netForce - pinnedJoint.ry;
		} else if (this.joints.length === 1 && this.joints[0].type === JointTypes.FIXED) {
			let fixedJoint = this.joints[0];
			fixedJoint.ry = netForce;
			fixedJoint.rx = 0;
			fixedJoint.rm = -netMoment + netForce * (this.length - fixedJoint.pos);
		} else {
			throw new Error("Unsupported joint configuration for reaction calculation.");
		}

		console.log("Net downward force on beam: ", netForce, " kN");
	}

	calculateBeam() {
		const dx = 0.001;
		// Precalculate effects for custom loads
		for (let load of this.loads) {
			if (load.type === LoadTypes.CUSTOM) {
				load.preCalculateEffects(this.length, dx);
			}
		}

		try {
			this.verifyBeam();
		} catch (error) {
			console.error("Beam verification failed:", error.message);
			alert(`Beam verification failed: ${error.message}`);
			return null;
		}

		console.log(this.length, this.loads, this.joints);

		let shear = [];
		let moment = [];

		for (let x = 0; x <= this.length + dx / 2; x += dx) {
			let v = 0;
			let m = 0;
			for (let load of this.loads) {
				let effect = load.calculateEffectAt(x);
				v -= effect.force;
				m -= effect.moment;
			}

			for (let joint of this.joints) {
				if (joint.pos <= x) {
					if (joint.type === JointTypes.ROLLER || joint.type === JointTypes.PINNED) {
						v += joint.ry;
						m += joint.ry * (x - joint.pos);
					} else if (joint.type === JointTypes.FIXED) {
						v += joint.ry;
						m -= joint.rm;
						m += joint.ry * (x - joint.pos);
					}
				}
			}

			shear.push({ x, y: v });
			moment.push({ x, y: m });
		}

		return { sfd: shear, bmd: moment };
	}
}
