<script>
	import { onMount } from 'svelte';
	import BeamCanvas from '$lib/BeamCanvas.svelte';
	import SFDPlot from '$lib/SFDPlot.svelte';
	import BMDPlot from '$lib/BMDPlot.svelte';
	import { calculateBeam } from '$lib/calculations.js';
	import InputLoads from '$lib/InputLoads.svelte';
	import InputJoints from '$lib/InputJoints.svelte';
	import { PointLoad } from '$lib/Load';

	let length = 10;
	let loads = [];
	let joints = [];

	let results = null;

	function analyze() {
		console.log('ANALYSING');
		results = calculateBeam(length, loads, joints);
	}
</script>

<h1 class="mb-4 text-2xl font-bold">Beam Analyzer</h1>

<InputLoads bind:loads />
<InputJoints bind:joints />

<div class="mb-4">
	<label>
		Beam Length:
		<input type="number" bind:value={length} class="border p-1" />
	</label>
	<button on:click={analyze} class="ml-2 rounded bg-blue-500 px-2 py-1 text-white">
		Analyze
	</button>
</div>

{#if results}
	<BeamCanvas {length} {loads} />
	<SFDPlot data={results.sfd} />
	<BMDPlot data={results.bmd} />
{/if}
