// Namma Deepavali Jeopardy — clue data, extracted from the source slideshow.
const CATEGORIES = [
  {
    name: "Movie Mania",
    clues: {
      100: { clue: "Which Rajinikanth movie features Chitti?", answer: "Enthiran (Robot)", tag: "Tamil" },
      200: { clue: "Which movie stars Fahadh Faasil as Ranga?", answer: "Aavesham", tag: "Malayalam" },
      300: { clue: "Aju, Divya, and Kuttan are cousins in which film?", answer: "Bangalore Days", tag: "Malayalam" },
      400: { clue: "What ritual is featured in Kantara?", answer: "Bhoota Kola", tag: "Kannada / coastal Karnataka" },
      500: { clue: "Which 2014 Rakshit Shetty film tells one incident from different viewpoints?", answer: "Ulidavaru Kandanthe", tag: "Kannada" },
    },
  },
  {
    name: "Emoji Movie Mashup",
    clues: {
      100: { emoji: "🐶 7️⃣ 7️⃣ 7️⃣", answer: "777 Charlie", tag: "Kannada" },
      200: { emoji: "🦁 ☕ ⛰️", answer: "Leo", tag: "Tamil" },
      300: { emoji: "👪 🎞️ 🎫 👮", answer: "Drishyam", tag: "Malayalam" },
      400: { emoji: "1️⃣ 1️⃣ 👬 ⛰️ ⚫ 🛟", answer: "Manjummel Boys", tag: "Malayalam" },
      500: { emoji: "💈 🗑️ 👑 👧", answer: "Maharaja", tag: "Tamil" },
    },
  },
  {
    name: "Name That Tune",
    clues: {
      100: { clue: "Which movie is “Kaavaalaa” from?", answer: "Jailer", tag: "Tamil" },
      200: { clue: "Which movie features “Malare”?", answer: "Premam", tag: "Malayalam" },
      300: { clue: "Which movie is “Maruvaarthai” from?", answer: "Enai Noki Paayum Thota", tag: "Tamil" },
      400: { clue: "Which film features the song “Belageddu”?", answer: "Kirik Party", tag: "Kannada" },
      500: { clue: "Who composed “Bombe Helutaithe” from Raajakumara?", answer: "V. Harikrishna", tag: "Kannada" },
    },
  },
  {
    name: "Food Fight",
    clues: {
      100: { clue: "Which steamed Kerala breakfast is often served with kadala curry?", answer: "Puttu", tag: "Malayalam / Kerala" },
      200: { clue: "What is Karnataka’s famous spicy rice-and-lentil dish?", answer: "Bisi bele bath", tag: "Kannada / Karnataka" },
      300: { clue: "What Tamil snack is made in a pan with small round wells?", answer: "Kuzhi paniyaram", tag: "Tamil / Tamil Nadu" },
      400: { clue: "Which fried Tamil Deepavali sweet is made from rice flour and jaggery?", answer: "Adhirasam", tag: "Tamil / Tamil Nadu" },
      500: { clue: "Which GI-tagged milk sweet comes from North Karnataka?", answer: "Dharwad peda", tag: "Kannada / Karnataka" },
    },
  },
  {
    name: "Culture Chaos",
    clues: {
      100: { clue: "Which Kerala festival is known for pookalam?", answer: "Onam", tag: "Malayalam / Kerala" },
      200: { clue: "Which Karnataka city is famous for its Dasara palace celebrations?", answer: "Mysuru", tag: "Kannada / Karnataka" },
      300: { clue: "Which day of Pongal celebrates cattle?", answer: "Mattu Pongal", tag: "Tamil / Tamil Nadu" },
      400: { clue: "Name the traditional dance-drama of coastal Karnataka.", answer: "Yakshagana", tag: "Kannada / coastal Karnataka" },
      500: { clue: "Which North Kerala ritual art features elaborate makeup and headgear?", answer: "Theyyam", tag: "Malayalam / North Kerala" },
    },
  },
];

const TEAMS = [
  { id: "ts", label: "TS", full: "Tamil Sangam" },
  { id: "ms", label: "MS", full: "Malayalee Society" },
  { id: "ks", label: "KS", full: "Kannada Sangha" },
];
