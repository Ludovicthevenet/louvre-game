// ==========================================
// 1. SOLUTIONS DU JEU
// ==========================================
const solutions = {
    "enigme1": { couleur: "NOIR", password: "2" },
    "enigme2": { couleur: "BLEU", password: "5" },
    "enigme3": { couleur: "ROSE", password: "3" },
    "enigme4": { couleur: "ORANGE", password: "PATTE DE LION" },
    "enigme5": { couleur: "VERT", password: "TASSE" },
    "enigme6": { couleur: "ROUGE", password: "2" },
    "enigme7": { couleur: "VERT-DE-GRIS", password: "DISQUE" },
    "enigme8": { couleur: "ROUGE", password: "CHIMERE" },
    "enigme9": { couleur: "OR", password: "DRAGON" },
    "enigme10": { couleur: "ROUGE", password: "4" }
};

// ==========================================
// 2. LOGIQUE PRINCIPALE AU CHARGEMENT
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // On récupère le type de page grâce à l'attribut data-page du body
    const pageType = document.body.dataset.page;

    // --- LOGIQUE POUR LES PAGES D'ÉNIGMES ---
    if (pageType === 'enigme') {
        const enigmeId = document.body.dataset.enigmaid;
        const btnValider = document.getElementById('validateButton');
        const btnSuivant = document.getElementById('nextEnigmeButton');
        const feedback = document.getElementById('feedback');

        // Au clic sur VALIDER
        btnValider.addEventListener('click', () => {
            const couleurSaisie = document.getElementById('couleurInput').value.trim().toUpperCase();
            const passSaisi = document.getElementById('passwordInput').value.trim().toUpperCase();

            if (couleurSaisie === solutions[enigmeId].couleur && passSaisi === solutions[enigmeId].password) {
                // Succès
                feedback.textContent = "Correct ! Le secret est révélé.";
                feedback.style.color = "green";
                btnSuivant.disabled = false; // On débloque le bouton suivant
                localStorage.setItem(enigmeId + "_solved", "true"); // On enregistre la réussite
            } else {
                // Échec
                feedback.textContent = "Réponse incorrecte, observez mieux l'œuvre...";
                feedback.style.color = "red";
                btnSuivant.disabled = true;
            }
        });

        // Au clic sur ÉNIGME SUIVANTE
        btnSuivant.addEventListener('click', () => {
            const currentNum = parseInt(enigmeId.replace('enigme', ''));
            if (currentNum < 10) {
                // On va à l'énigme suivante (ex: enigme2.html)
                window.location.href = 'enigme' + (currentNum + 1) + '.html';
            } else {
                // Si c'est la 10, on va à la fin
                window.location.href = 'fin_de_jeu.html';
            }
        });
    }

    // --- LOGIQUE POUR LA PAGE D'INTRODUCTION ---
    if (pageType === 'intro') {
        const startButton = document.getElementById('startButton');
        if (startButton) {
            startButton.addEventListener('click', () => {
                // On vide la mémoire pour recommencer à zéro
                localStorage.clear();
                window.location.href = 'enigme1.html';
            });
        }
    }

    // --- LOGIQUE POUR LA PAGE DE FIN (COMPTAGE DES POINTS) ---
    if (pageType === 'fin') {
        let score = 0;
        const recap = document.getElementById('recapContainer');
        
        // On vérifie chaque énigme dans la mémoire du téléphone
        for (let i = 1; i <= 10; i++) {
            if (localStorage.getItem('enigme' + i + '_solved') === "true") {
                score++;
                recap.innerHTML += `<p style="color: green;">Énigme ${i} : Découverte ✅</p>`;
            } else {
                recap.innerHTML += `<p style="color: red;">Énigme ${i} : Manquée ❌</p>`;
            }
        }
        // Affichage du score final
        const scoreElement = document.getElementById('finalScore');
        if (scoreElement) {
            scoreElement.textContent = score + " / 10";
        }
    }
});

// ==========================================
// 3. ENREGISTREMENT DU MODE HORS-LIGNE (PWA)
// ==========================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js') // Ajout du ./ ici
            .then(reg => console.log('Majordome enregistré !'))
            .catch(err => console.log('Erreur de Majordome', err));
    });
}
