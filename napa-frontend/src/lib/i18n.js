// src/lib/i18n.js
import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

const resources = {
  en: {
    translation: {
      nav: {
        reservations: 'Reservations',
        myBookings: 'My Bookings',
        admin: 'Admin',
        login: 'Login',
        logout: 'Logout',
        estate: 'About',
        cellar: 'Wine',
        journal: 'Journal',
        primaryNav: 'Primary navigation',
        languageSelection: 'Language selection',
        switchLang: 'Switch language to {{lang}}',
        logoAriaLabel: 'NAPA Chapter One — Return to homepage',
        loginAriaLabel: 'Login to your NAPA Chapter One account',
        openMenu: 'Open menu',
        closeMenu: 'Close menu',
      },

      hero: {
        title: 'NAPA',
        titleDrinks: 'Discover our drinks',
        titleFood: 'Discover our food',
        subtitle: 'Chapter One',
        tagline: 'An evening unlike any other',
        cta: 'Reserve a table',
        taglinePre: 'Wine. Cocktails. Gueliz.',
        taglinePost: 'A chapter begins.',
        ctaPrimary: 'Reserve a Table',
        ctaGhost: 'Discover the Bar',
        ctaPrimaryAriaLabel: 'Reserve a table at NAPA Chapter One, Gueliz, Marrakech',
        ctaGhostAriaLabel: 'Discover NAPA Chapter One — wine bar and cocktail lounge, Marrakech',
        estateLabel: 'Gueliz, Marrakech',
        estateLocation: 'Marrakech, Morocco',
        estateHours: 'Tue – Sat · 5pm – 1am',
        vintageCaption: 'Opened 2026 · Gueliz',
        vintageAriaLabel: 'NAPA Chapter One — opened 2026, Gueliz, Marrakech',
        scroll: 'Scroll',
        sectionAriaLabel: 'NAPA Chapter One — Wine and cocktail bar in Gueliz, Marrakech',
      },

      reservation: {
        title: 'Reserve your table',
        name: 'Full name',
        email: 'Email',
        phone: 'Phone',
        date: 'Date',
        time: 'Time slot',
        guests: 'Number of guests',
        zone: 'Preferred zone',
        special: 'Special requests',
        occasion: 'Occasion',
        submit: 'Confirm reservation',
        searching: 'Checking availability…',
        noTables: 'No tables available for this slot.',
        success: 'Reservation confirmed!',
        code: 'Confirmation code',
        zones: {
          bar: 'Bar counter',
          terrace: 'Front tables',
          'main-hall': 'Main room',
          private: 'Booth',
        },
        occasions: {
          birthday: 'Birthday',
          anniversary: 'Anniversary',
          business: 'Business',
          date: 'Date night',
          other: 'Other',
        },
      },

      auth: {
        login: 'Login',
        register: 'Create account',
        email: 'Email',
        password: 'Password',
        name: 'Full name',
        noAccount: "Don't have an account?",
        haveAccount: 'Already have an account?',
      },

      admin: {
        title: 'Reservations dashboard',
        all: 'All',
        confirmed: 'Confirmed',
        pending: 'Pending',
        cancelled: 'Cancelled',
      },

      myBookings: {
        title: 'My bookings',
        empty: 'No reservations yet.',
        cancel: 'Cancel',
        confirmCancel: 'Cancel this reservation?',
      },

      common: {
        loading: 'Loading…',
        error: 'Something went wrong.',
        notFound: 'Not found.',
      },

      experience: {
        slides: {
          one: {
            title: 'An Intimate Room',
            sub: 'Art Deco bones, vintage lighting, channel-tufted banquettes. A room designed to slow time.',
            imgAlt: 'Art Deco interior of NAPA Chapter One wine bar in Gueliz, Marrakech',
            slug: 'intimate escape',
          },
          six: {
            title: 'From the Kitchen of Driss Alaoui',
            sub: 'Sharing plates developed alongside the Farmers kitchen — seasonal produce, precise technique, Mediterranean warmth.',
            imgAlt: 'Chef Driss Alaoui plating seasonal farm-to-table dishes at NAPA Chapter One',
            slug: 'kitchen · driss alaoui',
          },
          two: {
            title: 'Crafted Behind the Bar',
            sub: 'Cocktails shaped around Moroccan botanicals, rare spirits, and farm-derived syrups and infusions.',
            imgAlt: 'Handcrafted cocktails at NAPA Chapter One, Marrakech',
            slug: 'crafted cocktails',
          },
          three: {
            title: 'Rooted at Sanctuary Slimane',
            sub: 'Ingredients travel directly from the permaculture farm into spirits, syrups, and small plates.',
            imgAlt: 'Sanctuary Slimane permaculture farm supplying NAPA Chapter One',
            slug: 'farm to table',
          },
          four: {
            title: 'Natural Wine, Simply Poured',
            sub: 'Organic, biodynamic, and natural bottles from winemakers around the world. The palate has the final say.',
            imgAlt: 'Natural wine selection at NAPA Chapter One wine bar, Marrakech',
            slug: 'natural wine',
          },
          five: {
            title: 'Made to Be Revisited',
            sub: 'From aperitivo to late-night listening sessions, every evening unfolds like another chapter.',
            imgAlt: 'Late-night atmosphere at NAPA Chapter One, Gueliz, Marrakech',
            slug: 'an evening',
          },
        },
      },

      seo: {
        title: 'NAPA Chapter One — Wine & Cocktail Bar in Gueliz, Marrakech',
        description: 'NAPA Chapter One is an intimate Art Deco wine and cocktail bar in Gueliz, Marrakech. Natural and organic wines, farm-to-bar cocktails with Moroccan botanicals, and sharing plates. Open Tue–Sat from 5pm.',
        keywords: 'NAPA Chapter One, wine bar Marrakech, cocktail bar Gueliz, natural wine Marrakech, Sanctuary Slimane, Farmers Marrakech, Art Deco bar Marrakech, Aziz Nahas, Benjamin Pastor, Simone Mérette, wine Gueliz',
        ogTitle: 'NAPA Chapter One — Wine & Cocktail Bar, Gueliz Marrakech',
        ogDescription: 'An intimate Art Deco buvette in Gueliz. Natural wines, farm-to-bar cocktails, and small plates. A project by the team behind Farmers Marrakech.',
        ogImageAlt: 'NAPA Chapter One — Art Deco wine and cocktail bar, Gueliz, Marrakech',
      },

      menu: 'The Menu',

      scrollVideo: {
        block1: {
          eyebrow: 'Gueliz, Marrakech',
          title: 'Where the evening begins.',
          body: "Nestled between +61 and Farmers in the heart of Gueliz, NAPA Chapter One is the kind of place you arrive at for one drink and leave three hours later — still talking.",
        },
        block2: {
          eyebrow: 'Farm to Bar',
          title: 'Cocktails with a sense of place.',
          body: 'Every cocktail draws from Moroccan botanicals — fennel, jasmine, turmeric, saffron. Seasonal, surprising, and rooted in the produce of Sanctuary Slimane, our permaculture farm outside the city.',
        },
        block3: {
          eyebrow: 'Small Plates · Natural Wine',
          title: 'A chapter worth returning to.',
          body: 'Sharing plates by Chef Driss Alaoui. Natural and organic wines poured simply, chosen carefully. A room built to slow the evening down — terracotta, soft materials, smoked light.',
        },
      },

      footer: {
        tagline: 'An intimate wine and cocktail bar in the heart of Gueliz — where evenings begin, and linger.',
        address: 'Find Us',
        hours: 'Hours',
        hoursTueSat: 'Tuesday – Saturday',
        hoursTime: '5pm – 1am',
        hoursClosed: 'Closed Sunday & Monday',
        follow: 'Follow',
        cta: 'Book a Table',
        rights: 'All rights reserved.',
        privacy: 'Privacy',
        legal: 'Legal',
      },

      cocktails: {
        rouge_velours_name: 'Rouge Velours',
        rouge_velours_desc: 'Pinot Noir · Hibiscus · Cardamom',
        jardin_hiver_name: 'Winter Garden',
        jardin_hiver_desc: 'Gin · Rose · Cucumber',
        soleil_marrakech_name: 'Marrakech Sun',
        soleil_marrakech_desc: 'Rum · Saffron · Orange Blossom',
        nuit_noire_name: 'Black Night',
        nuit_noire_desc: 'Mezcal · Black Sesame · Lime',
        aube_doree_name: 'Golden Dawn',
        aube_doree_desc: 'Champagne · Argan · Honey',
        sable_etoile_name: 'Stardust',
        sable_etoile_desc: 'Tequila · Agave · Pineapple',
      },

      theRoom: 'The Room',
      kitchen: 'The Kitchen',
      bar: 'The Bar',
      farm: 'The Farm',
      food: {
        plate_one_name: "Burnt Aubergine",
        plate_one_desc: "Smoked & slow-roasted",
        plate_two_name: "Chermoula Prawns",
        plate_two_desc: "Citrus & wild herb",
        plate_three_name: "Bone Marrow Toast",
        plate_three_desc: "Caramelised & charred",
        plate_four_name: "Lamb Mechoui",
        plate_four_desc: "Slow-cooked & tender",
        plate_five_name: "Truffle Briouats",
        plate_five_desc: "Crisp pastry & black truffle",
        plate_six_name: "Burrata du Jour",
        plate_six_desc: "Farm-fresh & seasonal",
        plate_seven_name: "Octopus à la Braise",
        plate_seven_desc: "Grilled over open flame",
        plate_eight_name: "Foie Gras Pastilla",
        plate_eight_desc: "Sweet, savoury & spiced",
        plate_nine_name: "Wild Mushroom Crostini",
        plate_nine_desc: "Earthy & aromatic",
        plate_ten_name: "Tuna Crudo",
        plate_ten_desc: "Preserved lemon & harissa",
        plate_eleven_name: "Carrot & Cumin Dip",
        plate_eleven_desc: "Slimane farm harvest",
        plate_twelve_name: "Dark Chocolate Cremeux",
        plate_twelve_desc: "Bitter, silky & cold"
      }
    },
  },

  fr: {
    translation: {
      nav: {
        reservations: 'Réservations',
        myBookings: 'Mes réservations',
        admin: 'Admin',
        login: 'Connexion',
        logout: 'Déconnexion',
        estate: 'À propos',
        cellar: 'Vins',
        journal: 'Journal',
        primaryNav: 'Navigation principale',
        languageSelection: 'Sélection de la langue',
        switchLang: 'Changer la langue vers {{lang}}',
        logoAriaLabel: "NAPA Chapter One — Retour à l'accueil",
        loginAriaLabel: 'Se connecter à votre compte NAPA Chapter One',
        openMenu: 'Ouvrir le menu',
        closeMenu: 'Fermer le menu',
      },

      hero: {
        title: 'NAPA',
        titleDrinks: 'Découvrez nos boissons',
        titleFood: 'Découvrez notre cuisine',
        subtitle: 'Chapter One',
        tagline: 'Une soirée comme nulle autre',
        cta: 'Réserver une table',
        taglinePre: 'Vins. Cocktails. Guéliz.',
        taglinePost: 'Un chapitre commence.',
        ctaPrimary: 'Réserver une Table',
        ctaGhost: 'Découvrir le Bar',
        ctaPrimaryAriaLabel: 'Réserver une table au NAPA Chapter One, Guéliz, Marrakech',
        ctaGhostAriaLabel: 'Découvrir NAPA Chapter One — bar à vins et cocktails, Marrakech',
        estateLabel: 'Guéliz, Marrakech',
        estateLocation: 'Marrakech, Maroc',
        estateHours: 'Mar – Sam · 17h – 1h',
        vintageCaption: 'Ouvert en 2026 · Guéliz',
        vintageAriaLabel: 'NAPA Chapter One — ouvert en 2026, Guéliz, Marrakech',
        scroll: 'Défiler',
        sectionAriaLabel: 'NAPA Chapter One — Bar à vins et cocktails à Guéliz, Marrakech',
      },

      reservation: {
        title: 'Réservez votre table',
        name: 'Nom complet',
        email: 'Email',
        phone: 'Téléphone',
        date: 'Date',
        time: 'Créneau horaire',
        guests: 'Nombre de convives',
        zone: 'Zone préférée',
        special: 'Demandes spéciales',
        occasion: 'Occasion',
        submit: 'Confirmer la réservation',
        searching: 'Vérification des disponibilités…',
        noTables: 'Aucune table disponible pour ce créneau.',
        success: 'Réservation confirmée !',
        code: 'Code de confirmation',
        zones: {
          bar: 'Comptoir bar',
          terrace: 'Tables façade',
          'main-hall': 'Salle principale',
          private: 'Alcôve',
        },
        occasions: {
          birthday: 'Anniversaire',
          anniversary: 'Anniversaire de couple',
          business: 'Affaires',
          date: 'Soirée romantique',
          other: 'Autre',
        },
      },

      auth: {
        login: 'Connexion',
        register: 'Créer un compte',
        email: 'Email',
        password: 'Mot de passe',
        name: 'Nom complet',
        noAccount: 'Pas encore de compte ?',
        haveAccount: 'Déjà un compte ?',
      },

      admin: {
        title: 'Tableau des réservations',
        all: 'Tout',
        confirmed: 'Confirmé',
        pending: 'En attente',
        cancelled: 'Annulé',
      },

      myBookings: {
        title: 'Mes réservations',
        empty: 'Aucune réservation.',
        cancel: 'Annuler',
        confirmCancel: 'Annuler cette réservation ?',
      },

      common: {
        loading: 'Chargement…',
        error: 'Une erreur est survenue.',
        notFound: 'Introuvable.',
      },

      experience: {
        slides: {
          one: {
            title: 'Un Espace Intime',
            sub: 'Architecture Art Déco, lumières vintage, banquettes capitonnées. Une salle pensée pour ralentir le temps.',
            imgAlt: 'Intérieur Art Déco du bar à vins NAPA Chapter One, Guéliz, Marrakech',
            slug: 'espace intime',
          },
          six: {
            title: 'La Cuisine de Driss Alaoui',
            sub: 'Assiettes à partager développées avec la cuisine de Farmers — produits de saison, technique précise, chaleur méditerranéenne.',
            imgAlt: 'Le chef Driss Alaoui dressant des assiettes de saison au NAPA Chapter One',
            slug: 'cuisine · driss alaoui',
          },
          two: {
            title: "L'Art du Cocktail",
            sub: 'Créations façonnées autour de botaniques marocaines, spiritueux rares et infusions issues de la ferme.',
            imgAlt: 'Cocktails artisanaux au NAPA Chapter One, Marrakech',
            slug: 'cocktails signature',
          },
          three: {
            title: 'Sanctuary Slimane',
            sub: "Les ingrédients voyagent directement de la ferme permaculturelle vers les spiritueux, sirops et assiettes à partager.",
            imgAlt: 'Ferme permaculturelle Sanctuary Slimane fournissant NAPA Chapter One',
            slug: 'ferme à table',
          },
          four: {
            title: 'Vins Naturels, Simplement Servis',
            sub: 'Bouteilles biologiques, biodynamiques et nature du monde entier. Le palais a le dernier mot.',
            imgAlt: 'Sélection de vins naturels au NAPA Chapter One, Marrakech',
            slug: 'vins naturels',
          },
          five: {
            title: 'Un Lieu Où Revenir',
            sub: "De l'apéritivo aux sessions d'écoute nocturnes, chaque soirée s'ouvre comme un nouveau chapitre.",
            imgAlt: 'Ambiance nocturne au NAPA Chapter One, Guéliz, Marrakech',
            slug: 'une soirée',
          },
        },
      },

      seo: {
        title: 'NAPA Chapter One — Bar à Vins & Cocktails à Guéliz, Marrakech',
        description: 'NAPA Chapter One est un bar à vins et cocktails Art Déco intimiste à Guéliz, Marrakech. Vins naturels et biologiques, cocktails farm-to-bar aux botaniques marocaines, assiettes à partager. Ouvert mar–sam dès 17h.',
        keywords: 'NAPA Chapter One, bar à vins Marrakech, cocktails Guéliz, vin naturel Marrakech, Sanctuary Slimane, Farmers Marrakech, bar Art Déco Marrakech, Aziz Nahas, Benjamin Pastor, Simone Mérette',
        ogTitle: 'NAPA Chapter One — Bar à Vins & Cocktails, Guéliz Marrakech',
        ogDescription: "Une buvette Art Déco intimiste à Guéliz. Vins naturels, cocktails farm-to-bar et petites assiettes. Un projet de l'équipe derrière Farmers Marrakech.",
        ogImageAlt: 'NAPA Chapter One — Bar à vins et cocktails Art Déco, Guéliz, Marrakech',
      },

      menu: 'Le Menu',

      scrollVideo: {
        block1: {
          eyebrow: 'Guéliz, Marrakech',
          title: 'Là où la soirée commence.',
          body: "Niché entre +61 et Farmers au cœur de Guéliz, NAPA Chapter One est le genre d'endroit où l'on arrive pour un verre et où l'on repart trois heures plus tard — encore en train de parler.",
        },
        block2: {
          eyebrow: 'De la Ferme au Bar',
          title: 'Des cocktails ancrés dans leur territoire.',
          body: 'Chaque cocktail puise dans les botaniques marocaines — fenouil, jasmin, curcuma, safran. Éphémères, surprenants, et issus de Sanctuary Slimane, notre ferme permaculturelle aux portes de la ville.',
        },
        block3: {
          eyebrow: 'Assiettes à Partager · Vins Naturels',
          title: "Un chapitre où l'on revient.",
          body: 'Assiettes à partager signées Chef Driss Alaoui. Vins naturels et biologiques versés simplement, choisis avec soin. Une salle pensée pour ralentir la soirée — terre cuite, matières douces, lumières fumées.',
        },
      },

      footer: {
        tagline: "Un bar à vins et cocktails intimiste au cœur de Guéliz — où les soirées commencent, et s'attardent.",
        address: 'Nous Trouver',
        hours: 'Horaires',
        hoursTueSat: 'Mardi – Samedi',
        hoursTime: '17h – 1h',
        hoursClosed: 'Fermé dimanche & lundi',
        follow: 'Suivre',
        cta: 'Réserver',
        rights: 'Tous droits réservés.',
        privacy: 'Confidentialité',
        legal: 'Mentions légales',
      },

      cocktails: {
        rouge_velours_name: 'Rouge Velours',
        rouge_velours_desc: 'Pinot Noir · Hibiscus · Cardamome',
        jardin_hiver_name: "Jardin d'Hiver",
        jardin_hiver_desc: 'Gin · Rose · Concombre',
        soleil_marrakech_name: 'Soleil de Marrakech',
        soleil_marrakech_desc: "Rhum · Safran · Fleur d'Oranger",
        nuit_noire_name: 'Nuit Noire',
        nuit_noire_desc: 'Mezcal · Sésame Noir · Citron Vert',
        aube_doree_name: 'Aube Dorée',
        aube_doree_desc: 'Champagne · Argan · Miel',
        sable_etoile_name: "Sable de l'Étoile",
        sable_etoile_desc: 'Tequila · Agave · Ananas',
      },

      theRoom: 'La Salle',
      kitchen: 'La Cuisine',
      bar: 'Le Bar',
      farm: 'La Ferme',
      food: {
        plate_one_name: "Aubergine Brûlée",
        plate_one_desc: "Fumée & rôtie lentement",
        plate_two_name: "Crevettes Chermoula",
        plate_two_desc: "Agrumes & herbes sauvages",
        plate_three_name: "Toast à la Moelle",
        plate_three_desc: "Caramélisée & carbonisée",
        plate_four_name: "Agneau Méchoui",
        plate_four_desc: "Cuit lentement & fondant",
        plate_five_name: "Briouats à la Truffe",
        plate_five_desc: "Pâte croustillante & truffe noire",
        plate_six_name: "Burrata du Jour",
        plate_six_desc: "Fraîche de la ferme & de saison",
        plate_seven_name: "Pieuvre à la Braise",
        plate_seven_desc: "Grillée sur flamme vive",
        plate_eight_name: "Pastilla au Foie Gras",
        plate_eight_desc: "Sucré, salé & épicé",
        plate_nine_name: "Crostini aux Champignons",
        plate_nine_desc: "Terreux & aromatique",
        plate_ten_name: "Crudo de Thon",
        plate_ten_desc: "Citron confit & harissa",
        plate_eleven_name: "Dip Carotte & Cumin",
        plate_eleven_desc: "Récolte de la ferme Slimane",
        plate_twelve_name: "Crémeux Chocolat Noir",
        plate_twelve_desc: "Amer, soyeux & glacé"
      }
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
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'napa_lang',
      caches: ['localStorage'],
    },
  })

export default i18next