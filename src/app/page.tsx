import Screen from '@/components/Screen/Screen';

// Placeholder — the real homepage is built in phase (b).
export default function HomePage() {
  return (
    <Screen>
      <h1 style={{ fontSize: 'var(--fs-2xl)', letterSpacing: 'var(--ls-tight)', lineHeight: 'var(--lh-tight)', textAlign: 'center', marginTop: 'auto' }}>
        Compare your thoughts on <span style={{ color: 'var(--color-primary)' }}>technology</span> with current industry opinions.
      </h1>
    </Screen>
  );
}
