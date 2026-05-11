<script lang="ts">
	import type { AnswerRecord, UserProfile } from '$lib/types.js';
	import { BASE_POINTS, MAX_SPEED_BONUS } from '$lib/scoring.js';

	interface Props {
		profile: UserProfile;
		answers: AnswerRecord[];
		totalScore: number;
		onViewLeaderboard: () => void;
		onPlayAgain: () => void;
	}

	let { profile, answers, totalScore, onViewLeaderboard, onPlayAgain }: Props = $props();

	const correctCount = $derived(answers.filter((a) => a.correct).length);
	const maxScore = $derived(answers.length * (BASE_POINTS + MAX_SPEED_BONUS));
	const pct = $derived(Math.round((totalScore / maxScore) * 100));

	const verdict = $derived(
		pct === 100 ? { label: 'PERFECT!',      icon: '🏆' }
		: pct >= 80  ? { label: 'EXCELLENT',     icon: '⭐' }
		: pct >= 60  ? { label: 'GOOD JOB',      icon: '👏' }
		: pct >= 40  ? { label: 'KEEP LEARNING', icon: '📚' }
		:              { label: 'TRY AGAIN',      icon: '💪' }
	);
</script>

<div class="flex flex-col items-center gap-5 py-2">

	<!-- Score hero -->
	<div class="relative flex flex-col items-center">
		<span class="sparkle absolute -left-7 -top-2 text-lg" style="color: var(--orange)">✦</span>
		<span class="sparkle-delay absolute -right-6 top-3 text-xs" style="color: var(--blue)">✦</span>

		<div
			class="flex h-32 w-32 flex-col items-center justify-center rounded-full"
			style="background: linear-gradient(135deg, rgba(55,55,200,0.1), rgba(109,40,217,0.1)); border: 3px solid var(--blue); box-shadow: 0 0 0 8px rgba(55,55,200,0.06), 0 8px 32px var(--blue-shadow)"
		>
			<span class="text-4xl font-black" style="color: var(--text)">{totalScore}</span>
			<span class="text-xs font-bold uppercase tracking-wider" style="color: var(--text-muted)">points</span>
		</div>
	</div>

	<!-- Verdict -->
	<div class="text-center">
		<p class="text-3xl">{verdict.icon}</p>
		<h2 class="mt-1 text-2xl font-black uppercase tracking-tight" style="color: var(--text)">{verdict.label}</h2>
		<p class="mt-1 text-sm font-medium" style="color: var(--text-muted)">
			{correctCount} / {answers.length} correct &nbsp;·&nbsp; {pct}%
		</p>
	</div>

	<!-- Correctness grid -->
	<div class="w-full rounded-2xl p-4" style="background: var(--surface); border: 1px solid var(--border); box-shadow: 0 4px 16px rgba(55,55,200,0.06)">
		<div class="grid grid-cols-10 gap-1.5">
			{#each answers as a, i}
				<div
					class="flex aspect-square items-center justify-center rounded-xl text-xs font-black"
					style="{a.correct
						? 'background: rgba(34,197,94,0.12); color: #15803d'
						: 'background: rgba(239,68,68,0.08); color: #dc2626'}"
					title="Q{i + 1}: {a.points} pts"
				>
					{a.correct ? '✓' : '✗'}
				</div>
			{/each}
		</div>
		<div class="mt-3 h-1.5 w-full rounded-full" style="background: rgba(55,55,200,0.08)">
			<div
				class="h-full rounded-full transition-all duration-700"
				style="width: {pct}%; background: linear-gradient(90deg, var(--blue), #6d28d9)"
			></div>
		</div>
	</div>

	<!-- Per-question detail -->
	<div class="w-full space-y-1.5">
		{#each answers as a, i}
			<div
				class="flex items-center justify-between rounded-xl px-4 py-2.5 text-sm"
				style="background: var(--surface); border: 1px solid var(--border)"
			>
				<span class="w-8 font-bold" style="color: var(--text-dim)">Q{i + 1}</span>
				<span class="flex-1 font-semibold" style="{a.correct ? 'color: #15803d' : 'color: #dc2626'}">{a.correct ? '✓ Correct' : '✗ Wrong'}</span>
				{#if a.correct}
					<span class="text-xs" style="color: var(--text-dim)">{a.timeRemaining}s left</span>
				{:else}
					<span class="text-xs" style="color: var(--text-dim)">—</span>
				{/if}
				<span class="ml-3 font-black tabular-nums" style="color: var(--orange)">{a.points} pts</span>
			</div>
		{/each}
	</div>

	<!-- Actions -->
	<div class="flex w-full flex-col gap-2.5 pt-1">
		<button
			onclick={onViewLeaderboard}
			class="w-full rounded-2xl py-4 text-sm font-bold text-white transition-all active:scale-95"
			style="background: var(--blue); box-shadow: 0 8px 24px var(--blue-shadow)"
			onmouseenter={(e) => (e.currentTarget.style.background = 'var(--blue-hover)')}
			onmouseleave={(e) => (e.currentTarget.style.background = 'var(--blue)')}
		>
			View Leaderboard ✦
		</button>
		<button
			onclick={onPlayAgain}
			class="w-full rounded-2xl py-3.5 text-sm font-semibold transition-all active:scale-95"
			style="background: var(--surface); border: 1.5px solid var(--border); color: var(--text-muted)"
			onmouseenter={(e) => { e.currentTarget.style.borderColor = 'var(--blue)'; e.currentTarget.style.color = 'var(--blue)'; }}
			onmouseleave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
		>
			Play Again
		</button>
	</div>

</div>
