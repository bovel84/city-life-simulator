// CORREZIONE GIORNI DI LAVORO SPECIFICI
// Questo file aggiunge giorni lavorativi specifici alle offerte di lavoro e li memorizza nell'agenda

console.log('📅 Applicazione sistema giorni lavorativi specifici...');

// Funzione per generare giorni lavorativi realistici in base al tipo di lavoro
function generateWorkDays(jobType, totalDays) {
    const dayNames = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'];
    const dayNumbers = [1, 2, 3, 4, 5, 6, 7]; // 1 = Lunedì, 7 = Domenica
    
    // Pattern diversi per tipo di lavoro
    const patterns = {
        // Lavori ufficio: Lun-Ven
        office: [1, 2, 3, 4, 5],
        
        // Retail/Negozi: varia, spesso include sabato
        retail_weekdays: [1, 2, 3, 4, 5, 6],
        retail_split: [1, 3, 4, 5, 6], // Riposo martedì e domenica
        retail_weekend: [2, 3, 4, 5, 6], // Include weekend
        
        // Ristorazione: spesso include weekend
        restaurant_closed_monday: [2, 3, 4, 5, 6, 7], // Chiuso lunedì
        restaurant_closed_sunday: [1, 2, 3, 4, 5, 6], // Chiuso domenica
        restaurant_split: [1, 2, 4, 5, 6], // Riposo mercoledì e domenica
        
        // Part-time: giorni alternati
        parttime_3days: [1, 3, 5], // Lun, Mer, Ven
        parttime_weekend: [5, 6, 7], // Ven, Sab, Dom
        parttime_midweek: [2, 3, 4], // Mar, Mer, Gio
        
        // Full-time con turni: 6 giorni
        fulltime_6days: [1, 2, 3, 4, 5, 6],
        fulltime_6days_nomonday: [2, 3, 4, 5, 6, 7]
    };
    
    // Seleziona pattern in base al tipo
    let selectedPattern;
    
    if (jobType.includes('Programmatore') || jobType.includes('Manager') || jobType.includes('Grafico') || jobType.includes('Project')) {
        selectedPattern = patterns.office;
    } else if (jobType.includes('Commesso') || jobType.includes('Addetto') || jobType.includes('Libraio')) {
        selectedPattern = Math.random() > 0.5 ? patterns.retail_weekdays : patterns.retail_split;
    } else if (jobType.includes('Cameriere') || jobType.includes('Barista') || jobType.includes('Chef') || jobType.includes('Pizzaiolo') || jobType.includes('Pasticciere')) {
        const rand = Math.random();
        if (rand > 0.66) selectedPattern = patterns.restaurant_closed_monday;
        else if (rand > 0.33) selectedPattern = patterns.restaurant_closed_sunday;
        else selectedPattern = patterns.restaurant_split;
    } else if (jobType.includes('Istruttore') || jobType.includes('Terapista')) {
        selectedPattern = patterns.fulltime_6days;
    } else {
        // Default: Lun-Ven
        selectedPattern = patterns.office;
    }
    
    // Se il numero di giorni non corrisponde, adatta
    if (selectedPattern.length > totalDays) {
        selectedPattern = selectedPattern.slice(0, totalDays);
    } else if (selectedPattern.length < totalDays) {
        // Aggiungi giorni mancanti
        const available = dayNumbers.filter(d => !selectedPattern.includes(d));
        while (selectedPattern.length < totalDays && available.length > 0) {
            selectedPattern.push(available.shift());
        }
    }
    
    // Ordina i giorni
    selectedPattern.sort((a, b) => a - b);
    
    return {
        numbers: selectedPattern,
        names: selectedPattern.map(n => dayNames[n - 1])
    };
}

// Override della funzione generateJobListings
const originalGenerateJobListings = window.generateJobListings;
if (typeof originalGenerateJobListings === 'function') {
    window.generateJobListings = function() {
        const jobs = originalGenerateJobListings.call(this);
        
        // Aggiungi giorni specifici a ogni lavoro
        jobs.forEach(job => {
            const workDays = generateWorkDays(job.name, job.daysPerWeek || 5);
            job.workDays = workDays.numbers;
            job.workDayNames = workDays.names;
        });
        
        return jobs;
    };
    
    console.log('✅ Sistema giorni lavorativi specifici attivato');
}

// Override della funzione che mostra le offerte di lavoro per includere i giorni
const originalShowJobSearchDialog = window.showJobSearchDialog;
if (typeof originalShowJobSearchDialog === 'function') {
    window.showJobSearchDialog = function(method) {
        // Chiama la funzione originale
        originalShowJobSearchDialog.call(this, method);
        
        // Modifica il dialogo per mostrare i giorni specifici
        setTimeout(() => {
            const jobCards = document.querySelectorAll('[style*="grid-template-columns: 1fr 1fr"]');
            jobCards.forEach((card, index) => {
                // Trova il div con orario e aggiungi i giorni
                const parentCard = card.closest('[style*="padding:14px"]');
                if (parentCard && window.game && window.game.jobListings) {
                    const jobId = parentCard.querySelector('button')?.getAttribute('onclick')?.match(/'([^']+)'/)?.[1];
                    const job = window.game.jobListings.find(j => j.id === jobId);
                    
                    if (job && job.workDayNames) {
                        // Aggiungi info giorni lavorativi
                        const daysInfo = document.createElement('div');
                        daysInfo.style.cssText = 'grid-column: 1 / -1; font-size: 0.85rem; padding: 8px; background: rgba(102,126,234,0.15); border-radius: 6px; margin-top: 8px;';
                        daysInfo.innerHTML = `📅 <strong>Giorni lavorativi:</strong> ${job.workDayNames.join(', ')}`;
                        card.appendChild(daysInfo);
                    }
                }
            });
        }, 100);
    };
}

