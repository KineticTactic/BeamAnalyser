<script>
	export let label = '';
	export let value;
	export let inputRef;
	export let min = undefined;
	export let onKeydown = undefined;
	// Accepts all other props via $$restProps
	export let type = 'number';
</script>

<label class="flex items-center gap-1 font-medium">
	{label}
	<input
		{type}
		bind:value
		bind:this={inputRef}
		class="pastel-input w-16 rounded border border-[#e3d8f3] p-1 focus:ring-2 focus:ring-[#a084e8] focus:outline-none"
		{min}
		on:keydown={onKeydown}
	/>
</label>
