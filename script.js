const btn = document.getElementById("btn");
const sonuc = document.getElementById("sonuc");

btn.onclick = async () => {
  sonuc.innerHTML = "⏳ Maçlar yükleniyor...";

  try {
    const res = await fetch(
      "https://fancy-mouse-5b1c.ravche28.workers.dev/?endpoint=fixtures&live=all"
    );

    const data = await res.json();

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
          <p>⏱️ ${match.fixture.status.elapsed || 0}'</p>
          <p>📊 ${match.goals.home} - ${match.goals.away}</p>
        </div>
      `;
    });

    sonuc.innerHTML = html;

  } catch (e) {
    sonuc.innerHTML = "❌ Veri alınamadı.<br>" + e.message;
  }
};
