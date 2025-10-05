<script>
	import { createEventDispatcher } from "svelte";
	import {
		Load,
		LoadTypes,
		PointLoad,
		LinearLoad,
		UniformLoad,
		ParabolicLoad,
		MomentLoad
	} from "./Load.js";
	import InputField from "./InputField.svelte";
	import ChipSelect from "./ChipSelect.svelte";

	const dispatch = createEventDispatcher();

	//let newLoad = new Load();

	export let loads = [];
	// loads = [new PointLoad(0, 10), new UniformLoad(2, 6, 5), new LinearLoad(7, 10, 1, 10)];
	loads = [
		new ParabolicLoad(1, 5, 1, 11),
		new MomentLoad(8, 10),
		new UniformLoad(2, 5, -5),
		new LinearLoad(3, 9, 2, 4),
		new PointLoad(0.5, 10)
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
		if (type === LoadTypes.PARABOLIC) return [start, end, magStart, magEnd];
		return [];
	}

	function allFieldsFilled(type) {
		console.log(type);

		console.log(getRequiredFields(type));
		console.log(getRequiredFields(type).every((v) => v !== null && v !== undefined && v !== ""));
		return getRequiredFields(type).every((v) => v !== null && v !== undefined && v !== "");
	}

	function handleKeydown(e, type) {
		if (e.key !== "Enter") return;

		if (allFieldsFilled(type)) {
			addLoad();
			setTimeout(() => {
				if (type === LoadTypes.POINT && posInput) posInput.focus();
				if (type === LoadTypes.UNIFORM && startInput) startInput.focus();
				if (type === LoadTypes.LINEAR && startInput) startInput.focus();
				if (type === LoadTypes.MOMENT && posInput) posInput.focus();
				if (type === LoadTypes.PARABOLIC && startInput) startInput.focus();
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
		dispatch("update", { loads });

		console.log(loads);

		// Reset input fields
		pos = mag = start = end = magStart = magEnd = null;
	}

	function removeLoad(index) {
		loads = loads.filter((_, i) => i !== index);
		dispatch("update", { loads });
	}
</script>

<div class="mb-4">
	<h2 class="pastel-heading mb-3 text-xl font-bold">Input Loads</h2>
	<div class="mb-3 flex flex-wrap items-end gap-2">
		<ChipSelect
			options={Object.values(LoadTypes)}
			selected={selectedType}
			onSelect={(type) => (selectedType = type)}
		/>

		{#if selectedType === LoadTypes.POINT}
			<InputField
				label="Position:"
				bind:value={pos}
				inputRef={posInput}
				min={0}
				onKeydown={(e) => handleKeydown(e, LoadTypes.POINT)}
			/>
			<InputField
				label="Magnitude (kN):"
				bind:value={mag}
				inputRef={magInput}
				min={0}
				onKeydown={(e) => handleKeydown(e, LoadTypes.POINT)}
			/>
		{:else if selectedType === LoadTypes.UNIFORM}
			<InputField
				label="Start Position:"
				bind:value={start}
				inputRef={startInput}
				min={0}
				onKeydown={(e) => handleKeydown(e, LoadTypes.UNIFORM)}
			/>
			<InputField
				label="End Position:"
				bind:value={end}
				inputRef={endInput}
				min={0}
				onKeydown={(e) => handleKeydown(e, LoadTypes.UNIFORM)}
			/>
			<InputField
				label="Magnitude (kN/m):"
				bind:value={mag}
				inputRef={magInput}
				min={0}
				onKeydown={(e) => handleKeydown(e, LoadTypes.UNIFORM)}
			/>
		{:else if selectedType === LoadTypes.LINEAR}
			<InputField
				label="Start Position:"
				bind:value={start}
				inputRef={startInput}
				min={0}
				onKeydown={(e) => handleKeydown(e, LoadTypes.LINEAR)}
			/>
			<InputField
				label="End Position:"
				bind:value={end}
				inputRef={endInput}
				min={0}
				onKeydown={(e) => handleKeydown(e, LoadTypes.LINEAR)}
			/>
			<InputField
				label="Start Magnitude (kN/m):"
				bind:value={magStart}
				inputRef={magStartInput}
				min={0}
				onKeydown={(e) => handleKeydown(e, LoadTypes.LINEAR)}
			/>
			<InputField
				label="End Magnitude (kN/m):"
				bind:value={magEnd}
				inputRef={magEndInput}
				min={0}
				onKeydown={(e) => handleKeydown(e, LoadTypes.LINEAR)}
			/>
		{:else if selectedType === LoadTypes.MOMENT}
			<InputField
				label="Position:"
				bind:value={pos}
				inputRef={posInput}
				min={0}
				onKeydown={(e) => handleKeydown(e, LoadTypes.MOMENT)}
			/>
			<InputField
				label="Magnitude (kN·m):"
				bind:value={mag}
				inputRef={magInput}
				min={0}
				onKeydown={(e) => handleKeydown(e, LoadTypes.MOMENT)}
			/>
		{:else if selectedType === LoadTypes.PARABOLIC}
			<InputField
				label="Start Position:"
				bind:value={start}
				inputRef={startInput}
				min={0}
				onKeydown={(e) => handleKeydown(e, LoadTypes.PARABOLIC)}
			/>
			<InputField
				label="End Position:"
				bind:value={end}
				inputRef={endInput}
				min={0}
				onKeydown={(e) => handleKeydown(e, LoadTypes.PARABOLIC)}
			/>
			<InputField
				label="Start Magnitude (kN/m):"
				bind:value={magStart}
				inputRef={magStartInput}
				min={0}
				onKeydown={(e) => handleKeydown(e, LoadTypes.PARABOLIC)}
			/>
			<InputField
				label="End Magnitude (kN/m):"
				bind:value={magEnd}
				inputRef={magEndInput}
				onKeydown={(e) => handleKeydown(e, LoadTypes.PARABOLIC)}
			/>
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
			<li class="flex items-center justify-between gap-3 px-3 py-2">
				<span class="font-semibold"
					>{load.type.charAt(0).toUpperCase() + load.type.slice(1)} Load:
				</span>
				<span class="text-sm">{load.describe()}</span>
				<span class="flex-1"></span>
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
