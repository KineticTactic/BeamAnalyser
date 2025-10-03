<script>
	import Plotly from 'plotly.js-dist-min';
	import { onMount } from 'svelte';

	export let data = [];

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
					name: 'Bending Moment'
				}
			],
			{ title: 'Bending Moment Diagram' }
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
					name: 'Bending Moment'
				}
			],
			{ title: 'Bending Moment Diagram' }
		);
	}
</script>

<div bind:this={div}></div>
