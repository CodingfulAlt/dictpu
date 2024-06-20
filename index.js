const inputEl = document.getElementById("input");
const meaningContainerEl = document.getElementById("meaning-container");
const titleEl = document.getElementById("title");
const meaningEl = document.getElementById("meaning");
const audioEl = document.getElementById("audio");
const modeToggleBtn = document.getElementById("mode-toggle");
const bodyEl = document.body;
const suggestionsEl = document.getElementById("suggestions");

// Event listeners for dark/light mode toggle
modeToggleBtn.addEventListener("click", () => {
    const isDarkMode = bodyEl.classList.contains("dark-mode");
    if (isDarkMode) {
        bodyEl.classList.replace("dark-mode", "light-mode");
        modeToggleBtn.querySelector('.fa-sun').style.display = 'block';
        modeToggleBtn.querySelector('.fa-moon').style.display = 'none';
        localStorage.setItem('theme', 'light-mode');
    } else {
        bodyEl.classList.replace("light-mode", "dark-mode");
        modeToggleBtn.querySelector('.fa-sun').style.display = 'none';
        modeToggleBtn.querySelector('.fa-moon').style.display = 'block';
        localStorage.setItem('theme', 'dark-mode');
    }
});

// Load the theme from localStorage on page load
document.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark-mode') {
        bodyEl.classList.replace("light-mode", "dark-mode");
        modeToggleBtn.querySelector('.fa-sun').style.display = 'none';
        modeToggleBtn.querySelector('.fa-moon').style.display = 'block';
    } else {
        bodyEl.classList.replace("dark-mode", "light-mode");
        modeToggleBtn.querySelector('.fa-sun').style.display = 'block';
        modeToggleBtn.querySelector('.fa-moon').style.display = 'none';
    }
});

// Function to fetch API and display results or suggestions
async function fetchAPI(word) {
    // Clear previous suggestion list and hide the audio player
    suggestionsEl.innerHTML = "";
    suggestionsEl.classList.add('hidden');
    audioEl.classList.add('hidden');

    // Update the input field with the corrected/suggested word
    inputEl.value = word;

    try {
        const definitionUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
        const response = await fetch(definitionUrl);
        const definitionResult = await response.json();

        if (!definitionResult.length || definitionResult.title === "No Definitions Found") {
            fetchSuggestions(word);
        } else {
            displayResult(definitionResult);
        }
    } catch (error) {
        handleFetchError(error);
    }
}

// Fetch suggestions for misspelled words
async function fetchSuggestions(word) {
    const suggestionUrl = `https://api.datamuse.com/words?sp=${word}&max=5`;
    try {
        const response = await fetch(suggestionUrl);
        const suggestions = await response.json();

        if (suggestions.length > 0) {
            const suggestionWords = suggestions.map(s => s.word);
            displaySuggestions(suggestionWords, word);
        } else {
            displayNoDefinitionOrSuggestions(word);
        }
    } catch (error) {
        console.error('Suggestion fetch error:', error);
        displayNoDefinitionOrSuggestions(word);
    }
}

// Function to display clickable suggestions
function displaySuggestions(validSuggestions, originalWord) {
    suggestionsEl.innerHTML = `Did you mean: ` + validSuggestions.map(suggestion => `<span onclick="fetchAPI('${suggestion}')">${suggestion}</span>`).join(", ") + '?';
    suggestionsEl.classList.remove('hidden');
    titleEl.innerText = originalWord;
    meaningEl.innerText = "Sorry, no definition found.";
    meaningContainerEl.classList.remove('hidden');
}

// Function to display search results
function displayResult(result) {
    if (!result.length || result.title === "No Definitions Found") {
        titleEl.innerText = inputEl.value;
        meaningEl.innerText = "Sorry, no definition found.";
    } else {
        titleEl.innerText = result[0].word;
        meaningEl.innerText = result[0].meanings[0].definitions[0].definition;
        if (result[0].phonetics[0] && result[0].phonetics[0].audio) {
            audioEl.src = result[0].phonetics[0].audio;
            audioEl.classList.remove('hidden');
        }
    }
    meaningContainerEl.classList.remove('hidden');
}

// Function to display a message when no definition or suggestions are found
function displayNoDefinitionOrSuggestions(word) {
    suggestionsEl.innerHTML = "";
    suggestionsEl.classList.add('hidden');
    titleEl.innerText = word;
    meaningEl.innerText = "Sorry, no definition or suggestions found.";
    meaningContainerEl.classList.remove('hidden');
}

// Function to handle errors during fetch operations
function handleFetchError(error) {
    console.error('Fetch error:', error);
    titleEl.innerText = "Sorry, an error occurred while searching. Please try again.";
    meaningContainerEl.classList.remove('hidden');
}

// Event listener for search button
document.getElementById("searchBtn").addEventListener("click", () => {
    if (inputEl.value.trim() !== "") {
        fetchAPI(inputEl.value.trim());
    }
});

// Handle enter key in input field
inputEl.addEventListener("keyup", (e) => {
    if (e.key === "Enter" && e.target.value.trim() !== "") {
        fetchAPI(e.target.value.trim());
    }
});

// Animation end event listeners to remove animations post-execution
document.querySelectorAll('.animated').forEach(element => {
    element.addEventListener('animationend', () => {
        element.classList.remove('animated');
    });
});


// Get the current year and set it in the footer
const currentYearElement = document.getElementById('currentYear');
const currentYear = new Date().getFullYear();
currentYearElement.textContent = currentYear;
