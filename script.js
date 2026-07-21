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
