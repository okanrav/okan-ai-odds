const btn = document.getElementById("btn");
const sonuc = document.getElementById("sonuc");

btn.addEventListener("click", () => {
    const mac = document.getElementById("match").value.trim();

    if (mac === "") {
        sonuc.innerHTML = "⚠️ Lütfen bir maç girin.";
        return;
    }

    sonuc.innerHTML = `
    <h3>${mac}</h3>

    ✅ Yapay Zeka Güven Puanı: <b>%82</b><br><br>

    🎯 Maç Sonucu: <b>1</b><br>
    ⚽ 2.5 Üst: <b>Evet</b><br>
    🤝 KG Var: <b>Evet</b><br>
    🟨 İlk Yarı 0.5 Üst: <b>Evet</b><br>
    📈 Tahmini Skor: <b>2-1</b>
    `;
});
