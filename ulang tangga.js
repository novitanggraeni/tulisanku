
const board = document.getElementById("board");
const rollButton = document.getElementById("rollButton");
const message = document.getElementById("message");

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

// DATA PEMAIN
const players = [
    {
        name: "Pemain 1",
        position: 1,
        score: 0,
        pawn: document.getElementById("pawn0")
    },
    {
        name: "Pemain 2",
        position: 1,
        score: 0,
        pawn: document.getElementById("pawn1")
    }
];

let currentPlayer = 0;
let busy = false;
let gameOver = false;
let questionQueue = [];
let gameVersion = 0;

// POSISI TANGGA: BAWAH MENUJU ATAS
// ANGKA SESUAI KODE MILIKMU

const ladders = {
    2: 38,
    7: 14,
    8: 31,
    15: 26,
    21: 42,
    28: 84,
    36: 44,
    51: 67,
    71: 91,
    78: 98,
    87: 94
};

// POSISI ULAR: KEPALA MENUJU EKOR

const snakes = {
    16: 6,
    49: 11,
    46: 25,
    62: 19,
    64: 60,
    74: 53,
    89: 68,
    92: 88,
    95: 75,
    99: 80
};

// 25 KOTAK KUIS
// KOTAK 8 DIGANTI MENJADI 10
// AGAR TIDAK BERTABRAKAN DENGAN PANGKAL TANGGA

const questionCells = [
    4, 10, 12, 18, 25,
    27, 31, 33, 40, 43,
    48, 55, 57, 60, 63,
    69, 72, 76, 81, 84,
    88, 91, 93, 96, 98
];

// 25 PERTANYAAN SEJARAH ORDE BARU

