console.log('🔧 Applicazione correzioni UI MOBILE + DESKTOP...');

/* ===============================
   1. SYSTEM FIX – SIDEBAR E LAYOUT
   =============================== */

window.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {

        // Sidebar destra – lasciamo attiva ma SENZA occupare spazio laterale
        const menuSidebar = document.getElementById('menuSidebar');
        if (menuSidebar) {
            menuSidebar.style.width = '200px'; // reale larghezza pannello
            menuSidebar.style.zIndex = '2000';
            menuSidebar.style.position = 'fixed';
            menuSidebar.style.right = '0';
        }

        console.log('✅ Layout sidebar aggiornato');
    }, 100);
});


/* ===============================
   2. MENU TOGGLE FIX
   =============================== */

const originalToggleMenuPanel = window.toggleMenuPanel;
window.toggleMenuPanel = function() {
    const menu = document.getElementById('menuSidebar');
    if (!menu) return;

    const isOpen = menu.style.transform === 'translateX(0px)';

    if (isOpen) {
        menu.style.transform = 'translateX(100%)';
    } else {
        menu.style.transform = 'translateX(0px)';
        menu.style.zIndex = '2000';
    }
};


/* ===============================
   3. FIX PRINCIPALE – POPUP SENZA SPAZIO A SINISTRA
   =============================== */

const originalSwitchMainTab = window.switchMainTab;
window.switchMainTab = function(tabName) {
    console.log('📂 Apertura tab:', tabName);

    if (typeof originalSwitchMainTab === 'function') {
        originalSwitchMainTab(tabName);
    }

    // NASCONDI la mappa
    const mainCard = document.querySelector('#mainMapArea > .container > .card');
    if (mainCard) mainCard.style.display = 'none';

    const tabId = tabName + "TabContent";
    const tabElement = document.getElementById(tabId);

    if (tabElement) {

        /* DESKTOP + MOBILE */
        tabElement.style.display = 'block';
        tabElement.style.position = 'fixed';

        /* 🎯 ECCO IL FIX TOTALE */
        tabElement.style.left = '0';
        tabElement.style.right = '0';

        /* Limiti verticali */
        tabElement.style.top = '70px';
        tabElement.style.bottom = '0';

        tabElement.style.zIndex = '3000';
        tabElement.style.background = 'linear-gradient(135deg, rgba(15,15,30,0.98), rgba(25,25,40,0.98))';

        /* Padding responsivo: mobile più stretto */
        if (window.innerWidth <= 768) {
            tabElement.style.padding = '14px';
        } else {
            tabElement.style.padding = '24px';
        }

        tabElement.style.borderRadius = '16px';
        tabElement.style.boxShadow = '0 10px 40px rgba(0,0,0,0.5)';
        tabElement.style.border = '2px solid rgba(102,126,234,0.3)';
        tabElement.style.overflowY = 'auto';
        tabElement.style.backdropFilter = 'blur(10px)';
    }

    // Chiude menu
    const menu = document.getElementById('menuSidebar');
    if (menu) menu.style.transform = 'translateX(100%)';
};


/* ===============================
   4. TIME CONTROL FIX
   =============================== */

const originalStartGame = window.startGame;
if (typeof originalStartGame === 'function') {
    window.startGame = function() {
        originalStartGame.call(this);

        if (window.game && !window.game.timeControl) {
            window.game.timeControl = {
                isPaused: false,
                speed: 1,
                lastTick: Date.now()
            };
        }

        if (window.game && window.game.time && typeof window.game.time.minute === 'undefined') {
            window.game.time.minute = 0;
        }

        console.log("⏱️ Sistema tempo inizializzato");
    };
}


/* ===============================
   5. TIME BUTTON FIX
   =============================== */

document.addEventListener('click', function(e) {
    const target = e.target;

    if (target.id === 'timePlayPauseBtn') {
        if (window.game && window.game.timeControl) {
            window.game.timeControl.isPaused = !window.game.timeControl.isPaused;

            if (window.game.timeControl.isPaused) {
                target.innerHTML = '▶️';
                target.style.background = 'var(--success)';
            } else {
                target.innerHTML = '⏸️';
                target.style.background = 'var(--warning)';
                window.game.timeControl.lastTick = Date.now();
            }
        }
    }

    if (target.id === 'timeSpeedBtn') {
        if (window.game && window.game.timeControl) {
            const speeds = [1, 2, 5, 10];
            const currentIndex = speeds.indexOf(window.game.timeControl.speed);
            const nextIndex = (currentIndex + 1) % speeds.length;
            window.game.timeControl.speed = speeds[nextIndex];
            target.innerHTML = `⚡ ${window.game.timeControl.speed}x`;
        }
    }
});


/* ===============================
   6. NASCONDERE UI MAPPPA QUANDO SI APRE UN TAB
   =============================== */

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        const menuButtons = document.querySelectorAll('#menuSidebar button');
        menuButtons.forEach(button => {
            button.addEventListener('click', function() {
                const mapContainer = document.querySelector('.visual-map-container');
                const locationDisplay = document.getElementById('currentLocationDisplay');
                const mapTabs = document.querySelector('.tab-buttons');

                if (mapContainer) mapContainer.style.display = 'none';
                if (locationDisplay) locationDisplay.style.display = 'none';
                if (mapTabs) mapTabs.style.display = 'none';
            });
        });
    }, 500);
});


/* ===============================
   7. RITORNO ALLA MAPPA
   =============================== */

window.returnToMap = function() {
    console.log("🗺️ Ritorno alla mappa");

    const tabContents = document.querySelectorAll('[id$="TabContent"]');
    tabContents.forEach(tab => {
        tab.style.display = 'none';
        tab.style.position = 'relative';
        tab.style.left = '0';
        tab.style.right = '0';
        tab.style.top = 'auto';
        tab.style.bottom = 'auto';
    });

    const mapContainer = document.querySelector('.visual-map-container');
    const locationDisplay = document.getElementById('currentLocationDisplay');
    const mapTabs = document.querySelector('.tab-buttons');
    const mainCard = document.querySelector('#mainMapArea > .container > .card');

    if (mapContainer) mapContainer.style.display = 'block';
    if (locationDisplay) locationDisplay.style.display = 'block';
    if (mapTabs) mapTabs.style.display = 'flex';
    if (mainCard) mainCard.style.display = 'block';
};


/* ===============================
   8. AGGIUNTA PULSANTE TORNA ALLA MAPPA
   =============================== */

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        const tabContents = document.querySelectorAll('[id$="TabContent"]');
        tabContents.forEach(tab => {
            if (!tab.querySelector('.back-to-map-btn')) {
                const backBtn = document.createElement('button');
                backBtn.className = 'back-to-map-btn';
                backBtn.innerHTML = '🗺️ Torna alla Mappa';
                backBtn.style.cssText = 'position:sticky; top:10px; z-index:100; margin-bottom:20px; background:linear-gradient(135deg,#667eea,#764ba2); padding:10px 20px; border-radius:8px; border:none; color:white; font-weight:bold; cursor:pointer; box-shadow:0px 4px 12px rgba(0,0,0,0.3);';
                backBtn.onclick = returnToMap;
                tab.insertBefore(backBtn, tab.firstChild);
            }
        });
    }, 800);
});

console.log("✅ Correzioni UI MOBILE + DESKTOP applicate!");
