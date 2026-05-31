'use client';

import { useState } from 'react';

interface ResultDisplayProps {
  result: {
    encrypted: string;
    decrypted: string;
  };
}

export default function ResultDisplay({ result }: ResultDisplayProps) {
  const [copied, setCopied] = useState<'encrypted' | 'decrypted' | null>(null);

  const copyToClipboard = (text: string, type: 'encrypted' | 'decrypted') => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="bg-secondary rounded-lg p-8 border border-border">
      <h3 className="text-2xl font-bold text-foreground mb-6">Results</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-foreground">Original Text</label>
          <div className="bg-background rounded-lg p-4 border border-border relative">
            <p className="text-foreground break-words whitespace-pre-wrap">{result.decrypted}</p>
          </div>
          <button
            onClick={() => copyToClipboard(result.decrypted, 'decrypted')}
            className="w-full py-2 px-3 rounded-lg text-sm font-medium bg-secondary-foreground text-secondary transition hover:opacity-80"
          >
            {copied === 'decrypted' ? '✓ Copied!' : 'Copy Original'}
          </button>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-semibold text-foreground">Encrypted Text</label>
          <div className="bg-background rounded-lg p-4 border border-border relative">
            <p className="text-foreground break-words whitespace-pre-wrap font-mono">{result.encrypted}</p>
          </div>
          <button
            onClick={() => copyToClipboard(result.encrypted, 'encrypted')}
            className="w-full py-2 px-3 rounded-lg text-sm font-medium bg-primary text-primary-foreground transition hover:opacity-80"
          >
            {copied === 'encrypted' ? '✓ Copied!' : 'Copy Encrypted'}
          </button>
        </div>
      </div>

      <div className="mt-8 pt-8 border-t border-border">
        <p className="text-sm text-foreground/60">
          💡 <span className="font-semibold">Pro Tip:</span> The Caesar cipher shifts each letter by a fixed number of positions in the alphabet. Try different shift values to encrypt and decrypt messages!
        </p>
      </div>
    </div>
  );
}
