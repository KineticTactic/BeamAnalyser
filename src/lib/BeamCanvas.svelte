<script>
	import { LoadTypes } from './Load';

	export let length;
	export let loads = [];
</script>

<svg width="100%" height="120">
	<!-- Draw beam line -->
	<line x1="50" y1="60" x2={50 + length * 40} y2="60" stroke="black" stroke-width="4" />

	<!-- Draw loads as arrows -->
	{#each loads as load}
		{#if load.type === LoadTypes.POINT}
			<line
				x1={50 + load.pos * 40}
				y1="20"
				x2={50 + load.pos * 40}
				y2="60"
				stroke="red"
				stroke-width="2"
				marker-end="url(#arrow)"
			/>
			<text x={50 + load.pos * 40} y="15" text-anchor="middle" font-size="12">
				{load.mag}kN
			</text>
		{:else if load.type === LoadTypes.MOMENT}
			<circle cx={50 + load.pos * 40} cy="60" r="10" stroke="blue" stroke-width="2" fill="none" />
			<text x={50 + load.pos * 40} y="55" text-anchor="middle" font-size="12">
				{load.mag}kNm
			</text>
		{:else if load.type === LoadTypes.UNIFORM}
			<rect
				x={50 + load.start * 40}
				y="20"
				width={(load.end - load.start) * 40}
				height="40"
				fill="rgba(255,0,0,0.3)"
				stroke="red"
				stroke-width="2"
			/>
			<text x={50 + ((load.start + load.end) / 2) * 40} y="15" text-anchor="middle" font-size="12">
				{load.mag}kN/m
			</text>
		{:else if load.type === LoadTypes.LINEAR}
			<polygon
				points={`${50 + load.start * 40},${20 + (1 - load.startMag / Math.max(load.startMag, load.endMag)) * 40} 
						 ${50 + load.end * 40},${20 + (1 - load.endMag / Math.max(load.startMag, load.endMag)) * 40} 
						 ${50 + load.end * 40},60 
						 ${50 + load.start * 40},60`}
				fill="rgba(255,0,0,0.3)"
				stroke="red"
				stroke-width="2"
			/>
			<text x={50 + ((load.start + load.end) / 2) * 40} y="15" text-anchor="middle" font-size="12">
				{load.startMag}kN/m to {load.endMag}kN/m
			</text>
		{/if}
	{/each}

	<!-- Arrow marker -->
	<defs>
		<marker id="arrow" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
			<path d="M0,0 L10,5 L0,10 Z" fill="red" />
		</marker>
	</defs>
</svg>
