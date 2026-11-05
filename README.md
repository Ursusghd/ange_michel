# Save the Date · Ange & Michel

Site du Save the Date d'Ange & Michel (samedi 12 décembre 2026, Yaoundé), réalisé par STRIDE Events.

- Ouverture sur une enveloppe à sceau doré, d'où sort le Save the Date.
- Compte à rebours jusqu'au 12 décembre 2026 à 9h00, avec rappel Google Agenda ou Apple / Outlook (fichier `.ics`, alerte la veille).
- Confirmation de présence et wish list via le formulaire Tally intégré : https://tally.so/r/DqKByX
- Roses et pétales animés en arrière-plan (désactivés si l'appareil demande moins d'animations).

## Structure

| Fichier | Rôle |
| - | - |
| `index.html` | La page |
| `assets/css/save-the-date.css` | Styles (vert sauge et or champagne) |
| `assets/scripts/save-the-date.js` | Enveloppe, compte à rebours, rappels, pétales, chargement du formulaire Tally |
| `assets/images/ange-michel/` | Save the Date, bannière, icône, aperçu WhatsApp |
| `assets/images/tally/` | Bannière et icône en grand format, pour le formulaire Tally |

## Modifier

- Date et horaires : constantes en haut de `assets/scripts/save-the-date.js`.
- Formulaire : l'identifiant Tally `DqKByX` apparaît dans `index.html` (iframe et lien de secours).
- Aperçu du lien WhatsApp : la balise `og:image` de `index.html` doit pointer vers l'adresse publique du site.

## Voir le site en local

```
python -m http.server 8080
```

puis ouvrir http://localhost:8080
