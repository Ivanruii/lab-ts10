import "./style.css";

interface Character {
    id: string;
    nombre: string;
    apodo: string;
    especialidad: string;
    habilidades: string[];
    amigo: string;
    imagen: string;
}

const elements = {
    resultsList: getElementOrThrow<HTMLUListElement>('results', HTMLUListElement),
    searchInput: getElementOrThrow<HTMLInputElement>('searchInput', HTMLInputElement),
    searchButton: getElementOrThrow<HTMLButtonElement>('searchButton', HTMLButtonElement),
    loader: getElementOrThrow<HTMLElement>('loader', HTMLElement),
}

function initializeElements() {
    return {
        ...elements
    }
}

function getElementOrThrow<T extends HTMLElement>(elementId: string, elementType: new () => T): T {
    const element = document.getElementById(elementId);

    if (!element || !(element instanceof elementType)) {
        throw new Error(`Element with id "${elementId}" not found.`);
    }

    return element;
}


async function fetchCharacters(searchTerm?: string): Promise<Character[]> {
    let url = 'http://localhost:3000/personajes';
    
    if (searchTerm) {
        url += `?nombre_like=^${searchTerm.toLowerCase()}`;
    }

    const response = await fetch(url);
    const characters: Character[] = await response.json();
    return characters;
}


function displayCharacters(characters: Character[]) {
    const elements = initializeElements();

    characters.forEach((character, index) => {
        const card = createCharacterCard(character, elements.resultsList);

        if (index % 2 === 0) {
            card.classList.add('even-card');
        } else {
            card.classList.add('odd-card');
        }
    });
}

function createCharacterCard(character: Character, resultsList: HTMLElement): HTMLElement {
    const card = document.createElement('li');
    card.classList.add('card');


    createCharacterImage(card, character);
    createCharacterName(card, character);

    resultsList.appendChild(card);

    return card;
}

function createCharacterImage(card: HTMLLIElement, character: Character) {
    const image = document.createElement('img');
    image.src = `http://localhost:3000/${character.imagen}`;
    image.alt = character.nombre;
    card.appendChild(image);
}

function createCharacterName(card: HTMLLIElement, character: Character) {
    const name = document.createElement('h2');
    name.textContent = character.nombre;
    card.appendChild(name);
}

function handleSearchButtonClick(searchButton: HTMLButtonElement) {
    searchButton.addEventListener('click', async () => {
        const searchTerm = elements.searchInput.value.toLowerCase();
        const filteredCharacters = await fetchCharacters(searchTerm);

        const resultsList = document.getElementById('results') as HTMLUListElement;
        resultsList.innerHTML = '';

        displayCharacters(filteredCharacters); 
    });
}

function toggleLoader(loaderElement: HTMLElement, show: Boolean) {
    loaderElement.style.display = show ? 'block' : 'none';
}

async function initApp() {
    const elements = initializeElements();

    let characters: Character[] = [];

    try {
        toggleLoader(elements.loader, true);
        characters = await fetchCharacters();
        displayCharacters(characters);
    } catch (error) {
        console.error('Error fetching characters:', error);
    } finally {
        toggleLoader(elements.loader, false);
    }

    handleSearchButtonClick(elements.searchButton);
}

initApp();