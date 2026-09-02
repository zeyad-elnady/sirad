'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export default function DashboardLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/dashboard/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Invalid credentials');
        setIsLoading(false);
        return;
      }

      router.push('/dashboard');
      router.refresh();
    } catch {
      setError('Something went wrong. Please try again.');
      setIsLoading(false);
    }
  }

  return (
    <html lang="en" dir="ltr" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
        <title>Sign In — Sirad Command Center</title>
      </head>
      <body
        style={{
          margin: 0,
          padding: 0,
          minHeight: '100vh',
          background: '#131313',
          fontFamily: '"Inter", sans-serif',
          color: '#e5e2e1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Ambient Neon Glows matching Sirad Website */}
        <div
          style={{
            position: 'fixed',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 0,
          }}
        >
          {/* Electric Lime Glow — Top Right */}
          <div
            style={{
              position: 'absolute',
              top: '-15%',
              right: '-10%',
              width: '650px',
              height: '650px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(182,255,51,0.08) 0%, transparent 70%)',
              filter: 'blur(90px)',
            }}
          />
          {/* Emerald Glow — Bottom Left */}
          <div
            style={{
              position: 'absolute',
              bottom: '-20%',
              left: '-10%',
              width: '600px',
              height: '600px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(34,197,94,0.04) 0%, transparent 70%)',
              filter: 'blur(90px)',
            }}
          />
          {/* Subtle Grid Lines */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
              `,
              backgroundSize: '48px 48px',
            }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 25, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'relative',
            zIndex: 10,
            width: '100%',
            maxWidth: '440px',
            margin: '0 24px',
          }}
        >
          {/* Logo & Subtitle */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <Link
              href="/"
              style={{
                display: 'inline-flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: '16px',
                textDecoration: 'none',
              }}
            >
              <div style={{ position: 'relative', width: '160px', height: '48px' }}>
                <Image
                  src="/logo-.png"
                  alt="Sirad"
                  width={160}
                  height={48}
                  priority
                  style={{ objectFit: 'contain' }}
                />
              </div>
            </Link>

            <div>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  background: 'rgba(182,255,51,0.06)',
                  border: '1px solid rgba(182,255,51,0.2)',
                  fontSize: '11px',
                  fontFamily: '"Space Grotesk", sans-serif',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  color: '#B6FF33',
                }}
              >
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: '#B6FF33',
                    boxShadow: '0 0 8px #B6FF33',
                  }}
                />
                Command Center Access
              </span>
            </div>
          </div>

          {/* Login Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            style={{
              background: 'rgba(24, 24, 26, 0.85)',
              backdropFilter: 'blur(30px)',
              WebkitBackdropFilter: 'blur(30px)',
              borderRadius: '24px',
              padding: '38px 36px',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: `
                0 0 0 1px rgba(255,255,255,0.03),
                0 20px 60px rgba(0,0,0,0.5),
                0 0 60px rgba(182,255,51,0.04)
              `,
            }}
          >
            <h1
              style={{
                fontSize: '22px',
                fontWeight: 700,
                fontFamily: '"Space Grotesk", sans-serif',
                marginBottom: '6px',
                letterSpacing: '-0.02em',
                color: '#e5e2e1',
              }}
            >
              Authenticate
            </h1>
            <p style={{ fontSize: '13px', color: 'rgba(229,226,225,0.6)', marginBottom: '28px' }}>
              Sign in with your Sirad master account credentials
            </p>

            <form onSubmit={handleSubmit}>
              {/* Email Field */}
              <div style={{ marginBottom: '20px' }}>
                <label
                  htmlFor="login-email"
                  style={{
                    display: 'block',
                    fontSize: '11px',
                    fontFamily: '"Space Grotesk", sans-serif',
                    fontWeight: 600,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'rgba(229,226,225,0.5)',
                    marginBottom: '8px',
                  }}
                >
                  Email Address
                </label>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="zeyad@sirad.tech"
                  required
                  style={{
                    width: '100%',
                    padding: '13px 16px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '12px',
                    color: '#e5e2e1',
                    fontSize: '14px',
                    fontFamily: '"Inter", sans-serif',
                    outline: 'none',
                    transition: 'all 0.2s',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(182,255,51,0.5)';
                    e.currentTarget.style.boxShadow = '0 0 20px rgba(182,255,51,0.12)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </div>

              {/* Password Field */}
              <div style={{ marginBottom: '26px' }}>
                <label
                  htmlFor="login-password"
                  style={{
                    display: 'block',
                    fontSize: '11px',
                    fontFamily: '"Space Grotesk", sans-serif',
                    fontWeight: 600,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'rgba(229,226,225,0.5)',
                    marginBottom: '8px',
                  }}
                >
                  Password
                </label>
                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{
                    width: '100%',
                    padding: '13px 16px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '12px',
                    color: '#e5e2e1',
                    fontSize: '14px',
                    fontFamily: '"Inter", sans-serif',
                    outline: 'none',
                    transition: 'all 0.2s',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(182,255,51,0.5)';
                    e.currentTarget.style.boxShadow = '0 0 20px rgba(182,255,51,0.12)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </div>

              {/* Error Alert */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '12px',
                    background: 'rgba(239,68,68,0.1)',
                    border: '1px solid rgba(239,68,68,0.25)',
                    color: '#f87171',
                    fontSize: '13px',
                    marginBottom: '20px',
                  }}
                >
                  {error}
                </motion.div>
              )}

              {/* Primary Submit Button — Signature Neon Lime */}
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '9999px',
                  border: 'none',
                  background: isLoading ? 'rgba(182,255,51,0.4)' : '#B6FF33',
                  color: '#121f00',
                  fontSize: '14px',
                  fontWeight: 700,
                  fontFamily: '"Space Grotesk", sans-serif',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s',
                  boxShadow: isLoading ? 'none' : '0 0 25px rgba(182,255,51,0.35)',
                }}
                onMouseEnter={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.boxShadow = '0 0 35px rgba(182,255,51,0.5)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 25px rgba(182,255,51,0.35)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {isLoading ? 'Authenticating...' : 'Enter Command Center'}
              </button>
            </form>
          </motion.div>

          {/* Footer note */}
          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <Link
              href="/"
              style={{
                fontSize: '12px',
                color: 'rgba(229,226,225,0.4)',
                textDecoration: 'none',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#B6FF33')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(229,226,225,0.4)')}
            >
              ← Return to public website
            </Link>
          </div>
        </motion.div>
      </body>
    </html>
  );
}
