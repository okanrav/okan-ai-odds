/*====================================================
            OKAN AI ODDS v2.0
            SCRIPT.JS
            BÖLÜM 1 / 10
====================================================*/

//====================//
//      API
//====================//

const API_KEY = "7d64e0f7620285646fdc64f3538180e7";
const API_URL = "https://v3.football.api-sports.io";

//====================//
//      DOM
//====================//

const matchesContainer = document.getElementById("matchesContainer");
const loading = document.getElementById("loading");
const searchInput = document.getElementById("searchInput");
const modal = document.getElementById("analysisModal");
const analysisContent = document.getElementById("analysisContent");
const closeModal = document.getElementById("closeModal");

//====================//
//      DATA
//====================//

let allMatches = [];
let filteredMatches = [];
let selectedLeague = "ALL";
let today = "";

//====================//
//      APP START
//====================//

window.onload = function () {

    getTodayDate();

    initializeApp();

};

//====================//
//      DATE
//====================//

function getTodayDate() {

    const d = new Date();

    today = d.toISOString().split("T")[0];

}

//====================//
//      APP
//====================//

async function initializeApp() {

    showLoading();

    await loadMatches();

    hideLoading();

}

//====================//
//      LOADING
//====================//

function showLoading() {

    loading.style.display = "block";

}

function hideLoading() {

    loading.style.display = "none";

}

//====================//
//      ERROR
//====================//

function showError(message) {

    matchesContainer.innerHTML = `

        <div style="
            text-align:center;
            padding:40px;
            color:white;
            font-size:20px;
        ">
            ${message}
        </div>

    `;

}

/*====================================================
            BÖLÜM 2 / 10
            MAÇLARI ÇEK
====================================================*/

async function loadMatches() {

    try {

        const response = await fetch(

            `${API_URL}/fixtures?date=${today}`,

            {
                method: "GET",
                headers: {
                    "x-apisports-key": API_KEY
                }
            }

        );

        const data = await response.json();

        allMatches = data.response || [];

        filteredMatches = [...allMatches];

        renderMatches();

    }

    catch (error) {

        console.error(error);

        showError("Maçlar yüklenemedi.");

    }

}

/*====================================================
            MAÇLARI GÖSTER
====================================================*/

function renderMatches() {

    matchesContainer.innerHTML = "";

    if (filteredMatches.length === 0) {

        showError("Bugün maç bulunamadı.");

        return;

    }

    filteredMatches.forEach(match => {

        const home = match.teams.home.name;
        const away = match.teams.away.name;

        const league = match.league.name;

        const time = new Date(match.fixture.date)
        .toLocaleTimeString("tr-TR", {
            hour: "2-digit",
            minute: "2-digit"
        });

        matchesContainer.innerHTML += `

        <div class="match-card">

            <div class="match-league">
                ${league}
            </div>

            <div class="match-teams">

                <div class="team">

                    <div class="team-name">

                        ${home}

                    </div>

                </div>

                <div class="vs">

                    VS

                </div>

                <div class="team">

                    <div class="team-name">

                        ${away}

                    </div>

                </div>

            </div>

            <div class="match-time">

                ${time}

            </div>

            <button
                class="analysis-btn"
                onclick="showAnalysis(${match.fixture.id})">

                AI Analizi

            </button>

        </div>

        `;

    });

}

/*====================================================
            BÖLÜM 3 / 10
            ARAMA + MODAL
====================================================*/

//==============//
//   SEARCH
//==============//

