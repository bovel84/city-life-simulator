// FIX COMPLETO SISTEMA LAVORO E UI
console.log('🔧 Caricamento fix lavoro completo...');

// ============================================
// 1. GENERAZIONE NOMI NEGOZI/AZIENDE SPECIFICI
// ============================================

const BUSINESS_NAMES = {
    'Programmatore': ['TechStart Hub', 'CodeCraft Studios', 'Digital Innovation Lab', 'ByteForge Solutions'],
    'Manager': ['Prime Business Center', 'Executive Plaza', 'Corporate Tower', 'Leadership Institute'],
    'Cameriere': ['Ristorante La Dolce Vita', 'Trattoria del Porto', 'Osteria Centrale', 'Café Elegante'],
    'Commesso': ['Fashion Boutique', 'Style Gallery', 'Trendy Store', 'Urban Market'],
    'Barista': ['Caffè Artisan', 'Coffee Corner', 'Espresso Bar', 'Morning Brew'],
    'Grafico': ['Creative Studio', 'Design Lab', 'Visual Arts Agency', 'Pixel Perfect'],
    'Pizzaiolo': ['Pizzeria Napoletana', 'Forno d\'Oro', 'Pizza Express', 'La Margherita'],
    'Pasticciere': ['Dolce Arte', 'Patisserie Royale', 'Sweet Dreams', 'La Pasticceria'],
    'Libraio': ['Libreria Antica', 'Book Haven', 'Biblioteca Moderna', 'Pagine & Sogni'],
    'Istruttore di Palestra': ['FitZone Gym', 'PowerHouse Fitness', 'Active Life Center', 'Body Temple'],
    'Terapista': ['Centro Benessere Armonia', 'Wellness Clinic', 'Terapia Plus', 'Mind & Body Studio']
};

function generateBusinessName(jobName) {
    const names = BUSINESS_NAMES[jobName];
    if (names && names.length > 0) {
        return names[Math.floor(Math.random() * names.length)];
    }
    return 'Attività Locale'; // Fallback
}

// ============================================
// 2. GENERAZIONE GIORNI LAVORATIVI
// ============================================

function generateWorkDays(jobType, totalDays) {
    const dayNames = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'];
    const dayNumbers = [1, 2, 3, 4, 5, 6, 7];
    
    const patterns = {
        office: [1, 2, 3, 4, 5],
        retail1: [1, 2, 3, 4, 5, 6],
        retail2: [1, 3, 4, 5, 6],
        retail3: [2, 3, 4, 5, 6],
        restaurant1: [2, 3, 4, 5, 6, 7],
        restaurant2: [1, 2, 3, 4, 5, 6],
        restaurant3: [1, 2, 4, 5, 6],
        partTime1: [1, 3, 5],
        partTime2: [2, 4, 6],
        sixDays: [1, 2, 3, 4, 5, 6]
    };
    
    let selectedPattern;
    const lowerJob = jobType.toLowerCase();
    
    if (lowerJob.includes('cameriere') || lowerJob.includes('pizzaiolo') || lowerJob.includes('barista') || lowerJob.includes('pasticciere')) {
        const restaurantPatterns = [patterns.restaurant1, patterns.restaurant2, patterns.restaurant3];
        selectedPattern = restaurantPatterns[Math.floor(Math.random() * restaurantPatterns.length)];
    } else if (lowerJob.includes('commesso') || lowerJob.includes('libraio')) {
        const retailPatterns = [patterns.retail1, patterns.retail2, patterns.retail3];
        selectedPattern = retailPatterns[Math.floor(Math.random() * retailPatterns.length)];
    } else if (lowerJob.includes('istruttore') || lowerJob.includes('terapista')) {
        selectedPattern = patterns.sixDays;
    } else {
        selectedPattern = patterns.office;
    }
    
    if (selectedPattern.length > totalDays) {
        selectedPattern = selectedPattern.slice(0, totalDays);
    } else if (selectedPattern.length < totalDays) {
        const available = dayNumbers.filter(d => !selectedPattern.includes(d));
        while (selectedPattern.length < totalDays && available.length > 0) {
            selectedPattern.push(available.shift());
        }
    }
    
    selectedPattern.sort((a, b) => a - b);
    
    return {
        numbers: selectedPattern,
        names: selectedPattern.map(n => dayNames[n - 1])
    };
}

// ============================================
// 3. OVERRIDE GENERAZIONE OFFERTE LAVORO
// ============================================

