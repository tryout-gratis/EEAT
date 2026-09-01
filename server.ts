import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('Warning: GEMINI_API_KEY environment variable is not set. API calls will fail until configured.');
  }
  return new GoogleGenAI({
    apiKey: apiKey || '',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function cleanJsonText(rawText: string): string {
  let cleaned = rawText.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.substring(7);
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.substring(3);
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.substring(0, cleaned.length - 3);
  }
  return cleaned.trim();
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      hasApiKey: !!process.env.GEMINI_API_KEY,
      timestamp: new Date().toISOString(),
    });
  });

  // 1. Analyze Google Trends and Filter Real User Queries & Formulate Questions
  app.post('/api/trends/analyze', async (req, res) => {
    try {
      const { topic, geo = 'ID', timeframe = 'today 1-m', intentFocus = 'All', thinkingMode = true } = req.body;

      if (!topic || typeof topic !== 'string' || !topic.trim()) {
        return res.status(400).json({ error: 'Topik harus diisi.' });
      }

      const ai = getGeminiClient();
      const model = thinkingMode ? 'gemini-3.1-pro-preview' : 'gemini-3.7-flash';

      const prompt = `Anda adalah Spesialis Senior Riset Search Intelligence & Google Trends Analis.
Tugas Anda adalah melakukan riset mendalam terhadap topik: "${topic.trim()}" (Region: ${geo}, Timeframe: ${timeframe}, Focus Intent: ${intentFocus}).

Lakukan riset data tren pencarian Google Trends dan perilaku pencarian netizen yang sebenarnya (Real User Typed Queries).

INSTRUKSI KHUSUS:
1. FILTER REAL USER TYPED QUERIES ONLY:
   - Ambil HANYA kueri organik yang benar-benar diketik oleh manusia/netizen nyata di kolom pencarian Google (misalnya: "apakah diet intermittent fasting aman untuk maag", "cara mulai investasi saham gaji 3 juta", dsb).
   - Buang kueri bot spam, kueri navigasional tanpa konteks (seperti "login fb", "klik link"), dan kata kunci sampah.
2. AMBIL YANG DICARI NETIZEN TERBANYAK:
   - Identifikasi kueri dengan volume pencarian tertinggi (Very High, High, Breakout/Rising) dan tren lonjakan pencarian di netizen.
   - Analisis pain point / kebingungan mendasar yang membuat netizen mengetik kueri tersebut.
3. BANGUN PERTANYAAN YANG MASUK AKAL (LOGICAL QUESTIONS FORMULATION):
   - Dari sekumpulan data kueri netizen terbanyak tersebut, rumuskan 4-6 pertanyaan komprehensif, tajam, dan sangat logis yang mewakili rasa penasaran utama pencari.
   - Kategorikan pertanyaan (Pillar / Utama, Solutif / How-To, Kritis / Mitos, Dilema Netizen, Prediktif).
   - Jelaskan "rationale" (alasan logis mengapa pertanyaan ini krusial untuk dijawab berdasarkan keresahan netizen).

KEMBALIKAN HANYA JSON MURNI DENGAN STRUKTUR BERIKUT (TANPA TEKS PEMBUKA/PENUTUP):
{
  "topic": "${topic.trim()}",
  "geo": "${geo}",
  "timeframe": "${timeframe}",
  "summary": "Ringkasan analisis tren Google & dinamika pencarian netizen saat ini terkait topik ini (2-3 kalimat)",
  "netizenDiscussionContext": "Konteks apa yang sedang viral/ramai dibahas di media sosial & forum pencarian terkait topik ini",
  "topTrendKeywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "queries": [
    {
      "id": "q-1",
      "query": "teks kueri asli yang diketik netizen",
      "searchVolumeLevel": "Very High | High | Moderate | Breakout / Rising",
      "trendScore": 95,
      "intent": "Informational | Problem Solving | How-To / Tutorial | Commercial | Comparative",
      "isRealUserTyped": true,
      "netizenPainPoint": "Rasa takut/kendala/keingintahuan spesifik netizen",
      "growthStatus": "Breakout +500% | Rising | Steady High | Viral",
      "selected": true
    }
  ],
  "formulatedQuestions": [
    {
      "id": "fq-1",
      "question": "Kalimat pertanyaan komprehensif yang masuk akal?",
      "category": "Pillar / Utama | Solutif / How-To | Kritis / Mitos | Dilema Netizen | Prediktif / Masa Depan",
      "rationale": "Mengapa pertanyaan ini sangat dibutuhkan netizen berdasarkan data kueri di atas",
      "sourceQueries": ["kueri terkait 1", "kueri terkait 2"],
      "selected": true
    }
  ]
}

Berikan minimal 8 kueri netizen berkualitas tinggi dan 5 pertanyaan logis yang dirumuskan dengan sangat baik.`;

      const config: any = {
        tools: [{ googleSearch: {} }],
      };

      if (thinkingMode) {
        config.thinkingConfig = { thinkingLevel: ThinkingLevel.HIGH };
      }

      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config,
      });

      const responseText = response.text || '';
      const cleanedJson = cleanJsonText(responseText);
      const parsedData = JSON.parse(cleanedJson);

      return res.json({
        success: true,
        data: parsedData,
        modelUsed: model,
        thinkingMode,
      });
    } catch (error: any) {
      console.error('Error analyzing trends:', error);
      return res.status(500).json({
        error: error.message || 'Gagal menganalisis tren pencarian Google. Pastikan API key valid.',
      });
    }
  });

  // 2. Generate Google E-E-A-T Compliant Article
  app.post('/api/article/generate', async (req, res) => {
    try {
      const {
        topic,
        primaryQuestion,
        subQuestions = [],
        queries = [],
        targetAudience = 'Praktisi, Pemula hingga Menengah yang mencari panduan terpercaya',
        tone = 'Otoritatif, Informatif, Edukatif, dan Empatik',
        language = 'Bahasa Indonesia',
        thinkingMode = true,
        customInstructions = '',
      } = req.body;

      if (!topic || !primaryQuestion) {
        return res.status(400).json({ error: 'Topik dan Pertanyaan Utama harus disediakan.' });
      }

      const ai = getGeminiClient();
      // Use gemini-3.1-pro-preview with thinkingLevel HIGH as instructed for high thinking
      const model = thinkingMode ? 'gemini-3.1-pro-preview' : 'gemini-3.7-flash';

      const prompt = `Anda adalah Master SEO Content Strategist & Jurnalis Berpengalaman yang menguasai pedoman Google Search Quality Rater Guidelines (E-E-A-T: Experience, Expertise, Authoritativeness, Trustworthiness).

Tugas Anda adalah menulis artikel komprehensif, mendalam, dan berbobot tinggi berdasarkan pertanyaan utama dan sub-pertanyaan yang diturunkan dari kueri Google Trends netizen nyata.

DETAIL INPUT RISET:
- Topik: "${topic}"
- Pertanyaan Utama (Primary Focus): "${primaryQuestion}"
- Sub-Pertanyaan yang Harus Dijawab:
${subQuestions.map((q: string, idx: number) => `  ${idx + 1}. ${q}`).join('\n')}
- Kueri Pencarian Netizen Terkait:
${queries.map((q: string, idx: number) => `  - ${q}`).join('\n')}
- Target Pembaca: ${targetAudience}
- Tone of Voice: ${tone}
- Bahasa: ${language}
${customInstructions ? `- Instruksi Tambahan Pengguna: ${customInstructions}` : ''}

STANDAR E-E-A-T GOOGLE YANG WAJIB DIPENUHI SECARA KETAT:
1. EXPERIENCE (Pengalaman Nyata):
   - Sertakan studi kasus konkret, contoh skenario dunia nyata, simulasi langkah demi langkah, dan kendala praktis ("lapangan") yang biasa dialami orang sungguhan.
2. EXPERTISE (Keahlian Mendalam):
   - Jelaskan konsep dengan presisi tinggi, struktur logis, istilah tepat (dengan analogi ramah pemula), dan kerangka kerja (framework) pemecahan masalah yang solid.
3. AUTHORITATIVENESS (Otoritas & Reputasi):
   - Berikan referensi standar industri, rujukan regulasi/data ilmiah/survei kredibel, dan posisi komparasi yang objektif.
4. TRUSTWORTHINESS (Kepercayaan & Transparansi):
   - Bersikap transparan: cantumkan pro & kontra, batasan metode, disclaimer penting, tanpa klaim sensasional atau clickbait murahan.

FORMAT STRUKTUR ARTIKEL YANG DIHASILKAN (MARKDOWN KAYA):
- Judul Utama (H1) yang menarik, berbobot, dan mencerminkan Search Intent
- Ringkasan Eksekutif / Key Takeaways Box
- Penjelasan Latar Belakang & Mengapa Topik Ini Krusial Bagi Netizen
- Bagian Inti Pembahasan (H2 dan H3) yang menjawab setiap sub-pertanyaan secara runtut
- Tabel Komparasi / Langkah Aksi Praktis (Actionable Checklist)
- Studi Kasus Nyata / Skenario Pengalaman (Experience Section)
- Bagian FAQ Schema (Pertanyaan yang Sering Diajukan Netizen)
- Kesimpulan & Rekomendasi Solutif
- Catatan Transparansi & Metodologi Penulisan

KEMBALIKAN RESPON HANYA DALAM FORMAT JSON BERIKUT (TANPA TAMBAHAN TEKS LAIN):
{
  "id": "art-${Date.now()}",
  "topic": "${topic}",
  "primaryQuestion": "${primaryQuestion}",
  "subQuestions": ${JSON.stringify(subQuestions)},
  "seoMeta": {
    "title": "Judul SEO 50-60 karakter optimal untuk SERP CTR",
    "metaDescription": "Meta deskripsi 140-160 karakter merangkum solusi dan nilai tambah artikel",
    "slug": "url-slug-seo-friendly",
    "primaryKeyword": "keyword utama",
    "secondaryKeywords": ["keyword pendukung 1", "keyword pendukung 2", "keyword pendukung 3"],
    "targetAudience": "${targetAudience}",
    "estimatedReadTimeMinutes": 7,
    "wordCount": 1600
  },
  "markdownContent": "Seluruh teks artikel dalam format Markdown lengkap dengan heading #, ##, ###, bullet list, table, blockquote, bold text, dsb.",
  "faqs": [
    {
      "question": "Pertanyaan FAQ 1 yang mewakili netizen?",
      "answer": "Jawaban langsung, ringkas, dan jelas (2-3 kalimat)."
    }
  ],
  "eeatAudit": {
    "overallScore": 96,
    "experience": {
      "score": 95,
      "status": "Excellent",
      "highlights": ["Penerapan contoh kasus nyata", "Solusi kendala praktis di lapangan"],
      "recommendations": ["Pertahankan sudut pandang aplikatif"]
    },
    "expertise": {
      "score": 98,
      "status": "Excellent",
      "highlights": ["Penjelasan teknis runut", "Struktur informasi komprehensif"],
      "recommendations": ["Framework terdefinisi secara ilmiah"]
    },
    "authoritativeness": {
      "score": 94,
      "status": "Excellent",
      "highlights": ["Rujukan standar industri", "Komparasi objektif"],
      "recommendations": ["Cocok untuk dijadikan referensi kutipan"]
    },
    "trustworthiness": {
      "score": 97,
      "status": "Excellent",
      "highlights": ["Transparansi batasan dan risiko", "Bebas clickbait"],
      "recommendations": ["Disclaimer etis dan keamanan disajikan jelas"]
    },
    "keyEEATElementsIncluded": [
      "Real-world Case Studies & Step-by-Step Practical Blueprint",
      "Authoritative Benchmarks & Terminology Precision",
      "Objective Pros & Cons Matrix",
      "Structured FAQ Schema answering top trending queries"
    ]
  }
}`;

      const config: any = {
        tools: [{ googleSearch: {} }],
      };

      if (thinkingMode) {
        config.thinkingConfig = { thinkingLevel: ThinkingLevel.HIGH };
      }

      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config,
      });

      const responseText = response.text || '';
      const cleanedJson = cleanJsonText(responseText);
      const parsedData = JSON.parse(cleanedJson);

      return res.json({
        success: true,
        data: {
          ...parsedData,
          createdAt: new Date().toISOString(),
          modelUsed: model,
          thinkingMode,
        },
      });
    } catch (error: any) {
      console.error('Error generating EEAT article:', error);
      return res.status(500).json({
        error: error.message || 'Gagal menghasilkan artikel EEAT. Silakan coba kembali.',
      });
    }
  });

  // 3. Improve / Refine Specific Section of the Article
  app.post('/api/article/improve', async (req, res) => {
    try {
      const { article, instruction, dimensionToBoost = 'all', thinkingMode = true } = req.body;

      if (!article || !instruction) {
        return res.status(400).json({ error: 'Artikel dan instruksi perbaikan harus ada.' });
      }

      const ai = getGeminiClient();
      const model = thinkingMode ? 'gemini-3.1-pro-preview' : 'gemini-3.7-flash';

      const prompt = `Anda adalah Editor Senior EEAT Google. Perbaiki dan tingkatkan kualitas artikel berikut sesuai instruksi spesifik pengguna.

Instruksi Perbaikan: "${instruction}"
Fokus Dimensi EEAT yang Ditingkatkan: "${dimensionToBoost}"

Artikel Saat Ini:
${article.markdownContent}

Tugas Anda:
1. Tingkatkan konten Markdown artikel dengan memperkuat unsur E-E-A-T sesuai instruksi.
2. Perbarui EEAT Audit score dan highlights.
3. Pertahankan format JSON rapi.

KEMBALIKAN RESPON DALAM FORMAT JSON BERIKUT:
{
  "updatedMarkdownContent": "Markdown artikel yang sudah disempurnakan",
  "improvementSummary": "Poin-poin perubahan yang telah dilakukan untuk memperkuat EEAT",
  "updatedEeatAudit": {
    "overallScore": 98,
    "experience": { "score": 98, "status": "Excellent", "highlights": ["..."], "recommendations": ["..."] },
    "expertise": { "score": 98, "status": "Excellent", "highlights": ["..."], "recommendations": ["..."] },
    "authoritativeness": { "score": 96, "status": "Excellent", "highlights": ["..."], "recommendations": ["..."] },
    "trustworthiness": { "score": 98, "status": "Excellent", "highlights": ["..."], "recommendations": ["..."] },
    "keyEEATElementsIncluded": ["..."]
  }
}`;

      const config: any = {};
      if (thinkingMode) {
        config.thinkingConfig = { thinkingLevel: ThinkingLevel.HIGH };
      }

      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config,
      });

      const responseText = response.text || '';
      const cleanedJson = cleanJsonText(responseText);
      const parsedData = JSON.parse(cleanedJson);

      return res.json({
        success: true,
        data: parsedData,
      });
    } catch (error: any) {
      console.error('Error improving article:', error);
      return res.status(500).json({
        error: error.message || 'Gagal memperbarui artikel.',
      });
    }
  });

  // Vite middleware for development vs static in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`TrendEEAT Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Server startup error:', err);
});
