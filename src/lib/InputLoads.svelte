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
	// loads = [new PointLoad(0, 10), new UniformLoad(2, 6, 5), new LinearLoad(7, 10, 1, 10)];
	loads = [
		new ParabolicLoad(1, 5, 1, 11),
		new MomentLoad(6, -10),
		new MomentLoad(8, 10),
		new PointLoad(9, -5),
		new UniformLoad(2, 7, 3),
		new UniformLoad(1, 2, -5),
		new LinearLoad(3, 9, 2, 4),
		new ParabolicLoad(6, 10, 10, 1)
	];

	let selectedType = LoadTypes.POINT;
	let pos, mag, start, end, magStart, magEnd;

	// Refs for focusing
	let posInput, magInput, startInput, endInput, magStartInput, magEndInput;

	function getRequiredFields(type) {
		if (type === LoadTypes.POINT) return [pos, mag];
		if (type === LoadTypes.UNIFORM) return [start, end, mag];
		if (type === LoadTypes.LINEAR) return [start, end, magStart, magEnd];
		if (type === LoadTypes.MOMENT) return [pos, mag];
		return [];
	}

	function allFieldsFilled(type) {
		console.log(getRequiredFields(type));
		console.log(getRequiredFields(type).every((v) => v !== null && v !== undefined && v !== ''));
		return getRequiredFields(type).every((v) => v !== null && v !== undefined && v !== '');
	}

	function handleKeydown(e, type) {
		if (e.key !== 'Enter') return;
		if (allFieldsFilled(type)) {
			addLoad();
			setTimeout(() => {
				if (type === LoadTypes.POINT && posInput) posInput.focus();
				if (type === LoadTypes.UNIFORM && startInput) startInput.focus();
				if (type === LoadTypes.LINEAR && startInput) startInput.focus();
				if (type === LoadTypes.MOMENT && posInput) posInput.focus();
			}, 0);
		}
	}

	function addLoad() {
		if (!allFieldsFilled(selectedType)) return;
		let newLoad;
		if (selectedType === LoadTypes.POINT) {
			newLoad = new PointLoad(pos, mag);
		} else if (selectedType === LoadTypes.UNIFORM) {
			newLoad = new UniformLoad(start, end, mag);
		} else if (selectedType === LoadTypes.LINEAR) {
			newLoad = new LinearLoad(start, end, magStart, magEnd);
		} else if (selectedType === LoadTypes.MOMENT) {
			newLoad = new MomentLoad(pos, mag);
		} else if (selectedType === LoadTypes.PARABOLIC) {
			newLoad = new ParabolicLoad(start, end, magStart, magEnd);
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
	<h2 class="mb-3 text-xl font-bold">Input Loads</h2>
	<div class="mb-3 flex flex-wrap items-end gap-2">
		<select
			bind:value={selectedType}
			class="rounded border border-[#e3d8f3] p-1 focus:ring-2 focus:ring-[#a084e8] focus:outline-none"
		>
			{#each Object.values(LoadTypes) as type}
				<option value={type}>{type}</option>
			{/each}
		</select>

		{#if selectedType === LoadTypes.POINT}
			<label class="flex items-center gap-1 font-medium">
				Position:
				<input
					type="number"
					bind:value={pos}
					bind:this={posInput}
					class="pastel-input w-16 rounded border border-[#e3d8f3] p-1 focus:ring-2 focus:ring-[#a084e8] focus:outline-none"
					min="0"
					on:keydown={(e) => handleKeydown(e, LoadTypes.POINT)}
				/>
			</label>
			<label class="flex items-center gap-1 font-medium">
				Magnitude (kN):
				<input
					type="number"
					bind:value={mag}
					bind:this={magInput}
					class="pastel-input w-16 rounded border border-[#e3d8f3] p-1 focus:ring-2 focus:ring-[#a084e8] focus:outline-none"
					min="0"
					on:keydown={(e) => handleKeydown(e, LoadTypes.POINT)}
				/>
			</label>
		{:else if selectedType === LoadTypes.UNIFORM}
			<label class="flex items-center gap-1 font-medium">
				Start Position:
				<input
					type="number"
					bind:value={start}
					bind:this={startInput}
					class="pastel-input w-16 rounded border border-[#e3d8f3] p-1 focus:ring-2 focus:ring-[#a084e8] focus:outline-none"
					min="0"
					on:keydown={(e) => handleKeydown(e, LoadTypes.UNIFORM)}
				/>
			</label>
			<label class="flex items-center gap-1 font-medium">
				End Position:
				<input
					type="number"
					bind:value={end}
					bind:this={endInput}
					class="pastel-input w-16 rounded border border-[#e3d8f3] p-1 focus:ring-2 focus:ring-[#a084e8] focus:outline-none"
					min="0"
					on:keydown={(e) => handleKeydown(e, LoadTypes.UNIFORM)}
				/>
			</label>
			<label class="flex items-center gap-1 font-medium">
				Magnitude (kN/m):
				<input
					type="number"
					bind:value={mag}
					bind:this={magInput}
					class="pastel-input w-16 rounded border border-[#e3d8f3] p-1 focus:ring-2 focus:ring-[#a084e8] focus:outline-none"
					min="0"
					on:keydown={(e) => handleKeydown(e, LoadTypes.UNIFORM)}
				/>
			</label>
		{:else if selectedType === LoadTypes.LINEAR}
			<label class="flex items-center gap-1 font-medium">
				Start Position:
				<input
					type="number"
					bind:value={start}
					bind:this={startInput}
					class="pastel-input w-16 rounded border border-[#e3d8f3] p-1 focus:ring-2 focus:ring-[#a084e8] focus:outline-none"
					min="0"
					on:keydown={(e) => handleKeydown(e, LoadTypes.LINEAR)}
				/>
			</label>
			<label class="flex items-center gap-1 font-medium">
				End Position:
				<input
					type="number"
					bind:value={end}
					bind:this={endInput}
					class="pastel-input w-16 rounded border border-[#e3d8f3] p-1 focus:ring-2 focus:ring-[#a084e8] focus:outline-none"
					min="0"
					on:keydown={(e) => handleKeydown(e, LoadTypes.LINEAR)}
				/>
			</label>
			<label class="flex items-center gap-1 font-medium">
				Start Magnitude (kN/m):
				<input
					type="number"
					bind:value={magStart}
					bind:this={magStartInput}
					class="pastel-input w-16 rounded border border-[#e3d8f3] p-1 focus:ring-2 focus:ring-[#a084e8] focus:outline-none"
					min="0"
					on:keydown={(e) => handleKeydown(e, LoadTypes.LINEAR)}
				/>
			</label>
			<label class="flex items-center gap-1 font-medium">
				End Magnitude (kN/m):
				<input
					type="number"
					bind:value={magEnd}
					bind:this={magEndInput}
					class="pastel-input w-16 rounded border border-[#e3d8f3] p-1 focus:ring-2 focus:ring-[#a084e8] focus:outline-none"
					min="0"
					on:keydown={(e) => handleKeydown(e, LoadTypes.LINEAR)}
				/>
			</label>
		{:else if selectedType === LoadTypes.MOMENT}
			<label class="flex items-center gap-1 font-medium">
				Position:
				<input
					type="number"
					bind:value={pos}
					bind:this={posInput}
					class="pastel-input w-16 rounded border border-[#e3d8f3] p-1 focus:ring-2 focus:ring-[#a084e8] focus:outline-none"
					min="0"
					on:keydown={(e) => handleKeydown(e, LoadTypes.MOMENT)}
				/>
			</label>
			<label class="flex items-center gap-1 font-medium">
				Magnitude (kN·m):
				<input
					type="number"
					bind:value={mag}
					bind:this={magInput}
					class="pastel-input w-16 rounded border border-[#e3d8f3] p-1 focus:ring-2 focus:ring-[#a084e8] focus:outline-none"
					min="0"
					on:keydown={(e) => handleKeydown(e, LoadTypes.MOMENT)}
				/>
			</label>
		{:else if selectedType === LoadTypes.PARABOLIC}
			<label class="flex items-center gap-1 font-medium">
				Start Position:
				<input
					type="number"
					bind:value={start}
					bind:this={startInput}
					class="pastel-input w-16 rounded border border-[#e3d8f3] p-1 focus:ring-2 focus:ring-[#a084e8] focus:outline-none"
					min="0"
					on:keydown={(e) => handleKeydown(e, LoadTypes.PARABOLIC)}
				/>
			</label>
			<label class="flex items-center gap-1 font-medium">
				End Position:
				<input
					type="number"
					bind:value={end}
					bind:this={endInput}
					class="pastel-input w-16 rounded border border-[#e3d8f3] p-1 focus:ring-2 focus:ring-[#a084e8] focus:outline-none"
					min="0"
					on:keydown={(e) => handleKeydown(e, LoadTypes.PARABOLIC)}
				/>
			</label>
			<label class="flex items-center gap-1 font-medium">
				Start Magnitude (kN/m):
				<input
					type="number"
					bind:value={magStart}
					bind:this={magStartInput}
					class="pastel-input w-16 rounded border border-[#e3d8f3] p-1 focus:ring-2 focus:ring-[#a084e8] focus:outline-none"
					min="0"
					on:keydown={(e) => handleKeydown(e, LoadTypes.PARABOLIC)}
				/>
			</label>
			<label class="flex items-center gap-1 font-medium">
				End Magnitude (kN/m):
				<input
					type="number"
					bind:value={magEnd}
					bind:this={magEndInput}
					class="pastel-input w-16 rounded border border-[#e3d8f3] p-1 focus:ring-2 focus:ring-[#a084e8] focus:outline-none"
				/>
			</label>
		{/if}

		<button
			on:click={addLoad}
			class="pastel-green-btn flex items-center gap-1 rounded px-3 py-1 font-semibold"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-4 w-4"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				><path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M12 4v16m8-8H4"
				/></svg
			>
			Add Load
		</button>
	</div>

	<ul class="divide-y divide-[#f0eafd] rounded-lg border border-[#f0eafd] bg-white">
		{#each loads as load, index}
			<li class="flex items-center justify-between px-3 py-2">
				<span class="text-sm">{load.describe()}</span>
				<button
					on:click={() => removeLoad(index)}
					class="pastel-red-btn flex items-center justify-center rounded-full p-2 transition-colors hover:bg-[#ffe4ec]"
					aria-label="Remove"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-4 w-4"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/></svg
					>
				</button>
			</li>
		{/each}
	</ul>
</div>

<style>
</style>