searchInput.addEventListener("input", () => {

    const value = searchInput.value
        .toLowerCase()
        .trim();

    if (value === "") {

        filteredMatches = [...allMatches];

        renderMatches();

        return;

    }

    filteredMatches = allMatches.filter(match => {

        return (

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

    renderMatches();

});

//==============//
//   ANALYSIS
//==============//

function showAnalysis(id){

    const match = allMatches.find(

        m => m.fixture.id === id

    );

    if(!match) return;

    analysisContent.innerHTML = `

        <h2>

            ${match.teams.home.name}

            vs

            ${match.teams.away.name}

        </h2>

        <hr><br>

        <p><b>🏆 Lig:</b>

        ${match.league.name}</p>

        <p><b>🕒 Saat:</b>

        ${new Date(match.fixture.date)
            .toLocaleString("tr-TR")}

        </p>

        <p><b>📊 Durum:</b>

        ${match.fixture.status.long}

        </p>

        <br>

        <h3>🤖 OKAN AI ODDS</h3>

        <p>

        Analiz motoru hazırlanıyor...

        </p>

        <br>

        <h3>🎯 Tahmini Skor</h3>

        <p>-</p>

        <br>

        <h3>⭐ Güven</h3>

        <p>0 / 100</p>

    `;

    modal.style.display = "block";

}

//==============//
//   CLOSE
//==============//

closeModal.onclick = () => {

    modal.style.display = "none";

};

window.onclick = e => {

    if(e.target === modal){

        modal.style.display = "none";

    }

};

/*====================================================
            BÖLÜM 4 / 10
            MENÜ FİLTRELERİ
====================================================*/

const menuButtons = document.querySelectorAll(".menu-btn");

menuButtons.forEach(button => {

    button.addEventListener("click", () => {

        menuButtons.forEach(btn =>
            btn.classList.remove("active")
        );

        button.classList.add("active");

        const text = button.textContent.trim();

        switch(text){

            case "Tümü":

                filteredMatches = [...allMatches];

                break;

            case "Canlı":

                filteredMatches = allMatches.filter(match => {

                    return match.fixture.status.short === "1H" ||
                           match.fixture.status.short === "2H" ||
                           match.fixture.status.short === "HT" ||
                           match.fixture.status.short === "ET" ||
                           match.fixture.status.short === "BT";

                });

                break;

            case "Bugün":

                filteredMatches = [...allMatches];

                break;

            case "Güvenli":

                filteredMatches = [...allMatches];

                break;

            case "Premium":

                filteredMatches = [...allMatches];

                break;

            default:

                filteredMatches = [...allMatches];

        }

        renderMatches();

    });

});

/*====================================================
            MAÇ DURUMU
====================================================*/

function getMatchStatus(match){

    const status = match.fixture.status.short;

    if(status==="NS") return "⏳ Başlamadı";

    if(status==="1H") return "🟢 İlk Yarı";

    if(status==="HT") return "☕ Devre";

    if(status==="2H") return "🟢 İkinci Yarı";

    if(status==="FT") return "✔️ Maç Bitti";

    if(status==="ET") return "⏱️ Uzatma";

    if(status==="PEN") return "🎯 Penaltılar";

    return status;

}

/*====================================================
            BÖLÜM 5 / 10
        AI TAHMİN MOTORU V1
====================================================*/

function generatePrediction(match){

    let home = 33;
    let draw = 34;
    let away = 33;

    if(match.teams.home.winner === true){

        home = 65;
        draw = 20;
        away = 15;

    }

    if(match.teams.away.winner === true){

        home = 15;
        draw = 20;
        away = 65;

    }

    const confidence = Math.max(home, away);

    return{

        home,
        draw,
        away,
        confidence

    };

}


/*====================================================
            AI ANALİZ METNİ
====================================================*/

function createAIComment(prediction){

    if(prediction.confidence >= 80){

        return "Çok güçlü favori görünüyor.";

    }

    if(prediction.confidence >= 65){

        return "Favori taraf önde görünüyor.";

    }

    if(prediction.confidence >= 55){

        return "Dengeli fakat küçük avantaj var.";

    }

    return "Karşılaşma oldukça dengeli görünüyor.";

}

/*====================================================
            BÖLÜM 6 / 10
          TAKIM FORMU (API)
====================================================*/

async function getLastMatches(teamId){

    try{

        const response = await fetch(

            `${API_URL}/fixtures?team=${teamId}&last=5`,

            {

                method:"GET",

                headers:{

                    "x-apisports-key":API_KEY

                }

            }

        );

        const data = await response.json();

        return data.response || [];

    }

    catch(error){

        console.error(error);

        return [];

    }

}

/*====================================================
            FORM HESAPLAMA
====================================================*/

function calculateForm(matches, teamId){

    let win=0;
    let draw=0;
    let lose=0;

    matches.forEach(match=>{

        const home=match.teams.home.id===teamId;

        const gf=home
            ? match.goals.home
            : match.goals.away;

        const ga=home
            ? match.goals.away
            : match.goals.home;

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

/*====================================================
            BÖLÜM 7 / 10
        AI ANALİZİ V2
====================================================*/

async function openAnalysis(match){

    const homeLast = await getLastMatches(match.teams.home.id);
    const awayLast = await getLastMatches(match.teams.away.id);

    const homeForm = calculateForm(homeLast, match.teams.home.id);
    const awayForm = calculateForm(awayLast, match.teams.away.id);

    const prediction = generatePrediction(match);

    analysisContent.innerHTML = `

    <h2>${match.teams.home.name} vs ${match.teams.away.name}</h2>

    <hr><br>

    <h3>🏠 ${match.teams.home.name}</h3>

    <p>✅ Galibiyet : ${homeForm.win}</p>

    <p>➖ Beraberlik : ${homeForm.draw}</p>

    <p>❌ Mağlubiyet : ${homeForm.lose}</p>

    <br>

    <h3>✈️ ${match.teams.away.name}</h3>

    <p>✅ Galibiyet : ${awayForm.win}</p>

    <p>➖ Beraberlik : ${awayForm.draw}</p>

    <p>❌ Mağlubiyet : ${awayForm.lose}</p>

    <br>

    <h3>🤖 OKAN AI ODDS</h3>

    <p>Ev Sahibi: %${prediction.home}</p>

    <p>Beraberlik: %${prediction.draw}</p>

    <p>Deplasman: %${prediction.away}</p>

    <p>Güven: ${prediction.confidence}/100</p>

    <br>

    <p>${createAIComment(prediction)}</p>

    `;

    modal.style.display = "block";

}

