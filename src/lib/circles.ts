import type { UserProfile } from './types.js';

const IPFS_GATEWAY = 'https://ipfs.io/ipfs/';
const fallback = (address: string): UserProfile => ({
	address,
	name: address.slice(0, 6) + '…' + address.slice(-4),
	avatarUrl: null
});

export async function getProfile(address: string): Promise<UserProfile> {
	try {
		// Step 1: get avatar info to find the IPFS CID
		const rpcRes = await fetch('https://rpc.aboutcircles.com/', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				jsonrpc: '2.0',
				id: 1,
				method: 'circles_getAvatarInfo',
				params: [address]
			})
		});
		const rpcJson = await rpcRes.json();
		const cid = rpcJson?.result?.cidV0;

		if (!cid) return fallback(address);

		// Step 2: fetch profile JSON from IPFS
		const ipfsRes = await fetch(IPFS_GATEWAY + cid);
		const profile = await ipfsRes.json();

		return {
			address,
			name: profile?.name || fallback(address).name,
			avatarUrl: profile?.previewImageUrl ?? null
		};
	} catch {
		return fallback(address);
	}
}
