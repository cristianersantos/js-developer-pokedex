const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')
const pokemonDetailCard = document.getElementById('pokemonDetailCard')
const closeDetailButton = document.getElementById('closeDetailButton')

const maxRecords = 151
const limit = 10
let offset = 0;

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}" data-name="${pokemon.name}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}"
                    alt="${pokemon.name}">
            </div>
        </li>
    `
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
    })
}

function showPokemonDetails(pokemonName) {
    pokeApi.getPokemonByName(pokemonName).then(pokemon => {
        document.getElementById('pokemonDetailName').textContent = pokemon.name
        document.getElementById('pokemonDetailId').textContent = `#${pokemon.number.toString().padStart(3, '0')}`
        document.getElementById('pokemonDetailImage').src = pokemon.photo
        document.getElementById('pokemonDetailImage').alt = pokemon.name

        const typesHtml = pokemon.types.map(type => `<span class="type ${type}">${type}</span>`).join('')
        document.getElementById('pokemonDetailTypes').innerHTML = typesHtml

        document.getElementById('pokemonDetailSpecies').textContent = pokemon.species || 'N/A'
        document.getElementById('pokemonDetailHeight').textContent = `${(pokemon.height / 10).toFixed(1)} m`
        document.getElementById('pokemonDetailWeight').textContent = `${(pokemon.weight / 10).toFixed(1)} kg`
        document.getElementById('pokemonDetailAbilities').textContent = pokemon.abilities.join(', ')

        pokemonDetailCard.classList.remove('hidden')
    })
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)
        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})

pokemonList.addEventListener('click', (event) => {
    const clickedPokemon = event.target.closest('.pokemon')
    if (clickedPokemon) {
        const pokemonName = clickedPokemon.dataset.name
        showPokemonDetails(pokemonName)
    }
})

closeDetailButton.addEventListener('click', () => {
    pokemonDetailCard.classList.add('hidden')
})