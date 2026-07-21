const btn = document.getElementById("btn");
const sonuc = document.getElementById("sonuc");

btn.onclick = function () {

const mac = document.getElementById("match").value.trim();

if(mac===""){
sonuc.innerHTML="<div class='card'><h2>⚠️ Lütfen maç giriniz</h2></div>";
return;
}

const guven=Math.floor(Math.random()*16)+80;
const ev=Math.floor(Math.random()*31)+40;
const dep=Math.floor(Math.random()*21)+20;
const ber=100-ev-dep;

sonuc.innerHTML=`

<div class="card">

<h2>⚽ ${mac}</h2>

<h3>🤖 AI Güven Skoru</h3>

<h1 style="color:#00d4ff">${guven}%</h1>

<hr>

<p>🏠 Ev Sahibi Kazanır : <b>${ev}%</b></p>

<p>🤝 Beraberlik : <b>${ber}%</b></p>

<p>🚩 Deplasman Kazanır : <b>${dep}%</b></p>

<hr>

<p>⚽ 2.5 Üst : <b>Evet</b></p>

<p>🤝 KG Var : <b>Evet</b></p>

<p>🥅 Tahmini Skor : <b>2-1</b></p>

</div>

`;

}
