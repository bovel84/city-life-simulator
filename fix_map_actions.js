// Marker Casa e Lavoro + Azioni dirette sulla mappa
console.log('🔧 Fix marker casa/lavoro e azioni dirette attivo');

window.addEventListener('DOMContentLoaded', () => {
    // Funzione per aggiungere marker custom
    function addCustomMarkers() {
        const mapGrid = document.getElementById('overviewMapGrid');
        if (!mapGrid || !window.game || !window.game.player) return;

        // Rimuovi marker precedenti
        const oldMarkers = document.querySelectorAll('.custom-map-marker');
        oldMarkers.forEach(m => m.remove());

        // Marker CASA
        if (window.game.player.homeQuarter) {
            const homeQuarter = window.game.player.homeQuarter;
            const homeDiv = mapGrid.querySelector(`[data-quarter="${homeQuarter}"]`);
            if (homeDiv) {
                const casaMarker = document.createElement('div');
                casaMarker.className = 'custom-map-marker';
                casaMarker.style.cssText = 'position:absolute; left:10px; top:10px; z-index:2100; font-size:1.5rem; cursor:pointer; background:#fff2; border-radius:50%; padding:4px;';
                casaMarker.innerHTML = '🏠<span style="font-size:0.8rem; color:#667eea;"> Casa</span>';
                casaMarker.title = 'Azioni Casa';
                casaMarker.onclick = () => openHomeActions();
                homeDiv.style.position = 'relative';
                homeDiv.appendChild(casaMarker);
            }
        }

        // Marker LAVORO
        if (window.game.workData && window.game.workData.businessName && window.game.workData.currentJob) {
            const jobQuarter = window.game.workData.currentJob.location;
            const jobDiv = mapGrid.querySelector(`[data-quarter="${jobQuarter}"]`);
            if (jobDiv) {
                const lavoroMarker = document.createElement('div');
                lavoroMarker.className = 'custom-map-marker';
                lavoroMarker.style.cssText = 'position:absolute; right:10px; top:10px; z-index:2100; font-size:1.5rem; cursor:pointer; background:#fff2; border-radius:50%; padding:4px;';
                lavoroMarker.innerHTML = '💼<span style="font-size:0.8rem; color:#9aa5e8;"> Lavoro</span>';
                lavoroMarker.title = 'Azioni Lavoro';
                lavoroMarker.onclick = () => openWorkActions();
                jobDiv.style.position = 'relative';
                jobDiv.appendChild(lavoroMarker);
            }
        }
    }

    // Funzione per aprire azioni casa
    window.openHomeActions = function() {
        // Apri direttamente il menu azioni casa
        if (typeof window.showHomeActionsDialog === 'function') {
            window.showHomeActionsDialog();
        } else {
            alert('Azioni Casa non disponibili!');
        }
    };

    // Funzione per aprire azioni lavoro
    window.openWorkActions = function() {
        // Apri direttamente il menu azioni lavoro
        if (typeof window.showWorkActionsDialog === 'function') {
            window.showWorkActionsDialog();
        } else {
            alert('Azioni Lavoro non disponibili!');
        }
    };

    // Aggiorna marker ogni volta che la mappa viene renderizzata
    setInterval(addCustomMarkers, 1500);
});

// Stili marker custom
const style = document.createElement('style');
style.innerHTML = `
.custom-map-marker {
    box-shadow: 0 2px 8px rgba(102,126,234,0.15);
    transition: transform 0.2s;
}
.custom-map-marker:hover {
    transform: scale(1.12);
    background: #e0e7ff;
}
`;
document.head.appendChild(style);

console.log('✅ Marker casa/lavoro e azioni dirette attivi');
