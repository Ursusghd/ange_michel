// ========== Save the Date · Ange & Michel ==========

// Yaoundé = UTC+1 toute l'année
const DATE_MARIAGE = new Date('2026-12-12T09:00:00+01:00');
// Fin indicative pour l'agenda (l'heure de fin n'est pas précisée sur le faire-part)
const FIN_MARIAGE = new Date('2026-12-12T17:00:00+01:00');

const AGENDA = {
    titre: "Mariage d'Ange & Michel",
    lieu: 'Yaoundé, Cameroun',
    details: "09h00 · Mariage civil, Mairie d'Efoulan\n"
        + "12h00 · Vin d'honneur, salle des fêtes de la paroisse Saint-Marc de Biyem-Assi\n"
        + '14h00 · Cérémonie religieuse, paroisse Saint-Marc de Biyem-Assi',
};

const root = document.documentElement;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.getElementById('year').textContent = new Date().getFullYear();

// ========== Enveloppe ==========
const envelopeScreen = document.getElementById('envelope');
const site = document.getElementById('site');

// Tant que l'enveloppe est fermée, le site derrière n'est pas accessible
site.inert = true;

function openEnvelope() {
    if (envelopeScreen.classList.contains('is-open')) return;
    envelopeScreen.classList.add('is-open');

    setTimeout(() => {
        envelopeScreen.classList.add('is-gone');
        site.inert = false;
        root.classList.remove('is-locked');
        root.classList.add('is-revealed');
        setTimeout(() => envelopeScreen.setAttribute('hidden', ''), 900);
    }, reduceMotion ? 0 : 1900);
}

document.getElementById('open-envelope').addEventListener('click', openEnvelope);

// ========== Apparition au défilement ==========
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ========== Compte à rebours ==========
const countdownCells = {
    jours: document.querySelector('[data-unit="jours"]'),
    heures: document.querySelector('[data-unit="heures"]'),
    minutes: document.querySelector('[data-unit="minutes"]'),
    secondes: document.querySelector('[data-unit="secondes"]'),
};

function updateCountdown() {
    const reste = DATE_MARIAGE - Date.now();
    if (reste <= 0) {
        document.querySelector('.countdown__grid').hidden = true;
        document.querySelector('.countdown__label').hidden = true;
        document.querySelector('.countdown__done').hidden = false;
        clearInterval(countdownTimer);
        return;
    }
    const s = Math.floor(reste / 1000);
    countdownCells.jours.textContent = Math.floor(s / 86400);
    countdownCells.heures.textContent = String(Math.floor(s / 3600) % 24).padStart(2, '0');
    countdownCells.minutes.textContent = String(Math.floor(s / 60) % 60).padStart(2, '0');
    countdownCells.secondes.textContent = String(s % 60).padStart(2, '0');
}

const countdownTimer = setInterval(updateCountdown, 1000);
updateCountdown();

// ========== Rappel dans l'agenda ==========
function toUtcStamp(date) {
    return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

const googleUrl = new URL('https://calendar.google.com/calendar/render');
googleUrl.search = new URLSearchParams({
    action: 'TEMPLATE',
    text: AGENDA.titre,
    dates: `${toUtcStamp(DATE_MARIAGE)}/${toUtcStamp(FIN_MARIAGE)}`,
    details: AGENDA.details,
    location: AGENDA.lieu,
}).toString();
document.getElementById('cal-google').href = googleUrl.href;

// Fichier .ics (Apple Calendrier, Outlook, Samsung…) avec un rappel la veille
document.getElementById('cal-ics').addEventListener('click', () => {
    const echapper = (texte) => texte.replace(/([,;])/g, '\\$1').replace(/\n/g, '\\n');
    const ics = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//STRIDE Events//Save the Date//FR',
        'BEGIN:VEVENT',
        'UID:mariage-ange-michel-20261212@stride-events',
        `DTSTAMP:${toUtcStamp(new Date())}`,
        `DTSTART:${toUtcStamp(DATE_MARIAGE)}`,
        `DTEND:${toUtcStamp(FIN_MARIAGE)}`,
        `SUMMARY:${echapper(AGENDA.titre)}`,
        `LOCATION:${echapper(AGENDA.lieu)}`,
        `DESCRIPTION:${echapper(AGENDA.details)}`,
        'BEGIN:VALARM',
        'ACTION:DISPLAY',
        `DESCRIPTION:${echapper("Demain : mariage d'Ange & Michel")}`,
        'TRIGGER:-P1D',
        'END:VALARM',
        'END:VEVENT',
        'END:VCALENDAR',
    ].join('\r\n');

    const lien = document.createElement('a');
    lien.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));
    lien.download = 'mariage-ange-michel.ics';
    lien.click();
    setTimeout(() => URL.revokeObjectURL(lien.href), 1000);
});

// ========== Pétales qui tombent en arrière-plan ==========
const COULEURS_PETALES = [
    ['#F7DCCB', '#EDB79C'], // pêche, comme les roses du faire-part
    ['#F5E6CC', '#DDBF8A'], // champagne
    ['#F6E1DE', '#E5B9B2'], // rose poudré
    ['#E6ECDF', '#B7C6AA'], // sauge
];

if (!reduceMotion) {
    const petals = document.getElementById('petals');
    const nombre = window.innerWidth >= 1000 ? 24 : 12;
    for (let i = 0; i < nombre; i++) {
        const petale = document.createElement('span');
        const [c1, c2] = COULEURS_PETALES[i % COULEURS_PETALES.length];
        const duree = 14 + Math.random() * 12;
        petale.className = 'petal';
        petale.style.cssText = [
            `--x: ${Math.random() * 100}%`,
            `--s: ${10 + Math.random() * 12}px`,
            `--t: ${duree}s`,
            `--delay: ${-Math.random() * duree}s`,
            `--drift: ${(Math.random() - 0.5) * 160}px`,
            `--c1: ${c1}`,
            `--c2: ${c2}`,
        ].join(';');
        petals.appendChild(petale);
    }
}

// ========== Formulaire Tally (code d'intégration officiel) ==========
const TALLY_SCRIPT = 'https://tally.so/widgets/embed.js';

function loadTallyEmbeds() {
    if (typeof Tally !== 'undefined') {
        Tally.loadEmbeds();
        return;
    }
    // Repli si le script Tally n'a pas pu être chargé
    document.querySelectorAll('iframe[data-tally-src]:not([src])').forEach(iframe => {
        iframe.src = iframe.dataset.tallySrc;
    });
}

if (typeof Tally !== 'undefined') {
    loadTallyEmbeds();
} else if (!document.querySelector(`script[src="${TALLY_SCRIPT}"]`)) {
    const script = document.createElement('script');
    script.src = TALLY_SCRIPT;
    script.onload = loadTallyEmbeds;
    script.onerror = loadTallyEmbeds;
    document.body.appendChild(script);
}

// ========== Quitter le site ==========
// Un navigateur n'autorise la fermeture que dans certains cas (onglet ouvert par un lien, WhatsApp…).
// Si l'onglet reste ouvert, on affiche un écran d'au revoir.
const farewell = document.getElementById('farewell');

document.getElementById('quit').addEventListener('click', () => {
    window.close();
    setTimeout(() => {
        farewell.hidden = false;
        site.inert = true;
        root.classList.add('is-locked');
        document.getElementById('farewell-back').focus();
    }, 300);
});

document.getElementById('farewell-back').addEventListener('click', () => {
    farewell.hidden = true;
    site.inert = false;
    root.classList.remove('is-locked');
    window.scrollTo({ top: 0, behavior: 'smooth' });
});
