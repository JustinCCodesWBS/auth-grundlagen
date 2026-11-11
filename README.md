# Auth-Grundlagen

Du brauchst Node.js 26, MongoDB und Postman.

## Einrichten

Führe in `auth-server` und `api` jeweils `npm ci` aus. Kopiere in beiden Ordnern `.env.example` nach `.env`, falls die `.env` noch fehlt.

Trage in beiden `.env` Dateien deine MongoDB Verbindungs URI unter `MONGO_URI` ein.

Erzeuge einen lokalen Schlüssel und trage **denselben Wert** in beiden Dateien unter `ACCESS_TOKEN_SECRET` ein.

```bash
node -p "require('node:crypto').randomBytes(32).toString('hex')"
```

## Starten

Wenn du MongoDB lokal nutzt, starte zuerst MongoDB. Öffne dann je ein Terminal in `auth-server` und `api`. Führe in beiden `npm run dev` aus.

| Server      | Adresse                 |
| ----------- | ----------------------- |
| Auth-Server | `http://127.0.0.1:3001` |
| Drinks-API  | `http://127.0.0.1:3000` |
