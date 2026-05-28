// src/pages/AuthPage.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { login, register } from '../lib/api'
import { useAuth } from '../lib/AuthContext'

export default function AuthPage() {
  const { t } = useTranslation()
  const { loginUser } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const fn = mode === 'login' ? login : register
      const r = await fn(form)
      loginUser(r.data.token, r.data.user)
      toast.success(r.data.message)
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.message || t('common.error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      {/* Background decoration */}
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', zIndex: 0 }}>
        {[...Array(3)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: '300px', height: '300px',
            borderRadius: '50%',
            border: '1px solid rgba(201,169,110,0.08)',
            left: `${20 + i * 30}%`, top: `${20 + i * 20}%`,
            transform: `scale(${1 + i * 0.5})`,
          }} />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="glass"
        style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '420px', padding: '2.5rem' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: 'var(--blush)', marginBottom: '0.25rem' }}>
            {mode === 'login' ? t('auth.login') : t('auth.register')}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>NAPA Chapter One</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
          {mode === 'register' && (
            <div>
              <label style={labelStyle}>{t('auth.name')}</label>
              <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Your full name" />
            </div>
          )}
          <div>
            <label style={labelStyle}>{t('auth.email')}</label>
            <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="your@email.com" />
          </div>
          <div>
            <label style={labelStyle}>{t('auth.password')}</label>
            <input type="password" value={form.password} onChange={e => set('password', e.target.value)} placeholder="••••••••" onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
          </div>
        </div>

        <button className="btn btn-primary" style={{ width: '100%', marginBottom: '1.5rem' }} onClick={handleSubmit} disabled={loading}>
          {loading ? '…' : mode === 'login' ? t('auth.login') : t('auth.register')}
        </button>

        <div className="divider" />

        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          {mode === 'login' ? t('auth.noAccount') : t('auth.haveAccount')}{' '}
          <span onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            style={{ color: 'var(--gold)', cursor: 'pointer', borderBottom: '1px solid rgba(201,169,110,0.3)' }}>
            {mode === 'login' ? t('auth.register') : t('auth.login')}
          </span>
        </p>
      </motion.div>
    </div>
  )
}

const labelStyle = {
  display: 'block',
  fontFamily: 'var(--font-label)',
  fontSize: '0.55rem',
  letterSpacing: '2px',
  color: 'var(--text-muted)',
  textTransform: 'uppercase',
  marginBottom: '6px',
}