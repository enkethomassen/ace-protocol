/**
 * ACE Protocol — Devnet Transaction Seeder
 *
 * Creates REAL on-chain devnet transactions so the ACE treasury dashboard
 * has genuine wallet history to fetch, parse, and analyze.
 *
 * What it does:
 *   1. Generates a fresh keypair ("seed wallet") and airdrops devnet SOL to it.
 *   2. Creates a realistic mix of on-chain activity:
 *        - Incoming SOL transfers  (revenue / received payments)
 *        - Outgoing SOL transfers  (payroll, vendor payments, ops spend)
 *        - Repeated transfers      (recurring subscriptions / payroll detection)
 *        - Multiple counterparties (real treasury ledger shape)
 *   3. Prints the seed wallet's private key in base58 so you can import it
 *      into Phantom / Solflare under "Add wallet → Import private key".
 *
 * Usage:
 *   npm run seed:devnet
 *
 * After it finishes:
 *   - Import the printed private key into your wallet app on Devnet
 *   - Connect that wallet to ACE in Devnet mode
 *   - The treasury engine will fetch and classify all real activity
 *
 * ⚠️  Devnet funds only — no real SOL is used.
 */

import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
  clusterApiUrl,
} from '@solana/web3.js';
import bs58 from 'bs58';

// ── Config ────────────────────────────────────────────────────────────────────

const DEVNET_RPC =
  process.env.NEXT_PUBLIC_SOLANA_DEVNET_RPC ??
  clusterApiUrl('devnet');

const connection = new Connection(DEVNET_RPC, {
  commitment: 'confirmed',
  confirmTransactionInitialTimeout: 60_000,
});

// Delay between transactions — avoids rate-limiting and creates spread-out
// block_time values so the timeline charts look realistic
const TX_DELAY_MS = 1500;

// ── Helpers ───────────────────────────────────────────────────────────────────