const questions = [
    {
        q: "Siapa presiden Indonesia pada masa Orde Baru?",
        a: ["Soekarno", "Soeharto", "B.J. Habibie", "Megawati"],
        c: 1
    },
    {
        q: "Orde Baru menggantikan masa pemerintahan apa?",
        a: ["Orde Lama", "Reformasi", "Demokrasi Liberal", "Kolonial"],
        c: 0
    },
    {
        q: "Apa kepanjangan dari Supersemar?",
        a: [
            "Surat Perintah Sebelas Maret",
            "Surat Pemerintahan Sementara",
            "Surat Peraturan Negara",
            "Surat Perintah Presiden"
        ],
        c: 0
    },
    {
        q: "Pada tanggal berapa Supersemar dikeluarkan?",
        a: [
            "11 Maret 1966",
            "17 Agustus 1966",
            "21 Mei 1998",
            "1 Juni 1945"
        ],
        c: 0
    },
    {
        q: "Apa kepanjangan dari Repelita?",
        a: [
            "Rencana Pembangunan Lima Tahun",
            "Reformasi Pembangunan Lima Tahap",
            "Rencana Pendidikan Lima Tahun",
            "Revolusi Pembangunan"
        ],
        c: 0
    },
    {
        q: "Program pembangunan lima tahun pada masa Orde Baru dikenal sebagai ...",
        a: ["Pelita", "Trikora", "Tritura", "Reformasi"],
        c: 0
    },
    {
        q: "Penyederhanaan partai politik pada masa Orde Baru disebut ...",
        a: [
            "Fusi partai politik",
            "Demokrasi bebas",
            "Otonomi daerah",
            "Revolusi"
        ],
        c: 0
    },
    {
        q: "Dwifungsi ABRI memiliki dua peran, yaitu ...",
        a: [
            "Pertahanan dan sosial politik",
            "Pendidikan dan perdagangan",
            "Ekonomi dan budaya",
            "Kesehatan dan pendidikan"
        ],
        c: 0
    },
    {
        q: "Salah satu fokus pembangunan ekonomi Orde Baru adalah ...",
        a: ["Pertanian", "Antariksa", "Perfilman", "Olahraga"],
        c: 0
    },
    {
        q: "Program peningkatan hasil pertanian dikenal dengan istilah ...",
        a: [
            "Revolusi Hijau",
            "Politik Etis",
            "Tanam Paksa",
            "Trikora"
        ],
        c: 0
    },
    {
        q: "Indonesia mendapatkan pengakuan internasional atas keberhasilan swasembada beras pada tahun ...",
        a: ["1975", "1984", "1990", "1998"],
        c: 1
    },
    {
        q: "Krisis ekonomi yang turut mengakhiri Orde Baru terjadi pada tahun ...",
        a: ["1988", "1990", "1997", "2004"],
        c: 2
    },
    {
        q: "Pada tanggal berapa Soeharto mengundurkan diri?",
        a: [
            "17 Agustus 1945",
            "11 Maret 1966",
            "21 Mei 1998",
            "20 Mei 1999"
        ],
        c: 2
    },
    {
        q: "Apa nama gerakan mahasiswa yang muncul pada tahun 1998?",
        a: [
            "Gerakan Reformasi",
            "Gerakan Kemerdekaan",
            "Gerakan Kolonial",
            "Gerakan Demokrasi Terpimpin"
        ],
        c: 0
    },
    {
        q: "Salah satu ciri pemerintahan Orde Baru adalah ...",
        a: [
            "Sentralisasi kekuasaan",
            "Pergantian presiden setiap tahun",
            "Tidak ada pemerintahan pusat",
            "Sistem kerajaan"
        ],
        c: 0
    },
    {
        q: "Siapa presiden Indonesia setelah Soeharto?",
        a: [
            "Megawati",
            "B.J. Habibie",
            "Abdurrahman Wahid",
            "Susilo Bambang Yudhoyono"
        ],
        c: 1
    },
    {
        q: "Partai politik yang menjadi salah satu peserta pemilu pada masa Orde Baru adalah ...",
        a: ["Golkar", "PKS", "Partai Demokrat", "NasDem"],
        c: 0
    },
    {
        q: "Pemilu pertama pada masa Orde Baru dilaksanakan pada tahun ...",
        a: ["1965", "1971", "1980", "1998"],
        c: 1
    },
    {
        q: "Salah satu tujuan program transmigrasi adalah ...",
        a: [
            "Pemerataan persebaran penduduk",
            "Meningkatkan impor barang",
            "Mengurangi jumlah sekolah",
            "Menutup wilayah pertanian"
        ],
        c: 0
    },
    {
        q: "Organisasi negara-negara pengekspor minyak yang menjadi anggota Indonesia adalah ...",
        a: ["OPEC", "ASEAN", "PBB", "APEC"],
        c: 0
    },
    {
        q: "Indonesia menjadi anggota ASEAN pada tahun ...",
        a: ["1967", "1975", "1984", "1998"],
        c: 0
    },
    {
        q: "Salah satu kebijakan ekonomi Orde Baru pada awal pemerintahan adalah ...",
        a: [
            "Stabilisasi dan rehabilitasi ekonomi",
            "Penghapusan seluruh kegiatan perdagangan",
            "Penutupan semua bank",
            "Penghentian pembangunan"
        ],
        c: 0
    },
    {
        q: "Pada masa Orde Baru, lembaga yang menjadi wadah berhimpun pegawai negeri sipil adalah ...",
        a: ["Korpri", "KNIP", "BKR", "BPUPKI"],
        c: 0
    },
    {
        q: "Kebijakan politik luar negeri Indonesia pada masa Orde Baru tetap berlandaskan prinsip ...",
        a: [
            "Bebas aktif",
            "Imperialisme",
            "Kolonialisme",
            "Isolasionisme"
        ],
        c: 0
    },
    {
        q: "Salah satu dampak negatif pemerintahan Orde Baru adalah ...",
        a: [
            "Praktik KKN dan pembatasan kebebasan politik",
            "Tidak adanya pembangunan infrastruktur",
            "Indonesia tidak memiliki presiden",
            "Seluruh kegiatan ekonomi dihentikan"
        ],
        c: 0
    }
];

// POSISI KOTAK ZIG-ZAG

function cellCenter(position) {
    const row = Math.floor((position - 1) / 10);
    const offset = (position - 1) % 10;

    const col = row % 2 === 0
        ? offset
        : 9 - offset;

    return {
        left: (col + 0.5) * 10,
        top: (9 - row + 0.5) * 10
    };
}

