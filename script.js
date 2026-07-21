const btn = document.getElementById("btn");
const sonuc = document.getElementById("sonuc");

btn.onclick = async () => {

    sonuc.innerHTML = "<div class='loading'>⏳ Maçlar yükleniyor...</div>";

    const today = new Date().toISOString().split("T")[0];

    try {

        const response = await fetch(
            `https://v3.football.api-sports.io/fixtures?date=${today}`,
            {
                headers: {
                    "x-apisports-key": "BURAYA_YENİ_API_ANAHTARINI_YAZ"
                }
            }
        );

        const data = await response.json();

        if (!data.response || data.response.length === 0) {
            sonuc.innerHTML = "<div class='loading'>Bugün maç bulunamadı.</div>";
            return;
        }

        let html = "";

        data.response.forEach(match => {

            html += `
            <div class="card">

                <div class="league">
                    🏆 ${match.league.name}
                </div>

                <div class="teams">

                    <div>
                        <img src="${match.teams.home.logo}" width="40"><br>
                        ${match.teams.home.name}
                    </div>

                    <strong>VS</strong>

                    <div>
                        <img src="${match.teams.away.logo}" width="40"><br>
                        ${match.teams.away.name}
                    </div>

                </div>

                <div class="time">
                    🕒 ${match.fixture.date.substring(11,16)}
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

        sonuc.innerHTML = html;

    } catch (e) {

        sonuc.innerHTML = "<div class='loading'>Bir hata oluştu.</div>";

    }

};
