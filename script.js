const btn = document.getElementById("btn");
const sonuc = document.getElementById("sonuc");

btn.onclick = async () => {
  sonuc.innerHTML = "⏳ Canlı maçlar yükleniyor...";

  try {
    const response = await fetch(
      "https://v3.football.api-sports.io/fixtures?live=all",
      {
        method: "GET",
        headers: {
          "x-apisports-key": "7d64e0f7620285646fdc64f3538180e7"
        }
      }
    );

    const data = await response.json();

    if (!data.response || data.response.length === 0) {
      sonuc.innerHTML = "⚽ Şu anda canlı maç bulunmuyor.";
      return;
    }

    let html = "";

    data.response.forEach(match => {
      html += `
        <div class="card">
          <h2>${match.teams.home.name} 🆚 ${match.teams.away.name}</h2>
          <p>🏆 ${match.league.name}</p>
          <p>⏱️ Dakika: ${match.fixture.status.elapsed || 0}</p>
          <p>📊 Skor: ${match.goals.home} - ${match.goals.away}</p>
        </div>
      `;
    });

    sonuc.innerHTML = html;

  } catch (err) {
    sonuc.innerHTML = "❌ Hata: " + err.message;
  }
};
