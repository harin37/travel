const destinasiList = [
  { nama: 'Jakarta', url: 'jakarta.jpg' },
  { nama: 'Bandung', url: 'bandung.jpg' },
  { nama: 'Yogyakarta', url: 'yogyakarta.jpg' },
  { nama: 'Bali', url: 'bali.jpg' },
  { nama: 'Surabaya', url: 'surabaya.jpg' },
  { nama: 'Semarang', url: 'semarang.jpg' },
  { nama: 'Kota Lain', url: 'lain.jpg' },
  { nama: 'Sewa Mobil Saja', url: 'sewamobil.jpg' },
];

const armadaList = [
  { label: 'Avanza', img: 'avanza.png' },
  { label: 'Innova', img: 'innova.png' },
  { label: 'Hiace', img: 'hiace.png' },
  { label: 'Elf', img: 'elf.png' },
  { label: 'Fortuner', img: 'fortuner.png' },
  { label: 'Pajero', img: 'pajero.png' },
];

const nomorWA = '62881023846310';

const destinasiSection = document.getElementById('destinations');
destinasiList.forEach((dest, idx) => {
  const card = document.createElement('div');
  card.className = 'card animate__animated animate__fadeInUp';
  card.innerHTML = `
    <span class="card-title">${dest.nama}</span>
    <img src="${dest.url}" alt="${dest.nama}" class="card-img"/>
  `;
  card.onclick = () => showModal(idx);
  destinasiSection.appendChild(card);
});

// MODAL Logic
const modal = document.getElementById('popup-modal');
const modalContent = document.getElementById('modal-inner');
const closeBtn = document.getElementById('modal-closeBtn');
closeBtn.onclick = () => closeModal();
window.onclick = function(event) {
  if (event.target === modal) closeModal();
};

function showModal(index) {
  const dest = destinasiList[index];
  modal.style.display = 'flex';
  let armadaCards = armadaList.map((armada, i) => `
    <div class="armada-card" onclick="window.selectArmada(${i})" id="armada-card-${i}">
      <img src="${armada.img}" alt="${armada.label}">
      <div class="armada-label">${armada.label}</div>
    </div>
  `).join('');
  modalContent.innerHTML = `
    <img src="${dest.url}" alt="${dest.nama}" class="card-img" style="margin-bottom:0.9rem;"/>
    <div style="margin-bottom:0.8rem;font-weight:700;color:#3a86ff;">${dest.nama}</div>
    <div class="armada-scroll">${armadaCards}</div>
    <form class="selection-form" onsubmit="return false;">
      ${dest.nama==='Kota Lain' ? `
        <label>Masukkan Nama Kota: <input type="text" id="customKota" placeholder="Nama kota tujuan" required></label>
      `:''}
      <label>Pilih Tanggal: <input type="date" id="tanggalInput" required></label>
    </form>
    <button class="button-pesan animate__animated animate__pulse" id="pesanBtn" disabled>Pesan Sekarang</button>
    <button class="button-reset" onclick="closeModal()">Kembali Pilih Destinasi</button>
  `;
  window.selectedArmada = null;
  window.selectedDest = dest.nama;
  window.selectedDestIndex = index;

  armadaList.forEach((_, i) => {
    document.getElementById(`armada-card-${i}`).onclick = () => selectArmada(i);
  });

  document.getElementById('tanggalInput').oninput = checkReadyToPesan;
  if(dest.nama==='Kota Lain'){
    document.getElementById('customKota').oninput = checkReadyToPesan;
  }
  document.getElementById('pesanBtn').onclick = () => {
    const tanggal = document.getElementById('tanggalInput').value;
    let kota = window.selectedDest;
    if(window.selectedDest === 'Kota Lain') {
      kota = document.getElementById('customKota').value;
    }
    kirimPesanWA(kota, window.selectedArmada, tanggal);
  };
}

function selectArmada(idx){
  window.selectedArmada = armadaList[idx].label;
  armadaList.forEach((_,i)=>{
    document.getElementById(`armada-card-${i}`).classList.toggle('selected', i===idx);
  });
  checkReadyToPesan();
}

function checkReadyToPesan() {
  const tanggal = document.getElementById('tanggalInput').value;
  const btn = document.getElementById('pesanBtn');
  let kota = window.selectedDest;
  if(window.selectedDest==='Kota Lain'){
    kota = document.getElementById('customKota').value;
  }
  btn.disabled = !(window.selectedArmada && tanggal && kota);
}

function kirimPesanWA(dest, armada, tanggal){
  const pesan = `Hallo JERLY TRAVEL, saya ingin memesan mohon konfirmasi ketersediaannya :\nDestinasi: ${dest}\nMobil: ${armada}\nTanggal: ${tanggal}`;
  const url = `https://wa.me/${nomorWA}?text=${encodeURIComponent(pesan)}`;
  window.open(url, "_blank");
}

function closeModal(){
  modal.style.display = 'none';
  window.selectedArmada = null;
  window.selectedDest = null;
  window.selectedDestIndex = null;
}