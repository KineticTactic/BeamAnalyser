<script>
	import { createEventDispatcher } from 'svelte';
	import { JointTypes, RollerJoint, PinnedJoint, FixedJoint } from './Joint.js';

	const dispatch = createEventDispatcher();

	export let joints = [];
	let selectedType = JointTypes.ROLLER;
	let pos;

	function addJoint() {
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
	<h2 class="mb-2 text-xl font-bold">Input Joints</h2>
	<div class="mb-2">
		<select bind:value={selectedType} class="mr-2 border p-1">
			{#each Object.values(JointTypes) as type}
				<option value={type}>{type}</option>
			{/each}
		</select>

		<label>
			Position:
			<input type="number" bind:value={pos} class="mr-2 w-16 border p-1" min="0" />
		</label>

		<button on:click={addJoint} class="rounded bg-green-500 px-2 py-1 text-white">Add Joint</button>
	</div>

	<ul>
		{#each joints as joint, index}
			<li class="mb-1 flex items-center justify-between border-b pb-1">
				<span>{joint.describe()}</span>
				<button on:click={() => removeJoint(index)} class="rounded bg-red-500 px-2 py-1 text-white"
					>Remove</button
				>
			</li>
		{/each}
	</ul>
</div>

<style>
</style>
