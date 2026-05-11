<script lang="ts">
	import type { UserProfile } from '$lib/types.js';

	interface Props {
		profile: UserProfile;
		onStart: () => void;
		onLeaderboard: () => void;
	}

	let { profile, onStart, onLeaderboard }: Props = $props();
</script>

<div class="flex flex-col items-center gap-8 py-8 text-center">

	<!-- Avatar -->
	{#if profile.avatarUrl}
		<img
			src={profile.avatarUrl}
			alt={profile.name}
			class="h-20 w-20 rounded-full object-cover"
			style="border: 3px solid var(--orange); box-shadow: 0 0 20px rgba(249,115,22,0.2)"
		/>
	{:else}
		<div
			class="flex h-20 w-20 items-center justify-center rounded-full text-2xl font-black text-white"
			style="background: linear-gradient(135deg, #f97316, #7c3aed)"
		>
			{profile.name.slice(0, 2).toUpperCase()}
		</div>
	{/if}

	<!-- Title + subtitle -->
	<div>
		<h2 class="text-3xl font-black uppercase tracking-tight" style="color: var(--text)">Circles Trivia</h2>
		<p class="mt-2 text-sm" style="color: var(--text-muted)">
			10 questions &nbsp;·&nbsp; 30s each &nbsp;·&nbsp; 1500 pts max
		</p>
	</div>

	<!-- CTAs -->
	<div class="flex w-full flex-col gap-2.5">
		<button
			onclick={onStart}
			class="w-full rounded-2xl py-4 text-base font-bold uppercase tracking-wide text-white transition-all active:scale-95"
			style="background: var(--orange); box-shadow: 0 8px 24px rgba(249,115,22,0.28)"
			onmouseenter={(e) => (e.currentTarget.style.background = 'var(--orange-hover)')}
			onmouseleave={(e) => (e.currentTarget.style.background = 'var(--orange)')}
		>
			Start Quiz
		</button>
		<button
			onclick={onLeaderboard}
			class="w-full rounded-2xl py-3.5 text-sm font-semibold uppercase tracking-wide transition-all active:scale-95"
			style="background: var(--surface); border: 1.5px solid var(--border); color: var(--text-muted)"
			onmouseenter={(e) => (e.currentTarget.style.borderColor = 'rgba(0,0,0,0.2)')}
			onmouseleave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
		>
			🏆 Leaderboard
		</button>
	</div>

</div>
