<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { QUESTION_TIME_SECS } from '$lib/scoring.js';
	import type { Question } from '$lib/types.js';

	interface Props {
		question: Question;
		questionNumber: number;
		totalQuestions: number;
		onAnswer: (answerIndex: number, timeRemaining: number) => void;
	}

	let { question, questionNumber, totalQuestions, onAnswer }: Props = $props();

	let timeRemaining = $state(QUESTION_TIME_SECS);
	let selected = $state<number | null>(null);
	let revealed = $state(false);
	let interval: ReturnType<typeof setInterval>;

	onMount(() => {
		interval = setInterval(() => {
			timeRemaining -= 1;
			if (timeRemaining <= 0) {
				clearInterval(interval);
				handleAnswer(-1);
			}
		}, 1000);
	});

	onDestroy(() => clearInterval(interval));

	function handleAnswer(index: number) {
		if (revealed) return;
		clearInterval(interval);
		selected = index;
		revealed = true;
		setTimeout(() => onAnswer(index, timeRemaining < 0 ? 0 : timeRemaining), 900);
	}

	const progress = $derived((timeRemaining / QUESTION_TIME_SECS) * 100);
	const timerColor = $derived(
		timeRemaining > 15 ? 'var(--orange)' : timeRemaining > 7 ? '#eab308' : '#ef4444'
	);
	const LABELS = ['A', 'B', 'C', 'D'];
</script>

<div class="flex flex-col gap-5">

	<!-- Timer row -->
	<div class="flex items-center gap-3">
		<div class="h-1.5 flex-1 rounded-full" style="background: rgba(0,0,0,0.08)">
			<div
				class="h-full rounded-full transition-all duration-1000"
				style="width: {progress}%; background: {timerColor}"
			></div>
		</div>
		<span class="w-8 text-right font-mono text-sm font-bold tabular-nums" style="color: {timerColor}">
			{timeRemaining}s
		</span>
	</div>

	<!-- Question card -->
	<div class="rounded-2xl p-5" style="background: var(--surface); border: 1px solid var(--border); box-shadow: 0 2px 8px rgba(0,0,0,0.06)">
		<p class="mb-2 text-xs font-semibold uppercase tracking-widest" style="color: var(--orange)">
			Question {questionNumber}
		</p>
		<h2 class="text-lg font-bold leading-snug" style="color: var(--text)">{question.question}</h2>
	</div>

	<!-- Options -->
	<div class="grid gap-2.5">
		{#each question.options as option, i}
			{@const isCorrect = revealed && i === question.answerIndex}
			{@const isWrong = revealed && i === selected && selected !== question.answerIndex}
			{@const isDim = revealed && i !== question.answerIndex && i !== selected}

			<button
				onclick={() => handleAnswer(i)}
				disabled={revealed}
				class="flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-left text-sm font-semibold transition-all duration-200"
				style="{isCorrect
					? 'background: rgba(34,197,94,0.1); border: 1.5px solid #22c55e; color: #15803d'
					: isWrong
						? 'background: rgba(239,68,68,0.08); border: 1.5px solid #ef4444; color: #dc2626'
						: isDim
							? 'background: rgba(0,0,0,0.02); border: 1.5px solid rgba(0,0,0,0.04); color: rgba(11,11,31,0.3); cursor: default'
							: 'background: var(--surface); border: 1.5px solid var(--border); color: var(--text); cursor: pointer; box-shadow: 0 1px 3px rgba(0,0,0,0.05)'}"
			>
				<!-- Label badge -->
				<span
					class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-black"
					style="{isCorrect
						? 'background: #22c55e; color: white'
						: isWrong
							? 'background: #ef4444; color: white'
							: isDim
								? 'background: rgba(0,0,0,0.05); color: rgba(11,11,31,0.25)'
								: 'background: rgba(249,115,22,0.12); color: var(--orange)'}"
				>
					{isCorrect ? '✓' : isWrong ? '✗' : LABELS[i]}
				</span>
				{option}
			</button>
		{/each}
	</div>

</div>
