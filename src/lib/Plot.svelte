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
				margin: { l: 20, r: 20, t: 40, b: 40 },
				autosize: true,
				height: window.innerHeight / 3,
				font: { size: 13 }
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
				margin: { l: 20, r: 20, t: 40, b: 40 },
				autosize: true,
				height: window.innerHeight / 3,
				font: { size: 13 }
			}
			// { displayModeBar: false }
		);
	}
</script>

<div bind:this={div}></div>
