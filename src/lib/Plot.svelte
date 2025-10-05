<script>
	import Plotly from 'plotly.js-dist-min';
	import { onMount } from 'svelte';

	export let data = [];
	export let name;

	let div;

	onMount(() => {
		Plotly.newPlot(
			div,
			[
				{
					x: data.map((d) => d.x),
					y: data.map((d) => d.y),
					type: 'scatter',
					mode: 'lines',
					name: name,
					fill: 'tozeroy',
					fillcolor: 'rgba(160, 132, 232, 0.18)', // pastel lavender shade
					line: { color: '#a084e8' }
				}
			],
			{
				title: name,
				margin: { l: 25, r: 20, t: 40, b: 40 },
				autosize: true,
				height: window.innerHeight / 3,
				font: { size: 13 },
				paper_bgcolor: 'rgba(0,0,0,0)',
				plot_bgcolor: 'rgba(0,0,0,0)',
				dragmode: 'pan',
				xaxis: {
					gridcolor: '#bdbdbd',
					gridwidth: 0.5,
					zeroline: true,
					zerolinecolor: '#888',
					zerolinewidth: 2
				},
				yaxis: {
					gridcolor: '#bdbdbd',
					gridwidth: 0.5,
					zeroline: true,
					zerolinecolor: '#888',
					zerolinewidth: 2
				}
			}
			// { displayModeBar: false }
		);
	});

	// Update plot when data changes
	$: if (div && data) {
		Plotly.react(
			div,
			[
				{
					x: data.map((d) => d.x),
					y: data.map((d) => d.y),
					type: 'scatter',
					mode: 'lines',
					name: name,
					fill: 'tozeroy',
					fillcolor: 'rgba(160, 132, 232, 0.18)',
					line: { color: '#a084e8' }
				}
			],
			{
				title: name,
				margin: { l: 25, r: 20, t: 40, b: 40 },
				autosize: true,
				height: window.innerHeight / 3,
				font: { size: 13 },
				paper_bgcolor: 'rgba(0,0,0,0)',
				plot_bgcolor: 'rgba(0,0,0,0)',
				dragmode: 'pan',
				xaxis: {
					gridcolor: '#bdbdbd',
					gridwidth: 0.5,
					zeroline: true,
					zerolinecolor: '#888',
					zerolinewidth: 2
				},
				yaxis: {
					gridcolor: '#bdbdbd',
					gridwidth: 0.5,
					zeroline: true,
					zerolinecolor: '#888',
					zerolinewidth: 2
				}
			}
			// { displayModeBar: false }
		);
	}
</script>

<div bind:this={div}></div>
