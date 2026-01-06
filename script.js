// --- PARTIE 1 : Enregistrement du Service Worker (pour la PWA) ---
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then(registration => {
            console.log('Service Worker enregistré avec succès !', registration);
          })
          .catch(registrationError => {
            console.log('Échec de l\'enregistrement du Service Worker : ', registrationError);
          });
      });
    }

    // --- PARTIE 2 : Logique du Jeu ---

    const solutions = {
        // Enigme 1: Salle 229 - Mésopotamie, Sumer (Gudea)
        "enigme1": {
            couleur: "NOIR", // Couleur de la diorite / basalte
            password: "2" // Numéro du paragraphe
        },
        // Enigme 2: Salle 231 - Mésopotamie, Sumer (Ebih-Il)
        "enigme2": {
            couleur: "BLEU", // Couleur de la pierre des pupilles
            password: "5" // Nombre de tresses/mèches de barbe de chaque côté
        },
        // Enigme 3: Crypte du Sphinx - Niveau 0, Aile Denon, Salle 338 (Sphinx)
        "enigme3": {
            couleur: "ROSE", // Couleur du granit rose
            password: "3" // Nombre de lignes du collier/coiffe
        },
        // Enigme 4: Niveau 0, Aile Denon, Salle 330 (Sarcophage des Époux)
        "enigme4": {
            couleur: "ORANGE", // Couleur de l'argile cuite
            password: "PATTE DE LION" // Motif décorant le bas des pieds
        },
        // Enigme 5: Aile Richelieu, Niveau 1, Salle 809 (Femme âgée épluchant un légume)
        "enigme5": {
            couleur: "VERT", // Couleur du légume (chou)
            password: "TASSE" // Objet cylindrique posé sur la table
        },
        // Enigme 6: Aile Richelieu, Niveau 1, Salle 825 (Portrait d'une dame)
        "enigme6": {
            couleur: "ROUGE", // Couleur du ruban de la coiffe
            password: "2" // Nombre de rangs de perles
        },
        // Enigme 7: Aile Sully, Niveau 1, Salle 415 (Athlète nu en bronze)
        "enigme7": {
            couleur: "VERT-DE-GRIS", // Couleur de la patine du bronze
            password: "DISQUE" // Objet tenu dans la main gauche (sa droite)
        },
        // Enigme 8: Aile Sully, Niveau 1, Salle 419 (Amphore à figures rouges)
        "enigme8": {
            couleur: "ROUGE", // Couleur des figures
            password: "CHIMERE" // Animal mythologique
        },
        // Enigme 9: Aile Denon, Niveau 1, Salle 709 (Galerie d'Apollon - Plafond)
        "enigme9": {
            couleur: "OR", // Couleur dominante de la robe de la "France" ou "Gloire"
            password: "DRAGON" // Animal tirant le char d'Apollon
        },
        // Enigme 10: Aile Denon, Niveau 1, Salle 712 (Portrait équestre)
        "enigme10": {
            couleur: "ROUGE", // Couleur de la plume du cheval
            password: "4" // Nombre de fers à cheval sur le poitrail
        }
    };

    // Fonction pour charger la page suivante ou la page de fin
    function goToNextEnigme(currentEnigmeId) {
        const currentEnigmeNum = parseInt(currentEnigmeId.replace('enigme', ''));
        const nextEnigmeNum = currentEnigmeNum + 1;

        if (nextEnigmeNum <= 10) {
            window.location.href = `enigme${nextEnigmeNum}.html`;
        } else {
            window.location.href = `fin_de_jeu.html`;
        }
    }

    // Fonction pour valider la réponse d'une énigme
    function validateEnigme(enigmeId, couleur, password) {
        const sol = solutions[enigmeId];
        const feedbackElement = document.getElementById('feedback');
        const nextButton = document.getElementById('nextEnigmeButton');

        if (!sol) {
            console.error("Solution non trouvée pour l'énigme :", enigmeId);
            return;
        }

        const isCouleurCorrect = couleur.trim().toUpperCase() === sol.couleur.toUpperCase();
        const isPasswordCorrect = password.trim().toUpperCase() === sol.password.toUpperCase();

        if (isCouleurCorrect && isPasswordCorrect) {
            feedbackElement.textContent = "Correct ! Vous avez résolu l'énigme.";
            feedbackElement.className = 'correct';
            if (nextButton) {
                nextButton.disabled = false;
            }
            // Enregistrer la progression dans localStorage
            localStorage.setItem(`enigme_${enigmeId}_solved`, 'true');
            localStorage.setItem(`enigme_${enigmeId}_couleur`, couleur.trim());
            localStorage.setItem(`enigme_${enigmeId}_password`, password.trim());

        } else {
            let message = "Réponse incorrecte. ";
            if (!isCouleurCorrect) {
                message += "La couleur est fausse. ";
            }
            if (!isPasswordCorrect) {
                message += "Le mot de passe est faux. ";
            }
            feedbackElement.textContent = message.trim();
            feedbackElement.className = 'incorrect';
            if (nextButton) {
                nextButton.disabled = true;
            }
        }
    }

    // Gérer l'événement quand la page est chargée
    document.addEventListener('DOMContentLoaded', () => {
        const body = document.body;
        const pageType = body.dataset.page; // 'intro', 'enigme', 'fin'

        if (pageType === 'enigme') {
            const enigmeId = body.dataset.enigmaid;
            const couleurInput = document.getElementById('couleurInput');
            const passwordInput = document.getElementById('passwordInput');
            const validateButton = document.getElementById('validateButton');
            const nextButton = document.getElementById('nextEnigmeButton');
            const feedbackElement = document.getElementById('feedback');

            if (validateButton && couleurInput && passwordInput && nextButton && feedbackElement) {
                // Restaurer les valeurs si l'énigme a déjà été résolue
                if (localStorage.getItem(`enigme_${enigmeId}_solved`) === 'true') {
                    couleurInput.value = localStorage.getItem(`enigme_${enigmeId}_couleur`) || '';
                    passwordInput.value = localStorage.getItem(`enigme_${enigmeId}_password`) || '';
                    feedbackElement.textContent = "Énigme déjà résolue !";
                    feedbackElement.className = 'correct';
                    nextButton.disabled = false;
                } else {
                    nextButton.disabled = true; // Désactiver par défaut
                }

                validateButton.addEventListener('click', () => {
                    validateEnigme(enigmeId, couleurInput.value, passwordInput.value);
                });

                nextButton.addEventListener('click', () => {
                    goToNextEnigme(enigmeId);
                });

                // Écouteurs pour réactiver le bouton "Valider" si les champs sont modifiés
                couleurInput.addEventListener('input', () => {
                    feedbackElement.textContent = ''; // Effacer le feedback précédent
                    feedbackElement.className = '';
                    if (localStorage.getItem(`enigme_${enigmeId}_solved`) !== 'true') { // Si pas encore résolu
                        nextButton.disabled = true;
                    }
                });
                passwordInput.addEventListener('input', () => {
                    feedbackElement.textContent = ''; // Effacer le feedback précédent
                    feedbackElement.className = '';
                    if (localStorage.getItem(`enigme_${enigmeId}_solved`) !== 'true') { // Si pas encore résolu
                        nextButton.disabled = true;
                    }
                });

            } else {
                console.error("Éléments de l'énigme non trouvés dans le DOM pour :", enigmeId);
            }
        } else if (pageType === 'fin') {
            const recapContainer = document.getElementById('recapContainer');
            if (recapContainer) {
                let score = 0;
                for (let i = 1; i <= 10; i++) {
                    const enigmeId = `enigme${i}`;
                    const isSolved = localStorage.getItem(`${enigmeId}_solved`) === 'true';
                    const couleurSaved = localStorage.getItem(`${enigmeId}_couleur`);
                    const passwordSaved = localStorage.getItem(`${enigmeId}_password`);
                    const enigmeTitle = document.querySelector(`a[href="/${enigmeId}.html"]`)?.textContent || `Énigme ${i}`;

                    if (isSolved) {
                        score++;
                        const sol = solutions[enigmeId];
                        recapContainer.innerHTML += `
                            <div class="recap-item correct">
                                <strong>${enigmeTitle} :</strong> Résolue !
                                <br>Couleur: ${couleurSaved} (Attendue: ${sol.couleur})
                                <br>Mot de passe: ${passwordSaved} (Attendu: ${sol.password})
                            </div>
                        `;
                    } else {
                        recapContainer.innerHTML += `
                            <div class="recap-item incorrect">
                                <strong>${enigmeTitle} :</strong> Non résolue.
                            </div>
                        `;
                    }
                }
                document.getElementById('finalScore').textContent = `${score} / 10`;
            }
        } else if (pageType === 'intro') {
            const startButton = document.getElementById('startButton');
            if (startButton) {
                startButton.addEventListener('click', () => {
                    // Supprimer l'ancien état du jeu si on recommence
                    localStorage.clear();
                    window.location.href = 'enigme1.html';
                });
            }
        }
    });


