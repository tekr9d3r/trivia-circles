import type { Question } from './types.js';

export const QUESTIONS: Question[] = [
	{
		id: 1,
		question: 'At what rate is personal currency (CRC) minted?',
		options: ['1 per day', '1 per hour', '10 per week', '24 per month'],
		answerIndex: 1
	},
	{
		id: 2,
		question: 'What does "Self-Custodial" mean for your funds?',
		options: ['Bank-managed', 'User-controlled', 'Locked forever', 'Publicly owned'],
		answerIndex: 1
	},
	{
		id: 3,
		question: 'What can be created to pool trust in a community?',
		options: ['Group Currencies', 'Savings Bonds', 'NFTs', 'Private Nodes'],
		answerIndex: 0
	},
	{
		id: 4,
		question: 'What type of account is a "Safe"?',
		options: ['Smart Account', 'Paper Wallet', 'Exchange Account', 'Local File'],
		answerIndex: 0
	},
	{
		id: 5,
		question: 'Which stablecoin is used for gas fees on Gnosis Chain?',
		options: ['USDC', 'USDT', 'xDAI', 'GNO'],
		answerIndex: 2
	},
	{
		id: 6,
		question: 'What is the primary governance token of the ecosystem?',
		options: ['SAFE', 'COW', 'GNO', 'CRC'],
		answerIndex: 2
	},
	{
		id: 7,
		question: 'Gnosis Pay cards are issued by which provider?',
		options: ['Mastercard', 'Visa', 'Amex', 'Discover'],
		answerIndex: 1
	},
	{
		id: 8,
		question: "What was Gnosis Chain's original name?",
		options: ['Polygon', 'xDAI Chain', 'Optimism', 'Binance'],
		answerIndex: 1
	},
	{
		id: 9,
		question: 'What type of smart account is used for security?',
		options: ['Safe', 'Ledger', 'MetaMask', 'Paper'],
		answerIndex: 0
	},
	{
		id: 10,
		question: 'What is the primary vision behind Circles?',
		options: ['High-speed Trading', 'Universal Basic Income', 'Cloud Storage', 'Social Media'],
		answerIndex: 1
	}
];

export function shuffleOptions(question: Question): Question {
	const indexed = question.options.map((opt, i) => ({ opt, i }));
	for (let j = indexed.length - 1; j > 0; j--) {
		const k = Math.floor(Math.random() * (j + 1));
		[indexed[j], indexed[k]] = [indexed[k], indexed[j]];
	}
	const correctOption = question.options[question.answerIndex];
	return {
		...question,
		options: indexed.map((x) => x.opt),
		answerIndex: indexed.findIndex((x) => x.opt === correctOption)
	};
}
