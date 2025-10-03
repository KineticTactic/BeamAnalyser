<script>
	import P5 from 'p5-svelte';
	import { LoadTypes } from './Load';
	import { JointTypes } from './Joint';
	import { Beam } from './Beam';
	import { onMount } from 'svelte';

	export let beam = new Beam(10);

	let canvas;

	let beamLength;
	const sketch = (p5) => {
		p5.setup = () => {
			p5.createCanvas(1000, 400);
			beamLength = p5.width - 40;
		};

		p5.draw = () => {
			p5.background(255);
			p5.clear();
			p5.translate(20, 0);
			p5.fill('#8B4513');
			p5.noStroke();
			p5.rect(0, p5.height / 2 - 10, beamLength, 20);
			// Draw loads
			beam.loads.forEach((load) => {
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
					// Implement moment load drawing
				}
			});

			// Draw joints
			beam.joints.forEach((joint) => {
				const x = (joint.pos / beam.length) * beamLength;
				if (joint.type === JointTypes.ROLLER) {
					drawRollerJoint(p5, x, joint.ry);
				} else if (joint.type === JointTypes.PINNED) {
					drawPinJoint(p5, x, joint.ry);
				} else if (joint.type === JointTypes.FIXED) {
					drawFixedJoint(p5, x, joint.ry, joint.rm);
				}
			});

			p5.resetMatrix();
		};
	};

	function drawPointLoad(p5, x, mag) {
		if (mag > 0) {
			// downward
			drawArrow(p5, x, p5.height / 2 - 50, x, p5.height / 2 - 20);
		} else {
			// upward
			drawArrow(p5, x, p5.height / 2 + 50, x, p5.height / 2 + 20);
		}

		// text
		p5.fill('black');
		p5.noStroke();
		p5.textSize(12);
		if (mag > 0) p5.text(`${mag} N`, x - 10, p5.height / 2 - 55);
		else p5.text(`${mag} N`, x - 10, p5.height / 2 + 65);
	}

	function drawArrow(p5, x1, y1, x2, y2, color = 'red') {
		p5.stroke(color);
		p5.strokeWeight(2);
		p5.line(x1, y1, x2, y2);
		// arrowhead
		const angle = -p5.atan2(y2 - y1, x2 - x1);
		const arrowSize = 7;
		p5.push();
		p5.translate(x2, y2);
		p5.rotate(angle - p5.PI / 2);
		p5.fill(color);
		p5.noStroke();
		p5.triangle(-arrowSize, arrowSize * 2 - 8, arrowSize, arrowSize * 2 - 8, 0, -8);
		p5.pop();
	}

	function drawUniformLoad(p5, startX, endX, mag) {
		p5.fill(255, 0, 0, 100);
		p5.noStroke();
		p5.rect(startX, p5.height / 2 - 50, endX - startX, 40);
		// text
		p5.fill(0);
		p5.textSize(12);
		p5.text(`${mag} N/m`, (startX + endX) / 2 - 20, p5.height / 2 - 55);

		// draw series of arrows
		const numArrows = Math.floor((endX - startX) / 30);
		for (let i = 0; i <= numArrows; i++) {
			const x = startX + (i * (endX - startX)) / numArrows;
			drawArrow(p5, x, p5.height / 2 - 50, x, p5.height / 2 - 20, p5.color(255, 0, 0, 100));
		}
	}

	function drawLinearLoad(p5, startX, endX, magStart, magEnd) {
		// Draw trapezoid
		p5.fill(255, 0, 0, 100);
		p5.noStroke();
		p5.beginShape();
		p5.vertex(startX, p5.height / 2 - 10);
		p5.vertex(endX, p5.height / 2 - 10);
		p5.vertex(endX, p5.height / 2 - 10 - (magEnd / Math.max(magStart, magEnd)) * 100);
		p5.vertex(startX, p5.height / 2 - 10 - (magStart / Math.max(magStart, magEnd)) * 100);
		p5.endShape(p5.CLOSE);

		// text
		p5.fill(0);
		p5.textSize(12);
		p5.text(`${magStart} N/m`, startX + 5, p5.height / 2 - 55);
		p5.text(`${magEnd} N/m`, endX - 30, p5.height / 2 - 55);

		// draw arrows at start and end
		drawArrow(
			p5,
			startX,
			p5.height / 2 - 10 - (magStart / Math.max(magStart, magEnd)) * 100,
			startX,
			p5.height / 2 - 10,
			p5.color(255, 0, 0, 100)
		);

		drawArrow(
			p5,
			endX,
			p5.height / 2 - 10 - (magEnd / Math.max(magStart, magEnd)) * 100,
			endX,
			p5.height / 2 - 10,
			p5.color(255, 0, 0, 100)
		);
	}

	function drawRollerJoint(p5, x, ry) {
		p5.fill('violet');
		p5.ellipse(x, p5.height / 2 + 20, 20, 20);
		p5.line(x - 15, p5.height / 2 + 30, x + 15, p5.height / 2 + 30);
		p5.line(x - 10, p5.height / 2 + 35, x + 10, p5.height / 2 + 35);
		p5.line(x - 5, p5.height / 2 + 40, x + 5, p5.height / 2 + 40);

		if (ry > 0) {
			drawArrow(p5, x, p5.height / 2 + 60, x, p5.height / 2 + 35, 'green');
			p5.fill('black');
			p5.noStroke();
			p5.textSize(12);
			p5.text(`${ry} kN`, x + 25, p5.height / 2 + 55);
		}
	}

	function drawPinJoint(p5, x, ry) {
		// Draw triangle
		p5.fill('green');
		p5.triangle(x - 10, p5.height / 2 + 30, x + 10, p5.height / 2 + 30, x, p5.height / 2 + 10);

		if (ry > 0) {
			drawArrow(p5, x, p5.height / 2 + 40 + ry, x, p5.height / 2 + 40, 'green');
			p5.fill('black');
			p5.noStroke();
			p5.textSize(12);
			p5.text(`${ry} kN`, x + 5, p5.height / 2 + 30 + ry + 15);
		}
	}

	function drawFixedJoint(p5, x) {
		p5.fill('darkblue');
		p5.noStroke();
		if (x === 0) {
			p5.rect(x - 10, p5.height / 2 - 30, 10, 70);
		} else if (x === beamLength) {
			p5.rect(x, p5.height / 2 - 30, 10, 70);
		} else {
			p5.rect(x - 5, p5.height / 2 - 30, 10, 70);
		}
	}
</script>

<P5 {sketch} />
