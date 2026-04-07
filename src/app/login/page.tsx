"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"

export default function LoginPage() {
  const [loading, setLoading] = useState(false)

  async function handleSignIn() {
    setLoading(true)
    await signIn("google", { callbackUrl: "/" })
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm flex flex-col items-center gap-8 frost-enter">

        {/* Wordmark + tagline */}
        <div className="text-center">
          <p className="wordmark-frost text-5xl tracking-widest mb-3">MartialOps</p>
          <div className="w-16 h-px mx-auto mb-4"
            style={{ background: "linear-gradient(90deg, transparent, #2563eb, transparent)" }} />
          <p className="text-text-muted text-sm tracking-wide">Combat sports gym operations</p>
        </div>

        {/* Login card */}
        <div className="frost-card rounded-2xl w-full px-8 py-8 flex flex-col gap-6 frost-enter-2">
          <div className="text-center">
            <p className="text-text-primary font-semibold text-base">Sign in to continue</p>
            <p className="text-text-muted text-xs mt-1">Your gym is waiting</p>
          </div>

          <button
            onClick={handleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 rounded-xl py-3 px-4 text-sm font-semibold transition-all duration-200"
            style={{
              background: "rgba(255, 255, 255, 0.85)",
              border: "1px solid rgba(148, 163, 184, 0.35)",
              color: "#1e293b",
              boxShadow: "0 2px 8px rgba(14, 28, 46, 0.08), inset 0 1px 0 rgba(255,255,255,0.9)",
            }}
            onMouseEnter={e => {
              if (!loading) {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(96, 165, 250, 0.5)"
                ;(e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(37, 99, 235, 0.15), inset 0 1px 0 rgba(255,255,255,0.9)"
              }
            }}
            onMouseLeave={e => {
              ;(e.currentTarget as HTMLElement).style.borderColor = "rgba(148, 163, 184, 0.35)"
              ;(e.currentTarget as HTMLElement).style.boxShadow = "0 2px 8px rgba(14, 28, 46, 0.08), inset 0 1px 0 rgba(255,255,255,0.9)"
            }}
          >
            {loading ? (
              <span className="text-text-muted">Redirecting…</span>
            ) : (
              <>
                {/* Google logo */}
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                  <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
                  <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                  <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </>
            )}
          </button>

          <p className="text-center text-text-muted text-xs leading-relaxed">
            By signing in you agree to your gym&apos;s<br />terms and conditions.
          </p>
        </div>

        {/* Bottom frost line */}
        <div className="w-32 h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(96, 165, 250, 0.3), transparent)" }} />
      </div>
    </main>
  )
}
