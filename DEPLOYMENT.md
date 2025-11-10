# 🚀 Przewodnik Wdrożenia TSO Manager

## Krok 1: Konfiguracja Supabase

### 1.1 Utwórz projekt Supabase
1. Przejdź na [supabase.com](https://supabase.com)
2. Zaloguj się lub utwórz konto
3. Kliknij "New Project"
4. Wybierz organizację i wypełnij dane:
   - **Project Name**: tso-manager
   - **Database Password**: (zapisz to hasło!)
   - **Region**: wybierz najbliższy (np. Frankfurt)
   - **Pricing Plan**: Free tier wystarczy na start
5. Kliknij "Create new project" i poczekaj ~2 minuty

### 1.2 Utwórz schemat bazy danych
1. W dashboardzie projektu, kliknij **SQL Editor** w lewym menu
2. Kliknij "New query"
3. Skopiuj cały kod z pliku `database/schema.sql`
4. Wklej do edytora SQL
5. Kliknij **RUN** lub naciśnij `Ctrl+Enter`
6. Sprawdź czy wszystkie tabele zostały utworzone w zakładce **Table Editor**

### 1.3 Pobierz klucze API
1. Kliknij **Project Settings** (ikona koła zębatego) w lewym menu
2. Kliknij **API** w lewym submenu
3. Znajdź i skopiuj:
   - **Project URL** (zaczyna się od `https://`)
   - **anon/public** key (w sekcji "Project API keys")
   - **service_role** key (w sekcji "Project API keys") ⚠️ **Trzymaj w sekrecie!**

### 1.4 Konfiguracja Email Auth (opcjonalne)
1. **Authentication** > **Providers**
2. Upewnij się że **Email** jest włączony
3. Możesz wyłączyć **Confirm email** jeśli nie chcesz potwierdzania emaili

## Krok 2: Deployment na Vercel

### 2.1 Przygotuj repozytorium Git
```bash
# Zainicjuj git (jeśli jeszcze nie zrobione)
git init

# Dodaj pliki
git add .

# Commit
git commit -m "Initial commit - TSO Manager"

# Utwórz repozytorium na GitHub i wypchnij kod
git remote add origin https://github.com/twoj-username/tso-manager.git
git branch -M main
git push -u origin main
```

### 2.2 Deploy na Vercel
1. Przejdź na [vercel.com](https://vercel.com)
2. Zaloguj się (najlepiej przez GitHub)
3. Kliknij **Add New...** > **Project**
4. Zaimportuj swoje repozytorium z GitHub
5. Vercel automatycznie wykryje Next.js

### 2.3 Skonfiguruj zmienne środowiskowe
W ustawieniach projektu przed deploymentem:

1. Kliknij **Environment Variables**
2. Dodaj następujące zmienne:

```
NEXT_PUBLIC_SUPABASE_URL = <twój Supabase Project URL>
NEXT_PUBLIC_SUPABASE_ANON_KEY = <twój Supabase anon key>
SUPABASE_SERVICE_ROLE_KEY = <twój Supabase service_role key>
```

⚠️ **Ważne**: `SUPABASE_SERVICE_ROLE_KEY` musi być oznaczony jako **Production**, **Preview** i **Development**

3. Kliknij **Deploy**

### 2.4 Poczekaj na build
- Vercel automatycznie zbuduje i wdroży aplikację
- Proces zajmie 2-5 minut
- Po zakończeniu otrzymasz link do swojej aplikacji (np. `https://tso-manager.vercel.app`)

## Krok 3: Testowanie

### 3.1 Testuj aplikację webową
1. Otwórz link do swojej aplikacji
2. Przejdź do `/login`
3. Zarejestruj się używając email i hasła
4. Zaloguj się
5. Sprawdź czy wszystkie strony działają:
   - Dashboard
   - Moje Explorery
   - Typy Explorerów
   - Historia Tasków

### 3.2 Testuj API endpoint
Użyj narzędzia takiego jak Postman lub curl:

```bash
curl -X POST https://twoja-domena.vercel.app/api/game/task \
  -H "Content-Type: application/json" \
  -d '{
    "event_type": "task_sent",
    "player_nick": "TestPlayer",
    "player_id": 12345,
    "realm": "TestRealm",
    "explorer_id": "test_explorer_1",
    "explorer_name": "Test Explorer",
    "explorer_type": 1,
    "explorer_icon": "test_icon.png",
    "status": "sent",
    "task_id": 10,
    "sub_task_id": 5,
    "task_name": "Test Task",
    "return_time": "2025-11-11T12:00:00Z",
    "remaining_time_ms": 3600000
  }'
```

Powinieneś otrzymać odpowiedź:
```json
{
  "success": true,
  "action_id": "uuid-tutaj",
  "message": "Task został zapisany pomyślnie"
}
```

### 3.3 Sprawdź dane w Supabase
1. Wróć do Supabase Dashboard
2. **Table Editor**
3. Sprawdź czy dane pojawiły się w tabelach:
   - `players` - powinien być TestPlayer
   - `explorers_info` - powinien być typ 1
   - `explorer_players` - połączenie gracza z explorerem
   - `explorers_actions` - task testowy

## Krok 4: Integracja z grą

### 4.1 URL endpointa
Twój endpoint API będzie dostępny pod adresem:
```
https://twoja-domena.vercel.app/api/game/task
```

### 4.2 Przykładowy kod do wysyłania z gry (JavaScript/ActionScript)
```javascript
// Przykład dla JavaScript/ActionScript
var data = {
    event_type: 'task_sent',
    player_nick: game.player.GetPlayerName_string(),
    player_id: game.player.getPlayerID(),
    realm: swmmo.getDefinitionByName("global").gameworld,
    explorer_id: uniqueId,
    explorer_name: explorerName,
    explorer_type: explorerType,
    explorer_icon: explorerIcon,
    status: 'sent',
    task_id: parseInt(taskArr[0]),
    sub_task_id: parseInt(taskArr[1]),
    task_name: taskText,
    return_time: returnTime,
    remaining_time_ms: remainingTimeMs
};

// Wyślij POST request
var request = new URLRequest('https://twoja-domena.vercel.app/api/game/task');
request.method = URLRequestMethod.POST;
request.contentType = 'application/json';
request.data = JSON.stringify(data);

var loader = new URLLoader();
loader.load(request);
```

## Krok 5: Monitorowanie i maintenance

### 5.1 Logi w Vercel
- **Vercel Dashboard** > **Deployments** > kliknij na deployment > **Functions**
- Tutaj zobaczysz logi z API endpointa

### 5.2 Logi w Supabase
- **Supabase Dashboard** > **Logs** > **Postgres Logs**
- Tutaj zobaczysz zapytania do bazy danych

### 5.3 Metryki
- **Vercel Analytics** - śledź odwiedziny i wydajność
- **Supabase Database** - monitoruj rozmiar bazy i zapytania

## 🔧 Rozwiązywanie problemów

### Problem: "Error connecting to Supabase"
**Rozwiązanie**: 
- Sprawdź czy zmienne środowiskowe są poprawnie ustawione w Vercel
- Zredeploy aplikację po zmianie zmiennych

### Problem: "401 Unauthorized" przy wysyłaniu danych
**Rozwiązanie**: 
- Sprawdź czy `SUPABASE_SERVICE_ROLE_KEY` jest poprawnie ustawiony
- Sprawdź RLS policies w Supabase

### Problem: "Email not confirmed"
**Rozwiązanie**:
- Wyłącz potwierdzanie emaili w Supabase Auth settings
- Lub potwierdź email klikając w link w wiadomości

### Problem: Aplikacja się nie buduje na Vercel
**Rozwiązanie**:
- Sprawdź logi buildu w Vercel
- Upewnij się że `package.json` jest poprawny
- Sprawdź czy Node.js version jest kompatybilna (18+)

## 📱 Następne kroki

1. **Dostosuj design** - zmień kolory w `tailwind.config.ts`
2. **Dodaj więcej statystyk** - rozszerz dashboard
3. **Dodaj filtry** - w tabelach explorerów i tasków
4. **Dodaj paginację** - dla dużych zbiorów danych
5. **Dodaj eksport danych** - CSV, Excel
6. **Dodaj custom domain** w Vercel Settings

## 🎉 Gotowe!

Twoja aplikacja TSO Manager jest teraz live i gotowa do użycia! 🚀

---

**Potrzebujesz pomocy?** Sprawdź dokumentację:
- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Vercel Docs](https://vercel.com/docs)

