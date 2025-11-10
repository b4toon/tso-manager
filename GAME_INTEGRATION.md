# 🎮 Integracja z Grą - Przewodnik

Ten dokument opisuje jak zintegrować TSO Manager z Twoją grą.

## 📡 Endpoint API

**URL**: `https://twoja-domena.vercel.app/api/game/task`  
**Metoda**: `POST`  
**Content-Type**: `application/json`

## 📋 Format danych

### Wymagane pola

```javascript
{
  // Typ eventu (zawsze 'task_sent')
  "event_type": "task_sent",
  
  // Dane gracza
  "player_nick": "NickGracza",      // string - nick gracza
  "player_id": 123456,              // number - unikalne ID gracza
  "realm": "NazwaRealmu",           // string - nazwa świata/realmu
  
  // Dane explorera
  "explorer_id": "unique_id_123",   // string - unikalny ID explorera
  "explorer_name": "Nazwa Explorer", // string - nazwa explorera
  "explorer_type": 1,                // number - typ explorera (1, 2, 3...)
  "explorer_icon": "icon.png",       // string - nazwa ikony
  
  // Dane taska
  "status": "sent",                  // string - status (zawsze 'sent')
  "task_id": 10,                     // number - ID głównego taska
  "sub_task_id": 5,                  // number - ID podtaska
  "task_name": "Nazwa Zadania",      // string - nazwa zadania
  "return_time": "2025-11-11T12:00:00Z", // string - ISO timestamp powrotu
  "remaining_time_ms": 3600000       // number - pozostały czas w ms
}
```

## 🔧 Przykłady implementacji

### ActionScript 3 (Flash)

```actionscript
// Przygotowanie danych
var payload:Object = {
    event_type: 'task_sent',
    player_nick: game.player.GetPlayerName_string(),
    player_id: game.player.getPlayerID(),
    realm: swmmo.getDefinitionByName("global").gameworld,
    explorer_id: explorerUniqueId,
    explorer_name: explorerName,
    explorer_type: explorerType,
    explorer_icon: explorerIcon,
    status: 'sent',
    task_id: parseInt(taskArray[0]),
    sub_task_id: parseInt(taskArray[1]),
    task_name: taskText,
    return_time: formatReturnTime(returnTimeStamp),
    remaining_time_ms: remainingTimeMs
};

// Konwersja do JSON
var jsonData:String = JSON.stringify(payload);

// Utworzenie requestu
var request:URLRequest = new URLRequest('https://twoja-domena.vercel.app/api/game/task');
request.method = URLRequestMethod.POST;
request.contentType = 'application/json';
request.data = jsonData;

// Wysłanie requestu
var loader:URLLoader = new URLLoader();
loader.addEventListener(Event.COMPLETE, onTaskSentSuccess);
loader.addEventListener(IOErrorEvent.IO_ERROR, onTaskSentError);
loader.load(request);

// Handler sukcesu
function onTaskSentSuccess(event:Event):void {
    var response:Object = JSON.parse(event.target.data);
    trace("Task wysłany pomyślnie! Action ID: " + response.action_id);
}

// Handler błędu
function onTaskSentError(event:IOErrorEvent):void {
    trace("Błąd wysyłania taska: " + event.text);
}
```

### JavaScript (Modern)

```javascript
async function sendTaskToAPI(taskData) {
    try {
        const payload = {
            event_type: 'task_sent',
            player_nick: taskData.playerNick,
            player_id: taskData.playerId,
            realm: taskData.realm,
            explorer_id: taskData.explorerId,
            explorer_name: taskData.explorerName,
            explorer_type: taskData.explorerType,
            explorer_icon: taskData.explorerIcon,
            status: 'sent',
            task_id: taskData.taskId,
            sub_task_id: taskData.subTaskId,
            task_name: taskData.taskName,
            return_time: taskData.returnTime,
            remaining_time_ms: taskData.remainingTimeMs
        };

        const response = await fetch('https://twoja-domena.vercel.app/api/game/task', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Task wysłany pomyślnie!', result);
        return result;

    } catch (error) {
        console.error('Błąd wysyłania taska:', error);
        throw error;
    }
}

// Przykład użycia
sendTaskToAPI({
    playerNick: 'TestPlayer',
    playerId: 12345,
    realm: 'MainRealm',
    explorerId: 'explorer_001',
    explorerName: 'Brave Explorer',
    explorerType: 1,
    explorerIcon: 'icon_brave.png',
    taskId: 10,
    subTaskId: 5,
    taskName: 'Explore the Forest',
    returnTime: new Date(Date.now() + 3600000).toISOString(),
    remainingTimeMs: 3600000
});
```

### PHP

```php
<?php
function sendTaskToAPI($taskData) {
    $payload = [
        'event_type' => 'task_sent',
        'player_nick' => $taskData['playerNick'],
        'player_id' => $taskData['playerId'],
        'realm' => $taskData['realm'],
        'explorer_id' => $taskData['explorerId'],
        'explorer_name' => $taskData['explorerName'],
        'explorer_type' => $taskData['explorerType'],
        'explorer_icon' => $taskData['explorerIcon'],
        'status' => 'sent',
        'task_id' => $taskData['taskId'],
        'sub_task_id' => $taskData['subTaskId'],
        'task_name' => $taskData['taskName'],
        'return_time' => $taskData['returnTime'],
        'remaining_time_ms' => $taskData['remainingTimeMs']
    ];

    $ch = curl_init('https://twoja-domena.vercel.app/api/game/task');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json'
    ]);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode === 200) {
        return json_decode($response, true);
    } else {
        throw new Exception("HTTP Error: $httpCode");
    }
}

// Przykład użycia
$result = sendTaskToAPI([
    'playerNick' => 'TestPlayer',
    'playerId' => 12345,
    'realm' => 'MainRealm',
    'explorerId' => 'explorer_001',
    'explorerName' => 'Brave Explorer',
    'explorerType' => 1,
    'explorerIcon' => 'icon_brave.png',
    'taskId' => 10,
    'subTaskId' => 5,
    'taskName' => 'Explore the Forest',
    'returnTime' => date('c', time() + 3600),
    'remainingTimeMs' => 3600000
]);

echo "Action ID: " . $result['action_id'];
?>
```

