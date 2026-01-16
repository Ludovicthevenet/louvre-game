// ==========================================
// 1. SOLUTIONS DU JEU (MISES À JOUR)
// ==========================================
const solutions = {
    "enigme1": { couleur: "NOIR", password: "STYLET" },
    "enigme2": { couleur: "BLEU", password: "5" },
    "enigme3": { couleur: "ROSE", password: "GAUCHE" },
    "enigme4": { couleur: "BLANC", password: "PLUME" },
    "enigme5": { couleur: "ORANGE", password: "4" },
    "enigme6": { couleur: "VERT", password: "DISQUE" },
    "enigme7": { couleur: "ROUGE", password: "POUTRE" },
    "enigme8": { couleur: "OR", password: "5" },
    "enigme9": { couleur: "ROUGE", password: "PERLE" },
    "enigme10": { couleur: "VERT", password: "MOUSTACHE" }
};

// ==========================================
// 2. LOGIQUE PRINCIPALE
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const pageType = document.body.dataset.page;

    // --- PAGES D'ÉNIGMES ---
    if (pageType === 'enigme') {
        const enigmeId = document.body.dataset.enigmaid;
        const btnValider = document.getElementById('validateButton');
        const btnSuivant = document.getElementById('nextEnigmeButton');
        const feedback = document.getElementById('feedback');

        // Restaurer si déjà résolu
        if (localStorage.getItem(enigmeId + "_solved") === "true") {
            feedback.textContent = "Énigme déjà résolue !";
            feedback.className = "correct";
            btnSuivant.disabled = false;
        }

        btnValider.addEventListener('click', () => {
            const couleurSaisie = document.getElementById('couleurInput').value.trim().toUpperCase();
            const passSaisi = document.getElementById('passwordInput').value.trim().toUpperCase();

            if (couleurSaisie === solutions[enigmeId].couleur && passSaisi === solutions[enigmeId].password) {
                feedback.textContent = "Correct ! Vous avez déchiffré le secret.";
                feedback.className = "correct";
                btnSuivant.disabled = false;
                localStorage.setItem(enigmeId + "_solved", "true");
            } else {
                feedback.textContent = "Réponse incorrecte, observez mieux l'œuvre...";
                feedback.className = "incorrect";
                btnSuivant.disabled = true;
            }
        });

        btnSuivant.addEventListener('click', () => {
            const currentNum = parseInt(enigmeId.replace('enigme', ''));
            if (currentNum < 10) {
                window.location.href = `enigme${currentNum + 1}.html`;
            } else {
                window.location.href = 'fin_de_jeu.html';
            }
        });
    }

    // --- PAGE D'INTRODUCTION ---
    if (pageType === 'intro') {
        document.getElementById('startButton').addEventListener('click', () => {
            localStorage.clear();
            window.location.href = 'enigme1.html';
        });
    }

    // --- PAGE DE FIN (SCORE) ---
    if (pageType === 'fin') {
        let score = 0;
        const recap = document.getElementById('recapContainer');
        const labels = [
            "Gudea l'Architecte", "Ebih-Il l'Intendant", "Le Sphinx de Tanis", 
            "Le Duc de Guise", "Sarcophage des Époux", "L'Athlète en bronze", 
            "Le Radeau de la Méduse", "Anne de Clèves", "L'épouse de Hermanus Amija", 
            "Autoportrait de Delacroix"
        ];
        
        for (let i = 1; i <= 10; i++) {
            if (localStorage.getItem('enigme' + i + '_solved') === "true") {
                score++;
                recap.innerHTML += `<div class="recap-item">Énigme ${i} (${labels[i-1]}) : ✅</div>`;
            } else {
                recap.innerHTML += `<div class="recap-item">Énigme ${i} : ❌</div>`;
            }
        }
        document.getElementById('finalScore').textContent = score + " / 10";
    }
});

// Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js');
}
