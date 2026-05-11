export type GamePhase =
	| 'idle'
	| 'loading_profile'
	| 'welcome'
	| 'question'
	| 'results'
	| 'leaderboard';

export interface Question {
	id: number;
	question: string;
	options: string[];
	answerIndex: number;
}

export interface AnswerRecord {
	questionId: number;
	correct: boolean;
	timeRemaining: number;
	points: number;
}

export interface UserProfile {
	address: string;
	name: string;
	avatarUrl: string | null;
}

export interface LeaderboardEntry {
	id: string;
	wallet: string;
	username: string;
	avatar_url: string | null;
	score: number;
	correct: number;
	created_at: string;
}
