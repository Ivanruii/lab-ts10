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
    resultsList: getElementOrThrow<HTMLUListElement>('results'),
    searchInput: getElementOrThrow<HTMLButtonElement>('searchInput'),
    searchButton: getElementOrThrow<HTMLButtonElement>('searchButton'),
    loader: getElementOrThrow<HTMLElement>('loader'),
}

function initializeElements() {
    return {
        ...elements
    }
}

function getElementOrThrow<Type>(id: string): Type {
    const element = document.getElementById(id) as Type;
    if (!element) {
        throw new Error(`Element with id "${id}" not found.`);
    }
    return element;
}

async function fetchCharacters(): Promise<Character[]> {
    const response = await fetch('http://localhost:3000/personajes');
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

function filterCharacters(characters: Character[], searchTerm: string): Character[] {
    return characters.filter(character =>
        character.nombre.toLowerCase().startsWith(searchTerm.toLowerCase())
    );
}

function handleSearchButtonClick(characters: Character[], searchButton: HTMLButtonElement) {
    searchButton.addEventListener('click', () => {
        const searchTerm = elements.searchInput.value.toLowerCase();
        const filteredCharacters = filterCharacters(characters, searchTerm);

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

    handleSearchButtonClick(characters, elements.searchButton);
}

initApp();