// Override della funzione che accetta un lavoro per memorizzare i giorni nell'agenda
const originalStartJobInterview = window.startJobInterview;
if (typeof originalStartJobInterview === 'function') {
    window.startJobInterview = function(jobId) {
        originalStartJobInterview.call(this, jobId);
        
        // Memorizza i giorni lavorativi quando viene accettato il lavoro
        const job = window.game.jobListings.find(j => j.id === jobId);
        if (job && job.workDays && window.game.workData) {
            window.game.workData.workDays = job.workDays;
            window.game.workData.workDayNames = job.workDayNames;
            console.log('📅 Giorni lavorativi memorizzati:', job.workDayNames);
        }
    };
}

// Funzione per verificare se oggi è un giorno lavorativo
window.isWorkDay = function() {
    if (!window.game || !window.game.time || !window.game.workData) return false;
    
    const currentDay = window.game.time.day;
    const dayOfWeek = ((currentDay - 1) % 7) + 1; // 1-7 (Lun-Dom)
    
    if (window.game.workData.workDays) {
        return window.game.workData.workDays.includes(dayOfWeek);
    }
    
    // Fallback: Lun-Ven
    return dayOfWeek >= 1 && dayOfWeek <= 5;
};

// Funzione per creare appuntamenti lavorativi automatici quando si accetta un lavoro
window.createWorkSchedule = function(job) {
    if (!window.game || !window.game.agenda || !job) return;
    
    const currentDay = window.game.time.day;
    const workDays = job.workDays || [1, 2, 3, 4, 5];
    const workHours = job.hours || { start: 9, end: 17 };
    
    // Crea appuntamenti per i prossimi 30 giorni
    for (let futureDay = currentDay; futureDay <= currentDay + 30; futureDay++) {
        const dayOfWeek = ((futureDay - 1) % 7) + 1;
        
        if (workDays.includes(dayOfWeek)) {
            const appointment = {
                day: futureDay,
                hour: workHours.start,
                minute: 0,
                type: 'work',
                title: `Lavoro: ${job.name}`,
                description: `Turno dalle ${workHours.start}:00 alle ${workHours.end}:00 presso ${job.location}`,
                location: job.location,
                jobId: job.id,
                recurring: true
            };
            
            // Verifica se non esiste già
            const exists = window.game.agenda.appointments.some(a => 
                a.day === appointment.day && 
                a.hour === appointment.hour && 
                a.type === 'work'
            );
            
            if (!exists) {
                window.game.agenda.appointments.push(appointment);
            }
        }
    }
    
    console.log('📅 Calendario lavorativo creato per i prossimi 30 giorni');
    
    // Aggiorna UI agenda se disponibile
    if (typeof window.renderAgenda === 'function') {
        window.renderAgenda();
    }
};

// Override della funzione di accettazione lavoro per creare automaticamente il calendario
const originalAcceptJob = window.acceptJob;
if (typeof originalAcceptJob === 'function') {
    window.acceptJob = function(jobId) {
        const result = originalAcceptJob.call(this, jobId);
        
        // Crea calendario lavorativo
        const job = window.game.jobListings.find(j => j.id === jobId);
        if (job && window.game.workData) {
            setTimeout(() => {
                createWorkSchedule(job);
                
                if (typeof window.showNotification === 'function') {
                    window.showNotification(
                        `📅 Calendario lavorativo creato! Lavorerai: ${job.workDayNames.join(', ')}`,
                        4000
                    );
                }
            }, 500);
        }
        
        return result;
    };
}

// Aggiungi indicatore visuale nell'agenda per i giorni lavorativi
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        const agendaTab = document.getElementById('agendaTabContent');
        if (agendaTab && window.game && window.game.workData && window.game.workData.workDayNames) {
            // Aggiungi banner con giorni lavorativi in alto all'agenda
            const workDaysBanner = document.createElement('div');
            workDaysBanner.id = 'workDaysBanner';
            workDaysBanner.style.cssText = `
                padding: 12px;
                background: linear-gradient(135deg, rgba(102,126,234,0.2), rgba(118,75,162,0.2));
                border-radius: 10px;
                border: 2px solid rgba(102,126,234,0.4);
                margin-bottom: 16px;
                text-align: center;
            `;
            workDaysBanner.innerHTML = `
                <div style="font-size: 0.9rem; opacity: 0.9; margin-bottom: 4px;">💼 I tuoi giorni lavorativi</div>
                <div style="font-size: 1.1rem; font-weight: bold;">${window.game.workData.workDayNames.join(' • ')}</div>
            `;
            
            // Inserisci all'inizio dell'agenda
            const firstElement = agendaTab.firstElementChild;
            if (firstElement) {
                agendaTab.insertBefore(workDaysBanner, firstElement.nextSibling);
            }
        }
    }, 2000);
});

// Aggiorna il banner quando cambi lavoro
window.updateWorkDaysBanner = function() {
    const banner = document.getElementById('workDaysBanner');
    if (banner && window.game && window.game.workData && window.game.workData.workDayNames) {
        banner.querySelector('div:last-child').innerHTML = window.game.workData.workDayNames.join(' • ');
    }
};

console.log('✅ Sistema giorni lavorativi specifici caricato!');
