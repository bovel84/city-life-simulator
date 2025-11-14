# 🗣️ Sistema di Dialoghi Multi-Livello

## ✅ Implementato!

Ho creato un sistema di conversazioni a più livelli dove **ogni risposta può portare a nuove domande** invece di tornare sempre al menu principale.

---

## 🎯 Come Funziona

### **Prima (Sistema Vecchio)**
1. Scegli una domanda → NPC risponde
2. Torni al menu principale
3. Riparti da capo

### **Ora (Sistema Nuovo)**
1. Scegli una domanda → NPC risponde
2. Ricevi **nuove opzioni di follow-up** contestuali
3. Puoi approfondire l'argomento con **2-4 domande successive**
4. Ogni follow-up può avere **ulteriori sotto-follow-up** (fino a 3 livelli)
5. Opzione **"↩️ Torna al menu principale"** sempre disponibile

---

## 📝 Esempi Concreti

### **Esempio 1: Primo Incontro**

```
👋 Ciao! Sono [Nome Giocatore]
  └─ NPC: "Piacere! Io sono [Nome NPC]. Che ci fai qui?"
     
     ├─ 💼 Lavoro come [Job]
     │  └─ NPC: "Interessante! Io invece faccio [Job NPC]"
     │     
     │     ├─ 📚 Da quanto fai questo lavoro?
     │     │  └─ NPC: "Da qualche anno ormai..."
     │     
     │     └─ 😊 Ti piace il tuo lavoro?
     │        └─ NPC: "Sì tantissimo!" / "Ha i suoi pro e contro"
     
     └─ 🗺️ Sto esplorando la città
        └─ NPC: "Ah sei nuovo? Eldoria è bellissima!"
           
           ├─ 📍 Cosa mi consigli di visitare?
           │  └─ NPC: "Il Centro Storico è stupendo!"
           
           └─ 🛡️ La città è sicura?
              └─ NPC: "Dipende dalle zone. La periferia..."
```

### **Esempio 2: Conversazione Personale**

```
💭 Come ti trovi qui in città?
  └─ NPC: "Beh, ha i suoi pro e contro..."
     
     ├─ 🏠 Sei di qui originariamente?
     │  └─ NPC: "Sì, conosco ogni angolo!" / "No, mi sono trasferito"
     
     ├─ ✨ Hai dei sogni nel cassetto?
     │  └─ 🎲 Check Charisma DC12
     │     ├─ ✓ Successo: "Vorrei realizzare qualcosa di importante..."
     │     └─ ✗ Fallimento: "Preferisco non parlarne..."
     
     └─ 👨‍👩‍👧 Hai famiglia qui?
        └─ NPC: "Sì, ci vediamo spesso" / "No, mi manca"
```

### **Esempio 3: Consigli Finanziari**

```
💰 Consigli per guadagnare?
  └─ NPC: "Devi essere costante. Lavora duro e risparmia."
     
     ├─ 📈 E gli investimenti?
     │  └─ NPC: "Le azioni sono rischiose ma..."
     
     ├─ 🏦 Come risparmiare meglio?
     │  └─ NPC: "Metti da parte almeno il 20%..."
     
     └─ 💼 Meglio dipendente o in proprio?
        └─ NPC: "Dipende. Il lavoro dipendente è sicuro ma..."
```

### **Esempio 4: Informazioni Città (Multi-livello)**

```
📍 Cosa mi consigli di visitare?
  └─ NPC: "Il Centro Storico è bellissimo!"
     
     ├─ 🌃 E per la vita notturna?
     │  └─ NPC: "I migliori locali sono nel Centro..."
     
     ├─ 🍽️ Ristoranti da provare?
     │  └─ NPC: "Dipende cosa ti piace..."
     │     
     │     ├─ 🍝 Italiana sicuramente!
     │     │  └─ NPC: "Prova 'La Tavola Calda'!"
     │     
     │     └─ 🌍 Cucine esotiche
     │        └─ NPC: "C'è un cinese ottimo e un indiano..."
     
     ├─ 🛡️ Quali zone evitare?
     │  └─ NPC: "La Periferia di notte..."
     
     └─ 🌳 Parchi e natura?
        └─ NPC: "Il Parco Centrale è magnifico!"
```

### **Esempio 5: Invito Caffè**

```
☕ Ti va di prendere un caffè?
  └─ 🎲 Check Charisma DC10-14
     └─ ✓ "Volentieri! Quando sei libero?"
        
        ├─ ⏰ Che ne dici di ora?
        │  └─ NPC: "Perfetto! Conosco un bel posto!"
        │     └─ [EVENTO: coffee_immediate]
        
        ├─ 📅 Magari domani?
        │  └─ NPC: "Va bene! Ci sentiamo domani."
        │     └─ [EVENTO: coffee_planned]
        
        └─ 💰 Offro io!
           └─ 🎲 Check Charisma DC10
              └─ ✓ "Oh che gentile! Accetto!"
                 └─ [EVENTO: coffee_treat]
```

---

## 🎨 Caratteristiche Tecniche

