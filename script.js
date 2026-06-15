/* ======================================================
   HOMENAGEM ROMÂNTICA — CONFIGURAÇÕES
   ------------------------------------------------------
   👉 ALTERE AQUI tudo o que quiser personalizar.
   ====================================================== */

// 🎵 MÚSICA e 🖼️ CAPA
const capaMusica  = "vida.jpeg";    // imagem da capa (troque pelo seu arquivo)
const audioMusica = "Victoria.mp3";  // arquivo de áudio (coloque o seu na pasta)

// 🎤 NOME DA MÚSICA e ARTISTA
const nomeMusica = "Nossa Música";
const artista    = "Para você";

// 💌 MENSAGENS ROMÂNTICAS (aparecem uma por vez, em loop)
const mensagens = [
  "Voce È Tudo Pra Mim.",
  "Mesmo Longe Você Continua Sendo A Pessoa Mais Importante Do Mundo.",
  "Espero ansiosamente pelos nossos Gemeos KKK.",
  "Sempre e para Sempre.",
  "Só Voce me Importa, Eu Te Amo.",
  "Desculpa Por Não Te Mandar Mensagem, Mais Saiba Que Voce Sempre Esta Nos Meus Pensamentos.",
  "Mesmo Se Um dia Nos Paramos De Conversar, Saiba Que Sempre Estarei Esperando Por Voce",
  "EU❤️",
  "TE❤️",
  "AMO❤️",
  "VICTORIA❤️",
  "SERAPHIM❤️",
  "ESPERO PELO DIA QUE PODEREI TE CHMAR DE MINHA ESPOSA❤️"
];

// 📅 DATA DE INÍCIO (para o contador "Nossa História")
const dataInicio = "2025-10-01"; // formato: AAAA-MM-DD

// 📍 DISTÂNCIA entre as cidades
const cidadeA      = "São Paulo";
const cidadeB      = "Mato Grosso";
const distanciaKm  = "Mais de 2.100 km de distância";

// ✍️ TEXTO FINAL ROMÂNTICO
const textoFinal = `Mesmo Com a distancia, Mesmo com as poucas conversas,
Saiba que sempre sera voçê, SEMPRE E PARA SEMPRE,
TE AMO VICTORIA
Jamais esqueça disso, apesar das poucas conversas atuais ;~;`;

/* ======================================================
   A PARTIR DAQUI É O FUNCIONAMENTO — não precisa mexer.
   ====================================================== */

// ----- Referências dos elementos -----
const audio        = document.getElementById("audio");
const cover        = document.getElementById("cover");
const coverWrap    = document.getElementById("coverWrap");
const playerCard = document.querySelector(".now-playing"); 
const messages     = document.getElementById("messages");
const messageText  = document.getElementById("messageText");

const btnPlay      = document.getElementById("btnPlay");
const iconPlay     = document.getElementById("iconPlay");
const iconPause    = document.getElementById("iconPause");

const progress     = document.getElementById("progress");
const progressFill = document.getElementById("progressFill");
const progressKnob = document.getElementById("progressKnob");
const currentTimeEl= document.getElementById("currentTime");
const durationEl   = document.getElementById("duration");

const btnVolume    = document.getElementById("btnVolume");
const volumeSlider = document.getElementById("volume");

// ----- Preenche os textos configuráveis -----
cover.src = capaMusica;
audio.src = audioMusica;
document.getElementById("trackName").textContent  = nomeMusica;
document.getElementById("trackArtist").textContent = artista;
document.getElementById("loveHighlight").textContent = mensagens[0];
document.getElementById("cityA").textContent = cidadeA;
document.getElementById("cityB").textContent = cidadeB;
document.getElementById("distanceKm").textContent = distanciaKm;
document.getElementById("finalText").textContent = textoFinal;

// ----- Volume inicial -----
audio.volume = volumeSlider.value / 100;

/* ======================================================
   CONTROLE DO PLAYER (play / pause)
   ====================================================== */
let messagesStarted = false;

btnPlay.addEventListener("click", () => {
  if (audio.paused) {
    // Tenta tocar a música (pode falhar se não houver arquivo de áudio)
    audio.play().catch(() => {
      console.log("[v0] Áudio não encontrado ou bloqueado — seguindo só com as mensagens.");
    });
    iniciarExperiencia();
  } else {
    audio.pause();
    setPlayingUI(false);
  }
});