// POSISI BIDAK

function placePawn(player) {
    const point = cellCenter(player.position);

    const offset = player === players[0] ? -1.8 : 1.8;

    player.pawn.style.left =
        `${point.left + offset}%`;

    player.pawn.style.top =
        `${point.top}%`;
}

// UPDATE TAMPILAN

function updateDisplay() {
    players.forEach((player, index) => {
        document.getElementById(`position${index}`).textContent =
            player.position;

        document.getElementById(`score${index}`).textContent =
            player.score;

        document.getElementById(`card${index}`).classList.toggle(
            "active",
            index === currentPlayer
        );

        placePawn(player);
    });

    document.getElementById("turnText").textContent =
        players[currentPlayer].name;
}

// GERAK SATU KOTAK DEMI SATU KOTAK

async function moveStepByStep(player, steps, version) {
    for (let i = 0; i < steps; i++) {
        if (version !== gameVersion || gameOver) return false;

        player.position++;

        updateDisplay();

        await sleep(300);
    }

    return version === gameVersion;
}

// GANTI GILIRAN

function nextTurn() {
    if (gameOver) return;

    currentPlayer = currentPlayer === 0 ? 1 : 0;

    busy = false;
    rollButton.disabled = false;

    updateDisplay();
}

// CEK PEMENANG

function endGame(player) {
    gameOver = true;
    busy = true;

    rollButton.disabled = true;

    document.getElementById("winnerText").textContent =
        `${player.name} Menang!`;

    document.getElementById("winnerDescription").textContent =
        `Berhasil mencapai kotak 100 dengan ${player.score} poin.`;

    document.getElementById("winnerModal").classList.remove("hidden");
}

// CEK ULAR DAN TANGGA
// HANYA DIPANGGIL SEKALI SETELAH PEMAIN SELESAI BERGERAK DAN MENJAWAB KUIS

async function checkSnakeAndLadder(player, version) {
    if (version !== gameVersion) return;

    const oldPosition = player.position;

    // CEK TANGGA
    if (ladders[oldPosition] !== undefined) {
        const destination = ladders[oldPosition];

        message.textContent =
            `Hebat! ${player.name} naik tangga dari kotak ${oldPosition} ke kotak ${destination}.`;

        player.position = destination;

        updateDisplay();

        await sleep(600);
    }

    // CEK ULAR
    else if (snakes[oldPosition] !== undefined) {
        const destination = snakes[oldPosition];

        message.textContent =
            `Aduh! ${player.name} terkena ular dari kotak ${oldPosition} dan turun ke kotak ${destination}.`;

        player.position = destination;

        updateDisplay();

        await sleep(600);
    }

    if (version !== gameVersion) return;

    // TIDAK ADA PENGECEKAN ULANG DI KOTAK TUJUAN
    if (player.position === 100) {
        endGame(player);
    }
}

// TAMPILKAN SOAL

function askQuestion(player, version) {
    return new Promise(resolve => {
        if (version !== gameVersion) {
            resolve(false);
            return;
        }

        if (questionQueue.length === 0) {
            message.textContent =
                "Semua 25 pertanyaan sudah digunakan. Permainan dilanjutkan.";

            resolve(false);
            return;
        }

        busy = true;
        rollButton.disabled = true;

        const index = questionQueue.shift();
        const item = questions[index];

        const usedQuestions =
            questions.length - questionQueue.length;

        document.getElementById("questionCount").textContent =
            `SOAL ${usedQuestions}/25`;

        document.getElementById("questionText").textContent =
            item.q;

        const answerList = document.getElementById("answerList");
        const feedback = document.getElementById("answerFeedback");

        answerList.innerHTML = "";
        feedback.textContent = "";

        let answered = false;

        item.a.forEach((answer, answerIndex) => {
            const button = document.createElement("button");

            button.className = "answer-option";

            button.textContent =
                `${String.fromCharCode(65 + answerIndex)}. ${answer}`;

            button.addEventListener("click", async () => {
                if (answered || version !== gameVersion) return;

                answered = true;

                [...answerList.children].forEach(choice => {
                    choice.disabled = true;
                });

                if (answerIndex === item.c) {
                    button.classList.add("correct");

                    player.score += 10;

                    feedback.style.color = "#47805e";

                    feedback.textContent =
                        "✓ Jawaban benar! Kamu mendapatkan +10 poin.";
                } else {
                    button.classList.add("wrong");

                    answerList.children[item.c].classList.add("correct");

                    player.score -= 10;

                    feedback.style.color = "#b3443f";

                    feedback.textContent =
                        `✗ Jawaban salah! Poin dikurangi 10. Jawaban benar: ${item.a[item.c]}.`;
                }

                updateDisplay();

                await sleep(1500);

                if (version !== gameVersion) {
                    resolve(false);
                    return;
                }

                document.getElementById("questionModal")
                    .classList.add("hidden");

                resolve(true);
            });

            answerList.appendChild(button);
        });

        document.getElementById("questionModal")
            .classList.remove("hidden");
    });
}

