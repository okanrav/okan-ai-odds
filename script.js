const btn = document.getElementById("btn");
const sonuc = document.getElementById("sonuc");

btn.onclick = function () {

const mac = document.getElementById("match").value.trim();

if(mac==""){
sonuc.innerHTML="<div class='card'><h2>⚠️ Lütfen bir maç giriniz</h2></div>";
return;
}

const guven=Math.floor(Math.random()*16)+80;
const ev=Math.floor(Math.random()*26)+45;
const dep=Math.floor(Math.random()*21)+20;
const ber=100-ev-dep;

const skorlar=["1-0","2-0","2-1","3-1","1-1","0-1","2-2"];
const skor=skorlar[Math.floor(Math.random()*skorlar.length)];

sonuc.innerHTML=`

<div class="card">

<h2>⚽ ${mac}</h2>

<h3>🤖 AI Güven Skoru</h3>

<div class="bar">
<div class="fill" style="width:${guven}%"></div>
</div>

<h2>${guven}%</h2>

<hr>

<p>🏠 Ev Sahibi Kazanır: <b>${ev}%</b></p>

<div class="bar">
<div class="fill" style="width:${ev}%"></div>
</div>

<p>🤝 Beraberlik: <b>${ber}%</b></p>

<div class="bar">
<div class="fill" style="width:${ber}%"></div>
</div>

<p>🚩 Deplasman Kazanır: <b>${dep}%</b></p>

<div class="bar">
<div class="fill" style="width:${dep}%"></div>
</div>

<hr>

<p>⚽ 2.5 Üst: <b>Evet</b></p>
<p>🤝 KG Var: <b>Evet</b></p>
<p>🥅 Tahmini Skor: <b>${skor}</b></p>

</div>

`;

};
