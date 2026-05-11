export const BASE_POINTS = 100;
export const MAX_SPEED_BONUS = 50;
export const QUESTION_TIME_SECS = 30;

export function calcQuestionScore(correct: boolean, timeRemaining: number): number {
	if (!correct) return 0;
	const speedBonus = Math.floor((timeRemaining / QUESTION_TIME_SECS) * MAX_SPEED_BONUS);
	return BASE_POINTS + speedBonus;
}
