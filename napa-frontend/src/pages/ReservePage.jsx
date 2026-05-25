// src/pages/ReservePage.jsx
import { useState, useEffect, Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { getTables, getAvailableTables, createReservation } from '../lib/api'
import { format, addDays } from 'date-fns'
import { lazy } from 'react'

const FloorPlan3D = lazy(() => import('../components/FloorPlan3D'))

const TIME_SLOTS = ['18:00','18:30','19:00','19:30','20:00','20:30','21:00','21:30','22:00','22:30','23:00']

const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } } }

export default function ReservePage() {
  const { t } = useTranslation()

  // Step 1: date/time/guests → Step 2: pick table → Step 3: details → Step 4: confirm
  const [step, setStep] = useState(1)
  const [allTables, setAllTables] = useState([])
  const [availableTables, setAvailableTables] = useState([])
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    date: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
    timeSlot: '20:00',
    partySize: 2,
    selectedTable: null,
    guestName: '', guestEmail: '', guestPhone: '', specialRequests: '', occasion: '',
  })
  const [confirmed, setConfirmed] = useState(null)

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  // Load all tables once for 3D map
  useEffect(() => {
    getTables().then(r => setAllTables(r.data.tables)).catch(() => {})
  }, [])

  const checkAvailability = async () => {
    setLoading(true)
    try {
      const r = await getAvailableTables({ date: form.date, timeSlot: form.timeSlot, partySize: form.partySize })
      setAvailableTables(r.data.tables)
      if (r.data.tables.length === 0) {
        toast.error(t('reservation.noTables'))
      } else {
        setStep(2)
      }
    } catch {
      toast.error(t('common.error'))
    } finally {
      setLoading(false)
    }
  }

  const submitReservation = async () => {
    if (!form.selectedTable) return
    setLoading(true)
    try {
      const r = await createReservation({
        tableId: form.selectedTable._id,
        partySize: form.partySize,
        date: form.date,
        timeSlot: form.timeSlot,
        guestName: form.guestName,
        guestEmail: form.guestEmail,
        guestPhone: form.guestPhone,
        specialRequests: form.specialRequests,
        occasion: form.occasion || undefined,
      })
      setConfirmed(r.data.reservation)
      setStep(4)
      toast.success(t('reservation.success'))
    } catch (err) {
      toast.error(err.response?.data?.message || t('common.error'))
    } finally {
      setLoading(false)
    }
  }

  const availableIds = availableTables.map(t => t._id)

  return (
    <div style={{ minHeight: '100vh', padding: '7rem 2rem 4rem', maxWidth: '900px', margin: '0 auto' }}>
      <motion.div variants={fadeUp} initial="hidden" animate="show">
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--blush)' }}>
          {t('reservation.title')}
        </h1>
        <div style={{ height: '1px', width: '60px', background: 'var(--gold)', marginBottom: '3rem' }} />
      </motion.div>

      {/* Step indicator */}
      <StepIndicator current={step} />

      <AnimatePresence mode="wait">

        {/* ── STEP 1: Date / Time / Guests ── */}
        {step === 1 && (
          <motion.div key="step1" variants={fadeUp} initial="hidden" animate="show" exit={{ opacity: 0, y: -10 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              <Field label={t('reservation.date')}>
                <input type="date" value={form.date} min={format(addDays(new Date(), 1), 'yyyy-MM-dd')} onChange={e => set('date', e.target.value)} />
              </Field>
              <Field label={t('reservation.time')}>
                <select value={form.timeSlot} onChange={e => set('timeSlot', e.target.value)}>
                  {TIME_SLOTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
              <Field label={t('reservation.guests')}>
                <select value={form.partySize} onChange={e => set('partySize', parseInt(e.target.value))}>
                  {[1,2,3,4,5,6,7,8,10,12,15,20].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </Field>
            </div>
            <button className="btn btn-primary" onClick={checkAvailability} disabled={loading}>
              {loading ? t('reservation.searching') : '→ ' + t('reservation.searching').replace('…','').trim() || 'Check availability'}
              {!loading && ' →'}
            </button>
          </motion.div>
        )}

        {/* ── STEP 2: Pick table (3D floor plan) ── */}
        {step === 2 && (
          <motion.div key="step2" variants={fadeUp} initial="hidden" animate="show" exit={{ opacity: 0 }}>
            <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-label)', fontSize: '0.65rem', letterSpacing: '2px', marginBottom: '1.5rem', textTransform: 'uppercase' }}>
              {availableTables.length} tables available — click to select
            </p>

            <div style={{ position: 'relative', marginBottom: '2rem' }}>
              <Suspense fallback={<div style={{ height: '420px', background: '#0d0a0a', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-label)', letterSpacing: '2px', fontSize: '0.65rem' }}>LOADING 3D SCENE…</div>}>
                <FloorPlan3D tables={allTables} availableIds={availableIds} selectedTable={form.selectedTable} onSelectTable={t => set('selectedTable', t)} />
              </Suspense>
            </div>

            {/* Table cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.75rem', marginBottom: '2rem' }}>
              {availableTables.map(table => (
                <TableCard key={table._id} table={table} selected={form.selectedTable?._id === table._id} onSelect={() => set('selectedTable', table)} t={t} />
              ))}
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="btn btn-ghost" onClick={() => setStep(1)}>← Back</button>
              <button className="btn btn-primary" disabled={!form.selectedTable} onClick={() => setStep(3)}>Continue →</button>
            </div>
          </motion.div>
        )}

        {/* ── STEP 3: Guest details ── */}
        {step === 3 && (
          <motion.div key="step3" variants={fadeUp} initial="hidden" animate="show" exit={{ opacity: 0 }}>
            {form.selectedTable && (
              <div className="glass" style={{ padding: '1rem 1.25rem', marginBottom: '2rem', display: 'flex', gap: '2rem', alignItems: 'center' }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-label)', fontSize: '0.55rem', letterSpacing: '2px', color: 'var(--text-muted)', marginBottom: '4px' }}>SELECTED TABLE</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--gold)' }}>#{form.selectedTable.number}</div>
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-label)', fontSize: '0.55rem', letterSpacing: '2px', color: 'var(--text-muted)', marginBottom: '4px' }}>ZONE</div>
                  <div style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>{t(`reservation.zones.${form.selectedTable.zone}`)}</div>
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-label)', fontSize: '0.55rem', letterSpacing: '2px', color: 'var(--text-muted)', marginBottom: '4px' }}>CAPACITY</div>
                  <div style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>up to {form.selectedTable.capacity}</div>
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-label)', fontSize: '0.55rem', letterSpacing: '2px', color: 'var(--text-muted)', marginBottom: '4px' }}>DATE & TIME</div>
                  <div style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>{form.date} at {form.timeSlot}</div>
                </div>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <Field label={t('reservation.name')} required>
                <input value={form.guestName} onChange={e => set('guestName', e.target.value)} placeholder="Your full name" />
              </Field>
              <Field label={t('reservation.email')} required>
                <input type="email" value={form.guestEmail} onChange={e => set('guestEmail', e.target.value)} placeholder="your@email.com" />
              </Field>
              <Field label={t('reservation.phone')}>
                <input value={form.guestPhone} onChange={e => set('guestPhone', e.target.value)} placeholder="+212 600 000 000" />
              </Field>
              <Field label={t('reservation.occasion')}>
                <select value={form.occasion} onChange={e => set('occasion', e.target.value)}>
                  <option value="">—</option>
                  {['birthday','anniversary','business','date','other'].map(o => (
                    <option key={o} value={o}>{t(`reservation.occasions.${o}`)}</option>
                  ))}
                </select>
              </Field>
            </div>

            <Field label={t('reservation.special')} style={{ marginBottom: '2rem' }}>
              <textarea value={form.specialRequests} onChange={e => set('specialRequests', e.target.value)} rows={3} placeholder="Dietary requirements, accessibility needs, celebrations…" style={{ resize: 'vertical' }} />
            </Field>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="btn btn-ghost" onClick={() => setStep(2)}>← Back</button>
              <button className="btn btn-primary" disabled={!form.guestName || !form.guestEmail || loading} onClick={submitReservation}>
                {loading ? '…' : t('reservation.submit') + ' →'}
              </button>
            </div>
          </motion.div>
        )}

        {/* ── STEP 4: Confirmation ── */}
        {step === 4 && confirmed && (
          <motion.div key="step4" variants={fadeUp} initial="hidden" animate="show"
            style={{ textAlign: 'center', padding: '3rem 0' }}>
            <motion.div
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
              style={{ width: 80, height: 80, borderRadius: '50%', border: '2px solid var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', fontSize: '2rem' }}
            >✓</motion.div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--blush)', marginBottom: '0.5rem' }}>{t('reservation.success')}</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>A confirmation email has been sent to {confirmed.guestEmail}</p>
            <div className="glass" style={{ display: 'inline-block', padding: '1.5rem 3rem', marginBottom: '2rem' }}>
              <div style={{ fontFamily: 'var(--font-label)', fontSize: '0.55rem', letterSpacing: '3px', color: 'var(--text-muted)', marginBottom: '8px' }}>{t('reservation.code')}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: 'var(--gold)', letterSpacing: '2px' }}>{confirmed.confirmationCode}</div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button className="btn btn-ghost" onClick={() => { setStep(1); setConfirmed(null); setForm(f => ({ ...f, selectedTable: null, guestName: '', guestEmail: '', guestPhone: '', specialRequests: '', occasion: '' })) }}>New reservation</button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  )
}

function StepIndicator({ current }) {
  const steps = ['Date & Time', 'Choose Table', 'Your Details', 'Confirmed']
  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '3rem', gap: 0 }}>
      {steps.map((label, i) => {
        const n = i + 1
        const done = n < current
        const active = n === current
        return (
          <div key={n} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: done ? 'var(--crimson)' : active ? 'transparent' : 'transparent',
                border: `1px solid ${done ? 'var(--crimson)' : active ? 'var(--gold)' : 'rgba(201,169,110,0.2)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: done ? 'var(--blush)' : active ? 'var(--gold)' : 'var(--text-muted)',
                fontFamily: 'var(--font-label)', fontSize: '0.6rem',
                transition: 'all 0.3s',
              }}>{done ? '✓' : n}</div>
              <div style={{ fontFamily: 'var(--font-label)', fontSize: '0.5rem', letterSpacing: '1px', color: active ? 'var(--gold)' : 'var(--text-muted)', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{label}</div>
            </div>
            {i < steps.length - 1 && <div style={{ flex: 1, height: '1px', background: done ? 'var(--crimson)' : 'rgba(201,169,110,0.15)', margin: '0 8px', marginBottom: '18px', transition: 'background 0.3s' }} />}
          </div>
        )
      })}
    </div>
  )
}

function Field({ label, required, children, style }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', ...style }}>
      <label style={{ fontFamily: 'var(--font-label)', fontSize: '0.55rem', letterSpacing: '2px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
        {label}{required && <span style={{ color: 'var(--gold)', marginLeft: '4px' }}>*</span>}
      </label>
      {children}
    </div>
  )
}

function TableCard({ table, selected, onSelect, t }) {
  return (
    <div
      onClick={onSelect}
      style={{
        padding: '12px',
        border: `1px solid ${selected ? 'var(--gold)' : 'rgba(201,169,110,0.2)'}`,
        borderRadius: '4px',
        background: selected ? 'rgba(201,169,110,0.1)' : 'rgba(255,255,255,0.02)',
        cursor: 'pointer',
        transition: 'all 0.2s',
      }}
    >
      <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: selected ? 'var(--gold)' : 'var(--text-primary)', marginBottom: '4px' }}>#{table.number}</div>
      <div style={{ fontFamily: 'var(--font-label)', fontSize: '0.5rem', letterSpacing: '1px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{t(`reservation.zones.${table.zone}`)}</div>
      <div style={{ fontFamily: 'var(--font-label)', fontSize: '0.5rem', letterSpacing: '1px', color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: '2px' }}>up to {table.capacity}</div>
    </div>
  )
}