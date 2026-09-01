export interface TopicPreset {
  id: string;
  topic: string;
  category: string;
  geo: string;
  description: string;
}

export const TOPIC_PRESETS: TopicPreset[] = [
  {
    id: 'ai-education',
    topic: 'Kecerdasan Buatan (AI) untuk Guru & Pendidikan',
    category: 'Teknologi & Edukasi',
    geo: 'ID',
    description: 'Pencarian marak mengenai cara guru memanfaatkan AI tanpa melanggar etika akademis.'
  },
  {
    id: 'ev-indonesia',
    topic: 'Mobil Listrik (EV) di Indonesia vs Biaya Perawatan',
    category: 'Otomotif & Finansial',
    geo: 'ID',
    description: 'Banyak ditelusuri terkait kehematan baterai, SPKLU, dan nilai jual kembali.'
  },
  {
    id: 'financial-investing',
    topic: 'Investasi Reksadana & Saham untuk Gaji UMR',
    category: 'Keuangan Pribadi',
    geo: 'ID',
    description: 'Kueri netizen seputar alokasi gaji, risiko instrumen, dan aplikasi legal OJK.'
  },
  {
    id: 'health-intermittent-fasting',
    topic: 'Diet Intermittent Fasting yang Benar untuk Pemula',
    category: 'Kesehatan & Kebugaran',
    geo: 'ID',
    description: 'Pertanyaan seputar jam makan, efek samping maag, dan menu berbuka.'
  },
  {
    id: 'freelance-remote-work',
    topic: 'Kerja Remote Freelance Luar Negeri dari Rumah',
    category: 'Karier & Bisnis',
    geo: 'ID',
    description: 'Kueri mengenai pembayaran via PayPal/Wise, pajak, dan platform terpercaya.'
  },
  {
    id: 'smart-home-solar',
    topic: 'Pasang PLTS Panel Surya Atap Rumah Hemat Listrik',
    category: 'Energi & Properti',
    geo: 'ID',
    description: 'Pencarian terkait biaya pasang awal vs penghematan tagihan PLN tiap bulan.'
  }
];

export const GEO_OPTIONS = [
  { code: 'ID', label: 'Indonesia (ID)' },
  { code: 'GLOBAL', label: 'Global / Seluruh Dunia' },
  { code: 'US', label: 'United States (US)' },
  { code: 'MY', label: 'Malaysia (MY)' },
  { code: 'SG', label: 'Singapore (SG)' }
];

export const TIMEFRAME_OPTIONS = [
  { value: 'now 7-d', label: '7 Hari Terakhir (Trending)' },
  { value: 'today 1-m', label: '30 Hari Terakhir (Aktif)' },
  { value: 'today 3-m', label: '90 Hari Terakhir (Stabil)' },
  { value: 'today 12-m', label: '12 Bulan Terakhir (Tahunan)' }
];
