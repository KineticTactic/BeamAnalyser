<script>
	import InputField from './InputField.svelte';
	import { createEventDispatcher } from 'svelte';
	import { JointTypes, RollerJoint, PinnedJoint, FixedJoint } from './Joint.js';
	import ChipSelect from './ChipSelect.svelte';

	const dispatch = createEventDispatcher();

	export let joints = [];
	joints = [new RollerJoint(1), new PinnedJoint(9)];
	// joints = [new FixedJoint(0)];

	let selectedType = JointTypes.ROLLER;
	let pos;

	let posInput;

	function handleKeydown(e) {
		if (e.key === 'Enter' && pos !== null && pos !== undefined && pos !== '') {
			addJoint();
			// Move focus back to the input field for quick entry
			setTimeout(() => {
				if (posInput) posInput.focus();
			}, 0);
		}
	}

	function addJoint() {
		if (pos === null || pos === undefined || pos === '') return;
		let newJoint;
		if (selectedType === JointTypes.ROLLER) {
			newJoint = new RollerJoint(pos);
		} else if (selectedType === JointTypes.PINNED) {
			newJoint = new PinnedJoint(pos);
		} else if (selectedType === JointTypes.FIXED) {
			newJoint = new FixedJoint(pos);
		}

		joints = [...joints, newJoint];
		dispatch('update', { joints });

		// Reset input field
		pos = null;
	}

	function removeJoint(index) {
		joints = joints.filter((_, i) => i !== index);
		dispatch('update', { joints });
	}
</script>

<div class="mb-4">
	<h2 class="pastel-heading mb-3 text-xl font-bold">Input Joints</h2>
	<div class="mb-3 flex flex-wrap items-end gap-2">
		<ChipSelect
			options={Object.values(JointTypes)}
			selected={selectedType}
			onSelect={(type) => (selectedType = type)}
		/>
		<InputField
			label="Position:"
			bind:value={pos}
			inputRef={posInput}
			min={0}
			onKeydown={handleKeydown}
		/>
		<button
			on:click={addJoint}
			class="pastel-green-btn flex items-center gap-1 rounded px-3 py-1 font-semibold"
			disabled={pos === null || pos === undefined || pos === ''}
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
			Add Joint
		</button>
	</div>

	<ul class="divide-y divide-[#f0eafd] rounded-lg border border-[#f0eafd] bg-white">
		{#each joints as joint, index}
			<li class="flex items-center justify-between px-3 py-2">
				<span class="text-sm">{joint.describe()}</span>
				<button
					on:click={() => removeJoint(index)}
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
