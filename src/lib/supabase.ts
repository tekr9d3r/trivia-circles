import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import type { LeaderboardEntry } from './types.js';

const isMock =
	!PUBLIC_SUPABASE_URL ||
	PUBLIC_SUPABASE_URL.includes('placeholder') ||
	!PUBLIC_SUPABASE_ANON_KEY ||
	PUBLIC_SUPABASE_ANON_KEY.includes('placeholder');

export const supabase = isMock
	? null
	: createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);

// In-memory store so scores saved during the same session appear on the leaderboard
const mockStore: LeaderboardEntry[] = [
	{
		id: '1',
		wallet: '0xABCD',
		username: 'gnosis_wizard',
		avatar_url: null,
		score: 1420,
		correct: 10,
		created_at: new Date().toISOString()
	},
	{
		id: '2',
		wallet: '0xBEEF',
		username: 'circles_fan',
		avatar_url: null,
		score: 1180,
		correct: 9,
		created_at: new Date().toISOString()
	},
	{
		id: '3',
		wallet: '0xCAFE',
		username: 'xdai_maxi',
		avatar_url: null,
		score: 950,
		correct: 8,
		created_at: new Date().toISOString()
	},
	{
		id: '4',
		wallet: '0xDEAD',
		username: 'pathfinder_pro',
		avatar_url: null,
		score: 820,
		correct: 7,
		created_at: new Date().toISOString()
	},
	{
		id: '5',
		wallet: '0xFACE',
		username: 'gno_token',
		avatar_url: null,
		score: 650,
		correct: 6,
		created_at: new Date().toISOString()
	}
];

export async function saveScore(entry: Omit<LeaderboardEntry, 'id' | 'created_at'>) {
	if (isMock) {
		mockStore.push({ ...entry, id: crypto.randomUUID(), created_at: new Date().toISOString() });
		return;
	}
	console.log('[supabase] saving score', entry);
	const { data, error } = await supabase!.from('leaderboard').insert(entry).select();
	if (error) {
		console.error('[supabase] insert error', error.code, error.message, error.details, error.hint);
	} else {
		console.log('[supabase] insert ok', data);
	}
}

export async function getTopScores(): Promise<LeaderboardEntry[]> {
	if (isMock) {
		const seen = new Set<string>();
		return [...mockStore]
			.sort((a, b) => b.score - a.score)
			.filter((row) => {
				if (seen.has(row.wallet)) return false;
				seen.add(row.wallet);
				return true;
			})
			.slice(0, 20);
	}

	const { data, error } = await supabase!
		.from('leaderboard')
		.select('*')
		.order('score', { ascending: false })
		.limit(100);

	if (error) {
		console.error('[supabase] select error', error.code, error.message);
		throw new Error(error.message);
	}
	if (!data) return [];

	const seen = new Set<string>();
	const top: LeaderboardEntry[] = [];
	for (const row of data) {
		if (!seen.has(row.wallet)) {
			seen.add(row.wallet);
			top.push(row as LeaderboardEntry);
			if (top.length === 20) break;
		}
	}
	return top;
}
