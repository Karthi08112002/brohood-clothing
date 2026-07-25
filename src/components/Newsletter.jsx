import { useState } from 'react';
import { subscribeToNewsletter } from '../lib/api';

export default function Newsletter({ compact = false }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('loading');
    try {
      await subscribeToNewsletter(email.trim());
      setStatus('success');
      setEmail('');
    } catch {
      setStatus('error');
    }
  }

  if (compact) {
    return (
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h4 className="font-display text-xl">Join the Brohood List</h4>
          <p className="text-sm text-bh-grey mt-1">Early access to drops, private sales, and styling notes.</p>
        </div>
        <form onSubmit={handleSubmit} className="flex w-full sm:w-auto gap-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            className="bh-input sm:w-64"
          />
          <button type="submit" disabled={status === 'loading'} className="bh-btn-primary shrink-0">
            {status === 'loading' ? 'Joining...' : 'Subscribe'}
          </button>
        </form>
        {status === 'success' && <p className="text-xs text-bh-gold-bright sm:hidden">You're on the list.</p>}
      </div>
    );
  }

  return (
    <section className="bh-container py-16 sm:py-24 text-center">
      <p className="bh-eyebrow mb-4 justify-center">Stay Ahead</p>
      <h2 className="font-display text-3xl sm:text-5xl max-w-xl mx-auto">
        Be first to know when the next drop lands.
      </h2>
      <form onSubmit={handleSubmit} className="mt-9 max-w-md mx-auto flex gap-3">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="bh-input text-center sm:text-left"
        />
        <button type="submit" disabled={status === 'loading'} className="bh-btn-primary shrink-0">
          {status === 'loading' ? 'Joining...' : 'Subscribe'}
        </button>
      </form>
      {status === 'success' && <p className="mt-4 text-sm text-bh-gold-bright">You're on the list \u2014 welcome to Brohood.</p>}
      {status === 'error' && <p className="mt-4 text-sm text-red-400">Something went wrong. Please try again.</p>}
    </section>
  );
}
