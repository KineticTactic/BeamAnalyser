<script>
	import Plotly from "plotly.js-dist-min";
	import { onMount } from "svelte";
	import { formatMag } from "./common";

	export let data = [];
	export let name;

	let div;

	// onMount(() => {
	// 	// Find max magnitude point(s)
	// 	let maxMag = Math.max(...data.map((d) => Math.abs(d.y)));
	// 	let maxPoints = data.filter((d) => Math.abs(d.y) === maxMag);
	// 	Plotly.newPlot(
	// 		div,
	// 		[
	// 			{
	// 				x: data.map((d) => d.x),
	// 				y: data.map((d) => d.y),
	// 				type: 'scatter',
	// 				mode: 'lines',
	// 				name: name,
	// 				fill: 'tozeroy',
	// 				fillcolor: 'rgba(160, 132, 232, 0.18)', // pastel lavender shade
	// 				line: { color: '#a084e8' }
	// 			},
	// 			{
	// 				x: maxPoints.map((d) => d.x),
	// 				y: maxPoints.map((d) => d.y),
	// 				type: 'scatter',
	// 				mode: 'markers+text',
	// 				marker: { color: 'red', size: 10, symbol: 'circle' },
	// 				text: maxPoints.map(() => 'Max'),
	// 				textposition: 'top center',
	// 				name: 'Max Magnitude',
	// 				showlegend: false
	// 			}
	// 		],
	// 		{
	// 			title: name,
	// 			margin: { l: 25, r: 20, t: 40, b: 40 },
	// 			autosize: true,
	// 			height: window.innerHeight / 3,
	// 			font: { size: 13 },
	// 			paper_bgcolor: 'rgba(0,0,0,0)',
	// 			plot_bgcolor: 'rgba(0,0,0,0)',
	// 			dragmode: 'pan',
	// 			xaxis: {
	// 				gridcolor: '#bdbdbd',
	// 				gridwidth: 0.5,
	// 				zeroline: true,
	// 				zerolinecolor: '#888',
	// 				zerolinewidth: 2
	// 			},
	// 			yaxis: {
	// 				gridcolor: '#bdbdbd',
	// 				gridwidth: 0.5,
	// 				zeroline: true,
	// 				zerolinecolor: '#888',
	// 				zerolinewidth: 2
	// 			}
	// 		}
	// 		// { displayModeBar: false }
	// 	);
	// });

	// Update plot when data changes
	$: if (div && data) {
		// Find max magnitude point
		let maxMag = 0;
		let maxPoint = data[0];
		for (let i = 0; i < data.length; i++) {
			if (Math.abs(data[i].y) > maxMag) {
				maxMag = Math.abs(data[i].y);
				maxPoint = data[i];
			}
		}

		Plotly.react(
			div,
			[
				{
					x: data.map((d) => d.x),
					y: data.map((d) => d.y),
					type: "scatter",
					mode: "lines",
					name: name,
					fill: "tozeroy",
					fillcolor: "rgba(160, 132, 232, 0.18)",
					line: { color: "#a084e8" },
					showlegend: false
				},
				{
					x: [maxPoint.x],
					y: [maxPoint.y],
					type: "scatter",
					mode: "markers+text",
					marker: { color: "#a084e8", size: 8, symbol: "circle" },
					text: formatMag(maxMag),
					textposition: "top center",
					name: "Max Magnitude",
					showlegend: false
				}
			],
			{
				title: name,
				margin: { l: 25, r: 20, t: 40, b: 40 },
				autosize: true,
				height: window.innerHeight / 3,
				font: { size: 13 },
				paper_bgcolor: "rgba(0,0,0,0)",
				plot_bgcolor: "rgba(0,0,0,0)",
				dragmode: "pan",
				xaxis: {
					gridcolor: "#bdbdbd",
					gridwidth: 0.5,
					zeroline: true,
					zerolinecolor: "#888",
					zerolinewidth: 2
				},
				yaxis: {
					gridcolor: "#bdbdbd",
					gridwidth: 0.5,
					zeroline: true,
					zerolinecolor: "#888",
					zerolinewidth: 2
				}
			}
			// { displayModeBar: false }
		);
	}
</script>

<div bind:this={div} class="relative">
	<div class="label text-xs font-semibold text-[#a084e8]">{name} Diagram</div>
</div>

<style>
	.relative {
		position: relative;
	}
	.label {
		position: absolute;
		top: 0.69rem;
		left: 0px;
	}
</style>
