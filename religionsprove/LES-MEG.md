# Religionsprøven (Krøniken)

Lærerportal + elevside for prøve i de fem store religionene, bygd på Blooket-spørsmålene.

## Filer
- `index.html` – lærerportalen (logg inn, lag prøve, koder/navn, resultater, utskrift)
- `prove.html` – elevsiden (lenken elevene får: `prove.html?p=<prøve-id>`)
- `felles.js` – Firebase-oppsett + spørsmålsbanken (20 spm × 5 religioner)
- `bilder/` – komprimerte bilder fra presentasjonene
- `firestore-regler.txt` – sikkerhetsregler som må legges inn i Firebase

## Oppsett (én gang)
1. Last opp hele mappa `religionsprove` til samme GitHub Pages-repo som Krøniken, ved siden av `Min religion`
   (samme domene er allerede godkjent i Firebase Authentication).
2. Firebase-konsollen → krle-sim → Firestore → Regler: lim inn blokka fra
   `firestore-regler.txt` inni `match /databases/{database}/documents { … }`,
   ved siden av de eksisterende reglene for `klasser`. Publiser.
3. Åpne `…/religionsprove/index.html`, logg inn med samme konto som i Krøniken.

Test uten Firebase: `index.html?demo=1` (lagres bare i nettleseren).

## Personvern
Firebase lagrer bare koder og svar – ingen navn. Navn og kommentarer ligger
kun i lærerens nettleser (localStorage). Bruk «Last ned navneliste» som sikkerhetskopi.

## Endre spørsmål
Spørsmålene er bygd inn i `felles.js` fra Blooket_*.csv. Be Claude bygge `felles.js`
på nytt hvis CSV-filene endres. (Fasiten er lett kodet så den ikke synes rett i kildekoden.)

## Lenker mellom verktøyene
Krøniken (`Min religion/index.html`) har knappen «Prøveportal →», og prøveportalen har «← Min religion». På GitHub ligger Krøniken i roten av repoet (minreligion) og prøveportalen i undermappa `religionsprove/`.