## 📊 Odpowiedź API

### Sukces (200 OK)

```json
{
  "success": true,
  "action_id": "550e8400-e29b-41d4-a716-446655440000",
  "message": "Task został zapisany pomyślnie"
}
```

### Błąd walidacji (400 Bad Request)

```json
{
  "error": "Brak wymaganych danych gracza"
}
```

### Błąd serwera (500 Internal Server Error)

```json
{
  "error": "Nieoczekiwany błąd serwera"
}
```

## 🔍 Co dzieje się po wysłaniu?

1. **Sprawdzenie gracza**: System sprawdza czy gracz istnieje w bazie, jeśli nie - tworzy nowy wpis
2. **Sprawdzenie typu explorera**: Sprawdza czy typ explorera istnieje, jeśli nie - tworzy nowy
3. **Przypisanie explorera**: Jeśli to pierwszy raz kiedy gracz używa tego explorera, tworzy połączenie
4. **Zapisanie taska**: Dodaje informację o wysłanym tasku do historii

## 🎯 Najlepsze praktyki

### 1. Obsługa błędów
Zawsze obsługuj błędy sieciowe - gra może działać offline, serwer może być niedostępny.

```javascript
try {
    await sendTaskToAPI(data);
} catch (error) {
    // Loguj błąd ale nie przerywaj gry
    console.error('Nie udało się wysłać statystyk:', error);
    // Opcjonalnie: zapisz do kolejki i wyślij później
}
```

### 2. Timeout
Ustaw timeout aby nie blokować gry w przypadku wolnego połączenia:

```javascript
const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 5000); // 5 sekund

fetch(url, {
    signal: controller.signal,
    // ... rest of config
})
.finally(() => clearTimeout(timeout));
```

### 3. Kolejkowanie
Jeśli gracz może wysłać wiele explorerów naraz, rozważ kolejkowanie requestów:

```javascript
class TaskQueue {
    constructor() {
        this.queue = [];
        this.processing = false;
    }

    async add(taskData) {
        this.queue.push(taskData);
        if (!this.processing) {
            this.process();
        }
    }

    async process() {
        this.processing = true;
        while (this.queue.length > 0) {
            const task = this.queue.shift();
            try {
                await sendTaskToAPI(task);
                await new Promise(resolve => setTimeout(resolve, 100)); // 100ms delay
            } catch (error) {
                console.error('Error processing task:', error);
            }
        }
        this.processing = false;
    }
}

const taskQueue = new TaskQueue();
```

### 4. Format czasu
Zawsze wysyłaj `return_time` w formacie ISO 8601:

```javascript
// Poprawne
const returnTime = new Date(timestamp).toISOString();
// Wynik: "2025-11-11T12:00:00.000Z"

// Funkcja pomocnicza
function formatReturnTime(timestamp) {
    return new Date(timestamp).toISOString();
}
```

### 5. Unikalny ID explorera
Upewnij się że `explorer_id` jest unikalny dla każdego explorera gracza:

```javascript
// Przykład generowania unikalnego ID
const explorerId = `${playerId}_${explorerType}_${timestamp}`;
```

## 🧪 Testowanie

### Test z curl

```bash
curl -X POST https://twoja-domena.vercel.app/api/game/task \
  -H "Content-Type: application/json" \
  -d '{
    "event_type": "task_sent",
    "player_nick": "TestPlayer",
    "player_id": 99999,
    "realm": "TestRealm",
    "explorer_id": "test_exp_001",
    "explorer_name": "Test Explorer",
    "explorer_type": 999,
    "explorer_icon": "test_icon.png",
    "status": "sent",
    "task_id": 1,
    "sub_task_id": 1,
    "task_name": "Test Task",
    "return_time": "2025-12-31T23:59:59Z",
    "remaining_time_ms": 86400000
  }'
```

### Test z Postman

1. Otwórz Postman
2. Utwórz nowy request POST
3. URL: `https://twoja-domena.vercel.app/api/game/task`
4. Headers: `Content-Type: application/json`
5. Body > raw > JSON - wklej przykładowy payload
6. Kliknij Send

## 🔒 Bezpieczeństwo

### Rate Limiting
API nie ma obecnie rate limitingu, ale możesz dodać w Vercel:
- Rozważ dodanie rate limitingu jeśli API jest publicznie dostępne
- Możesz użyć Vercel Edge Config lub zewnętrznej usługi

### CORS
API akceptuje requesty z dowolnej domeny. Jeśli chcesz ograniczyć:

```typescript
// W app/api/game/task/route.ts
const allowedOrigins = ['https://twoja-gra.com'];
const origin = request.headers.get('origin');

if (origin && !allowedOrigins.includes(origin)) {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}
```

## 📞 Wsparcie

Jeśli masz problemy z integracją:
1. Sprawdź logi w Vercel Dashboard
2. Sprawdź format danych - muszą być zgodne ze schematem
3. Sprawdź czy endpoint jest dostępny (test curl)
4. Sprawdź logi w konsoli przeglądarki/gry

---

**Happy coding!** 🚀

