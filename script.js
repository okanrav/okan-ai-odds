const btn = document.getElementById("btn");
const sonuc = document.getElementById("sonuc");
const input = document.getElementById("match");

const API_KEY = "7d64e0f7620285646fdc64f3538180e7";

let allMatches = [];

btn.addEventListener("click", loadMatches);
input.addEventListener("input", filterMatches);

async function loadMatches() {

    sonuc.innerHTML = "<div class='loading'>⏳ Maçlar yükleniyor...</div>";

    const today = new Date().toISOString().split("T")[0];

    try {

        const res = await fetch(
            `https://v3.football.api-sports.io/fixtures?date=${today}`,
            {
                headers: {
                    "x-apisports-key": API_KEY
                }
            }
        );

        const data = await res.json();

        allMatches = data.response || [];

        drawMatches(allMatches);

    } catch (e) {

        sonuc.innerHTML = "<div class='loading'>❌ Maçlar yüklenemedi.</div>";

    }

}

function filterMatches() {

    const q = input.value.toLowerCase();

    const filtered = allMatches.filter(m =>
        m.teams.home.name.toLowerCase().includes(q) ||
        m.teams.away.name.toLowerCase().includes(q) ||
        m.league.name.toLowerCase().includes(q)
    );

    drawMatches(filtered);

}

function drawMatches(matches) {

    if (matches.length === 0) {

        sonuc.innerHTML = "<div class='loading'>Maç bulunamadı.</div>";
        return;

    }

    let html = "";

    matches.forEach(match => {

        let durum = "🕒 Başlamadı";

        if (["1H","2H","LIVE","HT","ET","P"].includes(match.fixture.status.short))
            durum = "🟢 Canlı";

        if (["FT","AET","PEN"].includes(match.fixture.status.short))
            durum = "✅ Bitti";

        html += `

<div class="card">

<div class="league">
🏆 ${match.league.name}
</div>

<div class="time">
${durum}<br><br>
${new Date(match.fixture.date).toLocaleTimeString("tr-TR",{hour:"2-digit",minute:"2-digit"})}
</div>

<div class="teams">

<div>
<img src="${match.teams.home.logo}" width="50"><br>
${match.teams.home.name}
</div>

<strong>VS</strong>

<div>
<img src="${match.teams.away.logo}" width="50"><br>
${match.teams.away.name}
</div>

</div>

<div class="ai-box">

<div class="ai-title">
🤖 AI Analizi
</div>

<button class="ai-btn"
onclick="showAnalysis('${match.teams.home.name}','${match.teams.away.name}')">
Analizi Gör
</button>

</div>

</div>

`;

    });

    sonuc.innerHTML = html;

}

function showAnalysis(home, away){

alert(

`🤖 OKAN AI ODDS

${home}
VS
${away}

🚧 AI Analiz Sistemi

Bir sonraki sürümde bu ekranda:

📊 Son 5 Maç

🤝 H2H

🏠 İç Saha Formu

✈️ Deplasman Formu

⚽ Gol Ortalaması

🎯 1X2 Tahmini

⚽ KG Var/Yok

📈 2.5 Üst/Alt

🥅 Tahmini Skor

⭐ Güven Puanı

gösterilecek.`

);

}

loadMatches();
