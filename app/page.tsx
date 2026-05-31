'use client';

import { useState, useCallback } from 'react';
import CipherForm from '@/components/cipher-form';
import ResultDisplay from '@/components/result-display';
import Header from '@/components/header';

export default function Home() {
  const [result, setResult] = useState<{
    encrypted: string;
    decrypted: string;
  } | null>(null);

  const handleEncrypt = useCallback((text: string, shift: number) => {
    const encrypted = text
      .split('')
      .map(char => {
        if (char.match(/[a-z]/i)) {
          const code = char.charCodeAt(0);
          const base = code >= 97 ? 97 : 65;
          return String.fromCharCode(((code - base + shift) % 26) + base);
        }
        return char;
      })
      .join('');

    setResult({
      encrypted,
      decrypted: text,
    });
  }, []);

  const handleDecrypt = useCallback((text: string, shift: number) => {
    const decrypted = text
      .split('')
      .map(char => {
        if (char.match(/[a-z]/i)) {
          const code = char.charCodeAt(0);
          const base = code >= 97 ? 97 : 65;
          return String.fromCharCode(((code - base - shift) % 26 + 26) % 26 + base);
        }
        return char;
      })
      .join('');

    setResult({
      encrypted: text,
      decrypted,
    });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-6 text-foreground">Encrypt</h2>
            <CipherForm onSubmit={handleEncrypt} mode="encrypt" />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-6 text-foreground">Decrypt</h2>
            <CipherForm onSubmit={handleDecrypt} mode="decrypt" />
          </div>
        </div>

        {result && (
          <div className="mt-12">
            <ResultDisplay result={result} />
          </div>
        )}
      </main>
    </div>
  );
}
