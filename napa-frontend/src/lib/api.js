// src/lib/api.js
import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
})

// Attach JWT and language header to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('napa_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  const lang = localStorage.getItem('napa_lang') || 'en'
  config.headers['x-language'] = lang
  return config
})

// Auth
export const register = (data) => api.post('/auth/register', data)
export const login = (data) => api.post('/auth/login', data)
export const getMe = () => api.get('/auth/me')

// Tables
export const getTables = () => api.get('/tables')
export const getAvailableTables = (params) => api.get('/tables/available', { params })

// Reservations
export const createReservation = (data) => api.post('/reservations', data)
export const getMyReservations = () => api.get('/reservations/my')
export const getReservationByCode = (code) => api.get(`/reservations/by-code/${code}`)
export const cancelReservation = (id) => api.delete(`/reservations/${id}`)
export const getAllReservations = (params) => api.get('/reservations', { params })

// Config (supported languages)
export const getConfig = () => api.get('/config')

export default api