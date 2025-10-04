<script>
	import Footer from '$lib/Footer.svelte';
	import { onMount } from 'svelte';
	import BeamCanvas from '$lib/BeamCanvas.svelte';
	import Plot from '$lib/Plot.svelte';
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

<div class="flex flex-col">
	<div class="m-3 flex-1 sm:m-6">
		<div class="flex flex-col gap-4 sm:gap-6 lg:flex-row">
			<!-- Left: Inputs -->
			<div class="pastel-panel flex flex-1 flex-col gap-2 rounded-xl p-3 shadow-md sm:gap-4 sm:p-6">
				<h1 class="pastel-heading mb-4 text-2xl font-bold">Beam Analyser</h1>
				<div class="mb-2">
					<label class="pastel-label font-semibold">
						Beam Length:
						<input
							type="number"
							bind:value={length}
							class="pastel-input ml-2 w-24 rounded border p-1"
						/>
					</label>
				</div>
				<InputLoads bind:loads />
				<InputJoints bind:joints />
				<button
					on:click={analyze}
					class="pastel-button mt-4 w-full rounded py-2 text-lg font-bold shadow transition-colors duration-200"
				>
					Analyse
				</button>
			</div>

			<!-- Right: Diagram and Plots -->
			<div class="pastel-panel flex flex-1 flex-col rounded-xl p-3 shadow-md sm:gap-4 sm:p-6">
				<BeamCanvas {beam} />
				{#if results}
					<Plot data={results.sfd} name="Shear Force" />
					<Plot data={results.bmd} name="Bending Moment" />
				{/if}
			</div>
		</div>
	</div>
</div>
<Footer />
