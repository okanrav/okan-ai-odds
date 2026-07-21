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

        sonuc.innerHTML = "<div class='loading'>Hata oluştu.</div>";

    }

}

function filterMatches(){

    const q = input.value.toLowerCase();

    const filtered = allMatches.filter(m=>{

        return (
            m.teams.home.name.toLowerCase().includes(q) ||
            m.teams.away.name.toLowerCase().includes(q) ||
            m.league.name.toLowerCase().includes(q)
        );

    });

    drawMatches(filtered);

}

function drawMatches(matches) {

    if(matches.length===0){

        sonuc.innerHTML="<div class='loading'>Maç bulunamadı.</div>";
        return;

    }

    let html="";

    matches.forEach(match=>{

        let durum="🕒 Başlamadı";

        if(match.fixture.status.short==="LIVE")
            durum="🟢 Canlı";

        if(match.fixture.status.short==="FT")
            durum="✅ Bitti";

        html+=`

        <div class="card">

            <div class="league">
                🏆 ${match.league.name}
            </div>

            <div class="time">

                ${durum}

                <br><br>

                ${match.fixture.date.substring(11,16)}

            </div>

            <div class="teams">

                <div>

                    <img src="${match.teams.home.logo}" width="45">

                    <br>

                    ${match.teams.home.name}

                </div>

                <strong>VS</strong>

                <div>

                    <img src="${match.teams.away.logo}" width="45">

                    <br>

                    ${match.teams.away.name}

                </div>

            </div>

            <div class="ai-box">

                <div class="ai-title">

                    🤖 AI Analizi

                </div>

                <button class="ai-btn">

                    Analizi Gör

                </button>

            </div>

        </div>

        `;

    });

    sonuc.innerHTML=html;

}

loadMatches();
