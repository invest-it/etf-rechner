# ETF-Rechner

Ein moderner ETF- und Sparplanrechner mit Vue 3, TypeScript und Vite. Die App zeigt, wie sich Startkapital, regelmäßige Einzahlungen, erwartete Rendite, Steuern und eine jährliche Dynamik über die Zeit auswirken.

Der Rechner ist bewusst anschaulich aufgebaut: Nutzerinnen und Nutzer sehen nicht nur das Ergebnis, sondern auch Diagramm, Jahrestabelle und den Rechenweg dahinter.

## Funktionen

- Berechnung von Sparplänen mit Startkapital, Einzahlung, Rendite und Laufzeit
- Monatliche oder jährliche Einzahlung
- Erweiterter Modus mit Steuerabzug und dynamischer Erhöhung der Einzahlung
- Interaktives ECharts-Diagramm für Einzahlungen und Gewinne
- Jahrestabelle mit Kontostand, Einzahlungen und Zinsen
- Erklärender Rechenweg mit Formeln und Beispielwerten
- Sprachumschaltung zwischen Deutsch und Englisch
- Responsives UI mit Tailwind CSS und DaisyUI
- Docker-Deployment über Nginx

## Tech Stack

- [Vue 3](https://vuejs.org/) mit Composition API
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/)
- [Tailwind CSS](https://tailwindcss.com/) und [DaisyUI](https://daisyui.com/)
- [ECharts](https://echarts.apache.org/) / `vue-echarts`
- [Vue I18n](https://vue-i18n.intlify.dev/)
- [KaTeX](https://katex.org/) für Formeldarstellung
- Nginx für die Docker-Auslieferung

## Voraussetzungen

- Node.js 20 oder neuer
- npm

## Schnellstart

```bash
npm install
npm run dev
```

Danach läuft die App standardmäßig unter:

```text
http://localhost:5173
```

## Verfügbare Skripte

```bash
npm run dev
```

Startet den lokalen Vite-Entwicklungsserver.

```bash
npm run build
```

Führt die TypeScript-Prüfung aus und erstellt den Produktionsbuild in `dist/`.

```bash
npm run preview
```

Startet eine lokale Vorschau des Produktionsbuilds.

```bash
npm run lint
```

Prüft das Projekt mit ESLint.

```bash
npm run fix
```

Führt ESLint mit automatischen Korrekturen aus.

## Docker

Das Projekt enthält ein mehrstufiges Dockerfile. Im ersten Schritt wird die Vue-App gebaut, im zweiten Schritt wird der fertige Build über Nginx ausgeliefert.

```bash
docker build -t etf-rechner .
docker run --rm -p 8080:80 etf-rechner
```

Die Anwendung ist anschließend unter `http://localhost:8080` erreichbar.

## Projektstruktur

```text
.
|-- docker/                 # Nginx-Konfiguration für das Docker-Image
|-- public/                 # Favicons und Webmanifest
|-- src/
|   |-- assets/             # Logos und statische Assets
|   |-- components/         # Vue-Komponenten der Rechner-Oberfläche
|   |-- composables/        # Wiederverwendbare Berechnungs- und Format-Hooks
|   |-- locales/            # Deutsche und englische Übersetzungen
|   |-- App.vue             # App-Shell
|   |-- i18n.ts             # Vue-I18n-Konfiguration
|   `-- main.ts             # Einstiegspunkt
|-- Dockerfile
|-- package.json
`-- vite.config.ts
```

## Berechnungslogik

Die Kernberechnung liegt in `src/components/EtfCalculator.vue`. Aus der erwarteten Jahresrendite wird ein monatlicher Zinssatz abgeleitet:

```text
monatlicher Zinssatz = (1 + Jahresrendite)^(1 / 12) - 1
```

Anschließend wird der Kontostand Monat für Monat fortgeschrieben. Je nach Einstellung werden Einzahlungen monatlich oder jährlich hinzugefügt. Im erweiterten Modus können Steuern direkt vom Zinsertrag abgezogen und Einzahlungen pro Jahr dynamisch erhöht werden.

Die Ansicht `Methode` erklärt den Rechenweg für die aktuell eingegebenen Werte und nutzt dafür die Hilfslogik aus `src/composables/useSavingsMath.ts`.

## Internationalisierung

Die App nutzt `vue-i18n` mit Deutsch als Standardsprache und Englisch als Fallback. Texte liegen in:

- `src/locales/de.json`
- `src/locales/en.json`

Die Sprache kann in der Navigation umgeschaltet werden.

## Hinweis

Der ETF-Rechner dient nur der allgemeinen Information und stellt keine Anlageberatung dar. Renditen, Steuern und Ergebnisse sind Modellwerte und können von realen Anlageergebnissen abweichen.
