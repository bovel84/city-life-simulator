// Fix UI - Correzioni per mappa, sidebar e tempo
// Aggiungi questo script alla fine del file HTML, prima della chiusura </body>

// 1. CORREZIONE DIMENSIONI SIDEBAR E MAPPA
document.addEventListener('DOMContentLoaded', function() {
    // Ridimensiona sidebar sinistra
    const statsSidebar = document.getElementById('statsSidebar');
    if (statsSidebar) {
        statsSidebar.style.width = '220px';
        statsSidebar.style.padding = '12px';
        const statsTitle = statsSidebar.querySelector('h3');
        if (statsTitle) statsTitle.style.fontSize = '0.9rem';
    }
    
    // Ridimensiona sidebar destra e aumenta z-index
    const menuSidebar = document.getElementById('menuSidebar');
    if (menuSidebar) {
        menuSidebar.style.width = '200px';
        menuSidebar.style.padding = '12px';
        menuSidebar.style.zIndex = '2000'; // Porta in primo piano
        menuSidebar.style.boxShadow = '-5px 0 20px rgba(0,0,0,0.5)';
        const menuTitle = menuSidebar.querySelector('h3');
        if (menuTitle) menuTitle.style.fontSize = '0.9rem';
    }
            
});

// 2. CORREZIONE FUNZIONE MENU
function toggleMenuPanel() {
    const menu = document.getElementById('menuSidebar');
    const mainArea = document.getElementById('mainMapArea');
    const isOpen = menu.style.transform === 'translateX(0px)';
    
    if (isOpen) {
        // Chiudi menu
        menu.style.transform = 'translateX(100%)';
        if (mainArea) mainArea.style.right = '0';
    } else {
        // Apri menu in primo piano
        menu.style.transform = 'translateX(0px)';
        menu.style.zIndex = '2000'; // Assicura che sia sopra tutto
        if (mainArea) mainArea.style.right = '0'; // Non spingere il contenuto
    }
}

// 3. CORREZIONE FUNZIONE SWITCH TAB
function switchMainTab(tabName) {
    // Nascondi tutte le tab content
    const tabContents = ['socialTabContent', 'workTabContent', 'romanceTabContent', 
                        'familyTabContent', 'investmentsTabContent', 'crimeTabContent', 
                        'questsTabContent', 'housingTabContent', 'shopTabContent', 
                        'skillsTabContent', 'agendaTabContent'];
    
    tabContents.forEach(id => {
        const elem = document.getElementById(id);
        if (elem) elem.style.display = 'none';
    });
    
    // Nascondi la mappa
    const mapContent = document.querySelector('.card');
    if (mapContent && mapContent.querySelector('#currentLocationDisplay')) {
        mapContent.style.display = 'none';
    }
    
    // Mostra la tab selezionata IN PRIMO PIANO
    const selectedTab = document.getElementById(tabName + 'TabContent');
    if (selectedTab) {
        selectedTab.style.display = 'block';
        selectedTab.style.position = 'relative';
        selectedTab.style.zIndex = '1500'; // Sopra la mappa ma sotto il menu
        selectedTab.style.background = 'rgba(15,15,30,0.98)';
        selectedTab.style.padding = '20px';
        selectedTab.style.borderRadius = '12px';
        selectedTab.style.margin = '20px';
    }
    
    // Chiudi il menu dopo aver selezionato
    toggleMenuPanel();
    
    // Update UI specifica per ogni tab
    if (typeof updateTabContent === 'function') {
        updateTabContent(tabName);
    }
}

// 4. CORREZIONE SISTEMA TEMPO - Formato ore
function updateTimeDisplay() {
    const timeDiv = document.getElementById('gameTime');
    if (!timeDiv || !game || !game.time) return;
    
    const day = game.time.day;
    const hour = game.time.hour;
    const minute = game.time.minute || 0;
    
    // Calcola il giorno della settimana (assumendo che il giorno 1 sia lunedì)
    const dayOfWeek = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'];
    const weekDay = dayOfWeek[(day - 1) % 7];
    
    // Formato ore con minuti
    const hourStr = hour.toString().padStart(2, '0');
    const minuteStr = minute.toString().padStart(2, '0');
    
    timeDiv.innerHTML = `${weekDay} - Giorno ${day} - ${hourStr}:${minuteStr}`;
}

// 5. CORREZIONE GAME LOOP - Sistema tempo funzionante
let gameLoopInterval = null;

