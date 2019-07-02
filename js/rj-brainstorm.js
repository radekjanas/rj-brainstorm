(function() {
    "use strict";

    const header = document.querySelector('header');
    const main = document.querySelector('main');
    const content = document.querySelectorAll('header, main');
    const doc = document.documentElement;
    let phraseArr = [];
    let accepted = [];
    let brainstormTitle = '';

    // Saving arrays, title on unload
    window.addEventListener('unload', function () {
        if (phraseArr.length !== 0) {
            localStorage.setItem('phraseArr', JSON.stringify(phraseArr));
        }
        if (accepted.length !== 0) {
            localStorage.setItem('accepted', JSON.stringify(accepted));
        }
        if (brainstormTitle !== '') {
            localStorage.setItem('title', brainstormTitle);
        }
    });

    // Hiding content
    function hideContent() {
        for (let i = content.length; i--; ) {
            aUtils.addClass(content[i], 'hide');
        }
    }

    // Show content
    function showContent() {
        for (let i = content.length; i--; ) {
            aUtils.removeClass(content[i], 'hide');
        }
    }

    function showWelcomeScreen() {
        hideContent();

        setTimeout(function() {
            // Creating static content
            const staticContent = document.createDocumentFragment();
            const innerContent = document.createElement('div');
            innerContent.classList.add('welcome-container');
            innerContent.innerHTML = '<div class="logo-container"><i class="fa fa-bolt"></i></div>';
            innerContent.innerHTML += '<div class="app-title"><h1>Burza mózgów</h1></div>';
            innerContent.innerHTML += '<div class="app-subtitle"><h2>Brak kartki i długopisu? Przeprowadź burzę mózgów na ekranie swojego urządzenia!</h2></div>'

            // Creating "Start new" button
            const startNewBtnOuter = document.createElement('div');
            startNewBtnOuter.classList.add('begin-new-brainstorm');
            const startNewBtn = document.createElement('button');
            startNewBtn.classList.add('start-new');
            startNewBtn.textContent = 'Rozpocznij nową sesję';
            startNewBtnOuter.appendChild(startNewBtn);

            // Creating "Continue previous" button if previous data is detected
            let continueBtnOuter, continueBtn;
            if (localStorage.getItem('phraseArr') !== null || localStorage.getItem('title') !== null) {
                continueBtnOuter = document.createElement('div');
                continueBtnOuter.classList.add('continue-brainstorm');
                continueBtn = document.createElement('button');
                continueBtn.classList.add('continue');
                if (localStorage.getItem('title').length > 30) {
                    continueBtn.textContent = `Kontynuuj poprzednią sesję: "${(localStorage.getItem('title')).slice(0,30)}..."`;
                } else {
                    continueBtn.textContent = `Kontynuuj poprzednią sesję: "${localStorage.getItem('title')}"`;
                }
                continueBtnOuter.appendChild(continueBtn);
            }

            // Appending content
            staticContent.appendChild(innerContent);
            main.appendChild(staticContent);
            main.appendChild(startNewBtnOuter);
            if (localStorage.getItem('phraseArr') !== null || localStorage.getItem('title') !== null) main.appendChild(continueBtnOuter);
            showContent();

            // Adding action to a button
            startNewBtn.addEventListener('click', showBeginScreen);
            if (continueBtn) {
                    continueBtn.addEventListener('click', function() {
                        if (localStorage.getItem('accepted') !== null) {
                            phraseArr = JSON.parse(localStorage.getItem('phraseArr'));
                            accepted = JSON.parse(localStorage.getItem('accepted'));
                            showPhraseChooser();
                        } else if (localStorage.getItem('phraseArr') !== null) {
                            phraseArr = JSON.parse(localStorage.getItem('phraseArr'));
                            showPhraseInput();
                        } else if (localStorage.getItem('title') !== '') {
                            brainstormTitle = localStorage.getItem('title');
                            showBeginScreen();
                        }
                    });
            }
        }, 300);
    }

    function showBeginScreen() {
        // If user starts completely new session, clear local storage
        if (aUtils.hasClass(this, 'start-new')) {
            localStorage.clear();
        }
        hideContent();

        setTimeout(function() {
            // Clearing content of main
            main.innerHTML = '';

            // Scroll page to the top
            doc.scrollTop = 0;

            // Creating static content
            const staticContent = document.createDocumentFragment();
            const innerContent = document.createElement('div');
            innerContent.innerHTML = '<section><div class="number"><p>1</p></div><p class="step-info">Po kliknięciu w&nbsp;przycisk "Rozpocznij" przejdziesz do pierwszego etapu Burzy mózgów. Aplikacja poprosi o&nbsp;wpisanie tytułu/myśli przewodniej Burzy Mózgów. Po zatwierdzeniu zobaczysz pustą stronę z&nbsp;polem, w&nbsp;którym możesz wpisywać kolejne wyrazy/sentencje podawane przez uczestników Burzy Mózgów. Aplikacja poinformuje Cię jeśli będziesz próbował wprowadzić wyraz lub sentencję, która&nbsp;już istnieje.</p></section>';
            innerContent.innerHTML += '<section><div class="number"><p>2</p></div><p class="step-info">Kolejny etap Burzy Mózgów polega na wspólnej selekcji wyrazów/sentencji w&nbsp;celu wyłonienia tych najbardziej odpowiednich, które&nbsp;mogą być finalnie brane pod uwagę. Mechanizm aplikacji pozwoli na przeglądanie kolejnych wyrazów/sentencji wyłonionych w&nbsp;etapie pierwszym i&nbsp;oznaczanie ich jako użyteczne lub nieużyteczne.</p></section>';
            innerContent.innerHTML += '<section><div class="number"><p>3</p></div><p class="step-info">Ostatni etap działania aplikacji wyświetla wszystkie wyselekcjonowane wyrazy/sentencje i&nbsp;umożliwia pobranie wyników do pliku tekstowego.</p></section>';
            innerContent.innerHTML += '<div class="warning"><p><span>Uwaga!</span>Działanie aplikacji odbywa się tylko i&nbsp;wyłącznie z&nbsp;poziomu Twojej przeglądarki. Jeśli w&nbsp;trakcie działania aplikacji odświeżysz stronę lub zamkniesz przeglądarkę, utracisz wszystkie dotychczasowe wyniki</p></div>';
            innerContent.innerHTML += '<div class="brainstorm-title"><input type="text"><button class="accept-title">Zapisz</button><button class="change-title">Zmień</button></div>';

            // Creating no title info panel
            const noTitle = document.createElement('p');
            noTitle.classList.add('no-title');
            noTitle.textContent = 'Nie wybrano tematu';

            // Creating start button
            const startBtn = document.createElement('button');
            startBtn.className = 'begin-brainstorm';
            startBtn.textContent = 'Rozpocznij';

            // Appending content
            header.innerHTML = '<h1>Jak działa aplikacja?</h1><!--<div class="circle"></div>-->';
            staticContent.appendChild(innerContent);
            main.appendChild(startBtn);
            main.appendChild(noTitle);
            main.appendChild(staticContent);
            showContent();

            // Buffer elements belonging to this stage of brainstorm
            const titleInput = document.querySelector('.brainstorm-title input');
            const saveTitleBtn = document.querySelector('.accept-title');
            const changeTitleBtn = document.querySelector('.change-title');

            // Adding title to input (if available from previous session)
            if (brainstormTitle !== '') {
                titleInput.value = brainstormTitle;
                titleInput.disabled = true;
                saveTitleBtn.disabled = true;
                changeTitleBtn.disabled = false;
                aUtils.addClass(startBtn, 'show');
            } else {
                saveTitleBtn.disabled = 'true';
                changeTitleBtn.disabled = true;
            }

            // Adding action to a button
            startBtn.addEventListener('click', showPhraseInput);

            function saveTitle() {
                if (titleInput.value !== '') {
                    aUtils.removeClass(noTitle, 'show');
                    aUtils.addClass(startBtn, 'show');
                    saveTitleBtn.disabled = true;
                    titleInput.disabled = true;
                    changeTitleBtn.disabled = false;
                    brainstormTitle = titleInput.value;
                } else {
                    aUtils.addClass(noTitle, 'show');
                    aUtils.removeClass(startBtn, 'show');
                }
            }

            function insertingText() {
                if (this.value !== '') {
                    saveTitleBtn.disabled = false;
                    aUtils.removeClass(noTitle, 'show');
                } else {
                    saveTitleBtn.disabled = true;
                    aUtils.addClass(noTitle, 'show');
                }
            }

            function changingTitle() {
                if (aUtils.hasClass(startBtn, 'show')) {
                    aUtils.removeClass(startBtn, 'show');
                }
                this.disabled = true;
                titleInput.disabled = false;
                saveTitleBtn.disabled = false;
                titleInput.focus();
            }

            // Add action to save title button
            titleInput.addEventListener('keyup', insertingText);
            titleInput.addEventListener('paste', insertingText);
            titleInput.addEventListener('change', insertingText);
            saveTitleBtn.addEventListener('click', saveTitle);
            changeTitleBtn.addEventListener('click', changingTitle);
        }, 300);
    }

    function showPhraseInput() {
        hideContent();
        console.log(phraseArr);

        setTimeout(function() {
            // Add listeners to phrases in container
            function addListeners() {
                const phrases = document.querySelectorAll('.phrase-block');
                for (let i = phrases.length; i--; ) {

                    // Shake when hovered on delete button
                    phrases[i].querySelector('i').addEventListener('mouseover', function() {
                        aUtils.addClass(this.nextElementSibling, 'shake');
                    });

                    // Stop shaking when mouseout from delete button
                    phrases[i].querySelector('i').addEventListener('mouseout', function() {
                        aUtils.removeClass(this.nextElementSibling, 'shake');
                    });

                    // Deleting phrase
                    phrases[i].querySelector('i').addEventListener('click', function() {
                        // Get phrase to delete from array
                        const delPhrase = this.nextElementSibling.textContent;

                        // Delete phrase from array
                        phraseArr.splice(phraseArr.indexOf(delPhrase), 1);

                        // Hiding phrase in container
                        aUtils.addClass(this.parentNode, 'disappear');
                        setTimeout(() => {
                            aUtils.addClass(this.parentNode, 'rejected');
                        }, 300);

                        // Show/hide "to chooser" button
                        toChooser(phraseArr.length, chooserBtn);
                    });
                }
            }

            // Show/hide "To chooser" button
            function toChooser(arrlength, panel) {
                if (arrlength === 0) {
                    if (aUtils.hasClass(panel, 'show')) {
                        aUtils.removeClass(panel, 'show');
                    }
                } else if (arrlength > 0) {
                    if (!aUtils.hasClass(panel, 'show')) {
                        aUtils.addClass(panel, 'show');
                    }
                }
            }

            // Clearing content of main and adding new class to main
            main.innerHTML = '';
            aUtils.addClass(main, 'phrase-container');

            // Scroll page to the top
            doc.scrollTop = 0;

            // Creating static content
            const staticContent = document.createDocumentFragment();
            const innerContent = document.createElement('div');
            innerContent.innerHTML = '<h2>Wprowadź hasła</h2><p class="step-desc">Wprowadź teraz po kolei hasła zgłaszane przez uczestników burzy mózgów<br>Wyświetlą się one poniżej</p>';
            innerContent.innerHTML += '<form method="get"><input class="phrase-input" type="text"><input class="phrase-submit" type="submit" value="Dodaj"><p class="error-block"><span>Podana fraza już istnieje</span></p></form>';

            // Creating button
            const toChooserBtn = document.createElement('button');
            toChooserBtn.className = 'to-chooser';
            toChooserBtn.textContent = 'Przejdź do oceny fraz';

            // Appending content
            header.innerHTML = '';
            staticContent.appendChild(innerContent);
            header.appendChild(toChooserBtn);
            header.appendChild(staticContent);
            showContent();

            // Adding action to a button
            toChooserBtn.addEventListener('click', showPhraseChooser);

            // Buffer elements belonging to this stage of brainstorm
            const buttonAdd = document.querySelector('.phrase-submit');
            const inputAdd = document.querySelector('.phrase-input');
            const errorBlock = document.querySelector('.error-block');
            const chooserBtn = document.querySelector('.to-chooser');

            for (let i = phraseArr.length; i--; ) {
                main.innerHTML += `<p class="phrase-block"><i class="fa fa-times"></i><span class="phrase">${phraseArr[i]}</span></p>`;
            }
            // Show/hide "to chooser" button
            toChooser(phraseArr.length, chooserBtn);
            // Add listeners
            addListeners()

            // Adding action to a button
            buttonAdd.addEventListener('click', function(e) {

                // Prevents form from sending
                e.preventDefault();

                // Buffer actual phrases (before adding new)
                const exiPhrases = document.querySelectorAll('.phrase-block:not(.disappear)');

                // Add phrase
                let phrase = '';
                if (inputAdd.value !== '') {
                    phrase = inputAdd.value;
                } else {
                    if (aUtils.hasClass(errorBlock, 'show')) {
                        // Hiding error box when input is empty
                        aUtils.removeClass(errorBlock, 'show');
                    }
                    this.previousElementSibling.focus();
                    return;
                }

                // Check if phrase already exist and show/hide error info
                for (let i = exiPhrases.length; i--; ) {
                    if (phrase === exiPhrases[i].textContent) {
                        aUtils.addClass(errorBlock, 'show');
                        this.previousElementSibling.focus();
                        return;
                    } else {
                        // Hiding error box
                        aUtils.removeClass(errorBlock, 'show');
                    }
                }

                // Add phrase to phrase container and array
                main.innerHTML += `<p class="phrase-block"><i class="fa fa-times"></i><span class="phrase">${phrase}</span></p>`;
                phraseArr.push(phrase);

                // Clear input value and focus (to make it easier to add new phrases)
                this.previousElementSibling.value = '';
                this.previousElementSibling.focus();

                // Show/hide "to chooser" button
                toChooser(phraseArr.length, chooserBtn);

                // Add listeners to delete button in every phrase in container
                addListeners();
            });
        }, 300);
    }

    function showPhraseChooser() {
        hideContent();

        setTimeout(function() {
            // Show/hide save button and no result button
            function toggleSaveBtn() {
                if ((accepted.length === allPhrasesCount) && (!accepted.includes(undefined)) && (!accepted.includes(null))) {
                    if (accepted.indexOf(true) > -1) {
                        if (!aUtils.hasClass(saveResultBtn, 'show')) {
                            aUtils.addClass(saveResultBtn, 'show');
                        }

                        if (aUtils.hasClass(noResult, 'show')) {
                            aUtils.removeClass(noResult, 'show');
                        }
                    } else  {
                        if (aUtils.hasClass(saveResultBtn, 'show')) {
                            aUtils.removeClass(saveResultBtn, 'show');
                        }

                        if (!aUtils.hasClass(noResult, 'show')) {
                            aUtils.addClass(noResult, 'show');
                        }
                    }
                }
            }

            // Clearing content of main and header, adding new class to main
            header.innerHTML = '';
            main.innerHTML = '';
            aUtils.removeClass(main, 'phrase-container');
            aUtils.addClass(main, 'chooser-container');

            // Scroll page to the top
            doc.scrollTop = 0;

            // Creating button
            const saveResultBtn = document.createElement('button');
            saveResultBtn.classList.add('get-result');
            saveResultBtn.textContent = 'Pobierz wyniki';

            // Creating no result info panel
            const noResult = document.createElement('p');
            noResult.classList.add('no-result');
            noResult.textContent = 'Nie zaakceptowano żadnego hasła';

            // Creating static content
            const staticContent = document.createDocumentFragment();
            const innerContent = document.createElement('div');
            innerContent.innerHTML = '<h2>Wybierz najlepsze frazy</h2><p class="step-desc subtitle">Przeglądnij wszystkie frazy i oznacz te najlepsze<br>Wybrane frazy można pobrać przyciskiem "Pobierz"</p>';

            // Appending content
            staticContent.appendChild(innerContent);
            header.appendChild(saveResultBtn);
            header.appendChild(noResult);
            header.appendChild(staticContent);
            main.innerHTML = '<div class="phrase-marks"><div class="counter"><p><span class="actual"></span>/<span class="all"></span></p></div><div class="marks"><div class="phrase-accepted"><i class="fa fa-check"></i></div><div class="phrase-rejected"><i class="fa fa-times"></i></div></div></div>';
            main.innerHTML += '<div class="phrase-presentation"><div class="phrase-nav left-nav"><i class="fa fa-caret-left"></i></div><div class="phrase-box"><p></p></div><div class="phrase-nav right-nav"><i class="fa fa-caret-right"></i></div></div>';
            showContent();

            // Buffer chooser nodes
            const phraseBox = document.querySelector('.phrase-box p');
            const allPhrasesCount = phraseArr.length;
            const actual = document.querySelector('.actual');
            const all = document.querySelector('.all');
            const acceptBtn = document.querySelector('.phrase-accepted i');
            const rejectBtn = document.querySelector('.phrase-rejected i');
            const left = document.querySelector('.left-nav i');
            const right = document.querySelector('.right-nav i');

            // Set accepted/rejected for first phrase (when continuing previous brainstorm)
            if (accepted[0] !== undefined) {
                if (accepted[0] === true) {
                    aUtils.addClass(acceptBtn.parentNode, 'checked');
                } else if (accepted[0] === false) {
                    aUtils.addClass(rejectBtn.parentNode, 'checked');
                }
            }
            toggleSaveBtn();

            // Put values to chooser elements
            phraseBox.textContent = phraseArr[0];
            actual.textContent = 1;
            all.textContent = allPhrasesCount;

            // Add action when navigating left
            left.addEventListener('click', function() {
                if (actual.textContent <= 1) {
                    return;
                } else {
                    aUtils.removeClass(acceptBtn.parentNode, 'checked');
                    aUtils.removeClass(rejectBtn.parentNode, 'checked');

                    actual.textContent--
                    phraseBox.textContent = phraseArr[actual.textContent - 1];

                    if (accepted[actual.textContent -1] === true) {
                        aUtils.addClass(acceptBtn.parentNode, 'checked');
                    } else if (accepted[actual.textContent -1] === false) {
                        aUtils.addClass(rejectBtn.parentNode, 'checked');
                    }
                }
            });

            // Add action when navigating right
            right.addEventListener('click', function() {
                if (actual.textContent >= allPhrasesCount) {
                    return;
                } else {
                    aUtils.removeClass(acceptBtn.parentNode, 'checked');
                    aUtils.removeClass(rejectBtn.parentNode, 'checked');

                    actual.textContent++
                    phraseBox.textContent = phraseArr[actual.textContent - 1];

                    if (accepted[actual.textContent -1] === true) {
                        aUtils.addClass(acceptBtn.parentNode, 'checked');
                    } else if (accepted[actual.textContent -1] === false) {
                        aUtils.addClass(rejectBtn.parentNode, 'checked');
                    }
                }
            });

            // Add action when accepting phrase
            acceptBtn.addEventListener('click', function() {
                if (!aUtils.hasClass(this.parentNode, 'checked')) {
                    accepted[actual.textContent -1] = true;
                    aUtils.addClass(this.parentNode, 'checked');
                }

                if (aUtils.hasClass(rejectBtn.parentNode, 'checked')) {
                    aUtils.removeClass(rejectBtn.parentNode, 'checked');
                }

                toggleSaveBtn();
            });

            // Add action when rejecting phrase
            rejectBtn.addEventListener('click', function() {
                if (!aUtils.hasClass(this.parentNode, 'checked')) {
                    accepted[actual.textContent - 1] = false;
                    aUtils.addClass(this.parentNode, 'checked');
                }

                if (aUtils.hasClass(acceptBtn.parentNode, 'checked')) {
                    aUtils.removeClass(acceptBtn.parentNode, 'checked');
                }

                toggleSaveBtn();
            });

            // Add action when clicking on save button
            saveResultBtn.addEventListener('click', function() {
                const result = [];

                for (let i = 0; i < allPhrasesCount; i++) {
                    if (accepted[i] === true) {
                        result.push(phraseArr[i]);
                    }
                }

                let csv = 'data:text/csv;charset=utf-8,';
                result.forEach(function(row){
                    csv += '\uFEFF';        // Add BOM to show non-english characters properly
                    csv += row;
                    csv += '\r\n';
                });

                const encodedUri = encodeURI(csv);
                const hiddenElement = document.createElement('a');
                hiddenElement.href = encodeURI(csv);
                hiddenElement.target = '_blank';
                hiddenElement.download = 'brainstorm-result.csv';
                document.body.appendChild(hiddenElement);
                hiddenElement.click();
                hiddenElement.parentNode.removeChild(hiddenElement);
            });
        }, 300);
    }

    showWelcomeScreen();
})();
