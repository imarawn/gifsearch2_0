const SUPABASE_URL = 'https://wocqopootglovmnhxcjw.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndvY3FvcG9vdGdsb3Ztbmh4Y2p3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgwNTA4MjYsImV4cCI6MjA1MzYyNjgyNn0.YsKQxWGBhlB6qCVIoRok9DXUzYQTts6lx_lo8Ps8utU';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function fetchRandomEmotes() {
    const results = document.getElementById('results');
    results.innerHTML = '🔄 Loading...';

    const { data, error } = await supabase
        .from('random_emotes')
        .select('*')
        .eq('is_visible', true)
        .limit(40);

    results.innerHTML = '';
    if (error || !data?.length) {
        results.textContent = '⚠️ No emotes found.';
        return;
    }

    data.forEach(emote => {
        const card = document.createElement('div');
        card.className = 'emote-card';

        const img = document.createElement('img');
        img.src = emote.url;
        card.appendChild(img);

        img.onload = () => {
            const width = img.naturalWidth;
            const height = img.naturalHeight;

            if (width > 250 || height > 80) {
                card.style.backgroundColor = '#330000'; // große Emotes
            } else {
                card.style.backgroundColor = '#003300';
            }
        };

        const slug = document.createElement('div');
        slug.className = 'emote-slug';
        slug.textContent = `:${emote.search_slug}`;
        card.appendChild(slug);

        card.style.cursor = 'pointer';
        card.title = 'Click to copy slug';
        card.addEventListener('click', () => {
            const slugToCopy = `:${emote.search_slug}`;
            navigator.clipboard.writeText(slugToCopy).then(() => {
                card.style.outline = '2px solid var(--accent)';
                setTimeout(() => {
                    card.style.outline = 'none';
                }, 1000);
            });

            const saved = JSON.parse(localStorage.getItem('emoteHistory') || '[]');

            if (!saved.find(e => e.slug === emote.slug)) {
                saved.push({
                    slug: emote.slug,
                    search_slug: emote.search_slug,
                    url: emote.url,
                    timestamp: Date.now()
                });
                localStorage.setItem('emoteHistory', JSON.stringify(saved));
            }
        });


        results.appendChild(card);
    });
}
