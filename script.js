Here's the modified code with the features you requested added:

```javascript
document.addEventListener('DOMContentLoaded', () => {
    const submitButton = document.getElementById('submit');
    const resetButton = document.getElementById('reset');
    const timerDisplay = document.getElementById('timerDisplay');
    const randomizeButton = document.getElementById('randomize');
    const musicSelect = document.getElementById('musicSelect');
    const addTimeButton = document.getElementById('addTime');

    // Create and append the pause/start button
    const pauseStartButton = document.getElementById('pauseStartBtn');

    let timerInterval;
    let musicAudio;
    let isPaused = false;
    let countdownValue;
    let lightInterval;

    // Event Listener for Add Time Button
    addTimeButton.addEventListener('click', () => {
        addTime(15);
    });

    // Function to add 15 seconds to the timer
    function addTime(seconds) {
        countdownValue += seconds;
        updateTimerDisplay();
    }

    // Function to update the timer display
    function updateTimerDisplay() {
        const minutes = Math.floor(countdownValue / 60);
        const seconds = countdownValue % 60;
        timerDisplay.innerText = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    submitButton.addEventListener('click', () => {
        console.log("Submit button clicked");
        run()
    });

    resetButton.addEventListener('click', () => {
        document.getElementById('color').value = '';
        document.getElementById('color1').value = '';
        document.getElementById('color2').value = '';
        document.getElementById('time').value = '';
        document.getElementById('view').value = 'select';
        document.getElementById('countdown').value = '';
        document.getElementById('unit').value = 'unit';
        document.getElementById('sound').value = 'none';
        document.getElementById('music-file').value = '';
        document.getElementById('error').innerText = '';
    });

    pauseStartButton.addEventListener('click', () => {
        if (isPaused) {
            resumeSimulation();
        } else {
            pauseSimulation();
        }
    });


    function startCountdown(duration) {
        countdownValue = duration;
        document.getElementById('musicDropdown').style.display = 'block';
        pauseStartButton.style.display = 'inline-block'; // Show the pause button
        document.querySelector("#reload").style.display = 'inline-block'; // Show the reload button
        addTimeButton.style.display = 'inline-block'; // Show the add time button
        timerDisplay.style.display = 'block';

        timerInterval = setInterval(() => {
            if (!isPaused) {
                let minutes = Math.floor(countdownValue / 60);
                let seconds = Math.floor(countdownValue % 60);

                timerDisplay.textContent = `${pad(minutes)}:${pad(seconds)}`;

                if (--countdownValue < 0) {
                    clearInterval(timerInterval);
                    stopSimulation();
                    timerDisplay.style.display = 'none';
                }
            }
        }, 1000);
    }

    function pad(number) {
        return number.toString().padStart(2, '0');
    }

    function stopSimulation() {
        const replayModelEl = document.getElementById('replayModel');
        replayModelEl.style.display = 'block';
    }

    document.getElementById('replayModelBtn').addEventListener('click', function () {
        const replayModelEl = document.getElementById('replayModel');
        replayModelEl.style.display = 'none';
        run();
    });

    document.getElementById('exitBtn').addEventListener('click', function () {
        window.location.reload();
        run();
    });

    function run() {
        let countdownValue = document.getElementById('countdown').value;
        let n = document.getElementById("color").value;
        let set_time = document.getElementById("time").value;
        let unit = document.getElementById("unit").value;
        let view = document.getElementById("view").value;
        let soundEffect = document.getElementById("sound").value;
        let color1 = document.getElementById('color1').value;
        let color2 = document.getElementById('color2').value;

        // Get selected audio file or URL
        let selectedFile = document.getElementById("music-file").files[0];
        let selectedUrl = document.getElementById("music-url").value;


        if (countdownValue && countdownValue > 0 && Number(n) > 0 && Number.isInteger(Number(n)) && n !== "" && unit !== "unit" && view !== "select" && !(soundEffect !== 'none' && selectedFile) && !(soundEffect !== 'none' && selectedUrl) && !(selectedFile && selectedUrl)) {
            document.getElementById("error").innerHTML = "";
            document.querySelector(".footer").style.display = "none";
            // document.querySelector(".navHeader").style.display = "none";
            document.querySelector(".container").style.display = "none";
            startSimulation(n, set_time, unit, view, color1, color2);
            var backToTopBtn = document.getElementById("backToTopBtn");
            backToTopBtn.style.display = "none";
            startCountdown(countdownValue);

            const modal1 = document.getElementById("infomodal");
            const closeModal1 = document.getElementById("closeModal1");
            const proceedButton1 = document.getElementById("proceed1");

            modal1.style.display = "block";

            closeModal1.onclick = function () {
                modal1.style.display = "none";
            }

            proceedButton1.onclick = function () {
                modal1.style.display = "none";
            }

            window.onclick = function (event) {
                if (event.target == modal1) {
                    modal1.style.display = "none";
                }
            }

            if (soundEffect !== 'none') {

                const audio = document.getElementById(soundEffect);
                audio.loop = true;
                audio.play();
                musicAudio = audio;
            }
            else {
                let selectedAudio;
                if (selectedFile) {
                    // User selected a file
                    selectedAudio = new Audio(URL.createObjectURL(selectedFile));
                } else if (selectedUrl) {
                    // User pasted a URL
                    selectedAudio = new Audio(selectedUrl);

                    // To handle CORS issues, check if the URL is valid and playable
                    selectedAudio.addEventListener("error", (e) => {
                        console.error("Error loading audio from URL:", e);
                    });
                }
                // Initialize selectedAudio variable
                selectedAudio.loop = true;
                selectedAudio.play();
                musicAudio = selectedAudio;
            }

        } else {
            document.getElementById("error").style.color = "red";
            if (Number(n) <= 0 || !Number.isInteger(Number(n)) || n === "") {
                document.getElementById("error").innerHTML = "<strong>1. The Number of Colours must be a positive integer.</strong>";
            } else if (unit === "unit") {
                document.getElementById("error").innerHTML = "<strong>3. The Unit field must be selected.</strong>";
            } else if (view === "select") {
                document.getElementById("error").innerHTML = "<strong>4. The View field must be selected.</strong>";
            } else if (countdownValue <= 0) {
                document.getElementById("error").innerHTML = "<strong>5. The CountDown Timer must be a positive value greater than zero.</strong>";
            } else if (soundEffect !== 'none' && selectedFile || soundEffect !== 'none' && selectedUrl || selectedUrl && selectedFile) {
                document.getElementById("error").innerHTML = "<strong>6. Either <i>Select Music</i> or <i>Paste link</i> or <i>Choose File</i></strong>";

            }
            return;
        }
    }

    function startSimulation(n, set_time, unit, view, color1, color2) {
        const rgbColor1 = hexToRgb(color1);
        const rgbColor2 = hexToRgb(color2);

        document.body.querySelector(".slider").style.display = 'none';
        document.body.querySelector(".snowflakes").style.display = 'none';
        document.body.querySelector("#particles-js").style.display = 'none';

        if (unit === "seconds") {
            set_time *= 1000;
        }

        function getRandomColorBetween(color1, color2) {
            if (color1.r === color2.r && color1.g === color2.g && color1.b === color2.b) {
                const randomR = Math.floor(Math.random() * 256);
                const randomG = Math.floor(Math.random() * 256);
                const randomB = Math.floor(Math.random() * 256);
                return `rgb(${randomR}, ${randomG}, ${randomB})`;
            }
            else {
                const randomR = Math.floor(Math.random() * (color2.r - color1.r + 1)) + color1.r;
                const randomG = Math.floor(Math.random() * (color2.g - color1.g + 1)) + color1.g;
                const randomB = Math.floor(Math.random() * (color2.b - color1.b + 1)) + color1.b;
                return `rgb(${randomR}, ${randomG}, ${randomB})`;
            }
        }

        let randomcolor = getRandomColorBetween(color1, color2);

        function numberColorsBetween(color1, color2, num) {
            let colors = `${getRandomColorBetween(color1, color2)}`;
            while (num > 1) {
                colors += `, ${getRandomColorBetween(color1, color2)}`;
                num--;
            }
            return colors;
        }

        function createRandomGradientPattern(n) {
            let gradientPattern = `background-color: ${getRandomColorBetween(rgbColor1, rgbColor2)}; background-image: `;

            for (let i = 0; i < n; i++) {
                const randomPositionX = Math.floor(Math.random() * 
