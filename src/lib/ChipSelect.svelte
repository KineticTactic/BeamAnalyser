<script>
	export let options = [];
	export let selected;
	export let onSelect = () => {};
</script>

<div class="chip-group mb-2 flex flex-wrap gap-2">
	{#each options as option}
		<button
			type="button"
			class="chip-toggle rounded-full border px-3 py-1 text-sm font-semibold transition-colors duration-150 focus:outline-none {selected ===
			option
				? 'border-[#a084e8] bg-[#a084e8] text-white'
				: 'border-[#e3d8f3] bg-white text-[#a084e8] hover:bg-[#f0eafd]'}"
			on:click={() => onSelect(option)}
			aria-pressed={selected === option}
		>
			{option}
		</button>
	{/each}
</div>

<style>
	.chip-group {
		width: 100%;
	}
	.chip-toggle {
		cursor: pointer;
		box-shadow: 0 1px 2px 0 rgba(160, 132, 232, 0.04);
	}
	.chip-toggle:focus {
		outline: 2px solid #a084e8;
		outline-offset: 2px;
	}
</style>
