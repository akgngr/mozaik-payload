# Mosaik Dialog und Kultur e.V. — Website

Neu aufgebaut mit **Next.js 16** (App Router) + **Payload CMS 3** + **Postgres (Neon)**.
Design: "Apple Glass" — Glasmorphismus in einer blau-grünen Farbpalette.

## Stack

- **Frontend/Backend**: Next.js (App Router) + Payload CMS als eingebettetes Next.js-Plugin
- **Datenbank**: Postgres, gehostet auf [Neon](https://neon.tech)
- **Styling**: Tailwind CSS v4, eigenes Glass-Theme (`src/app/(frontend)/globals.css`)
- **Rich Text**: Lexical (Payload-Standardeditor)

## Projektstruktur

```
src/
  payload.config.ts        Payload-Konfiguration (Collections, Globals, DB-Adapter)
  collections/              Media, Pages, Projects, Users
  globals/                  Header, Footer, SiteSettings, Homepage, Donation, ContactInfo
  app/
    (payload)/               Payload Admin-Panel + REST/GraphQL API (/admin, /api/*)
    (frontend)/               Öffentliche Website (Startseite, Unterseiten)
  components/                Wiederverwendbare UI-Komponenten (Glass-Cards, Header, Footer, ...)
  seed/                      Skript zum Befüllen der Datenbank mit Startinhalten
```

## Setup

1. **Abhängigkeiten installieren**

   ```bash
   pnpm install
   ```

2. **Umgebungsvariablen**

   Kopiere `.env.example` nach `.env` und trage deine Neon-Verbindungsdaten ein:

   ```bash
   cp .env.example .env
   ```

   - `DATABASE_URI` — Connection String aus der [Neon Console](https://console.neon.tech)
   - `PAYLOAD_SECRET` — zufälliger String, z. B. `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

3. **Datenbankschema anlegen**

   ```bash
   pnpm migrate:create   # erzeugt eine Migration aus dem aktuellen Schema
   pnpm migrate          # führt die Migration gegen Neon aus
   ```

4. **Startinhalte einspielen** (Texte, Navigation, Kontaktdaten, Projekte …)

   ```bash
   pnpm seed
   ```

5. **Entwicklungsserver starten**

   ```bash
   pnpm dev
   ```

   - Website: http://localhost:3000
   - Admin-Panel: http://localhost:3000/admin (beim ersten Aufruf wird ein Admin-Account angelegt)

## Inhalte pflegen

Alle Texte, Bilder, Navigation, Bankverbindung und Kontaktdaten werden über das **Admin-Panel** (`/admin`)
gepflegt — keine Codeänderungen nötig:

- **Globals**: Header (Navigation), Footer, Homepage, Spenden-Seite, Kontakt-Seite, Site-Einstellungen
- **Collections**: Seiten (Über Uns, Aktivität, Flüchtlingshilfe, Jugendarbeit, Kurse, Zusammenleben, Impressum, Datenschutz), Projekte, Medien

## Hinweise

- Der Seed-Datensatz enthält realistische Beispieltexte auf Basis der bisherigen Website. **Impressum und
  Datenschutzerklärung sind Platzhalter** und sollten vor dem Livegang rechtlich geprüft und vervollständigt
  werden (Vereinsregisternummer, Registergericht, Vorstand).
- Der PayPal-Link im Spenden-Bereich ist ein Platzhalter und muss durch den echten Link ersetzt werden.
- Deployment ist z. B. über [Vercel](https://vercel.com) möglich (Next.js + Payload werden dort offiziell
  unterstützt); `DATABASE_URI` und `PAYLOAD_SECRET` als Environment Variables hinterlegen.
