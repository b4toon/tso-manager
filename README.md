# TSO Manager

Aplikacja do zarządzania statystykami explorerów z gry TSO. Zbiera dane z gry przez API i prezentuje je w przejrzystym interfejsie webowym.

## 🚀 Funkcje

- 📊 Dashboard ze statystykami explorerów
- 👥 Przeglądanie wszystkich explorerów
- 🗂️ Lista typów explorerów
- 📜 Historia wykonanych tasków
- 🔐 Autentykacja użytkowników (Supabase Auth)
- 🎮 API endpoint do odbierania danych z gry

## 🛠️ Stack technologiczny

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Baza danych**: Supabase (PostgreSQL)
- **Hosting**: Vercel

## 📋 Wymagania

- Node.js 18+ 
- Konto Supabase
- Konto Vercel (do deployment)

## ⚙️ Instalacja

1. **Sklonuj repozytorium**
```bash
git clone <your-repo-url>
cd tso-manager
```

2. **Zainstaluj zależności**
```bash
npm install
```

3. **Skonfiguruj Supabase**

   a. Utwórz nowy projekt w [Supabase](https://supabase.com)
   
   b. Wykonaj skrypt SQL z pliku `database/schema.sql` w SQL Editor w Supabase
   
   c. Skopiuj URL projektu i klucze API

4. **Skonfiguruj zmienne środowiskowe**

Skopiuj `.env.local.example` do `.env.local`:
```bash
cp .env.local.example .env.local
```

Wypełnij zmienne środowiskowe:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

5. **Uruchom aplikację lokalnie**
```bash
npm run dev
```

Aplikacja będzie dostępna pod adresem: http://localhost:3000

## 🚢 Deployment na Vercel

1. Zaloguj się na [Vercel](https://vercel.com)
2. Zaimportuj repozytorium
3. Dodaj zmienne środowiskowe w ustawieniach projektu
4. Vercel automatycznie zbuduje i wdroży aplikację

## 📡 API Endpoint

### POST /api/game/task

Endpoint do wysyłania danych o taskach z gry.

**Przykładowy payload:**
```javascript
{
  event_type: 'task_sent',
  player_nick: 'PlayerName',
  player_id: 123456,
  realm: 'RealmName',
  explorer_id: 'unique_explorer_id',
  explorer_name: 'Explorer Name',
  explorer_type: 1,
  explorer_icon: 'icon.png',
  status: 'sent',
  task_id: 10,
  sub_task_id: 5,
  task_name: 'Task Name',
  return_time: '2024-01-01T12:00:00Z',
  remaining_time_ms: 3600000
}
```

**Odpowiedź:**
```json
{
  "success": true,
  "action_id": "uuid",
  "message": "Task został zapisany pomyślnie"
}
```

## 🗄️ Model danych

### Tabele

#### `players`
- `id` - INTEGER (Primary Key)
- `name` - TEXT
- `realm` - TEXT
- `created_at` - TIMESTAMP

#### `explorers_info`
- `id` - SERIAL (Primary Key)
- `default_name` - TEXT
- `explorer_type` - INTEGER (UNIQUE)
- `explorer_icon` - TEXT
- `created_at` - TIMESTAMP

#### `explorer_players`
- `id` - TEXT (Primary Key, format: `{player_id}_{explorer_id}`)
- `player_id` - INTEGER (Foreign Key -> players)
- `explorer_type_id` - INTEGER (Foreign Key -> explorers_info)
- `explorer_name` - TEXT
- `explorer_id` - TEXT
- `created_at` - TIMESTAMP

#### `explorers_actions`
- `action_id` - UUID (Primary Key)
- `player_id` - INTEGER (Foreign Key -> players)
- `explorer_id` - TEXT
- `task_id` - INTEGER
- `subtask_id` - INTEGER
- `task_name` - TEXT
- `timestamp` - TIMESTAMP
- `return_time` - TIMESTAMP
- `created_at` - TIMESTAMP

## 🔐 Autentykacja

Aplikacja używa Supabase Auth do autentykacji użytkowników. 

**Rejestracja nowego użytkownika:**
1. Przejdź do `/login`
2. Wprowadź email i hasło
3. Kliknij "Zarejestruj"
4. Potwierdź email (jeśli jest włączona weryfikacja)

**Logowanie:**
1. Przejdź do `/login`
2. Wprowadź email i hasło
3. Kliknij "Zaloguj"

## 📱 Funkcje aplikacji

### Dashboard
- Statystyki: liczba explorerów, tasków, typów
- Szybki przegląd systemu

### Moje Explorery
- Lista wszystkich explorerów przypisanych do graczy
- Informacje o typie, graczu, realm
- Data dodania

### Typy Explorerów
- Katalog wszystkich typów explorerów w grze
- Ikony, nazwy domyślne
- Data odkrycia

### Historia Tasków
- 100 ostatnich tasków
- Informacje o graczu, tasiu, czasie wysłania i powrotu
- Sortowanie po dacie

## 🔧 Rozwój

```bash
# Tryb deweloperski
npm run dev

# Budowanie
npm run build

# Uruchomienie produkcyjnej wersji
npm start

# Linting
npm run lint
```

## 📝 Logika działania endpointa

Gdy gra wysyła dane o tasku:

1. **Sprawdza czy gracz istnieje** - jeśli nie, tworzy nowego gracza w tabeli `players`
2. **Sprawdza czy typ explorera istnieje** - jeśli nie, tworzy nowy typ w tabeli `explorers_info`
3. **Sprawdza czy połączenie gracz-explorer istnieje** - jeśli nie, tworzy wpis w `explorer_players` z unikalnym ID: `{player_id}_{explorer_id}`
4. **Dodaje akcję** do tabeli `explorers_actions` z UUID

## 🐛 Problemy i rozwiązania

### Błąd połączenia z Supabase
- Sprawdź czy zmienne środowiskowe są poprawnie ustawione
- Upewnij się że RLS policies są prawidłowo skonfigurowane

### Błąd 401 przy wysyłaniu danych z gry
- Endpoint używa Service Role Key, więc sprawdź czy jest poprawnie ustawiony
- RLS policies pozwalają na dostęp dla service_role

## 📄 Licencja

MIT

## 👨‍💻 Autor

Twój projekt TSO Manager

---

**Powered by Next.js, Supabase & Vercel** 🚀

