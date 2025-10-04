<script>
	// No script needed for static footer
</script>

<footer
	class="pastel-panel mx-6 mb-6 flex w-auto flex-col items-center gap-2 rounded-xl p-6 shadow-md"
>
	<div class="pastel-label flex flex-col items-center gap-2 text-base font-semibold sm:flex-row">
		Developed by Rudrajeet. <span class="text-gray-500"></span>
		<a
			href="https://github.com/KineticTactic/BeamAnalyser"
			target="_blank"
			rel="noopener"
			aria-label="GitHub Repository"
			class="footer-link flex items-center gap-1 hover:text-[#7c6ee6] hover:underline"
		>
			<span>View on GitHub</span>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="inline-block h-5 w-5 align-text-bottom"
				fill="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					d="M12 0C5.37 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.606-2.665-.305-5.466-1.334-5.466-5.931 0-1.31.469-2.381 1.236-3.221-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.873.119 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.804 5.624-5.475 5.921.43.372.823 1.102.823 2.222v3.293c0 .322.218.694.825.576C20.565 21.796 24 17.299 24 12c0-6.627-5.373-12-12-12z"
				/>
			</svg>
		</a>
	</div>
	<div class="max-w-2xl text-center text-sm text-[#6b6b7a]">
		<strong>BeamAnalyser</strong> is a web app for visualizing and analyzing beams under various
		loads and supports. <br /> Built with Svelte, Vite, p5.js, Plotly.js, and Tailwind CSS.
	</div>
</footer>

<style>
	footer {
		position: relative;
		bottom: 0;
		left: 0;
		right: 0;
	}
	.footer-link {
		color: #6155bd;
		text-decoration: underline;
		font-weight: 500;
		transition: color 0.15s;
	}
</style>
