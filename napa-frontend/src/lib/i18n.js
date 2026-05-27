// src/lib/i18n.js
import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

const resources = {
  en: {
    translation: {
      nav: {
        reservations:      'Reservations',
        myBookings:        'My Bookings',
        admin:             'Admin',
        login:             'Login',
        logout:            'Logout',
        estate:            'Estate',
        cellar:            'Cellar',
        journal:           'Journal',
        primaryNav:        'Primary navigation',
        languageSelection: 'Language selection',
        switchLang:        'Switch language to {{lang}}',
        logoAriaLabel:     'NAPA Chapter One — Return to homepage',
        loginAriaLabel:    'Login to your NAPA Chapter One account',
        openMenu:          'Open menu',
        closeMenu:         'Close menu',
      },

      hero: {
        title:               'NAPA',
        subtitle:            'Chapter One',
        tagline:             'An evening unlike any other',
        cta:                 'Reserve a table',
        taglinePre:          'A single vine. A single vintage.',
        taglinePost:         'begins now.',
        ctaPrimary:          'Reserve a Tasting',
        ctaGhost:            'Discover the Vintage',
        ctaPrimaryAriaLabel: 'Reserve a tasting at NAPA Chapter One — Limited availability',
        ctaGhostAriaLabel:   'Discover the vintage — NAPA Chapter One MMXXIV',
        estateLabel:         'The Estate',
        estateLocation:      'Bourgogne, France',
        vintageCaption:      'First Release · Lot 001 / 320',
        vintageAriaLabel:    'Vintage information: MMXXIV First Release, Lot 001 of 320',
        scroll:              'Scroll',
        sectionAriaLabel:    'NAPA Chapter One — First Release MMXXIV, Bourgogne, France',
      },

      reservation: {
        title:     'Reserve your table',
        name:      'Full name',
        email:     'Email',
        phone:     'Phone',
        date:      'Date',
        time:      'Time slot',
        guests:    'Number of guests',
        zone:      'Preferred zone',
        special:   'Special requests',
        occasion:  'Occasion',
        submit:    'Confirm reservation',
        searching: 'Checking availability…',
        noTables:  'No tables available for this slot.',
        success:   'Reservation confirmed!',
        code:      'Confirmation code',
        zones: {
          bar:         'Bar',
          terrace:     'Terrace',
          'main-hall': 'Main Hall',
          private:     'Private Room',
        },
        occasions: {
          birthday:    'Birthday',
          anniversary: 'Anniversary',
          business:    'Business',
          date:        'Date night',
          other:       'Other',
        },
      },

      auth: {
        login:       'Login',
        register:    'Create account',
        email:       'Email',
        password:    'Password',
        name:        'Full name',
        noAccount:   "Don't have an account?",
        haveAccount: 'Already have an account?',
      },

      admin: {
        title:     'Reservations dashboard',
        all:       'All',
        confirmed: 'Confirmed',
        pending:   'Pending',
        cancelled: 'Cancelled',
      },

      myBookings: {
        title:         'My bookings',
        empty:         'No reservations yet.',
        cancel:        'Cancel',
        confirmCancel: 'Cancel this reservation?',
      },

      common: {
        loading:  'Loading…',
        error:    'Something went wrong.',
        notFound: 'Not found.',
      },

      experience: {
        slides: {
          one: {
            title:  'An Intimate Escape',
            sub:    'A softly lit room where wine, conversation, and music settle into the rhythm of the night.',
            imgAlt: 'Intimate candlelit dining room at NAPA Chapter One, Bourgogne wine estate',
          },
          two: {
            title:  'Crafted Behind the Bar',
            sub:    'Seasonal cocktails shaped with Moroccan botanicals, rare spirits, and precise technique.',
            imgAlt: 'Handcrafted cocktails with Moroccan botanicals at NAPA Chapter One wine bar',
          },
          three: {
            title:  'Rooted in the Farm',
            sub:    'Ingredients travel directly from Sanctuary Slimane into infusions, syrups, and refined small plates.',
            imgAlt: 'Sanctuary Slimane farm ingredients used in NAPA Chapter One seasonal menu',
          },
          four: {
            title:  'Art Deco Warmth',
            sub:    'Terracotta tones, smoked lighting, vintage textures, and a curved bar designed to slow time.',
            imgAlt: 'Art Deco bar with terracotta tones and curved counter at NAPA Chapter One',
          },
          five: {
            title:  'Made to Be Revisited',
            sub:    'From aperitivo to late-night listening sessions, every evening unfolds like another chapter.',
            imgAlt: 'Late-night wine listening sessions and aperitivo at NAPA Chapter One estate',
          },
          six: {
            title:  'From the Kitchen of Driss Alaoui',
            sub:    'Fresh plates designed for sharing, where seasonal produce, precise technique, and Mediterranean warmth meet at the table.',
            imgAlt: 'Chef Driss Alaoui plating seasonal farm-to-table dishes at NAPA Chapter One',
          },
        },
      },

      seo: {
        title:         'NAPA Chapter One — Single-Vine Burgundy Wine | First Release MMXXIV',
        description:   'NAPA Chapter One: a single-vine, single-vintage Burgundy wine from Bourgogne, France. First Release MMXXIV — Lot 001/320. Reserve your exclusive tasting today.',
        keywords:      'NAPA Chapter One, Burgundy wine, Bourgogne, single vine wine, limited edition wine, fine wine France, wine tasting reservation, MMXXIV vintage, Lot 001 320, Burgundy estate',
        ogTitle:       'NAPA Chapter One — First Release MMXXIV',
        ogDescription: 'A single vine. A single vintage. Chapter One begins now. Limited to 320 bottles — Bourgogne, France.',
        ogImageAlt:    'NAPA Chapter One bottle — First Release MMXXIV, Bourgogne',
      },
    },
  },

  fr: {
    translation: {
      nav: {
        reservations:      'Réservations',
        myBookings:        'Mes réservations',
        admin:             'Admin',
        login:             'Connexion',
        logout:            'Déconnexion',
        estate:            'Domaine',
        cellar:            'Cave',
        journal:           'Journal',
        primaryNav:        'Navigation principale',
        languageSelection: 'Sélection de la langue',
        switchLang:        'Changer la langue vers {{lang}}',
        logoAriaLabel:     "NAPA Chapter One — Retour à l'accueil",
        loginAriaLabel:    'Se connecter à votre compte NAPA Chapter One',
        openMenu:          'Ouvrir le menu',
        closeMenu:         'Fermer le menu',
      },

      hero: {
        title:               'NAPA',
        subtitle:            'Chapter One',
        tagline:             'Une soirée comme nulle autre',
        cta:                 'Réserver une table',
        taglinePre:          'Une seule vigne. Un seul millésime.',
        taglinePost:         'commence maintenant.',
        ctaPrimary:          'Réserver une Dégustation',
        ctaGhost:            'Découvrir le Millésime',
        ctaPrimaryAriaLabel: 'Réserver une dégustation chez NAPA Chapter One — Disponibilité limitée',
        ctaGhostAriaLabel:   'Découvrir le millésime — NAPA Chapter One MMXXIV',
        estateLabel:         'Le Domaine',
        estateLocation:      'Bourgogne, France',
        vintageCaption:      'Première Cuvée · Lot 001 / 320',
        vintageAriaLabel:    'Informations millésime : MMXXIV Première Cuvée, Lot 001 sur 320',
        scroll:              'Défiler',
        sectionAriaLabel:    'NAPA Chapter One — Première Cuvée MMXXIV, Bourgogne, France',
      },

      reservation: {
        title:     'Réservez votre table',
        name:      'Nom complet',
        email:     'Email',
        phone:     'Téléphone',
        date:      'Date',
        time:      'Créneau horaire',
        guests:    'Nombre de convives',
        zone:      'Zone préférée',
        special:   'Demandes spéciales',
        occasion:  'Occasion',
        submit:    'Confirmer la réservation',
        searching: 'Vérification des disponibilités…',
        noTables:  'Aucune table disponible pour ce créneau.',
        success:   'Réservation confirmée !',
        code:      'Code de confirmation',
        zones: {
          bar:         'Bar',
          terrace:     'Terrasse',
          'main-hall': 'Salle principale',
          private:     'Salon privé',
        },
        occasions: {
          birthday:    'Anniversaire',
          anniversary: 'Anniversaire de couple',
          business:    'Affaires',
          date:        'Soirée romantique',
          other:       'Autre',
        },
      },

      auth: {
        login:       'Connexion',
        register:    'Créer un compte',
        email:       'Email',
        password:    'Mot de passe',
        name:        'Nom complet',
        noAccount:   'Pas encore de compte ?',
        haveAccount: 'Déjà un compte ?',
      },

      admin: {
        title:     'Tableau des réservations',
        all:       'Tout',
        confirmed: 'Confirmé',
        pending:   'En attente',
        cancelled: 'Annulé',
      },

      myBookings: {
        title:         'Mes réservations',
        empty:         'Aucune réservation.',
        cancel:        'Annuler',
        confirmCancel: 'Annuler cette réservation ?',
      },

      common: {
        loading:  'Chargement…',
        error:    'Une erreur est survenue.',
        notFound: 'Introuvable.',
      },

      experience: {
        slides: {
          one: {
            title:  'Une Parenthèse Intime',
            sub:    'Un espace feutré où le vin, la musique et les conversations prennent le rythme de la soirée.',
            imgAlt: 'Salle à manger intimiste à la bougie — domaine viticole NAPA Chapter One, Bourgogne',
          },
          two: {
            title:  "L'Art du Cocktail",
            sub:    "Des créations saisonnières travaillées autour de botaniques marocaines, de spiritueux rares et d'un savoir-faire précis.",
            imgAlt: 'Cocktails artisanaux aux botaniques marocaines au bar de NAPA Chapter One',
          },
          three: {
            title:  'Inspiré par la Terre',
            sub:    "Les ingrédients voyagent directement de Sanctuary Slimane vers les infusions, sirops et assiettes à partager.",
            imgAlt: 'Ingrédients du domaine Sanctuary Slimane pour le menu de saison de NAPA Chapter One',
          },
          four: {
            title:  'Chaleur Art Déco',
            sub:    'Terracotta profonde, lumières fumées, textures vintage et un bar courbé pensé pour ralentir le temps.',
            imgAlt: 'Bar Art Déco aux teintes terracotta et comptoir courbé à NAPA Chapter One',
          },
          five: {
            title:  'Un Lieu Où Revenir',
            sub:    "De l'aperitivo aux sessions musicales nocturnes, chaque soirée s'ouvre comme un nouveau chapitre.",
            imgAlt: 'Sessions musicales nocturnes et apéritivo au domaine NAPA Chapter One',
          },
          six: {
            title:  'La Cuisine de Driss Alaoui',
            sub:    'Des assiettes fraîches à partager, où produits de saison, précision culinaire et chaleur méditerranéenne se rencontrent à table.',
            imgAlt: 'Le chef Driss Alaoui dressant des assiettes de saison à NAPA Chapter One',
          },
        },
      },

      seo: {
        title:         'NAPA Chapter One — Vin de Bourgogne Mono-Cépage | Première Cuvée MMXXIV',
        description:   "NAPA Chapter One : un vin de Bourgogne issu d'une seule vigne, d'un seul millésime. Première Cuvée MMXXIV — Lot 001/320. Réservez votre dégustation exclusive.",
        keywords:      'NAPA Chapter One, vin de Bourgogne, cépage unique, édition limitée, vin fin France, réservation dégustation, millésime MMXXIV, Lot 001 320, domaine viticole Bourgogne',
        ogTitle:       'NAPA Chapter One — Première Cuvée MMXXIV',
        ogDescription: 'Une seule vigne. Un seul millésime. Chapter One commence maintenant. Limité à 320 bouteilles — Bourgogne, France.',
        ogImageAlt:    'Bouteille NAPA Chapter One — Première Cuvée MMXXIV, Bourgogne',
      },
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
    detection: {
      order:             ['localStorage', 'navigator'],
      lookupLocalStorage: 'napa_lang',
      caches:            ['localStorage'],
    },
  })

export default i18next