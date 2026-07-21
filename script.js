const btn = document.getElementById("btn");
const sonuc = document.getElementById("sonuc");

btn.addEventListener("click", () => {
    const mac = document.getElementById("match").value.trim();

    if (mac === "") {
        sonuc.innerHTML = "<h3>⚠️ Lütfen bir maç giriniz.</h3>";
        return;
    }

    sonuc.innerHTML = `
    <div class="card">
        <h2>⚽ ${mac}</h2>

        <p>🤖 Yapay Zeka Güven Puanı: <b>%82</b></p>

        <p>🎯 Maç Sonucu: <b>1</b></p>

        <p>⚽ 2.5 Üst: <b>Evet</b></p>

        <p>🤝 Karşılıklı Gol: <b>Evet</b></p>

        <p>🟨 İlk Yarı 0.5 Üst: <b>Evet</b></p>

        <p>📈 Tahmini Skor: <b>2-1</b></p>
    </div>
    `;
});