function iniciarExperiencia() {
  setPlayingUI(true);

  // Esconde a capa com fade-out e revela a área de mensagens
  coverWrap.classList.add("hidden-cover");
  messages.classList.add("active");

  // Inicia o ciclo de mensagens apenas uma vez
  if (!messagesStarted) {
    messagesStarted = true;
    cicloMensagens();
  }
}

function setPlayingUI(isPlaying) {
  iconPlay.classList.toggle("hidden", isPlaying);
  iconPause.classList.toggle("hidden", !isPlaying);
  btnPlay.setAttribute("aria-label", isPlaying ? "Pausar" : "Tocar");
  playerCard.classList.toggle("playing", isPlaying);
}

audio.addEventListener("ended", () => setPlayingUI(false)); // (loop está ativo, mas garante o ícone)
audio.addEventListener("pause", () => setPlayingUI(false));
audio.addEventListener("play",  () => setPlayingUI(true));

/* ======================================================
   CICLO DE MENSAGENS (fade in → permanece → fade out → loop)
   ====================================================== */
let msgIndex = 0;
const TEMPO_VISIVEL = 3200; // tempo que cada mensagem fica na tela (ms)
const TEMPO_FADE    = 900;  // duração do fade (ms) — combina com o CSS

function cicloMensagens() {
  // Define o texto da mensagem atual
  messageText.textContent = mensagens[msgIndex];

  // Fade In
  requestAnimationFrame(() => messageText.classList.add("show"));

  // Após o tempo visível, faz Fade Out
  setTimeout(() => {
    messageText.classList.remove("show");

    // Depois do fade out, avança para a próxima mensagem (loop infinito)
    setTimeout(() => {
      msgIndex = (msgIndex + 1) % mensagens.length;
      cicloMensagens();
    }, TEMPO_FADE);
  }, TEMPO_VISIVEL);
}

/* ======================================================
   BARRA DE PROGRESSO + DURAÇÃO
   ====================================================== */
function formatTime(seconds) {
  if (isNaN(seconds) || !isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

audio.addEventListener("loadedmetadata", () => {
  durationEl.textContent = formatTime(audio.duration);
});

audio.addEventListener("timeupdate", () => {
  const pct = (audio.currentTime / audio.duration) * 100 || 0;
  progressFill.style.width = pct + "%";
  progressKnob.style.left = pct + "%";
  currentTimeEl.textContent = formatTime(audio.currentTime);
});

// Permite clicar/arrastar na barra para mudar o tempo
progress.addEventListener("click", (e) => {
  const rect = progress.getBoundingClientRect();
  const pct = (e.clientX - rect.left) / rect.width;
  if (audio.duration) audio.currentTime = pct * audio.duration;
});

/* ======================================================
   VOLUME
   ====================================================== */
volumeSlider.addEventListener("input", () => {
  audio.volume = volumeSlider.value / 100;
});

let lastVolume = 80;
btnVolume.addEventListener("click", () => {
  if (audio.volume > 0) {
    lastVolume = volumeSlider.value;
    audio.volume = 0;
    volumeSlider.value = 0;
  } else {
    audio.volume = lastVolume / 100;
    volumeSlider.value = lastVolume;
  }
});

/* ======================================================
   CONTADOR "NOSSA HISTÓRIA"
   ====================================================== */
const elDays    = document.getElementById("days");
const elHours   = document.getElementById("hours");
const elMinutes = document.getElementById("minutes");
const elSeconds = document.getElementById("seconds");

function atualizarContador() {
  const inicio = new Date(dataInicio).getTime();
  const agora  = Date.now();
  let diff = Math.max(0, agora - inicio) / 1000; // em segundos

  const dias = Math.floor(diff / 86400); diff -= dias * 86400;
  const hrs  = Math.floor(diff / 3600);  diff -= hrs * 3600;
  const min  = Math.floor(diff / 60);    diff -= min * 60;
  const seg  = Math.floor(diff);

  elDays.textContent    = dias;
  elHours.textContent   = hrs.toString().padStart(2, "0");
  elMinutes.textContent = min.toString().padStart(2, "0");
  elSeconds.textContent = seg.toString().padStart(2, "0");
}
atualizarContador();
setInterval(atualizarContador, 1000);

/* ======================================================
   SCROLL REVEAL (animação ao aparecer na tela)
   ====================================================== */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

/* ======================================================
   PARALLAX SUAVE NO FUNDO
   ====================================================== */
window.addEventListener("scroll", () => {
  const y = window.scrollY;
  document.querySelector(".bg-glow").style.transform = `translateY(${y * 0.15}px)`;
}, { passive: true });
