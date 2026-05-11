<script lang="ts">
	import { onMount } from 'svelte';
	import { isMiniappMode, onWalletChange } from '@aboutcircles/miniapp-sdk';
	import { getProfile } from '$lib/circles.js';
	import { QUESTIONS, shuffleOptions } from '$lib/questions.js';
	import { calcQuestionScore } from '$lib/scoring.js';
	import { saveScore } from '$lib/supabase.js';
	import type { AnswerRecord, GamePhase, Question, UserProfile } from '$lib/types.js';
	import Welcome from '../components/Welcome.svelte';
	import QuestionCard from '../components/Question.svelte';
	import Results from '../components/Results.svelte';
	import Leaderboard from '../components/Leaderboard.svelte';

	let phase = $state<GamePhase>('idle');
	let profile = $state<UserProfile | null>(null);
	let questions = $state<Question[]>([]);
	let currentIndex = $state(0);
	let answers = $state<AnswerRecord[]>([]);
	let totalScore = $state(0);
	let scoreSaved = $state(false);

	onMount(() => {
		if (isMiniappMode()) {
			onWalletChange(async (address) => {
				if (!address) { phase = 'idle'; profile = null; return; }
				phase = 'loading_profile';
				profile = await getProfile(address);
				phase = 'welcome';
			});
		} else {
			profile = { address: '0xDEV0000000000000000000000000000000000001', name: 'Dev Player', avatarUrl: null };
			phase = 'welcome';
		}
	});

	function startGame() {
		questions = QUESTIONS.map(shuffleOptions);
		currentIndex = 0;
		answers = [];
		totalScore = 0;
		scoreSaved = false;
		phase = 'question';
	}

	async function handleAnswer(answerIndex: number, timeRemaining: number) {
		const q = questions[currentIndex];
		const correct = answerIndex === q.answerIndex;
		const points = calcQuestionScore(correct, timeRemaining);
		const newAnswers: AnswerRecord[] = [...answers, { questionId: q.id, correct, timeRemaining, points }];
		answers = newAnswers;
		totalScore += points;

		if (currentIndex + 1 < questions.length) {
			currentIndex += 1;
		} else {
			phase = 'results';
			if (!scoreSaved && profile) {
				scoreSaved = true;
				await saveScore({
					wallet: profile.address,
					username: profile.name,
					avatar_url: profile.avatarUrl,
					score: totalScore,
					correct: newAnswers.filter((a) => a.correct).length
				});
			}
		}
	}

	const currentQuestion = $derived(questions[currentIndex]);
</script>

<svelte:head>
	<title>Circles Trivia</title>
</svelte:head>

<main class="min-h-screen px-4 py-6" style="background-color: var(--bg);">
	<div class="mx-auto w-full max-w-md">

		<!-- Header -->
		<header class="mb-6 flex items-center justify-between">
			<div class="flex items-center gap-2.5">
				<div class="relative flex h-9 w-9 items-center justify-center rounded-full"
					style="background: linear-gradient(135deg, #f97316 0%, #7c3aed 100%)">
					<span class="text-sm font-black text-white">G</span>
					<span class="sparkle absolute -right-0.5 -top-0.5 text-[10px] text-white">✦</span>
				</div>
				<div>
					<p class="text-xs font-semibold uppercase tracking-widest" style="color: var(--orange)">Circles</p>
					<h1 class="text-sm font-bold leading-none" style="color: var(--text)">Trivia</h1>
				</div>
			</div>

			{#if phase === 'question'}
				<div class="rounded-full px-3 py-1 text-xs font-semibold"
					style="background: var(--surface); color: var(--text-muted); border: 1px solid var(--border)">
					{currentIndex + 1} / {questions.length}
				</div>
			{/if}
		</header>

		<!-- Progress bar -->
		{#if phase === 'question'}
			<div class="mb-5 flex gap-1">
				{#each questions as _, i}
					<div class="h-1 flex-1 rounded-full transition-all duration-300"
						style="{i < currentIndex
							? 'background: var(--orange)'
							: i === currentIndex
								? 'background: var(--purple)'
								: 'background: rgba(0,0,0,0.1)'}">
					</div>
				{/each}
			</div>
		{/if}

		<!-- Phases -->
		{#if phase === 'idle' || phase === 'loading_profile'}
			<div class="flex flex-col items-center gap-4 py-24 text-center">
				<div class="relative">
					<div class="h-12 w-12 animate-spin rounded-full border-2 border-transparent"
						style="border-top-color: var(--orange); border-right-color: var(--orange)"></div>
					<span class="sparkle absolute -right-1 -top-1 text-xs" style="color: var(--orange)">✦</span>
				</div>
				<p class="text-sm" style="color: var(--text-muted)">
					{phase === 'idle' ? 'Connecting to Circles…' : 'Loading your profile…'}
				</p>
			</div>

		{:else if phase === 'welcome' && profile}
			<Welcome {profile} onStart={startGame} />

		{:else if phase === 'question' && currentQuestion}
			{#key currentIndex}
				<QuestionCard
					question={currentQuestion}
					questionNumber={currentIndex + 1}
					totalQuestions={questions.length}
					onAnswer={handleAnswer}
				/>
			{/key}

		{:else if phase === 'results' && profile}
			<Results
				{profile}
				{answers}
				{totalScore}
				onViewLeaderboard={() => (phase = 'leaderboard')}
				onPlayAgain={startGame}
			/>

		{:else if phase === 'leaderboard' && profile}
			<Leaderboard {profile} myScore={totalScore} onPlayAgain={startGame} />
		{/if}

		<!-- Footer -->
		<footer class="mt-8 rounded-2xl p-4" style="background: var(--surface); border: 1px solid var(--border); box-shadow: 0 1px 4px rgba(0,0,0,0.06)">
			<p class="mb-3 text-center text-xs font-semibold uppercase tracking-widest" style="color: var(--text-dim)">
				Built by
			</p>
			<div class="flex items-center gap-3">
				<div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-black text-white"
					style="background: linear-gradient(135deg, #f97316, #7c3aed)">
					T
				</div>
				<div class="min-w-0 flex-1">
					<p class="text-sm font-bold" style="color: var(--text)">tekr0x</p>
					<a href="https://x.com/tekr0x" target="_blank" rel="noopener noreferrer"
						class="text-xs transition-colors"
						style="color: var(--text-dim)"
						onmouseenter={(e) => (e.currentTarget.style.color = 'var(--orange)')}
						onmouseleave={(e) => (e.currentTarget.style.color = 'var(--text-dim)')}>
						@tekr0x on X ↗
					</a>
				</div>
				<a
					href="https://app.gnosis.io/p/0x15BE89708053Cbc405F29095ECf803D51b5812C7"
					target="_blank"
					rel="noopener noreferrer"
					class="shrink-0 rounded-xl px-3 py-2 text-xs font-bold uppercase tracking-wide text-white transition-all active:scale-95"
					style="background: var(--orange); box-shadow: 0 4px 12px rgba(249,115,22,0.25)"
					onmouseenter={(e) => (e.currentTarget.style.background = 'var(--orange-hover)')}
					onmouseleave={(e) => (e.currentTarget.style.background = 'var(--orange)')}>
					Join my circle ✦
				</a>
			</div>
		</footer>

	</div>
</main>
