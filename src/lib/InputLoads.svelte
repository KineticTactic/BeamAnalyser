<script>
	import { createEventDispatcher } from 'svelte';
	import {
		Load,
		LoadTypes,
		PointLoad,
		LinearLoad,
		UniformLoad,
		ParabolicLoad,
		MomentLoad
	} from './Load.js';

	const dispatch = createEventDispatcher();

	//let newLoad = new Load();

	export let loads = [];
	loads = [new PointLoad(0, 10), new UniformLoad(2, 6, 5), new LinearLoad(7, 10, 1, 10)];

	let selectedType = LoadTypes.POINT;
	let pos, mag, start, end, magStart, magEnd;

	function addLoad() {
		let newLoad;
		if (selectedType === LoadTypes.POINT) {
			newLoad = new PointLoad(pos, mag);
		} else if (selectedType === LoadTypes.UNIFORM) {
			newLoad = new UniformLoad(start, end, mag);
		} else if (selectedType === LoadTypes.LINEAR) {
			newLoad = new LinearLoad(start, end, magStart, magEnd);
		} else if (selectedType === LoadTypes.MOMENT) {
			newLoad = new MomentLoad(pos, mag);
		}

		loads = [...loads, newLoad];
		dispatch('update', { loads });

		console.log(loads);

		// Reset input fields
		pos = mag = start = end = magStart = magEnd = null;
	}

	function removeLoad(index) {
		loads = loads.filter((_, i) => i !== index);
		dispatch('update', { loads });
	}
</script>

<div class="mb-4">
	<h2 class="mb-2 text-xl font-bold">Input Loads</h2>
	<div class="mb-2">
		<select bind:value={selectedType} class="mr-2 border p-1">
			{#each Object.values(LoadTypes) as type}
				<option value={type}>{type}</option>
			{/each}
		</select>

		{#if selectedType === LoadTypes.POINT}
			<label>
				Position:
				<input type="number" bind:value={pos} class="mr-2 w-16 border p-1" min="0" />
			</label>
			<label>
				Magnitude (kN):
				<input type="number" bind:value={mag} class="mr-2 w-16 border p-1" min="0" />
			</label>
		{:else if selectedType === LoadTypes.UNIFORM}
			<label>
				Start Position:
				<input type="number" bind:value={start} class="mr-2 w-16 border p-1" min="0" />
			</label>
			<label>
				End Position:
				<input type="number" bind:value={end} class="mr-2 w-16 border p-1" min="0" />
			</label>
			<label>
				Magnitude (kN/m):
				<input type="number" bind:value={mag} class="mr-2 w-16 border p-1" min="0" />
			</label>
		{:else if selectedType === LoadTypes.LINEAR}
			<label>
				Start Position:
				<input type="number" bind:value={start} class="mr-2 w-16 border p-1" min="0" />
			</label>
			<label>
				End Position:
				<input type="number" bind:value={end} class="mr-2 w-16 border p-1" min="0" />
			</label>
			<label>
				Start Magnitude (kN/m):
				<input type="number" bind:value={magStart} class="mr-2 w-16 border p-1" min="0" />
			</label>
			<label>
				End Magnitude (kN/m):
				<input type="number" bind:value={magEnd} class="mr-2 w-16 border p-1" min="0" />
			</label>
		{:else if selectedType === LoadTypes.MOMENT}
			<label>
				Position:
				<input type="number" bind:value={pos} class="mr-2 w-16 border p-1" min="0" />
			</label>
			<label>
				Magnitude (kN·m):
				<input type="number" bind:value={mag} class="mr-2 w-16 border p-1" min="0" />
			</label>
		{/if}

		<button on:click={addLoad} class="rounded bg-green-500 px-2 py-1 text-white">Add Load</button>
	</div>

	<ul>
		{#each loads as load, index}
			<li class="mb-1 flex items-center justify-between border-b pb-1">
				<span>{load.describe()}</span>
				<button on:click={() => removeLoad(index)} class="rounded bg-red-500 px-2 py-1 text-white"
					>Remove</button
				>
			</li>
		{/each}
	</ul>
</div>

<style>
</style>
