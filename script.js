const load = document.getElementById('load')
const search = document.getElementById('search')
const query = document.getElementById('query')
const gif = document.getElementById('gif')
const results = document.getElementById('results')
const error = document.getElementById('error')
const API_KEY = 'ay63AF4TJGJymqxUO4w1YouIRH59KZF3'

load.addEventListener('click', async function () {
    try {
        error.classList.add('hidden')
        results.innerHTML = ''
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

search.addEventListener('click', async function () {
    try {
        error.classList.add('hidden')
        gif.classList.add('hidden')
        results.innerHTML = ''

        const q = query.value.trim()
        if (!q) throw new Error('Podaj frazę do wyszukania')

        const response = await fetch(
            `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${encodeURIComponent(q)}&limit=10&rating=g`
        );
        if (!response.ok) throw new Error(`Błąd HTTP ${response.status}`);

        const data = await response.json();
        console.log(data);

        if (!data?.data?.length) {
            throw new Error('Brak wyników dla tej frazy');
        }

        data.data.forEach(item => {
            const img = document.createElement('img')
            img.src = item.images?.original?.url ?? item.images?.fixed_height?.url
            img.alt = item.title || q
            results.appendChild(img)
        })
    } catch (e) {
        error.textContent = `Nie udało się wyszukać: ${e.message}`;
        error.classList.remove('hidden');
    }
})