const originalGenerateJobListings = window.generateJobListings;
if (typeof originalGenerateJobListings === 'function') {
    window.generateJobListings = function() {
        const jobs = originalGenerateJobListings.call(this);
        
        jobs.forEach(job => {
            // Aggiungi nome specifico negozio/azienda
            job.businessName = generateBusinessName(job.name);
            
            // Aggiungi giorni specifici
            const workDays = generateWorkDays(job.name, job.daysPerWeek || 5);
            job.workDays = workDays.numbers;
            job.workDayNames = workDays.names;
        });
        
        console.log('✅ Offerte lavoro generate con nomi negozi e giorni specifici');
        return jobs;
    };
}

// ============================================
// 4. OVERRIDE VISUALIZZAZIONE OFFERTE
// ============================================

const originalShowJobSearchDialog = window.showJobSearchDialog;
if (typeof originalShowJobSearchDialog === 'function') {
    window.showJobSearchDialog = function(method) {
        originalShowJobSearchDialog.call(this, method);
        
        setTimeout(() => {
            const modalContent = document.querySelector('.modal-content');
            if (!modalContent) return;
            
            // Trova tutte le card delle offerte
            const allDivs = modalContent.querySelectorAll('div[style*="padding:14px"]');
            
            allDivs.forEach((card) => {
                // Cerca il pulsante "Colloquio" per identificare la card
                const button = card.querySelector('button[onclick*="startJobInterview"]');
                if (!button) return;
                
                // Estrai jobId dal pulsante
                const onclickAttr = button.getAttribute('onclick');
                const match = onclickAttr.match(/startJobInterview\('([^']+)'\)/);
                if (!match) return;
                
                const jobId = match[1];
                const job = window.game.jobListings.find(j => j.id === jobId);
                if (!job) return;
                
                // Trova il grid container con le info
                const gridContainer = card.querySelector('[style*="grid-template-columns: 1fr 1fr"]');
                if (!gridContainer) return;
                
                // Aggiungi nome negozio dopo il nome del lavoro
                const jobTitle = card.querySelector('[style*="font-weight:bold"]');
                if (jobTitle && job.businessName) {
                    jobTitle.innerHTML = `${job.name}<br><span style="font-size:0.85rem; color:#9aa5e8; font-weight:normal;">📍 ${job.businessName}</span>`;
                }
                
                // Aggiungi giorni lavorativi
                if (job.workDayNames && job.workDayNames.length > 0) {
                    const daysInfo = document.createElement('div');
                    daysInfo.style.cssText = 'grid-column: 1 / -1; font-size: 0.85rem; padding: 10px; background: linear-gradient(135deg, rgba(102,126,234,0.2), rgba(118,75,162,0.2)); border-radius: 6px; margin-top: 8px; border: 1px solid rgba(102,126,234,0.3);';
                    daysInfo.innerHTML = `📅 <strong>Giorni lavorativi:</strong> ${job.workDayNames.join(', ')}`;
                    gridContainer.appendChild(daysInfo);
                }
            });
            
            console.log('✅ Offerte aggiornate con nomi negozi e giorni');
        }, 150);
    };
}

// ============================================
// 5. CHIUDI DIALOG DOPO COLLOQUIO
// ============================================

const originalStartJobInterview = window.startJobInterview;
if (typeof originalStartJobInterview === 'function') {
    window.startJobInterview = function(jobId) {
        // Memorizza i dati del lavoro
        const job = window.game.jobListings.find(j => j.id === jobId);
        if (job && job.workDays) {
            if (!window.game.workData) window.game.workData = {};
            window.game.workData.pendingWorkDays = job.workDays;
            window.game.workData.pendingWorkDayNames = job.workDayNames;
            window.game.workData.pendingBusinessName = job.businessName;
            window.game.workData.pendingJobData = job;
            console.log('📅 Giorni lavorativi preparati per accettazione');
        }
        
        // Chiudi il dialog
        const closeBtn = document.querySelector('.modal-overlay .close-modal-btn');
        if (closeBtn) {
            closeBtn.click();
            console.log('✅ Dialog chiuso automaticamente');
        }
        
        // Chiama la funzione originale
        originalStartJobInterview.call(this, jobId);
    };
}

// ============================================
// 6. CREAZIONE CALENDARIO LAVORO NELL'AGENDA
// ============================================