function startGameLoop() {
    // Ferma eventuali loop precedenti
    if (gameLoopInterval) {
        clearInterval(gameLoopInterval);
    }
    
    // Avvia nuovo loop ogni secondo
    gameLoopInterval = setInterval(function() {
        if (!game || !game.time || !game.timeControl) return;
        
        // Controlla se il tempo è in pausa
        if (game.timeControl.isPaused) return;
        
        // Calcola quanto tempo è passato
        const now = Date.now();
        const deltaTime = now - game.timeControl.lastTick;
        game.timeControl.lastTick = now;
        
        // Calcola quanti minuti passano (speed multiplier)
        const minutesToAdd = (deltaTime / 1000) * game.timeControl.speed;
        
        if (minutesToAdd >= 1) {
            advanceTime(Math.floor(minutesToAdd));
        }
    }, 1000); // Tick ogni secondo
}

function advanceTime(minutes) {
    if (!game || !game.time) return;
    
    game.time.minute = (game.time.minute || 0) + minutes;
    
    // Gestisci overflow minuti -> ore
    while (game.time.minute >= 60) {
        game.time.minute -= 60;
        game.time.hour++;
        
        // Gestisci overflow ore -> giorni
        if (game.time.hour >= 24) {
            game.time.hour = 0;
            game.time.day++;
            
            // Eventi fine giornata
            if (typeof onNewDay === 'function') {
                onNewDay();
            }
        }
        
        // Eventi ogni ora
        if (typeof onNewHour === 'function') {
            onNewHour();
        }
    }
    
    // Aggiorna UI
    updateTimeDisplay();
    
    // Degrado stats nel tempo
    if (game.player) {
        // Degrado lento e realistico
        const hourlyDecay = {
            hunger: -0.5,  // -12% al giorno
            energy: -0.3,  // -7.2% al giorno
            morale: -0.1   // -2.4% al giorno
        };
        
        Object.keys(hourlyDecay).forEach(stat => {
            if (game.player.stats[stat] !== undefined) {
                game.player.stats[stat] = Math.max(0, Math.min(100, 
                    game.player.stats[stat] + (hourlyDecay[stat] * (minutes / 60))
                ));
            }
        });
        
        // Aggiorna UI stats
        if (typeof updateStatsUI === 'function') {
            updateStatsUI();
        }
    }
}

function toggleTimePause() {
    if (!game || !game.timeControl) return;
    
    game.timeControl.isPaused = !game.timeControl.isPaused;
    
    const btn = document.getElementById('timePlayPauseBtn');
    if (btn) {
        if (game.timeControl.isPaused) {
            btn.innerHTML = '▶️';
            btn.style.background = 'var(--success)';
            if (typeof showNotification === 'function') {
                showNotification('⏸️ Tempo in pausa', 1500);
            }
        } else {
            btn.innerHTML = '⏸️';
            btn.style.background = 'var(--warning)';
            game.timeControl.lastTick = Date.now();
            if (typeof showNotification === 'function') {
                showNotification('▶️ Tempo ripreso', 1500);
            }
        }
    }
}

function cycleTimeSpeed() {
    if (!game || !game.timeControl) return;
    
    const speeds = [1, 2, 5, 10];
    const currentIndex = speeds.indexOf(game.timeControl.speed);
    const nextIndex = (currentIndex + 1) % speeds.length;
    game.timeControl.speed = speeds[nextIndex];
    
    const btn = document.getElementById('timeSpeedBtn');
    if (btn) {
        btn.innerHTML = `⚡ ${game.timeControl.speed}x`;
    }
    
    if (typeof showNotification === 'function') {
        showNotification(`⚡ Velocità: ${game.timeControl.speed}x`, 1500);
    }
}

// 6. INIZIALIZZAZIONE CORRETTA DEL TEMPO
function initializeTime() {
    if (!game) return;
    
    game.time = {
        day: 1,
        hour: 8,
        minute: 0
    };
    
    game.timeControl = {
        isPaused: false,
        speed: 1,
        lastTick: Date.now()
    };
    
    // Avvia il loop
    startGameLoop();
    updateTimeDisplay();
}

// Sovrascrivi le funzioni globali se non esistono
if (typeof window.toggleMenuPanel === 'undefined') {
    window.toggleMenuPanel = toggleMenuPanel;
}
if (typeof window.switchMainTab === 'undefined') {
    window.switchMainTab = switchMainTab;
}
if (typeof window.toggleTimePause === 'undefined') {
    window.toggleTimePause = toggleTimePause;
}
if (typeof window.cycleTimeSpeed === 'undefined') {
    window.cycleTimeSpeed = cycleTimeSpeed;
}

console.log('✅ Fix UI applicato con successo!');
