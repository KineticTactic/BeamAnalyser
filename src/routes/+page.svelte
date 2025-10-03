<script>
	import { onMount } from 'svelte';
	import BeamCanvas from '$lib/BeamCanvas.svelte';
	import SFDPlot from '$lib/SFDPlot.svelte';
	import BMDPlot from '$lib/BMDPlot.svelte';
	import InputLoads from '$lib/InputLoads.svelte';
	import InputJoints from '$lib/InputJoints.svelte';
	import { PointLoad } from '$lib/Load';
	import { Beam } from '$lib/Beam';

	let length = 10;
	let loads = [];
	let joints = [];
	$: beam = new Beam(length, loads, joints);

	let results = null;

	function analyze() {
		results = beam.calculateBeam();
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

<BeamCanvas {beam} />
{#if results}
	<SFDPlot data={results.sfd} />
	<BMDPlot data={results.bmd} />
{/if}
