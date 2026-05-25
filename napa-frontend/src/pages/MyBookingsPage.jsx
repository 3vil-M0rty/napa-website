// src/pages/MyBookingsPage.jsx
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { getMyReservations, cancelReservation } from '../lib/api'
import { format } from 'date-fns'

export default function MyBookingsPage() {
  const { t } = useTranslation()
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    getMyReservations()
      .then(r => setReservations(r.data.reservations))
      .catch(() => toast.error(t('common.error')))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleCancel = async (id) => {
    if (!window.confirm(t('myBookings.confirmCancel'))) return
    try {
      await cancelReservation(id)
      toast.success(t('reservation.cancelled'))
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || t('common.error'))
    }
  }

  return (
    <div style={{ minHeight: '100vh', padding: '7rem 2rem 4rem', maxWidth: '800px', margin: '0 auto' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--blush)', marginBottom: '0.4rem' }}>
          {t('myBookings.title')}
        </h1>
        <div style={{ height: '1px', width: '60px', background: 'var(--gold)', marginBottom: '3rem' }} />

        {loading && <div style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-label)', letterSpacing: '2px', fontSize: '0.65rem' }}>{t('common.loading')}</div>}

        {!loading && reservations.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem', opacity: 0.3 }}>🍷</div>
            <p style={{ fontFamily: 'var(--font-label)', letterSpacing: '2px', fontSize: '0.65rem', textTransform: 'uppercase' }}>{t('myBookings.empty')}</p>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {reservations.map((res, i) => (
            <motion.div
              key={res._id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.5 }}
              className="glass"
              style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'start', gap: '1rem' }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '0.75rem' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--gold)' }}>
                    {format(new Date(res.date), 'dd MMM yyyy')}
                  </span>
                  <span style={{ fontFamily: 'var(--font-label)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>{res.timeSlot}</span>
                  <span className={`badge badge-${res.status}`}>{res.status}</span>
                </div>
                <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                  <Info label="Table" value={`#${res.table?.number || '—'}`} />
                  <Info label="Zone" value={res.table?.zone || '—'} />
                  <Info label="Guests" value={res.partySize} />
                  {res.occasion && <Info label="Occasion" value={res.occasion} />}
                </div>
                {res.specialRequests && (
                  <div style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                    "{res.specialRequests}"
                  </div>
                )}
                <div style={{ marginTop: '0.75rem', fontFamily: 'var(--font-label)', fontSize: '0.5rem', letterSpacing: '1px', color: 'rgba(201,169,110,0.4)' }}>
                  {res.confirmationCode}
                </div>
              </div>
              <div>
                {res.status !== 'cancelled' && res.status !== 'completed' && (
                  <button className="btn btn-danger" onClick={() => handleCancel(res._id)}>{t('myBookings.cancel')}</button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

function Info({ label, value }) {
  return (
    <div>
      <div style={{ fontFamily: 'var(--font-label)', fontSize: '0.5rem', letterSpacing: '2px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '2px' }}>{label}</div>
      <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{value}</div>
    </div>
  )
}