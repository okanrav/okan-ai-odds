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

window.addEventListener("load", init);

async function init() {

    getToday();

    showLoading();

    await loadMatches();

    hideLoading();

}

//================ DATE =================//

function getToday() {

    today = new Date().toISOString().split("T")[0];

}

//================ LOADING =================//

function showLoading() {

    loading.style.display = "block";

}

function hideLoading() {

    loading.style.display = "none";

}

/*==================================================
            BÖLÜM 2
        MAÇLARI API'DEN ÇEK
==================================================*/

async function loadMatches() {

    try {

        const response = await fetch(
            `${API_URL}/fixtures?date=${today}`,
            {
                headers: {
                    "x-apisports-key": API_KEY
                }
            }
        );

        if (!response.ok) {
            throw new Error("API bağlantı hatası");
        }

        const json = await response.json();

        allMatches = json.response || [];
        filteredMatches = [...allMatches];

        console.log(`${allMatches.length} maç yüklendi.`);

    } catch (error) {

        console.error(error);

        alert("Maçlar yüklenemedi.");

    }

}

