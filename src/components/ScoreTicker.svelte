<script lang="ts">
	import type { LeaderboardEntry } from '$lib/types.js';

	interface Props {
		entries?: LeaderboardEntry[];
	}

	let { entries = [] }: Props = $props();

	const SIMULATED = [
		{ username: 'gnosis_maxi',    score: 1350, correct: 9 },
		{ username: 'xdai_explorer',  score: 1120, correct: 8 },
		{ username: 'circles_dev',    score: 980,  correct: 7 },
		{ username: 'pathfinder99',   score: 890,  correct: 7 },
		{ username: 'safe_holder',    score: 750,  correct: 6 },
		{ username: 'gno_staker',     score: 1450, correct: 10 },
		{ username: 'web3_curious',   score: 620,  correct: 5 },
		{ username: 'ubi_believer',   score: 1200, correct: 9 },
		{ username: 'circles_newbie', score: 430,  correct: 4 },
		{ username: 'gnosis_pay_fan', score: 1050, correct: 8 },
	];

	const allItems = $derived(
		(() => {
			const real = entries.map(e => ({ username: e.username, score: e.score, correct: e.correct }));
			const merged = [...real, ...SIMULATED];
			return [...merged, ...merged];
		})()
	);

	const ROW_H = 44;
	const VISIBLE = 3;
</script>

<div class="overflow-hidden rounded-2xl" style="background: var(--surface); border: 1px solid var(--border); box-shadow: 0 2px 8px rgba(55,55,200,0.06); height: {ROW_H * VISIBLE}px">
	<div class="ticker-track">
		{#each allItems as item}
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

<style>
	.ticker-track {
		display: flex;
		flex-direction: column;
		animation: scroll-up 20s linear infinite;
	}

	@keyframes scroll-up {
		0%   { transform: translateY(0); }
		100% { transform: translateY(-50%); }
	}
</style>