function sleep(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

/** Request a devnet airdrop with automatic retry on transient failures. */
async function airdrop(kp: Keypair, sol: number, attempt = 1): Promise<void> {
  try {
    const sig = await connection.requestAirdrop(
      kp.publicKey,
      sol * LAMPORTS_PER_SOL,
    );
    // Use the newer confirmation strategy to avoid timeout on slow devnet
    const latestBlockhash = await connection.getLatestBlockhash();
    await connection.confirmTransaction(
      { signature: sig, ...latestBlockhash },
      'confirmed',
    );
    console.log(
      `  ✔ Airdrop ${sol} SOL → ${kp.publicKey.toBase58().slice(0, 10)}…  [${sig.slice(0, 12)}…]`,
    );
    await sleep(800);
  } catch (err) {
    if (attempt < 4) {
      const wait = attempt * 3000;
      console.log(
        `  ↻ Airdrop attempt ${attempt} failed, retrying in ${wait / 1000}s…`,
      );
      await sleep(wait);
      return airdrop(kp, sol, attempt + 1);
    }
    throw new Error(
      `Airdrop failed after ${attempt} attempts: ${err instanceof Error ? err.message : String(err)}`,
    );
  }
}

async function transfer(
  from: Keypair,
  to: PublicKey,
  solAmount: number,
  label: string,
): Promise<string> {
  const lamports = Math.floor(solAmount * LAMPORTS_PER_SOL);
  const tx = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: from.publicKey,
      toPubkey: to,
      lamports,
    }),
  );
  const sig = await sendAndConfirmTransaction(connection, tx, [from], {
    commitment: 'confirmed',
  });
  console.log(
    `  ✔ ${label.padEnd(30)} ${solAmount.toFixed(4)} SOL  [${sig.slice(0, 12)}…]`,
  );
  await sleep(TX_DELAY_MS);
  return sig;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log(
    '\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
  );
  console.log('  ACE Protocol · Devnet Transaction Seeder');
  console.log(
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n',
  );
  console.log(`  RPC  ${DEVNET_RPC}\n`);

  // ── Step 1: Treasury wallet ────────────────────────────────────────────────
  console.log('◆ Generating seed wallet…');
  const treasury = Keypair.generate();
  const treasuryPubkey = treasury.publicKey;
  const treasuryPrivateKey = bs58.encode(treasury.secretKey);

  console.log(`  Address     : ${treasuryPubkey.toBase58()}`);
  console.log(`  Private key : ${treasuryPrivateKey}\n`);

  // ── Step 2: Counterparty wallets ──────────────────────────────────────────
  console.log('◆ Generating counterparty wallets…');
  const payrollRecipient  = Keypair.generate(); // contractor / payroll
  const vendorA           = Keypair.generate(); // infra / SaaS
  const vendorB           = Keypair.generate(); // tooling / subscription
  const clientA           = Keypair.generate(); // sends TO treasury
  const clientB           = Keypair.generate(); // sends TO treasury
  const protocolFee       = Keypair.generate(); // protocol interactions
  const subVault          = Keypair.generate(); // internal reserve

  const show = (label: string, kp: Keypair) =>
    console.log(`  ${label.padEnd(12)}: ${kp.publicKey.toBase58().slice(0, 18)}…`);
  show('payroll',  payrollRecipient);
  show('vendor A', vendorA);
  show('vendor B', vendorB);
  show('client A', clientA);
  show('client B', clientB);
  console.log('');

  // ── Step 3: Fund wallets ───────────────────────────────────────────────────
  console.log('◆ Airdropping devnet SOL (may retry on public RPC throttle)…');
  await airdrop(treasury, 2);
  await airdrop(treasury, 2);   // second drop → ~4 SOL total headroom
  await airdrop(clientA,  2);
  await airdrop(clientB,  2);
  await airdrop(subVault, 1);
  console.log('  Wallets funded.\n');

  // ── Step 4: Incoming — revenue from clients ────────────────────────────────
  console.log('◆ Creating incoming transfers (revenue / received payments)…');
  await transfer(clientA, treasuryPubkey, 0.40, 'Client A — Invoice #001');
  await transfer(clientB, treasuryPubkey, 0.25, 'Client B — Retainer Jan');
  await transfer(clientA, treasuryPubkey, 0.40, 'Client A — Invoice #002');
  await transfer(clientB, treasuryPubkey, 0.25, 'Client B — Retainer Feb');
  await transfer(clientA, treasuryPubkey, 0.40, 'Client A — Invoice #003');
  await transfer(clientB, treasuryPubkey, 0.25, 'Client B — Retainer Mar');

  // ── Step 5: Outgoing — payroll (recurring, same recipient) ────────────────
  // Fixed-amount transfers to the same address every cycle = ACE recurring detection
  console.log('\n◆ Creating outgoing — payroll (recurring)…');
  await transfer(treasury, payrollRecipient.publicKey, 0.15, 'Payroll — Week 1');
  await transfer(treasury, payrollRecipient.publicKey, 0.15, 'Payroll — Week 2');
  await transfer(treasury, payrollRecipient.publicKey, 0.15, 'Payroll — Week 3');
  await transfer(treasury, payrollRecipient.publicKey, 0.15, 'Payroll — Week 4');
  await transfer(treasury, payrollRecipient.publicKey, 0.15, 'Payroll — Week 5');

  // ── Step 6: Outgoing — vendor / SaaS bills ────────────────────────────────
  console.log('\n◆ Creating outgoing — vendor & SaaS payments…');
  await transfer(treasury, vendorA.publicKey, 0.04, 'Vendor A — Infra bill #1');
  await transfer(treasury, vendorB.publicKey, 0.07, 'Vendor B — Tooling sub #1');
  await transfer(treasury, vendorA.publicKey, 0.04, 'Vendor A — Infra bill #2');
  await transfer(treasury, vendorB.publicKey, 0.07, 'Vendor B — Tooling sub #2');
  await transfer(treasury, vendorA.publicKey, 0.04, 'Vendor A — Infra bill #3');

  // ── Step 7: Protocol interactions (small, varied) ─────────────────────────
  console.log('\n◆ Creating protocol interaction transactions…');
  await transfer(treasury, protocolFee.publicKey, 0.002, 'Protocol fee — op #1');
  await transfer(treasury, protocolFee.publicKey, 0.002, 'Protocol fee — op #2');
  await transfer(treasury, protocolFee.publicKey, 0.003, 'Protocol fee — op #3');
  await transfer(treasury, protocolFee.publicKey, 0.002, 'Protocol fee — op #4');

  // ── Step 8: Internal treasury rebalance ───────────────────────────────────
  console.log('\n◆ Creating internal treasury transfers (rebalance)…');
  await transfer(treasury, subVault.publicKey, 0.20, 'Treasury → Reserve vault');
  await transfer(subVault,  treasuryPubkey,    0.08, 'Reserve vault → Treasury');
  await transfer(treasury, subVault.publicKey, 0.20, 'Treasury → Reserve vault');

  // ── Final balance ──────────────────────────────────────────────────────────
  const finalBalance = await connection.getBalance(treasuryPubkey);
  const totalTxs = 6 + 5 + 5 + 4 + 3;

  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ✅  Seeding complete — ${totalTxs} real devnet transactions created
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Final balance : ${(finalBalance / LAMPORTS_PER_SOL).toFixed(4)} SOL

  NEXT STEPS
  ──────────
  1. Import this wallet into Phantom / Solflare / Backpack:

     Address     : ${treasuryPubkey.toBase58()}
     Private key : ${treasuryPrivateKey}

     → Settings → Manage Wallets → Add Wallet → Import Private Key

  2. Switch your wallet app to Devnet network.

  3. Open ACE dashboard:
     → Toggle to "Devnet"
     → Connect the imported wallet
     → Treasury engine fetches & classifies all activity

  Explorer (verify transactions are on-chain):
  https://explorer.solana.com/address/${treasuryPubkey.toBase58()}?cluster=devnet

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);
}

main().catch((err) => {
  console.error(
    '\n✗ Seeder failed:',
    err instanceof Error ? err.message : err,
  );
  process.exit(1);
});
