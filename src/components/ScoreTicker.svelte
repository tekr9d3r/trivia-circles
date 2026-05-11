<script lang="ts">
	import { onMount } from 'svelte';
	import { getTopScores } from '$lib/supabase.js';

	let items = $state<{ username: string; score: number; correct: number }[]>([]);

	onMount(async () => {
		try {
			const scores = await getTopScores();
			const mapped = scores.map(e => ({ username: e.username, score: e.score, correct: e.correct }));
			items = [...mapped, ...mapped]; // duplicate for seamless loop
		} catch {
			// silently fail — ticker is decorative
		}
	});

	const ROW_H = 44;
	const VISIBLE = 3;
</script>

{#if items.length > 0}
<div class="overflow-hidden rounded-2xl" style="background: var(--surface); border: 1px solid var(--border); box-shadow: 0 2px 8px rgba(55,55,200,0.06); height: {ROW_H * VISIBLE}px">
	<div class="ticker-track" style="animation-duration: {items.length * 2}s">
		{#each items as item}
			<div class="flex items-center gap-2 px-4 text-sm" style="height: {ROW_H}px; white-space: nowrap">
				<span style="color: var(--blue)">✦</span>
				<span>
					<span class="font-semibold" style="color: var(--text)">{item.username}</span>
					<span style="color: var(--text-muted)"> scored </span>
					<span class="font-black" style="color: var(--blue)">{item.score} pts</span>
					<span style="color: var(--text-dim)"> ({item.correct}/10)</span>
				</span>
			</div>
		{/each}
	</div>
</div>
{/if}

<style>
	.ticker-track {
		display: flex;
		flex-direction: column;
		animation: scroll-up linear infinite;
	}

	@keyframes scroll-up {
		0%   { transform: translateY(0); }
		100% { transform: translateY(-50%); }
	}
</style>
