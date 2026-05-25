// src/pages/AdminPage.jsx
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { getAllReservations } from '../lib/api'
import { format } from 'date-fns'

const STATUS_TABS = ['all', 'confirmed', 'pending', 'seated', 'cancelled', 'no-show']

export default function AdminPage() {
  const { t } = useTranslation()
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeStatus, setActiveStatus] = useState('all')
  const [dateFilter, setDateFilter] = useState('')
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 })

  const load = (page = 1) => {
    setLoading(true)
    const params = { page, limit: 20 }
    if (activeStatus !== 'all') params.status = activeStatus
    if (dateFilter) params.date = dateFilter

    getAllReservations(params)
      .then(r => { setReservations(r.data.reservations); setPagination(r.data.pagination) })
      .catch(() => toast.error(t('common.error')))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [activeStatus, dateFilter])

  const stats = {
    total: pagination.total,
    confirmed: reservations.filter(r => r.status === 'confirmed').length,
    seated: reservations.filter(r => r.status === 'seated').length,
    cancelled: reservations.filter(r => r.status === 'cancelled').length,
  }

  return (
    <div style={{ minHeight: '100vh', padding: '7rem 2rem 4rem', maxWidth: '1100px', margin: '0 auto' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', color: 'var(--blush)', marginBottom: '0.4rem' }}>
          {t('admin.title')}
        </h1>
        <div style={{ height: '1px', width: '60px', background: 'var(--gold)', marginBottom: '2.5rem' }} />

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2.5rem' }}>
          {[
            { label: 'Total', value: pagination.total, color: 'var(--gold)' },
            { label: 'Confirmed', value: stats.confirmed, color: '#5cb85c' },
            { label: 'Seated', value: stats.seated, color: '#6495ed' },
            { label: 'Cancelled', value: stats.cancelled, color: '#e57373' },
          ].map(stat => (
            <div key={stat.label} className="glass" style={{ padding: '1.25rem', textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: stat.color, lineHeight: 1 }}>{stat.value}</div>
              <div style={{ fontFamily: 'var(--font-label)', fontSize: '0.55rem', letterSpacing: '2px', color: 'var(--text-muted)', marginTop: '6px', textTransform: 'uppercase' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {STATUS_TABS.map(s => (
              <button key={s} onClick={() => setActiveStatus(s)} className="btn" style={{
                padding: '6px 14px', fontSize: '0.55rem', letterSpacing: '1.5px',
                background: activeStatus === s ? 'var(--crimson)' : 'transparent',
                border: `1px solid ${activeStatus === s ? 'var(--crimson)' : 'rgba(201,169,110,0.2)'}`,
                color: activeStatus === s ? 'var(--blush)' : 'var(--text-muted)',
                borderRadius: '2px',
              }}>
                {t(`admin.${s}`) || s}
              </button>
            ))}
          </div>
          <input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)} style={{ width: 'auto', padding: '6px 12px', fontSize: '0.85rem' }} />
          {dateFilter && <button className="btn btn-ghost" onClick={() => setDateFilter('')} style={{ padding: '6px 12px', fontSize: '0.6rem' }}>Clear date</button>}
        </div>

        {/* Table */}
        {loading ? (
          <div style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-label)', letterSpacing: '2px', fontSize: '0.65rem' }}>{t('common.loading')}</div>
        ) : (
          <div className="glass" style={{ overflow: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr>
                  {['Date', 'Time', 'Guest', 'Table', 'Guests', 'Occasion', 'Status', 'Code'].map(col => (
                    <th key={col} style={{ padding: '12px 16px', textAlign: 'left', fontFamily: 'var(--font-label)', fontSize: '0.5rem', letterSpacing: '2px', color: 'var(--text-muted)', borderBottom: '1px solid rgba(201,169,110,0.1)', textTransform: 'uppercase', fontWeight: 400 }}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reservations.length === 0 && (
                  <tr><td colSpan={8} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-label)', fontSize: '0.65rem', letterSpacing: '2px' }}>NO RESERVATIONS</td></tr>
                )}
                {reservations.map((res, i) => (
                  <motion.tr
                    key={res._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    style={{ borderBottom: '1px solid rgba(201,169,110,0.06)', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={tdStyle}>{format(new Date(res.date), 'dd MMM yy')}</td>
                    <td style={tdStyle}>{res.timeSlot}</td>
                    <td style={{ ...tdStyle }}>
                      <div style={{ color: 'var(--text-primary)' }}>{res.guestName}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{res.guestEmail}</div>
                    </td>
                    <td style={tdStyle}>#{res.table?.number || '—'} <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{res.table?.zone}</span></td>
                    <td style={tdStyle}>{res.partySize}</td>
                    <td style={tdStyle}><span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{res.occasion || '—'}</span></td>
                    <td style={tdStyle}><span className={`badge badge-${res.status}`}>{res.status}</span></td>
                    <td style={{ ...tdStyle, fontFamily: 'monospace', fontSize: '0.65rem', color: 'rgba(201,169,110,0.5)' }}>{res.confirmationCode}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '1.5rem' }}>
            {[...Array(pagination.pages)].map((_, i) => (
              <button key={i} onClick={() => load(i + 1)} className="btn" style={{
                width: 32, height: 32, padding: 0, fontSize: '0.7rem',
                background: pagination.page === i + 1 ? 'var(--crimson)' : 'transparent',
                border: `1px solid ${pagination.page === i + 1 ? 'var(--crimson)' : 'rgba(201,169,110,0.2)'}`,
                color: pagination.page === i + 1 ? 'var(--blush)' : 'var(--text-muted)',
                borderRadius: '2px',
              }}>{i + 1}</button>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}

const tdStyle = { padding: '12px 16px', color: 'var(--text-primary)', verticalAlign: 'middle' }