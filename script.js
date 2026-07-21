/*==================================================
            OKAN AI ODDS
            SCRIPT.JS
            BÖLÜM 1
==================================================*/

//================ API =================//

const API_KEY = "7d64e0f7620285646fdc64f3538180e7";
const API_URL = "https://v3.football.api-sports.io";

//================ DOM =================//

const matchesContainer = document.getElementById("matchesContainer");
const loading = document.getElementById("loading");
const searchInput = document.getElementById("searchInput");

const modal = document.getElementById("analysisModal");
const analysisContent = document.getElementById("analysisContent");
const closeModal = document.getElementById("closeModal");

//================ DATA =================//

let allMatches = [];
let filteredMatches = [];
let today = "";

//================ START =================//

window.onload = async () => {

    getToday();

    showLoading();

    await loadMatches();

    hideLoading();

    initializeSearch();

    initializeMenu();

};

//================ DATE =================//

function getToday(){

    const d = new Date();

    today = d.toISOString().split("T")[0];

}

//================ LOADING =================//

function showLoading(){

    loading.style.display="block";

}

function hideLoading(){

    loading.style.display="none";

}

//================ ERROR =================//

function showError(text){

    matchesContainer.innerHTML=

    `
    <div class="error-box">

        ${text}

    </div>
    `;

}

//================ API =================//

async function loadMatches(){

    try{

        const response=await fetch(

            `${API_URL}/fixtures?date=${today}`,

            {

                headers:{

                    "x-apisports-key":API_KEY

                }

            }

        );

        const json=await response.json();

        allMatches=json.response || [];

        filteredMatches=[...allMatches];

        renderMatches();

    }

    catch(e){

        console.log(e);

        showError("Maçlar yüklenemedi.");

    }

}

//================ RENDER =================//

function renderMatches(){

    matchesContainer.innerHTML="";

    if(filteredMatches.length===0){

        showError("Maç bulunamadı.");

        return;

    }

    filteredMatches.forEach(match=>{

        const card=createMatchCard(match);

        matchesContainer.appendChild(card);

    });

}

//================ CARD =================//

function createMatchCard(match){

    const card=document.createElement("div");

    card.className="match-card";

    const time=new Date(match.fixture.date)
    .toLocaleTimeString("tr-TR",{

        hour:"2-digit",

        minute:"2-digit"

    });

    card.innerHTML=`

        <div class="league">

            ${match.league.name}

        </div>

        <div class="teams">

            <div>

                ${match.teams.home.name}

            </div>

            <div class="vs">

                VS

            </div>

            <div>

                ${match.teams.away.name}

            </div>

        </div>

        <div class="time">

            ${time}

        </div>

        <button class="analysis-btn">

            AI Analizi

        </button>

    `;

    card
    .querySelector(".analysis-btn")
    .addEventListener("click",()=>{

        openAnalysis(match);

    });

    return card;

}

//================ SEARCH =================//

function initializeSearch(){

    searchInput.addEventListener("input",()=>{

        const value=searchInput.value
        .toLowerCase()
        .trim();

        if(value===""){

            filteredMatches=[...allMatches];

        }

        else{

            filteredMatches=allMatches.filter(match=>{

                return(

                    match.teams.home.name
                    .toLowerCase()
                    .includes(value)

                    ||

                    match.teams.away.name
                    .toLowerCase()
                    .includes(value)

                    ||

                    match.league.name
                    .toLowerCase()
                    .includes(value)

                );

            });

        }

        renderMatches();

    });

}

//================ MENU =================//

function initializeMenu(){

    const buttons=document.querySelectorAll(".menu-btn");

    buttons.forEach(btn=>{

        btn.addEventListener("click",()=>{

            buttons.forEach(x=>x.classList.remove("active"));

            btn.classList.add("active");

            filterMatches(btn.innerText.trim());

        });

    });

}

function filterMatches(type){

    switch(type){

        case "Tümü":

            filteredMatches=[...allMatches];

            break;

        case "Canlı":

            filteredMatches=allMatches.filter(m=>{

                return["1H","HT","2H","ET","BT"]
                .includes(m.fixture.status.short);

            });

            break;

        default:

            filteredMatches=[...allMatches];

    }

    renderMatches();

}

/*==================================================
            BÖLÜM 2
        AI ANALİZ SİSTEMİ
==================================================*/

//============== MODAL ==============//

closeModal.onclick = () => {

    modal.style.display = "none";

};

window.onclick = e => {

    if (e.target === modal) {

        modal.style.display = "none";

    }

};

//============== ANALİZ ==============//

