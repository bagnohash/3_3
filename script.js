const load = document.getElementById('load')
const search = document.getElementById('search')
const query = document.getElementById('query')
const gif = document.getElementById('gif')
const results = document.getElementById('results')
const error = document.getElementById('error')
const pagination = document.getElementById('pagination')
const pageInfo = document.getElementById('pageInfo')
const prev = document.getElementById('prev')
const next = document.getElementById('next')
const API_KEY = 'ay63AF4TJGJymqxUO4w1YouIRH59KZF3'
const LIMIT = 10

let offset = 0
let lastQuery = ''
let total = 0

async function searchGifs() {
    try {
        error.classList.add('hidden')
        gif.classList.add('hidden')
        results.innerHTML = ''

        const q = lastQuery || query.value.trim()
        if (!q) throw new Error('Podaj frazę do wyszukania')
        lastQuery = q

        const response = await fetch(
            `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${encodeURIComponent(q)}&limit=${LIMIT}&offset=${offset}&rating=g`
        );
        if (!response.ok) throw new Error(`Błąd HTTP ${response.status}`);

        const data = await response.json();
        console.log(data);

        if (!data?.data?.length) {
            throw new Error('Brak wyników dla tej frazy');
        }

        total = data.pagination?.total_count ?? 0

        data.data.forEach(item => {
            const img = document.createElement('img')
            img.src = item.images?.original?.url ?? item.images?.fixed_height?.url
            img.alt = item.title || q
            results.appendChild(img)
        })

        pagination.classList.remove('hidden')
        pageInfo.textContent = `${offset + 1}–${offset + data.data.length} / ${total}`
        prev.disabled = offset === 0
        next.disabled = offset + LIMIT >= total
    } catch (e) {
        pagination.classList.add('hidden')
        error.textContent = `Nie udało się wyszukać: ${e.message}`;
        error.classList.remove('hidden');
    }
}

load.addEventListener('click', async function () {
    try {
        error.classList.add('hidden')
        results.innerHTML = ''
        pagination.classList.add('hidden')
        const response = await fetch(`https://api.giphy.com/v1/gifs/random?api_key=${API_KEY}&rating=g`);
        if (!response.ok) throw new Error(`Błąd HTTP ${response.status}`);

        const data = await response.json();
        console.log(data);

        if (!data?.data?.images?.original?.url) {
            throw new Error('Brak GIFa w odpowiedzi (sprawdź klucz API)');
        }

        gif.classList.remove('hidden');
        gif.src = data.data.images.original.url;
    } catch (e) {
        gif.classList.add('hidden');
        error.textContent = `Nie udało się pobrać GIFa: ${e.message}`;
        error.classList.remove('hidden');
    }
})

search.addEventListener('click', function () {
    offset = 0
    lastQuery = query.value.trim()
    searchGifs()
})

prev.addEventListener('click', function () {
    offset = Math.max(0, offset - LIMIT)
    searchGifs()
})

next.addEventListener('click', function () {
    offset += LIMIT
    searchGifs()
})
