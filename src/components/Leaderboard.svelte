<script lang="ts">
	import { onMount } from 'svelte';
	import { getTopScores } from '$lib/supabase.js';
	import type { LeaderboardEntry, UserProfile } from '$lib/types.js';

	interface Props {
		profile: UserProfile;
		myScore: number;
		onPlayAgain: () => void;
	}

	let { profile, myScore, onPlayAgain }: Props = $props();

	let entries = $state<LeaderboardEntry[]>([]);
	let loading = $state(true);
	let fetchError = $state<string | null>(null);

	onMount(async () => {
		try {
			entries = await getTopScores();
		} catch (e: any) {
			fetchError = e?.message ?? 'Unknown error';
			console.error('[leaderboard] fetch error', e);
		} finally {
			loading = false;
		}
	});

	const MEDALS = ['🥇', '🥈', '🥉'];
</script>

<div class="flex flex-col gap-5">

	<!-- Header -->
	<div class="text-center">
		<p class="text-xs font-semibold uppercase tracking-widest" style="color: var(--orange)">Global</p>
		<h2 class="text-2xl font-black uppercase" style="color: var(--text)">Leaderboard</h2>
		<p class="mt-1 text-xs" style="color: var(--text-dim)">Top 20 · best score per player</p>
	</div>

	{#if loading}
		<div class="flex flex-col items-center gap-3 py-16">
			<div class="h-8 w-8 animate-spin rounded-full border-2 border-transparent"
				style="border-top-color: var(--orange)"></div>
			<p class="text-sm" style="color: var(--text-muted)">Loading scores…</p>
		</div>

	{:else if fetchError}
		<div class="rounded-2xl p-5 text-center" style="background: rgba(239,68,68,0.08); border: 1px solid #ef4444">
			<p class="text-sm font-semibold" style="color: #dc2626">Could not load scores</p>
			<p class="mt-1 font-mono text-xs" style="color: #dc2626">{fetchError}</p>
		</div>

	{:else if entries.length === 0}
		<div class="rounded-2xl py-16 text-center" style="background: var(--surface); border: 1px solid var(--border)">
			<p class="text-2xl">🏆</p>
			<p class="mt-2 text-sm font-semibold" style="color: var(--text)">No scores yet</p>
			<p class="mt-1 text-xs" style="color: var(--text-dim)">You could be the first!</p>
		</div>

	{:else}
		<!-- Podium — only when 3+ entries -->
		{#if entries.length >= 3}
			<div class="grid grid-cols-3 gap-2 pb-1">
				{#each [entries[1], entries[0], entries[2]] as entry, col}
					{@const isMe = entry.wallet.toLowerCase() === profile.address.toLowerCase()}
					{@const rank = col === 0 ? 1 : col === 1 ? 0 : 2}
					<div
						class="flex flex-col items-center gap-1.5 rounded-2xl py-4 text-center {col === 1 ? 'pt-2' : 'pt-5'}"
						style="{isMe
							? 'background: rgba(249,115,22,0.08); border: 1.5px solid var(--orange)'
							: 'background: var(--surface); border: 1px solid var(--border); box-shadow: 0 1px 4px rgba(0,0,0,0.05)'}"
					>
						<span class="text-xl">{MEDALS[rank]}</span>
						{#if entry.avatar_url}
							<img src={entry.avatar_url} alt={entry.username}
								class="h-10 w-10 rounded-full object-cover"
								style="border: 2px solid {isMe ? 'var(--orange)' : 'var(--border)'}" />
						{:else}
							<div class="flex h-10 w-10 items-center justify-center rounded-full text-sm font-black text-white"
								style="background: linear-gradient(135deg, #f97316, #7c3aed)">
								{entry.username.slice(0, 2).toUpperCase()}
							</div>
						{/if}
						<p class="w-full truncate px-1 text-xs font-bold" style="color: var(--text)">{entry.username}</p>
						<p class="font-black tabular-nums" style="color: var(--orange); font-size: {col === 1 ? '1rem' : '0.875rem'}">{entry.score}</p>
					</div>
				{/each}
			</div>
		{/if}

		<!-- All entries as flat list (top 3 shown here too when < 3 entries) -->
		<div class="space-y-2">
			{#each entries.length >= 3 ? entries.slice(3) : entries as entry, i}
				{@const rank = entries.length >= 3 ? i + 4 : i + 1}
				{@const isMe = entry.wallet.toLowerCase() === profile.address.toLowerCase()}
				<div
					class="flex items-center gap-3 rounded-xl px-4 py-3 text-sm"
					style="{isMe
						? 'background: rgba(249,115,22,0.07); border: 1.5px solid var(--orange)'
						: 'background: var(--surface); border: 1px solid var(--border)'}"
				>
					<span class="w-5 text-center text-xs font-bold" style="color: var(--text-dim)">
						{rank <= 3 ? MEDALS[rank - 1] : rank}
					</span>

					{#if entry.avatar_url}
						<img src={entry.avatar_url} alt={entry.username} class="h-7 w-7 rounded-full object-cover" />
					{:else}
						<div class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black text-white"
							style="background: linear-gradient(135deg, #f97316, #7c3aed)">
							{entry.username.slice(0, 2).toUpperCase()}
						</div>
					{/if}

					<span class="flex-1 truncate font-semibold" style="color: var(--text)">
						{entry.username}{isMe ? ' (you)' : ''}
					</span>
					<span class="text-xs" style="color: var(--text-dim)">{entry.correct}/10</span>
					<span class="font-bold tabular-nums" style="color: var(--orange)">{entry.score}</span>
				</div>
			{/each}
		</div>
	{/if}

	<button
		onclick={onPlayAgain}
		class="w-full rounded-2xl py-4 text-sm font-bold uppercase tracking-wide text-white transition-all active:scale-95"
		style="background: var(--orange); box-shadow: 0 8px 24px rgba(249,115,22,0.25)"
		onmouseenter={(e) => (e.currentTarget.style.background = 'var(--orange-hover)')}
		onmouseleave={(e) => (e.currentTarget.style.background = 'var(--orange)')}
	>
		Play Again ✦
	</button>

</div>
