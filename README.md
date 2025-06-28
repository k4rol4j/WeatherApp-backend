# Weather App Backend

Backend aplikacji obliczającej prognozowaną produkcję energii PV oraz podsumowanie tygodnia na podstawie danych pogodowych z Open-Meteo.

## Technologie

- [NestJS](https://nestjs.com/)
- [Axios](https://axios-http.com/)
- [Open-Meteo API](https://open-meteo.com/)
- TypeScript

## Instalacja

1. Sklonuj repozytorium:
```bash
git clone https://github.com/k4rol4j/WeatherApp-backend.git
```
2️. Zainstaluj zależności:
```bash
npm install
```
3. Utwórz plik .env w katalogu głównym:
```bash
PORT=9000
OPEN_METEO_BASE=https://api.open-meteo.com/v1/forecast
HTTP_TIMEOUT=5000
```
## Uruchomienie
Uruchom aplikację w trybie deweloperskim:
```bash
npm run start:dev
```

Aplikacja będzie dostępna pod:

```bash
http://localhost:9000
```

