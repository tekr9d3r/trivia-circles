<script lang="ts">
	import type { UserProfile } from '$lib/types.js';
	import ScoreTicker from './ScoreTicker.svelte';

	interface Props {
		profile: UserProfile;
		onStart: () => void;
		onLeaderboard: () => void;
	}

	let { profile, onStart, onLeaderboard }: Props = $props();
</script>

<div class="flex flex-col items-center gap-6 py-4 text-center">

	<!-- Hero icon area -->
	<div class="relative">
		<!-- Decorative sparkles -->
		<span class="sparkle absolute -left-4 -top-1 text-base" style="color: var(--orange)">✦</span>
		<span class="sparkle-delay absolute -right-3 top-5 text-xs" style="color: var(--blue)">✦</span>
		<span class="sparkle absolute bottom-0 right-0 text-xs" style="color: var(--orange); animation-delay: 1.2s">✦</span>

		<!-- Avatar / initials -->
		{#if profile.avatarUrl}
			<img
				src={profile.avatarUrl}
				alt={profile.name}
				class="h-24 w-24 rounded-full object-cover"
				style="border: 3px solid var(--blue); box-shadow: 0 0 0 6px rgba(55,55,200,0.1), 0 8px 24px var(--blue-shadow)"
			/>
		{:else}
			<div
				class="flex h-24 w-24 items-center justify-center rounded-full text-3xl font-black text-white"
				style="background: linear-gradient(135deg, var(--blue), #6d28d9); box-shadow: 0 8px 24px var(--blue-shadow)"
			>
				{profile.name.slice(0, 2).toUpperCase()}
			</div>
		{/if}
	</div>

	<!-- Greeting + title -->
	<div>
		<p class="text-sm font-semibold" style="color: var(--text-muted)">
			Hey, <span class="font-bold" style="color: var(--text)">{profile.name}</span> 👋
		</p>
		<h2 class="mt-2 text-2xl font-black leading-tight" style="color: var(--text)">
			Test your<br/><span style="color: var(--blue)">Circles & Gnosis</span><br/>knowledge
		</h2>
		<div class="mt-3 flex items-center justify-center gap-2">
			<span class="rounded-full px-3 py-1 text-xs font-semibold" style="background: var(--blue-light); color: var(--blue)">10 questions</span>
			<span class="rounded-full px-3 py-1 text-xs font-semibold" style="background: rgba(249,115,22,0.1); color: var(--orange)">30s each</span>
			<span class="rounded-full px-3 py-1 text-xs font-semibold" style="background: var(--blue-light); color: var(--blue)">1500 pts max</span>
		</div>
	</div>

	<!-- CTAs -->
	<div class="flex w-full flex-col gap-2.5">
		<button
			onclick={onStart}
			class="w-full rounded-2xl py-4 text-base font-bold text-white transition-all active:scale-95"
			style="background: var(--blue); box-shadow: 0 8px 24px var(--blue-shadow)"
			onmouseenter={(e) => (e.currentTarget.style.background = 'var(--blue-hover)')}
			onmouseleave={(e) => (e.currentTarget.style.background = 'var(--blue)')}
		>
			Start Quiz ✦
		</button>
		<button
			onclick={onLeaderboard}
			class="w-full rounded-2xl py-3.5 text-sm font-semibold transition-all active:scale-95"
			style="background: var(--surface); border: 1.5px solid var(--border); color: var(--text-muted)"
			onmouseenter={(e) => { e.currentTarget.style.borderColor = 'var(--blue)'; e.currentTarget.style.color = 'var(--blue)'; }}
			onmouseleave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
		>
			🏆 Leaderboard
		</button>
	</div>

	<!-- Live score ticker -->
	<div class="w-full">
		<p class="mb-2 text-left text-xs font-semibold uppercase tracking-widest" style="color: var(--text-dim)">🔴 Live activity</p>
		<ScoreTicker />
	</div>

</div>
