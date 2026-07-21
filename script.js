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

        const response = await fetch(
            `https://v3.football.api-sports.io/fixtures?date=${today}`,
            {
                headers: {
                    "x-apisports-key": API_KEY
                }
            }
        );

        const data = await response.json();

        allMatches = data.response || [];

        drawMatches(allMatches);

    } catch (err) {

        sonuc.innerHTML =
            "<div class='loading'>❌ Maçlar yüklenemedi.</div>";

    }

}

function filterMatches() {

    const q = input.value.toLowerCase();

    drawMatches(
        allMatches.filter(match =>
            match.teams.home.name.toLowerCase().includes(q) ||
            match.teams.away.name.toLowerCase().includes(q) ||
            match.league.name.toLowerCase().includes(q)
        )
    );

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
${new Date(match.fixture.date).toLocaleTimeString("tr-TR",{
hour:"2-digit",
minute:"2-digit"
})}
</div>

<div class="teams">

<div>
<img src="${match.teams.home.logo}" width="50">
<br>
${match.teams.home.name}
</div>

<strong>VS</strong>

<div>
<img src="${match.teams.away.logo}" width="50">
<br>
${match.teams.away.name}
</div>

</div>

<div class="ai-box">

<div class="ai-title">
🤖 AI Analizi
</div>

<button
class="ai-btn"
data-home="${match.teams.home.name}"
data-away="${match.teams.away.name}">
Analizi Gör
</button>

</div>

</div>
`;

    });

    sonuc.innerHTML = html;

    document.querySelectorAll(".ai-btn").forEach(button => {

        button.addEventListener("click", function () {

            showAnalysis(
                this.dataset.home,
                this.dataset.away
            );

        });

    });

}

function showAnalysis(home, away) {

    const modal = document.getElementById("analysisModal");
    const content = document.getElementById("analysisContent");

    content.innerHTML = `
        <h3 style="text-align:center">${home} 🆚 ${away}</h3>

        <div class="analysis-item">
            📊 <b>Form Analizi</b><br>
            Yakında...
        </div>

        <div class="analysis-item">
            🤝 <b>H2H Analizi</b><br>
            Yakında...
        </div>

        <div class="analysis-item">
            🏠 <b>İç Saha Formu</b><br>
            Yakında...
        </div>

        <div class="analysis-item">
            ✈️ <b>Deplasman Formu</b><br>
            Yakında...
        </div>

        <div class="analysis-item">
            ⚽ <b>Gol Analizi</b><br>
            Yakında...
        </div>

        <div class="analysis-item">
            🎯 <b>AI Tahmini</b><br>
            Hesaplanıyor...
        </div>

        <div class="analysis-item">
            ⭐ <b>Güven Puanı</b><br>
            %0
        </div>
    `;


    modal.style.display = "block";
}

document.getElementById("closeModal").onclick = function () {
    document.getElementById("analysisModal").style.display = "none";
};

window.onclick = function (e) {
    if (e.target === document.getElementById("analysisModal")) {
        document.getElementById("analysisModal").style.display = "none";
    }
};
loadMatches();
