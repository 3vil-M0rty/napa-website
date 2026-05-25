// src/lib/i18n.js
import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Inline translations (mirrors backend JSON — add more languages here to match .env)
const resources = {
  en: {
    translation: {
      nav: { reservations: 'Reservations', myBookings: 'My Bookings', admin: 'Admin', login: 'Login', logout: 'Logout' },
      hero: { title: 'NAPA', subtitle: 'Chapter One', tagline: 'An evening unlike any other', cta: 'Reserve a table' },
      reservation: {
        title: 'Reserve your table',
        name: 'Full name', email: 'Email', phone: 'Phone', date: 'Date',
        time: 'Time slot', guests: 'Number of guests', zone: 'Preferred zone',
        special: 'Special requests', occasion: 'Occasion',
        submit: 'Confirm reservation', searching: 'Checking availability…',
        noTables: 'No tables available for this slot.',
        success: 'Reservation confirmed!', code: 'Confirmation code',
        zones: { bar: 'Bar', terrace: 'Terrace', 'main-hall': 'Main Hall', private: 'Private Room' },
        occasions: { birthday: 'Birthday', anniversary: 'Anniversary', business: 'Business', date: 'Date night', other: 'Other' },
      },
      auth: { login: 'Login', register: 'Create account', email: 'Email', password: 'Password', name: 'Full name', noAccount: "Don't have an account?", haveAccount: 'Already have an account?' },
      admin: { title: 'Reservations dashboard', all: 'All', confirmed: 'Confirmed', pending: 'Pending', cancelled: 'Cancelled' },
      myBookings: { title: 'My bookings', empty: 'No reservations yet.', cancel: 'Cancel', confirmCancel: 'Cancel this reservation?' },
      common: { loading: 'Loading…', error: 'Something went wrong.', notFound: 'Not found.' },
    },
  },
  fr: {
    translation: {
      nav: { reservations: 'Réservations', myBookings: 'Mes réservations', admin: 'Admin', login: 'Connexion', logout: 'Déconnexion' },
      hero: { title: 'NAPA', subtitle: 'Chapter One', tagline: 'Une soirée comme nulle autre', cta: 'Réserver une table' },
      reservation: {
        title: 'Réservez votre table',
        name: 'Nom complet', email: 'Email', phone: 'Téléphone', date: 'Date',
        time: 'Créneau horaire', guests: 'Nombre de convives', zone: 'Zone préférée',
        special: 'Demandes spéciales', occasion: 'Occasion',
        submit: 'Confirmer la réservation', searching: 'Vérification des disponibilités…',
        noTables: 'Aucune table disponible pour ce créneau.',
        success: 'Réservation confirmée !', code: 'Code de confirmation',
        zones: { bar: 'Bar', terrace: 'Terrasse', 'main-hall': 'Salle principale', private: 'Salon privé' },
        occasions: { birthday: 'Anniversaire', anniversary: 'Anniversaire de couple', business: 'Affaires', date: 'Soirée romantique', other: 'Autre' },
      },
      auth: { login: 'Connexion', register: 'Créer un compte', email: 'Email', password: 'Mot de passe', name: 'Nom complet', noAccount: "Pas encore de compte ?", haveAccount: 'Déjà un compte ?' },
      admin: { title: 'Tableau des réservations', all: 'Tout', confirmed: 'Confirmé', pending: 'En attente', cancelled: 'Annulé' },
      myBookings: { title: 'Mes réservations', empty: 'Aucune réservation.', cancel: 'Annuler', confirmCancel: 'Annuler cette réservation ?' },
      common: { loading: 'Chargement…', error: 'Une erreur est survenue.', notFound: 'Introuvable.' },
    },
  },
  ar: {
    translation: {
      nav: { reservations: 'الحجوزات', myBookings: 'حجوزاتي', admin: 'الإدارة', login: 'تسجيل الدخول', logout: 'تسجيل الخروج' },
      hero: { title: 'NAPA', subtitle: 'Chapter One', tagline: 'أمسية لا مثيل لها', cta: 'احجز طاولتك' },
      reservation: {
        title: 'احجز طاولتك',
        name: 'الاسم الكامل', email: 'البريد الإلكتروني', phone: 'الهاتف', date: 'التاريخ',
        time: 'الوقت', guests: 'عدد الضيوف', zone: 'المنطقة المفضلة',
        special: 'طلبات خاصة', occasion: 'المناسبة',
        submit: 'تأكيد الحجز', searching: 'جارٍ التحقق من التوفر…',
        noTables: 'لا توجد طاولات متاحة لهذا الموعد.',
        success: 'تم تأكيد الحجز!', code: 'رمز التأكيد',
        zones: { bar: 'البار', terrace: 'التراس', 'main-hall': 'القاعة الرئيسية', private: 'الغرفة الخاصة' },
        occasions: { birthday: 'عيد ميلاد', anniversary: 'ذكرى سنوية', business: 'أعمال', date: 'سهرة رومانسية', other: 'أخرى' },
      },
      auth: { login: 'تسجيل الدخول', register: 'إنشاء حساب', email: 'البريد الإلكتروني', password: 'كلمة المرور', name: 'الاسم الكامل', noAccount: 'ليس لديك حساب؟', haveAccount: 'لديك حساب بالفعل؟' },
      admin: { title: 'لوحة الحجوزات', all: 'الكل', confirmed: 'مؤكد', pending: 'قيد الانتظار', cancelled: 'ملغى' },
      myBookings: { title: 'حجوزاتي', empty: 'لا توجد حجوزات بعد.', cancel: 'إلغاء', confirmCancel: 'إلغاء هذا الحجز؟' },
      common: { loading: 'جارٍ التحميل…', error: 'حدث خطأ ما.', notFound: 'غير موجود.' },
    },
  },
}

i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    detection: { order: ['localStorage', 'navigator'], lookupLocalStorage: 'napa_lang', caches: ['localStorage'] },
  })

export default i18next