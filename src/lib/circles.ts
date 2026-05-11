import type { UserProfile } from './types.js';

export async function getProfile(address: string): Promise<UserProfile> {
	try {
		const res = await fetch('https://rpc.aboutcircles.com/', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				jsonrpc: '2.0',
				id: 1,
				method: 'circles_getAvatarInfo',
				params: [address]
			})
		});
		const json = await res.json();
		const result = json?.result;
		return {
			address,
			name: result?.name || address.slice(0, 6) + '…' + address.slice(-4),
			avatarUrl: result?.previewImageUrl ?? null
		};
	} catch {
		return {
			address,
			name: address.slice(0, 6) + '…' + address.slice(-4),
			avatarUrl: null
		};
	}
}
