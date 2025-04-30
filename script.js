document.addEventListener("DOMContentLoaded", function () {
    prikaziLeaderboard();
});

var vremePocetka, bazaRecenica = [];
var izabraniMod;
var interval;

function prikaziLeaderboard() {
    var leaderboardBody = document.getElementById("leaderboardBody");
    leaderboardBody.innerHTML = "";
    JSON.parse(localStorage.getItem("rezultati") || "[]").forEach(function (rezultat) {
        leaderboardBody.innerHTML += `<tr><td>${rezultat.ime}</td><td>${rezultat.vreme.toFixed(2)}</td><td>${rezultat.mod}</td></tr>`;
    });

    document.getElementById("unosRecenice").value = "";
    document.getElementById("ime").value = "";
    document.getElementById("igra-container").style.display = "none";
    document.getElementById("leaderboard-container").style.display = "block";
}

function izaberiMod(mod) {
    document.getElementById('easybtn').classList.remove('selected');
    document.getElementById('hardbtn').classList.remove('selected');
    izabraniMod = mod;
    // Postavite trenutno odabrano dugme
    document.getElementById(mod + 'btn').classList.add('selected');
}

function prikaziRandomRecenicu() {
    clearInterval(interval); // Resetiranje intervala
    vremePocetka = new Date().getTime();
    var bazaFajl = (izabraniMod === 'easy') ? 'baza1.txt' : 'baza2.txt';

    var xhr = new XMLHttpRequest();
    xhr.open("GET", bazaFajl, true);
    xhr.onload = function () {

            bazaRecenica = xhr.responseText.split('\n').filter(Boolean);
            var randomRecenica = bazaRecenica[Math.floor(Math.random() * bazaRecenica.length)];
            document.getElementById("igra-container").style.display = "block";
            document.getElementById("prikazRecenice").textContent = randomRecenica;
            document.getElementById("rezultati").innerHTML = "";
            document.getElementById("unosRecenice").value = "";
            document.getElementById("leaderboard-container").style.display = "none";

            // Dodajemo prikaz vremena
            var vremePrikaza = document.createElement('p');
            vremePrikaza.id = 'vremePrikaza';
            document.getElementById("vreme").appendChild(vremePrikaza);

            // Pokretanje ažuriranja vremena svake sekunde
            interval = setInterval(azurirajVreme, 1000);
    };
    xhr.send();
}

function azurirajVreme() {
    var trenutnoVreme = new Date().getTime();
    var protekloVreme = (trenutnoVreme - vremePocetka) /1000;
    document.getElementById('vremePrikaza').textContent = "Vreme: " + protekloVreme.toFixed(0) + "s";
}

function proveriUnos() {
    var vremeZavrsetka = new Date().getTime();
    var vremeTrajanja = (vremeZavrsetka - vremePocetka) / 1000;
    var unosRecenice = document.getElementById("unosRecenice").value.trim();
    var prikazRecenice = document.getElementById("prikazRecenice").textContent.trim();
    var rezultatiContainer = document.getElementById("rezultati");

    if (unosRecenice === prikazRecenice) {
        rezultatiContainer.innerHTML = `<p>Ime: ${document.getElementById("ime").value.trim()}, Vreme: ${vremeTrajanja} s, Mod: ${izabraniMod}</p>`;
        spremiRezultat(document.getElementById("ime").value.trim(), vremeTrajanja);
        // Ako je vreme manje od 15 sekundi, pokreni pobednicku muziku
        if (vremeTrajanja < 15) {
            document.getElementById("pobedaMuzika").play();
        } else {
            document.getElementById("pocetnaMuzika").play();
        }
        setTimeout(prikaziLeaderboard, 1000);
    } else {
        rezultatiContainer.innerHTML = "<p>Pogresan unos. Pokusajte ponovo.</p>";
    }
}

function spremiRezultat(ime, vreme) {
    var rezultati = JSON.parse(localStorage.getItem("rezultati") || "[]");
    rezultati.push({ ime, vreme, mod: izabraniMod });
    rezultati.sort((a, b) => a.vreme - b.vreme);
    localStorage.setItem("rezultati", JSON.stringify(rezultati));
}
