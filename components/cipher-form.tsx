'use client';

import { useState } from 'react';

interface CipherFormProps {
  onSubmit: (text: string, shift: number) => void;
  mode: 'encrypt' | 'decrypt';
}

export default function CipherForm({ onSubmit, mode }: CipherFormProps) {
  const [text, setText] = useState('');
  const [shift, setShift] = useState(3);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSubmit(text, shift);
    }
  };

  const buttonLabel = mode === 'encrypt' ? 'Encrypt' : 'Decrypt';
  const buttonBg = mode === 'encrypt' ? 'bg-primary' : 'bg-accent';

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-secondary rounded-lg p-6 border border-border">
      <div>
        <label htmlFor={`text-${mode}`} className="block text-sm font-semibold text-foreground mb-3">
          Text to {buttonLabel}
        </label>
        <textarea
          id={`text-${mode}`}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter your message here..."
          className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary transition"
          rows={6}
        />
      </div>

      <div>
        <label htmlFor={`shift-${mode}`} className="block text-sm font-semibold text-foreground mb-3">
          Shift Value: <span className="text-primary font-bold">{shift}</span>
        </label>
        <input
          id={`shift-${mode}`}
          type="range"
          min="0"
          max="25"
          value={shift}
          onChange={(e) => setShift(Number(e.target.value))}
          className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
        />
        <div className="flex justify-between text-xs text-foreground/60 mt-2">
          <span>0</span>
          <span>25</span>
        </div>
      </div>

      <button
        type="submit"
        disabled={!text.trim()}
        className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition disabled:opacity-50 disabled:cursor-not-allowed ${buttonBg} hover:opacity-90`}
      >
        {buttonLabel} ({shift})
      </button>
    </form>
  );
}