### **Struttura Follow-Up**
```javascript
{
    id: 'main_option',
    text: 'Domanda principale',
    type: 'greeting',
    outcomes: {
        relation: 3,
        response: 'Risposta NPC'
    },
    followUp: [
        {
            id: 'followup_1',
            text: 'Domanda di approfondimento 1',
            outcomes: { ... },
            followUp: [  // Può avere altri follow-up!
                { ... }
            ]
        },
        {
            id: 'followup_2',
            text: 'Domanda di approfondimento 2',
            outcomes: { ... }
        }
    ]
}
```

### **Funzioni Chiave**

1. **`selectDialogueChoice(npc, option)`**
   - Gestisce la scelta del giocatore
   - Controlla se ci sono follow-up
   - Se sì → chiama `renderFollowUpChoices()`
   - Se no → torna al menu principale

2. **`renderFollowUpChoices(npc, followUpOptions, previousType)`**
   - Mostra le opzioni di follow-up
   - Aggiunge automaticamente "↩️ Torna al menu principale"
   - Supporta checks (Charisma, Intellect, etc.)

3. **`executeDialogueChoice(npc, option)`**
   - Esegue la logica della scelta
   - Aggiorna relazione, memoria, eventi
   - Gestisce checks e outcomes

---

## 📊 Opzioni con Follow-Up Implementate

### **Saluti (Prima Volta)**
- ✅ Introduzione amichevole → 2 follow-up → 2 sotto-follow-up ciascuno
- ✅ Introduzione professionale (con check Charisma)

### **Saluti (Successive)**
- ✅ Saluto normale → Racconta giornata / Chiedi come sta
  - → Buone notizie / Cattive notizie
  - → Risposta empatica basata su relazione

### **Conversazioni Personali**
- ✅ Cosa fai nella vita? → 2 follow-up con sotto-opzioni
- ✅ Come ti trovi in città? → 3 follow-up (origini, sogni, famiglia)
- ✅ Confidarsi → 2 follow-up intimi (problema/speranza)

### **Consigli**
- ✅ Consigli finanziari → 3 follow-up (investimenti, risparmi, business)
- ✅ Come affronti difficoltà? → 3 follow-up profondi (motivazione, fallimento, felicità)

### **Informazioni Città**
- ✅ Cosa visitare? → 4 follow-up
  - Vita notturna
  - Ristoranti → 2 sotto-opzioni (italiana/esotica)
  - Zone pericolose
  - Parchi

### **Sociale**
- ✅ Invito caffè → 3 follow-up (ora/domani/offro io)

---

## 🎯 Benefici del Sistema

### **1. Conversazioni Naturali**
- Le persone reali non tornano al menu ogni volta
- Il dialogo fluisce naturalmente

### **2. Scoperta Progressiva**
- Sblocchi informazioni gradualmente
- Ogni risposta apre nuove possibilità

### **3. Profondità**
- Fino a 3 livelli di conversazione
- Centinaia di combinazioni possibili

### **4. Contestualità**
- Le domande cambiano in base a:
  - Livello di fiducia (stranger→familiar)
  - Relazione (0-100)
  - Personalità NPC
  - Mood NPC
  - Skill del giocatore
  - Conversazioni precedenti

### **5. Rigiocabilità**
- Ogni NPC ha risposte diverse
- Checks casuali creano variabilità
- Follow-up diversi in base alle scelte

---

## 🔮 Possibili Espansioni Future

1. **Memoria Conversazionale**
   - NPC ricorda cosa hai chiesto
   - Menziona conversazioni passate
   - "Come dicevi l'altra volta..."

2. **Domande Dinamiche**
   - Follow-up basati sulla risposta dell'NPC
   - Riconoscimento keywords nella risposta

3. **Conversazioni a Catena**
   - "A proposito..." collegamenti tra argomenti
   - Topic branching naturale

4. **Reazioni Emotive**
   - NPC si ricorda se hai detto cose offensive
   - Follow-up condizionati da mood cambiato

5. **Missioni dai Dialoghi**
   - "Potresti aiutarmi con..." → nuova quest
   - Follow-up che sbloccano obiettivi

---

## 🎮 Come Testare

1. Apri il gioco
2. Vai su Social → Persone Conosciute
3. Clicca "💬 Parla" su qualsiasi NPC
4. Prova le opzioni con più testo (hanno follow-up)
5. Osserva come ogni risposta apre nuove domande
6. Usa "↩️ Torna al menu principale" per resettare

**Suggerimento**: Prova la conversazione "👋 Ciao! Come va?" e poi "💬 Ti racconto la mia giornata" per vedere 3 livelli di profondità!

---

## 📌 Note Tecniche

- **Fallback**: Se un'opzione non ha follow-up, torna automaticamente al menu principale
- **Sicurezza**: Il pulsante "Torna indietro" è sempre presente
- **Performance**: Massimo 3 livelli di profondità per evitare confusione
- **Compatibilità**: Funziona con tutti i sistemi esistenti (checks, eventi, memoria NPC)

---

✨ **Il sistema è già attivo e funzionante nel gioco!**