window.createWorkSchedule = function(job) {
    if (!window.game || !window.game.agenda || !job) {
        console.log('❌ Impossibile creare calendario: dati mancanti');
        return;
    }
    
    const currentDay = window.game.time.day;
    const workDays = job.workDays || [1, 2, 3, 4, 5];
    const workHours = job.hours || { start: 9, end: 17 };
    const businessName = job.businessName || 'Lavoro';
    
    let appointmentsAdded = 0;
    
    // Crea appuntamenti per i prossimi 30 giorni
    for (let futureDay = currentDay; futureDay <= currentDay + 30; futureDay++) {
        const dayOfWeek = ((futureDay - 1) % 7) + 1;
        
        if (workDays.includes(dayOfWeek)) {
            const appointment = {
                day: futureDay,
                hour: workHours.start,
                minute: 0,
                type: 'work',
                title: `💼 Lavoro: ${job.name}`,
                description: `Turno presso ${businessName} (${workHours.start}:00-${workHours.end}:00)`,
                recurring: true,
                jobId: job.id
            };
            
            // Verifica se esiste già
            const exists = window.game.agenda.some(a => 
                a.day === appointment.day && 
                a.hour === appointment.hour && 
                a.type === 'work'
            );
            
            if (!exists) {
                window.game.agenda.push(appointment);
                appointmentsAdded++;
            }
        }
    }
    
    console.log(`📅 Creati ${appointmentsAdded} appuntamenti lavorativi nell'agenda`);
    
    // Aggiorna visualizzazione agenda se aperta
    if (typeof window.updateAgendaDisplay === 'function') {
        window.updateAgendaDisplay();
    }
    
    return appointmentsAdded;
};

// Intercetta l'accettazione del lavoro tramite dialogo
window.addEventListener('DOMContentLoaded', () => {
    // Monitora i cambiamenti nel game.player.job
    let lastJob = null;
    
    setInterval(() => {
        if (!window.game || !window.game.player) return;
        
        const currentJob = window.game.player.job;
        
        // Se il lavoro è cambiato e non è "Disoccupato"
        if (currentJob !== lastJob && currentJob !== 'Disoccupato') {
            console.log('🎉 Nuovo lavoro accettato:', currentJob);
            
            // Recupera i dati pendenti
            if (window.game.workData && window.game.workData.pendingJobData) {
                const jobData = window.game.workData.pendingJobData;
                
                // Salva i giorni lavorativi
                window.game.workData.workDays = jobData.workDays;
                window.game.workData.workDayNames = jobData.workDayNames;
                window.game.workData.businessName = jobData.businessName;
                
                console.log('💼 Giorni lavorativi memorizzati:', jobData.workDayNames);
                
                // Crea il calendario
                setTimeout(() => {
                    createWorkSchedule(jobData);
                    
                    // Pulisci i dati pendenti
                    delete window.game.workData.pendingWorkDays;
                    delete window.game.workData.pendingWorkDayNames;
                    delete window.game.workData.pendingBusinessName;
                    delete window.game.workData.pendingJobData;
                }, 500);
            }
        }
        
        lastJob = currentJob;
    }, 1000);
});

// ============================================
// 7. HELPER FUNCTION isWorkDay
// ============================================

window.isWorkDay = function() {
    if (!window.game || !window.game.time || !window.game.workData) return false;
    
    const currentDay = window.game.time.day;
    const dayOfWeek = ((currentDay - 1) % 7) + 1;
    
    if (window.game.workData.workDays) {
        return window.game.workData.workDays.includes(dayOfWeek);
    }
    
    return dayOfWeek >= 1 && dayOfWeek <= 5;
};

// ============================================
// 8. AGGIORNA BANNER AGENDA
// ============================================

function updateWorkDaysBanner() {
    if (!window.game || !window.game.workData) return;
    
    const agendaTab = document.getElementById('agendaTab');
    if (!agendaTab) return;
    
    // Rimuovi banner esistente
    const existingBanner = agendaTab.querySelector('.work-days-banner');
    if (existingBanner) existingBanner.remove();
    
    if (window.game.player.job !== 'Disoccupato' && window.game.workData.workDayNames) {
        const banner = document.createElement('div');
        banner.className = 'work-days-banner';
        banner.style.cssText = 'padding: 15px; background: linear-gradient(135deg, rgba(102,126,234,0.25), rgba(118,75,162,0.25)); border-radius: 10px; margin-bottom: 20px; border: 2px solid rgba(102,126,234,0.4);';
        banner.innerHTML = `
            <div style="font-weight: bold; font-size: 1.1rem; margin-bottom: 8px;">💼 I tuoi giorni lavorativi</div>
            <div style="font-size: 0.95rem;">${window.game.workData.workDayNames.join(' • ')}</div>
            ${window.game.workData.businessName ? `<div style="font-size: 0.85rem; opacity: 0.8; margin-top: 5px;">📍 ${window.game.workData.businessName}</div>` : ''}
        `;
        agendaTab.insertBefore(banner, agendaTab.firstChild);
    }
}

// Aggiorna banner quando si apre l'agenda
const originalSwitchMainTab_work = window.switchMainTab;
if (typeof originalSwitchMainTab_work === 'function') {
    window.switchMainTab = function(tabName) {
        originalSwitchMainTab_work.call(this, tabName);
        if (tabName === 'agenda') {
            setTimeout(updateWorkDaysBanner, 100);
        }
    };
}

console.log('✅ Fix lavoro completo caricato con successo');
