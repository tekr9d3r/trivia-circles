import type { Question } from './types.js';

export const QUESTIONS: Question[] = [
	{
		id: 1,
		question: 'At what rate is CRC minted?',
		options: ['1 per hour', '1 per block', '24 daily', 'Infinite vibes'],
		answerIndex: 0
	},
	{
		id: 2,
		question: 'Who controls a self-custodial wallet?',
		options: ['You', 'The bank', 'Vitalik', 'Customer support'],
		answerIndex: 0
	},
	{
		id: 3,
		question: 'What can communities create together in Circles?',
		options: ['Group Currency', 'Meme Coins', 'JPEG Vaults', 'DAO Pets'],
		answerIndex: 0
	},
	{
		id: 4,
		question: 'What kind of account is a Safe?',
		options: ['Smart Account', 'Burner Wallet', 'Exchange Account', 'Cold USB'],
		answerIndex: 0
	},
	{
		id: 5,
		question: 'What pays gas fees on Gnosis Chain?',
		options: ['xDAI', 'ETH', 'BTC', 'Dogecoin'],
		answerIndex: 0
	},
	{
		id: 6,
		question: "What's the main governance token of Gnosis?",
		options: ['GNO', 'SAFE', 'USDC', 'PEPE'],
		answerIndex: 0
	},
	{
		id: 7,
		question: 'Gnosis Pay cards run on which network?',
		options: ['Visa', 'Mastercard', 'PayPal', 'Steam'],
		answerIndex: 0
	},
	{
		id: 8,
		question: 'What was Gnosis Chain originally called?',
		options: ['xDAI Chain', 'MoonChain', 'SafeNet', 'OmniDAO'],
		answerIndex: 0
	},
	{
		id: 9,
		question: 'What wallet system powers Gnosis Pay?',
		options: ['Safe', 'MetaMask', 'Phantom', 'Ledger Live'],
		answerIndex: 0
	},
	{
		id: 10,
		question: "What's the big idea behind Circles?",
		options: ['UBI', 'Yield Farming', 'NFTs', 'High Gas Fees'],
		answerIndex: 0
	},
	{
		id: 11,
		question: 'What wrapped version of xDAI exists?',
		options: ['wxDAI', 'superDAI', 'gxDAI', 'wrappedETH'],
		answerIndex: 0
	},
	{
		id: 12,
		question: 'What chain ID does Gnosis use?',
		options: ['100', '69', '420', '1'],
		answerIndex: 0
	},
	{
		id: 13,
		question: 'What kind of approvals can a Safe require?',
		options: ['Multisig', 'Proof-of-Memes', 'Fingerprints', 'CAPTCHA'],
		answerIndex: 0
	},
	{
		id: 14,
		question: 'What does CRC stand for?',
		options: ['Circles Token', 'Crypto Rewards Coin', 'Chain Reserve Cash', 'Circle Coin'],
		answerIndex: 0
	},
	{
		id: 15,
		question: 'What blockchain is Circles built on?',
		options: ['Gnosis', 'Solana', 'Bitcoin', 'Polygon'],
		answerIndex: 0
	},
	{
		id: 16,
		question: 'What type of payments is xDAI designed for?',
		options: ['Stable Payments', 'Gambling', 'JPEG Trading', 'Mining Rewards'],
		answerIndex: 0
	},
	{
		id: 17,
		question: 'What secures assets in Safe wallets?',
		options: ['Smart Contracts', 'Passwords', 'Email Login', 'Google Drive'],
		answerIndex: 0
	},
	{
		id: 18,
		question: "What's the governance token ticker for SafeDAO?",
		options: ['SAFE', 'GNOSIS', 'WALLET', 'SECURE'],
		answerIndex: 0
	},
	{
		id: 19,
		question: 'What does SIWE mean?',
		options: ['Sign-In Ethereum', 'Secure Internet Wallet', 'Send Instant Web3 ETH', 'Simple Wallet Entry'],
		answerIndex: 0
	},
	{
		id: 20,
		question: "What's the vibe of Circles' economy model?",
		options: ['Trust Networks', 'Mining Pools', 'AI Trading', 'Ponzinomics'],
		answerIndex: 0
	}
];

// Pick n random questions from the pool
export function getRandomQuestions(n: number): Question[] {
	const shuffled = [...QUESTIONS].sort(() => Math.random() - 0.5);
	return shuffled.slice(0, n);
}

// Shuffle the answer options while keeping track of the correct one
export function shuffleOptions(question: Question): Question {
	const correctOption = question.options[question.answerIndex];
	const shuffled = [...question.options].sort(() => Math.random() - 0.5);
	return {
		...question,
		options: shuffled,
		answerIndex: shuffled.indexOf(correctOption)
	};
}