// LEMPAR DADU

async function rollDice() {
    if (busy || gameOver) return;

    busy = true;
    rollButton.disabled = true;

    const version = gameVersion;
    const player = players[currentPlayer];

    const dice = Math.floor(Math.random() * 6) + 1;

    const diceSymbols = [
        "⚀", "⚁", "⚂", "⚃", "⚄", "⚅"
    ];

    document.getElementById("dice").textContent =
        diceSymbols[dice - 1];

    const target = player.position + dice;

    // HARUS ANGKA TEPAT UNTUK MENCAPAI 100

    if (target > 100) {
        message.textContent =
            `${player.name} mendapat angka ${dice}, tetapi harus mendapat angka yang tepat untuk mencapai kotak 100.`;

        await sleep(900);

        if (version === gameVersion) {
            nextTurn();
        }

        return;
    }

    message.textContent =
        `${player.name} melempar dadu dan mendapat angka ${dice}.`;

    await sleep(300);

    // BIDAK BERJALAN SATU PER SATU

    const moved = await moveStepByStep(player, dice, version);

    if (!moved || version !== gameVersion) return;

    message.textContent =
        `${player.name} berhenti di kotak ${player.position}.`;

    // CEK APAKAH KOTAK TERSEBUT ADALAH KOTAK KUIS

    if (questionCells.includes(player.position)) {
        if (questionQueue.length > 0) {
            await askQuestion(player, version);
        }
    }

    if (version !== gameVersion) return;

    // CEK ULAR DAN TANGGA HANYA SATU KALI

    await checkSnakeAndLadder(player, version);

    if (version !== gameVersion || gameOver) return;

    await sleep(500);

    if (version === gameVersion) {
        nextTurn();
    }
}

// ACAK PERTANYAAN

function shuffleQuestions() {
    questionQueue = Array.from(
        { length: questions.length },
        (_, index) => index
    );

    for (let i = questionQueue.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [questionQueue[i], questionQueue[j]] =
            [questionQueue[j], questionQueue[i]];
    }
}

// RESET PERMAINAN

function resetGame() {
    // Membatalkan proses giliran sebelumnya
    gameVersion++;

    players.forEach(player => {
        player.position = 1;
        player.score = 0;
    });

    currentPlayer = 0;
    busy = false;
    gameOver = false;

    shuffleQuestions();

    document.getElementById("dice").textContent = "⚄";

    message.textContent =
        "Pemain 1, lempar dadu untuk memulai!";

    document.getElementById("questionModal")
        .classList.add("hidden");

    document.getElementById("winnerModal")
        .classList.add("hidden");

    rollButton.disabled = false;

    updateDisplay();
}

// TOMBOL MULAI

const startButton = document.getElementById("startButton");
const gameSection = document.getElementById("gameSection");

if (startButton && gameSection) {
    startButton.addEventListener("click", () => {
        gameSection.scrollIntoView({
            behavior: "smooth"
        });
    });
}

// TOMBOL DADU

rollButton.addEventListener("click", rollDice);

// TOMBOL RESET

document.getElementById("resetButton")
    .addEventListener("click", resetGame);

// TOMBOL MAIN LAGI

document.getElementById("playAgainButton")
    .addEventListener("click", resetGame);

// MULAI PERMAINAN

resetGame();