async function openAnalysis(match){

    modal.style.display = "block";

    analysisContent.innerHTML = `

    <div class="loading-analysis">

        🤖 AI analiz hazırlanıyor...

    </div>

    `;

    const homeLast = await getLastMatches(match.teams.home.id);

    const awayLast = await getLastMatches(match.teams.away.id);

    const homeForm = calculateForm(homeLast,match.teams.home.id);

    const awayForm = calculateForm(awayLast,match.teams.away.id);

    const prediction = generatePrediction(homeForm,awayForm);

    analysisContent.innerHTML = `

    <h2>

        ${match.teams.home.name}

        vs

        ${match.teams.away.name}

    </h2>

    <hr>

    <br>

    <h3>🏠 ${match.teams.home.name}</h3>

    <p>Galibiyet : ${homeForm.win}</p>

    <p>Beraberlik : ${homeForm.draw}</p>

    <p>Mağlubiyet : ${homeForm.lose}</p>

    <br>

    <h3>✈️ ${match.teams.away.name}</h3>

    <p>Galibiyet : ${awayForm.win}</p>

    <p>Beraberlik : ${awayForm.draw}</p>

    <p>Mağlubiyet : ${awayForm.lose}</p>

    <br>

    <h3>🤖 OKAN AI ODDS</h3>

    <p>🏠 Ev Sahibi : %${prediction.home}</p>

    <p>🤝 Beraberlik : %${prediction.draw}</p>

    <p>✈️ Deplasman : %${prediction.away}</p>

    <br>

    <h3>⭐ Güven</h3>

    <p>${prediction.confidence}/100</p>

    <br>

    <h3>💬 AI Yorumu</h3>

    <p>${prediction.comment}</p>

    `;

}

//============== SON 5 MAÇ ==============//

async function getLastMatches(teamId){

    try{

        const response = await fetch(

            `${API_URL}/fixtures?team=${teamId}&last=5`,

            {

                headers:{

                    "x-apisports-key":API_KEY

                }

            }

        );

        const json = await response.json();

        return json.response || [];

    }

    catch{

        return [];

    }

}

//============== FORM ==============//

function calculateForm(matches,teamId){

    let win=0;
    let draw=0;
    let lose=0;

    matches.forEach(match=>{

        const home = match.teams.home.id===teamId;

        const gf = home ? match.goals.home : match.goals.away;

        const ga = home ? match.goals.away : match.goals.home;

        if(gf>ga){

            win++;

        }

        else if(gf===ga){

            draw++;

        }

        else{

            lose++;

        }

    });

    return{

        win,

        draw,

        lose

    };

}

/*==================================================
        PROFESYONEL AI MOTORU V2
==================================================*/

function generatePrediction(data){

    let homeScore = 0;
    let awayScore = 0;

    // FORM
    homeScore += data.homeForm.win * 3;
    awayScore += data.awayForm.win * 3;

    homeScore += data.homeForm.draw;
    awayScore += data.awayForm.draw;

    // MAĞLUBİYET CEZASI
    homeScore -= data.homeForm.lose * 2;
    awayScore -= data.awayForm.lose * 2;

    // EV SAHİBİ AVANTAJI
    homeScore += 5;

    // GOL ORTALAMASI
    homeScore += data.homeGoalAverage * 2;
    awayScore += data.awayGoalAverage * 2;

    return calculateAIResult(homeScore, awayScore);

}

/*==================================================
        AI SONUÇ HESABI
==================================================*/

function calculateAIResult(homeScore, awayScore){

    let total = homeScore + awayScore;

    if(total <= 0){

        total = 1;

    }

    let home = Math.round((homeScore / total) * 100);
    let away = Math.round((awayScore / total) * 100);

    let draw = 100 - home - away;

    if(draw < 10){

        draw = 10;

    }

    let confidence = Math.max(home, away);

    return{

        home,
        draw,
        away,
        confidence

    };

}

/*==================================================
            BÖLÜM 3
      H2H + İSTATİSTİK + SKOR AI
==================================================*/

//================ H2H =================//

async function getHeadToHead(homeId, awayId){

    try{

        const response = await fetch(

            `${API_URL}/fixtures/headtohead?h2h=${homeId}-${awayId}&last=5`,

            {

                headers:{
                    "x-apisports-key":API_KEY
                }

            }

        );

        const json = await response.json();

        return json.response || [];

    }

    catch{

        return [];

    }

}

//================ GOL ORTALAMASI =================//

function calculateGoalAverage(matches){

    if(matches.length===0){

        return 0;

    }

    let goals=0;

    matches.forEach(match=>{

        goals+=match.goals.home||0;
        goals+=match.goals.away||0;

    });

    return (goals/matches.length).toFixed(2);

}

//================ KG VAR =================//

function calculateBTTS(matches){

    if(matches.length===0){

        return 0;

    }

    let count=0;

    matches.forEach(match=>{

        if(match.goals.home>0 && match.goals.away>0){

            count++;

        }

    });

    return Math.round((count/matches.length)*100);

}

