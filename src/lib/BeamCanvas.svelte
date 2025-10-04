<script>
	import P5 from 'p5-svelte';
	import { LoadTypes } from './Load';
	import { JointTypes } from './Joint';
	import { Beam } from './Beam';
	import { onMount } from 'svelte';
	import { max } from 'mathjs';

	export let beam = new Beam(10);

	let canvas;

	function formatMag(val) {
		return Number(val) % 1 === 0 ? Number(val).toString() : Number(val).toFixed(2);
	}

	let beamLength;
	let beamHeight = 20;
	let maxMag;
	let maxRxnMag;
	let maxArrowHeight;

	// Store placed labels so we can check overlaps

	let placedLabels = [];
	let arrowsToDraw = [];
	let labelsToDraw = [];

	const sketch = (p5) => {
		p5.setup = () => {
			let width = window.innerWidth > 1024 ? window.innerWidth / 2 : window.innerWidth - 80;
			p5.createCanvas(width, 250);
			beamLength = p5.width - 40;
			maxArrowHeight = p5.height / 2 - 40;
		};

		p5.draw = () => {
			placedLabels = [];
			arrowsToDraw = [];
			labelsToDraw = [];
			// calculate max mag of any load or reaction
			maxMag = 0;
			maxRxnMag = 0;
			for (let load of beam.loads) {
				if (load.type === LoadTypes.POINT) {
					if (Math.abs(load.mag) > maxMag) maxMag = Math.abs(load.mag);
				} else if (load.type === LoadTypes.UNIFORM) {
					if (Math.abs(load.mag) > maxMag) maxMag = Math.abs(load.mag);
				} else if (load.type === LoadTypes.LINEAR) {
					if (Math.abs(load.startMag) > maxMag) maxMag = Math.abs(load.startMag);
					if (Math.abs(load.endMag) > maxMag) maxMag = Math.abs(load.endMag);
				} else if (load.type === LoadTypes.PARABOLIC) {
					if (Math.abs(load.startMag) > maxMag) maxMag = Math.abs(load.startMag);
					if (Math.abs(load.endMag) > maxMag) maxMag = Math.abs(load.endMag);
				}
			}
			for (let joint of beam.joints) {
				if (Math.abs(joint.ry) > maxRxnMag) maxRxnMag = Math.abs(joint.ry);
			}

			p5.background(255);
			p5.clear();
			p5.translate(20, p5.height / 2);
			p5.fill('#8B4513');
			p5.stroke('black');
			p5.rect(0, -beamHeight / 2, beamLength, beamHeight);

			for (let load of beam.loads) {
				if (load.type === LoadTypes.POINT) {
					drawPointLoad(p5, (load.pos / beam.length) * beamLength, load.mag);
				} else if (load.type === LoadTypes.UNIFORM) {
					drawUniformLoad(
						p5,
						(load.start / beam.length) * beamLength,
						(load.end / beam.length) * beamLength,
						load.mag
					);
				} else if (load.type === LoadTypes.LINEAR) {
					drawLinearLoad(
						p5,
						(load.start / beam.length) * beamLength,
						(load.end / beam.length) * beamLength,
						load.startMag,
						load.endMag
					);
				} else if (load.type === LoadTypes.MOMENT) {
					drawMomentLoad(p5, (load.pos / beam.length) * beamLength, load.mag);
				} else if (load.type === LoadTypes.PARABOLIC) {
					drawParabolicLoad(
						p5,
						(load.start / beam.length) * beamLength,
						(load.end / beam.length) * beamLength,
						load.startMag,
						load.endMag
					);
				}
			}

			for (let joint of beam.joints) {
				const x = (joint.pos / beam.length) * beamLength;
				if (joint.type === JointTypes.ROLLER) {
					drawRollerJoint(p5, x, joint.ry);
				} else if (joint.type === JointTypes.PINNED) {
					drawPinJoint(p5, x, joint.ry);
				} else if (joint.type === JointTypes.FIXED) {
					drawFixedJoint(p5, x, joint.ry, joint.rm);
				}
			}

			drawAllArrowsAndLabels(p5);
			p5.resetMatrix();
		};
	};

	function drawPointLoad(p5, x, mag) {
		drawMagArrow(p5, x, mag, 'red');
	}

	function drawMagArrow(p5, x, mag, color, label = true, unit = 'kN', endOffset = 0, rxn = false) {
		let y = (mag / (rxn ? maxRxnMag : maxMag)) * maxArrowHeight;
		drawArrow(
			p5,
			x,
			(-Math.sign(mag) * beamHeight) / 2 - y,
			x,
			(-Math.sign(mag) * beamHeight) / 2 + endOffset,
			color
		);
		if (label) {
			drawLabel(p5, x, -y - Math.sign(mag) * beamHeight, `${formatMag(mag)} ${unit}`);
		}
	}

	function drawArrow(p5, x1, y1, x2, y2, color = 'red') {
		arrowsToDraw.push({ x1, y1, x2, y2, color });
	}

	function drawLabel(p5, x, y, label) {
		labelsToDraw.push({ x, y, label });
	}

	function drawAllArrowsAndLabels(p5) {
		// Draw all arrows
		for (const arrow of arrowsToDraw) {
			let { x1, y1, x2, y2, color } = arrow;
			let len = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
			let angle = p5.atan2(y2 - y1, x2 - x1);
			let arrowSize = Math.min(7, len / 4);
			p5.push();
			p5.translate(x2, y2);
			p5.rotate(angle - Math.PI / 2);
			p5.stroke(color);
			p5.strokeWeight(2);
			p5.line(0, -arrowSize, 0, -len);
			p5.fill(color);
			p5.noStroke();
			p5.triangle(arrowSize, -arrowSize * 2, -arrowSize, -arrowSize * 2, 0, 0);
			p5.pop();
		}
		// Draw all labels (with overlap avoidance)
		for (const { x, y, label } of labelsToDraw) {
			p5.textSize(14);
			let w = p5.textWidth(label);
			let h = 16; // approximate text height
			let offsetY = 0;
			// Ensure label stays inside horizontal boundaries
			let minX = -20 + w / 2;
			let maxX = p5.width - 20 - w / 2;
			let finalX = p5.constrain(x, minX, maxX);
			// Keep shifting vertically until no overlap
			let tries = 0;
			while (tries < 10) {
				let overlap = false;
				for (let l of placedLabels) {
					if (
						Math.abs(finalX - l.x) < (w + l.w) / 2 &&
						Math.abs(y + offsetY - l.y) < (h + l.h) / 2
					) {
						overlap = true;
						offsetY -= h + 4; // move further up if overlapping
						break;
					}
				}
				if (!overlap) break;
				tries++;
			}
			// Draw the text
			p5.fill('black');
			p5.noStroke();
			p5.textAlign(p5.CENTER, p5.CENTER);
			p5.text(label, finalX, y + offsetY);
			// Save bounding box
			placedLabels.push({ x: finalX, y: y + offsetY, w: w, h: h });
		}
	}

	function drawUniformLoad(p5, startX, endX, mag) {
		p5.fill(255, 0, 0, 100);
		p5.noStroke();
		p5.rect(
			startX,
			-(mag / maxMag) * maxArrowHeight - (Math.sign(mag) * beamHeight) / 2,
			endX - startX,
			(mag / maxMag) * maxArrowHeight
		);
		// draw series of arrows
		const numArrows = Math.floor((endX - startX) / 30);
		for (let i = 0; i <= numArrows; i++) {
			const x = startX + (i * (endX - startX)) / numArrows;
			drawMagArrow(p5, x, mag, p5.color(255, 0, 0, 100), false);
		}

		drawLabel(
			p5,
			(startX + endX) / 2,
			-(mag / maxMag) * maxArrowHeight - Math.sign(mag) * beamHeight,
			`${formatMag(mag)} kN/m`
		);
	}

	function drawLinearLoad(p5, startX, endX, magStart, magEnd) {
		// Draw trapezoid
		p5.fill(255, 0, 0, 100);
		p5.noStroke();
		p5.beginShape();
		p5.vertex(startX, -beamHeight / 2);
		p5.vertex(endX, -beamHeight / 2);
		p5.vertex(endX, -beamHeight / 2 - (magEnd / maxMag) * maxArrowHeight);
		p5.vertex(startX, -beamHeight / 2 - (magStart / maxMag) * maxArrowHeight);
		p5.endShape(p5.CLOSE);

		drawMagArrow(p5, startX, magStart, 'red', true, 'kN/m');
		drawMagArrow(p5, endX, magEnd, 'red', true, 'kN/m');
	}

	function drawParabolicLoad(p5, startX, endX, startMag, endMag) {
		p5.fill(255, 0, 0, 100);
		p5.noStroke();
		p5.beginShape();
		p5.vertex(startX, -beamHeight / 2);
		const numPoints = 20;
		for (let i = 0; i <= numPoints; i++) {
			const t = i / numPoints;
			const x = startX + t * (endX - startX);
			// Parabolic interpolation
			let mag;
			if (startMag < endMag) mag = startMag + (endMag - startMag) * t * t;
			else mag = startMag + (endMag - startMag) * (1 - (1 - t) * (1 - t));
			const y = -beamHeight / 2 - (mag / maxMag) * maxArrowHeight;
			p5.vertex(x, y);
		}
		p5.vertex(endX, -beamHeight / 2);
		p5.endShape(p5.CLOSE);

		drawMagArrow(p5, startX, startMag, 'red', true, 'kN/m');
		drawMagArrow(p5, endX, endMag, 'red', true, 'kN/m');
	}

	function drawMomentLoad(p5, x, mag) {
		const radius = 20;
		p5.noFill();
		p5.stroke('magenta');
		p5.strokeWeight(2);
		if (mag > 0) {
			// clockwise
			p5.arc(x, 0, radius * 2, radius * 2, 0, p5.PI);
			// Arrowhead
			const angle = p5.PI;
			const arrowSize = 7;
			const arrowX = x - radius * p5.cos(angle);
			const arrowY = -radius * p5.sin(angle);
			p5.push();
			p5.translate(arrowX, arrowY);
			p5.rotate(angle + p5.PI / 2);
			p5.fill('magenta');
			p5.noStroke();
			p5.triangle(-arrowSize, arrowSize * 2 - 8, arrowSize, arrowSize * 2 - 8, 0, -8);
			p5.pop();

			drawLabel(p5, x, -radius - 5, `${formatMag(mag)} kN·m`);
		} else {
			// counter-clockwise
			p5.arc(x, 0, radius * 2, radius * 2, p5.PI, 0);
			// Arrowhead
			const angle = 0;
			const arrowSize = 7;
			const arrowX = x + radius * p5.cos(angle);
			const arrowY = -radius * p5.sin(angle);
			p5.push();
			p5.translate(arrowX, arrowY);
			p5.rotate(angle - p5.PI / 2);
			p5.fill('magenta');
			p5.noStroke();
			p5.triangle(-arrowSize, arrowSize * 2 - 8, arrowSize, arrowSize * 2 - 8, 0, -8);
			p5.pop();

			// Moment text
			p5.fill('black');
			p5.noStroke();
			p5.textSize(12);
			p5.text(`${formatMag(mag)} kN·m`, x + radius + 5, +20);
		}
		// Dot
		p5.fill('magenta');
		p5.noStroke();
		p5.ellipse(x, 0, 5, 5);
	}

	function drawRollerJoint(p5, x, ry) {
		p5.fill('purple');
		p5.noStroke();
		p5.ellipse(x, +20, 20, 20);
		p5.stroke('black');
		p5.line(x - 15, +30, x + 15, +30);
		p5.line(x - 10, +35, x + 10, +35);
		p5.line(x - 5, +40, x + 5, +40);

		if (ry != 0) {
			drawMagArrow(p5, x, -ry, 'green', true, 'kN', 20, true);
		}
	}

	function drawPinJoint(p5, x, ry) {
		p5.fill('purple');
		p5.noStroke();
		p5.triangle(x - 10, 30, x + 10, 30, x, 10);

		if (ry !== 0) {
			drawMagArrow(p5, x, -ry, 'green', true, 'kN', 20, true);
		}
	}

	function drawFixedJoint(p5, x, ry, rm) {
		p5.fill('purple');
		p5.noStroke();
		if (x === 0) {
			p5.rect(x - 10, -30, 10, 70);
		} else if (x === beamLength) {
			p5.rect(x, -30, 10, 70);
		} else {
			p5.rect(x - 5, -30, 10, 70);
		}

		if (ry !== 0) {
			drawMagArrow(p5, x, ry, 'green', true, 'kN', 20, true);
		}

		if (rm !== 0) {
			// Draw moment arrow
			const radius = 15;
			p5.noFill();
			p5.stroke('green');
			p5.strokeWeight(2);
			p5.arc(x, 0, radius * 2, radius * 2, 0, p5.PI);
			// Arrowhead
			const angle = p5.PI;
			const arrowSize = 7;
			const arrowX = x - radius * p5.cos(angle);
			const arrowY = -radius * p5.sin(angle);
			p5.push();
			p5.translate(arrowX, arrowY);
			p5.rotate(angle + p5.PI / 2);
			p5.fill('green');
			p5.noStroke();
			p5.triangle(-arrowSize, arrowSize * 2 - 8, arrowSize, arrowSize * 2 - 8, 0, -8);
			p5.pop();

			drawLabel(p5, x, -radius - 5, `${formatMag(rm)} kN·m`);
		}
	}
</script>

<P5 {sketch} />
