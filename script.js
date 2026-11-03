const load = document.getElementById('load')
const gif = document.getElementById('gif')
const error = document.getElementById('error')
const API_KEY = 'ay63AF4TJGJymqxUO4w1YouIRH59KZF3'

load.addEventListener('click', async function () {
    try {
        error.classList.add('hidden')
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
