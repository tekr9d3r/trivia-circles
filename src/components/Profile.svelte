<script lang="ts">
	import type { UserProfile } from '$lib/types.js';

	interface Props {
		profile: UserProfile;
		onClose: () => void;
	}

	let { profile, onClose }: Props = $props();

	const GNOSIS_RPC = 'https://rpc.gnosischain.com';
	const CIRCLES_RPC = 'https://rpc.aboutcircles.com/';
	const GNO_CONTRACT = '0x9C58BAcC331c9aa871AFD802DB6379a98e80CEdb';

	let crcBalance = $state<string | null>(null);
	let gnoBalance = $state<string | null>(null);
	let xdaiBalance = $state<string | null>(null);
	let copied = $state(false);

	async function rpc(url: string, method: string, params: unknown[]) {
		const res = await fetch(url, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params })
		});
		const json = await res.json();
		if (json.error) throw new Error(json.error.message);
		return json.result;
	}

	function hexToFloat(hex: string, decimals = 18): string {
		const wei = BigInt(hex);
		if (wei === 0n) return '0';
		const factor = 10n ** BigInt(decimals);
		const whole = wei / factor;
		const frac = wei % factor;
		const fracStr = frac.toString().padStart(decimals, '0').slice(0, 4).replace(/0+$/, '');
		return fracStr ? `${whole}.${fracStr}` : `${whole}`;
	}

	async function loadBalances() {
		const addr = profile.address;
		const addrPadded = addr.slice(2).padStart(64, '0');

		// Run all three in parallel
		const [crc, gno, xdai] = await Promise.allSettled([
			rpc(CIRCLES_RPC, 'circles_getTotalBalance', [addr, true]),
			rpc(GNOSIS_RPC, 'eth_call', [{ to: GNO_CONTRACT, data: `0x70a08231${addrPadded}` }, 'latest']),
			rpc(GNOSIS_RPC, 'eth_getBalance', [addr, 'latest'])
		]);

		if (crc.status === 'fulfilled') {
			const raw = parseFloat(crc.value ?? '0');
			crcBalance = raw === 0 ? '0' : raw.toLocaleString('en', { maximumFractionDigits: 2 });
		} else {
			crcBalance = '—';
		}

		gnoBalance = gno.status === 'fulfilled' ? hexToFloat(gno.value) : '—';
		xdaiBalance = xdai.status === 'fulfilled' ? hexToFloat(xdai.value) : '—';
	}

	$effect(() => {
		loadBalances();
	});

	async function copyAddress() {
		await navigator.clipboard.writeText(profile.address);
		copied = true;
		setTimeout(() => (copied = false), 1500);
	}

	const shortAddr = profile.address.slice(0, 8) + '…' + profile.address.slice(-6);
</script>

<!-- Backdrop -->
<div
	class="fixed inset-0 z-50 flex items-end justify-center"
	style="background: rgba(10,10,46,0.4); backdrop-filter: blur(2px)"
	role="presentation"
	onclick={onClose}
>
	<!-- Sheet -->
	<div
		class="w-full max-w-md rounded-t-3xl p-6"
		style="background: var(--bg)"
		role="dialog"
		aria-modal="true"
		onclick={(e) => e.stopPropagation()}
		onkeydown={(e) => e.key === 'Escape' && onClose()}
	>
		<!-- Handle -->
		<div class="mx-auto mb-5 h-1 w-10 rounded-full" style="background: var(--border)"></div>

		<!-- Avatar + name -->
		<div class="mb-6 flex items-center gap-4">
			{#if profile.avatarUrl}
				<img
					src={profile.avatarUrl}
					alt={profile.name}
					class="h-14 w-14 rounded-full object-cover"
					style="border: 2px solid var(--blue)"
				/>
			{:else}
				<div
					class="flex h-14 w-14 items-center justify-center rounded-full text-xl font-black text-white"
					style="background: linear-gradient(135deg, var(--blue), #6d28d9)"
				>
					{profile.name.slice(0, 2).toUpperCase()}
				</div>
			{/if}
			<div>
				<p class="text-lg font-black" style="color: var(--text)">{profile.name}</p>
				<p class="text-xs" style="color: var(--text-muted)">Circles Account</p>
			</div>
		</div>

		<!-- Wallet address -->
		<div class="mb-4 rounded-2xl p-4" style="background: var(--surface); border: 1px solid var(--border)">
			<p class="mb-1.5 text-xs font-bold uppercase tracking-widest" style="color: var(--text-dim)">Wallet</p>
			<div class="flex items-center justify-between gap-2">
				<span class="font-mono text-sm font-semibold" style="color: var(--text)">{shortAddr}</span>
				<button
					onclick={copyAddress}
					class="rounded-lg px-3 py-1.5 text-xs font-bold transition-all active:scale-95"
					style="background: var(--blue-light); color: var(--blue)"
				>
					{copied ? '✓ Copied' : 'Copy'}
				</button>
			</div>
		</div>

		<!-- Balances -->
		<div class="space-y-2">
			<p class="mb-2 text-xs font-bold uppercase tracking-widest" style="color: var(--text-dim)">Balances</p>

			{#each [
				{ label: 'CRC', sublabel: 'Circles Token', value: crcBalance, color: 'var(--blue)' },
				{ label: 'GNO', sublabel: 'Gnosis Token', value: gnoBalance, color: '#6d28d9' },
				{ label: 'xDAI', sublabel: 'Gas Token', value: xdaiBalance, color: '#15803d' }
			] as token}
				<div class="flex items-center justify-between rounded-xl px-4 py-3" style="background: var(--surface); border: 1px solid var(--border)">
					<div class="flex items-center gap-3">
						<div class="flex h-8 w-8 items-center justify-center rounded-full text-xs font-black text-white" style="background: {token.color}">
							{token.label.slice(0, 1)}
						</div>
						<div>
							<p class="text-sm font-bold" style="color: var(--text)">{token.label}</p>
							<p class="text-xs" style="color: var(--text-muted)">{token.sublabel}</p>
						</div>
					</div>
					<span class="font-black tabular-nums" style="color: {token.color}">
						{token.value ?? '…'}
					</span>
				</div>
			{/each}
		</div>

		<!-- Close -->
		<button
			onclick={onClose}
			class="mt-5 w-full rounded-2xl py-3.5 text-sm font-bold transition-all active:scale-95"
			style="background: var(--surface); border: 1.5px solid var(--border); color: var(--text-muted)"
		>
			Close
		</button>
	</div>
</div>