//================ ÜST 2.5 =================//

function calculateOver25(matches){

    if(matches.length===0){

        return 0;

    }

    let count=0;

    matches.forEach(match=>{

        if((match.goals.home+match.goals.away)>=3){

            count++;

        }

    });

    return Math.round((count/matches.length)*100);

}

//================ TAHMİNİ SKOR =================//

function predictScore(home,away){

    if(home.win>=4 && away.lose>=3){

        return "2-0";

    }

    if(home.win>=3 && away.win>=3){

        return "2-1";

    }

    if(home.draw>=3 && away.draw>=3){

        return "1-1";

    }

    if(away.win>home.win){

        return "1-2";

    }

    return "1-0";

}

//================ PREMIUM =================//

function premiumComment(prediction){

    if(prediction.confidence>=80){

        return "🔥 Premium AI: Çok yüksek güven. Favori taraf güçlü görünüyor.";

    }

    if(prediction.confidence>=70){

        return "✅ Premium AI: Bahis için değerlendirilebilir.";

    }

    if(prediction.confidence>=60){

        return "⚠️ Premium AI: Temkinli oynanmalı.";

    }

    return "❌ Premium AI: Bu maç riskli görünüyor.";

}

/*==================================================
            BÖLÜM 4
        FINAL AI ANALİZİ
==================================================*/

async function buildFullAnalysis(match){

    const homeLast = await getLastMatches(match.teams.home.id);
    const awayLast = await getLastMatches(match.teams.away.id);

    const h2h = await getHeadToHead(
        match.teams.home.id,
        match.teams.away.id
    );

    const homeForm = calculateForm(homeLast, match.teams.home.id);
    const awayForm = calculateForm(awayLast, match.teams.away.id);

    const prediction = generatePrediction(homeForm, awayForm);

    const goalAverage =
        calculateGoalAverage([
            ...homeLast,
            ...awayLast
        ]);

    const btts =
        calculateBTTS([
            ...homeLast,
            ...awayLast
        ]);

    const over25 =
        calculateOver25([
            ...homeLast,
            ...awayLast
        ]);

    const score =
        predictScore(homeForm, awayForm);

    const premium =
        premiumComment(prediction);

    let h2hHtml = "";

    if(h2h.length===0){

        h2hHtml="<p>H2H verisi bulunamadı.</p>";

    }else{

        h2h.forEach(game=>{

            h2hHtml+=`

            <p>

            ${game.teams.home.name}

            ${game.goals.home}

            -

            ${game.goals.away}

            ${game.teams.away.name}

            </p>

            `;

        });

    }

    analysisContent.innerHTML=`

    <h2>

    ${match.teams.home.name}

    vs

    ${match.teams.away.name}

    </h2>

    <hr><br>

    <h3>📈 Form</h3>

    <p>

    🏠 ${match.teams.home.name}

    ${homeForm.win}G

    ${homeForm.draw}B

    ${homeForm.lose}M

    </p>

    <p>

    ✈️ ${match.teams.away.name}

    ${awayForm.win}G

    ${awayForm.draw}B

    ${awayForm.lose}M

    </p>

    <br>

    <h3>⚔️ Son Karşılaşmalar</h3>

    ${h2hHtml}

    <br>

    <h3>📊 İstatistikler</h3>

    <p>⚽ Gol Ortalaması : ${goalAverage}</p>

    <p>🥅 KG Var : %${btts}</p>

    <p>🔥 2.5 Üst : %${over25}</p>

    <br>

    <h3>🤖 OKAN AI ODDS</h3>

    <p>🏠 Ev Sahibi : %${prediction.home}</p>

    <p>🤝 Beraberlik : %${prediction.draw}</p>

    <p>✈️ Deplasman : %${prediction.away}</p>

    <p>⭐ Güven : ${prediction.confidence}/100</p>

    <br>

    <h3>🎯 Tahmini Skor</h3>

    <h2>${score}</h2>

    <br>

    <h3>💎 Premium AI</h3>

    <p>${premium}</p>

    `;
}

/*==================================================
        openAnalysis GÜNCELLE
==================================================*/

async function openAnalysis(match){

    modal.style.display="block";

    analysisContent.innerHTML=`

    <div style="padding:40px;text-align:center">

    🤖 OKAN AI ODDS analiz yapıyor...

    </div>

    `;

    await buildFullAnalysis(match);

}

/*==================================================
        GÜNÜN EN GÜVENLİ MAÇI
==================================================*/

function getSafestMatch(){

    if(allMatches.length===0){

        return null;

    }

    return allMatches[0];

}

/*==================================================
        SÜRÜM
==================================================*/

console.log("OKAN AI ODDS v1.0 hazır.");

