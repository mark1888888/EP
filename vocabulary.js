/**
 * VocabularyTraining v8 — 英文單字練習
 * 國中生專屬 | 1857 個單字 | CEFR A1–C1
 *
 * 包含:
 *   BUILTIN  — 1857 個內建單字陣列
 *   GRAMMAR  — 文法題庫
 *   全部 UI 邏輯、練習模式、遊戲模式
 *
 * ── Supabase 設定 ──────────────────────────────────────────────
 * 請將下方兩個變數換成你的 Supabase 專案資訊：
 *   Project Settings > API > Project URL / anon public
 */
const SUPABASE_URL      = 'https://npoywbdzyydygkrjyilw.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_MWiMxUtglsKLzF-pDZqDLw_FA_go-ho';

// Supabase client（由 HTML 的 CDN script 提供 supabase 全域物件）
let _sb = null;
function getSB(){
  if(!_sb && window.supabase){
    _sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return _sb;
}

// SHA-256 密碼雜湊（瀏覽器原生 Web Crypto API）
async function sha256(str){
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,'0')).join('');
}

const LV=["國一","國二","國三"];
const LB_CLS=["bp","bb","bg"];

const BUILTIN=[
  {w:"abandon",ph:"/əˈbændən/",pos:"v. 動詞",zh:"放棄；拋棄",ex:"She *abandoned* the project.",lv:2,cefr:"B2"},
  {w:"ability",ph:"/əˈbɪlɪti/",pos:"n. 名詞",zh:"能力",ex:"She has the *ability* to learn quickly.",lv:1,cefr:"B1"},
  {w:"able",ph:"/ˈeɪbl/",pos:"adj. 形容詞",zh:"有能力的",ex:"She is *able* to speak three languages.",lv:0,cefr:"A2"},
  {w:"above",ph:"/əˈbʌv/",pos:"prep. 介系詞",zh:"在...上方",ex:"*Above* the clouds.",lv:0,cefr:"A1"},
  {w:"abroad",ph:"/əˈbrɔːd/",pos:"adv. 副詞",zh:"在國外",ex:"She wants to study *abroad* next year.",lv:0,cefr:"B1"},
  {w:"absence",ph:"/ˈæbsəns/",pos:"n. 名詞",zh:"缺席",ex:"His *absence* was noticed by everyone.",lv:1,cefr:"B1"},
  {w:"absent",ph:"/ˈæbsənt/",pos:"adj. 形容詞",zh:"缺席的",ex:"He was *absent* from school yesterday.",lv:0,cefr:"A2"},
  {w:"abstract",ph:"/ˈæbstrækt/",pos:"adj. 形容詞",zh:"抽象的",ex:"Art can be very *abstract* and hard to understand.",lv:2,cefr:"B2"},
  {w:"accept",ph:"/əkˈsɛpt/",pos:"v. 動詞",zh:"接受",ex:"She was happy to *accept* the award.",lv:0,cefr:"B1"},
  {w:"accident",ph:"/ˈæksɪdənt/",pos:"n. 名詞",zh:"意外事故",ex:"There was a car *accident* on the road.",lv:0,cefr:"A2"},
  {w:"accomplish",ph:"/əˈkɒmplɪʃ/",pos:"v. 動詞",zh:"完成",ex:"She *accomplished* all her goals.",lv:1,cefr:"B2"},
  {w:"accumulate",ph:"/əˈkjuːmjəleɪt/",pos:"v. 動詞",zh:"積累",ex:"Knowledge *accumulates* over time.",lv:2,cefr:"B2"},
  {w:"accurate",ph:"/ˈækjərɪt/",pos:"adj. 形容詞",zh:"準確的",ex:"The report must be *accurate*.",lv:1,cefr:"B2"},
  {w:"achieve",ph:"/əˈtʃiːv/",pos:"v. 動詞",zh:"達成",ex:"Hard work helps you *achieve* your goals.",lv:1,cefr:"B1"},
  {w:"achievement",ph:"/əˈtʃiːvmənt/",pos:"n. 名詞",zh:"成就",ex:"That is a great *achievement*.",lv:2,cefr:"B2"},
  {w:"acknowledge",ph:"/əkˈnɒlɪdʒ/",pos:"v. 動詞",zh:"承認",ex:"She *acknowledged* her mistake.",lv:1,cefr:"B1"},
  {w:"acquire",ph:"/əˈkwaɪər/",pos:"v. 動詞",zh:"獲得",ex:"She hopes to *acquire* new skills at work.",lv:2,cefr:"B2"},
  {w:"across",ph:"/əˈkrɒs/",pos:"prep. 介系詞",zh:"穿越；在對面",ex:"Walk *across* the street.",lv:0,cefr:"A2"},
  {w:"action",ph:"/ˈækʃən/",pos:"n. 名詞",zh:"行動",ex:"We need to take *action* now.",lv:0,cefr:"A2"},
  {w:"activity",ph:"/ækˈtɪvɪti/",pos:"n. 名詞",zh:"活動",ex:"Swimming is my favorite *activity*.",lv:0,cefr:"A2"},
  {w:"actor",ph:"/ˈæktər/",pos:"n. 名詞",zh:"演員",ex:"She is a famous *actor*.",lv:0,cefr:"A2"},
  {w:"actually",ph:"/ˈæktʃuəli/",pos:"adv. 副詞",zh:"實際上",ex:"*Actually*, I disagree.",lv:1,cefr:"B1"},
  {w:"adapt",ph:"/əˈdæpt/",pos:"v. 動詞",zh:"適應",ex:"It takes time to *adapt* to a new school.",lv:1,cefr:"B1"},
  {w:"add",ph:"/æd/",pos:"v. 動詞",zh:"加",ex:"Please *add* your name to the list.",lv:0,cefr:"A2"},
  {w:"address",ph:"/əˈdrɛs/",pos:"n.",zh:"地址",ex:"What is your *address*?",lv:0,cefr:"A2"},
  {w:"adequate",ph:"/ˈædɪkwɪt/",pos:"adj. 形容詞",zh:"足夠的",ex:"The food supply is *adequate*.",lv:1,cefr:"B1"},
  {w:"admire",ph:"/ədˈmaɪər/",pos:"v. 動詞",zh:"欽佩",ex:"I *admire* her courage.",lv:1,cefr:"B1"},
  {w:"admit",ph:"/ədˈmɪt/",pos:"v.",zh:"承認",ex:"He *admitted* his mistake.",lv:1,cefr:"B1"},
  {w:"adopt",ph:"/əˈdɒpt/",pos:"v. 動詞",zh:"採用",ex:"They decided to *adopt* a puppy.",lv:1,cefr:"B1"},
  {w:"adult",ph:"/ˈædʌlt/",pos:"n.",zh:"成人",ex:"This movie is for *adults* only.",lv:0,cefr:"A2"},
  {w:"advantage",ph:"/ədˈvɑːntɪdʒ/",pos:"n. 名詞",zh:"優勢",ex:"Being tall is an *advantage* in basketball.",lv:1,cefr:"B1"},
  {w:"adventure",ph:"/ədˈvɛntʃər/",pos:"n. 名詞",zh:"冒險",ex:"Life is an *adventure*.",lv:1,cefr:"B1"},
  {w:"advertise",ph:"/ˈædvərtaɪz/",pos:"v.",zh:"廣告",ex:"Companies *advertise* on TV.",lv:1,cefr:"B1"},
  {w:"advice",ph:"/ədˈvaɪs/",pos:"n. 名詞",zh:"建議",ex:"She gave me good *advice*.",lv:0,cefr:"B1"},
  {w:"advocate",ph:"/ˈædvəkeɪt/",pos:"v.",zh:"提倡",ex:"She *advocates* for animal rights.",lv:2,cefr:"B2"},
  {w:"aesthetic",ph:"/iːsˈθɛtɪk/",pos:"adj. 形容詞",zh:"美學的",ex:"The design has *aesthetic* appeal.",lv:2,cefr:"B2"},
  {w:"affect",ph:"/əˈfɛkt/",pos:"v. 動詞",zh:"影響",ex:"Stress can *affect* your health.",lv:1,cefr:"B1"},
  {w:"afford",ph:"/əˈfɔːrd/",pos:"v. 動詞",zh:"負擔得起",ex:"I can't *afford* a new phone.",lv:0,cefr:"B1"},
  {w:"afraid",ph:"/əˈfreɪd/",pos:"adj. 形容詞",zh:"害怕的",ex:"He is *afraid* of dogs.",lv:0,cefr:"A2"},
  {w:"afternoon",ph:"/ˌæftərˈnuːn/",pos:"n. 名詞",zh:"下午",ex:"She naps in the *afternoon*.",lv:0,cefr:"A1"},
  {w:"against",ph:"/əˈɡɛnst/",pos:"prep. 介系詞",zh:"反對；靠著",ex:"*Against* the wall.",lv:0,cefr:"A2"},
  {w:"age",ph:"/eɪdʒ/",pos:"n. 名詞",zh:"年齡",ex:"What is your *age*?",lv:0,cefr:"A2"},
  {w:"age group",ph:"/ˈeɪdʒ ɡruːp/",pos:"n. 名詞",zh:"年齡層",ex:"This show is for all *age groups*.",lv:1,cefr:"B1"},
  {w:"aggressive",ph:"/əˈɡrɛsɪv/",pos:"adj. 形容詞",zh:"侵略性的；積極進取的",ex:"He has an *aggressive* nature.",lv:2,cefr:"B2"},
  {w:"agree",ph:"/əˈɡriː/",pos:"v. 動詞",zh:"同意",ex:"I *agree* with your idea.",lv:0,cefr:"A2"},
  {w:"ahead",ph:"/əˈhɛd/",pos:"adv. 副詞",zh:"在前面",ex:"Look *ahead* and keep walking.",lv:0,cefr:"A2"},
  {w:"aim",ph:"/eɪm/",pos:"v.",zh:"目的",ex:"She *aims* to finish the project on time.",lv:0,cefr:"A2"},
  {w:"air",ph:"nan",pos:"n.",zh:"空氣",ex:"The *air* is fresh here.",lv:0,cefr:"A1"},
  {w:"airplane",ph:"/ˈɛrpleɪn/",pos:"n.",zh:"飛機",ex:"We took an *airplane*.",lv:0,cefr:"A2"},
  {w:"airport",ph:"nan",pos:"n.",zh:"機場",ex:"We arrived at the *airport* early.",lv:0,cefr:"A1"},
  {w:"alarm",ph:"/əˈlɑːrm/",pos:"n. 名詞",zh:"鬧鐘",ex:"The *alarm* woke me up at six.",lv:0,cefr:"A2"},
  {w:"albeit",ph:"/ɔːlˈbiːɪt/",pos:"conj. 連接詞",zh:"雖然",ex:"She accepted, *albeit* reluctantly.",lv:2,cefr:"B2"},
  {w:"album",ph:"/ˈælbəm/",pos:"n.",zh:"相簿",ex:"A photo *album*.",lv:0,cefr:"A2"},
  {w:"alienate",ph:"/ˈeɪlɪəneɪt/",pos:"v. 動詞",zh:"疏遠",ex:"His rude behavior *alienated* his friends.",lv:2,cefr:"B2"},
  {w:"alive",ph:"/əˈlaɪv/",pos:"adj. 形容詞",zh:"活著的",ex:"The fish is still *alive*.",lv:0,cefr:"A2"},
  {w:"allergy",ph:"/ˈælədʒi/",pos:"n. 名詞",zh:"過敏",ex:"She has a food *allergy*.",lv:1,cefr:"B1"},
  {w:"alleviate",ph:"/əˈliːvɪeɪt/",pos:"v. 動詞",zh:"減輕",ex:"Rest *alleviates* stress.",lv:2,cefr:"B2"},
  {w:"allocate",ph:"/ˈæləkeɪt/",pos:"v. 動詞",zh:"分配",ex:"The school will *allocate* funds for new books.",lv:2,cefr:"B2"},
  {w:"allow",ph:"/əˈlaʊ/",pos:"v. 動詞",zh:"允許",ex:"The teacher does not *allow* phones in class.",lv:1,cefr:"B1"},
  {w:"almost",ph:"/ˈɔːlmoʊst/",pos:"adv. 副詞",zh:"幾乎",ex:"She *almost* fell.",lv:0,cefr:"A2"},
  {w:"alone",ph:"/əˈləʊn/",pos:"adj.",zh:"單獨的",ex:"She went to the park *alone*.",lv:0,cefr:"A2"},
  {w:"along",ph:"/əˈlɒŋ/",pos:"prep.",zh:"沿著",ex:"We walked *along* the river.",lv:0,cefr:"A2"},
  {w:"aloud",ph:"/əˈlaʊd/",pos:"adv. 副詞",zh:"大聲地",ex:"Please read the sentence *aloud*.",lv:0,cefr:"A2"},
  {w:"already",ph:"/ɔːlˈrɛdi/",pos:"adv. 副詞",zh:"已經",ex:"She has *already* finished her homework.",lv:0,cefr:"A1"},
  {w:"also",ph:"nan",pos:"adv.",zh:"也",ex:"I *also* like music.",lv:0,cefr:"A1"},
  {w:"alternative",ph:"/ɔːlˈtɜːrnətɪv/",pos:"n. 名詞",zh:"替代方案",ex:"Is there an *alternative*?",lv:2,cefr:"B2"},
  {w:"although",ph:"/ɔːlˈðəʊ/",pos:"conj. 連接詞",zh:"雖然",ex:"*although* it was late, she kept studying.",lv:1,cefr:"B1"},
  {w:"always",ph:"/ˈɔːlweɪz/",pos:"adv. 副詞",zh:"總是",ex:"She *always* arrives on time.",lv:0,cefr:"A2"},
  {w:"amazing",ph:"/əˈmeɪzɪŋ/",pos:"adj. 形容詞",zh:"驚人的",ex:"The view from the mountain is *amazing*.",lv:0,cefr:"B1"},
  {w:"ambiguous",ph:"/æmˈbɪɡjuəs/",pos:"adj. 形容詞",zh:"模糊的",ex:"The instructions were *ambiguous*.",lv:2,cefr:"C1"},
  {w:"ambition",ph:"/æmˈbɪʃən/",pos:"n. 名詞",zh:"抱負",ex:"She has great *ambition*.",lv:1,cefr:"B1"},
  {w:"ambivalent",ph:"/æmˈbɪvələnt/",pos:"adj. 形容詞",zh:"矛盾的",ex:"She felt *ambivalent* about moving abroad.",lv:2,cefr:"B2"},
  {w:"ambulance",ph:"/ˈæmbjʊləns/",pos:"n. 名詞",zh:"救護車",ex:"Call an *ambulance*!",lv:0,cefr:"A2"},
  {w:"among",ph:"/əˈmʌŋ/",pos:"prep. 介系詞",zh:"在...之中",ex:"She is the best *among* her friends.",lv:0,cefr:"A2"},
  {w:"amount",ph:"/əˈmaʊnt/",pos:"n. 名詞",zh:"數量；金額",ex:"A large *amount*.",lv:0,cefr:"A2"},
  {w:"analogy",ph:"/əˈnælədʒi/",pos:"n. 名詞",zh:"類比",ex:"The teacher used an *analogy* to explain the concept.",lv:2,cefr:"B2"},
  {w:"analyze",ph:"/ˈænəlaɪz/",pos:"v. 動詞",zh:"分析",ex:"Scientists *analyze* data carefully.",lv:1,cefr:"B2"},
  {w:"ancient",ph:"/ˈeɪnʃənt/",pos:"adj. 形容詞",zh:"古老的",ex:"This is an *ancient* temple.",lv:1,cefr:"B1"},
  {w:"angry",ph:"/ˈæŋɡri/",pos:"adj. 形容詞",zh:"生氣的",ex:"He was *angry* when he lost the game.",lv:0,cefr:"A2"},
  {w:"animal",ph:"/ˈænɪməl/",pos:"n. 名詞",zh:"動物",ex:"A dog is a friendly *animal*.",lv:0,cefr:"A1"},
  {w:"ankle",ph:"/ˈæŋkəl/",pos:"n. 名詞",zh:"腳踝",ex:"She sprained her *ankle*.",lv:0,cefr:"A2"},
  {w:"announce",ph:"/əˈnaʊns/",pos:"v. 動詞",zh:"宣布",ex:"The teacher *announced* the test date.",lv:1,cefr:"B1"},
  {w:"annoying",ph:"/əˈnɔɪɪŋ/",pos:"adj. 形容詞",zh:"惱人的",ex:"That noise is *annoying*.",lv:0,cefr:"A2"},
  {w:"another",ph:"/əˈnʌðər/",pos:"adj. 形容詞",zh:"另一個",ex:"Can I have *another* cookie?",lv:0,cefr:"A2"},
  {w:"answer",ph:"/ˈænsər/",pos:"n.",zh:"回答",ex:"Please *answer* the question.",lv:0,cefr:"A1"},
  {w:"ant",ph:"/ænt/",pos:"n. 名詞",zh:"螞蟻",ex:"*Ants* work hard.",lv:0,cefr:"A1"},
  {w:"anticipate",ph:"/ænˈtɪsɪpeɪt/",pos:"v.",zh:"預料",ex:"We *anticipated* the problem.",lv:2,cefr:"B2"},
  {w:"anyway",ph:"/ˈɛniweɪ/",pos:"adv. 副詞",zh:"不管怎樣",ex:"Thanks *anyway*.",lv:0,cefr:"A2"},
  {w:"apartment",ph:"/əˈpɑːrtmənt/",pos:"n. 名詞",zh:"公寓",ex:"They live in a small *apartment*.",lv:0,cefr:"A2"},
  {w:"apologize",ph:"/əˈpɒlədʒaɪz/",pos:"v.",zh:"道歉",ex:"He *apologized*.",lv:1,cefr:"B1"},
  {w:"app",ph:"/æp/",pos:"n. 名詞",zh:"應用程式",ex:"Download the *app*.",lv:0,cefr:"A2"},
  {w:"appear",ph:"/əˈpɪər/",pos:"v. 動詞",zh:"出現",ex:"A rainbow *appeared* after the rain.",lv:0,cefr:"B1"},
  {w:"apple",ph:"/ˈæpəl/",pos:"n. 名詞",zh:"蘋果",ex:"I eat an *apple* a day.",lv:0,cefr:"A2"},
  {w:"apply",ph:"/əˈplaɪ/",pos:"v. 動詞",zh:"申請",ex:"She will *apply* for a scholarship.",lv:1,cefr:"B1"},
  {w:"appointment",ph:"/əˈpɔɪntmənt/",pos:"n. 名詞",zh:"預約",ex:"I have a doctor's *appointment* today.",lv:0,cefr:"B1"},
  {w:"appreciate",ph:"/əˈpriːʃieɪt/",pos:"v. 動詞",zh:"感激",ex:"I really *appreciate* your help.",lv:1,cefr:"B1"},
  {w:"approach",ph:"/əˈprəʊtʃ/",pos:"v.",zh:"接近",ex:"We need a new *approach* to solve this.",lv:1,cefr:"B1"},
  {w:"appropriate",ph:"/əˈproʊpriɪt/",pos:"adj.",zh:"適當的",ex:"Choose *appropriate* words.",lv:2,cefr:"B2"},
  {w:"approximately",ph:"/əˈprɒksɪmɪtli/",pos:"adv. 副詞",zh:"大約",ex:"It takes *approximately* an hour.",lv:2,cefr:"B2"},
  {w:"April",ph:"/ˈeɪprəl/",pos:"n. 名詞",zh:"四月",ex:"It often rains in *April*.",lv:0,cefr:"A1"},
  {w:"area",ph:"/ˈɛərɪə/",pos:"n. 名詞",zh:"區域",ex:"This is a quiet residential *area*.",lv:0,cefr:"A2"},
  {w:"argue",ph:"/ˈɑːɡjuː/",pos:"v. 動詞",zh:"爭論",ex:"They always *argue* about small things.",lv:1,cefr:"B1"},
  {w:"arm",ph:"/ɑːrm/",pos:"n.",zh:"手臂",ex:"She hurt her *arm*.",lv:0,cefr:"A1"},
  {w:"around",ph:"/əˈraʊnd/",pos:"prep.",zh:"在周圍",ex:"There are trees *around* the school.",lv:0,cefr:"A2"},
  {w:"arrange",ph:"/əˈreɪndʒ/",pos:"v. 動詞",zh:"安排",ex:"She *arranged* the meeting for Tuesday.",lv:1,cefr:"B1"},
  {w:"arrive",ph:"/əˈraɪv/",pos:"v. 動詞",zh:"到達",ex:"We will *arrive* at the airport at noon.",lv:0,cefr:"A2"},
  {w:"art",ph:"/ɑːrt/",pos:"n. 名詞",zh:"藝術",ex:"She is very good at *art*.",lv:0,cefr:"A1"},
  {w:"article",ph:"/ˈɑːrtɪkəl/",pos:"n.",zh:"文章",ex:"An *article* about climate.",lv:1,cefr:"B1"},
  {w:"articulate",ph:"/ɑːˈtɪkjəleɪt/",pos:"v.",zh:"清楚表達",ex:"She *articulated* her ideas clearly.",lv:2,cefr:"B2"},
  {w:"artist",ph:"/ˈɑːrtɪst/",pos:"n. 名詞",zh:"藝術家",ex:"She is a famous *artist*.",lv:0,cefr:"A2"},
  {w:"ask",ph:"/æsk/",pos:"v. 動詞",zh:"詢問",ex:"She will *ask* the teacher for help.",lv:0,cefr:"A1"},
  {w:"asleep",ph:"/əˈsliːp/",pos:"adj. 形容詞",zh:"睡著的",ex:"The baby is *asleep* now.",lv:0,cefr:"A2"},
  {w:"aspect",ph:"/ˈæspɛkt/",pos:"n.",zh:"方面",ex:"Every *aspect*.",lv:2,cefr:"B2"},
  {w:"assert",ph:"/əˈsɜːrt/",pos:"v. 動詞",zh:"斷言",ex:"He *asserted* that the experiment was flawed.",lv:2,cefr:"B2"},
  {w:"assertion",ph:"/əˈsɜːʃən/",pos:"n. 名詞",zh:"斷言",ex:"His *assertion* was backed by evidence.",lv:2,cefr:"B2"},
  {w:"assess",ph:"/əˈsɛs/",pos:"v.",zh:"評估",ex:"*Assess* your strengths.",lv:2,cefr:"B2"},
  {w:"assist",ph:"/əˈsɪst/",pos:"v. 動詞",zh:"協助",ex:"Can you *assist* me with this task?",lv:1,cefr:"B1"},
  {w:"assistant",ph:"/əˈsɪstənt/",pos:"n.",zh:"助理",ex:"The *assistant* helped.",lv:1,cefr:"B1"},
  {w:"associate",ph:"/əˈsəʊʃɪeɪt/",pos:"v. 動詞",zh:"聯繫",ex:"We often *associate* red with danger.",lv:1,cefr:"B1"},
  {w:"assume",ph:"/əˈsjuːm/",pos:"v. 動詞",zh:"假設",ex:"Don't *assume* you know the answer.",lv:2,cefr:"B2"},
  {w:"assumption",ph:"/əˈsʌmpʃən/",pos:"n. 名詞",zh:"假設",ex:"Don't make *assumptions* without proof.",lv:2,cefr:"B2"},
  {w:"atmosphere",ph:"/ˈætməsfɪər/",pos:"n. 名詞",zh:"氣氛",ex:"The *atmosphere* at the party was great.",lv:1,cefr:"B1"},
  {w:"attempt",ph:"/əˈtɛmpt/",pos:"v. 動詞",zh:"嘗試",ex:"She *attempted* the test.",lv:1,cefr:"B1"},
  {w:"attend",ph:"/əˈtɛnd/",pos:"v. 動詞",zh:"出席",ex:"All students must *attend* the ceremony.",lv:0,cefr:"B1"},
  {w:"attention",ph:"/əˈtɛnʃən/",pos:"n. 名詞",zh:"注意力",ex:"Please pay *attention* in class.",lv:0,cefr:"B1"},
  {w:"attitude",ph:"/ˈætɪtjuːd/",pos:"n. 名詞",zh:"態度",ex:"A positive *attitude* helps you succeed.",lv:1,cefr:"B2"},
  {w:"attract",ph:"/əˈtrækt/",pos:"v. 動詞",zh:"吸引",ex:"The new store *attracts* many customers.",lv:1,cefr:"B1"},
  {w:"audience",ph:"/ˈɔːdiəns/",pos:"n.",zh:"觀眾",ex:"The *audience* clapped.",lv:1,cefr:"B1"},
  {w:"August",ph:"/ˈɔːɡəst/",pos:"n. 名詞",zh:"八月",ex:"We go on vacation in *August*.",lv:0,cefr:"A1"},
  {w:"aunt",ph:"nan",pos:"n.",zh:"阿姨",ex:"My *aunt* lives nearby.",lv:0,cefr:"A1"},
  {w:"authentic",ph:"/ɔːˈθɛntɪk/",pos:"adj. 形容詞",zh:"真實的",ex:"This is an *authentic* Italian restaurant.",lv:2,cefr:"B2"},
  {w:"authority",ph:"/ɔːˈθɒrɪti/",pos:"n.",zh:"權威",ex:"Respect *authority*.",lv:2,cefr:"B2"},
  {w:"autonomy",ph:"/ɔːˈtɒnəmi/",pos:"n. 名詞",zh:"自主",ex:"Students need *autonomy* in their learning.",lv:2,cefr:"B2"},
  {w:"available",ph:"/əˈveɪləbl/",pos:"adj. 形容詞",zh:"可得到的",ex:"Is the doctor *available* now?",lv:1,cefr:"B1"},
  {w:"average",ph:"/ˈævərɪdʒ/",pos:"adj. 形容詞",zh:"平均的",ex:"The *average* score was 80.",lv:1,cefr:"B1"},
  {w:"avoid",ph:"/əˈvɔɪd/",pos:"v. 動詞",zh:"避免",ex:"Try to *avoid* eating too much sugar.",lv:1,cefr:"B1"},
  {w:"award",ph:"/əˈwɔːrd/",pos:"n.",zh:"獎項",ex:"She won an *award*.",lv:0,cefr:"A2"},
  {w:"aware",ph:"/əˈwɛr/",pos:"adj. 形容詞",zh:"意識到的",ex:"Are you *aware* of the risks?",lv:1,cefr:"B2"},
  {w:"away",ph:"/əˈweɪ/",pos:"adv. 副詞",zh:"離開",ex:"Please go *away*.",lv:0,cefr:"A2"},
  {w:"baby",ph:"/ˈbeɪbi/",pos:"n. 名詞",zh:"嬰兒",ex:"The *baby* is crying.",lv:0,cefr:"A2"},
  {w:"back",ph:"/bæk/",pos:"adv.",zh:"回",ex:"She came *back* from Japan.",lv:0,cefr:"A2"},
  {w:"backward",ph:"/ˈbækwərd/",pos:"adv. 副詞",zh:"向後",ex:"Step *backward*.",lv:0,cefr:"A2"},
  {w:"bad",ph:"/bæd/",pos:"adj. 形容詞",zh:"壞的",ex:"Eating too much sugar is *bad* for you.",lv:0,cefr:"A1"},
  {w:"badminton",ph:"/ˈbædmɪntən/",pos:"n. 名詞",zh:"羽毛球",ex:"We play *badminton* after school.",lv:0,cefr:"A2"},
  {w:"bag",ph:"/bæɡ/",pos:"n. 名詞",zh:"袋子",ex:"She carries a heavy *bag* every day.",lv:0,cefr:"A1"},
  {w:"bake",ph:"/beɪk/",pos:"v. 動詞",zh:"烘烤",ex:"She *baked* a cake.",lv:0,cefr:"A2"},
  {w:"bakery",ph:"/ˈbeɪkəri/",pos:"n. 名詞",zh:"麵包店",ex:"She bought bread at the *bakery*.",lv:0,cefr:"A2"},
  {w:"balance",ph:"/ˈbæləns/",pos:"n.",zh:"平衡",ex:"She tries to *balance* work and life.",lv:1,cefr:"B1"},
  {w:"balcony",ph:"/ˈbælkəni/",pos:"n. 名詞",zh:"陽台",ex:"She stood on the *balcony*.",lv:0,cefr:"A2"},
  {w:"ball",ph:"/bɔːl/",pos:"n. 名詞",zh:"球",ex:"He kicked the *ball* into the goal.",lv:0,cefr:"A1"},
  {w:"bamboo",ph:"/bæmˈbuː/",pos:"n. 名詞",zh:"竹子",ex:"*Bamboo* grows in Asia.",lv:0,cefr:"A2"},
  {w:"ban",ph:"/bæn/",pos:"v.",zh:"禁止",ex:"Smoking is *banned*.",lv:0,cefr:"A2"},
  {w:"banana",ph:"/bəˈnɑːnə/",pos:"n. 名詞",zh:"香蕉",ex:"Monkeys love *bananas*.",lv:0,cefr:"A1"},
  {w:"band",ph:"/bænd/",pos:"n.",zh:"樂團",ex:"Her *band* played.",lv:0,cefr:"A2"},
  {w:"bandage",ph:"/ˈbændɪdʒ/",pos:"n. 名詞",zh:"繃帶",ex:"Wrap a *bandage*.",lv:0,cefr:"A2"},
  {w:"bank",ph:"/bæŋk/",pos:"n. 名詞",zh:"銀行",ex:"He works at a *bank* downtown.",lv:0,cefr:"A2"},
  {w:"baseball",ph:"/ˈbeɪsbɔːl/",pos:"n. 名詞",zh:"棒球",ex:"He plays *baseball* every weekend.",lv:0,cefr:"A2"},
  {w:"basement",ph:"/ˈbeɪsmənt/",pos:"n. 名詞",zh:"地下室",ex:"The storage is in the *basement*.",lv:0,cefr:"A2"},
  {w:"basic",ph:"/ˈbeɪsɪk/",pos:"adj. 形容詞",zh:"基本的",ex:"Learn *basic* English.",lv:1,cefr:"B1"},
  {w:"basketball",ph:"/ˈbæskɪtbɔːl/",pos:"n. 名詞",zh:"籃球",ex:"Do you want to play *basketball*?",lv:0,cefr:"A2"},
  {w:"bath",ph:"/bæθ/",pos:"n.",zh:"浴缸",ex:"I take a *bath* every night.",lv:0,cefr:"A1"},
  {w:"bathroom",ph:"/ˈbɑːθruːm/",pos:"n. 名詞",zh:"浴室",ex:"The *bathroom* is on the second floor.",lv:0,cefr:"A1"},
  {w:"bathtub",ph:"/ˈbæθtʌb/",pos:"n. 名詞",zh:"浴缸",ex:"She soaked in the *bathtub*.",lv:0,cefr:"A2"},
  {w:"battery",ph:"/ˈbætəri/",pos:"n. 名詞",zh:"電池",ex:"The *battery* is low.",lv:0,cefr:"A2"},
  {w:"beach",ph:"/biːtʃ/",pos:"n.",zh:"海灘",ex:"We played on the *beach*.",lv:0,cefr:"A2"},
  {w:"bear",ph:"/bɛr/",pos:"n. 名詞",zh:"熊",ex:"A *bear* lives in the woods.",lv:0,cefr:"A1"},
  {w:"beat",ph:"/biːt/",pos:"v.",zh:"打敗",ex:"Our team *beat* the other school.",lv:0,cefr:"A2"},
  {w:"beautiful",ph:"/ˈbjuːtɪfəl/",pos:"adj. 形容詞",zh:"美麗的",ex:"The flowers in the garden are *beautiful*.",lv:0,cefr:"A2"},
  {w:"because",ph:"/bɪˈkɒz/",pos:"conj. 連接詞",zh:"因為",ex:"I stayed home *because* it was raining.",lv:0,cefr:"A2"},
  {w:"become",ph:"/bɪˈkʌm/",pos:"v. 動詞",zh:"成為",ex:"She wants to *become* a nurse.",lv:0,cefr:"A2"},
  {w:"bed",ph:"/bɛd/",pos:"n. 名詞",zh:"床",ex:"It is time to go to *bed*.",lv:0,cefr:"A1"},
  {w:"bedroom",ph:"/ˈbɛdruːm/",pos:"n. 名詞",zh:"臥室",ex:"She decorated her *bedroom*.",lv:0,cefr:"A2"},
  {w:"bee",ph:"/biː/",pos:"n. 名詞",zh:"蜜蜂",ex:"The *bee* makes honey.",lv:0,cefr:"A1"},
  {w:"beef",ph:"/biːf/",pos:"n.",zh:"牛肉",ex:"I love *beef* noodles.",lv:0,cefr:"A1"},
  {w:"beer",ph:"/bɪər/",pos:"n. 名詞",zh:"啤酒",ex:"Adults drink *beer*.",lv:0,cefr:"A2"},
  {w:"begin",ph:"/bɪˈɡɪn/",pos:"v. 動詞",zh:"開始",ex:"Class will *begin* at eight o'clock.",lv:0,cefr:"A2"},
  {w:"behavior",ph:"/bɪˈheɪvjər/",pos:"n. 名詞",zh:"行為",ex:"His *behavior* in class was excellent.",lv:1,cefr:"B1"},
  {w:"behind",ph:"/bɪˈhaɪnd/",pos:"prep. 介系詞",zh:"在...後面",ex:"Hide *behind* the tree.",lv:0,cefr:"A1"},
  {w:"believe",ph:"/bɪˈliːv/",pos:"v. 動詞",zh:"相信",ex:"I *believe* you can do it.",lv:0,cefr:"A2"},
  {w:"belong",ph:"/bɪˈlɒŋ/",pos:"v. 動詞",zh:"屬於",ex:"This book *belongs* to the library.",lv:0,cefr:"B1"},
  {w:"below",ph:"nan",pos:"prep.",zh:"在...之下",ex:"The store is *below* my apartment.",lv:0,cefr:"A2"},
  {w:"bend",ph:"/bɛnd/",pos:"v. 動詞",zh:"彎曲",ex:"*Bend* your knees.",lv:0,cefr:"A2"},
  {w:"beneficial",ph:"/ˌbɛnɪˈfɪʃəl/",pos:"adj.",zh:"有益的",ex:"*Beneficial* to health.",lv:2,cefr:"B2"},
  {w:"benefit",ph:"/ˈbɛnɪfɪt/",pos:"n.",zh:"好處",ex:"Exercise has many *benefits* for health.",lv:1,cefr:"B1"},
  {w:"beside",ph:"nan",pos:"prep.",zh:"在...旁邊",ex:"Sit *beside* me.",lv:0,cefr:"A2"},
  {w:"besides",ph:"/bɪˈsaɪdz/",pos:"adv.",zh:"此外",ex:"*Besides* English, she speaks French.",lv:1,cefr:"B1"},
  {w:"best",ph:"/bɛst/",pos:"adj.",zh:"最好的",ex:"Do your *best* on the exam.",lv:0,cefr:"A2"},
  {w:"between",ph:"/bɪˈtwiːn/",pos:"prep. 介系詞",zh:"在…之間",ex:"The park is *between* the school and the library.",lv:0,cefr:"A2"},
  {w:"beyond",ph:"/bɪˈɒnd/",pos:"prep. 介系詞",zh:"在...之外",ex:"*Beyond* the mountain.",lv:1,cefr:"B1"},
  {w:"bias",ph:"/ˈbaɪəs/",pos:"n.",zh:"偏見",ex:"We must be aware of our own *bias*.",lv:2,cefr:"B2"},
  {w:"bicycle",ph:"/ˈbaɪsɪkəl/",pos:"n. 名詞",zh:"自行車",ex:"I ride my *bicycle* to school.",lv:0,cefr:"A2"},
  {w:"big",ph:"/bɪɡ/",pos:"adj. 形容詞",zh:"大的",ex:"That is a *big* dog.",lv:0,cefr:"A1"},
  {w:"bike",ph:"/baɪk/",pos:"n.",zh:"腳踏車",ex:"He rides his *bike*.",lv:0,cefr:"A1"},
  {w:"bill",ph:"/bɪl/",pos:"n.",zh:"帳單",ex:"Can I get the *bill*?",lv:0,cefr:"A1"},
  {w:"billion",ph:"/ˈbɪljən/",pos:"n. 名詞",zh:"十億",ex:"There are *billions* of people.",lv:1,cefr:"B1"},
  {w:"bird",ph:"/bɜːrd/",pos:"n. 名詞",zh:"鳥",ex:"A *bird* is singing outside my window.",lv:0,cefr:"A1"},
  {w:"birthday",ph:"nan",pos:"n.",zh:"生日",ex:"Happy *birthday*!",lv:0,cefr:"A1"},
  {w:"bitter",ph:"/ˈbɪtər/",pos:"adj. 形容詞",zh:"苦的",ex:"The medicine is *bitter*.",lv:0,cefr:"A2"},
  {w:"black",ph:"/blæk/",pos:"adj.",zh:"黑色的",ex:"She has *black* hair.",lv:0,cefr:"A1"},
  {w:"blanket",ph:"/ˈblæŋkɪt/",pos:"n. 名詞",zh:"毯子",ex:"Cover with a *blanket*.",lv:0,cefr:"A1"},
  {w:"blind",ph:"/blaɪnd/",pos:"adj. 形容詞",zh:"盲目的",ex:"She is *blind* in one eye.",lv:1,cefr:"B1"},
  {w:"blink",ph:"/blɪŋk/",pos:"v. 動詞",zh:"眨眼",ex:"She *blinked* in surprise.",lv:0,cefr:"A2"},
  {w:"blood",ph:"/blʌd/",pos:"n. 名詞",zh:"血液",ex:"She donated *blood*.",lv:0,cefr:"A2"},
  {w:"blouse",ph:"/blaʊz/",pos:"n. 名詞",zh:"上衣；女襯衫",ex:"She wore a white *blouse*.",lv:0,cefr:"A2"},
  {w:"blue",ph:"/bluː/",pos:"adj.",zh:"藍色的",ex:"The sky is *blue*.",lv:0,cefr:"A1"},
  {w:"boat",ph:"/boʊt/",pos:"n. 名詞",zh:"船",ex:"We took a *boat* to the island.",lv:0,cefr:"A1"},
  {w:"body",ph:"/ˈbɒdi/",pos:"n. 名詞",zh:"身體",ex:"Exercise keeps your *body* healthy.",lv:0,cefr:"A1"},
  {w:"boil",ph:"/bɔɪl/",pos:"v. 動詞",zh:"煮沸；燙",ex:"*Boil* the water.",lv:0,cefr:"A2"},
  {w:"bone",ph:"/bəʊn/",pos:"n. 名詞",zh:"骨頭",ex:"He broke a *bone* in his arm.",lv:0,cefr:"A2"},
  {w:"book",ph:"/bʊk/",pos:"n. 名詞",zh:"書",ex:"Read this *book*.",lv:0,cefr:"A1"},
  {w:"bookstore",ph:"/ˈbʊkstɔːr/",pos:"n. 名詞",zh:"書店",ex:"She bought a book at the *bookstore*.",lv:0,cefr:"A2"},
  {w:"boots",ph:"/buːts/",pos:"n. 名詞",zh:"靴子",ex:"She wore *boots* in the rain.",lv:0,cefr:"A1"},
  {w:"bored",ph:"/bɔːrd/",pos:"adj. 形容詞",zh:"無聊的",ex:"I am *bored*.",lv:0,cefr:"A1"},
  {w:"born",ph:"/bɔːrn/",pos:"adj. 形容詞",zh:"出生的",ex:"She was *born* in Taipei.",lv:0,cefr:"A2"},
  {w:"borrow",ph:"/ˈbɒrəʊ/",pos:"v. 動詞",zh:"借（入）",ex:"Can I *borrow* your pen?",lv:0,cefr:"A2"},
  {w:"both",ph:"/bəʊθ/",pos:"pron.",zh:"兩個都",ex:"*both* sisters like music.",lv:0,cefr:"A2"},
  {w:"bother",ph:"/ˈbɒðər/",pos:"v.",zh:"打擾",ex:"Sorry to *bother* you.",lv:1,cefr:"B1"},
  {w:"bottle",ph:"/ˈbɒtəl/",pos:"n. 名詞",zh:"瓶子",ex:"She drinks a *bottle* of water every hour.",lv:0,cefr:"A2"},
  {w:"bowl",ph:"/boʊl/",pos:"n.",zh:"碗",ex:"Fill the *bowl* with soup.",lv:0,cefr:"A1"},
  {w:"box",ph:"nan",pos:"n.",zh:"盒子",ex:"Put it in the *box*.",lv:0,cefr:"A1"},
  {w:"boy",ph:"/bɔɪ/",pos:"n. 名詞",zh:"男孩",ex:"The *boy* is playing in the park.",lv:0,cefr:"A1"},
  {w:"brain",ph:"/breɪn/",pos:"n. 名詞",zh:"大腦",ex:"Use your *brain*!",lv:0,cefr:"A2"},
  {w:"branch",ph:"/bræntʃ/",pos:"n. 名詞",zh:"樹枝；分支",ex:"A bird sat on the *branch*.",lv:0,cefr:"A2"},
  {w:"brave",ph:"/breɪv/",pos:"adj. 形容詞",zh:"勇敢的",ex:"The *brave* firefighter saved the child.",lv:0,cefr:"B1"},
  {w:"bread",ph:"/brɛd/",pos:"n. 名詞",zh:"麵包",ex:"She eats *bread* for breakfast.",lv:0,cefr:"A1"},
  {w:"break",ph:"/breɪk/",pos:"v.",zh:"打破",ex:"Let's take a short *break*.",lv:0,cefr:"A2"},
  {w:"breakfast",ph:"/ˈbrɛkfəst/",pos:"n. 名詞",zh:"早餐",ex:"Don't skip *breakfast*.",lv:0,cefr:"A1"},
  {w:"breathe",ph:"/briːð/",pos:"v.",zh:"呼吸",ex:"*Breathe* in slowly.",lv:1,cefr:"B1"},
  {w:"bridge",ph:"/brɪdʒ/",pos:"n. 名詞",zh:"橋",ex:"We crossed the *bridge* over the river.",lv:0,cefr:"A2"},
  {w:"bring",ph:"/brɪŋ/",pos:"v. 動詞",zh:"帶來",ex:"Please *bring* your textbook to class.",lv:0,cefr:"A2"},
  {w:"broke",ph:"/broʊk/",pos:"adj. 形容詞",zh:"破碎的",ex:"The window is *broke*.",lv:0,cefr:"A2"},
  {w:"broken",ph:"/ˈbroʊkən/",pos:"adj. 形容詞",zh:"壞掉的",ex:"My phone is *broken*.",lv:0,cefr:"A2"},
  {w:"brother",ph:"/ˈbrʌðər/",pos:"n. 名詞",zh:"兄弟",ex:"My *brother* is two years older.",lv:0,cefr:"A1"},
  {w:"brown",ph:"/braʊn/",pos:"adj. 形容詞",zh:"棕色的",ex:"She has *brown* eyes.",lv:0,cefr:"A2"},
  {w:"brush",ph:"nan",pos:"v.",zh:"刷",ex:"*brush* your teeth every day.",lv:0,cefr:"A2"},
  {w:"budget",ph:"/ˈbʌdʒɪt/",pos:"n. 名詞",zh:"預算",ex:"We need a *budget*.",lv:1,cefr:"B1"},
  {w:"build",ph:"/bɪld/",pos:"v. 動詞",zh:"建造",ex:"They plan to *build* a new school.",lv:0,cefr:"A2"},
  {w:"building",ph:"/ˈbɪldɪŋ/",pos:"n. 名詞",zh:"建築物",ex:"The *building* has twenty floors.",lv:0,cefr:"A2"},
  {w:"burn",ph:"nan",pos:"v.",zh:"燃燒",ex:"The candle *burns* slowly.",lv:1,cefr:"B1"},
  {w:"bus",ph:"/bʌs/",pos:"n.",zh:"公車",ex:"I take the *bus* to school.",lv:0,cefr:"A1"},
  {w:"busy",ph:"/ˈbɪzi/",pos:"adj. 形容詞",zh:"忙碌的",ex:"She is too *busy* to talk right now.",lv:0,cefr:"A2"},
  {w:"butter",ph:"/ˈbʌtər/",pos:"n. 名詞",zh:"奶油",ex:"Spread *butter* on bread.",lv:0,cefr:"A1"},
  {w:"butterfly",ph:"/ˈbʌtərflaɪ/",pos:"n. 名詞",zh:"蝴蝶",ex:"A *butterfly* sat on the flower.",lv:0,cefr:"A1"},
  {w:"button",ph:"nan",pos:"n.",zh:"按鈕",ex:"Press the *button*.",lv:0,cefr:"A2"},
  {w:"buy",ph:"/baɪ/",pos:"v. 動詞",zh:"購買",ex:"She wants to *buy* a new laptop.",lv:0,cefr:"A1"},
  {w:"cabinet",ph:"/ˈkæbɪnɪt/",pos:"n.",zh:"櫃子",ex:"Cups in the *cabinet*.",lv:0,cefr:"A2"},
  {w:"cable",ph:"/ˈkeɪbəl/",pos:"n. 名詞",zh:"電纜；線",ex:"Connect the *cable*.",lv:0,cefr:"A2"},
  {w:"cake",ph:"/keɪk/",pos:"n.",zh:"蛋糕",ex:"A birthday *cake*.",lv:0,cefr:"A2"},
  {w:"calendar",ph:"/ˈkæləndər/",pos:"n. 名詞",zh:"日曆",ex:"Check the *calendar*.",lv:0,cefr:"A1"},
  {w:"call",ph:"/kɔːl/",pos:"v.",zh:"打電話",ex:"Please *call* me when you arrive.",lv:0,cefr:"A1"},
  {w:"calm",ph:"/kɑːm/",pos:"adj.",zh:"平靜的",ex:"Stay *calm* during an emergency.",lv:0,cefr:"A2"},
  {w:"camera",ph:"/ˈkæmərə/",pos:"n. 名詞",zh:"相機",ex:"She took photos with her new *camera*.",lv:0,cefr:"A1"},
  {w:"camp",ph:"/kæmp/",pos:"v. 動詞",zh:"露營",ex:"We *camped* by the river.",lv:0,cefr:"A2"},
  {w:"campaign",ph:"/kæmˈpeɪn/",pos:"n. 名詞",zh:"活動",ex:"They launched a health *campaign*.",lv:1,cefr:"B1"},
  {w:"campsite",ph:"/ˈkæmpsaɪt/",pos:"n. 名詞",zh:"露營地",ex:"Set up tents at the *campsite*.",lv:1,cefr:"B1"},
  {w:"candy",ph:"/ˈkændi/",pos:"n. 名詞",zh:"糖果",ex:"She loves *candy*.",lv:0,cefr:"A2"},
  {w:"cap",ph:"/kæp/",pos:"n.",zh:"帽子",ex:"He wore a red *cap*.",lv:0,cefr:"A1"},
  {w:"capable",ph:"/ˈkeɪpəbəl/",pos:"adj. 形容詞",zh:"有能力的",ex:"She is *capable*.",lv:2,cefr:"B2"},
  {w:"capacity",ph:"/kəˈpæsɪti/",pos:"n. 名詞",zh:"容量",ex:"The hall has a *capacity* of 500 people.",lv:1,cefr:"B1"},
  {w:"captain",ph:"/ˈkæptɪn/",pos:"n. 名詞",zh:"隊長；船長",ex:"He is the *captain* of the team.",lv:0,cefr:"A2"},
  {w:"car",ph:"/kɑːr/",pos:"n. 名詞",zh:"汽車",ex:"My dad drives a red *car*.",lv:0,cefr:"A1"},
  {w:"care",ph:"/kɛər/",pos:"v.",zh:"照顧",ex:"She *cares* about her friends.",lv:0,cefr:"A2"},
  {w:"career",ph:"/kəˈrɪər/",pos:"n.",zh:"職業",ex:"A great *career*.",lv:1,cefr:"B1"},
  {w:"careful",ph:"/ˈkɛːfʊl/",pos:"adj. 形容詞",zh:"小心的",ex:"Be *careful* when you cross the street.",lv:0,cefr:"A2"},
  {w:"carefully",ph:"/ˈkɛrfəli/",pos:"adv. 副詞",zh:"仔細地",ex:"Do it *carefully*.",lv:0,cefr:"A2"},
  {w:"carrot",ph:"/ˈkærət/",pos:"n. 名詞",zh:"胡蘿蔔",ex:"Rabbits like *carrots*.",lv:0,cefr:"A1"},
  {w:"carry",ph:"/ˈkæri/",pos:"v. 動詞",zh:"攜帶",ex:"Can you help me *carry* this box?",lv:0,cefr:"A2"},
  {w:"cartoon",ph:"/kɑːrˈtuːn/",pos:"n.",zh:"卡通",ex:"Kids love *cartoons*.",lv:0,cefr:"A2"},
  {w:"cash",ph:"/kæʃ/",pos:"n.",zh:"現金",ex:"Pay by *cash*.",lv:0,cefr:"A2"},
  {w:"cat",ph:"/kæt/",pos:"n. 名詞",zh:"貓",ex:"My *cat* is orange.",lv:0,cefr:"A1"},
  {w:"catch",ph:"/kætʃ/",pos:"v. 動詞",zh:"抓住",ex:"He tried to *catch* the ball.",lv:0,cefr:"A2"},
  {w:"cause",ph:"/kɔːz/",pos:"v.",zh:"原因",ex:"What *caused* the accident?",lv:0,cefr:"B1"},
  {w:"cave",ph:"/keɪv/",pos:"n. 名詞",zh:"洞穴",ex:"They explored the *cave*.",lv:0,cefr:"A2"},
  {w:"ceiling",ph:"/ˈsiːlɪŋ/",pos:"n.",zh:"天花板",ex:"The *ceiling* is high.",lv:0,cefr:"A2"},
  {w:"celebrate",ph:"/ˈsɛlɪbreɪt/",pos:"v. 動詞",zh:"慶祝",ex:"We *celebrate* the new year.",lv:0,cefr:"A2"},
  {w:"center",ph:"/ˈsɛntər/",pos:"n. 名詞",zh:"中心",ex:"The shopping *center* is very busy.",lv:0,cefr:"A2"},
  {w:"century",ph:"/ˈsɛntʃəri/",pos:"n.",zh:"世紀",ex:"The 21st *century*.",lv:1,cefr:"B1"},
  {w:"cereal",ph:"/ˈsɪəriəl/",pos:"n.",zh:"穀片",ex:"I eat *cereal* for breakfast.",lv:0,cefr:"A2"},
  {w:"certain",ph:"/ˈsɜːrtən/",pos:"adj. 形容詞",zh:"確定的",ex:"I am *certain* she is right.",lv:1,cefr:"B1"},
  {w:"chair",ph:"/tʃɛr/",pos:"n.",zh:"椅子",ex:"Sit on the *chair*.",lv:0,cefr:"A1"},
  {w:"challenge",ph:"/ˈtʃælɪndʒ/",pos:"n.",zh:"挑戰",ex:"Learning a new language is a big *challenge*.",lv:1,cefr:"B1"},
  {w:"champion",ph:"/ˈtʃæmpiən/",pos:"n. 名詞",zh:"冠軍",ex:"She became the *champion*.",lv:0,cefr:"A2"},
  {w:"chance",ph:"/tʃɑːns/",pos:"n. 名詞",zh:"機會",ex:"This is a great *chance* to improve.",lv:0,cefr:"B1"},
  {w:"change",ph:"/tʃeɪndʒ/",pos:"v.",zh:"改變",ex:"The weather can *change* quickly in spring.",lv:0,cefr:"A2"},
  {w:"character",ph:"/ˈkærɪktər/",pos:"n.",zh:"個性",ex:"Strong *character*.",lv:1,cefr:"B1"},
  {w:"characteristic",ph:"/ˌkærɪktəˈrɪstɪk/",pos:"n.",zh:"特徵",ex:"Honesty is a key *characteristic* of hers.",lv:1,cefr:"B1"},
  {w:"charge",ph:"/tʃɑːrdʒ/",pos:"v.",zh:"收費",ex:"How much do you *charge*?",lv:1,cefr:"B1"},
  {w:"cheap",ph:"/tʃiːp/",pos:"adj. 形容詞",zh:"便宜的",ex:"This shirt is very *cheap*.",lv:0,cefr:"A2"},
  {w:"check",ph:"/tʃɛk/",pos:"v. 動詞",zh:"檢查",ex:"Please *check* your answers before submitting.",lv:0,cefr:"A2"},
  {w:"cheek",ph:"/tʃiːk/",pos:"n. 名詞",zh:"臉頰",ex:"She has rosy *cheeks*.",lv:0,cefr:"A1"},
  {w:"cheerful",ph:"/ˈtʃɪərfʊl/",pos:"adj. 形容詞",zh:"愉快的",ex:"She is always *cheerful*.",lv:1,cefr:"B1"},
  {w:"cheese",ph:"/tʃiːz/",pos:"n. 名詞",zh:"起司",ex:"She likes *cheese* on her pizza.",lv:0,cefr:"A2"},
  {w:"chef",ph:"/ʃɛf/",pos:"n. 名詞",zh:"廚師",ex:"He is a *chef*.",lv:0,cefr:"A2"},
  {w:"chess",ph:"/tʃɛs/",pos:"n. 名詞",zh:"西洋棋",ex:"He loves playing *chess*.",lv:0,cefr:"A2"},
  {w:"chicken",ph:"/ˈtʃɪkɪn/",pos:"n.",zh:"雞肉",ex:"She cooked *chicken*.",lv:0,cefr:"A1"},
  {w:"child",ph:"/tʃaɪld/",pos:"n. 名詞",zh:"孩子",ex:"Every *child* deserves a good education.",lv:0,cefr:"A1"},
  {w:"chin",ph:"/tʃɪn/",pos:"n. 名詞",zh:"下巴",ex:"She touched her *chin*.",lv:0,cefr:"A1"},
  {w:"Chinese",ph:"/ˌtʃaɪˈniːz/",pos:"n. 名詞",zh:"中文",ex:"We learn *Chinese* in school.",lv:0,cefr:"A1"},
  {w:"choice",ph:"/tʃɔɪs/",pos:"n.",zh:"選擇",ex:"A wise *choice*.",lv:1,cefr:"B1"},
  {w:"choose",ph:"/tʃuːz/",pos:"v. 動詞",zh:"選擇",ex:"You can *choose* any color you like.",lv:0,cefr:"B1"},
  {w:"chop",ph:"/tʃɒp/",pos:"v. 動詞",zh:"切；砍",ex:"*Chop* the vegetables.",lv:0,cefr:"A2"},
  {w:"church",ph:"/tʃɜːrtʃ/",pos:"n. 名詞",zh:"教堂",ex:"We go to *church* on Sunday.",lv:0,cefr:"A2"},
  {w:"circle",ph:"/ˈsɜːrkəl/",pos:"n. 名詞",zh:"圓形",ex:"Draw a *circle*.",lv:0,cefr:"A1"},
  {w:"circumstance",ph:"/ˈsɜːkəmstæns/",pos:"n. 名詞",zh:"情況",ex:"Under these *circumstances*, we must act fast.",lv:2,cefr:"B2"},
  {w:"circumstances",ph:"/ˈsɜːkəmstænsɪz/",pos:"n. 名詞",zh:"情況",ex:"Under these *circumstances*, we must act.",lv:1,cefr:"B2"},
  {w:"citizen",ph:"/ˈsɪtɪzən/",pos:"n.",zh:"公民",ex:"Every *citizen* has rights.",lv:1,cefr:"B1"},
  {w:"city",ph:"/ˈsɪti/",pos:"n. 名詞",zh:"城市",ex:"She lives in a big *city*.",lv:0,cefr:"A2"},
  {w:"claim",ph:"/kleɪm/",pos:"v.",zh:"聲稱",ex:"She *claims* she saw the accident.",lv:1,cefr:"B1"},
  {w:"clap",ph:"/klæp/",pos:"v. 動詞",zh:"鼓掌",ex:"*Clap* your hands.",lv:0,cefr:"A2"},
  {w:"clarify",ph:"/ˈklærɪfaɪ/",pos:"v. 動詞",zh:"澄清",ex:"Can you *clarify* what you mean?",lv:2,cefr:"B2"},
  {w:"class",ph:"/klɑːs/",pos:"n. 名詞",zh:"班級",ex:"Our *class* has thirty students.",lv:0,cefr:"A2"},
  {w:"classify",ph:"/ˈklæsɪfaɪ/",pos:"v. 動詞",zh:"分類",ex:"*Classify* the data.",lv:2,cefr:"B2"},
  {w:"classmate",ph:"/ˈklæsmeɪt/",pos:"n. 名詞",zh:"同班同學",ex:"She is my *classmate*.",lv:0,cefr:"A2"},
  {w:"classroom",ph:"/ˈklæsruːm/",pos:"n. 名詞",zh:"教室",ex:"The *classroom* is clean.",lv:0,cefr:"A2"},
  {w:"clean",ph:"/kliːn/",pos:"adj.",zh:"乾淨的",ex:"Please *clean* your room.",lv:0,cefr:"A1"},
  {w:"clearly",ph:"/ˈklɪərli/",pos:"adv. 副詞",zh:"清楚地",ex:"Speak *clearly*.",lv:0,cefr:"A2"},
  {w:"clever",ph:"/ˈklɛvər/",pos:"adj. 形容詞",zh:"聰明的",ex:"She is a *clever* student.",lv:0,cefr:"A2"},
  {w:"click",ph:"/klɪk/",pos:"v. 動詞",zh:"點擊",ex:"*Click* the button.",lv:0,cefr:"A2"},
  {w:"climate",ph:"/ˈklaɪmɪt/",pos:"n. 名詞",zh:"氣候",ex:"The *climate* is changing.",lv:1,cefr:"B1"},
  {w:"climb",ph:"/klaɪm/",pos:"v.",zh:"攀爬",ex:"We *climbed* the mountain last weekend.",lv:0,cefr:"A2"},
  {w:"clock",ph:"/klɒk/",pos:"n.",zh:"時鐘",ex:"The *clock* shows noon.",lv:0,cefr:"A1"},
  {w:"close",ph:"/kləʊz/",pos:"v.",zh:"關閉",ex:"Please *close* the window.",lv:0,cefr:"A1"},
  {w:"closed",ph:"/kloʊzd/",pos:"adj. 形容詞",zh:"關閉的",ex:"The shop is *closed*.",lv:0,cefr:"A1"},
  {w:"clothes",ph:"/kləʊðz/",pos:"n. 名詞",zh:"衣服",ex:"She bought new *clothes* for school.",lv:0,cefr:"A1"},
  {w:"cloud",ph:"/klaʊd/",pos:"n. 名詞",zh:"雲",ex:"The sky is full of dark *clouds*.",lv:0,cefr:"A1"},
  {w:"club",ph:"/klʌb/",pos:"n. 名詞",zh:"社團",ex:"She joined the English *club*.",lv:0,cefr:"A2"},
  {w:"clue",ph:"/kluː/",pos:"n. 名詞",zh:"線索",ex:"Find a *clue*.",lv:1,cefr:"B1"},
  {w:"coast",ph:"/koʊst/",pos:"n. 名詞",zh:"海岸",ex:"We drove along the *coast*.",lv:1,cefr:"B1"},
  {w:"coat",ph:"/koʊt/",pos:"n.",zh:"外套",ex:"Wear a *coat* in winter.",lv:0,cefr:"A2"},
  {w:"coffee",ph:"/ˈkɒfi/",pos:"n. 名詞",zh:"咖啡",ex:"She drinks *coffee* every morning.",lv:0,cefr:"A2"},
  {w:"coherence",ph:"/koʊˈhɪərəns/",pos:"n.",zh:"連貫性",ex:"Maintain *coherence*.",lv:2,cefr:"C1"},
  {w:"coherent",ph:"/kəʊˈhɪərənt/",pos:"adj. 形容詞",zh:"連貫的",ex:"Her argument was clear and *coherent*.",lv:2,cefr:"B2"},
  {w:"coin",ph:"nan",pos:"n.",zh:"硬幣",ex:"I found a *coin* on the floor.",lv:0,cefr:"A2"},
  {w:"cola",ph:"/ˈkoʊlə/",pos:"n. 名詞",zh:"可樂",ex:"She ordered *cola*.",lv:0,cefr:"A1"},
  {w:"cold",ph:"/kəʊld/",pos:"adj.",zh:"冷的",ex:"She caught a *cold* last week.",lv:0,cefr:"A1"},
  {w:"collaborate",ph:"/kəˈlæbəreɪt/",pos:"v. 動詞",zh:"合作",ex:"The two schools *collaborated* on a project.",lv:1,cefr:"B1"},
  {w:"collect",ph:"/kəˈlɛkt/",pos:"v. 動詞",zh:"收集",ex:"He likes to *collect* stamps.",lv:0,cefr:"A2"},
  {w:"college",ph:"/ˈkɒlɪdʒ/",pos:"n.",zh:"大學",ex:"She studies at *college*.",lv:1,cefr:"B1"},
  {w:"color",ph:"/ˈkʌlər/",pos:"n. 名詞",zh:"顏色",ex:"What is your favorite *color*?",lv:0,cefr:"A1"},
  {w:"comb",ph:"/koʊm/",pos:"v. 動詞",zh:"梳頭",ex:"*Comb* your hair.",lv:0,cefr:"A1"},
  {w:"come",ph:"/kʌm/",pos:"v. 動詞",zh:"來",ex:"Please *come* to the party.",lv:0,cefr:"A1"},
  {w:"comfortable",ph:"/ˈkʌmftəbəl/",pos:"adj. 形容詞",zh:"舒適的",ex:"This chair is very *comfortable*.",lv:0,cefr:"A2"},
  {w:"comic",ph:"/ˈkɒmɪk/",pos:"n.",zh:"漫畫",ex:"I love reading *comics*.",lv:0,cefr:"A2"},
  {w:"commit",ph:"/kəˈmɪt/",pos:"v. 動詞",zh:"承諾；犯罪",ex:"*Commit* to your goals.",lv:2,cefr:"B2"},
  {w:"commitment",ph:"/kəˈmɪtmənt/",pos:"n.",zh:"承諾",ex:"Show your *commitment*.",lv:2,cefr:"B2"},
  {w:"common",ph:"/ˈkɒmən/",pos:"adj. 形容詞",zh:"常見的",ex:"Colds are very *common* in winter.",lv:0,cefr:"B1"},
  {w:"communicate",ph:"/kəˈmjuːnɪkeɪt/",pos:"v. 動詞",zh:"溝通",ex:"It is important to *communicate* clearly.",lv:1,cefr:"B1"},
  {w:"community",ph:"/kəˈmjuːnɪti/",pos:"n. 名詞",zh:"社區",ex:"She volunteers in her local *community*.",lv:1,cefr:"B1"},
  {w:"company",ph:"/ˈkʌmpəni/",pos:"n. 名詞",zh:"公司",ex:"She works for a big *company*.",lv:0,cefr:"A2"},
  {w:"compare",ph:"/kəmˈpɛr/",pos:"v. 動詞",zh:"比較",ex:"Let's *compare* these two products.",lv:1,cefr:"B1"},
  {w:"compensate",ph:"/ˈkɒmpənseɪt/",pos:"v. 動詞",zh:"補償",ex:"She worked extra hours to *compensate*.",lv:2,cefr:"B2"},
  {w:"compete",ph:"/kəmˈpiːt/",pos:"v. 動詞",zh:"競爭",ex:"Teams from many schools will *compete*.",lv:1,cefr:"B1"},
  {w:"competent",ph:"/ˈkɒmpɪtənt/",pos:"adj. 形容詞",zh:"稱職的",ex:"She is a highly *competent* manager.",lv:2,cefr:"B2"},
  {w:"complain",ph:"/kəmˈpleɪn/",pos:"v.",zh:"抱怨",ex:"Don't *complain*.",lv:1,cefr:"B1"},
  {w:"complete",ph:"/kəmˈpliːt/",pos:"v.",zh:"完成",ex:"*Complete* the exercise.",lv:1,cefr:"B1"},
  {w:"completely",ph:"/kəmˈpliːtli/",pos:"adv. 副詞",zh:"完全地",ex:"She was *completely* right.",lv:1,cefr:"B1"},
  {w:"complex",ph:"/ˈkɒmplɛks/",pos:"adj. 形容詞",zh:"複雜的",ex:"This problem is very *complex*.",lv:1,cefr:"B2"},
  {w:"complexity",ph:"/kɒmˈplɛksɪti/",pos:"n. 名詞",zh:"複雜性",ex:"The *complexity* of the problem surprised us.",lv:2,cefr:"B2"},
  {w:"comprehensive",ph:"/ˌkɒmprɪˈhɛnsɪv/",pos:"adj. 形容詞",zh:"全面的",ex:"She wrote a *comprehensive* report.",lv:2,cefr:"C1"},
  {w:"computer",ph:"/kəmˈpjuːtər/",pos:"n. 名詞",zh:"電腦",ex:"She uses a *computer* for her homework.",lv:0,cefr:"A1"},
  {w:"conceive",ph:"/kənˈsiːv/",pos:"v. 動詞",zh:"構想",ex:"He *conceived* the idea years ago.",lv:2,cefr:"C1"},
  {w:"concentrate",ph:"/ˈkɒnsəntreɪt/",pos:"v. 動詞",zh:"專注",ex:"It is hard to *concentrate* with loud music.",lv:1,cefr:"B1"},
  {w:"concept",ph:"/ˈkɒnsɛpt/",pos:"n.",zh:"概念",ex:"The basic *concepts*.",lv:2,cefr:"B2"},
  {w:"concern",ph:"/kənˈsɜːrn/",pos:"n.",zh:"擔心",ex:"Her health *concerns* me.",lv:1,cefr:"B1"},
  {w:"concert",ph:"/ˈkɒnsərt/",pos:"n. 名詞",zh:"音樂會",ex:"She went to a *concert*.",lv:0,cefr:"A2"},
  {w:"concert hall",ph:"/ˈkɒnsərt hɔːl/",pos:"n. 名詞",zh:"音樂廳",ex:"The concert was at the hall.",lv:1,cefr:"B1"},
  {w:"conclude",ph:"/kənˈkluːd/",pos:"v. 動詞",zh:"總結",ex:"We can *conclude* that the experiment worked.",lv:2,cefr:"B2"},
  {w:"concurrent",ph:"/kənˈkɜːrənt/",pos:"adj. 形容詞",zh:"同時發生的",ex:"Two *concurrent* events were scheduled.",lv:2,cefr:"B2"},
  {w:"conduct",ph:"/ˈkɒndʌkt/",pos:"n.",zh:"行為",ex:"The team *conducted* a study.",lv:2,cefr:"B2"},
  {w:"confidence",ph:"/ˈkɒnfɪdəns/",pos:"n. 名詞",zh:"自信",ex:"She spoke with great *confidence*.",lv:1,cefr:"B1"},
  {w:"confident",ph:"/ˈkɒnfɪdənt/",pos:"adj.",zh:"有自信的",ex:"Be *confident*.",lv:1,cefr:"B1"},
  {w:"confirm",ph:"/kənˈfɜːm/",pos:"v. 動詞",zh:"確認",ex:"Please *confirm* your appointment.",lv:1,cefr:"B1"},
  {w:"conflict",ph:"/ˈkɒnflɪkt/",pos:"n.",zh:"衝突",ex:"The two countries are in *conflict*.",lv:1,cefr:"B2"},
  {w:"confused",ph:"/kənˈfjuːzd/",pos:"adj. 形容詞",zh:"困惑的",ex:"She looked *confused*.",lv:0,cefr:"A2"},
  {w:"connect",ph:"/kəˈnɛkt/",pos:"v. 動詞",zh:"連接",ex:"The bridge *connects* the two islands.",lv:1,cefr:"B1"},
  {w:"consequence",ph:"/ˈkɒnsɪkwəns/",pos:"n. 名詞",zh:"後果",ex:"Think about the *consequences* of your actions.",lv:1,cefr:"B2"},
  {w:"consequences",ph:"/ˈkɒnsɪkwɛnsɪz/",pos:"n. 名詞",zh:"後果",ex:"Think about the *consequences*.",lv:2,cefr:"B2"},
  {w:"consider",ph:"/kənˈsɪdər/",pos:"v. 動詞",zh:"考慮",ex:"Please *consider* all your options.",lv:1,cefr:"B1"},
  {w:"consist",ph:"/kənˈsɪst/",pos:"v. 動詞",zh:"由...組成",ex:"The team *consists* of ten players.",lv:1,cefr:"B1"},
  {w:"contact",ph:"/ˈkɒntækt/",pos:"v. 動詞",zh:"聯絡",ex:"*Contact* me later.",lv:1,cefr:"B1"},
  {w:"contemplate",ph:"/ˈkɒntəmpleɪt/",pos:"v. 動詞",zh:"深思",ex:"She *contemplated* her next move.",lv:2,cefr:"B2"},
  {w:"content",ph:"/kənˈtɛnt/",pos:"adj. 形容詞",zh:"滿足的",ex:"She was *content*.",lv:1,cefr:"B1"},
  {w:"context",ph:"/ˈkɒntɛkst/",pos:"n. 名詞",zh:"背景；情境",ex:"Read it in *context*.",lv:2,cefr:"B2"},
  {w:"continue",ph:"/kənˈtɪnjuː/",pos:"v. 動詞",zh:"繼續",ex:"Please *continue* reading the next chapter.",lv:1,cefr:"B1"},
  {w:"contradict",ph:"/ˌkɒntrəˈdɪkt/",pos:"v. 動詞",zh:"矛盾",ex:"His actions *contradict* his words.",lv:2,cefr:"B2"},
  {w:"contribute",ph:"/kənˈtrɪbjuːt/",pos:"v. 動詞",zh:"貢獻",ex:"Everyone can *contribute* to society.",lv:1,cefr:"B2"},
  {w:"control",ph:"/kənˈtrəʊl/",pos:"v.",zh:"控制",ex:"She learned to *control* her emotions.",lv:1,cefr:"B1"},
  {w:"controversial",ph:"/ˌkɒntrəˈvɜːʃəl/",pos:"adj. 形容詞",zh:"有爭議的",ex:"This is a very *controversial* topic.",lv:2,cefr:"B2"},
  {w:"controversy",ph:"/ˈkɒntrəvɜːsi/",pos:"n. 名詞",zh:"爭議",ex:"The policy sparked *controversy*.",lv:2,cefr:"C1"},
  {w:"convenient",ph:"/kənˈviːniənt/",pos:"adj.",zh:"方便的",ex:"Very *convenient*.",lv:1,cefr:"B1"},
  {w:"convention",ph:"/kənˈvɛnʃən/",pos:"n. 名詞",zh:"慣例",ex:"Breaking social *conventions* can be risky.",lv:2,cefr:"B2"},
  {w:"conversation",ph:"/ˌkɒnvəˈseɪʃən/",pos:"n.",zh:"對話",ex:"A long *conversation*.",lv:1,cefr:"B1"},
  {w:"convey",ph:"/kənˈveɪ/",pos:"v. 動詞",zh:"傳達",ex:"He tried to *convey* his feelings.",lv:2,cefr:"B2"},
  {w:"convince",ph:"/kənˈvɪns/",pos:"v. 動詞",zh:"說服",ex:"She tried to *convince* him to stay.",lv:1,cefr:"B2"},
  {w:"cook",ph:"/kʊk/",pos:"v.",zh:"烹飪",ex:"My mom can *cook* delicious food.",lv:0,cefr:"A1"},
  {w:"cookie",ph:"/ˈkʊki/",pos:"n. 名詞",zh:"餅乾",ex:"She baked *cookies*.",lv:0,cefr:"A1"},
  {w:"cooking",ph:"/ˈkʊkɪŋ/",pos:"n. 名詞",zh:"烹飪",ex:"*Cooking* is fun.",lv:0,cefr:"A2"},
  {w:"cool",ph:"/kuːl/",pos:"adj.",zh:"涼爽的",ex:"The breeze is *cool*.",lv:0,cefr:"A2"},
  {w:"cooperate",ph:"/kəʊˈɒpəreɪt/",pos:"v. 動詞",zh:"合作",ex:"We need to *cooperate* to finish on time.",lv:1,cefr:"B2"},
  {w:"copy",ph:"/ˈkɒpi/",pos:"v. 動詞",zh:"複製；抄寫",ex:"*Copy* the notes.",lv:0,cefr:"A1"},
  {w:"corn",ph:"/kɔːrn/",pos:"n. 名詞",zh:"玉米",ex:"She cooked *corn*.",lv:0,cefr:"A1"},
  {w:"corner",ph:"/ˈkɔːrnər/",pos:"n. 名詞",zh:"轉角",ex:"Turn left at the *corner*.",lv:0,cefr:"A2"},
  {w:"correct",ph:"/kəˈrɛkt/",pos:"adj.",zh:"正確的",ex:"That is the *correct* answer.",lv:0,cefr:"A2"},
  {w:"correctly",ph:"/kəˈrɛktli/",pos:"adv. 副詞",zh:"正確地",ex:"Answer *correctly*.",lv:0,cefr:"A2"},
  {w:"cost",ph:"/kɒst/",pos:"v.",zh:"花費",ex:"How much does it *cost*?",lv:0,cefr:"A2"},
  {w:"cough",ph:"/kɒf/",pos:"v. 動詞",zh:"咳嗽",ex:"She *coughed* all night.",lv:0,cefr:"A2"},
  {w:"count",ph:"/kaʊnt/",pos:"v.",zh:"數數",ex:"*Count* from one to ten.",lv:0,cefr:"A2"},
  {w:"country",ph:"/ˈkʌntri/",pos:"n. 名詞",zh:"國家",ex:"Japan is a beautiful *country*.",lv:0,cefr:"A1"},
  {w:"courage",ph:"/ˈkɜːrɪdʒ/",pos:"n. 名詞",zh:"勇氣",ex:"She has great *courage*.",lv:1,cefr:"B1"},
  {w:"course",ph:"/kɔːrs/",pos:"n. 名詞",zh:"課程",ex:"I am taking an English *course*.",lv:0,cefr:"A2"},
  {w:"cousin",ph:"nan",pos:"n.",zh:"表兄弟姊妹",ex:"My *cousin* is visiting.",lv:0,cefr:"A1"},
  {w:"cover",ph:"/ˈkʌvər/",pos:"v.",zh:"覆蓋",ex:"Snow *covered* the ground.",lv:0,cefr:"A2"},
  {w:"cow",ph:"/kaʊ/",pos:"n.",zh:"牛",ex:"The *cow* gives us milk.",lv:0,cefr:"A1"},
  {w:"crayon",ph:"/ˈkreɪɒn/",pos:"n. 名詞",zh:"蠟筆",ex:"Color with *crayons*.",lv:0,cefr:"A1"},
  {w:"crazy",ph:"nan",pos:"adj.",zh:"瘋狂的",ex:"That idea is *crazy*!",lv:0,cefr:"A2"},
  {w:"create",ph:"/kriˈeɪt/",pos:"v. 動詞",zh:"創造",ex:"Artists *create* amazing works of art.",lv:0,cefr:"B1"},
  {w:"creative",ph:"/kriˈeɪtɪv/",pos:"adj. 形容詞",zh:"有創意的",ex:"She is a very *creative* designer.",lv:1,cefr:"B2"},
  {w:"creativity",ph:"/ˌkriːeɪˈtɪvɪti/",pos:"n. 名詞",zh:"創造力",ex:"She has great *creativity*.",lv:1,cefr:"B1"},
  {w:"creature",ph:"/ˈkriːtʃər/",pos:"n. 名詞",zh:"生物",ex:"The ocean is home to many *creatures*.",lv:1,cefr:"B1"},
  {w:"credibility",ph:"/ˌkrɛdɪˈbɪlɪti/",pos:"n. 名詞",zh:"可信度",ex:"She lost her *credibility* after lying.",lv:2,cefr:"B2"},
  {w:"crime",ph:"/kraɪm/",pos:"n. 名詞",zh:"犯罪",ex:"Report the *crime*.",lv:1,cefr:"B1"},
  {w:"criteria",ph:"/kraɪˈtɪərɪə/",pos:"n. 名詞",zh:"標準",ex:"What are the *criteria* for selecting students?",lv:2,cefr:"B2"},
  {w:"criticism",ph:"/ˈkrɪtɪsɪzəm/",pos:"n. 名詞",zh:"批評",ex:"She accepted the *criticism* graciously.",lv:1,cefr:"B1"},
  {w:"criticize",ph:"/ˈkrɪtɪsaɪz/",pos:"v.",zh:"批評",ex:"Don't just *criticize*.",lv:2,cefr:"B2"},
  {w:"critique",ph:"/krɪˈtiːk/",pos:"n.",zh:"評論",ex:"Write a *critique* of the article.",lv:2,cefr:"B2"},
  {w:"cross",ph:"nan",pos:"v.",zh:"穿越",ex:"*cross* the street carefully.",lv:0,cefr:"A2"},
  {w:"crowd",ph:"/kraʊd/",pos:"n. 名詞",zh:"人群",ex:"A large *crowd* gathered.",lv:0,cefr:"A2"},
  {w:"crowded",ph:"/ˈkraʊdɪd/",pos:"adj. 形容詞",zh:"擁擠的",ex:"The bus was *crowded*.",lv:0,cefr:"A2"},
  {w:"cry",ph:"/kraɪ/",pos:"v.",zh:"哭泣",ex:"The baby started to *cry*.",lv:0,cefr:"A1"},
  {w:"cultivate",ph:"/ˈkʌltɪveɪt/",pos:"v. 動詞",zh:"培養",ex:"You must *cultivate* good study habits.",lv:1,cefr:"B1"},
  {w:"culture",ph:"/ˈkʌltʃər/",pos:"n. 名詞",zh:"文化",ex:"Taiwan has a rich *culture*.",lv:1,cefr:"B1"},
  {w:"cup",ph:"/kʌp/",pos:"n. 名詞",zh:"杯子",ex:"Can I have a *cup* of tea?",lv:0,cefr:"A1"},
  {w:"curious",ph:"/ˈkjʊəriəs/",pos:"adj. 形容詞",zh:"好奇的",ex:"She is *curious* about everything.",lv:1,cefr:"B1"},
  {w:"current",ph:"/ˈkʌrənt/",pos:"adj.",zh:"當前的",ex:"What is the *current* situation?",lv:1,cefr:"B1"},
  {w:"curtain",ph:"/ˈkɜːrtən/",pos:"n. 名詞",zh:"窗簾",ex:"Draw the *curtains*.",lv:0,cefr:"A1"},
  {w:"curved",ph:"/kɜːrvd/",pos:"adj. 形容詞",zh:"彎曲的",ex:"A *curved* road.",lv:0,cefr:"A2"},
  {w:"custom",ph:"/ˈkʌstəm/",pos:"n. 名詞",zh:"習俗",ex:"Bowing is a *custom* in Japan.",lv:1,cefr:"B1"},
  {w:"customer",ph:"/ˈkʌstəmər/",pos:"n.",zh:"顧客",ex:"The *customer* is right.",lv:1,cefr:"B1"},
  {w:"cut",ph:"/kʌt/",pos:"v.",zh:"切",ex:"She *cut* the cake into pieces.",lv:0,cefr:"A1"},
  {w:"cute",ph:"/kjuːt/",pos:"adj.",zh:"可愛的",ex:"So *cute*!",lv:0,cefr:"A2"},
  {w:"dad",ph:"/dæd/",pos:"n.",zh:"爸爸",ex:"My *dad* is kind.",lv:0,cefr:"A1"},
  {w:"daily",ph:"/ˈdeɪli/",pos:"adj.",zh:"每天的",ex:"Exercise should be a *daily* habit.",lv:0,cefr:"A2"},
  {w:"damage",ph:"/ˈdæmɪdʒ/",pos:"n.",zh:"損害",ex:"The storm *damaged* many buildings.",lv:1,cefr:"B1"},
  {w:"dance",ph:"/dæns/",pos:"v. 動詞",zh:"跳舞",ex:"She loves to *dance*.",lv:0,cefr:"A1"},
  {w:"danger",ph:"/ˈdeɪndʒər/",pos:"n.",zh:"危險",ex:"In *danger*.",lv:1,cefr:"B1"},
  {w:"dangerous",ph:"/ˈdeɪndʒərəs/",pos:"adj. 形容詞",zh:"危險的",ex:"It is *dangerous* to swim alone.",lv:0,cefr:"A2"},
  {w:"dark",ph:"/dɑːrk/",pos:"adj.",zh:"黑暗的",ex:"It gets *dark* early in winter.",lv:0,cefr:"A2"},
  {w:"date",ph:"/deɪt/",pos:"n.",zh:"日期",ex:"What is today's *date*?",lv:0,cefr:"A2"},
  {w:"daughter",ph:"/ˈdɔːtər/",pos:"n. 名詞",zh:"女兒",ex:"She is a proud *daughter*.",lv:0,cefr:"A2"},
  {w:"dead",ph:"nan",pos:"adj.",zh:"死的",ex:"The plant is *dead*.",lv:0,cefr:"A2"},
  {w:"deal",ph:"/diːl/",pos:"v.",zh:"處理",ex:"A great *deal*.",lv:1,cefr:"B1"},
  {w:"dear",ph:"/dɪər/",pos:"adj. 形容詞",zh:"親愛的",ex:"*dear* Tom, I miss you.",lv:0,cefr:"A2"},
  {w:"debate",ph:"/dɪˈbeɪt/",pos:"n.",zh:"辯論",ex:"They held a *debate* on climate change.",lv:1,cefr:"B2"},
  {w:"decade",ph:"/ˈdɛkeɪd/",pos:"n. 名詞",zh:"十年",ex:"Over the past *decade*.",lv:2,cefr:"B2"},
  {w:"December",ph:"/dɪˈsɛmbər/",pos:"n. 名詞",zh:"十二月",ex:"*December* is cold.",lv:0,cefr:"A1"},
  {w:"decide",ph:"/dɪˈsaɪd/",pos:"v. 動詞",zh:"決定",ex:"I need to *decide* what to eat for dinner.",lv:0,cefr:"B1"},
  {w:"decision",ph:"/dɪˈsɪʒən/",pos:"n. 名詞",zh:"決定",ex:"Making a good *decision* takes time.",lv:1,cefr:"B1"},
  {w:"decline",ph:"/dɪˈklaɪn/",pos:"v. 動詞",zh:"衰退；婉拒",ex:"She *declined* the offer.",lv:2,cefr:"B2"},
  {w:"decrease",ph:"/dɪˈkriːs/",pos:"v.",zh:"減少",ex:"The temperature will *decrease* tonight.",lv:1,cefr:"B1"},
  {w:"dedicate",ph:"/ˈdɛdɪkeɪt/",pos:"v. 動詞",zh:"奉獻；獻身",ex:"She *dedicated* her life to teaching.",lv:1,cefr:"B1"},
  {w:"deduce",ph:"/dɪˈdjuːs/",pos:"v. 動詞",zh:"推斷",ex:"From the clues, we can *deduce* the answer.",lv:2,cefr:"B2"},
  {w:"deep",ph:"/diːp/",pos:"adj.",zh:"深的",ex:"The lake is very *deep*.",lv:0,cefr:"A2"},
  {w:"defend",ph:"/dɪˈfɛnd/",pos:"v. 動詞",zh:"防衛",ex:"She *defended* her opinion well.",lv:1,cefr:"B1"},
  {w:"deficit",ph:"/ˈdɛfɪsɪt/",pos:"n. 名詞",zh:"赤字",ex:"The school has a budget *deficit* this year.",lv:2,cefr:"B2"},
  {w:"define",ph:"/dɪˈfaɪn/",pos:"v. 動詞",zh:"定義",ex:"*Define* the term.",lv:2,cefr:"B2"},
  {w:"definitely",ph:"/ˈdɛfɪnɪtli/",pos:"adv. 副詞",zh:"肯定地",ex:"She will *definitely* come.",lv:1,cefr:"B1"},
  {w:"delay",ph:"/dɪˈleɪ/",pos:"v.",zh:"延遲",ex:"The flight was *delayed* by two hours.",lv:1,cefr:"B1"},
  {w:"deliberate",ph:"/dɪˈlɪbərɪt/",pos:"adj.",zh:"故意的",ex:"That was a *deliberate* mistake.",lv:2,cefr:"B2"},
  {w:"delicious",ph:"/dɪˈlɪʃəs/",pos:"adj. 形容詞",zh:"美味的",ex:"This cake is really *delicious*.",lv:0,cefr:"A2"},
  {w:"deliver",ph:"/dɪˈlɪvər/",pos:"v. 動詞",zh:"遞送",ex:"The package was *delivered* this morning.",lv:1,cefr:"B1"},
  {w:"demand",ph:"/dɪˈmɑːnd/",pos:"n.",zh:"需求",ex:"The *demand* for clean energy is rising.",lv:1,cefr:"B1"},
  {w:"demonstrate",ph:"/ˈdɛmənstreɪt/",pos:"v. 動詞",zh:"示範",ex:"She *demonstrated* how to solve it.",lv:1,cefr:"B2"},
  {w:"dentist",ph:"/ˈdɛntɪst/",pos:"n. 名詞",zh:"牙醫",ex:"I have an appointment with the *dentist*.",lv:0,cefr:"A2"},
  {w:"depend",ph:"/dɪˈpɛnd/",pos:"v. 動詞",zh:"依靠",ex:"Success *depends* on hard work.",lv:1,cefr:"B1"},
  {w:"derive",ph:"/dɪˈraɪv/",pos:"v. 動詞",zh:"源自",ex:"Many English words *derive* from Latin.",lv:2,cefr:"B2"},
  {w:"describe",ph:"/dɪˈskraɪb/",pos:"v. 動詞",zh:"描述",ex:"Can you *describe* what you saw?",lv:1,cefr:"B1"},
  {w:"desert",ph:"/ˈdɛzərt/",pos:"n. 名詞",zh:"沙漠",ex:"The *desert* is very hot.",lv:0,cefr:"A2"},
  {w:"design",ph:"/dɪˈzaɪn/",pos:"n.",zh:"設計",ex:"She *designed* the poster herself.",lv:1,cefr:"B1"},
  {w:"desk",ph:"/dɛsk/",pos:"n. 名詞",zh:"書桌",ex:"She sat at her *desk* and studied.",lv:0,cefr:"A2"},
  {w:"determine",ph:"/dɪˈtɜːmɪn/",pos:"v. 動詞",zh:"決定",ex:"Your effort *determines* your success.",lv:2,cefr:"B2"},
  {w:"develop",ph:"/dɪˈvɛləp/",pos:"v. 動詞",zh:"發展",ex:"She is trying to *develop* her skills.",lv:1,cefr:"B1"},
  {w:"devote",ph:"/dɪˈvəʊt/",pos:"v. 動詞",zh:"致力於",ex:"She *devotes* her time to helping others.",lv:2,cefr:"B2"},
  {w:"diamond",ph:"/ˈdaɪəmənd/",pos:"n. 名詞",zh:"菱形；鑽石",ex:"She wore a *diamond* ring.",lv:0,cefr:"A2"},
  {w:"diary",ph:"/ˈdaɪəri/",pos:"n. 名詞",zh:"日記",ex:"She writes in her *diary* every night.",lv:0,cefr:"A2"},
  {w:"dictionary",ph:"/ˈdɪkʃənɛri/",pos:"n. 名詞",zh:"字典",ex:"Look it up in the *dictionary*.",lv:0,cefr:"A2"},
  {w:"die",ph:"/daɪ/",pos:"v. 動詞",zh:"死亡",ex:"Plants *die* without water.",lv:0,cefr:"A2"},
  {w:"diet",ph:"/ˈdaɪɪt/",pos:"n.",zh:"飲食",ex:"A balanced *diet*.",lv:1,cefr:"B1"},
  {w:"difference",ph:"/ˈdɪfrəns/",pos:"n. 名詞",zh:"差異",ex:"What is the *difference* between the two?",lv:1,cefr:"B1"},
  {w:"different",ph:"/ˈdɪfrənt/",pos:"adj. 形容詞",zh:"不同的",ex:"Every person is *different*.",lv:0,cefr:"A2"},
  {w:"difficult",ph:"/ˈdɪfɪkəlt/",pos:"adj. 形容詞",zh:"困難的",ex:"This math problem is very *difficult*.",lv:0,cefr:"A2"},
  {w:"digital",ph:"/ˈdɪdʒɪtəl/",pos:"adj. 形容詞",zh:"數位的",ex:"We live in a *digital* age.",lv:1,cefr:"B1"},
  {w:"dinner",ph:"/ˈdɪnər/",pos:"n. 名詞",zh:"晚餐",ex:"The family eats *dinner* together.",lv:0,cefr:"A1"},
  {w:"dinosaur",ph:"/ˈdaɪnəsɔːr/",pos:"n. 名詞",zh:"恐龍",ex:"*Dinosaurs* are extinct.",lv:0,cefr:"A2"},
  {w:"direction",ph:"/dɪˈrɛkʃən/",pos:"n. 名詞",zh:"方向",ex:"Can you give me *directions* to the station?",lv:0,cefr:"A2"},
  {w:"directly",ph:"/dɪˈrɛktli/",pos:"adv. 副詞",zh:"直接地",ex:"Go *directly* home.",lv:1,cefr:"B1"},
  {w:"dirty",ph:"/ˈdɜːti/",pos:"adj. 形容詞",zh:"髒的",ex:"His shoes are very *dirty*.",lv:0,cefr:"A2"},
  {w:"disagree",ph:"/ˌdɪsəˈɡriː/",pos:"v.",zh:"不同意",ex:"I *disagree*.",lv:1,cefr:"B1"},
  {w:"disappear",ph:"/ˌdɪsəˈpɪər/",pos:"v. 動詞",zh:"消失",ex:"The fog began to *disappear* at noon.",lv:1,cefr:"B1"},
  {w:"discount",ph:"nan",pos:"n.",zh:"折扣",ex:"We got a 10% *discount*.",lv:0,cefr:"A2"},
  {w:"discourse",ph:"/ˈdɪskɔːs/",pos:"n. 名詞",zh:"論述",ex:"Academic *discourse* requires precision.",lv:2,cefr:"B2"},
  {w:"discover",ph:"/dɪˈskʌvər/",pos:"v. 動詞",zh:"發現",ex:"Scientists hope to *discover* new planets.",lv:1,cefr:"B1"},
  {w:"discriminate",ph:"/dɪˈskrɪmɪneɪt/",pos:"v. 動詞",zh:"歧視",ex:"It is wrong to *discriminate* against others.",lv:2,cefr:"B2"},
  {w:"discuss",ph:"/dɪˈskʌs/",pos:"v. 動詞",zh:"討論",ex:"Let's *discuss* the plan together.",lv:1,cefr:"B1"},
  {w:"discussion",ph:"/dɪˈskʌʃən/",pos:"n. 名詞",zh:"討論",ex:"Have a *discussion*.",lv:1,cefr:"B1"},
  {w:"disease",ph:"/dɪˈziːz/",pos:"n.",zh:"疾病",ex:"The *disease* spread.",lv:1,cefr:"B1"},
  {w:"dish",ph:"/dɪʃ/",pos:"n. 名詞",zh:"菜餚",ex:"She cooked a delicious *dish*.",lv:0,cefr:"A2"},
  {w:"distance",ph:"/ˈdɪstəns/",pos:"n. 名詞",zh:"距離",ex:"The *distance* between the cities is 100 km.",lv:1,cefr:"B1"},
  {w:"distinguish",ph:"/dɪˈstɪŋɡwɪʃ/",pos:"v. 動詞",zh:"區別",ex:"Can you *distinguish* between the two sounds?",lv:2,cefr:"B2"},
  {w:"distribute",ph:"/dɪˈstrɪbjuːt/",pos:"v. 動詞",zh:"分發；分配",ex:"*Distribute* the materials.",lv:2,cefr:"B2"},
  {w:"diverse",ph:"/daɪˈvɜːs/",pos:"adj. 形容詞",zh:"多元的",ex:"Our class has a *diverse* group of students.",lv:1,cefr:"B2"},
  {w:"diversity",ph:"/daɪˈvɜːrsɪti/",pos:"n. 名詞",zh:"多樣性",ex:"*Diversity* is strength.",lv:2,cefr:"B2"},
  {w:"divide",ph:"/dɪˈvaɪd/",pos:"v. 動詞",zh:"分割；除",ex:"*Divide* into groups.",lv:1,cefr:"B1"},
  {w:"doctor",ph:"/ˈdɒktər/",pos:"n. 名詞",zh:"醫生",ex:"She visited the *doctor*.",lv:0,cefr:"A2"},
  {w:"document",ph:"/ˈdɒkjəmənt/",pos:"n.",zh:"文件",ex:"Please sign the *document*.",lv:1,cefr:"B1"},
  {w:"dog",ph:"/dɒɡ/",pos:"n. 名詞",zh:"狗",ex:"She walks her *dog* every morning.",lv:0,cefr:"A1"},
  {w:"dollar",ph:"/ˈdɒlər/",pos:"n.",zh:"元",ex:"Three *dollars*.",lv:0,cefr:"A2"},
  {w:"dolphin",ph:"/ˈdɒlfɪn/",pos:"n. 名詞",zh:"海豚",ex:"*Dolphins* are smart.",lv:0,cefr:"A2"},
  {w:"dominant",ph:"/ˈdɒmɪnənt/",pos:"adj. 形容詞",zh:"主導的",ex:"English is the *dominant* language in business.",lv:2,cefr:"B2"},
  {w:"donate",ph:"/doʊˈneɪt/",pos:"v. 動詞",zh:"捐贈",ex:"She *donated* money.",lv:1,cefr:"B1"},
  {w:"door",ph:"/dɔːr/",pos:"n. 名詞",zh:"門",ex:"Please close the *door* when you leave.",lv:0,cefr:"A1"},
  {w:"double",ph:"/ˈdʌbəl/",pos:"adj.",zh:"雙倍的",ex:"He ordered a *double* portion of fries.",lv:0,cefr:"A2"},
  {w:"doubt",ph:"nan",pos:"v.",zh:"懷疑",ex:"I *doubt* he will come.",lv:2,cefr:"B2"},
  {w:"down",ph:"/daʊn/",pos:"adv.",zh:"向下",ex:"Sit *down*.",lv:0,cefr:"A1"},
  {w:"download",ph:"/ˈdaʊnloʊd/",pos:"v. 動詞",zh:"下載",ex:"*Download* the file.",lv:0,cefr:"A2"},
  {w:"downstairs",ph:"/ˌdaʊnˈstɛrz/",pos:"adv. 副詞",zh:"樓下",ex:"Come *downstairs*.",lv:0,cefr:"A2"},
  {w:"downtown",ph:"nan",pos:"adv.",zh:"在市中心",ex:"Let us meet *downtown*.",lv:0,cefr:"A2"},
  {w:"dramatic",ph:"/drəˈmætɪk/",pos:"adj. 形容詞",zh:"戲劇性的",ex:"A *dramatic* change.",lv:2,cefr:"B2"},
  {w:"draw",ph:"/drɔː/",pos:"v. 動詞",zh:"畫",ex:"She loves to *draw* portraits.",lv:0,cefr:"A2"},
  {w:"drawer",ph:"/drɔːr/",pos:"n. 名詞",zh:"抽屜",ex:"The keys are in the *drawer*.",lv:0,cefr:"A1"},
  {w:"drawing",ph:"/ˈdrɔːɪŋ/",pos:"n. 名詞",zh:"繪圖",ex:"*Drawing* is her hobby.",lv:0,cefr:"A1"},
  {w:"dream",ph:"/driːm/",pos:"n.",zh:"夢想",ex:"She has a *dream* of becoming a singer.",lv:0,cefr:"A2"},
  {w:"dress",ph:"/drɛs/",pos:"n. 名詞",zh:"裙子",ex:"She wears a pretty *dress*.",lv:0,cefr:"A1"},
  {w:"drink",ph:"/drɪŋk/",pos:"v.",zh:"喝",ex:"She *drinks* eight glasses of water daily.",lv:0,cefr:"A1"},
  {w:"drive",ph:"/draɪv/",pos:"v. 動詞",zh:"開車",ex:"My father can *drive* very well.",lv:0,cefr:"A1"},
  {w:"drop",ph:"/drɒp/",pos:"v.",zh:"掉落",ex:"Don't *drop* your phone.",lv:0,cefr:"A2"},
  {w:"drought",ph:"/draʊt/",pos:"n. 名詞",zh:"乾旱",ex:"The *drought* lasted months.",lv:1,cefr:"B1"},
  {w:"dry",ph:"/draɪ/",pos:"adj.",zh:"乾的",ex:"Use a *dry* cloth.",lv:0,cefr:"A1"},
  {w:"duck",ph:"/dʌk/",pos:"n. 名詞",zh:"鴨子",ex:"The *duck* swims in the pond.",lv:0,cefr:"A1"},
  {w:"during",ph:"/ˈdjʊərɪŋ/",pos:"prep. 介系詞",zh:"在…期間",ex:"*during* the summer, she took a cooking class.",lv:0,cefr:"A2"},
  {w:"dynamic",ph:"/daɪˈnæmɪk/",pos:"adj.",zh:"動態的",ex:"She has a *dynamic* personality.",lv:2,cefr:"B2"},
  {w:"each",ph:"nan",pos:"det.",zh:"每個",ex:"*each* student has a book.",lv:0,cefr:"A1"},
  {w:"ear",ph:"/ɪər/",pos:"n.",zh:"耳朵",ex:"She has pain in her *ear*.",lv:0,cefr:"A1"},
  {w:"early",ph:"/ˈɜːli/",pos:"adj.",zh:"早的",ex:"She wakes up *early* every morning.",lv:0,cefr:"A2"},
  {w:"earn",ph:"/ɜːrn/",pos:"v. 動詞",zh:"賺取",ex:"She works hard to *earn* money.",lv:0,cefr:"A2"},
  {w:"earphones",ph:"/ˈɪərfoʊnz/",pos:"n. 名詞",zh:"耳機",ex:"She listens with *earphones*.",lv:0,cefr:"A2"},
  {w:"earth",ph:"/ɜːrθ/",pos:"n. 名詞",zh:"地球",ex:"We only have one *earth*.",lv:0,cefr:"A2"},
  {w:"earthquake",ph:"/ˈɜːrθkweɪk/",pos:"n. 名詞",zh:"地震",ex:"An *earthquake* shook the city.",lv:1,cefr:"B1"},
  {w:"easily",ph:"/ˈiːzɪli/",pos:"adv. 副詞",zh:"輕易地",ex:"She can do it *easily*.",lv:0,cefr:"A2"},
  {w:"east",ph:"nan",pos:"n.",zh:"東方",ex:"The sun rises in the *east*.",lv:0,cefr:"A1"},
  {w:"easy",ph:"/ˈiːzi/",pos:"adj. 形容詞",zh:"容易的",ex:"This quiz is very *easy*.",lv:0,cefr:"A1"},
  {w:"eat",ph:"/iːt/",pos:"v. 動詞",zh:"吃",ex:"What do you want to *eat*?",lv:0,cefr:"A1"},
  {w:"edge",ph:"/ɛdʒ/",pos:"n. 名詞",zh:"邊緣",ex:"Don't stand too close to the *edge*.",lv:0,cefr:"A2"},
  {w:"education",ph:"/ˌɛdʒuˈkeɪʃən/",pos:"n. 名詞",zh:"教育",ex:"*education* is the key to a better future.",lv:1,cefr:"B1"},
  {w:"effect",ph:"/ɪˈfɛkt/",pos:"n. 名詞",zh:"效果",ex:"Exercise has a positive *effect* on health.",lv:1,cefr:"B1"},
  {w:"effective",ph:"/ɪˈfɛktɪv/",pos:"adj. 形容詞",zh:"有效的",ex:"This method is very *effective*.",lv:1,cefr:"B1"},
  {w:"efficiency",ph:"/ɪˈfɪʃənsi/",pos:"n.",zh:"效率",ex:"Improve *efficiency*.",lv:2,cefr:"B2"},
  {w:"efficient",ph:"/ɪˈfɪʃənt/",pos:"adj. 形容詞",zh:"效率高的",ex:"She is an *efficient* worker.",lv:2,cefr:"B2"},
  {w:"effort",ph:"/ˈɛfərt/",pos:"n. 名詞",zh:"努力",ex:"She put great *effort* into her project.",lv:0,cefr:"B1"},
  {w:"egg",ph:"/ɛɡ/",pos:"n.",zh:"蛋",ex:"I eat an *egg* every morning.",lv:0,cefr:"A1"},
  {w:"eight",ph:"/eɪt/",pos:"num. 數詞",zh:"八",ex:"I wake up at *eight*.",lv:0,cefr:"A1"},
  {w:"eighteen",ph:"/ˌeɪˈtiːn/",pos:"num. 數詞",zh:"十八",ex:"She is *eighteen* now.",lv:0,cefr:"A1"},
  {w:"eighth",ph:"/eɪtθ/",pos:"adj. 形容詞",zh:"第八",ex:"This is the *eighth* floor.",lv:0,cefr:"A1"},
  {w:"eighty",ph:"/ˈeɪti/",pos:"num. 數詞",zh:"八十",ex:"She is *eighty* years old.",lv:0,cefr:"A1"},
  {w:"either",ph:"nan",pos:"det.",zh:"兩者之一",ex:"*either* day is fine.",lv:0,cefr:"A2"},
  {w:"elaborate",ph:"/ɪˈlæbərɪt/",pos:"adj.",zh:"詳細的",ex:"She gave an *elaborate* explanation.",lv:2,cefr:"C1"},
  {w:"elbow",ph:"/ˈɛlboʊ/",pos:"n. 名詞",zh:"手肘",ex:"He bumped his *elbow*.",lv:0,cefr:"A1"},
  {w:"elect",ph:"/ɪˈlɛkt/",pos:"v. 動詞",zh:"選舉",ex:"*Elect* a new leader.",lv:1,cefr:"B1"},
  {w:"elephant",ph:"/ˈɛlɪfənt/",pos:"n. 名詞",zh:"大象",ex:"*Elephants* have big ears.",lv:0,cefr:"A1"},
  {w:"elevator",ph:"/ˈɛlɪveɪtər/",pos:"n. 名詞",zh:"電梯",ex:"Take the *elevator* to the fifth floor.",lv:0,cefr:"A2"},
  {w:"eleven",ph:"/ɪˈlɛvən/",pos:"num. 數詞",zh:"十一",ex:"There are *eleven* players.",lv:0,cefr:"A1"},
  {w:"eliminate",ph:"/ɪˈlɪmɪneɪt/",pos:"v. 動詞",zh:"消除",ex:"We need to *eliminate* all errors.",lv:2,cefr:"B2"},
  {w:"eloquent",ph:"/ˈɛləkwənt/",pos:"adj.",zh:"雄辯的",ex:"An *eloquent* speech.",lv:2,cefr:"C1"},
  {w:"else",ph:"nan",pos:"adv.",zh:"其他",ex:"What *else* do you need?",lv:0,cefr:"A2"},
  {w:"email",ph:"/ˈiːmeɪl/",pos:"n. 名詞",zh:"電子郵件",ex:"Send me an *email*.",lv:0,cefr:"A2"},
  {w:"embarrassed",ph:"/ɪmˈbærəst/",pos:"adj. 形容詞",zh:"尷尬的",ex:"He was *embarrassed*.",lv:0,cefr:"A2"},
  {w:"emerge",ph:"/ɪˈmɜːrdʒ/",pos:"v.",zh:"浮現",ex:"Problems *emerged*.",lv:2,cefr:"B2"},
  {w:"emotion",ph:"/ɪˈməʊʃən/",pos:"n. 名詞",zh:"情感",ex:"She could not hide her *emotion*.",lv:1,cefr:"B1"},
  {w:"emphasize",ph:"/ˈɛmfəsaɪz/",pos:"v. 動詞",zh:"強調",ex:"The teacher *emphasized* the importance of practice.",lv:2,cefr:"B2"},
  {w:"empirical",ph:"/ɪmˈpɪrɪkəl/",pos:"adj. 形容詞",zh:"實證的",ex:"The theory is supported by *empirical* evidence.",lv:2,cefr:"B2"},
  {w:"empty",ph:"/ˈɛmpti/",pos:"adj.",zh:"空的",ex:"The classroom is *empty* after school.",lv:0,cefr:"A2"},
  {w:"enable",ph:"/ɪˈneɪbəl/",pos:"v.",zh:"使能夠",ex:"Technology *enables* us.",lv:2,cefr:"B2"},
  {w:"encourage",ph:"/ɪnˈkʌrɪdʒ/",pos:"v. 動詞",zh:"鼓勵",ex:"Teachers should *encourage* students.",lv:1,cefr:"B1"},
  {w:"end",ph:"/ɛnd/",pos:"n.",zh:"結束",ex:"The movie *ends* at nine.",lv:0,cefr:"A1"},
  {w:"energy",ph:"/ˈɛnədʒi/",pos:"n. 名詞",zh:"能量",ex:"Solar *energy* is clean and renewable.",lv:1,cefr:"B1"},
  {w:"enforce",ph:"/ɪnˈfɔːs/",pos:"v. 動詞",zh:"執行",ex:"Laws must be *enforced* fairly.",lv:2,cefr:"B2"},
  {w:"engage",ph:"/ɪnˈɡeɪdʒ/",pos:"v. 動詞",zh:"從事",ex:"Students should *engage* in class discussions.",lv:1,cefr:"B1"},
  {w:"engineer",ph:"/ˌɛndʒɪˈnɪər/",pos:"n. 名詞",zh:"工程師",ex:"He is an *engineer*.",lv:1,cefr:"B1"},
  {w:"English",ph:"/ˈɪŋɡlɪʃ/",pos:"n. 名詞",zh:"英文",ex:"She studies *English* every day.",lv:0,cefr:"A1"},
  {w:"enhance",ph:"/ɪnˈhɑːns/",pos:"v. 動詞",zh:"提升",ex:"Reading can *enhance* your vocabulary.",lv:2,cefr:"B2"},
  {w:"enjoy",ph:"/ɪnˈdʒɔɪ/",pos:"v. 動詞",zh:"享受",ex:"I *enjoy* reading books.",lv:0,cefr:"A2"},
  {w:"enough",ph:"/ɪˈnʌf/",pos:"adj.",zh:"足夠的",ex:"Do you have *enough* money?",lv:0,cefr:"A2"},
  {w:"ensure",ph:"/ɪnˈʃʊər/",pos:"v. 動詞",zh:"確保",ex:"*Ensure* everyone is safe.",lv:2,cefr:"B2"},
  {w:"enter",ph:"/ˈɛntər/",pos:"v. 動詞",zh:"進入",ex:"Please *enter* the classroom quietly.",lv:0,cefr:"A2"},
  {w:"entrance",ph:"/ˈɛntrəns/",pos:"n. 名詞",zh:"入口",ex:"Use the main *entrance*.",lv:0,cefr:"A2"},
  {w:"environment",ph:"/ɪnˈvaɪrənmənt/",pos:"n. 名詞",zh:"環境",ex:"We should protect the *environment*.",lv:0,cefr:"B1"},
  {w:"equal",ph:"/ˈiːkwəl/",pos:"adj. 形容詞",zh:"相等的",ex:"Everyone deserves *equal* treatment.",lv:1,cefr:"B1"},
  {w:"erase",ph:"/ɪˈreɪs/",pos:"v. 動詞",zh:"擦掉",ex:"*Erase* the mistake.",lv:0,cefr:"A1"},
  {w:"eraser",ph:"/ɪˈreɪzər/",pos:"n.",zh:"橡皮擦",ex:"I need an *eraser*.",lv:0,cefr:"A2"},
  {w:"escape",ph:"/ɪˈskeɪp/",pos:"v. 動詞",zh:"逃跑",ex:"The bird *escaped*.",lv:0,cefr:"A2"},
  {w:"especially",ph:"/ɪˈspɛʃəli/",pos:"adv.",zh:"尤其",ex:"*Especially* mangoes.",lv:1,cefr:"B1"},
  {w:"establish",ph:"/ɪˈstæblɪʃ/",pos:"v. 動詞",zh:"建立",ex:"The company was *established* in 2005.",lv:1,cefr:"B2"},
  {w:"ethical",ph:"/ˈɛθɪkəl/",pos:"adj. 形容詞",zh:"合乎倫理的",ex:"Doctors must make *ethical* decisions.",lv:2,cefr:"B2"},
  {w:"evaluate",ph:"/ɪˈvæljueɪt/",pos:"v. 動詞",zh:"評估",ex:"*evaluate* the pros and cons carefully.",lv:2,cefr:"B2"},
  {w:"evening",ph:"/ˈiːvnɪŋ/",pos:"n. 名詞",zh:"傍晚",ex:"She reads books in the *evening*.",lv:0,cefr:"A1"},
  {w:"event",ph:"/ɪˈvɛnt/",pos:"n. 名詞",zh:"事件",ex:"The annual sports *event* is next week.",lv:1,cefr:"B1"},
  {w:"eventually",ph:"/ɪˈvɛntʃuəli/",pos:"adv.",zh:"最終",ex:"She *eventually* passed.",lv:1,cefr:"B1"},
  {w:"every",ph:"/ˈɛvri/",pos:"adj. 形容詞",zh:"每一個",ex:"She reads a book *every* week.",lv:0,cefr:"A1"},
  {w:"everybody",ph:"nan",pos:"pron.",zh:"每個人",ex:"*everybody* loves music.",lv:0,cefr:"A1"},
  {w:"everyone",ph:"/ˈɛvrɪwʌn/",pos:"pron. 代名詞",zh:"每個人",ex:"*everyone* in the class passed the test.",lv:0,cefr:"A2"},
  {w:"everywhere",ph:"nan",pos:"adv.",zh:"到處",ex:"I looked *everywhere* for it.",lv:0,cefr:"A2"},
  {w:"evidence",ph:"/ˈɛvɪdəns/",pos:"n. 名詞",zh:"證據",ex:"There is no *evidence* of wrongdoing.",lv:1,cefr:"B1"},
  {w:"exact",ph:"/ɪɡˈzækt/",pos:"adj. 形容詞",zh:"確切的",ex:"Give the *exact* time.",lv:1,cefr:"B1"},
  {w:"exactly",ph:"/ɪɡˈzæktli/",pos:"adv. 副詞",zh:"正確地",ex:"That is *exactly* what I meant.",lv:0,cefr:"A2"},
  {w:"exaggerate",ph:"/ɪɡˈzædʒəreɪt/",pos:"v. 動詞",zh:"誇大",ex:"Don't *exaggerate*; just tell the truth.",lv:2,cefr:"B2"},
  {w:"exam",ph:"/ɪɡˈzæm/",pos:"n. 名詞",zh:"考試",ex:"She studied for the *exam*.",lv:1,cefr:"B1"},
  {w:"examine",ph:"/ɪɡˈzæmɪn/",pos:"v. 動詞",zh:"檢查",ex:"The doctor *examined* the patient.",lv:1,cefr:"B2"},
  {w:"example",ph:"/ɪɡˈzɑːmpəl/",pos:"n. 名詞",zh:"例子",ex:"Can you give me an *example*?",lv:0,cefr:"A2"},
  {w:"excellent",ph:"/ˈɛksələnt/",pos:"adj. 形容詞",zh:"優秀的",ex:"She received an *excellent* review.",lv:1,cefr:"B1"},
  {w:"except",ph:"/ɪkˈsɛpt/",pos:"prep.",zh:"除了…以外",ex:"*except* for Tom, everyone came.",lv:0,cefr:"B1"},
  {w:"excited",ph:"/ɪkˈsaɪtɪd/",pos:"adj. 形容詞",zh:"興奮的",ex:"The children are *excited* about the trip.",lv:0,cefr:"A2"},
  {w:"excuse",ph:"nan",pos:"n.",zh:"藉口",ex:"*excuse* me, where is the library?",lv:0,cefr:"A2"},
  {w:"exercise",ph:"/ˈɛksəsaɪz/",pos:"n.",zh:"運動",ex:"*exercise* is good for your health.",lv:0,cefr:"A2"},
  {w:"exhibition",ph:"/ˌɛksɪˈbɪʃən/",pos:"n. 名詞",zh:"展覽",ex:"Attend the *exhibition*.",lv:1,cefr:"B1"},
  {w:"expand",ph:"/ɪkˈspænd/",pos:"v.",zh:"擴展",ex:"Plans to *expand*.",lv:2,cefr:"B2"},
  {w:"expect",ph:"/ɪkˈspɛkt/",pos:"v. 動詞",zh:"期待",ex:"I *expect* you to do your best.",lv:1,cefr:"B1"},
  {w:"expensive",ph:"/ɪkˈspɛnsɪv/",pos:"adj. 形容詞",zh:"昂貴的",ex:"That watch is very *expensive*.",lv:0,cefr:"A2"},
  {w:"experience",ph:"/ɪkˈspɪərɪəns/",pos:"n.",zh:"經驗",ex:"This was an amazing *experience*.",lv:1,cefr:"B1"},
  {w:"experiment",ph:"/ɪkˈspɛrɪmənt/",pos:"n.",zh:"實驗",ex:"Scientists conducted an *experiment*.",lv:1,cefr:"B1"},
  {w:"expert",ph:"/ˈɛkspɜːrt/",pos:"n. 名詞",zh:"專家",ex:"She is an *expert* in math.",lv:1,cefr:"B1"},
  {w:"explain",ph:"/ɪkˈspleɪn/",pos:"v. 動詞",zh:"解釋",ex:"Can you *explain* this rule to me?",lv:0,cefr:"B1"},
  {w:"explicit",ph:"/ɪkˈsplɪsɪt/",pos:"adj. 形容詞",zh:"明確的",ex:"The instructions must be *explicit*.",lv:2,cefr:"C1"},
  {w:"exploit",ph:"/ɪkˈsplɔɪt/",pos:"v.",zh:"利用",ex:"We should not *exploit* natural resources.",lv:2,cefr:"B2"},
  {w:"explore",ph:"/ɪkˈsplɔːr/",pos:"v. 動詞",zh:"探索",ex:"She loves to *explore* new places.",lv:1,cefr:"B2"},
  {w:"express",ph:"/ɪkˈsprɛs/",pos:"v. 動詞",zh:"表達",ex:"It is important to *express* your feelings.",lv:1,cefr:"B1"},
  {w:"expression",ph:"/ɪkˈsprɛʃən/",pos:"n. 名詞",zh:"表情；表達",ex:"A funny *expression*.",lv:1,cefr:"B1"},
  {w:"extend",ph:"/ɪkˈstɛnd/",pos:"v. 動詞",zh:"延伸",ex:"The deadline was *extended* by a week.",lv:1,cefr:"B1"},
  {w:"extra",ph:"/ˈɛkstrə/",pos:"adj. 形容詞",zh:"額外的",ex:"Take an *extra* pen.",lv:0,cefr:"A2"},
  {w:"extremely",ph:"/ɪkˈstriːmli/",pos:"adv. 副詞",zh:"極度地",ex:"She was *extremely* happy.",lv:1,cefr:"B1"},
  {w:"eye",ph:"/aɪ/",pos:"n. 名詞",zh:"眼睛",ex:"She has beautiful brown *eyes*.",lv:0,cefr:"A1"},
  {w:"face",ph:"/feɪs/",pos:"n.",zh:"臉",ex:"She has a kind *face*.",lv:0,cefr:"A1"},
  {w:"facilitate",ph:"/fəˈsɪlɪteɪt/",pos:"v. 動詞",zh:"促進",ex:"Technology *facilitates* communication.",lv:2,cefr:"C1"},
  {w:"fact",ph:"/fækt/",pos:"n. 名詞",zh:"事實",ex:"In *fact*, she has been here before.",lv:0,cefr:"A2"},
  {w:"factory",ph:"/ˈfæktəri/",pos:"n. 名詞",zh:"工廠",ex:"She works in a *factory*.",lv:1,cefr:"B1"},
  {w:"fail",ph:"/feɪl/",pos:"v. 動詞",zh:"失敗",ex:"Don't be afraid to *fail* and try again.",lv:1,cefr:"B1"},
  {w:"failure",ph:"/ˈfeɪljər/",pos:"n. 名詞",zh:"失敗",ex:"*failure* is a stepping stone to success.",lv:1,cefr:"B1"},
  {w:"fair",ph:"/fɛr/",pos:"adj.",zh:"公平的",ex:"Very *fair*.",lv:0,cefr:"A2"},
  {w:"fall",ph:"/fɔːl/",pos:"v.",zh:"跌落",ex:"The leaves *fall* in autumn.",lv:0,cefr:"A1"},
  {w:"familiar",ph:"/fəˈmɪlɪər/",pos:"adj. 形容詞",zh:"熟悉的",ex:"The song sounds *familiar*.",lv:1,cefr:"B1"},
  {w:"family",ph:"/ˈfæmɪli/",pos:"n. 名詞",zh:"家庭",ex:"She comes from a large *family*.",lv:0,cefr:"A1"},
  {w:"famous",ph:"/ˈfeɪməs/",pos:"adj. 形容詞",zh:"著名的",ex:"She is a *famous* singer.",lv:0,cefr:"A2"},
  {w:"fantastic",ph:"nan",pos:"adj.",zh:"極好的",ex:"The show was *fantastic*.",lv:0,cefr:"A2"},
  {w:"far",ph:"/fɑːr/",pos:"adj.",zh:"遠的",ex:"The school is not *far* from here.",lv:0,cefr:"A2"},
  {w:"farm",ph:"/fɑːrm/",pos:"n.",zh:"農場",ex:"She grew up on a *farm*.",lv:0,cefr:"A2"},
  {w:"farmer",ph:"/ˈfɑːrmər/",pos:"n. 名詞",zh:"農夫",ex:"The *farmer* grows rice.",lv:0,cefr:"A2"},
  {w:"fashion",ph:"nan",pos:"n.",zh:"時尚",ex:"She follows the latest *fashion*.",lv:1,cefr:"B1"},
  {w:"fast",ph:"/fɑːst/",pos:"adj.",zh:"快速的",ex:"He runs very *fast*.",lv:0,cefr:"A1"},
  {w:"fat",ph:"/fæt/",pos:"adj.",zh:"胖的",ex:"The cat is very *fat*.",lv:0,cefr:"A1"},
  {w:"father",ph:"/ˈfɑːðər/",pos:"n. 名詞",zh:"父親",ex:"Her *father* is a doctor.",lv:0,cefr:"A1"},
  {w:"favorite",ph:"/ˈfeɪvərɪt/",pos:"adj.",zh:"最喜愛的",ex:"What is your *favorite* subject?",lv:0,cefr:"A2"},
  {w:"feature",ph:"/ˈfiːtʃər/",pos:"n. 名詞",zh:"特色；特徵",ex:"What are the *features*?",lv:1,cefr:"B1"},
  {w:"February",ph:"/ˈfɛbruɛri/",pos:"n. 名詞",zh:"二月",ex:"*February* has 28 or 29 days.",lv:0,cefr:"A1"},
  {w:"feel",ph:"/fiːl/",pos:"v. 動詞",zh:"感覺",ex:"I *feel* happy today.",lv:0,cefr:"A2"},
  {w:"fever",ph:"/ˈfiːvər/",pos:"n. 名詞",zh:"發燒",ex:"She has a *fever* and needs to rest.",lv:0,cefr:"A2"},
  {w:"few",ph:"nan",pos:"det.",zh:"幾個",ex:"A *few* people came.",lv:0,cefr:"A2"},
  {w:"field",ph:"/fiːld/",pos:"n. 名詞",zh:"田野",ex:"The children played in the *field*.",lv:0,cefr:"A2"},
  {w:"fierce",ph:"/fɪrs/",pos:"adj. 形容詞",zh:"兇猛的",ex:"The dog is *fierce*.",lv:1,cefr:"B1"},
  {w:"fifteen",ph:"/ˌfɪfˈtiːn/",pos:"num. 數詞",zh:"十五",ex:"There are *fifteen* students.",lv:0,cefr:"A1"},
  {w:"fifth",ph:"/fɪfθ/",pos:"adj. 形容詞",zh:"第五",ex:"She finished *fifth*.",lv:0,cefr:"A1"},
  {w:"fifty",ph:"/ˈfɪfti/",pos:"num. 數詞",zh:"五十",ex:"She walked *fifty* steps.",lv:0,cefr:"A1"},
  {w:"fight",ph:"nan",pos:"v.",zh:"打架",ex:"Do not *fight* with your brother.",lv:0,cefr:"A2"},
  {w:"fill",ph:"nan",pos:"v.",zh:"填滿",ex:"*fill* the cup with water.",lv:0,cefr:"A2"},
  {w:"finally",ph:"/ˈfaɪnəli/",pos:"adv. 副詞",zh:"最終",ex:"She *finally* found her keys.",lv:0,cefr:"A2"},
  {w:"find",ph:"/faɪnd/",pos:"v. 動詞",zh:"找到",ex:"I cannot *find* my keys.",lv:0,cefr:"A1"},
  {w:"finger",ph:"/ˈfɪŋɡər/",pos:"n.",zh:"手指",ex:"She cut her *finger*.",lv:0,cefr:"A1"},
  {w:"finish",ph:"/ˈfɪnɪʃ/",pos:"v. 動詞",zh:"完成",ex:"Please *finish* your homework first.",lv:0,cefr:"A2"},
  {w:"fire",ph:"nan",pos:"n.",zh:"火",ex:"Be careful of *fire*.",lv:0,cefr:"A1"},
  {w:"fire station",ph:"/faɪər ˈsteɪʃən/",pos:"n. 名詞",zh:"消防局",ex:"The *fire station* is near here.",lv:0,cefr:"A2"},
  {w:"firefighter",ph:"/ˈfaɪərfaɪtər/",pos:"n. 名詞",zh:"消防員",ex:"*Firefighters* save lives.",lv:0,cefr:"A2"},
  {w:"first",ph:"/fɜːrst/",pos:"adj. 形容詞",zh:"第一",ex:"She was *first* in line.",lv:0,cefr:"A2"},
  {w:"fish",ph:"/fɪʃ/",pos:"n.",zh:"魚",ex:"She caught a big *fish* in the lake.",lv:0,cefr:"A1"},
  {w:"fishing",ph:"/ˈfɪʃɪŋ/",pos:"n. 名詞",zh:"釣魚",ex:"He goes *fishing* on Sunday.",lv:0,cefr:"A2"},
  {w:"five",ph:"/faɪv/",pos:"num. 數詞",zh:"五",ex:"There are *five* people.",lv:0,cefr:"A1"},
  {w:"fix",ph:"nan",pos:"v.",zh:"修理",ex:"Can you *fix* my bike?",lv:0,cefr:"A2"},
  {w:"flag",ph:"/flæɡ/",pos:"n. 名詞",zh:"旗子",ex:"The national *flag* is raised every morning.",lv:0,cefr:"A2"},
  {w:"flat",ph:"nan",pos:"adj.",zh:"平的",ex:"The road is *flat* here.",lv:0,cefr:"A2"},
  {w:"flexible",ph:"/ˈflɛksɪbəl/",pos:"adj. 形容詞",zh:"靈活的",ex:"A *flexible* schedule helps work-life balance.",lv:1,cefr:"B2"},
  {w:"flood",ph:"/flʌd/",pos:"n. 名詞",zh:"洪水",ex:"The *flood* damaged the town.",lv:0,cefr:"A2"},
  {w:"floor",ph:"/flɔːr/",pos:"n. 名詞",zh:"地板",ex:"Please sweep the *floor*.",lv:0,cefr:"A1"},
  {w:"flower",ph:"/ˈflaʊər/",pos:"n. 名詞",zh:"花",ex:"She bought a bunch of *flowers*.",lv:0,cefr:"A1"},
  {w:"flu",ph:"/fluː/",pos:"n. 名詞",zh:"流感",ex:"He has the *flu*.",lv:0,cefr:"A2"},
  {w:"fluctuate",ph:"/ˈflʌktʃueɪt/",pos:"v. 動詞",zh:"波動",ex:"Prices *fluctuate* with supply and demand.",lv:2,cefr:"B2"},
  {w:"fly",ph:"/flaɪ/",pos:"v.",zh:"飛",ex:"Birds *fly* south in winter.",lv:0,cefr:"A1"},
  {w:"focus",ph:"/ˈfəʊkəs/",pos:"v.",zh:"專注",ex:"Please *focus* on the task.",lv:1,cefr:"B1"},
  {w:"fog",ph:"/fɒɡ/",pos:"n. 名詞",zh:"霧",ex:"The *fog* is thick.",lv:0,cefr:"A2"},
  {w:"follow",ph:"/ˈfɒləʊ/",pos:"v. 動詞",zh:"跟隨",ex:"Please *follow* the instructions.",lv:0,cefr:"A2"},
  {w:"food",ph:"/fuːd/",pos:"n. 名詞",zh:"食物",ex:"Taiwan is famous for its *food*.",lv:0,cefr:"A1"},
  {w:"foot",ph:"/fʊt/",pos:"n.",zh:"腳",ex:"My *foot* hurts.",lv:0,cefr:"A1"},
  {w:"forbid",ph:"/fərˈbɪd/",pos:"v. 動詞",zh:"禁止",ex:"She forbade him to leave.",lv:1,cefr:"B1"},
  {w:"force",ph:"/fɔːrs/",pos:"v.",zh:"強迫",ex:"You shouldn't *force* others to agree.",lv:1,cefr:"B1"},
  {w:"forehead",ph:"/ˈfɔːrɪd/",pos:"n. 名詞",zh:"額頭",ex:"She touched her *forehead*.",lv:0,cefr:"A2"},
  {w:"foreign",ph:"/ˈfɒrɪn/",pos:"adj.",zh:"外國的",ex:"*Foreign* languages.",lv:1,cefr:"B1"},
  {w:"foreigner",ph:"/ˈfɒrɪnər/",pos:"n. 名詞",zh:"外國人",ex:"She met a *foreigner*.",lv:0,cefr:"A2"},
  {w:"forest",ph:"/ˈfɒrɪst/",pos:"n. 名詞",zh:"森林",ex:"Many animals live in the *forest*.",lv:0,cefr:"A2"},
  {w:"forget",ph:"/fəˈɡɛt/",pos:"v. 動詞",zh:"忘記",ex:"Don't *forget* to bring your umbrella.",lv:0,cefr:"A2"},
  {w:"fork",ph:"/fɔːrk/",pos:"n.",zh:"叉子",ex:"Use a *fork*.",lv:0,cefr:"A1"},
  {w:"form",ph:"/fɔːrm/",pos:"n.",zh:"表格",ex:"Fill in the *form*.",lv:1,cefr:"B1"},
  {w:"formal",ph:"/ˈfɔːməl/",pos:"adj. 形容詞",zh:"正式的",ex:"Please wear *formal* clothes to the ceremony.",lv:1,cefr:"B1"},
  {w:"formulate",ph:"/ˈfɔːmjəleɪt/",pos:"v. 動詞",zh:"制定",ex:"She *formulated* a new plan.",lv:2,cefr:"B2"},
  {w:"fortunately",ph:"/ˈfɔːrtʃənɪtli/",pos:"adv. 副詞",zh:"幸運地",ex:"*Fortunately*, no one was hurt.",lv:1,cefr:"B1"},
  {w:"forty",ph:"/ˈfɔːrti/",pos:"num. 數詞",zh:"四十",ex:"There are *forty* students.",lv:0,cefr:"A1"},
  {w:"forward",ph:"/ˈfɔːrwərd/",pos:"adv. 副詞",zh:"向前",ex:"Move *forward*.",lv:0,cefr:"A2"},
  {w:"foundation",ph:"/faʊnˈdeɪʃən/",pos:"n. 名詞",zh:"基礎；基金會",ex:"Build a strong *foundation*.",lv:2,cefr:"B2"},
  {w:"four",ph:"/fɔːr/",pos:"num. 數詞",zh:"四",ex:"I need *four* eggs.",lv:0,cefr:"A1"},
  {w:"fourteen",ph:"/ˌfɔːrˈtiːn/",pos:"num. 數詞",zh:"十四",ex:"I am *fourteen*.",lv:0,cefr:"A1"},
  {w:"fourth",ph:"/fɔːrθ/",pos:"adj. 形容詞",zh:"第四",ex:"This is the *fourth* time.",lv:0,cefr:"A1"},
  {w:"framework",ph:"/ˈfreɪmwɜːrk/",pos:"n. 名詞",zh:"框架",ex:"We need a clear *framework* for the project.",lv:2,cefr:"B2"},
  {w:"free",ph:"/friː/",pos:"adj.",zh:"免費的",ex:"The museum is *free* on Sundays.",lv:0,cefr:"A2"},
  {w:"freedom",ph:"/ˈfriːdəm/",pos:"n.",zh:"自由",ex:"Everyone deserves *freedom*.",lv:1,cefr:"B1"},
  {w:"frequent",ph:"/ˈfriːkwənt/",pos:"adj. 形容詞",zh:"頻繁的",ex:"She makes *frequent* visits to the library.",lv:1,cefr:"B1"},
  {w:"fresh",ph:"/frɛʃ/",pos:"adj. 形容詞",zh:"新鮮的",ex:"She prefers *fresh* vegetables.",lv:0,cefr:"A2"},
  {w:"Friday",ph:"/ˈfraɪdeɪ/",pos:"n. 名詞",zh:"星期五",ex:"*Friday* is the last school day.",lv:0,cefr:"A1"},
  {w:"fridge",ph:"/frɪdʒ/",pos:"n. 名詞",zh:"冰箱",ex:"Put the food in the *fridge*.",lv:0,cefr:"A1"},
  {w:"friend",ph:"/frɛnd/",pos:"n. 名詞",zh:"朋友",ex:"She is my best *friend*.",lv:0,cefr:"A1"},
  {w:"friendly",ph:"/ˈfrɛndli/",pos:"adj. 形容詞",zh:"友善的",ex:"The teacher is very *friendly*.",lv:0,cefr:"A2"},
  {w:"frog",ph:"/frɒɡ/",pos:"n. 名詞",zh:"青蛙",ex:"*Frogs* jump high.",lv:0,cefr:"A1"},
  {w:"front",ph:"/frʌnt/",pos:"n.",zh:"前面",ex:"Please sit at the *front* of the class.",lv:0,cefr:"A2"},
  {w:"fruit",ph:"/fruːt/",pos:"n. 名詞",zh:"水果",ex:"Eating *fruit* every day is healthy.",lv:0,cefr:"A1"},
  {w:"frustrated",ph:"/ˈfrʌstreɪtɪd/",pos:"adj. 形容詞",zh:"沮喪的",ex:"She felt *frustrated*.",lv:1,cefr:"B1"},
  {w:"fry",ph:"/fraɪ/",pos:"v. 動詞",zh:"油炸；炒",ex:"*Fry* the eggs.",lv:0,cefr:"A2"},
  {w:"full",ph:"/fʊl/",pos:"adj. 形容詞",zh:"滿的",ex:"I am *full* — I can't eat any more.",lv:0,cefr:"A2"},
  {w:"fun",ph:"/fʌn/",pos:"n.",zh:"樂趣",ex:"Learning English can be *fun*!",lv:0,cefr:"A1"},
  {w:"function",ph:"/ˈfʌŋkʃən/",pos:"n.",zh:"功能",ex:"Each organ has a specific *function*.",lv:1,cefr:"B1"},
  {w:"fundamental",ph:"/ˌfʌndəˈmɛntəl/",pos:"adj.",zh:"基本的",ex:"Trust is *fundamental* to any relationship.",lv:2,cefr:"B2"},
  {w:"funny",ph:"/ˈfʌni/",pos:"adj. 形容詞",zh:"好笑的",ex:"He told a very *funny* joke.",lv:0,cefr:"A2"},
  {w:"future",ph:"/ˈfjuːtʃər/",pos:"n.",zh:"未來",ex:"What do you want to do in the *future*?",lv:0,cefr:"A2"},
  {w:"gain",ph:"/ɡeɪn/",pos:"v. 動詞",zh:"獲得；增加",ex:"*Gain* experience.",lv:1,cefr:"B1"},
  {w:"game",ph:"/ɡeɪm/",pos:"n. 名詞",zh:"遊戲",ex:"She won the board *game*.",lv:0,cefr:"A1"},
  {w:"garage",ph:"/ɡəˈrɑːʒ/",pos:"n. 名詞",zh:"車庫",ex:"Park in the *garage*.",lv:0,cefr:"A2"},
  {w:"garbage",ph:"nan",pos:"n.",zh:"垃圾",ex:"Take out the *garbage*.",lv:0,cefr:"A2"},
  {w:"garden",ph:"/ˈɡɑːrdən/",pos:"n. 名詞",zh:"花園",ex:"She grows tomatoes in her *garden*.",lv:0,cefr:"A2"},
  {w:"gardening",ph:"/ˈɡɑːrdənɪŋ/",pos:"n. 名詞",zh:"園藝",ex:"She loves *gardening*.",lv:0,cefr:"A2"},
  {w:"gas",ph:"nan",pos:"n.",zh:"氣體",ex:"The *gas* is leaking.",lv:0,cefr:"A2"},
  {w:"gate",ph:"nan",pos:"n.",zh:"大門",ex:"Wait at the *gate*.",lv:0,cefr:"A2"},
  {w:"gather",ph:"/ˈɡæðər/",pos:"v. 動詞",zh:"聚集；收集",ex:"*Gather* information.",lv:1,cefr:"B1"},
  {w:"general",ph:"/ˈdʒɛnərəl/",pos:"adj. 形容詞",zh:"一般的",ex:"As a *general* rule, be kind to others.",lv:1,cefr:"B1"},
  {w:"generally",ph:"/ˈdʒɛnərəli/",pos:"adv. 副詞",zh:"通常；一般地",ex:"*Generally* speaking.",lv:1,cefr:"B1"},
  {w:"generate",ph:"/ˈdʒɛnəreɪt/",pos:"v. 動詞",zh:"產生",ex:"Solar panels *generate* electricity.",lv:1,cefr:"B1"},
  {w:"generous",ph:"/ˈdʒɛnərəs/",pos:"adj. 形容詞",zh:"慷慨的",ex:"She is very *generous*.",lv:1,cefr:"B1"},
  {w:"gentle",ph:"nan",pos:"adj.",zh:"溫和的",ex:"He is *gentle* with animals.",lv:1,cefr:"B1"},
  {w:"genuine",ph:"/ˈdʒɛnjuɪn/",pos:"adj. 形容詞",zh:"真誠的",ex:"Her smile was warm and *genuine*.",lv:2,cefr:"B2"},
  {w:"geography",ph:"/dʒiˈɒɡrəfi/",pos:"n. 名詞",zh:"地理",ex:"*Geography* is interesting.",lv:0,cefr:"A2"},
  {w:"gesture",ph:"/ˈdʒɛstʃər/",pos:"n. 名詞",zh:"手勢；姿態",ex:"She made a kind *gesture*.",lv:1,cefr:"B1"},
  {w:"get",ph:"/ɡɛt/",pos:"v. 動詞",zh:"得到",ex:"I need to *get* some groceries.",lv:0,cefr:"A1"},
  {w:"gift",ph:"/ɡɪft/",pos:"n. 名詞",zh:"禮物",ex:"She received a *gift* for her birthday.",lv:0,cefr:"A2"},
  {w:"girl",ph:"/ɡɜːrl/",pos:"n. 名詞",zh:"女孩",ex:"The little *girl* loves dancing.",lv:0,cefr:"A2"},
  {w:"give",ph:"/ɡɪv/",pos:"v. 動詞",zh:"給",ex:"She will *give* him a gift.",lv:0,cefr:"A1"},
  {w:"glad",ph:"/ɡlæd/",pos:"adj. 形容詞",zh:"高興的",ex:"I am *glad* to see you.",lv:0,cefr:"A2"},
  {w:"glass",ph:"/ɡlɑːs/",pos:"n. 名詞",zh:"玻璃杯",ex:"She drank a *glass* of milk.",lv:0,cefr:"A1"},
  {w:"global",ph:"/ˈɡləʊbəl/",pos:"adj. 形容詞",zh:"全球的",ex:"Climate change is a *global* issue.",lv:1,cefr:"B1"},
  {w:"gloves",ph:"/ɡlʌvz/",pos:"n. 名詞",zh:"手套",ex:"She wore *gloves* in winter.",lv:0,cefr:"A1"},
  {w:"glue",ph:"/ɡluː/",pos:"n. 名詞",zh:"膠水",ex:"Use *glue* to stick it.",lv:0,cefr:"A1"},
  {w:"go",ph:"/ɡəʊ/",pos:"v. 動詞",zh:"去",ex:"Let's *go* to the park after school.",lv:0,cefr:"A1"},
  {w:"goal",ph:"/ɡəʊl/",pos:"n. 名詞",zh:"目標",ex:"My *goal* is to pass the exam.",lv:1,cefr:"B1"},
  {w:"golden",ph:"/ˈɡoʊldən/",pos:"adj. 形容詞",zh:"金色的",ex:"The sunset was *golden*.",lv:0,cefr:"A2"},
  {w:"golf",ph:"/ɡɒlf/",pos:"n. 名詞",zh:"高爾夫球",ex:"He plays *golf*.",lv:0,cefr:"A2"},
  {w:"good",ph:"/ɡʊd/",pos:"adj. 形容詞",zh:"好的",ex:"She is a *good* student.",lv:0,cefr:"A1"},
  {w:"goodbye",ph:"/ɡʊdˈbaɪ/",pos:"int. 感嘆詞",zh:"再見",ex:"Say *goodbye* to your friends.",lv:0,cefr:"A2"},
  {w:"govern",ph:"/ˈɡʌvən/",pos:"v. 動詞",zh:"統治",ex:"Laws *govern* our behavior in society.",lv:1,cefr:"B1"},
  {w:"government",ph:"/ˈɡʌvənmənt/",pos:"n. 名詞",zh:"政府",ex:"The *government* passed a new law.",lv:1,cefr:"B1"},
  {w:"grade",ph:"/ɡreɪd/",pos:"n.",zh:"成績",ex:"She got a good *grade* on the test.",lv:0,cefr:"A2"},
  {w:"gradual",ph:"/ˈɡrædʒuəl/",pos:"adj. 形容詞",zh:"逐漸的",ex:"A *gradual* change.",lv:2,cefr:"B2"},
  {w:"graduation",ph:"/ˌɡrædʒuˈeɪʃən/",pos:"n. 名詞",zh:"畢業",ex:"We celebrated *graduation*.",lv:0,cefr:"A2"},
  {w:"grandfather",ph:"/ˈɡrændfɑːðər/",pos:"n. 名詞",zh:"祖父",ex:"My *grandfather* tells great stories.",lv:0,cefr:"A2"},
  {w:"grandma",ph:"/ˈɡrænmɑː/",pos:"n. 名詞",zh:"奶奶；外婆",ex:"My *grandma* makes great food.",lv:0,cefr:"A2"},
  {w:"grandmother",ph:"/ˈɡrændmʌðər/",pos:"n. 名詞",zh:"祖母",ex:"She visits her *grandmother* every Sunday.",lv:0,cefr:"A2"},
  {w:"grandpa",ph:"/ˈɡrænpɑː/",pos:"n. 名詞",zh:"爺爺；外公",ex:"My *grandpa* loves fishing.",lv:0,cefr:"A2"},
  {w:"grant",ph:"/ɡrænt/",pos:"v. 動詞",zh:"授予；答應",ex:"She was *granted* a wish.",lv:1,cefr:"B1"},
  {w:"grape",ph:"/ɡreɪp/",pos:"n. 名詞",zh:"葡萄",ex:"She ate a bunch of *grapes*.",lv:0,cefr:"A1"},
  {w:"grass",ph:"/ɡrɑːs/",pos:"n. 名詞",zh:"草",ex:"Don't walk on the *grass*.",lv:0,cefr:"A1"},
  {w:"grateful",ph:"/ˈɡreɪtfəl/",pos:"adj. 形容詞",zh:"感激的",ex:"I am *grateful* for your help.",lv:1,cefr:"B1"},
  {w:"gray",ph:"/ɡreɪ/",pos:"adj. 形容詞",zh:"灰色的",ex:"The sky turned *gray*.",lv:0,cefr:"A1"},
  {w:"great",ph:"/ɡreɪt/",pos:"adj. 形容詞",zh:"極好的",ex:"She did a *great* job.",lv:0,cefr:"A1"},
  {w:"green",ph:"/ɡriːn/",pos:"adj.",zh:"綠色的",ex:"Leaves are *green*.",lv:0,cefr:"A1"},
  {w:"greet",ph:"/ɡriːt/",pos:"v. 動詞",zh:"問候",ex:"She *greeted* everyone.",lv:0,cefr:"A2"},
  {w:"grey",ph:"/ɡreɪ/",pos:"adj.",zh:"灰色的",ex:"The sky is *grey*.",lv:0,cefr:"A1"},
  {w:"grill",ph:"/ɡrɪl/",pos:"v. 動詞",zh:"烤",ex:"*Grill* the fish.",lv:0,cefr:"A2"},
  {w:"ground",ph:"/ɡraʊnd/",pos:"n. 名詞",zh:"地面",ex:"She sat on the *ground*.",lv:0,cefr:"A2"},
  {w:"group",ph:"/ɡruːp/",pos:"n.",zh:"群體",ex:"We worked in a *group* of four.",lv:0,cefr:"A2"},
  {w:"grow",ph:"/ɡrəʊ/",pos:"v. 動詞",zh:"生長",ex:"Plants *grow* fast in summer.",lv:0,cefr:"A2"},
  {w:"growth",ph:"/ɡrəʊθ/",pos:"n. 名詞",zh:"成長",ex:"The plant showed rapid *growth*.",lv:1,cefr:"B1"},
  {w:"guess",ph:"/ɡɛs/",pos:"v.",zh:"猜測",ex:"Can you *guess* the answer?",lv:0,cefr:"A2"},
  {w:"guest",ph:"/ɡɛst/",pos:"n. 名詞",zh:"客人",ex:"We have a *guest*.",lv:0,cefr:"A2"},
  {w:"guide",ph:"/ɡaɪd/",pos:"n.",zh:"導遊",ex:"The tour *guide*.",lv:1,cefr:"B1"},
  {w:"gym",ph:"nan",pos:"n.",zh:"體育館",ex:"I go to the *gym*.",lv:0,cefr:"A2"},
  {w:"gymnastics",ph:"/dʒɪmˈnæstɪks/",pos:"n. 名詞",zh:"體操",ex:"She does *gymnastics*.",lv:1,cefr:"B1"},
  {w:"habit",ph:"/ˈhæbɪt/",pos:"n. 名詞",zh:"習慣",ex:"Reading is a good *habit*.",lv:0,cefr:"B1"},
  {w:"hair",ph:"/hɛər/",pos:"n.",zh:"頭髮",ex:"She has long *hair*.",lv:0,cefr:"A1"},
  {w:"half",ph:"/hæf/",pos:"n. 名詞",zh:"一半",ex:"Give me *half*.",lv:0,cefr:"A1"},
  {w:"hamburger",ph:"/ˈhæmbɜːrɡər/",pos:"n. 名詞",zh:"漢堡",ex:"He ate a *hamburger*.",lv:0,cefr:"A1"},
  {w:"hand",ph:"/hænd/",pos:"n.",zh:"手",ex:"Please raise your *hand*.",lv:0,cefr:"A1"},
  {w:"handle",ph:"/ˈhændəl/",pos:"v. 動詞",zh:"處理",ex:"She can *handle* difficult situations.",lv:1,cefr:"B1"},
  {w:"happen",ph:"/ˈhæpən/",pos:"v. 動詞",zh:"發生",ex:"What will *happen* next?",lv:0,cefr:"A2"},
  {w:"happy",ph:"/ˈhæpi/",pos:"adj. 形容詞",zh:"快樂的",ex:"She looks very *happy* today.",lv:0,cefr:"A1"},
  {w:"harbor",ph:"/ˈhɑːbər/",pos:"n.",zh:"港灣",ex:"Ships anchor in the *harbor*.",lv:1,cefr:"B1"},
  {w:"hard",ph:"/hɑːrd/",pos:"adj.",zh:"努力的",ex:"She studies very *hard*.",lv:0,cefr:"A2"},
  {w:"hardworking",ph:"/ˈhɑːrdwɜːrkɪŋ/",pos:"adj. 形容詞",zh:"勤奮的",ex:"She is *hardworking*.",lv:1,cefr:"B1"},
  {w:"harmful",ph:"/ˈhɑːmfəl/",pos:"adj. 形容詞",zh:"有害的",ex:"Smoking is *harmful* to your health.",lv:1,cefr:"B1"},
  {w:"hat",ph:"/hæt/",pos:"n. 名詞",zh:"帽子",ex:"He wore a straw *hat* in the sun.",lv:0,cefr:"A1"},
  {w:"hate",ph:"/heɪt/",pos:"v.",zh:"討厭",ex:"She *hates* waking up early.",lv:0,cefr:"A2"},
  {w:"head",ph:"/hɛd/",pos:"n.",zh:"頭",ex:"My *head* hurts after reading for hours.",lv:0,cefr:"A1"},
  {w:"headache",ph:"/ˈhɛdeɪk/",pos:"n. 名詞",zh:"頭痛",ex:"I have a *headache*.",lv:0,cefr:"A2"},
  {w:"health",ph:"/hɛlθ/",pos:"n.",zh:"健康",ex:"*Health* is wealth.",lv:1,cefr:"B1"},
  {w:"healthy",ph:"/ˈhɛlθi/",pos:"adj. 形容詞",zh:"健康的",ex:"Eating vegetables keeps you *healthy*.",lv:0,cefr:"A2"},
  {w:"hear",ph:"/hɪər/",pos:"v. 動詞",zh:"聽見",ex:"Can you *hear* the music?",lv:0,cefr:"A1"},
  {w:"heart",ph:"/hɑːrt/",pos:"n. 名詞",zh:"心臟",ex:"She has a kind *heart*.",lv:0,cefr:"A2"},
  {w:"heat",ph:"/hiːt/",pos:"n. 名詞",zh:"熱度；熱氣",ex:"The *heat* is unbearable.",lv:0,cefr:"A2"},
  {w:"heavy",ph:"/ˈhɛvi/",pos:"adj. 形容詞",zh:"重的",ex:"This bag is too *heavy* to carry.",lv:0,cefr:"A2"},
  {w:"height",ph:"/haɪt/",pos:"n. 名詞",zh:"高度",ex:"What is the *height*?",lv:0,cefr:"A2"},
  {w:"helicopter",ph:"/ˈhɛlɪkɒptər/",pos:"n. 名詞",zh:"直升機",ex:"The *helicopter* landed.",lv:0,cefr:"A2"},
  {w:"help",ph:"/hɛlp/",pos:"v.",zh:"幫助",ex:"Can you *help* me with this?",lv:0,cefr:"A1"},
  {w:"helpful",ph:"/ˈhɛlpfʊl/",pos:"adj. 形容詞",zh:"有幫助的",ex:"She is very *helpful*.",lv:0,cefr:"A2"},
  {w:"hen",ph:"/hɛn/",pos:"n. 名詞",zh:"母雞",ex:"The *hen* laid an egg.",lv:0,cefr:"A1"},
  {w:"hero",ph:"nan",pos:"n.",zh:"英雄",ex:"He is my *hero*.",lv:0,cefr:"A2"},
  {w:"hesitate",ph:"/ˈhɛzɪteɪt/",pos:"v. 動詞",zh:"猶豫",ex:"Don't *hesitate* to ask for help.",lv:1,cefr:"B1"},
  {w:"hide",ph:"/haɪd/",pos:"v. 動詞",zh:"躲藏",ex:"The cat likes to *hide* under the bed.",lv:0,cefr:"A2"},
  {w:"high",ph:"/haɪ/",pos:"adj.",zh:"高的",ex:"She got a *high* score.",lv:0,cefr:"A2"},
  {w:"highlight",ph:"/ˈhaɪlaɪt/",pos:"v.",zh:"強調",ex:"Please *highlight* the key points.",lv:2,cefr:"B2"},
  {w:"hiking",ph:"/ˈhaɪkɪŋ/",pos:"n. 名詞",zh:"健行",ex:"They went *hiking*.",lv:0,cefr:"A2"},
  {w:"hill",ph:"/hɪl/",pos:"n. 名詞",zh:"山丘",ex:"They climbed the *hill* together.",lv:0,cefr:"A2"},
  {w:"hire",ph:"/haɪər/",pos:"v. 動詞",zh:"雇用",ex:"They *hired* a new teacher.",lv:1,cefr:"B1"},
  {w:"history",ph:"/ˈhɪstəri/",pos:"n.",zh:"歷史",ex:"Long *history*.",lv:1,cefr:"B1"},
  {w:"hit",ph:"/hɪt/",pos:"v.",zh:"打擊",ex:"Don't *hit* others.",lv:0,cefr:"A1"},
  {w:"hobby",ph:"/ˈhɒbi/",pos:"n. 名詞",zh:"嗜好",ex:"My *hobby* is playing the piano.",lv:0,cefr:"A2"},
  {w:"hold",ph:"/həʊld/",pos:"v. 動詞",zh:"持",ex:"She held the baby carefully.",lv:0,cefr:"A2"},
  {w:"hole",ph:"nan",pos:"n.",zh:"洞",ex:"There is a *hole* in the wall.",lv:0,cefr:"A2"},
  {w:"holiday",ph:"nan",pos:"n.",zh:"假日",ex:"We had a great *holiday*.",lv:0,cefr:"A1"},
  {w:"home",ph:"/həʊm/",pos:"n.",zh:"家",ex:"She went *home* after school.",lv:0,cefr:"A1"},
  {w:"homework",ph:"/ˈhoʊmwɜːrk/",pos:"n. 名詞",zh:"作業",ex:"Do your *homework*.",lv:0,cefr:"A2"},
  {w:"honest",ph:"/ˈɒnɪst/",pos:"adj. 形容詞",zh:"誠實的",ex:"Always be *honest* with your friends.",lv:0,cefr:"B1"},
  {w:"honesty",ph:"/ˈɒnɪsti/",pos:"n. 名詞",zh:"誠實",ex:"*Honesty* is the best policy.",lv:1,cefr:"B1"},
  {w:"hope",ph:"/həʊp/",pos:"v.",zh:"希望",ex:"I *hope* you feel better soon.",lv:0,cefr:"A2"},
  {w:"horse",ph:"/hɔːrs/",pos:"n. 名詞",zh:"馬",ex:"She rides a *horse*.",lv:0,cefr:"A1"},
  {w:"hospital",ph:"/ˈhɒspɪtəl/",pos:"n. 名詞",zh:"醫院",ex:"She was taken to the *hospital*.",lv:0,cefr:"A2"},
  {w:"hot",ph:"/hɒt/",pos:"adj.",zh:"熱的",ex:"The soup is *hot*.",lv:0,cefr:"A1"},
  {w:"hotel",ph:"/həʊˈtɛl/",pos:"n. 名詞",zh:"旅館",ex:"They stayed at a nice *hotel*.",lv:0,cefr:"A2"},
  {w:"hour",ph:"/aʊər/",pos:"n. 名詞",zh:"小時",ex:"She studies for two *hours* every night.",lv:0,cefr:"A2"},
  {w:"house",ph:"/haʊs/",pos:"n. 名詞",zh:"房子",ex:"They live in a big *house*.",lv:0,cefr:"A1"},
  {w:"however",ph:"/haʊˈɛvər/",pos:"adv.",zh:"然而",ex:"I wanted to go. *however*, it rained.",lv:0,cefr:"B1"},
  {w:"hug",ph:"/hʌɡ/",pos:"v. 動詞",zh:"擁抱",ex:"She *hugged* her mom.",lv:0,cefr:"A2"},
  {w:"huge",ph:"/hjuːdʒ/",pos:"adj. 形容詞",zh:"巨大的",ex:"There is a *huge* tree in the park.",lv:0,cefr:"A2"},
  {w:"human",ph:"/ˈhjuːmən/",pos:"adj.",zh:"人類",ex:"Every *human* being deserves respect.",lv:0,cefr:"A2"},
  {w:"humor",ph:"/ˈhjuːmər/",pos:"n. 名詞",zh:"幽默",ex:"She has a great sense of *humor*.",lv:1,cefr:"B1"},
  {w:"hundred",ph:"/ˈhʌndrɪd/",pos:"num. 數詞",zh:"一百",ex:"There are one *hundred* days.",lv:0,cefr:"A1"},
  {w:"hungry",ph:"/ˈhʌŋɡri/",pos:"adj. 形容詞",zh:"飢餓的",ex:"I am very *hungry* after school.",lv:0,cefr:"A2"},
  {w:"hurry",ph:"/ˈhʌri/",pos:"v.",zh:"趕快",ex:"We need to *hurry* or we will be late.",lv:0,cefr:"A2"},
  {w:"hurt",ph:"/hɜːrt/",pos:"v.",zh:"受傷",ex:"She *hurt* her ankle while running.",lv:0,cefr:"A2"},
  {w:"husband",ph:"nan",pos:"n.",zh:"丈夫",ex:"Her *husband* is a doctor.",lv:0,cefr:"A1"},
  {w:"hypothesis",ph:"/haɪˈpɒθɪsɪs/",pos:"n. 名詞",zh:"假說",ex:"Scientists tested their *hypothesis*.",lv:2,cefr:"C1"},
  {w:"ice",ph:"/aɪs/",pos:"n. 名詞",zh:"冰",ex:"She put *ice* in her drink.",lv:0,cefr:"A2"},
  {w:"idea",ph:"/aɪˈdɪə/",pos:"n. 名詞",zh:"想法",ex:"That is a great *idea*.",lv:0,cefr:"A2"},
  {w:"identify",ph:"/aɪˈdɛntɪfaɪ/",pos:"v. 動詞",zh:"識別",ex:"Can you *identify* this bird?",lv:1,cefr:"B1"},
  {w:"ignore",ph:"/ɪɡˈnɔːr/",pos:"v. 動詞",zh:"忽視",ex:"She chose to *ignore* the rude comment.",lv:1,cefr:"B1"},
  {w:"ill",ph:"/ɪl/",pos:"adj. 形容詞",zh:"生病的",ex:"She stayed home because she was *ill*.",lv:0,cefr:"A2"},
  {w:"illustrate",ph:"/ˈɪləstreɪt/",pos:"v.",zh:"說明",ex:"Use examples to *illustrate*.",lv:2,cefr:"B2"},
  {w:"image",ph:"/ˈɪmɪdʒ/",pos:"n. 名詞",zh:"圖像；形象",ex:"She has a good *image*.",lv:1,cefr:"B1"},
  {w:"imagination",ph:"/ɪˌmædʒɪˈneɪʃən/",pos:"n. 名詞",zh:"想像力",ex:"Use your *imagination*.",lv:1,cefr:"B1"},
  {w:"imagine",ph:"/ɪˈmædʒɪn/",pos:"v. 動詞",zh:"想像",ex:"Can you *imagine* life without electricity?",lv:1,cefr:"B1"},
  {w:"immediately",ph:"/ɪˈmiːdiətli/",pos:"adv. 副詞",zh:"立即",ex:"Come *immediately*.",lv:1,cefr:"B1"},
  {w:"impact",ph:"/ˈɪmpækt/",pos:"n.",zh:"影響",ex:"Technology has a huge *impact* on education.",lv:1,cefr:"B2"},
  {w:"implement",ph:"/ˈɪmplɪmɛnt/",pos:"v.",zh:"實施",ex:"*Implement* the plan.",lv:2,cefr:"B2"},
  {w:"implication",ph:"/ˌɪmplɪˈkeɪʃən/",pos:"n. 名詞",zh:"含義",ex:"Consider the *implications* of this decision.",lv:2,cefr:"B2"},
  {w:"implicit",ph:"/ɪmˈplɪsɪt/",pos:"adj. 形容詞",zh:"隱含的",ex:"There is an *implicit* meaning in her words.",lv:2,cefr:"C1"},
  {w:"imply",ph:"/ɪmˈplaɪ/",pos:"v. 動詞",zh:"暗示",ex:"What does that *imply*?",lv:2,cefr:"B2"},
  {w:"important",ph:"/ɪmˈpɔːtənt/",pos:"adj. 形容詞",zh:"重要的",ex:"Health is the most *important* thing.",lv:0,cefr:"A2"},
  {w:"impose",ph:"/ɪmˈpəʊz/",pos:"v. 動詞",zh:"強加",ex:"The government *imposed* a new tax.",lv:2,cefr:"B2"},
  {w:"impossible",ph:"/ɪmˈpɒsɪbəl/",pos:"adj. 形容詞",zh:"不可能的",ex:"Nothing is *impossible*.",lv:1,cefr:"B1"},
  {w:"improve",ph:"/ɪmˈpruːv/",pos:"v. 動詞",zh:"改善",ex:"She wants to *improve* her English.",lv:1,cefr:"B1"},
  {w:"include",ph:"/ɪnˈkluːd/",pos:"v. 動詞",zh:"包含",ex:"The price *includes* breakfast.",lv:1,cefr:"B1"},
  {w:"increase",ph:"/ɪnˈkriːs/",pos:"v.",zh:"增加",ex:"The number of students will *increase*.",lv:1,cefr:"B1"},
  {w:"independent",ph:"/ˌɪndɪˈpɛndənt/",pos:"adj. 形容詞",zh:"獨立的",ex:"She is very *independent*.",lv:1,cefr:"B1"},
  {w:"indicate",ph:"/ˈɪndɪkeɪt/",pos:"v. 動詞",zh:"指出",ex:"The results *indicate* improvement.",lv:1,cefr:"B2"},
  {w:"individual",ph:"/ˌɪndɪˈvɪdʒuəl/",pos:"n.",zh:"個人",ex:"Each *individual* has unique talents.",lv:1,cefr:"B1"},
  {w:"inevitable",ph:"/ɪnˈɛvɪtəbəl/",pos:"adj.",zh:"不可避免的",ex:"Change is *inevitable*.",lv:2,cefr:"C1"},
  {w:"influence",ph:"/ˈɪnfluəns/",pos:"n.",zh:"影響",ex:"Parents have a big *influence* on children.",lv:1,cefr:"B1"},
  {w:"information",ph:"/ˌɪnfəˈmeɪʃən/",pos:"n. 名詞",zh:"資訊",ex:"I need more *information* about the event.",lv:1,cefr:"A2"},
  {w:"infrastructure",ph:"/ˈɪnfrəˌstrʌktʃər/",pos:"n. 名詞",zh:"基礎設施",ex:"The *infrastructure* is good.",lv:2,cefr:"B2"},
  {w:"inherent",ph:"/ɪnˈhɪərənt/",pos:"adj. 形容詞",zh:"固有的",ex:"There are *inherent* risks in every job.",lv:2,cefr:"C1"},
  {w:"initiative",ph:"/ɪˈnɪʃɪətɪv/",pos:"n. 名詞",zh:"主動性",ex:"She took the *initiative* to organize the event.",lv:2,cefr:"B2"},
  {w:"injection",ph:"/ɪnˈdʒɛkʃən/",pos:"n. 名詞",zh:"注射",ex:"She got an *injection*.",lv:1,cefr:"B1"},
  {w:"innovation",ph:"/ˌɪnəˈveɪʃən/",pos:"n. 名詞",zh:"創新",ex:"*innovation* drives economic growth.",lv:2,cefr:"B2"},
  {w:"innovative",ph:"/ˈɪnəveɪtɪv/",pos:"adj. 形容詞",zh:"創新的",ex:"They designed an *innovative* solution.",lv:2,cefr:"C1"},
  {w:"inside",ph:"/ˌɪnˈsaɪd/",pos:"prep.",zh:"在裡面",ex:"Come *inside* — it's cold out.",lv:0,cefr:"A2"},
  {w:"insight",ph:"/ˈɪnsaɪt/",pos:"n. 名詞",zh:"洞察力",ex:"Her *insight* helped the team understand the issue.",lv:2,cefr:"B2"},
  {w:"insist",ph:"/ɪnˈsɪst/",pos:"v. 動詞",zh:"堅持",ex:"She *insisted* on going.",lv:1,cefr:"B1"},
  {w:"inspire",ph:"/ɪnˈspaɪər/",pos:"v. 動詞",zh:"啟發",ex:"Her story *inspires* many people.",lv:1,cefr:"B2"},
  {w:"instead",ph:"/ɪnˈstɛd/",pos:"adv. 副詞",zh:"代替",ex:"She had juice *instead* of coffee.",lv:0,cefr:"B1"},
  {w:"institution",ph:"/ˌɪnstɪˈtjuːʃən/",pos:"n. 名詞",zh:"機構；制度",ex:"She studied at a top *institution*.",lv:2,cefr:"B2"},
  {w:"integrate",ph:"/ˈɪntɪɡreɪt/",pos:"v. 動詞",zh:"整合",ex:"We need to *integrate* all the data.",lv:2,cefr:"B2"},
  {w:"integrity",ph:"/ɪnˈtɛɡrɪti/",pos:"n. 名詞",zh:"誠信",ex:"A leader must have *integrity*.",lv:2,cefr:"C1"},
  {w:"intelligent",ph:"/ɪnˈtɛlɪdʒənt/",pos:"adj. 形容詞",zh:"聰明的",ex:"She is a very *intelligent* student.",lv:1,cefr:"B1"},
  {w:"interest",ph:"/ˈɪntrɪst/",pos:"n.",zh:"興趣",ex:"Many *interests*.",lv:1,cefr:"B1"},
  {w:"interesting",ph:"/ˈɪntrɪstɪŋ/",pos:"adj. 形容詞",zh:"有趣的",ex:"This book is very *interesting*.",lv:0,cefr:"A2"},
  {w:"internet",ph:"/ˈɪntərˌnɛt/",pos:"n. 名詞",zh:"網際網路",ex:"I use the *internet* every day.",lv:0,cefr:"A2"},
  {w:"interpret",ph:"/ɪnˈtɜːprɪt/",pos:"v. 動詞",zh:"解釋",ex:"How do you *interpret* this poem?",lv:1,cefr:"B1"},
  {w:"interview",ph:"/ˈɪntəvjuː/",pos:"n. 名詞",zh:"面試；採訪",ex:"She passed the *interview*.",lv:1,cefr:"B1"},
  {w:"intrinsic",ph:"/ɪnˈtrɪnsɪk/",pos:"adj.",zh:"內在的",ex:"Find *intrinsic* motivation.",lv:2,cefr:"C1"},
  {w:"introduce",ph:"/ˌɪntrəˈdjuːs/",pos:"v. 動詞",zh:"介紹",ex:"Let me *introduce* my friend to you.",lv:0,cefr:"A2"},
  {w:"invention",ph:"/ɪnˈvɛnʃən/",pos:"n. 名詞",zh:"發明",ex:"A great *invention*.",lv:1,cefr:"B1"},
  {w:"investigate",ph:"/ɪnˈvɛstɪɡeɪt/",pos:"v. 動詞",zh:"調查",ex:"Police are investigating the crime.",lv:1,cefr:"B2"},
  {w:"invite",ph:"/ɪnˈvaɪt/",pos:"v. 動詞",zh:"邀請",ex:"She will *invite* her friends to the party.",lv:0,cefr:"A2"},
  {w:"involve",ph:"/ɪnˈvɒlv/",pos:"v. 動詞",zh:"涉及",ex:"The project *involves* teamwork.",lv:1,cefr:"B2"},
  {w:"island",ph:"/ˈaɪlənd/",pos:"n. 名詞",zh:"島嶼",ex:"Taiwan is a beautiful *island*.",lv:0,cefr:"A2"},
  {w:"issue",ph:"/ˈɪʃuː/",pos:"n. 名詞",zh:"問題",ex:"Pollution is a major *issue*.",lv:1,cefr:"B1"},
  {w:"jacket",ph:"/ˈdʒækɪt/",pos:"n. 名詞",zh:"夾克",ex:"She put on her *jacket*.",lv:0,cefr:"A2"},
  {w:"January",ph:"/ˈdʒænjuɛri/",pos:"n. 名詞",zh:"一月",ex:"*January* is the first month.",lv:0,cefr:"A1"},
  {w:"jar",ph:"nan",pos:"n.",zh:"罐子",ex:"A *jar* of honey.",lv:0,cefr:"A2"},
  {w:"jealous",ph:"/ˈdʒɛləs/",pos:"adj. 形容詞",zh:"嫉妒的",ex:"He was *jealous*.",lv:1,cefr:"B1"},
  {w:"jeans",ph:"/dʒiːnz/",pos:"n. 名詞",zh:"牛仔褲",ex:"She wears *jeans* every day.",lv:0,cefr:"A1"},
  {w:"job",ph:"/dʒɒb/",pos:"n. 名詞",zh:"工作",ex:"She found a part-time *job*.",lv:0,cefr:"A2"},
  {w:"jogging",ph:"/ˈdʒɒɡɪŋ/",pos:"n. 名詞",zh:"慢跑",ex:"She goes *jogging* every morning.",lv:0,cefr:"A2"},
  {w:"join",ph:"/dʒɔɪn/",pos:"v. 動詞",zh:"加入",ex:"Would you like to *join* our team?",lv:0,cefr:"A2"},
  {w:"joke",ph:"/dʒoʊk/",pos:"n. 名詞",zh:"笑話",ex:"Tell me a *joke*.",lv:0,cefr:"A2"},
  {w:"journalist",ph:"/ˈdʒɜːrnəlɪst/",pos:"n. 名詞",zh:"記者",ex:"She is a *journalist*.",lv:1,cefr:"B1"},
  {w:"journey",ph:"/ˈdʒɜːrni/",pos:"n. 名詞",zh:"旅途",ex:"A long *journey*.",lv:1,cefr:"B1"},
  {w:"joy",ph:"/dʒɔɪ/",pos:"n. 名詞",zh:"喜悅",ex:"The laughter filled her with *joy*.",lv:0,cefr:"A2"},
  {w:"juice",ph:"nan",pos:"n.",zh:"果汁",ex:"A glass of orange *juice*.",lv:0,cefr:"A1"},
  {w:"July",ph:"/dʒuˈlaɪ/",pos:"n. 名詞",zh:"七月",ex:"*July* is the hottest month.",lv:0,cefr:"A1"},
  {w:"jump",ph:"/dʒʌmp/",pos:"v.",zh:"跳",ex:"She *jumped* over the puddle.",lv:0,cefr:"A1"},
  {w:"June",ph:"/dʒuːn/",pos:"n. 名詞",zh:"六月",ex:"School ends in *June*.",lv:0,cefr:"A1"},
  {w:"just",ph:"/dʒʌst/",pos:"adv. 副詞",zh:"剛剛",ex:"I *just* finished my homework.",lv:0,cefr:"A2"},
  {w:"justice",ph:"/ˈdʒʌstɪs/",pos:"n. 名詞",zh:"正義；公平",ex:"Fight for *justice*.",lv:1,cefr:"B1"},
  {w:"justify",ph:"/ˈdʒʌstɪfaɪ/",pos:"v. 動詞",zh:"為…辯護",ex:"Can you *justify* your decision?",lv:2,cefr:"B2"},
  {w:"keep",ph:"/kiːp/",pos:"v. 動詞",zh:"保持",ex:"*keep* working hard and you will succeed.",lv:0,cefr:"A2"},
  {w:"key",ph:"/kiː/",pos:"n.",zh:"鑰匙",ex:"I lost my *key* again.",lv:0,cefr:"A2"},
  {w:"keyboard",ph:"/ˈkiːbɔːrd/",pos:"n. 名詞",zh:"鍵盤",ex:"Type on the *keyboard*.",lv:0,cefr:"A2"},
  {w:"kick",ph:"/kɪk/",pos:"v.",zh:"踢",ex:"He *kicked* the ball into the goal.",lv:0,cefr:"A2"},
  {w:"kid",ph:"/kɪd/",pos:"n.",zh:"小孩",ex:"Every *kid* loves ice cream.",lv:0,cefr:"A1"},
  {w:"kind",ph:"/kaɪnd/",pos:"adj.",zh:"親切的",ex:"She is a very *kind* person.",lv:0,cefr:"A2"},
  {w:"kindness",ph:"/ˈkaɪndnɪs/",pos:"n. 名詞",zh:"善良；仁慈",ex:"Show *kindness* to others.",lv:1,cefr:"B1"},
  {w:"king",ph:"/kɪŋ/",pos:"n. 名詞",zh:"國王",ex:"The *king* lives in a castle.",lv:0,cefr:"A1"},
  {w:"kitchen",ph:"/ˈkɪtʃɪn/",pos:"n. 名詞",zh:"廚房",ex:"She cooked in the *kitchen*.",lv:0,cefr:"A2"},
  {w:"knee",ph:"/niː/",pos:"n. 名詞",zh:"膝蓋",ex:"She hurt her *knee*.",lv:0,cefr:"A1"},
  {w:"knife",ph:"nan",pos:"n.",zh:"刀子",ex:"Use a *knife* to cut.",lv:0,cefr:"A1"},
  {w:"knock",ph:"nan",pos:"v.",zh:"敲",ex:"*knock* on the door.",lv:0,cefr:"A2"},
  {w:"know",ph:"/nəʊ/",pos:"v. 動詞",zh:"知道",ex:"Do you *know* the answer?",lv:0,cefr:"A1"},
  {w:"knowledge",ph:"/ˈnɒlɪdʒ/",pos:"n. 名詞",zh:"知識",ex:"*knowledge* is power.",lv:1,cefr:"B1"},
  {w:"lake",ph:"/leɪk/",pos:"n. 名詞",zh:"湖",ex:"They went fishing at the *lake*.",lv:0,cefr:"A2"},
  {w:"lamp",ph:"/læmp/",pos:"n.",zh:"燈",ex:"Turn on the *lamp*.",lv:0,cefr:"A1"},
  {w:"land",ph:"/lænd/",pos:"n.",zh:"土地",ex:"The plane will *land* soon.",lv:0,cefr:"A2"},
  {w:"language",ph:"/ˈlæŋɡwɪdʒ/",pos:"n. 名詞",zh:"語言",ex:"English is a global *language*.",lv:1,cefr:"A2"},
  {w:"laptop",ph:"/ˈlæptɒp/",pos:"n. 名詞",zh:"筆記型電腦",ex:"She works on her *laptop*.",lv:0,cefr:"A2"},
  {w:"large",ph:"/lɑːrdʒ/",pos:"adj. 形容詞",zh:"大的",ex:"She has a *large* collection of books.",lv:0,cefr:"A2"},
  {w:"last",ph:"/lɑːst/",pos:"adj.",zh:"最後的",ex:"*last* week was very busy.",lv:0,cefr:"A2"},
  {w:"late",ph:"/leɪt/",pos:"adj.",zh:"遲到的",ex:"Don't be *late* for class.",lv:0,cefr:"A2"},
  {w:"laugh",ph:"/lɑːf/",pos:"v.",zh:"笑",ex:"The joke made everyone *laugh*.",lv:0,cefr:"A2"},
  {w:"law",ph:"/lɔː/",pos:"n. 名詞",zh:"法律",ex:"Everyone must obey the *law*.",lv:0,cefr:"A2"},
  {w:"lawyer",ph:"/ˈlɔɪər/",pos:"n. 名詞",zh:"律師",ex:"She became a *lawyer*.",lv:1,cefr:"B1"},
  {w:"lazy",ph:"/ˈleɪzi/",pos:"adj. 形容詞",zh:"懶惰的",ex:"Don't be *lazy* — finish your homework.",lv:0,cefr:"A2"},
  {w:"leader",ph:"/ˈliːdər/",pos:"n.",zh:"領導者",ex:"A great *leader*.",lv:1,cefr:"B1"},
  {w:"leadership",ph:"/ˈliːdəʃɪp/",pos:"n. 名詞",zh:"領導力",ex:"Good *leadership* is very important.",lv:1,cefr:"B1"},
  {w:"leaf",ph:"/liːf/",pos:"n. 名詞",zh:"葉子",ex:"The *leaf* fell from the tree.",lv:0,cefr:"A1"},
  {w:"learn",ph:"/lɜːrn/",pos:"v. 動詞",zh:"學習",ex:"We *learn* something new every day.",lv:0,cefr:"A1"},
  {w:"leave",ph:"/liːv/",pos:"v. 動詞",zh:"離開",ex:"What time does the train *leave*?",lv:0,cefr:"A2"},
  {w:"left",ph:"/lɛft/",pos:"n. 名詞",zh:"左邊",ex:"Turn *left*.",lv:0,cefr:"A1"},
  {w:"leg",ph:"/lɛɡ/",pos:"n.",zh:"腿",ex:"She injured her *leg*.",lv:0,cefr:"A1"},
  {w:"lend",ph:"/lɛnd/",pos:"v. 動詞",zh:"借（出）",ex:"Can you *lend* me your dictionary?",lv:0,cefr:"A2"},
  {w:"length",ph:"/lɛŋkθ/",pos:"n. 名詞",zh:"長度",ex:"Measure the *length*.",lv:0,cefr:"A2"},
  {w:"lesson",ph:"nan",pos:"n.",zh:"課程",ex:"I have a piano *lesson*.",lv:0,cefr:"A2"},
  {w:"let",ph:"/lɛt/",pos:"v.",zh:"讓",ex:"*Let* me help.",lv:0,cefr:"A1"},
  {w:"letter",ph:"/ˈlɛtər/",pos:"n. 名詞",zh:"信",ex:"She wrote a *letter* to her pen pal.",lv:0,cefr:"A2"},
  {w:"level",ph:"nan",pos:"n.",zh:"等級",ex:"This is *level* two.",lv:0,cefr:"A2"},
  {w:"library",ph:"/ˈlaɪbrəri/",pos:"n. 名詞",zh:"圖書館",ex:"She spends hours in the *library*.",lv:0,cefr:"A2"},
  {w:"life",ph:"/laɪf/",pos:"n. 名詞",zh:"生命",ex:"She lives a simple *life*.",lv:0,cefr:"A2"},
  {w:"lifestyle",ph:"/ˈlaɪfstaɪl/",pos:"n. 名詞",zh:"生活方式",ex:"A healthy *lifestyle* includes exercise.",lv:1,cefr:"B1"},
  {w:"lift",ph:"/lɪft/",pos:"v. 動詞",zh:"舉起",ex:"Can you *lift* this box?",lv:0,cefr:"A2"},
  {w:"light",ph:"/laɪt/",pos:"n.",zh:"光",ex:"Please turn off the *light*.",lv:0,cefr:"A1"},
  {w:"lightning",ph:"/ˈlaɪtnɪŋ/",pos:"n. 名詞",zh:"閃電",ex:"She saw *lightning* in the sky.",lv:0,cefr:"A2"},
  {w:"like",ph:"/laɪk/",pos:"v.",zh:"喜歡",ex:"She *likes* reading mystery novels.",lv:0,cefr:"A1"},
  {w:"likely",ph:"/ˈlaɪkli/",pos:"adj. 形容詞",zh:"可能的",ex:"That is *likely*.",lv:1,cefr:"B1"},
  {w:"limit",ph:"/ˈlɪmɪt/",pos:"n.",zh:"限制",ex:"Set a time *limit* for each task.",lv:1,cefr:"B1"},
  {w:"line",ph:"/laɪn/",pos:"n.",zh:"線",ex:"Please stand in a *line*.",lv:0,cefr:"A2"},
  {w:"link",ph:"/lɪŋk/",pos:"n.",zh:"連結",ex:"Click the *link*.",lv:1,cefr:"B1"},
  {w:"lion",ph:"/ˈlaɪən/",pos:"n. 名詞",zh:"獅子",ex:"The *lion* is the king of animals.",lv:0,cefr:"A1"},
  {w:"lip",ph:"/lɪp/",pos:"n. 名詞",zh:"嘴唇",ex:"She has red *lips*.",lv:0,cefr:"A1"},
  {w:"list",ph:"/lɪst/",pos:"n.",zh:"清單",ex:"She made a shopping *list*.",lv:0,cefr:"A2"},
  {w:"listen",ph:"/ˈlɪsən/",pos:"v. 動詞",zh:"聆聽",ex:"Please *listen* carefully.",lv:0,cefr:"A1"},
  {w:"literature",ph:"/ˈlɪtərɪtʃər/",pos:"n. 名詞",zh:"文學",ex:"She loves reading English *literature*.",lv:1,cefr:"B1"},
  {w:"little",ph:"/ˈlɪtəl/",pos:"adj.",zh:"小的",ex:"A *little* dog.",lv:0,cefr:"A1"},
  {w:"live",ph:"/lɪv/",pos:"v. 動詞",zh:"居住",ex:"She *lives* near the school.",lv:0,cefr:"A1"},
  {w:"local",ph:"/ˈloʊkəl/",pos:"adj.",zh:"當地的",ex:"Support *local* businesses.",lv:1,cefr:"B1"},
  {w:"located",ph:"/loʊˈkeɪtɪd/",pos:"adj. 形容詞",zh:"位於",ex:"The hotel is *located* downtown.",lv:1,cefr:"B1"},
  {w:"logic",ph:"/ˈlɒdʒɪk/",pos:"n. 名詞",zh:"邏輯",ex:"Your argument has no *logic*.",lv:2,cefr:"B2"},
  {w:"logical",ph:"/ˈlɒdʒɪkəl/",pos:"adj. 形容詞",zh:"合邏輯的",ex:"Your argument must be *logical*.",lv:2,cefr:"B2"},
  {w:"lonely",ph:"/ˈloʊnli/",pos:"adj. 形容詞",zh:"孤獨的",ex:"She felt *lonely*.",lv:0,cefr:"A2"},
  {w:"long",ph:"/lɒŋ/",pos:"adj.",zh:"長的",ex:"She has been studying for a *long* time.",lv:0,cefr:"A1"},
  {w:"look",ph:"/lʊk/",pos:"v.",zh:"看",ex:"*look* at that beautiful sunset!",lv:0,cefr:"A1"},
  {w:"lose",ph:"/luːz/",pos:"v. 動詞",zh:"失去",ex:"I always *lose* my pencils.",lv:0,cefr:"A2"},
  {w:"lost",ph:"/lɔːst/",pos:"adj. 形容詞",zh:"迷路的",ex:"The child is *lost*.",lv:0,cefr:"A1"},
  {w:"loud",ph:"/laʊd/",pos:"adj. 形容詞",zh:"大聲的",ex:"The music is too *loud*.",lv:0,cefr:"A2"},
  {w:"love",ph:"/lʌv/",pos:"v.",zh:"愛",ex:"She *loves* playing the guitar.",lv:0,cefr:"A1"},
  {w:"low",ph:"/ləʊ/",pos:"adj.",zh:"低的",ex:"The temperature is very *low* today.",lv:0,cefr:"A2"},
  {w:"loyalty",ph:"/ˈlɔɪəlti/",pos:"n. 名詞",zh:"忠誠",ex:"She showed great *loyalty*.",lv:1,cefr:"B1"},
  {w:"luck",ph:"/lʌk/",pos:"n. 名詞",zh:"運氣",ex:"Good *luck*!",lv:0,cefr:"A2"},
  {w:"luckily",ph:"/ˈlʌkɪli/",pos:"adv. 副詞",zh:"幸運地",ex:"*Luckily* she was safe.",lv:0,cefr:"A2"},
  {w:"lucky",ph:"/ˈlʌki/",pos:"adj. 形容詞",zh:"幸運的",ex:"You are so *lucky* to win the prize.",lv:0,cefr:"A2"},
  {w:"lunch",ph:"/lʌntʃ/",pos:"n. 名詞",zh:"午餐",ex:"What did you have for *lunch*?",lv:0,cefr:"A1"},
  {w:"lung",ph:"/lʌŋ/",pos:"n. 名詞",zh:"肺",ex:"Smoking damages your *lungs*.",lv:1,cefr:"B1"},
  {w:"magic",ph:"nan",pos:"n.",zh:"魔法",ex:"The show was *magic*.",lv:0,cefr:"A2"},
  {w:"magnitude",ph:"/ˈmæɡnɪtjuːd/",pos:"n. 名詞",zh:"規模",ex:"The *magnitude* of the problem was clear.",lv:2,cefr:"B2"},
  {w:"main",ph:"/meɪn/",pos:"adj. 形容詞",zh:"主要的",ex:"The *main* idea.",lv:0,cefr:"A2"},
  {w:"maintain",ph:"/meɪnˈteɪn/",pos:"v.",zh:"維持",ex:"*Maintain* good habits.",lv:2,cefr:"B2"},
  {w:"majority",ph:"/məˈdʒɒrɪti/",pos:"n.",zh:"多數",ex:"The *majority* agreed.",lv:2,cefr:"B2"},
  {w:"make",ph:"/meɪk/",pos:"v. 動詞",zh:"製作",ex:"She can *make* delicious cookies.",lv:0,cefr:"A1"},
  {w:"man",ph:"/mæn/",pos:"n.",zh:"男人",ex:"An old *man*.",lv:0,cefr:"A1"},
  {w:"manage",ph:"/ˈmænɪdʒ/",pos:"v. 動詞",zh:"管理",ex:"She can *manage* the whole project.",lv:1,cefr:"B1"},
  {w:"mango",ph:"/ˈmæŋɡoʊ/",pos:"n. 名詞",zh:"芒果",ex:"*Mango* is her favorite fruit.",lv:0,cefr:"A1"},
  {w:"manifest",ph:"/ˈmænɪfɛst/",pos:"v.",zh:"表現",ex:"Stress can *manifest* in many ways.",lv:2,cefr:"B2"},
  {w:"manipulate",ph:"/məˈnɪpjəleɪt/",pos:"v. 動詞",zh:"操縱",ex:"She can *manipulate* data effectively.",lv:2,cefr:"B2"},
  {w:"manner",ph:"/ˈmænər/",pos:"n. 名詞",zh:"方式",ex:"She spoke in a polite *manner*.",lv:1,cefr:"B1"},
  {w:"map",ph:"/mæp/",pos:"n. 名詞",zh:"地圖",ex:"She used a *map* to find her way.",lv:0,cefr:"A1"},
  {w:"March",ph:"/mɑːrtʃ/",pos:"n. 名詞",zh:"三月",ex:"Spring starts in *March*.",lv:0,cefr:"A1"},
  {w:"mark",ph:"/mɑːrk/",pos:"v. 動詞",zh:"標記；批改",ex:"*Mark* the answers.",lv:0,cefr:"A2"},
  {w:"market",ph:"/ˈmɑːrkɪt/",pos:"n. 名詞",zh:"市場",ex:"She buys vegetables at the *market*.",lv:0,cefr:"A2"},
  {w:"master",ph:"/ˈmæstər/",pos:"v. 動詞",zh:"掌握",ex:"*Master* the skill.",lv:1,cefr:"B1"},
  {w:"match",ph:"/mætʃ/",pos:"v.",zh:"相配",ex:"Her shoes *match* her bag.",lv:0,cefr:"A2"},
  {w:"math",ph:"/mæθ/",pos:"n. 名詞",zh:"數學",ex:"*math* is her favorite subject.",lv:0,cefr:"A2"},
  {w:"matter",ph:"/ˈmætər/",pos:"v.",zh:"重要",ex:"It doesn't *matter*.",lv:1,cefr:"B1"},
  {w:"May",ph:"/meɪ/",pos:"n. 名詞",zh:"五月",ex:"*May* is a beautiful month.",lv:0,cefr:"A1"},
  {w:"maybe",ph:"/ˈmeɪbi/",pos:"adv.",zh:"也許",ex:"*Maybe* tomorrow.",lv:0,cefr:"A2"},
  {w:"meal",ph:"/miːl/",pos:"n. 名詞",zh:"一餐",ex:"She cooked a healthy *meal*.",lv:0,cefr:"A2"},
  {w:"mean",ph:"/miːn/",pos:"v.",zh:"意思是",ex:"What does this word *mean*?",lv:0,cefr:"A2"},
  {w:"meaning",ph:"/ˈmiːnɪŋ/",pos:"n. 名詞",zh:"意義",ex:"What is the *meaning* of life?",lv:1,cefr:"B1"},
  {w:"meat",ph:"/miːt/",pos:"n.",zh:"肉",ex:"She doesn't eat *meat*.",lv:0,cefr:"A1"},
  {w:"mechanism",ph:"/ˈmɛkənɪzəm/",pos:"n. 名詞",zh:"機制",ex:"Scientists studied the *mechanism* of the disease.",lv:2,cefr:"B2"},
  {w:"medicine",ph:"/ˈmɛdsɪn/",pos:"n. 名詞",zh:"藥",ex:"Take your *medicine* after meals.",lv:0,cefr:"A2"},
  {w:"meet",ph:"/miːt/",pos:"v. 動詞",zh:"見面",ex:"Nice to *meet* you!",lv:0,cefr:"A1"},
  {w:"member",ph:"/ˈmɛmbər/",pos:"n. 名詞",zh:"成員",ex:"She is a *member* of the school band.",lv:0,cefr:"A2"},
  {w:"memory",ph:"/ˈmɛməri/",pos:"n. 名詞",zh:"記憶",ex:"She has a great *memory*.",lv:0,cefr:"A2"},
  {w:"mention",ph:"/ˈmɛnʃən/",pos:"v. 動詞",zh:"提及",ex:"Did he *mention* the meeting time?",lv:1,cefr:"B1"},
  {w:"message",ph:"/ˈmɛsɪdʒ/",pos:"n. 名詞",zh:"訊息",ex:"She left a *message* for you.",lv:0,cefr:"A2"},
  {w:"metaphor",ph:"/ˈmɛtəfər/",pos:"n. 名詞",zh:"隱喻",ex:"Life is a journey is a common *metaphor*.",lv:2,cefr:"C1"},
  {w:"method",ph:"/ˈmɛθəd/",pos:"n. 名詞",zh:"方法",ex:"This is an effective *method* for studying.",lv:1,cefr:"B1"},
  {w:"methodology",ph:"/ˌmɛθəˈdɒlədʒi/",pos:"n. 名詞",zh:"研究方法",ex:"The study used a scientific *methodology*.",lv:2,cefr:"B2"},
  {w:"microphone",ph:"/ˈmaɪkrəfoʊn/",pos:"n. 名詞",zh:"麥克風",ex:"Speak into the *microphone*.",lv:0,cefr:"A2"},
  {w:"microwave",ph:"/ˈmaɪkroʊweɪv/",pos:"n. 名詞",zh:"微波爐",ex:"Heat it in the *microwave*.",lv:0,cefr:"A2"},
  {w:"middle",ph:"/ˈmɪdəl/",pos:"n.",zh:"中間的",ex:"She sat in the *middle* of the row.",lv:0,cefr:"A2"},
  {w:"midnight",ph:"/ˈmɪdnaɪt/",pos:"n. 名詞",zh:"午夜",ex:"She stayed up until *midnight*.",lv:0,cefr:"A1"},
  {w:"milk",ph:"/mɪlk/",pos:"n.",zh:"牛奶",ex:"A glass of *milk*.",lv:0,cefr:"A1"},
  {w:"million",ph:"/ˈmɪljən/",pos:"num.",zh:"百萬",ex:"A *million* dollars.",lv:1,cefr:"B1"},
  {w:"mind",ph:"/maɪnd/",pos:"n.",zh:"心智",ex:"Do you *mind* if I open the window?",lv:0,cefr:"A2"},
  {w:"minority",ph:"/maɪˈnɒrɪti/",pos:"n. 名詞",zh:"少數",ex:"A *minority* disagreed.",lv:1,cefr:"B1"},
  {w:"minute",ph:"/ˈmɪnɪt/",pos:"n. 名詞",zh:"分鐘",ex:"I'll be ready in five *minutes*.",lv:0,cefr:"A2"},
  {w:"mirror",ph:"nan",pos:"n.",zh:"鏡子",ex:"Look in the *mirror*.",lv:0,cefr:"A2"},
  {w:"misconception",ph:"/ˌmɪskənˈsɛpʃən/",pos:"n. 名詞",zh:"誤解",ex:"There is a common *misconception* about this.",lv:2,cefr:"B2"},
  {w:"miss",ph:"/mɪs/",pos:"v. 動詞",zh:"想念",ex:"She *misses* her old friends.",lv:0,cefr:"A2"},
  {w:"missing",ph:"/ˈmɪsɪŋ/",pos:"adj. 形容詞",zh:"遺失的；不見的",ex:"The key is *missing*.",lv:0,cefr:"A2"},
  {w:"mistake",ph:"/mɪˈsteɪk/",pos:"n. 名詞",zh:"錯誤",ex:"Everyone makes a *mistake* sometimes.",lv:0,cefr:"A2"},
  {w:"mix",ph:"/mɪks/",pos:"v. 動詞",zh:"混合",ex:"*Mix* the ingredients.",lv:0,cefr:"A2"},
  {w:"mixture",ph:"/ˈmɪkstʃər/",pos:"n. 名詞",zh:"混合物",ex:"A *mixture* of colors.",lv:1,cefr:"B1"},
  {w:"model",ph:"nan",pos:"n.",zh:"模型",ex:"She is a fashion *model*.",lv:1,cefr:"B1"},
  {w:"modern",ph:"/ˈmɒdən/",pos:"adj. 形容詞",zh:"現代的",ex:"She lives in a *modern* apartment.",lv:1,cefr:"B1"},
  {w:"mom",ph:"/mɒm/",pos:"n.",zh:"媽媽",ex:"My *mom* is a teacher.",lv:0,cefr:"A1"},
  {w:"Monday",ph:"/ˈmʌndeɪ/",pos:"n. 名詞",zh:"星期一",ex:"School starts on *Monday*.",lv:0,cefr:"A1"},
  {w:"money",ph:"/ˈmʌni/",pos:"n. 名詞",zh:"錢",ex:"She saved *money* to buy a new bike.",lv:0,cefr:"A1"},
  {w:"monitor",ph:"/ˈmɒnɪtər/",pos:"v.",zh:"監控",ex:"Teachers should *monitor* students' progress.",lv:2,cefr:"B2"},
  {w:"monkey",ph:"/ˈmʌŋki/",pos:"n. 名詞",zh:"猴子",ex:"*Monkeys* climb trees.",lv:0,cefr:"A1"},
  {w:"month",ph:"/mʌnθ/",pos:"n. 名詞",zh:"月份",ex:"There are twelve *months* in a year.",lv:0,cefr:"A1"},
  {w:"moon",ph:"/muːn/",pos:"n.",zh:"月亮",ex:"The *moon* is bright.",lv:0,cefr:"A1"},
  {w:"moral",ph:"/ˈmɒrəl/",pos:"adj.",zh:"道德的",ex:"Every story has a *moral*.",lv:1,cefr:"B1"},
  {w:"morning",ph:"/ˈmɔːrnɪŋ/",pos:"n. 名詞",zh:"早上",ex:"She jogs every *morning*.",lv:0,cefr:"A1"},
  {w:"mostly",ph:"/ˈmoʊstli/",pos:"adv. 副詞",zh:"主要地",ex:"She *mostly* reads novels.",lv:1,cefr:"B1"},
  {w:"mother",ph:"/ˈmʌðər/",pos:"n. 名詞",zh:"母親",ex:"Her *mother* works as a teacher.",lv:0,cefr:"A1"},
  {w:"motivate",ph:"/ˈməʊtɪveɪt/",pos:"v. 動詞",zh:"激勵",ex:"A good teacher *motivates* students.",lv:1,cefr:"B2"},
  {w:"motive",ph:"/ˈməʊtɪv/",pos:"n. 名詞",zh:"動機",ex:"What was his *motive* for doing that?",lv:1,cefr:"B1"},
  {w:"motorcycle",ph:"/ˈmoʊtərsaɪkəl/",pos:"n. 名詞",zh:"機車",ex:"He rides a *motorcycle*.",lv:0,cefr:"A2"},
  {w:"mountain",ph:"/ˈmaʊntɪn/",pos:"n. 名詞",zh:"山",ex:"They hiked up the *mountain*.",lv:0,cefr:"A2"},
  {w:"mouse",ph:"/maʊs/",pos:"n. 名詞",zh:"老鼠",ex:"The *mouse* ran across the floor.",lv:0,cefr:"A1"},
  {w:"mouth",ph:"/maʊθ/",pos:"n.",zh:"嘴巴",ex:"Open your *mouth*.",lv:0,cefr:"A1"},
  {w:"move",ph:"/muːv/",pos:"v.",zh:"移動",ex:"She *moved* to a new apartment.",lv:0,cefr:"A2"},
  {w:"movie",ph:"/ˈmuːvi/",pos:"n. 名詞",zh:"電影",ex:"Let's watch a *movie*.",lv:0,cefr:"A2"},
  {w:"much",ph:"/mʌtʃ/",pos:"adv.",zh:"很多",ex:"Thank you very *much*.",lv:0,cefr:"A1"},
  {w:"muscle",ph:"/ˈmʌsəl/",pos:"n. 名詞",zh:"肌肉",ex:"He has strong *muscles*.",lv:0,cefr:"A2"},
  {w:"museum",ph:"nan",pos:"n.",zh:"博物館",ex:"Visit the art *museum*.",lv:0,cefr:"A2"},
  {w:"mushroom",ph:"/ˈmʌʃruːm/",pos:"n. 名詞",zh:"蘑菇",ex:"She added *mushrooms* to the soup.",lv:0,cefr:"A1"},
  {w:"music",ph:"/ˈmjuːzɪk/",pos:"n. 名詞",zh:"音樂",ex:"She listens to *music* when she studies.",lv:0,cefr:"A1"},
  {w:"musician",ph:"/mjuːˈzɪʃən/",pos:"n. 名詞",zh:"音樂家",ex:"He is a *musician*.",lv:1,cefr:"B1"},
  {w:"mystery",ph:"/ˈmɪstəri/",pos:"n. 名詞",zh:"謎",ex:"The disappearance remains a *mystery*.",lv:1,cefr:"B1"},
  {w:"name",ph:"/neɪm/",pos:"n.",zh:"名字",ex:"What is your *name*?",lv:0,cefr:"A1"},
  {w:"narrative",ph:"/ˈnærətɪv/",pos:"n. 名詞",zh:"敘述",ex:"The *narrative* was engaging and clear.",lv:2,cefr:"B2"},
  {w:"nation",ph:"/ˈneɪʃən/",pos:"n. 名詞",zh:"國家",ex:"People of every *nation* attended.",lv:1,cefr:"B1"},
  {w:"natural",ph:"/ˈnætʃərəl/",pos:"adj.",zh:"自然的",ex:"A *natural* process.",lv:1,cefr:"B1"},
  {w:"nature",ph:"/ˈneɪtʃər/",pos:"n. 名詞",zh:"大自然",ex:"She loves spending time in *nature*.",lv:0,cefr:"A2"},
  {w:"near",ph:"/nɪər/",pos:"adj.",zh:"靠近的",ex:"The store is *near* my school.",lv:0,cefr:"A2"},
  {w:"nearly",ph:"/ˈnɪərli/",pos:"adv. 副詞",zh:"幾乎",ex:"She *nearly* missed the bus.",lv:1,cefr:"B1"},
  {w:"neat",ph:"/niːt/",pos:"adj. 形容詞",zh:"整潔的",ex:"Keep it *neat*.",lv:0,cefr:"A2"},
  {w:"necessary",ph:"/ˈnɛsɪsəri/",pos:"adj. 形容詞",zh:"必要的",ex:"It is *necessary* to drink water every day.",lv:0,cefr:"B1"},
  {w:"neck",ph:"/nɛk/",pos:"n. 名詞",zh:"脖子",ex:"She wears a scarf around her *neck*.",lv:0,cefr:"A1"},
  {w:"need",ph:"/niːd/",pos:"v.",zh:"需要",ex:"I *need* help with this problem.",lv:0,cefr:"A1"},
  {w:"negative",ph:"/ˈnɛɡətɪv/",pos:"adj. 形容詞",zh:"負面的",ex:"Try not to have a *negative* attitude.",lv:1,cefr:"B1"},
  {w:"neighbor",ph:"/ˈneɪbər/",pos:"n. 名詞",zh:"鄰居",ex:"She is a kind *neighbor*.",lv:0,cefr:"A2"},
  {w:"nervous",ph:"nan",pos:"adj.",zh:"緊張的",ex:"I am *nervous* about the test.",lv:1,cefr:"B1"},
  {w:"never",ph:"/ˈnɛvər/",pos:"adv. 副詞",zh:"從不",ex:"I have *never* been to Paris.",lv:0,cefr:"A2"},
  {w:"new",ph:"/njuː/",pos:"adj. 形容詞",zh:"新的",ex:"She bought a *new* phone.",lv:0,cefr:"A1"},
  {w:"news",ph:"/njuːz/",pos:"n.",zh:"新聞",ex:"Watch the *news*.",lv:1,cefr:"B1"},
  {w:"newspaper",ph:"/ˈnjuːspeɪpər/",pos:"n. 名詞",zh:"報紙",ex:"He reads the *newspaper*.",lv:0,cefr:"A2"},
  {w:"next",ph:"/nɛkst/",pos:"adj.",zh:"下一個",ex:"*next* week is the school festival.",lv:0,cefr:"A2"},
  {w:"nice",ph:"/naɪs/",pos:"adj. 形容詞",zh:"好的",ex:"What a *nice* day!",lv:0,cefr:"A1"},
  {w:"night",ph:"/naɪt/",pos:"n. 名詞",zh:"夜晚",ex:"She studies at *night*.",lv:0,cefr:"A1"},
  {w:"nine",ph:"/naɪn/",pos:"num. 數詞",zh:"九",ex:"*Nine* students passed.",lv:0,cefr:"A1"},
  {w:"nineteen",ph:"/ˌnaɪnˈtiːn/",pos:"num. 數詞",zh:"十九",ex:"There are *nineteen* items.",lv:0,cefr:"A1"},
  {w:"ninety",ph:"/ˈnaɪnti/",pos:"num. 數詞",zh:"九十",ex:"I got *ninety* on the test.",lv:0,cefr:"A1"},
  {w:"ninth",ph:"/naɪnθ/",pos:"adj. 形容詞",zh:"第九",ex:"She was *ninth* in line.",lv:0,cefr:"A1"},
  {w:"nobody",ph:"nan",pos:"pron.",zh:"沒有人",ex:"*nobody* was at home.",lv:0,cefr:"A2"},
  {w:"nod",ph:"/nɒd/",pos:"v. 動詞",zh:"點頭",ex:"She *nodded* in agreement.",lv:0,cefr:"A2"},
  {w:"noise",ph:"/nɔɪz/",pos:"n. 名詞",zh:"噪音",ex:"Please don't make so much *noise*.",lv:0,cefr:"A2"},
  {w:"noisy",ph:"/ˈnɔɪzi/",pos:"adj. 形容詞",zh:"吵鬧的",ex:"The class was *noisy*.",lv:0,cefr:"A2"},
  {w:"noodle",ph:"nan",pos:"n.",zh:"麵條",ex:"I love *noodle* soup.",lv:0,cefr:"A1"},
  {w:"noon",ph:"/nuːn/",pos:"n. 名詞",zh:"正午",ex:"We meet at *noon*.",lv:0,cefr:"A1"},
  {w:"normally",ph:"/ˈnɔːrməli/",pos:"adv. 副詞",zh:"通常地",ex:"She *normally* wakes up early.",lv:1,cefr:"B1"},
  {w:"north",ph:"nan",pos:"n.",zh:"北方",ex:"It is to the *north*.",lv:0,cefr:"A1"},
  {w:"nose",ph:"/noʊz/",pos:"n.",zh:"鼻子",ex:"His *nose* is running.",lv:0,cefr:"A1"},
  {w:"note",ph:"/noʊt/",pos:"n. 名詞",zh:"筆記；便條",ex:"I wrote a *note*.",lv:0,cefr:"A2"},
  {w:"notebook",ph:"/ˈnəʊtbʊk/",pos:"n. 名詞",zh:"筆記本",ex:"She wrote in her *notebook* during class.",lv:0,cefr:"A2"},
  {w:"notice",ph:"/ˈnəʊtɪs/",pos:"v.",zh:"注意到",ex:"Did you *notice* anything strange?",lv:0,cefr:"B1"},
  {w:"notion",ph:"/ˈnəʊʃən/",pos:"n. 名詞",zh:"概念",ex:"The *notion* of fairness differs across cultures.",lv:2,cefr:"B2"},
  {w:"November",ph:"/noʊˈvɛmbər/",pos:"n. 名詞",zh:"十一月",ex:"*November* is cool.",lv:0,cefr:"A1"},
  {w:"now",ph:"/naʊ/",pos:"adv. 副詞",zh:"現在",ex:"What are you doing *now*?",lv:0,cefr:"A1"},
  {w:"nuance",ph:"/ˈnjuːɑːns/",pos:"n. 名詞",zh:"細微差別",ex:"Understanding *nuance* is key to fluency.",lv:2,cefr:"B2"},
  {w:"number",ph:"/ˈnʌmbər/",pos:"n.",zh:"數字",ex:"What is your phone *number*?",lv:0,cefr:"A2"},
  {w:"numerous",ph:"/ˈnjuːmərəs/",pos:"adj. 形容詞",zh:"許多的",ex:"There are *numerous* ways to solve this.",lv:1,cefr:"B2"},
  {w:"nurse",ph:"nan",pos:"n.",zh:"護士",ex:"The *nurse* helped me.",lv:0,cefr:"A1"},
  {w:"obey",ph:"/əˈbeɪ/",pos:"v. 動詞",zh:"服從",ex:"*Obey* the rules.",lv:1,cefr:"B1"},
  {w:"objective",ph:"/əbˈdʒɛktɪv/",pos:"n.",zh:"目標",ex:"Set clear *objectives* for your project.",lv:1,cefr:"B1"},
  {w:"observe",ph:"/əbˈzɜːrv/",pos:"v. 動詞",zh:"觀察",ex:"*Observe* carefully.",lv:2,cefr:"B2"},
  {w:"obsolete",ph:"/ˌɒbsəˈliːt/",pos:"adj. 形容詞",zh:"過時的",ex:"Fax machines are becoming *obsolete*.",lv:2,cefr:"B2"},
  {w:"obstacle",ph:"/ˈɒbstəkəl/",pos:"n. 名詞",zh:"障礙",ex:"She overcame every *obstacle*.",lv:1,cefr:"B1"},
  {w:"obtain",ph:"/əbˈteɪn/",pos:"v.",zh:"獲得",ex:"She *obtained* a high score.",lv:2,cefr:"B2"},
  {w:"obvious",ph:"/ˈɒbvɪəs/",pos:"adj. 形容詞",zh:"明顯的",ex:"The answer is *obvious*.",lv:1,cefr:"B2"},
  {w:"ocean",ph:"/ˈəʊʃən/",pos:"n. 名詞",zh:"海洋",ex:"The *ocean* covers most of the Earth.",lv:0,cefr:"A2"},
  {w:"October",ph:"/ɒkˈtoʊbər/",pos:"n. 名詞",zh:"十月",ex:"Leaves fall in *October*.",lv:0,cefr:"A1"},
  {w:"offer",ph:"/ˈɒfər/",pos:"v.",zh:"提供",ex:"She *offered* to help.",lv:1,cefr:"B1"},
  {w:"office",ph:"nan",pos:"n.",zh:"辦公室",ex:"I work in an *office*.",lv:0,cefr:"A2"},
  {w:"often",ph:"/ˈɒfən/",pos:"adv. 副詞",zh:"經常",ex:"She *often* goes jogging in the morning.",lv:0,cefr:"A2"},
  {w:"old",ph:"/oʊld/",pos:"adj.",zh:"老的",ex:"An *old* man.",lv:0,cefr:"A1"},
  {w:"once",ph:"nan",pos:"adv.",zh:"一次",ex:"*once* upon a time.",lv:0,cefr:"A2"},
  {w:"one",ph:"/wʌn/",pos:"num. 數詞",zh:"一",ex:"I have *one* sister.",lv:0,cefr:"A1"},
  {w:"onion",ph:"/ˈʌnjən/",pos:"n. 名詞",zh:"洋蔥",ex:"The *onion* made her cry.",lv:0,cefr:"A1"},
  {w:"online",ph:"nan",pos:"adj.",zh:"線上的",ex:"Shop *online*.",lv:0,cefr:"A2"},
  {w:"only",ph:"/ˈəʊnli/",pos:"adj.",zh:"只",ex:"She is the *only* child in her family.",lv:0,cefr:"A2"},
  {w:"open",ph:"/ˈəʊpən/",pos:"adj.",zh:"開著的",ex:"Please *open* the window.",lv:0,cefr:"A1"},
  {w:"operation",ph:"/ˌɒpəˈreɪʃən/",pos:"n. 名詞",zh:"手術；操作",ex:"She had an *operation*.",lv:1,cefr:"B1"},
  {w:"opinion",ph:"/əˈpɪnjən/",pos:"n. 名詞",zh:"意見",ex:"In my *opinion*, this plan is better.",lv:1,cefr:"B1"},
  {w:"opportunity",ph:"/ˌɒpəˈtjuːnɪti/",pos:"n. 名詞",zh:"機會",ex:"This is a great *opportunity* to learn.",lv:1,cefr:"B1"},
  {w:"or",ph:"/ɔːr/",pos:"conj.",zh:"或者",ex:"Tea *or* coffee?",lv:0,cefr:"A1"},
  {w:"orange",ph:"/ˈɒrɪndʒ/",pos:"n. 名詞",zh:"柳橙",ex:"She ate an *orange*.",lv:0,cefr:"A2"},
  {w:"order",ph:"/ˈɔːrdər/",pos:"n.",zh:"順序",ex:"She *ordered* a salad for lunch.",lv:0,cefr:"A2"},
  {w:"ordinary",ph:"/ˈɔːrdɪnɛri/",pos:"adj. 形容詞",zh:"普通的",ex:"It is an *ordinary* day.",lv:1,cefr:"B1"},
  {w:"organize",ph:"/ˈɔːɡənaɪz/",pos:"v. 動詞",zh:"組織",ex:"She helped *organize* the school event.",lv:1,cefr:"B1"},
  {w:"original",ph:"/əˈrɪdʒɪnəl/",pos:"adj. 形容詞",zh:"原創的",ex:"That is an *original* idea.",lv:1,cefr:"B1"},
  {w:"other",ph:"nan",pos:"det.",zh:"其他的",ex:"I need the *other* one.",lv:0,cefr:"A1"},
  {w:"otherwise",ph:"/ˈʌðərwaɪz/",pos:"adv.",zh:"否則",ex:"Hurry, *otherwise* we'll be late.",lv:1,cefr:"B1"},
  {w:"outside",ph:"/ˌaʊtˈsaɪd/",pos:"prep.",zh:"在外面",ex:"Let's go *outside* and play.",lv:0,cefr:"A2"},
  {w:"oval",ph:"/ˈoʊvəl/",pos:"n. 名詞",zh:"橢圓形",ex:"The egg is *oval*.",lv:0,cefr:"A2"},
  {w:"overcome",ph:"/ˌəʊvəˈkʌm/",pos:"v. 動詞",zh:"克服",ex:"She learned to *overcome* her fear.",lv:1,cefr:"B2"},
  {w:"own",ph:"/əʊn/",pos:"adj.",zh:"自己的",ex:"She has her *own* room now.",lv:0,cefr:"A2"},
  {w:"pack",ph:"/pæk/",pos:"v. 動詞",zh:"打包",ex:"*Pack* your bag.",lv:0,cefr:"A2"},
  {w:"package",ph:"nan",pos:"n.",zh:"包裹",ex:"I received a *package*.",lv:0,cefr:"A2"},
  {w:"page",ph:"/peɪdʒ/",pos:"n. 名詞",zh:"頁",ex:"Please turn to *page* thirty.",lv:0,cefr:"A2"},
  {w:"paint",ph:"/peɪnt/",pos:"v. 動詞",zh:"繪畫；油漆",ex:"She *paints* pictures.",lv:0,cefr:"A2"},
  {w:"pajamas",ph:"/pəˈdʒɑːməz/",pos:"n. 名詞",zh:"睡衣",ex:"She put on her *pajamas*.",lv:0,cefr:"A2"},
  {w:"palm",ph:"/pɑːm/",pos:"n. 名詞",zh:"手掌",ex:"She held it in her *palm*.",lv:0,cefr:"A2"},
  {w:"pants",ph:"/pænts/",pos:"n. 名詞",zh:"長褲",ex:"He bought new *pants*.",lv:0,cefr:"A1"},
  {w:"paper",ph:"/ˈpeɪpər/",pos:"n. 名詞",zh:"紙",ex:"Write on *paper*.",lv:0,cefr:"A1"},
  {w:"paradigm",ph:"/ˈpærədaɪm/",pos:"n. 名詞",zh:"典範",ex:"A new *paradigm* in science emerged.",lv:2,cefr:"B2"},
  {w:"paradox",ph:"/ˈpærədɒks/",pos:"n. 名詞",zh:"矛盾",ex:"It's a *paradox* that silence can be loud.",lv:2,cefr:"C1"},
  {w:"paragraph",ph:"/ˈpærəɡrɑːf/",pos:"n. 名詞",zh:"段落",ex:"Write a *paragraph*.",lv:1,cefr:"B1"},
  {w:"parents",ph:"nan",pos:"n.",zh:"父母",ex:"My *parents* are kind.",lv:0,cefr:"A1"},
  {w:"park",ph:"/pɑːrk/",pos:"n.",zh:"公園",ex:"She walks her dog in the *park*.",lv:0,cefr:"A1"},
  {w:"parrot",ph:"/ˈpærət/",pos:"n. 名詞",zh:"鸚鵡",ex:"The *parrot* can talk.",lv:0,cefr:"A1"},
  {w:"part",ph:"nan",pos:"n.",zh:"部分",ex:"This *part* is hard.",lv:0,cefr:"A2"},
  {w:"participate",ph:"/pɑːˈtɪsɪpeɪt/",pos:"v. 動詞",zh:"參與",ex:"Everyone is welcome to *participate*.",lv:1,cefr:"B2"},
  {w:"particular",ph:"/pəˈtɪkjʊlər/",pos:"adj.",zh:"特別的",ex:"This *particular* style.",lv:1,cefr:"B1"},
  {w:"party",ph:"/ˈpɑːrti/",pos:"n. 名詞",zh:"派對",ex:"She is planning a birthday *party*.",lv:0,cefr:"A1"},
  {w:"pass",ph:"/pɑːs/",pos:"v.",zh:"通過",ex:"She *passed* all her exams.",lv:0,cefr:"A2"},
  {w:"passport",ph:"/ˈpæspɔːrt/",pos:"n. 名詞",zh:"護照",ex:"Show your *passport*.",lv:0,cefr:"A2"},
  {w:"password",ph:"/ˈpæswɜːrd/",pos:"n. 名詞",zh:"密碼",ex:"Enter your *password*.",lv:0,cefr:"A2"},
  {w:"past",ph:"/pɑːst/",pos:"n.",zh:"過去",ex:"In the *past*, life was simpler.",lv:0,cefr:"A2"},
  {w:"patience",ph:"/ˈpeɪʃəns/",pos:"n. 名詞",zh:"耐心",ex:"Learning takes *patience*.",lv:1,cefr:"B1"},
  {w:"patient",ph:"/ˈpeɪʃənt/",pos:"adj.",zh:"有耐心的",ex:"Be *patient*; good things take time.",lv:1,cefr:"B1"},
  {w:"pattern",ph:"nan",pos:"n.",zh:"圖案",ex:"I like this *pattern*.",lv:1,cefr:"B1"},
  {w:"pay",ph:"/peɪ/",pos:"v.",zh:"支付",ex:"She paid for the meal.",lv:0,cefr:"A2"},
  {w:"PE",ph:"/ˌpiːˈiː/",pos:"n. 名詞",zh:"體育",ex:"*PE* is my favorite class.",lv:0,cefr:"A1"},
  {w:"peace",ph:"/piːs/",pos:"n. 名詞",zh:"和平",ex:"*peace* is important for everyone.",lv:0,cefr:"A2"},
  {w:"pear",ph:"/pɛr/",pos:"n. 名詞",zh:"梨子",ex:"She ate a *pear*.",lv:0,cefr:"A1"},
  {w:"pen",ph:"/pɛn/",pos:"n.",zh:"筆",ex:"Borrow your *pen*?",lv:0,cefr:"A1"},
  {w:"pencil",ph:"/ˈpɛnsəl/",pos:"n. 名詞",zh:"鉛筆",ex:"Can I borrow your *pencil*?",lv:0,cefr:"A2"},
  {w:"pencil case",ph:"/ˈpɛnsəl keɪs/",pos:"n. 名詞",zh:"鉛筆盒",ex:"Put pencils in your *pencil case*.",lv:0,cefr:"A1"},
  {w:"penguin",ph:"/ˈpɛŋɡwɪn/",pos:"n. 名詞",zh:"企鵝",ex:"*Penguins* live in Antarctica.",lv:0,cefr:"A2"},
  {w:"people",ph:"/ˈpiːpəl/",pos:"n. 名詞",zh:"人們",ex:"The *people* here are very friendly.",lv:0,cefr:"A2"},
  {w:"pepper",ph:"/ˈpɛpər/",pos:"n. 名詞",zh:"胡椒；辣椒",ex:"Add *pepper* for flavor.",lv:0,cefr:"A1"},
  {w:"perceive",ph:"/pəˈsiːv/",pos:"v. 動詞",zh:"察覺",ex:"How do you *perceive* this situation?",lv:2,cefr:"C1"},
  {w:"percent",ph:"/pəˈsɛnt/",pos:"n.",zh:"百分比",ex:"Ninety *percent* passed.",lv:1,cefr:"B1"},
  {w:"perception",ph:"/pəˈsɛpʃən/",pos:"n. 名詞",zh:"感知",ex:"Our *perception* of reality varies.",lv:2,cefr:"B2"},
  {w:"perfect",ph:"/ˈpɜːrfɪkt/",pos:"adj. 形容詞",zh:"完美的",ex:"She gave a *perfect* performance.",lv:0,cefr:"A2"},
  {w:"perform",ph:"/pərˈfɔːrm/",pos:"v. 動詞",zh:"表演；執行",ex:"She *performed* on stage.",lv:1,cefr:"B1"},
  {w:"performance",ph:"/pəˈfɔːməns/",pos:"n. 名詞",zh:"表現",ex:"Her *performance* on stage was wonderful.",lv:1,cefr:"B1"},
  {w:"perhaps",ph:"/pəˈhæps/",pos:"adv.",zh:"也許",ex:"*Perhaps* tomorrow.",lv:1,cefr:"B1"},
  {w:"period",ph:"/ˈpɪəriəd/",pos:"n.",zh:"時期",ex:"A difficult *period*.",lv:1,cefr:"B1"},
  {w:"permission",ph:"/pərˈmɪʃən/",pos:"n. 名詞",zh:"許可",ex:"Ask for *permission*.",lv:1,cefr:"B1"},
  {w:"person",ph:"/ˈpɜːrsən/",pos:"n. 名詞",zh:"人",ex:"She is a very kind *person*.",lv:0,cefr:"A2"},
  {w:"personal",ph:"/ˈpɜːrsənəl/",pos:"adj. 形容詞",zh:"個人的",ex:"That is *personal*.",lv:1,cefr:"B1"},
  {w:"perspective",ph:"/pəˈspɛktɪv/",pos:"n. 名詞",zh:"觀點",ex:"Let's look at this from a different *perspective*.",lv:2,cefr:"B2"},
  {w:"persuade",ph:"/pəˈsweɪd/",pos:"v. 動詞",zh:"說服",ex:"She *persuaded* him to join the team.",lv:1,cefr:"B1"},
  {w:"pharmacy",ph:"/ˈfɑːrməsi/",pos:"n. 名詞",zh:"藥局",ex:"Get medicine at the *pharmacy*.",lv:1,cefr:"B1"},
  {w:"phenomenon",ph:"/fɪˈnɒmɪnən/",pos:"n. 名詞",zh:"現象",ex:"Climate change is a complex *phenomenon*.",lv:2,cefr:"C1"},
  {w:"phone",ph:"/fəʊn/",pos:"n.",zh:"電話",ex:"She left her *phone* at home.",lv:0,cefr:"A1"},
  {w:"photo",ph:"/ˈfəʊtəʊ/",pos:"n. 名詞",zh:"照片",ex:"She took a *photo* with her friends.",lv:0,cefr:"A1"},
  {w:"photography",ph:"/fəˈtɒɡrəfi/",pos:"n. 名詞",zh:"攝影",ex:"*Photography* is her hobby.",lv:1,cefr:"B1"},
  {w:"phrase",ph:"/freɪz/",pos:"n. 名詞",zh:"片語；短語",ex:"Learn common *phrases*.",lv:1,cefr:"B1"},
  {w:"physical",ph:"/ˈfɪzɪkəl/",pos:"adj. 形容詞",zh:"身體的；物質的",ex:"*Physical* exercise.",lv:1,cefr:"B1"},
  {w:"picnic",ph:"/ˈpɪknɪk/",pos:"n. 名詞",zh:"野餐",ex:"We had a *picnic* in the park.",lv:0,cefr:"A2"},
  {w:"picture",ph:"/ˈpɪktʃər/",pos:"n. 名詞",zh:"圖片",ex:"She hung a *picture* on the wall.",lv:0,cefr:"A2"},
  {w:"piece",ph:"/piːs/",pos:"n.",zh:"片；塊",ex:"A *piece* of cake.",lv:0,cefr:"A2"},
  {w:"pig",ph:"/pɪɡ/",pos:"n. 名詞",zh:"豬",ex:"The *pig* is on the farm.",lv:0,cefr:"A1"},
  {w:"pillow",ph:"/ˈpɪloʊ/",pos:"n. 名詞",zh:"枕頭",ex:"She fluffed her *pillow*.",lv:0,cefr:"A1"},
  {w:"pilot",ph:"/ˈpaɪlət/",pos:"n. 名詞",zh:"飛行員",ex:"She became a *pilot*.",lv:0,cefr:"A2"},
  {w:"pineapple",ph:"/ˈpaɪnæpəl/",pos:"n. 名詞",zh:"鳳梨",ex:"*Pineapple* is sweet and sour.",lv:0,cefr:"A1"},
  {w:"pink",ph:"/pɪŋk/",pos:"adj.",zh:"粉紅色的",ex:"A *pink* dress.",lv:0,cefr:"A1"},
  {w:"pizza",ph:"/ˈpiːtsə/",pos:"n. 名詞",zh:"披薩",ex:"I love *pizza*.",lv:0,cefr:"A2"},
  {w:"place",ph:"/pleɪs/",pos:"n.",zh:"地方",ex:"This is a beautiful *place*.",lv:0,cefr:"A2"},
  {w:"plan",ph:"/plæn/",pos:"n.",zh:"計劃",ex:"What is your *plan* for the weekend?",lv:0,cefr:"A2"},
  {w:"plane",ph:"/pleɪn/",pos:"n. 名詞",zh:"飛機",ex:"We flew on a *plane*.",lv:0,cefr:"A1"},
  {w:"planet",ph:"/ˈplænɪt/",pos:"n. 名詞",zh:"行星",ex:"Earth is a *planet*.",lv:1,cefr:"B1"},
  {w:"plant",ph:"/plɑːnt/",pos:"n.",zh:"植物",ex:"She *plants* flowers in spring.",lv:0,cefr:"A2"},
  {w:"plate",ph:"/pleɪt/",pos:"n.",zh:"盤子",ex:"Food on the *plate*.",lv:0,cefr:"A1"},
  {w:"platform",ph:"/ˈplætfɔːrm/",pos:"n. 名詞",zh:"月台；平台",ex:"Stand on the *platform*.",lv:0,cefr:"A2"},
  {w:"plausible",ph:"/ˈplɔːzɪbəl/",pos:"adj. 形容詞",zh:"合理的",ex:"That explanation seems *plausible*.",lv:2,cefr:"B2"},
  {w:"play",ph:"/pleɪ/",pos:"v.",zh:"玩",ex:"She *plays* the violin every evening.",lv:0,cefr:"A1"},
  {w:"playground",ph:"/ˈpleɪɡraʊnd/",pos:"n. 名詞",zh:"操場；遊樂場",ex:"Children play at the *playground*.",lv:0,cefr:"A1"},
  {w:"please",ph:"/pliːz/",pos:"adv.",zh:"請",ex:"*please* be quiet in the library.",lv:0,cefr:"A1"},
  {w:"plenty",ph:"/ˈplɛnti/",pos:"n. 名詞",zh:"充裕；大量",ex:"*Plenty* of time.",lv:1,cefr:"B1"},
  {w:"pocket",ph:"/ˈpɒkɪt/",pos:"n. 名詞",zh:"口袋",ex:"He put his keys in his *pocket*.",lv:0,cefr:"A2"},
  {w:"poem",ph:"/ˈpoʊɪm/",pos:"n. 名詞",zh:"詩",ex:"She wrote a *poem*.",lv:0,cefr:"A2"},
  {w:"point",ph:"/pɔɪnt/",pos:"v. 動詞",zh:"指向",ex:"*Point* to the map.",lv:0,cefr:"A2"},
  {w:"police",ph:"nan",pos:"n.",zh:"警察",ex:"Call the *police*.",lv:0,cefr:"A2"},
  {w:"police station",ph:"/pəˈliːs ˈsteɪʃən/",pos:"n. 名詞",zh:"警察局",ex:"Report at the *police station*.",lv:0,cefr:"A2"},
  {w:"polite",ph:"/pəˈlaɪt/",pos:"adj. 形容詞",zh:"有禮貌的",ex:"Always be *polite* to others.",lv:0,cefr:"A2"},
  {w:"pollution",ph:"/pəˈluːʃən/",pos:"n. 名詞",zh:"污染",ex:"*Pollution* is a big problem.",lv:1,cefr:"B1"},
  {w:"pond",ph:"nan",pos:"n.",zh:"池塘",ex:"There are fish in the *pond*.",lv:0,cefr:"A2"},
  {w:"poor",ph:"/pʊr/",pos:"adj. 形容詞",zh:"貧窮的；可憐的",ex:"She felt *poor*.",lv:0,cefr:"A2"},
  {w:"popular",ph:"/ˈpɒpjʊlər/",pos:"adj. 形容詞",zh:"受歡迎的",ex:"This song is very *popular*.",lv:0,cefr:"A2"},
  {w:"pork",ph:"/pɔːrk/",pos:"n.",zh:"豬肉",ex:"We had *pork* for dinner.",lv:0,cefr:"A1"},
  {w:"position",ph:"/pəˈzɪʃən/",pos:"n.",zh:"職位",ex:"A senior *position*.",lv:1,cefr:"B1"},
  {w:"positive",ph:"/ˈpɒzɪtɪv/",pos:"adj. 形容詞",zh:"正面的",ex:"Try to stay *positive* even when things are hard.",lv:1,cefr:"B1"},
  {w:"possible",ph:"/ˈpɒsɪbəl/",pos:"adj.",zh:"可能的",ex:"Is it *possible*?",lv:1,cefr:"B1"},
  {w:"post",ph:"nan",pos:"v.",zh:"寄",ex:"*post* a letter.",lv:0,cefr:"A2"},
  {w:"post office",ph:"/poʊst ˈɒfɪs/",pos:"n. 名詞",zh:"郵局",ex:"Send the letter from the *post office*.",lv:0,cefr:"A2"},
  {w:"potato",ph:"/pəˈteɪtoʊ/",pos:"n.",zh:"馬鈴薯",ex:"She made *potato* soup.",lv:0,cefr:"A1"},
  {w:"potential",ph:"/pəˈtɛnʃəl/",pos:"n.",zh:"潛力",ex:"She has great *potential*.",lv:1,cefr:"B2"},
  {w:"pour",ph:"nan",pos:"v.",zh:"倒(液體)",ex:"*pour* the juice into the glass.",lv:1,cefr:"B1"},
  {w:"poverty",ph:"/ˈpɒvərti/",pos:"n. 名詞",zh:"貧困",ex:"Fight against *poverty*.",lv:1,cefr:"B1"},
  {w:"power",ph:"/ˈpaʊər/",pos:"n.",zh:"力量",ex:"The *power* went out.",lv:1,cefr:"B1"},
  {w:"powerful",ph:"/ˈpaʊərfʊl/",pos:"adj. 形容詞",zh:"強大的",ex:"She is a *powerful* speaker.",lv:1,cefr:"B1"},
  {w:"practical",ph:"/ˈpræktɪkəl/",pos:"adj. 形容詞",zh:"實際的",ex:"We need a *practical* solution.",lv:1,cefr:"B1"},
  {w:"practice",ph:"/ˈpræktɪs/",pos:"v.",zh:"練習",ex:"You need to *practice* every day.",lv:0,cefr:"A2"},
  {w:"precise",ph:"/prɪˈsaɪs/",pos:"adj.",zh:"精確的",ex:"Be *precise*.",lv:2,cefr:"B2"},
  {w:"predict",ph:"/prɪˈdɪkt/",pos:"v. 動詞",zh:"預測",ex:"It is hard to *predict* the weather.",lv:1,cefr:"B1"},
  {w:"preliminary",ph:"/prɪˈlɪmɪnəri/",pos:"adj. 形容詞",zh:"初步的",ex:"This is just a *preliminary* report.",lv:2,cefr:"B2"},
  {w:"prepare",ph:"/prɪˈpɛr/",pos:"v. 動詞",zh:"準備",ex:"She needs to *prepare* for the test.",lv:0,cefr:"B1"},
  {w:"prescription",ph:"/prɪˈskrɪpʃən/",pos:"n. 名詞",zh:"處方箋",ex:"Show the *prescription*.",lv:1,cefr:"B1"},
  {w:"pretend",ph:"/prɪˈtɛnd/",pos:"v. 動詞",zh:"假裝",ex:"Stop *pretending*.",lv:1,cefr:"B1"},
  {w:"pretty",ph:"/ˈprɪti/",pos:"adj.",zh:"漂亮的",ex:"She is wearing a *pretty* dress.",lv:0,cefr:"A2"},
  {w:"prevalent",ph:"/ˈprɛvələnt/",pos:"adj. 形容詞",zh:"普遍的",ex:"Social media is *prevalent* among teens.",lv:2,cefr:"B2"},
  {w:"prevent",ph:"/prɪˈvɛnt/",pos:"v. 動詞",zh:"預防",ex:"Washing hands can *prevent* illness.",lv:1,cefr:"B1"},
  {w:"price",ph:"/praɪs/",pos:"n. 名詞",zh:"價格",ex:"The *price* of this jacket is too high.",lv:0,cefr:"A2"},
  {w:"principal",ph:"/ˈprɪnsɪpəl/",pos:"n. 名詞",zh:"校長",ex:"The *principal* gave a speech.",lv:0,cefr:"A2"},
  {w:"principle",ph:"/ˈprɪnsɪpəl/",pos:"n. 名詞",zh:"原則",ex:"She lives by strong *principles*.",lv:1,cefr:"B2"},
  {w:"print",ph:"/prɪnt/",pos:"v. 動詞",zh:"列印；印刷",ex:"*Print* the document.",lv:0,cefr:"A2"},
  {w:"prior",ph:"/ˈpraɪər/",pos:"adj.",zh:"先前的",ex:"*prior* experience is required for this job.",lv:2,cefr:"B2"},
  {w:"priority",ph:"/praɪˈɒrɪti/",pos:"n. 名詞",zh:"優先順序",ex:"Health is a *priority*.",lv:2,cefr:"B2"},
  {w:"private",ph:"/ˈpraɪvɪt/",pos:"adj. 形容詞",zh:"私人的",ex:"This is a *private* matter.",lv:1,cefr:"B1"},
  {w:"prize",ph:"/praɪz/",pos:"n. 名詞",zh:"獎品",ex:"She won first *prize*.",lv:0,cefr:"A2"},
  {w:"probably",ph:"/ˈprɒbəbli/",pos:"adv. 副詞",zh:"可能",ex:"She will *probably* come.",lv:1,cefr:"B1"},
  {w:"problem",ph:"/ˈprɒbləm/",pos:"n. 名詞",zh:"問題",ex:"Can you help me solve this *problem*?",lv:0,cefr:"A2"},
  {w:"process",ph:"/ˈprəʊsɛs/",pos:"n. 名詞",zh:"過程",ex:"Learning is a long *process*.",lv:1,cefr:"B1"},
  {w:"produce",ph:"/prəˈdjuːs/",pos:"v. 動詞",zh:"生產",ex:"This factory can *produce* 1000 cars a day.",lv:1,cefr:"B1"},
  {w:"profound",ph:"/prəˈfaʊnd/",pos:"adj. 形容詞",zh:"深刻的",ex:"Her speech had a *profound* impact.",lv:2,cefr:"C1"},
  {w:"program",ph:"/ˈproʊɡræm/",pos:"n. 名詞",zh:"節目；程式",ex:"What *program* do you watch?",lv:0,cefr:"A2"},
  {w:"progress",ph:"/ˈprəʊɡrɛs/",pos:"n.",zh:"進步",ex:"She is making great *progress* in English.",lv:1,cefr:"B1"},
  {w:"project",ph:"/ˈprɒdʒɛkt/",pos:"n. 名詞",zh:"計畫",ex:"Our *project* is due next Friday.",lv:1,cefr:"B1"},
  {w:"promise",ph:"/ˈprɒmɪs/",pos:"v.",zh:"承諾",ex:"She *promised* to call me back.",lv:0,cefr:"A2"},
  {w:"promote",ph:"/prəˈməʊt/",pos:"v. 動詞",zh:"促進",ex:"Exercise can *promote* good health.",lv:2,cefr:"B2"},
  {w:"prompt",ph:"/prɒmpt/",pos:"v.",zh:"促使",ex:"The news *prompted* her to act.",lv:2,cefr:"B2"},
  {w:"proof",ph:"/pruːf/",pos:"n. 名詞",zh:"證據；證明",ex:"Show *proof*.",lv:1,cefr:"B1"},
  {w:"proportion",ph:"/prəˈpɔːʃən/",pos:"n. 名詞",zh:"比例",ex:"A large *proportion* of students passed.",lv:2,cefr:"B2"},
  {w:"propose",ph:"/prəˈpəʊz/",pos:"v. 動詞",zh:"提議",ex:"She *proposed* a new plan for the project.",lv:2,cefr:"B2"},
  {w:"protect",ph:"/prəˈtɛkt/",pos:"v. 動詞",zh:"保護",ex:"We must *protect* endangered animals.",lv:1,cefr:"B1"},
  {w:"proud",ph:"/praʊd/",pos:"adj. 形容詞",zh:"驕傲的",ex:"Her parents are *proud* of her.",lv:0,cefr:"B1"},
  {w:"prove",ph:"/pruːv/",pos:"v. 動詞",zh:"證明",ex:"He needs to *prove* he is innocent.",lv:1,cefr:"B1"},
  {w:"provide",ph:"/prəˈvaɪd/",pos:"v. 動詞",zh:"提供",ex:"The school *provides* free lunches.",lv:1,cefr:"B1"},
  {w:"psychological",ph:"/ˌsaɪkəˈlɒdʒɪkəl/",pos:"adj.",zh:"心理的",ex:"*Psychological* support.",lv:2,cefr:"B2"},
  {w:"public",ph:"/ˈpʌblɪk/",pos:"adj.",zh:"公共的",ex:"Use *public* transport.",lv:1,cefr:"B1"},
  {w:"publish",ph:"/ˈpʌblɪʃ/",pos:"v. 動詞",zh:"出版",ex:"She hopes to *publish* her first novel.",lv:1,cefr:"B1"},
  {w:"pull",ph:"/pʊl/",pos:"v.",zh:"拉",ex:"*pull* the door to open it.",lv:0,cefr:"A2"},
  {w:"punishment",ph:"/ˈpʌnɪʃmənt/",pos:"n. 名詞",zh:"懲罰",ex:"The *punishment* was fair.",lv:1,cefr:"B1"},
  {w:"purple",ph:"/ˈpɜːrpəl/",pos:"adj.",zh:"紫色的",ex:"She likes *purple*.",lv:0,cefr:"A1"},
  {w:"purpose",ph:"/ˈpɜːpəs/",pos:"n. 名詞",zh:"目的",ex:"What is the *purpose* of this meeting?",lv:1,cefr:"B1"},
  {w:"pursue",ph:"/pərˈsjuː/",pos:"v.",zh:"追求",ex:"*Pursue* your dreams.",lv:2,cefr:"B2"},
  {w:"push",ph:"/pʊʃ/",pos:"v.",zh:"推",ex:"*push* the door to enter.",lv:0,cefr:"A2"},
  {w:"put",ph:"/pʊt/",pos:"v. 動詞",zh:"放",ex:"Please *put* your phone away.",lv:0,cefr:"A1"},
  {w:"quality",ph:"/ˈkwɒlɪti/",pos:"n.",zh:"品質",ex:"Excellent *quality*.",lv:1,cefr:"B1"},
  {w:"quarter",ph:"/ˈkwɔːrtər/",pos:"n. 名詞",zh:"四分之一；一刻鐘",ex:"Wait a *quarter* of an hour.",lv:0,cefr:"A2"},
  {w:"queen",ph:"/kwiːn/",pos:"n. 名詞",zh:"女王",ex:"The *queen* waved to the crowd.",lv:0,cefr:"A1"},
  {w:"question",ph:"/ˈkwɛstʃən/",pos:"n.",zh:"問題",ex:"She asked a *question* in class.",lv:0,cefr:"A1"},
  {w:"quick",ph:"/kwɪk/",pos:"adj.",zh:"快速的",ex:"She is a *quick* learner.",lv:0,cefr:"A2"},
  {w:"quickly",ph:"/ˈkwɪkli/",pos:"adv. 副詞",zh:"快速地",ex:"Run *quickly*.",lv:0,cefr:"A2"},
  {w:"quiet",ph:"/ˈkwaɪət/",pos:"adj. 形容詞",zh:"安靜的",ex:"Please be *quiet* in the library.",lv:0,cefr:"A2"},
  {w:"quietly",ph:"/ˈkwaɪətli/",pos:"adv. 副詞",zh:"安靜地",ex:"Speak *quietly*.",lv:0,cefr:"A2"},
  {w:"quiz",ph:"/kwɪz/",pos:"n. 名詞",zh:"小考；測驗",ex:"We have a *quiz* today.",lv:0,cefr:"A2"},
  {w:"rabbit",ph:"/ˈræbɪt/",pos:"n. 名詞",zh:"兔子",ex:"The *rabbit* is very cute.",lv:0,cefr:"A1"},
  {w:"race",ph:"nan",pos:"n.",zh:"比賽",ex:"I won the *race*.",lv:0,cefr:"A2"},
  {w:"rain",ph:"/reɪn/",pos:"n.",zh:"雨",ex:"It started to *rain* heavily.",lv:0,cefr:"A1"},
  {w:"rainbow",ph:"/ˈreɪnboʊ/",pos:"n. 名詞",zh:"彩虹",ex:"A *rainbow* appeared after the rain.",lv:0,cefr:"A1"},
  {w:"raise",ph:"/reɪz/",pos:"v. 動詞",zh:"舉起",ex:"Please *raise* your hand.",lv:0,cefr:"A2"},
  {w:"rational",ph:"/ˈræʃənəl/",pos:"adj. 形容詞",zh:"理性的",ex:"We need a *rational* approach to solve this.",lv:2,cefr:"B2"},
  {w:"reach",ph:"/riːtʃ/",pos:"v. 動詞",zh:"到達",ex:"We finally *reach* the top of the hill.",lv:0,cefr:"A2"},
  {w:"react",ph:"/riˈækt/",pos:"v. 動詞",zh:"反應",ex:"How did she *react*?",lv:1,cefr:"B1"},
  {w:"read",ph:"/riːd/",pos:"v. 動詞",zh:"閱讀",ex:"She *reads* for thirty minutes every night.",lv:0,cefr:"A1"},
  {w:"reading",ph:"/ˈriːdɪŋ/",pos:"n. 名詞",zh:"閱讀",ex:"*Reading* is important.",lv:0,cefr:"A1"},
  {w:"ready",ph:"/ˈrɛdi/",pos:"adj. 形容詞",zh:"準備好的",ex:"Are you *ready* for the test?",lv:0,cefr:"A2"},
  {w:"real",ph:"/riːl/",pos:"adj. 形容詞",zh:"真實的",ex:"Is this a *real* diamond?",lv:0,cefr:"A2"},
  {w:"realize",ph:"/ˈrɪəlaɪz/",pos:"v. 動詞",zh:"意識到",ex:"I did not *realize* how late it was.",lv:1,cefr:"B1"},
  {w:"reason",ph:"/ˈriːzən/",pos:"n. 名詞",zh:"原因",ex:"What is the *reason* for your absence?",lv:0,cefr:"B1"},
  {w:"receive",ph:"/rɪˈsiːv/",pos:"v. 動詞",zh:"接受",ex:"She *received* a letter from her friend.",lv:0,cefr:"B1"},
  {w:"recent",ph:"/ˈriːsənt/",pos:"adj. 形容詞",zh:"最近的",ex:"*Recent* news is shocking.",lv:1,cefr:"B1"},
  {w:"recently",ph:"/ˈriːsəntli/",pos:"adv.",zh:"最近",ex:"She *recently* moved.",lv:1,cefr:"B1"},
  {w:"recognize",ph:"/ˈrɛkəɡnaɪz/",pos:"v. 動詞",zh:"認出；承認",ex:"She *recognized* him.",lv:1,cefr:"B1"},
  {w:"recommend",ph:"/ˌrɛkəˈmɛnd/",pos:"v. 動詞",zh:"推薦",ex:"Can you *recommend* a good book?",lv:1,cefr:"B1"},
  {w:"record",ph:"/rɪˈkɔːrd/",pos:"v. 動詞",zh:"錄音；記錄",ex:"*Record* the video.",lv:0,cefr:"A2"},
  {w:"recover",ph:"/rɪˈkʌvər/",pos:"v. 動詞",zh:"恢復",ex:"She *recovered* from her illness quickly.",lv:1,cefr:"B1"},
  {w:"rectangle",ph:"/ˈrɛktæŋɡəl/",pos:"n. 名詞",zh:"長方形",ex:"This is a *rectangle*.",lv:0,cefr:"A1"},
  {w:"recycle",ph:"nan",pos:"v.",zh:"回收",ex:"Please *recycle* paper.",lv:1,cefr:"B1"},
  {w:"red",ph:"/rɛd/",pos:"adj.",zh:"紅色的",ex:"A *red* dress.",lv:0,cefr:"A1"},
  {w:"reduce",ph:"/rɪˈdjuːs/",pos:"v. 動詞",zh:"減少",ex:"We should *reduce* our use of plastic.",lv:1,cefr:"B1"},
  {w:"reflect",ph:"/rɪˈflɛkt/",pos:"v. 動詞",zh:"反映",ex:"Take time to *reflect* on what you learned.",lv:1,cefr:"B2"},
  {w:"refrigerator",ph:"nan",pos:"n.",zh:"冰箱",ex:"Put it in the *refrigerator*.",lv:0,cefr:"A2"},
  {w:"refuse",ph:"/rɪˈfjuːz/",pos:"v. 動詞",zh:"拒絕",ex:"She *refused* to give up.",lv:1,cefr:"B1"},
  {w:"reinforce",ph:"/ˌriːɪnˈfɔːrs/",pos:"v. 動詞",zh:"強化",ex:"Practice helps to *reinforce* learning.",lv:2,cefr:"B2"},
  {w:"relationship",ph:"/rɪˈleɪʃənʃɪp/",pos:"n. 名詞",zh:"關係",ex:"They have a strong *relationship*.",lv:1,cefr:"B1"},
  {w:"relax",ph:"/rɪˈlæks/",pos:"v. 動詞",zh:"放鬆",ex:"*Relax* and enjoy.",lv:0,cefr:"A2"},
  {w:"relevant",ph:"/ˈrɛlɪvənt/",pos:"adj. 形容詞",zh:"相關的",ex:"Please only give *relevant* information.",lv:2,cefr:"B2"},
  {w:"reluctant",ph:"/rɪˈlʌktənt/",pos:"adj. 形容詞",zh:"不情願的",ex:"She was *reluctant* to speak in public.",lv:2,cefr:"B2"},
  {w:"rely",ph:"/rɪˈlaɪ/",pos:"v. 動詞",zh:"依靠",ex:"You can *rely* on me.",lv:1,cefr:"B2"},
  {w:"remember",ph:"/rɪˈmɛmbər/",pos:"v. 動詞",zh:"記得",ex:"Do you *remember* my name?",lv:0,cefr:"A2"},
  {w:"rent",ph:"/rɛnt/",pos:"v. 動詞",zh:"租借",ex:"They *rent* an apartment.",lv:0,cefr:"A2"},
  {w:"repair",ph:"/rɪˈpɛr/",pos:"v. 動詞",zh:"修理",ex:"*Repair* the machine.",lv:0,cefr:"A2"},
  {w:"repeat",ph:"/rɪˈpiːt/",pos:"v. 動詞",zh:"重複",ex:"Could you *repeat* that, please?",lv:0,cefr:"A2"},
  {w:"replace",ph:"/rɪˈpleɪs/",pos:"v. 動詞",zh:"取代；替換",ex:"*Replace* the old one.",lv:1,cefr:"B1"},
  {w:"report",ph:"/rɪˈpɔːrt/",pos:"n.",zh:"報告",ex:"She wrote a book *report*.",lv:0,cefr:"B1"},
  {w:"require",ph:"/rɪˈkwaɪər/",pos:"v. 動詞",zh:"需要",ex:"This job *requires* good communication skills.",lv:1,cefr:"B1"},
  {w:"research",ph:"/rɪˈsɜːtʃ/",pos:"n.",zh:"研究",ex:"Scientists do *research* on many topics.",lv:1,cefr:"B1"},
  {w:"resolution",ph:"/ˌrɛzəˈluːʃən/",pos:"n. 名詞",zh:"決心",ex:"The conflict reached a *resolution*.",lv:2,cefr:"B2"},
  {w:"resolve",ph:"/rɪˈzɒlv/",pos:"v.",zh:"解決",ex:"We need to *resolve* this conflict.",lv:2,cefr:"B2"},
  {w:"resource",ph:"/rɪˈzɔːs/",pos:"n. 名詞",zh:"資源",ex:"Water is a precious *resource*.",lv:1,cefr:"B1"},
  {w:"respect",ph:"/rɪˈspɛkt/",pos:"v.",zh:"尊重",ex:"We should *respect* different opinions.",lv:1,cefr:"B1"},
  {w:"respond",ph:"/rɪˈspɒnd/",pos:"v. 動詞",zh:"回應",ex:"Please *respond* to the email.",lv:1,cefr:"B1"},
  {w:"responsibility",ph:"/rɪˌspɒnsɪˈbɪlɪti/",pos:"n. 名詞",zh:"責任",ex:"It is our *responsibility* to keep the school clean.",lv:1,cefr:"B1"},
  {w:"responsible",ph:"/rɪˈspɒnsɪbəl/",pos:"adj. 形容詞",zh:"負責任的",ex:"Be *responsible*.",lv:1,cefr:"B1"},
  {w:"rest",ph:"/rɛst/",pos:"v.",zh:"休息",ex:"You need to *rest* after the race.",lv:0,cefr:"A2"},
  {w:"restaurant",ph:"/ˈrɛstərɒnt/",pos:"n. 名詞",zh:"餐廳",ex:"Let's eat at a *restaurant*.",lv:0,cefr:"A2"},
  {w:"result",ph:"/rɪˈzʌlt/",pos:"n. 名詞",zh:"結果",ex:"The *result* of the test surprised everyone.",lv:0,cefr:"B1"},
  {w:"return",ph:"nan",pos:"v.",zh:"返回",ex:"*return* the book by Friday.",lv:0,cefr:"A2"},
  {w:"reveal",ph:"/rɪˈviːl/",pos:"v. 動詞",zh:"揭露",ex:"The test results *revealed* the truth.",lv:1,cefr:"B2"},
  {w:"review",ph:"/rɪˈvjuː/",pos:"n.",zh:"複習",ex:"*review* your notes before the exam.",lv:1,cefr:"B1"},
  {w:"revise",ph:"/rɪˈvaɪz/",pos:"v. 動詞",zh:"修改",ex:"Please *revise* your essay before submitting.",lv:2,cefr:"B2"},
  {w:"reward",ph:"/rɪˈwɔːd/",pos:"n.",zh:"獎勵",ex:"Hard work brings its own *reward*.",lv:1,cefr:"B1"},
  {w:"rhetoric",ph:"/ˈrɛtərɪk/",pos:"n. 名詞",zh:"修辭",ex:"Politicians often use powerful *rhetoric*.",lv:2,cefr:"C1"},
  {w:"rice",ph:"/raɪs/",pos:"n.",zh:"米飯",ex:"We eat *rice* daily.",lv:0,cefr:"A1"},
  {w:"rich",ph:"/rɪtʃ/",pos:"adj.",zh:"富有的",ex:"A *rich* family.",lv:0,cefr:"A2"},
  {w:"ride",ph:"/raɪd/",pos:"v.",zh:"騎",ex:"She *rides* her bike to school.",lv:0,cefr:"A2"},
  {w:"right",ph:"/raɪt/",pos:"adj.",zh:"正確的",ex:"Turn *right* at the corner.",lv:0,cefr:"A2"},
  {w:"rigorous",ph:"/ˈrɪɡərəs/",pos:"adj. 形容詞",zh:"嚴格的",ex:"The program is *rigorous* but rewarding.",lv:2,cefr:"B2"},
  {w:"ring",ph:"/rɪŋ/",pos:"v.",zh:"響",ex:"The phone started to *ring*.",lv:0,cefr:"A2"},
  {w:"risk",ph:"/rɪsk/",pos:"n. 名詞",zh:"風險",ex:"Take a *risk*.",lv:1,cefr:"B1"},
  {w:"river",ph:"/ˈrɪvər/",pos:"n. 名詞",zh:"河流",ex:"She swam in the *river*.",lv:0,cefr:"A2"},
  {w:"road",ph:"/rəʊd/",pos:"n. 名詞",zh:"道路",ex:"Be careful when crossing the *road*.",lv:0,cefr:"A2"},
  {w:"robot",ph:"/ˈroʊbɒt/",pos:"n. 名詞",zh:"機器人",ex:"*Robots* do many jobs.",lv:1,cefr:"B1"},
  {w:"rock",ph:"/rɒk/",pos:"n. 名詞",zh:"岩石",ex:"She sat on a big *rock*.",lv:0,cefr:"A1"},
  {w:"rocket",ph:"/ˈrɒkɪt/",pos:"n. 名詞",zh:"火箭",ex:"A *rocket* flew to space.",lv:0,cefr:"A2"},
  {w:"role",ph:"/rəʊl/",pos:"n. 名詞",zh:"角色",ex:"She plays a key *role* in the project.",lv:1,cefr:"B1"},
  {w:"roof",ph:"nan",pos:"n.",zh:"屋頂",ex:"The *roof* is leaking.",lv:0,cefr:"A2"},
  {w:"room",ph:"/ruːm/",pos:"n. 名詞",zh:"房間",ex:"Her *room* is very tidy.",lv:0,cefr:"A1"},
  {w:"root",ph:"/ruːt/",pos:"n. 名詞",zh:"根；根源",ex:"The tree has deep *roots*.",lv:0,cefr:"A2"},
  {w:"rose",ph:"/roʊz/",pos:"n. 名詞",zh:"玫瑰",ex:"She got a red *rose*.",lv:0,cefr:"A1"},
  {w:"rough",ph:"/rʌf/",pos:"adj. 形容詞",zh:"粗糙的",ex:"The rock is *rough*.",lv:0,cefr:"A2"},
  {w:"round",ph:"/raʊnd/",pos:"adj. 形容詞",zh:"圓的",ex:"The table is *round*.",lv:0,cefr:"A1"},
  {w:"row",ph:"nan",pos:"n.",zh:"排",ex:"Sit in the front *row*.",lv:0,cefr:"A2"},
  {w:"rude",ph:"/ruːd/",pos:"adj. 形容詞",zh:"無禮的",ex:"Don't be *rude*.",lv:0,cefr:"A2"},
  {w:"rule",ph:"/ruːl/",pos:"n.",zh:"規則",ex:"Please follow the *rules*.",lv:0,cefr:"B1"},
  {w:"ruler",ph:"/ˈruːlər/",pos:"n. 名詞",zh:"尺",ex:"Use a *ruler* to draw a line.",lv:0,cefr:"A1"},
  {w:"run",ph:"/rʌn/",pos:"v.",zh:"跑",ex:"She *runs* five kilometers every morning.",lv:0,cefr:"A1"},
  {w:"rush",ph:"/rʌʃ/",pos:"v. 動詞",zh:"衝；急忙",ex:"Don't *rush*.",lv:0,cefr:"A2"},
  {w:"sad",ph:"/sæd/",pos:"adj. 形容詞",zh:"悲傷的",ex:"She felt *sad*.",lv:0,cefr:"A1"},
  {w:"safe",ph:"/seɪf/",pos:"adj. 形容詞",zh:"安全的",ex:"It is *safe* to walk here.",lv:0,cefr:"A2"},
  {w:"salad",ph:"/ˈsæləd/",pos:"n. 名詞",zh:"沙拉",ex:"She had a *salad* for lunch.",lv:0,cefr:"A2"},
  {w:"salt",ph:"nan",pos:"n.",zh:"鹽",ex:"Add *salt* to taste.",lv:0,cefr:"A1"},
  {w:"salty",ph:"/ˈsɔːlti/",pos:"adj. 形容詞",zh:"鹹的",ex:"This soup is *salty*.",lv:0,cefr:"A2"},
  {w:"same",ph:"/seɪm/",pos:"adj.",zh:"相同的",ex:"The *same* birthday.",lv:0,cefr:"A2"},
  {w:"sand",ph:"/sænd/",pos:"n. 名詞",zh:"沙子",ex:"We played on the *sand*.",lv:0,cefr:"A1"},
  {w:"sandwich",ph:"nan",pos:"n.",zh:"三明治",ex:"I had a cheese *sandwich*.",lv:0,cefr:"A1"},
  {w:"satisfaction",ph:"/ˌsætɪsˈfækʃən/",pos:"n.",zh:"滿意",ex:"Great *satisfaction*.",lv:2,cefr:"B2"},
  {w:"satisfy",ph:"/ˈsætɪsfaɪ/",pos:"v. 動詞",zh:"滿足",ex:"The answer did not *satisfy* her.",lv:1,cefr:"B1"},
  {w:"Saturday",ph:"/ˈsætərdeɪ/",pos:"n. 名詞",zh:"星期六",ex:"We play sports on *Saturday*.",lv:0,cefr:"A1"},
  {w:"save",ph:"/seɪv/",pos:"v. 動詞",zh:"拯救",ex:"We should *save* water.",lv:0,cefr:"A2"},
  {w:"savings",ph:"/ˈseɪvɪŋz/",pos:"n. 名詞",zh:"儲蓄",ex:"Use your *savings*.",lv:1,cefr:"B1"},
  {w:"scared",ph:"/skɛrd/",pos:"adj. 形容詞",zh:"害怕的",ex:"She was *scared* of dogs.",lv:0,cefr:"A1"},
  {w:"scarf",ph:"/skɑːrf/",pos:"n. 名詞",zh:"圍巾",ex:"She wrapped a *scarf* around her neck.",lv:0,cefr:"A1"},
  {w:"scary",ph:"/ˈskɛːri/",pos:"adj. 形容詞",zh:"可怕的",ex:"The movie was very *scary*.",lv:0,cefr:"A2"},
  {w:"scene",ph:"/siːn/",pos:"n.",zh:"場景",ex:"A beautiful *scene*.",lv:1,cefr:"B1"},
  {w:"schedule",ph:"/ˈʃɛdjuːl/",pos:"n.",zh:"時間表",ex:"Check the *schedule* for today.",lv:1,cefr:"B1"},
  {w:"school",ph:"/skuːl/",pos:"n. 名詞",zh:"學校",ex:"She loves going to *school*.",lv:0,cefr:"A1"},
  {w:"science",ph:"/ˈsaɪəns/",pos:"n. 名詞",zh:"科學",ex:"She is interested in *science*.",lv:0,cefr:"A2"},
  {w:"scientist",ph:"/ˈsaɪəntɪst/",pos:"n. 名詞",zh:"科學家",ex:"She wants to be a *scientist*.",lv:1,cefr:"B1"},
  {w:"scissors",ph:"/ˈsɪzərz/",pos:"n. 名詞",zh:"剪刀",ex:"Cut with *scissors*.",lv:0,cefr:"A1"},
  {w:"scooter",ph:"/ˈskuːtər/",pos:"n. 名詞",zh:"機踏車",ex:"She rides a *scooter*.",lv:0,cefr:"A2"},
  {w:"score",ph:"/skɔːr/",pos:"n. 名詞",zh:"分數",ex:"Her *score* was perfect.",lv:0,cefr:"A2"},
  {w:"screen",ph:"/skriːn/",pos:"n. 名詞",zh:"螢幕；銀幕",ex:"Look at the *screen*.",lv:0,cefr:"A2"},
  {w:"scrutinize",ph:"/ˈskruːtɪnaɪz/",pos:"v.",zh:"細查",ex:"*Scrutinize* the evidence.",lv:2,cefr:"C1"},
  {w:"scrutiny",ph:"/ˈskruːtɪni/",pos:"n. 名詞",zh:"仔細審查",ex:"His decisions came under public *scrutiny*.",lv:2,cefr:"B2"},
  {w:"sea",ph:"/siː/",pos:"n. 名詞",zh:"海",ex:"She loves swimming in the *sea*.",lv:0,cefr:"A2"},
  {w:"search",ph:"/sɜːrtʃ/",pos:"v. 動詞",zh:"搜尋",ex:"*Search* for the answer.",lv:0,cefr:"A2"},
  {w:"season",ph:"/ˈsiːzən/",pos:"n. 名詞",zh:"季節",ex:"Spring is her favorite *season*.",lv:0,cefr:"A2"},
  {w:"seat",ph:"/siːt/",pos:"n.",zh:"座位",ex:"Please take a *seat*.",lv:0,cefr:"A2"},
  {w:"second",ph:"/ˈsɛkənd/",pos:"adj. 形容詞",zh:"第二的",ex:"She was *second* in the race.",lv:0,cefr:"A2"},
  {w:"secret",ph:"/ˈsiːkrɪt/",pos:"n.",zh:"秘密",ex:"Can you keep a *secret*?",lv:0,cefr:"A2"},
  {w:"seed",ph:"/siːd/",pos:"n. 名詞",zh:"種子",ex:"Plant the *seeds*.",lv:0,cefr:"A2"},
  {w:"seem",ph:"/siːm/",pos:"v. 動詞",zh:"似乎",ex:"She *seems* very tired today.",lv:0,cefr:"A2"},
  {w:"select",ph:"/sɪˈlɛkt/",pos:"v. 動詞",zh:"選擇",ex:"*select* the best answer.",lv:1,cefr:"B1"},
  {w:"selfish",ph:"/ˈsɛlfɪʃ/",pos:"adj. 形容詞",zh:"自私的",ex:"Don't be *selfish*.",lv:1,cefr:"B1"},
  {w:"sell",ph:"/sɛl/",pos:"v. 動詞",zh:"賣",ex:"She *sells* handmade bracelets online.",lv:0,cefr:"A2"},
  {w:"semester",ph:"/sɪˈmɛstər/",pos:"n. 名詞",zh:"學期",ex:"This is the second *semester*.",lv:0,cefr:"A2"},
  {w:"send",ph:"/sɛnd/",pos:"v. 動詞",zh:"寄",ex:"She sent an email to her teacher.",lv:0,cefr:"A2"},
  {w:"sense",ph:"/sɛns/",pos:"n.",zh:"感覺",ex:"Makes good *sense*.",lv:1,cefr:"B1"},
  {w:"sentence",ph:"/ˈsɛntəns/",pos:"n. 名詞",zh:"句子",ex:"Please translate this *sentence*.",lv:0,cefr:"A2"},
  {w:"separate",ph:"/ˈsɛpərɪt/",pos:"v.",zh:"分開",ex:"Keep foods *separate*.",lv:1,cefr:"B1"},
  {w:"September",ph:"/sɛpˈtɛmbər/",pos:"n. 名詞",zh:"九月",ex:"School starts in *September*.",lv:0,cefr:"A1"},
  {w:"serious",ph:"/ˈsɪərɪəs/",pos:"adj. 形容詞",zh:"嚴肅的",ex:"This is a *serious* problem.",lv:0,cefr:"B1"},
  {w:"serve",ph:"/sɜːrv/",pos:"v. 動詞",zh:"服務；提供",ex:"She *serves* in the army.",lv:1,cefr:"B1"},
  {w:"service",ph:"/ˈsɜːrvɪs/",pos:"n.",zh:"服務",ex:"Excellent *service*.",lv:1,cefr:"B1"},
  {w:"seven",ph:"/ˈsɛvən/",pos:"num. 數詞",zh:"七",ex:"There are *seven* days in a week.",lv:0,cefr:"A1"},
  {w:"seventeen",ph:"/ˌsɛvənˈtiːn/",pos:"num. 數詞",zh:"十七",ex:"He is *seventeen*.",lv:0,cefr:"A1"},
  {w:"seventh",ph:"/ˈsɛvənθ/",pos:"adj. 形容詞",zh:"第七",ex:"She is the *seventh*.",lv:0,cefr:"A1"},
  {w:"seventy",ph:"/ˈsɛvənti/",pos:"num. 數詞",zh:"七十",ex:"He scored *seventy* points.",lv:0,cefr:"A1"},
  {w:"several",ph:"/ˈsɛvərəl/",pos:"adj. 形容詞",zh:"幾個的",ex:"*Several* people came.",lv:0,cefr:"A2"},
  {w:"shadow",ph:"/ˈʃædoʊ/",pos:"n. 名詞",zh:"影子；陰影",ex:"She saw her *shadow*.",lv:0,cefr:"A2"},
  {w:"shake",ph:"/ʃeɪk/",pos:"v.",zh:"搖",ex:"She shook her head.",lv:0,cefr:"A2"},
  {w:"shake hands",ph:"/ˈʃeɪk hændz/",pos:"v. 動詞",zh:"握手",ex:"They shook hands.",lv:0,cefr:"A2"},
  {w:"share",ph:"/ʃɛr/",pos:"v. 動詞",zh:"分享",ex:"Please *share* your ideas with the class.",lv:0,cefr:"A2"},
  {w:"shark",ph:"/ʃɑːrk/",pos:"n. 名詞",zh:"鯊魚",ex:"A *shark* swam by.",lv:0,cefr:"A2"},
  {w:"sharp",ph:"/ʃɑːrp/",pos:"adj. 形容詞",zh:"鋒利的；敏銳的",ex:"The knife is *sharp*.",lv:0,cefr:"A2"},
  {w:"sheep",ph:"/ʃiːp/",pos:"n. 名詞",zh:"羊",ex:"She saw *sheep* on the hill.",lv:0,cefr:"A1"},
  {w:"shelf",ph:"nan",pos:"n.",zh:"架子",ex:"Put it on the *shelf*.",lv:0,cefr:"A2"},
  {w:"ship",ph:"nan",pos:"n.",zh:"船",ex:"We sailed on a big *ship*.",lv:0,cefr:"A2"},
  {w:"shirt",ph:"/ʃɜːrt/",pos:"n. 名詞",zh:"襯衫",ex:"He wears a white *shirt*.",lv:0,cefr:"A1"},
  {w:"shocked",ph:"/ʃɒkt/",pos:"adj. 形容詞",zh:"震驚的",ex:"She was *shocked*.",lv:0,cefr:"A2"},
  {w:"shoe",ph:"/ʃuː/",pos:"n. 名詞",zh:"鞋子",ex:"She bought a new pair of *shoes*.",lv:0,cefr:"A1"},
  {w:"shop",ph:"/ʃɒp/",pos:"v. 動詞",zh:"購物",ex:"She loves to *shop*.",lv:0,cefr:"A2"},
  {w:"shopping mall",ph:"/ˈʃɒpɪŋ mɔːl/",pos:"n. 名詞",zh:"購物中心",ex:"She went to the *shopping mall*.",lv:0,cefr:"A2"},
  {w:"short",ph:"/ʃɔːrt/",pos:"adj. 形容詞",zh:"短的",ex:"She has *short* hair.",lv:0,cefr:"A2"},
  {w:"shoulder",ph:"nan",pos:"n.",zh:"肩膀",ex:"She tapped my *shoulder*.",lv:0,cefr:"A2"},
  {w:"shout",ph:"/ʃaʊt/",pos:"v. 動詞",zh:"大喊",ex:"Don't *shout*.",lv:0,cefr:"A2"},
  {w:"show",ph:"/ʃəʊ/",pos:"v.",zh:"展示",ex:"Let me *show* you the way.",lv:0,cefr:"A1"},
  {w:"shrimp",ph:"/ʃrɪmp/",pos:"n. 名詞",zh:"蝦子",ex:"She grilled *shrimp*.",lv:0,cefr:"A2"},
  {w:"shy",ph:"/ʃaɪ/",pos:"adj. 形容詞",zh:"害羞的",ex:"She is *shy*.",lv:0,cefr:"A2"},
  {w:"sick",ph:"/sɪk/",pos:"adj. 形容詞",zh:"生病的",ex:"She felt *sick* after eating too much.",lv:0,cefr:"A2"},
  {w:"side",ph:"nan",pos:"n.",zh:"旁邊",ex:"Stand to the *side*.",lv:0,cefr:"A2"},
  {w:"sign",ph:"/saɪn/",pos:"n.",zh:"標誌",ex:"Follow the *signs*.",lv:0,cefr:"A2"},
  {w:"significant",ph:"/sɪɡˈnɪfɪkənt/",pos:"adj. 形容詞",zh:"重要的",ex:"This is a *significant* discovery.",lv:1,cefr:"B2"},
  {w:"silly",ph:"nan",pos:"adj.",zh:"傻的",ex:"Do not be *silly*.",lv:0,cefr:"A2"},
  {w:"silver",ph:"/ˈsɪlvər/",pos:"adj. 形容詞",zh:"銀色的",ex:"She has a *silver* necklace.",lv:0,cefr:"A2"},
  {w:"similar",ph:"/ˈsɪmɪlər/",pos:"adj. 形容詞",zh:"相似的",ex:"The two paintings are *similar*.",lv:1,cefr:"B1"},
  {w:"simple",ph:"/ˈsɪmpəl/",pos:"adj. 形容詞",zh:"簡單的",ex:"The rules are very *simple*.",lv:0,cefr:"A2"},
  {w:"since",ph:"nan",pos:"prep.",zh:"自從",ex:"I have known her *since* childhood.",lv:0,cefr:"A2"},
  {w:"sing",ph:"/sɪŋ/",pos:"v. 動詞",zh:"唱歌",ex:"She *sings* beautifully.",lv:0,cefr:"A1"},
  {w:"sister",ph:"/ˈsɪstər/",pos:"n. 名詞",zh:"姐妹",ex:"Her *sister* is in college.",lv:0,cefr:"A1"},
  {w:"sit",ph:"/sɪt/",pos:"v. 動詞",zh:"坐",ex:"Please *sit* down.",lv:0,cefr:"A1"},
  {w:"situation",ph:"/ˌsɪtʃuˈeɪʃən/",pos:"n.",zh:"情況",ex:"A difficult *situation*.",lv:1,cefr:"B1"},
  {w:"six",ph:"/sɪks/",pos:"num. 數詞",zh:"六",ex:"She is *six* years old.",lv:0,cefr:"A1"},
  {w:"sixteen",ph:"/ˌsɪksˈtiːn/",pos:"num. 數詞",zh:"十六",ex:"She turned *sixteen*.",lv:0,cefr:"A1"},
  {w:"sixth",ph:"/sɪksθ/",pos:"adj. 形容詞",zh:"第六",ex:"Today is the *sixth*.",lv:0,cefr:"A1"},
  {w:"sixty",ph:"/ˈsɪksti/",pos:"num. 數詞",zh:"六十",ex:"It costs *sixty* dollars.",lv:0,cefr:"A1"},
  {w:"size",ph:"/saɪz/",pos:"n. 名詞",zh:"尺寸",ex:"What *size* is this shirt?",lv:0,cefr:"A2"},
  {w:"skeptical",ph:"/ˈskɛptɪkəl/",pos:"adj. 形容詞",zh:"持懷疑態度的",ex:"She was *skeptical* about the new plan.",lv:2,cefr:"B2"},
  {w:"skiing",ph:"/ˈskiːɪŋ/",pos:"n. 名詞",zh:"滑雪",ex:"She loves *skiing*.",lv:0,cefr:"A2"},
  {w:"skill",ph:"/skɪl/",pos:"n.",zh:"技能",ex:"Good *skills*.",lv:1,cefr:"B1"},
  {w:"skin",ph:"nan",pos:"n.",zh:"皮膚",ex:"Protect your *skin*.",lv:0,cefr:"A2"},
  {w:"skirt",ph:"/skɜːrt/",pos:"n. 名詞",zh:"裙子",ex:"She wore a short *skirt*.",lv:0,cefr:"A1"},
  {w:"sky",ph:"/skaɪ/",pos:"n. 名詞",zh:"天空",ex:"The *sky* is clear and blue today.",lv:0,cefr:"A1"},
  {w:"sleep",ph:"/sliːp/",pos:"v.",zh:"睡覺",ex:"She needs eight hours of *sleep*.",lv:0,cefr:"A1"},
  {w:"slim",ph:"/slɪm/",pos:"adj. 形容詞",zh:"苗條的",ex:"She is *slim*.",lv:0,cefr:"A2"},
  {w:"slow",ph:"/sləʊ/",pos:"adj.",zh:"慢的",ex:"The traffic is very *slow* today.",lv:0,cefr:"A2"},
  {w:"small",ph:"/smɔːl/",pos:"adj. 形容詞",zh:"小的",ex:"She has a *small* dog.",lv:0,cefr:"A1"},
  {w:"smart",ph:"/smɑːrt/",pos:"adj. 形容詞",zh:"聰明的",ex:"She is a *smart* and hardworking student.",lv:0,cefr:"A2"},
  {w:"smartphone",ph:"/ˈsmɑːrtfoʊn/",pos:"n. 名詞",zh:"智慧型手機",ex:"She checks her *smartphone*.",lv:0,cefr:"A2"},
  {w:"smell",ph:"/smɛl/",pos:"v.",zh:"聞",ex:"Flowers *smell* nice.",lv:0,cefr:"A2"},
  {w:"smile",ph:"/smaɪl/",pos:"v.",zh:"微笑",ex:"She always *smiles* at everyone.",lv:0,cefr:"A2"},
  {w:"smoke",ph:"nan",pos:"n.",zh:"煙",ex:"Do not *smoke* here.",lv:0,cefr:"A2"},
  {w:"smooth",ph:"/smuːð/",pos:"adj. 形容詞",zh:"平滑的",ex:"The surface is *smooth*.",lv:0,cefr:"A2"},
  {w:"snack",ph:"/snæk/",pos:"n. 名詞",zh:"零食；點心",ex:"She ate a *snack*.",lv:0,cefr:"A2"},
  {w:"snake",ph:"/sneɪk/",pos:"n. 名詞",zh:"蛇",ex:"The *snake* slithered away.",lv:0,cefr:"A1"},
  {w:"sneeze",ph:"/sniːz/",pos:"v. 動詞",zh:"打噴嚏",ex:"She *sneezed* three times.",lv:0,cefr:"A2"},
  {w:"snow",ph:"/snəʊ/",pos:"n.",zh:"雪",ex:"It started to *snow* last night.",lv:0,cefr:"A1"},
  {w:"soccer",ph:"nan",pos:"n.",zh:"足球",ex:"I play *soccer* on weekends.",lv:0,cefr:"A1"},
  {w:"social",ph:"/ˈsoʊʃəl/",pos:"adj.",zh:"社會的",ex:"*Social* media.",lv:1,cefr:"B1"},
  {w:"social media",ph:"/ˈsoʊʃəl ˈmiːdiə/",pos:"n. 名詞",zh:"社群媒體",ex:"She uses *social media* a lot.",lv:1,cefr:"B1"},
  {w:"society",ph:"/səˈsaɪəti/",pos:"n. 名詞",zh:"社會",ex:"Everyone has a role to play in *society*.",lv:1,cefr:"B1"},
  {w:"sock",ph:"/sɒk/",pos:"n. 名詞",zh:"短襪",ex:"Where is my other *sock*?",lv:0,cefr:"A1"},
  {w:"sofa",ph:"nan",pos:"n.",zh:"沙發",ex:"Sit on the *sofa*.",lv:0,cefr:"A1"},
  {w:"soft",ph:"/sɒft/",pos:"adj. 形容詞",zh:"軟的",ex:"The kitten has *soft* fur.",lv:0,cefr:"A2"},
  {w:"soil",ph:"/sɔɪl/",pos:"n. 名詞",zh:"土壤",ex:"The *soil* is rich.",lv:1,cefr:"B1"},
  {w:"soldier",ph:"/ˈsoʊldʒər/",pos:"n. 名詞",zh:"士兵",ex:"He became a *soldier*.",lv:1,cefr:"B1"},
  {w:"solution",ph:"/səˈluːʃən/",pos:"n. 名詞",zh:"解決方法",ex:"We need to find a *solution* to this problem.",lv:1,cefr:"B1"},
  {w:"solve",ph:"/sɒlv/",pos:"v. 動詞",zh:"解決",ex:"Can you *solve* this puzzle?",lv:0,cefr:"B1"},
  {w:"some",ph:"/sʌm/",pos:"det.",zh:"一些",ex:"I need *some* water.",lv:0,cefr:"A1"},
  {w:"somebody",ph:"nan",pos:"pron.",zh:"某人",ex:"*somebody* called for you.",lv:0,cefr:"A2"},
  {w:"sometimes",ph:"/ˈsʌmtaɪmz/",pos:"adv. 副詞",zh:"有時候",ex:"*sometimes* she walks to school.",lv:0,cefr:"A2"},
  {w:"son",ph:"/sʌn/",pos:"n. 名詞",zh:"兒子",ex:"Her *son* is five years old.",lv:0,cefr:"A2"},
  {w:"song",ph:"/sɒŋ/",pos:"n. 名詞",zh:"歌曲",ex:"She sang a *song* at the talent show.",lv:0,cefr:"A2"},
  {w:"soon",ph:"/suːn/",pos:"adv. 副詞",zh:"很快地",ex:"Dinner will be ready *soon*.",lv:0,cefr:"A2"},
  {w:"sophisticated",ph:"/səˈfɪstɪkeɪtɪd/",pos:"adj. 形容詞",zh:"複雜的",ex:"The system is highly *sophisticated*.",lv:2,cefr:"C1"},
  {w:"sore",ph:"/sɔːr/",pos:"adj. 形容詞",zh:"疼痛的",ex:"My throat is *sore*.",lv:0,cefr:"A2"},
  {w:"sorry",ph:"/ˈsɒri/",pos:"adj. 形容詞",zh:"抱歉的",ex:"She said she was *sorry*.",lv:0,cefr:"A1"},
  {w:"sound",ph:"/saʊnd/",pos:"n. 名詞",zh:"聲音",ex:"What was that *sound*?",lv:0,cefr:"A2"},
  {w:"soup",ph:"/suːp/",pos:"n. 名詞",zh:"湯",ex:"She cooked a pot of chicken *soup*.",lv:0,cefr:"A2"},
  {w:"sour",ph:"/saʊər/",pos:"adj. 形容詞",zh:"酸的",ex:"The lemon is *sour*.",lv:0,cefr:"A1"},
  {w:"south",ph:"nan",pos:"n.",zh:"南方",ex:"Head *south* on the highway.",lv:0,cefr:"A1"},
  {w:"space",ph:"nan",pos:"n.",zh:"太空",ex:"There is no *space* left.",lv:1,cefr:"B1"},
  {w:"spaghetti",ph:"/spəˈɡɛti/",pos:"n. 名詞",zh:"義大利麵",ex:"She loves *spaghetti*.",lv:0,cefr:"A2"},
  {w:"speak",ph:"/spiːk/",pos:"v. 動詞",zh:"說話",ex:"She can *speak* three languages.",lv:0,cefr:"A1"},
  {w:"speaker",ph:"/ˈspiːkər/",pos:"n. 名詞",zh:"喇叭；演講者",ex:"Turn up the *speaker*.",lv:0,cefr:"A2"},
  {w:"special",ph:"/ˈspɛʃəl/",pos:"adj. 形容詞",zh:"特別的",ex:"Today is a very *special* day.",lv:0,cefr:"A2"},
  {w:"specific",ph:"/spɪˈsɪfɪk/",pos:"adj. 形容詞",zh:"具體的",ex:"Give me a *specific* example.",lv:1,cefr:"B1"},
  {w:"speech",ph:"/spiːtʃ/",pos:"n. 名詞",zh:"演講；說話",ex:"She gave a *speech*.",lv:1,cefr:"B1"},
  {w:"speed",ph:"nan",pos:"n.",zh:"速度",ex:"Drive at a safe *speed*.",lv:1,cefr:"B1"},
  {w:"spend",ph:"/spɛnd/",pos:"v. 動詞",zh:"花費",ex:"I *spend* two hours reading each day.",lv:0,cefr:"A2"},
  {w:"spicy",ph:"/ˈspaɪsi/",pos:"adj. 形容詞",zh:"辣的",ex:"This dish is *spicy*.",lv:0,cefr:"A2"},
  {w:"spider",ph:"/ˈspaɪdər/",pos:"n. 名詞",zh:"蜘蛛",ex:"There is a *spider* on the wall.",lv:0,cefr:"A1"},
  {w:"sport",ph:"/spɔːrt/",pos:"n. 名詞",zh:"運動",ex:"She plays many different *sports*.",lv:0,cefr:"A1"},
  {w:"spot",ph:"/spɒt/",pos:"v. 動詞",zh:"發現；認出",ex:"She *spotted* a bird.",lv:1,cefr:"B1"},
  {w:"spread",ph:"/sprɛd/",pos:"v. 動詞",zh:"散布；傳播",ex:"*Spread* good news.",lv:1,cefr:"B1"},
  {w:"spring",ph:"/sprɪŋ/",pos:"n. 名詞",zh:"春天",ex:"*spring* is a beautiful season.",lv:0,cefr:"A2"},
  {w:"square",ph:"/skwɛr/",pos:"adj. 形容詞",zh:"方形的",ex:"A *square* box.",lv:0,cefr:"A1"},
  {w:"squirrel",ph:"/ˈskwɪrəl/",pos:"n. 名詞",zh:"松鼠",ex:"The *squirrel* collected nuts.",lv:0,cefr:"A2"},
  {w:"stable",ph:"/ˈsteɪbəl/",pos:"adj. 形容詞",zh:"穩定的",ex:"The economy is *stable*.",lv:2,cefr:"B2"},
  {w:"stadium",ph:"/ˈsteɪdiəm/",pos:"n. 名詞",zh:"體育場",ex:"We watched the game at the *stadium*.",lv:0,cefr:"A2"},
  {w:"stairs",ph:"nan",pos:"n.",zh:"樓梯",ex:"Take the *stairs*.",lv:0,cefr:"A2"},
  {w:"stamp",ph:"nan",pos:"n.",zh:"郵票",ex:"Put a *stamp* on the envelope.",lv:0,cefr:"A2"},
  {w:"stand",ph:"/stænd/",pos:"v.",zh:"站立",ex:"Please *stand* up.",lv:0,cefr:"A1"},
  {w:"star",ph:"/stɑːr/",pos:"n.",zh:"星星",ex:"I see the *stars*.",lv:0,cefr:"A1"},
  {w:"stare",ph:"/stɛr/",pos:"v. 動詞",zh:"凝視",ex:"Don't *stare*.",lv:0,cefr:"A2"},
  {w:"start",ph:"/stɑːrt/",pos:"v.",zh:"開始",ex:"Let's *start* the meeting now.",lv:0,cefr:"A1"},
  {w:"state",ph:"/steɪt/",pos:"v.",zh:"陳述",ex:"She *stated* her opinion.",lv:1,cefr:"B1"},
  {w:"station",ph:"/ˈsteɪʃən/",pos:"n. 名詞",zh:"車站",ex:"She waited at the train *station*.",lv:0,cefr:"A2"},
  {w:"stay",ph:"/steɪ/",pos:"v.",zh:"停留",ex:"She *stayed* at her friend's house.",lv:0,cefr:"A1"},
  {w:"step",ph:"/stɛp/",pos:"n.",zh:"步驟",ex:"Follow each *step* carefully.",lv:0,cefr:"A2"},
  {w:"still",ph:"/stɪl/",pos:"adv. 副詞",zh:"仍然",ex:"She is *still* studying at midnight.",lv:0,cefr:"A2"},
  {w:"stimulate",ph:"/ˈstɪmjəleɪt/",pos:"v. 動詞",zh:"刺激",ex:"Reading *stimulates* the imagination.",lv:2,cefr:"B2"},
  {w:"stomach",ph:"nan",pos:"n.",zh:"胃",ex:"My *stomach* hurts.",lv:0,cefr:"A2"},
  {w:"stomachache",ph:"/ˈstʌmək eɪk/",pos:"n. 名詞",zh:"胃痛",ex:"I have a *stomachache*.",lv:0,cefr:"A2"},
  {w:"stone",ph:"/stoʊn/",pos:"n. 名詞",zh:"石頭",ex:"He threw a *stone*.",lv:0,cefr:"A1"},
  {w:"stop",ph:"/stɒp/",pos:"v.",zh:"停止",ex:"Please *stop* talking in class.",lv:0,cefr:"A1"},
  {w:"store",ph:"/stɔːr/",pos:"n.",zh:"商店",ex:"She went to the *store* to buy milk.",lv:0,cefr:"A2"},
  {w:"storm",ph:"nan",pos:"n.",zh:"暴風雨",ex:"A *storm* is coming.",lv:0,cefr:"A2"},
  {w:"story",ph:"/ˈstɔːri/",pos:"n. 名詞",zh:"故事",ex:"She tells wonderful stories.",lv:0,cefr:"A2"},
  {w:"stove",ph:"/stoʊv/",pos:"n. 名詞",zh:"爐子",ex:"Cook on the *stove*.",lv:0,cefr:"A2"},
  {w:"straight",ph:"/streɪt/",pos:"adj.",zh:"直的",ex:"Go *straight* ahead.",lv:0,cefr:"A2"},
  {w:"strange",ph:"/streɪndʒ/",pos:"adj. 形容詞",zh:"奇怪的",ex:"She heard a *strange* noise.",lv:0,cefr:"A2"},
  {w:"strategy",ph:"/ˈstrætɪdʒi/",pos:"n. 名詞",zh:"策略",ex:"She developed a strong study *strategy*.",lv:1,cefr:"B2"},
  {w:"strawberry",ph:"nan",pos:"n.",zh:"草莓",ex:"I love *strawberry* ice cream.",lv:0,cefr:"A1"},
  {w:"street",ph:"/striːt/",pos:"n. 名詞",zh:"街道",ex:"She lives on a busy *street*.",lv:0,cefr:"A1"},
  {w:"stress",ph:"nan",pos:"n.",zh:"壓力",ex:"I feel a lot of *stress*.",lv:1,cefr:"B1"},
  {w:"stretch",ph:"/strɛtʃ/",pos:"v. 動詞",zh:"伸展",ex:"*Stretch* your arms.",lv:0,cefr:"A2"},
  {w:"strict",ph:"/strɪkt/",pos:"adj. 形容詞",zh:"嚴格的",ex:"The teacher is *strict*.",lv:1,cefr:"B1"},
  {w:"strong",ph:"/strɒŋ/",pos:"adj. 形容詞",zh:"強壯的",ex:"He is very *strong*.",lv:0,cefr:"A2"},
  {w:"structure",ph:"/ˈstrʌktʃər/",pos:"n. 名詞",zh:"結構",ex:"The essay has a clear *structure*.",lv:1,cefr:"B2"},
  {w:"stuck",ph:"/stʌk/",pos:"adj. 形容詞",zh:"卡住的",ex:"The door is *stuck*.",lv:0,cefr:"A2"},
  {w:"student",ph:"/ˈstjuːdənt/",pos:"n. 名詞",zh:"學生",ex:"She is a hardworking *student*.",lv:0,cefr:"A1"},
  {w:"study",ph:"/ˈstʌdi/",pos:"v.",zh:"學習",ex:"She studies English every evening.",lv:0,cefr:"A1"},
  {w:"stupid",ph:"/ˈstjuːpɪd/",pos:"adj.",zh:"愚蠢的",ex:"Don't be *stupid*.",lv:0,cefr:"A2"},
  {w:"subject",ph:"/ˈsʌbdʒɪkt/",pos:"n. 名詞",zh:"科目",ex:"What is your favorite *subject*?",lv:0,cefr:"B1"},
  {w:"subjective",ph:"/səbˈdʒɛktɪv/",pos:"adj. 形容詞",zh:"主觀的",ex:"Art appreciation is often *subjective*.",lv:2,cefr:"B2"},
  {w:"subordinate",ph:"/səˈbɔːrdɪnɪt/",pos:"adj.",zh:"次要的",ex:"*Subordinate* clauses.",lv:2,cefr:"C1"},
  {w:"substantial",ph:"/səbˈstænʃəl/",pos:"adj. 形容詞",zh:"大量的",ex:"There has been *substantial* progress.",lv:2,cefr:"B2"},
  {w:"subtle",ph:"/ˈsʌtəl/",pos:"adj. 形容詞",zh:"微妙的",ex:"There is a *subtle* difference in meaning.",lv:2,cefr:"B2"},
  {w:"subway",ph:"/ˈsʌbweɪ/",pos:"n. 名詞",zh:"地鐵",ex:"Take the *subway*.",lv:0,cefr:"A2"},
  {w:"succeed",ph:"/səkˈsiːd/",pos:"v. 動詞",zh:"成功",ex:"Work hard and you will *succeed*.",lv:0,cefr:"B1"},
  {w:"success",ph:"/səkˈsɛs/",pos:"n. 名詞",zh:"成功",ex:"Hard work leads to *success*.",lv:1,cefr:"B1"},
  {w:"successful",ph:"/səkˈsɛsfʊl/",pos:"adj. 形容詞",zh:"成功的",ex:"She is a *successful* writer.",lv:1,cefr:"B1"},
  {w:"suddenly",ph:"/ˈsʌdənli/",pos:"adv. 副詞",zh:"突然地",ex:"She *suddenly* appeared.",lv:1,cefr:"B1"},
  {w:"suffer",ph:"/ˈsʌfər/",pos:"v. 動詞",zh:"受苦",ex:"She *suffered* a lot.",lv:1,cefr:"B1"},
  {w:"sufficient",ph:"/səˈfɪʃənt/",pos:"adj. 形容詞",zh:"足夠的",ex:"Is the evidence *sufficient*?",lv:2,cefr:"B2"},
  {w:"sugar",ph:"nan",pos:"n.",zh:"糖",ex:"Add *sugar* to the coffee.",lv:0,cefr:"A1"},
  {w:"suggest",ph:"/səˈdʒɛst/",pos:"v. 動詞",zh:"建議",ex:"I *suggest* we leave early.",lv:0,cefr:"B1"},
  {w:"suggestion",ph:"/səˈdʒɛstʃən/",pos:"n. 名詞",zh:"建議",ex:"Any *suggestions*?",lv:1,cefr:"B1"},
  {w:"summer",ph:"/ˈsʌmər/",pos:"n. 名詞",zh:"夏天",ex:"She loves swimming in *summer*.",lv:0,cefr:"A2"},
  {w:"sun",ph:"/sʌn/",pos:"n. 名詞",zh:"太陽",ex:"The *sun* rises in the east.",lv:0,cefr:"A2"},
  {w:"Sunday",ph:"/ˈsʌndeɪ/",pos:"n. 名詞",zh:"星期日",ex:"We rest on *Sunday*.",lv:0,cefr:"A1"},
  {w:"sunshine",ph:"/ˈsʌnʃaɪn/",pos:"n. 名詞",zh:"陽光",ex:"The *sunshine* feels warm.",lv:0,cefr:"A1"},
  {w:"supermarket",ph:"/ˈsuːpəmɑːrkɪt/",pos:"n. 名詞",zh:"超市",ex:"She shops at the *supermarket* every week.",lv:0,cefr:"A2"},
  {w:"support",ph:"/səˈpɔːrt/",pos:"v.",zh:"支持",ex:"Her family always *supports* her dreams.",lv:1,cefr:"B1"},
  {w:"suppress",ph:"/səˈprɛs/",pos:"v. 動詞",zh:"壓制",ex:"She tried to *suppress* her laughter.",lv:2,cefr:"C1"},
  {w:"sure",ph:"/ʃʊər/",pos:"adj.",zh:"確定的",ex:"Are you *sure* about that?",lv:0,cefr:"A2"},
  {w:"surface",ph:"/ˈsɜːrfɪs/",pos:"n. 名詞",zh:"表面",ex:"Clean the *surface*.",lv:1,cefr:"B1"},
  {w:"surprise",ph:"/sərˈpraɪz/",pos:"n. 名詞",zh:"驚喜",ex:"What a *surprise*!",lv:0,cefr:"A2"},
  {w:"surprised",ph:"/səˈpraɪzd/",pos:"adj. 形容詞",zh:"驚訝的",ex:"She was *surprised* by the gift.",lv:0,cefr:"A2"},
  {w:"survey",ph:"/ˈsɜːveɪ/",pos:"n.",zh:"調查",ex:"The *survey* showed that most students like sports.",lv:1,cefr:"B1"},
  {w:"survive",ph:"/səˈvaɪv/",pos:"v. 動詞",zh:"生存",ex:"Plants cannot *survive* without water.",lv:1,cefr:"B1"},
  {w:"sustain",ph:"/səˈsteɪn/",pos:"v. 動詞",zh:"維持",ex:"How can we *sustain* economic growth?",lv:2,cefr:"B2"},
  {w:"sustainable",ph:"/səˈsteɪnəbəl/",pos:"adj. 形容詞",zh:"可持續的",ex:"*Sustainable* development.",lv:2,cefr:"B2"},
  {w:"swear",ph:"/swɛr/",pos:"v. 動詞",zh:"發誓",ex:"She swore to tell the truth.",lv:1,cefr:"B1"},
  {w:"sweater",ph:"/ˈswɛtər/",pos:"n. 名詞",zh:"毛衣",ex:"She knit a *sweater*.",lv:0,cefr:"A1"},
  {w:"sweet",ph:"/swiːt/",pos:"adj.",zh:"甜的",ex:"Very *sweet*.",lv:0,cefr:"A2"},
  {w:"swim",ph:"/swɪm/",pos:"v.",zh:"游泳",ex:"She can *swim* very fast.",lv:0,cefr:"A1"},
  {w:"symbol",ph:"/ˈsɪmbəl/",pos:"n. 名詞",zh:"符號；象徵",ex:"What does this *symbol* mean?",lv:1,cefr:"B1"},
  {w:"symbolic",ph:"/sɪmˈbɒlɪk/",pos:"adj. 形容詞",zh:"象徵性的",ex:"The dove is *symbolic* of peace.",lv:2,cefr:"B2"},
  {w:"symptom",ph:"/ˈsɪmptəm/",pos:"n. 名詞",zh:"症狀",ex:"List your *symptoms*.",lv:1,cefr:"B1"},
  {w:"synthesize",ph:"/ˈsɪnθɪsaɪz/",pos:"v. 動詞",zh:"綜合",ex:"She can *synthesize* ideas from many sources.",lv:2,cefr:"C1"},
  {w:"system",ph:"/ˈsɪstəm/",pos:"n.",zh:"系統",ex:"The new *system*.",lv:1,cefr:"B1"},
  {w:"table",ph:"/ˈteɪbəl/",pos:"n. 名詞",zh:"桌子",ex:"Please set the *table* for dinner.",lv:0,cefr:"A1"},
  {w:"tablet",ph:"/ˈtæblɪt/",pos:"n. 名詞",zh:"平板電腦",ex:"She uses a *tablet*.",lv:0,cefr:"A2"},
  {w:"take",ph:"/teɪk/",pos:"v. 動詞",zh:"拿",ex:"*take* your umbrella — it might rain.",lv:0,cefr:"A1"},
  {w:"talent",ph:"/ˈtælənt/",pos:"n. 名詞",zh:"天賦",ex:"She has a natural *talent* for music.",lv:1,cefr:"B1"},
  {w:"talented",ph:"/ˈtæləntɪd/",pos:"adj. 形容詞",zh:"有才能的",ex:"She is *talented*.",lv:1,cefr:"B1"},
  {w:"talk",ph:"/tɔːk/",pos:"v.",zh:"說話",ex:"She *talks* to her parents every day.",lv:0,cefr:"A1"},
  {w:"tall",ph:"/tɔːl/",pos:"adj. 形容詞",zh:"高的",ex:"She is the *tallest* student in class.",lv:0,cefr:"A1"},
  {w:"task",ph:"/tæsk/",pos:"n. 名詞",zh:"任務",ex:"Complete the *task*.",lv:1,cefr:"B1"},
  {w:"taste",ph:"/teɪst/",pos:"v.",zh:"品嚐",ex:"This soup *tastes* amazing.",lv:0,cefr:"A2"},
  {w:"taxi",ph:"/ˈtæksi/",pos:"n. 名詞",zh:"計程車",ex:"She took a *taxi* to the airport.",lv:0,cefr:"A2"},
  {w:"tea",ph:"/tiː/",pos:"n. 名詞",zh:"茶",ex:"She poured a cup of *tea*.",lv:0,cefr:"A1"},
  {w:"teach",ph:"/tiːtʃ/",pos:"v. 動詞",zh:"教導",ex:"She *teaches* English at a school.",lv:0,cefr:"A1"},
  {w:"teacher",ph:"/ˈtiːtʃər/",pos:"n. 名詞",zh:"老師",ex:"Our *teacher* is kind.",lv:0,cefr:"A1"},
  {w:"team",ph:"/tiːm/",pos:"n. 名詞",zh:"隊伍",ex:"She is on the basketball *team*.",lv:0,cefr:"A1"},
  {w:"technology",ph:"/tɛkˈnɒlədʒi/",pos:"n. 名詞",zh:"科技",ex:"*technology* has changed our lives.",lv:1,cefr:"B1"},
  {w:"telephone",ph:"/ˈtɛlɪfoʊn/",pos:"n. 名詞",zh:"電話",ex:"Answer the *telephone*.",lv:0,cefr:"A2"},
  {w:"television",ph:"/ˈtɛlɪvɪʒən/",pos:"n. 名詞",zh:"電視",ex:"Watch *television*.",lv:0,cefr:"A2"},
  {w:"temperature",ph:"/ˈtɛmprɪtʃər/",pos:"n. 名詞",zh:"溫度",ex:"What is the *temperature*?",lv:0,cefr:"A2"},
  {w:"temple",ph:"nan",pos:"n.",zh:"廟宇",ex:"Visit the old *temple*.",lv:0,cefr:"A2"},
  {w:"ten",ph:"/tɛn/",pos:"num. 數詞",zh:"十",ex:"She scored *ten* points.",lv:0,cefr:"A1"},
  {w:"tendency",ph:"/ˈtɛndənsi/",pos:"n. 名詞",zh:"傾向",ex:"He has a *tendency* to arrive late.",lv:2,cefr:"B2"},
  {w:"tennis",ph:"/ˈtɛnɪs/",pos:"n. 名詞",zh:"網球",ex:"He plays *tennis* on weekends.",lv:0,cefr:"A2"},
  {w:"tenth",ph:"/tɛnθ/",pos:"adj. 形容詞",zh:"第十",ex:"Today is the *tenth*.",lv:0,cefr:"A1"},
  {w:"terrible",ph:"nan",pos:"adj.",zh:"糟糕的",ex:"The weather is *terrible*.",lv:0,cefr:"A2"},
  {w:"test",ph:"/tɛst/",pos:"n.",zh:"測驗",ex:"She studied hard for the *test*.",lv:0,cefr:"A2"},
  {w:"textbook",ph:"nan",pos:"n.",zh:"課本",ex:"Open your *textbook*.",lv:0,cefr:"A2"},
  {w:"theater",ph:"nan",pos:"n.",zh:"劇院",ex:"Let us go to the *theater*.",lv:0,cefr:"A2"},
  {w:"theme",ph:"/θiːm/",pos:"n. 名詞",zh:"主題",ex:"What is the *theme*?",lv:1,cefr:"B1"},
  {w:"then",ph:"/ðɛn/",pos:"adv.",zh:"然後",ex:"Finish your homework, *then* play games.",lv:0,cefr:"A2"},
  {w:"theoretical",ph:"/ˌθɪəˈrɛtɪkəl/",pos:"adj. 形容詞",zh:"理論上的",ex:"This is a *theoretical* framework.",lv:2,cefr:"C1"},
  {w:"theory",ph:"/ˈθɪəri/",pos:"n. 名詞",zh:"理論",ex:"Darwin's *theory* of evolution changed science.",lv:2,cefr:"B2"},
  {w:"there",ph:"/ðɛər/",pos:"adv. 副詞",zh:"那裡",ex:"She left her bag over *there*.",lv:0,cefr:"A2"},
  {w:"therefore",ph:"/ˈðɛrfɔːr/",pos:"adv. 副詞",zh:"因此",ex:"She studied hard; *therefore*, she passed.",lv:1,cefr:"B1"},
  {w:"thick",ph:"/θɪk/",pos:"adj.",zh:"厚的",ex:"A *thick* book.",lv:0,cefr:"A2"},
  {w:"thin",ph:"/θɪn/",pos:"adj.",zh:"瘦的",ex:"Very *thin*.",lv:0,cefr:"A1"},
  {w:"thing",ph:"/θɪŋ/",pos:"n. 名詞",zh:"事物",ex:"What is that *thing* on the table?",lv:0,cefr:"A2"},
  {w:"think",ph:"/θɪŋk/",pos:"v.",zh:"認為",ex:"I *think* you are right.",lv:0,cefr:"A1"},
  {w:"third",ph:"/θɜːrd/",pos:"adj. 形容詞",zh:"第三",ex:"She is the *third* child.",lv:0,cefr:"A1"},
  {w:"thirsty",ph:"nan",pos:"adj.",zh:"口渴的",ex:"I am very *thirsty*.",lv:0,cefr:"A2"},
  {w:"thirteen",ph:"/ˌθɜːrˈtiːn/",pos:"num. 數詞",zh:"十三",ex:"She is *thirteen* years old.",lv:0,cefr:"A1"},
  {w:"thirty",ph:"/ˈθɜːrti/",pos:"num. 數詞",zh:"三十",ex:"He is *thirty* years old.",lv:0,cefr:"A1"},
  {w:"though",ph:"/ðoʊ/",pos:"conj.",zh:"雖然",ex:"*Though* tired, she kept going.",lv:1,cefr:"B1"},
  {w:"thought",ph:"/θɔːt/",pos:"n. 名詞",zh:"想法；思考",ex:"Share your *thoughts*.",lv:1,cefr:"B1"},
  {w:"thousand",ph:"nan",pos:"num.",zh:"一千",ex:"A *thousand* students attended.",lv:0,cefr:"A2"},
  {w:"three",ph:"/θriː/",pos:"num. 數詞",zh:"三",ex:"There are *three* cats.",lv:0,cefr:"A1"},
  {w:"through",ph:"/θruː/",pos:"prep.",zh:"透過",ex:"Learn *through* practice.",lv:1,cefr:"B1"},
  {w:"throughout",ph:"/θruːˈaʊt/",pos:"prep. 介系詞",zh:"遍及；整個",ex:"She worked hard *throughout*.",lv:1,cefr:"B1"},
  {w:"throw",ph:"/θroʊ/",pos:"v. 動詞",zh:"投擲",ex:"*Throw* the ball.",lv:0,cefr:"A2"},
  {w:"thumb",ph:"/θʌm/",pos:"n. 名詞",zh:"大拇指",ex:"She gave a *thumbs* up.",lv:0,cefr:"A1"},
  {w:"thunder",ph:"nan",pos:"n.",zh:"雷聲",ex:"I heard *thunder*.",lv:0,cefr:"A2"},
  {w:"Thursday",ph:"/ˈθɜːrzdeɪ/",pos:"n. 名詞",zh:"星期四",ex:"We have music on *Thursday*.",lv:0,cefr:"A1"},
  {w:"ticket",ph:"/ˈtɪkɪt/",pos:"n.",zh:"票",ex:"A movie *ticket*.",lv:0,cefr:"A2"},
  {w:"tidy",ph:"nan",pos:"adj.",zh:"整潔的",ex:"Keep your room *tidy*.",lv:0,cefr:"A2"},
  {w:"tie",ph:"/taɪ/",pos:"v. 動詞",zh:"綁；平局",ex:"*Tie* your shoelaces.",lv:0,cefr:"A2"},
  {w:"tiger",ph:"nan",pos:"n.",zh:"老虎",ex:"The *tiger* is strong.",lv:0,cefr:"A1"},
  {w:"time",ph:"/taɪm/",pos:"n.",zh:"時間",ex:"What *time* is it?",lv:0,cefr:"A1"},
  {w:"timetable",ph:"nan",pos:"n.",zh:"時刻表",ex:"Check the *timetable*.",lv:0,cefr:"A2"},
  {w:"tiny",ph:"nan",pos:"adj.",zh:"極小的",ex:"A *tiny* bug.",lv:0,cefr:"A2"},
  {w:"tired",ph:"/ˈtaɪərd/",pos:"adj. 形容詞",zh:"疲倦的",ex:"I feel very *tired* after the long walk.",lv:0,cefr:"A2"},
  {w:"title",ph:"/ˈtaɪtəl/",pos:"n. 名詞",zh:"標題；頭銜",ex:"What is the *title*?",lv:0,cefr:"A2"},
  {w:"today",ph:"/təˈdeɪ/",pos:"adv.",zh:"今天",ex:"What are you doing *today*?",lv:0,cefr:"A1"},
  {w:"toe",ph:"/toʊ/",pos:"n. 名詞",zh:"腳趾",ex:"She stubbed her *toe*.",lv:0,cefr:"A1"},
  {w:"tofu",ph:"/ˈtoʊfuː/",pos:"n. 名詞",zh:"豆腐",ex:"She made *tofu* soup.",lv:0,cefr:"A2"},
  {w:"together",ph:"/təˈɡɛðər/",pos:"adv. 副詞",zh:"一起",ex:"Let's work *together*.",lv:0,cefr:"A2"},
  {w:"toilet",ph:"/ˈtɔɪlɪt/",pos:"n. 名詞",zh:"馬桶；廁所",ex:"Flush the *toilet*.",lv:0,cefr:"A1"},
  {w:"tolerate",ph:"/ˈtɒləreɪt/",pos:"v. 動詞",zh:"容忍",ex:"She cannot *tolerate* injustice.",lv:2,cefr:"B2"},
  {w:"tomato",ph:"/təˈmeɪtoʊ/",pos:"n.",zh:"番茄",ex:"Fresh *tomatoes*.",lv:0,cefr:"A1"},
  {w:"tomorrow",ph:"/təˈmɒroʊ/",pos:"n. 名詞",zh:"明天",ex:"See you *tomorrow*.",lv:0,cefr:"A2"},
  {w:"tongue",ph:"/tʌŋ/",pos:"n. 名詞",zh:"舌頭",ex:"She stuck out her *tongue*.",lv:0,cefr:"A1"},
  {w:"tonight",ph:"/təˈnaɪt/",pos:"n. 名詞",zh:"今晚",ex:"What are you doing *tonight*?",lv:0,cefr:"A2"},
  {w:"tooth",ph:"/tuːθ/",pos:"n.",zh:"牙齒",ex:"Brush your teeth.",lv:0,cefr:"A1"},
  {w:"toothache",ph:"/ˈtuːθeɪk/",pos:"n. 名詞",zh:"牙痛",ex:"She has a *toothache*.",lv:0,cefr:"A2"},
  {w:"topic",ph:"/ˈtɒpɪk/",pos:"n. 名詞",zh:"主題",ex:"What is the *topic*?",lv:1,cefr:"B1"},
  {w:"total",ph:"/ˈtoʊtəl/",pos:"n. 名詞",zh:"總計",ex:"What is the *total*?",lv:0,cefr:"A2"},
  {w:"touch",ph:"/tʌtʃ/",pos:"v.",zh:"觸摸",ex:"Don't *touch* this.",lv:0,cefr:"A2"},
  {w:"toward",ph:"nan",pos:"prep.",zh:"朝向",ex:"Walk *toward* the exit.",lv:1,cefr:"B1"},
  {w:"town",ph:"/taʊn/",pos:"n.",zh:"城鎮",ex:"A small *town*.",lv:0,cefr:"A2"},
  {w:"toy",ph:"/tɔɪ/",pos:"n. 名詞",zh:"玩具",ex:"He got a new *toy*.",lv:0,cefr:"A1"},
  {w:"trade",ph:"/treɪd/",pos:"n. 名詞",zh:"貿易；交換",ex:"Fair *trade*.",lv:1,cefr:"B1"},
  {w:"tradition",ph:"/trəˈdɪʃən/",pos:"n. 名詞",zh:"傳統",ex:"Giving red envelopes is a *tradition*.",lv:0,cefr:"B1"},
  {w:"traditional",ph:"/trəˈdɪʃənəl/",pos:"adj. 形容詞",zh:"傳統的",ex:"*Traditional* food is best.",lv:1,cefr:"B1"},
  {w:"train",ph:"/treɪn/",pos:"n.",zh:"火車",ex:"Take the *train*.",lv:0,cefr:"A2"},
  {w:"transfer",ph:"/ˈtrænsfɜːr/",pos:"v.",zh:"轉移",ex:"*Transfer* the file.",lv:2,cefr:"B2"},
  {w:"transform",ph:"/trænsˈfɔːm/",pos:"v. 動詞",zh:"轉化",ex:"Education can *transform* your life.",lv:1,cefr:"B2"},
  {w:"transition",ph:"/trænˈzɪʃən/",pos:"n. 名詞",zh:"轉變",ex:"The *transition* from school to work can be difficult.",lv:2,cefr:"B2"},
  {w:"translate",ph:"/trænsˈleɪt/",pos:"v. 動詞",zh:"翻譯",ex:"Can you *translate* this sentence?",lv:1,cefr:"B1"},
  {w:"transparent",ph:"/trænsˈpærənt/",pos:"adj. 形容詞",zh:"透明的",ex:"Be *transparent* about your intentions.",lv:2,cefr:"B2"},
  {w:"trash",ph:"nan",pos:"n.",zh:"垃圾",ex:"Take out the *trash*.",lv:0,cefr:"A2"},
  {w:"travel",ph:"/ˈtrævəl/",pos:"v.",zh:"旅行",ex:"She loves to *travel* to new places.",lv:0,cefr:"A2"},
  {w:"treat",ph:"nan",pos:"v.",zh:"對待",ex:"*treat* others kindly.",lv:1,cefr:"B1"},
  {w:"tree",ph:"/triː/",pos:"n.",zh:"樹",ex:"A big *tree*.",lv:0,cefr:"A1"},
  {w:"trend",ph:"/trɛnd/",pos:"n.",zh:"趨勢",ex:"Latest *trends*.",lv:2,cefr:"B2"},
  {w:"triangle",ph:"/ˈtraɪæŋɡəl/",pos:"n. 名詞",zh:"三角形",ex:"A *triangle* has three sides.",lv:0,cefr:"A1"},
  {w:"trip",ph:"nan",pos:"n.",zh:"旅行",ex:"We took a *trip* to the beach.",lv:0,cefr:"A2"},
  {w:"triple",ph:"/ˈtrɪpəl/",pos:"adj. 形容詞",zh:"三倍的",ex:"*Triple* the dose.",lv:1,cefr:"B1"},
  {w:"trouble",ph:"nan",pos:"n.",zh:"麻煩",ex:"He is in *trouble*.",lv:0,cefr:"A2"},
  {w:"truck",ph:"/trʌk/",pos:"n. 名詞",zh:"卡車",ex:"A *truck* passed by.",lv:0,cefr:"A1"},
  {w:"true",ph:"/truː/",pos:"adj.",zh:"真實的",ex:"Is this *true*?",lv:1,cefr:"B1"},
  {w:"trust",ph:"/trʌst/",pos:"v.",zh:"信任",ex:"I *trust* you.",lv:1,cefr:"B1"},
  {w:"truth",ph:"/truːθ/",pos:"n.",zh:"真相",ex:"Tell me the *truth*.",lv:1,cefr:"B1"},
  {w:"try",ph:"/traɪ/",pos:"v. 動詞",zh:"嘗試",ex:"You should *try* your best.",lv:0,cefr:"A1"},
  {w:"Tuesday",ph:"/ˈtjuːzdeɪ/",pos:"n. 名詞",zh:"星期二",ex:"We have PE on *Tuesday*.",lv:0,cefr:"A1"},
  {w:"turn",ph:"/tɜːrn/",pos:"v.",zh:"轉",ex:"*Turn* left.",lv:0,cefr:"A1"},
  {w:"twelve",ph:"/twɛlv/",pos:"num. 數詞",zh:"十二",ex:"*Twelve* months in a year.",lv:0,cefr:"A1"},
  {w:"twenty",ph:"/ˈtwɛnti/",pos:"num. 數詞",zh:"二十",ex:"She saved *twenty* dollars.",lv:0,cefr:"A1"},
  {w:"twice",ph:"/twaɪs/",pos:"adv. 副詞",zh:"兩次",ex:"She won *twice*.",lv:0,cefr:"A2"},
  {w:"twin",ph:"/twɪn/",pos:"n. 名詞",zh:"雙胞胎",ex:"She has a *twin* sister.",lv:0,cefr:"A2"},
  {w:"two",ph:"/tuː/",pos:"num. 數詞",zh:"二",ex:"She has *two* dogs.",lv:0,cefr:"A1"},
  {w:"type",ph:"/taɪp/",pos:"n.",zh:"類型",ex:"What *type*?",lv:1,cefr:"B1"},
  {w:"typical",ph:"/ˈtɪpɪkəl/",pos:"adj. 形容詞",zh:"典型的",ex:"This is a *typical* case.",lv:1,cefr:"B1"},
  {w:"ultimate",ph:"/ˈʌltɪmɪt/",pos:"adj. 形容詞",zh:"最終的",ex:"Her *ultimate* goal is to become a doctor.",lv:2,cefr:"B2"},
  {w:"umbrella",ph:"/ʌmˈbrɛlə/",pos:"n.",zh:"雨傘",ex:"Take your *umbrella*.",lv:0,cefr:"A2"},
  {w:"uncle",ph:"nan",pos:"n.",zh:"叔叔",ex:"My *uncle* is funny.",lv:0,cefr:"A1"},
  {w:"under",ph:"/ˈʌndər/",pos:"prep. 介系詞",zh:"在...下面",ex:"The cat is *under* the table.",lv:0,cefr:"A1"},
  {w:"underlying",ph:"/ˌʌndərˈlaɪɪŋ/",pos:"adj. 形容詞",zh:"潛在的；根本的",ex:"The *underlying* cause.",lv:2,cefr:"B2"},
  {w:"undermine",ph:"/ˌʌndəˈmaɪn/",pos:"v. 動詞",zh:"削弱",ex:"Doubt can *undermine* your confidence.",lv:2,cefr:"C1"},
  {w:"understand",ph:"/ˌʌndəˈstænd/",pos:"v. 動詞",zh:"了解",ex:"Do you *understand* the question?",lv:0,cefr:"A2"},
  {w:"understanding",ph:"/ˌʌndərˈstændɪŋ/",pos:"n. 名詞",zh:"理解",ex:"Show *understanding*.",lv:1,cefr:"B1"},
  {w:"unfortunately",ph:"/ʌnˈfɔːrtʃənɪtli/",pos:"adv. 副詞",zh:"不幸地",ex:"*Unfortunately*, she lost.",lv:1,cefr:"B1"},
  {w:"uniform",ph:"nan",pos:"n.",zh:"制服",ex:"Wear your school *uniform*.",lv:0,cefr:"A2"},
  {w:"unique",ph:"/juːˈniːk/",pos:"adj. 形容詞",zh:"獨特的",ex:"Everyone is *unique*.",lv:1,cefr:"B2"},
  {w:"universal",ph:"/ˌjuːnɪˈvɜːrsəl/",pos:"adj. 形容詞",zh:"普遍的",ex:"Music is a *universal* language.",lv:2,cefr:"C1"},
  {w:"unless",ph:"/ənˈlɛs/",pos:"conj.",zh:"除非",ex:"*Unless* you hurry, you'll be late.",lv:1,cefr:"B1"},
  {w:"until",ph:"/ənˈtɪl/",pos:"conj.",zh:"直到",ex:"Wait *until* I come back.",lv:0,cefr:"A2"},
  {w:"up",ph:"/ʌp/",pos:"adv. 副詞",zh:"向上",ex:"Look *up* at the sky.",lv:0,cefr:"A1"},
  {w:"upload",ph:"/ˌʌpˈloʊd/",pos:"v. 動詞",zh:"上傳",ex:"*Upload* the photo.",lv:0,cefr:"A2"},
  {w:"upset",ph:"/ʌpˈsɛt/",pos:"adj. 形容詞",zh:"難過的；心煩的",ex:"She was *upset*.",lv:0,cefr:"A2"},
  {w:"upstairs",ph:"/ˌʌpˈstɛrz/",pos:"adv. 副詞",zh:"樓上",ex:"Go *upstairs*.",lv:0,cefr:"A2"},
  {w:"urgent",ph:"/ˈɜːrdʒənt/",pos:"adj. 形容詞",zh:"緊急的",ex:"It is *urgent*.",lv:1,cefr:"B1"},
  {w:"use",ph:"/juːz/",pos:"v.",zh:"使用",ex:"Can I *use* this?",lv:0,cefr:"A1"},
  {w:"useful",ph:"/ˈjuːsfʊl/",pos:"adj. 形容詞",zh:"有用的",ex:"This dictionary is very *useful*.",lv:0,cefr:"A2"},
  {w:"usual",ph:"/ˈjuːʒuəl/",pos:"adj. 形容詞",zh:"通常的",ex:"She is late as *usual*.",lv:0,cefr:"A2"},
  {w:"usually",ph:"/ˈjuːʒuəli/",pos:"adv. 副詞",zh:"通常",ex:"She *usually* wakes up at seven.",lv:0,cefr:"A2"},
  {w:"utilize",ph:"/ˈjuːtɪlaɪz/",pos:"v. 動詞",zh:"利用",ex:"*utilize* all available resources.",lv:2,cefr:"B2"},
  {w:"vacation",ph:"nan",pos:"n.",zh:"假期",ex:"Summer *vacation* is coming.",lv:0,cefr:"A2"},
  {w:"valid",ph:"/ˈvælɪd/",pos:"adj.",zh:"有效的",ex:"Your ticket is *valid*.",lv:2,cefr:"B2"},
  {w:"validate",ph:"/ˈvælɪdeɪt/",pos:"v. 動詞",zh:"驗證",ex:"The results *validate* the hypothesis.",lv:2,cefr:"B2"},
  {w:"valley",ph:"/ˈvæli/",pos:"n. 名詞",zh:"山谷",ex:"The *valley* was beautiful.",lv:0,cefr:"A2"},
  {w:"value",ph:"/ˈvæljuː/",pos:"n.",zh:"價值",ex:"She *values* honesty above all.",lv:1,cefr:"B1"},
  {w:"variable",ph:"/ˈvɛərɪəbl/",pos:"adj.",zh:"可變的",ex:"Weather is a *variable* factor.",lv:2,cefr:"B2"},
  {w:"variety",ph:"/vəˈraɪɪti/",pos:"n.",zh:"多樣性",ex:"A *variety* of options.",lv:1,cefr:"B1"},
  {w:"various",ph:"/ˈvɛərɪəs/",pos:"adj. 形容詞",zh:"各種的",ex:"There are *various* ways to learn.",lv:1,cefr:"B1"},
  {w:"vast",ph:"/vɑːst/",pos:"adj. 形容詞",zh:"廣大的",ex:"The ocean is *vast* and deep.",lv:2,cefr:"B2"},
  {w:"verify",ph:"/ˈvɛrɪfaɪ/",pos:"v. 動詞",zh:"核實",ex:"Please *verify* your information.",lv:2,cefr:"B2"},
  {w:"very",ph:"/ˈvɛri/",pos:"adv.",zh:"非常",ex:"*Very* smart.",lv:0,cefr:"A1"},
  {w:"victory",ph:"/ˈvɪktəri/",pos:"n. 名詞",zh:"勝利",ex:"Celebrate the *victory*.",lv:1,cefr:"B1"},
  {w:"video",ph:"/ˈvɪdiəʊ/",pos:"n. 名詞",zh:"影片",ex:"Watch the *video*.",lv:0,cefr:"A2"},
  {w:"view",ph:"/vjuː/",pos:"n.",zh:"觀點",ex:"The *view* was amazing.",lv:1,cefr:"B1"},
  {w:"village",ph:"nan",pos:"n.",zh:"村莊",ex:"She grew up in a *village*.",lv:0,cefr:"A2"},
  {w:"virtue",ph:"/ˈvɜːtʃuː/",pos:"n. 名詞",zh:"美德",ex:"Patience is a *virtue*.",lv:2,cefr:"B2"},
  {w:"visit",ph:"/ˈvɪzɪt/",pos:"v.",zh:"拜訪",ex:"Let's *visit* the museum.",lv:0,cefr:"A2"},
  {w:"vitamin",ph:"/ˈvaɪtəmɪn/",pos:"n. 名詞",zh:"維生素",ex:"Take *vitamins* daily.",lv:0,cefr:"A2"},
  {w:"voice",ph:"/vɔɪs/",pos:"n.",zh:"聲音",ex:"A beautiful *voice*.",lv:1,cefr:"B1"},
  {w:"volcano",ph:"/vɒlˈkeɪnoʊ/",pos:"n. 名詞",zh:"火山",ex:"The *volcano* erupted.",lv:1,cefr:"B1"},
  {w:"volleyball",ph:"/ˈvɒlibɔːl/",pos:"n. 名詞",zh:"排球",ex:"She plays *volleyball*.",lv:0,cefr:"A2"},
  {w:"volunteer",ph:"/ˌvɒlənˈtɪər/",pos:"v.",zh:"志願",ex:"She *volunteers* at the animal shelter.",lv:1,cefr:"B1"},
  {w:"vote",ph:"/voʊt/",pos:"v. 動詞",zh:"投票",ex:"*Vote* for your choice.",lv:1,cefr:"B1"},
  {w:"vulnerable",ph:"/ˈvʌlnərəbl/",pos:"adj. 形容詞",zh:"脆弱的",ex:"Children are *vulnerable* to cold weather.",lv:2,cefr:"B2"},
  {w:"wait",ph:"/weɪt/",pos:"v. 動詞",zh:"等待",ex:"Please *wait* here for a moment.",lv:0,cefr:"A1"},
  {w:"wake",ph:"/weɪk/",pos:"v. 動詞",zh:"醒來",ex:"I *wake* up at six every morning.",lv:0,cefr:"A2"},
  {w:"walk",ph:"/wɔːk/",pos:"v.",zh:"走路",ex:"I *walk* to school.",lv:0,cefr:"A1"},
  {w:"wall",ph:"/wɔːl/",pos:"n. 名詞",zh:"牆壁",ex:"There is a picture on the *wall*.",lv:0,cefr:"A1"},
  {w:"wallet",ph:"nan",pos:"n.",zh:"錢包",ex:"I lost my *wallet*.",lv:0,cefr:"A2"},
  {w:"want",ph:"/wɒnt/",pos:"v.",zh:"想要",ex:"I *want* water.",lv:0,cefr:"A1"},
  {w:"war",ph:"/wɔːr/",pos:"n. 名詞",zh:"戰爭",ex:"*War* causes suffering.",lv:1,cefr:"B1"},
  {w:"warm",ph:"/wɔːrm/",pos:"adj.",zh:"溫暖的",ex:"Nice and *warm*.",lv:0,cefr:"A2"},
  {w:"warn",ph:"/wɔːrn/",pos:"v. 動詞",zh:"警告",ex:"She *warned* him.",lv:1,cefr:"B1"},
  {w:"wash",ph:"/wɒʃ/",pos:"v. 動詞",zh:"清洗",ex:"*Wash* your hands.",lv:0,cefr:"A1"},
  {w:"waste",ph:"/weɪst/",pos:"v.",zh:"浪費",ex:"Don't *waste* food.",lv:0,cefr:"A2"},
  {w:"watch",ph:"/wɒtʃ/",pos:"v.",zh:"看",ex:"I *watch* TV.",lv:0,cefr:"A1"},
  {w:"water",ph:"/ˈwɔːtər/",pos:"n.",zh:"水",ex:"Drink more *water*.",lv:0,cefr:"A1"},
  {w:"watermelon",ph:"/ˈwɔːtərˌmɛlən/",pos:"n. 名詞",zh:"西瓜",ex:"*Watermelon* is sweet.",lv:0,cefr:"A1"},
  {w:"wave",ph:"/weɪv/",pos:"v. 動詞",zh:"揮手；揮動",ex:"She *waved* goodbye.",lv:0,cefr:"A2"},
  {w:"weak",ph:"/wiːk/",pos:"adj. 形容詞",zh:"虛弱的；薄弱的",ex:"She felt *weak*.",lv:0,cefr:"A2"},
  {w:"wealth",ph:"/wɛlθ/",pos:"n. 名詞",zh:"財富",ex:"She has great *wealth*.",lv:1,cefr:"B1"},
  {w:"wear",ph:"/wɛr/",pos:"v.",zh:"穿",ex:"She *wears* a uniform.",lv:0,cefr:"A1"},
  {w:"weather",ph:"/ˈwɛðər/",pos:"n.",zh:"天氣",ex:"Great *weather*!",lv:0,cefr:"A2"},
  {w:"website",ph:"/ˈwɛbsaɪt/",pos:"n. 名詞",zh:"網站",ex:"Visit our *website*.",lv:0,cefr:"A2"},
  {w:"Wednesday",ph:"/ˈwɛnzdeɪ/",pos:"n. 名詞",zh:"星期三",ex:"*Wednesday* is the middle of the week.",lv:0,cefr:"A1"},
  {w:"week",ph:"/wiːk/",pos:"n.",zh:"星期",ex:"Once a *week*.",lv:0,cefr:"A1"},
  {w:"weekend",ph:"/ˈwiːkɛnd/",pos:"n. 名詞",zh:"週末",ex:"What do you do on *weekends*?",lv:0,cefr:"A2"},
  {w:"weight",ph:"/weɪt/",pos:"n.",zh:"體重",ex:"Check your *weight*.",lv:0,cefr:"A2"},
  {w:"weird",ph:"/wɪrd/",pos:"adj. 形容詞",zh:"怪異的",ex:"That is *weird*.",lv:0,cefr:"A2"},
  {w:"well",ph:"/wɛl/",pos:"adv.",zh:"好地",ex:"She sings very *well*.",lv:0,cefr:"A2"},
  {w:"west",ph:"nan",pos:"n.",zh:"西方",ex:"The sun sets in the *west*.",lv:0,cefr:"A1"},
  {w:"whale",ph:"/weɪl/",pos:"n. 名詞",zh:"鯨魚",ex:"*Whales* live in the ocean.",lv:0,cefr:"A2"},
  {w:"whereas",ph:"/wɛrˈæz/",pos:"conj.",zh:"反之",ex:"She likes coffee, *whereas* he prefers tea.",lv:2,cefr:"C1"},
  {w:"whether",ph:"/ˈwɛðər/",pos:"conj. 連接詞",zh:"是否",ex:"I don't know *whether* to go.",lv:1,cefr:"B1"},
  {w:"while",ph:"/waɪl/",pos:"conj.",zh:"當...時",ex:"I read *while* waiting.",lv:0,cefr:"A2"},
  {w:"whisper",ph:"/ˈwɪspər/",pos:"v. 動詞",zh:"低聲說話",ex:"She *whispered* in his ear.",lv:0,cefr:"A2"},
  {w:"white",ph:"/waɪt/",pos:"adj.",zh:"白色的",ex:"A *white* shirt.",lv:0,cefr:"A1"},
  {w:"whole",ph:"/hoʊl/",pos:"adj.",zh:"全部的",ex:"She ate the *whole* cake.",lv:0,cefr:"A2"},
  {w:"wide",ph:"/waɪd/",pos:"adj. 形容詞",zh:"寬的",ex:"The road is very *wide*.",lv:0,cefr:"B1"},
  {w:"width",ph:"/wɪdθ/",pos:"n. 名詞",zh:"寬度",ex:"What is the *width*?",lv:0,cefr:"A2"},
  {w:"wife",ph:"nan",pos:"n.",zh:"妻子",ex:"His *wife* is a nurse.",lv:0,cefr:"A1"},
  {w:"wild",ph:"nan",pos:"adj.",zh:"野生的",ex:"*wild* animals need protection.",lv:1,cefr:"B1"},
  {w:"win",ph:"/wɪn/",pos:"v. 動詞",zh:"贏得",ex:"She wants to *win* the competition.",lv:0,cefr:"A2"},
  {w:"wind",ph:"/wɪnd/",pos:"n. 名詞",zh:"風",ex:"The *wind* is strong today.",lv:0,cefr:"A1"},
  {w:"window",ph:"/ˈwɪndoʊ/",pos:"n.",zh:"窗戶",ex:"Open the *window*.",lv:0,cefr:"A1"},
  {w:"wing",ph:"nan",pos:"n.",zh:"翅膀",ex:"The bird spread its *wings*.",lv:0,cefr:"A2"},
  {w:"winter",ph:"nan",pos:"n.",zh:"冬天",ex:"*winter* can be very cold.",lv:0,cefr:"A1"},
  {w:"wisdom",ph:"/ˈwɪzdəm/",pos:"n. 名詞",zh:"智慧",ex:"She is full of *wisdom*.",lv:1,cefr:"B1"},
  {w:"wise",ph:"/waɪz/",pos:"adj. 形容詞",zh:"智慧的",ex:"He gave me some *wise* advice.",lv:0,cefr:"A2"},
  {w:"wish",ph:"/wɪʃ/",pos:"v.",zh:"希望",ex:"I *wish* you good luck.",lv:0,cefr:"A2"},
  {w:"within",ph:"/wɪˈðɪn/",pos:"prep.",zh:"在...之內",ex:"Finish *within* one hour.",lv:1,cefr:"B1"},
  {w:"without",ph:"nan",pos:"prep.",zh:"沒有",ex:"I cannot live *without* music.",lv:0,cefr:"A2"},
  {w:"wolf",ph:"nan",pos:"n.",zh:"狼",ex:"Wolves live in packs.",lv:0,cefr:"A2"},
  {w:"woman",ph:"/ˈwʊmən/",pos:"n.",zh:"女人",ex:"A kind *woman*.",lv:0,cefr:"A1"},
  {w:"wonder",ph:"/ˈwʌndər/",pos:"v.",zh:"想知道",ex:"I *wonder* what will happen.",lv:0,cefr:"A2"},
  {w:"wonderful",ph:"/ˈwʌndərfʊl/",pos:"adj. 形容詞",zh:"美妙的",ex:"What a *wonderful* day!",lv:0,cefr:"A2"},
  {w:"wood",ph:"/wʊd/",pos:"n. 名詞",zh:"木頭",ex:"The table is made of *wood*.",lv:0,cefr:"A1"},
  {w:"word",ph:"/wɜːrd/",pos:"n.",zh:"單字",ex:"Learn new *words*.",lv:0,cefr:"A1"},
  {w:"world",ph:"/wɜːrld/",pos:"n. 名詞",zh:"世界",ex:"Travel around the *world*.",lv:0,cefr:"A2"},
  {w:"worry",ph:"/ˈwʌri/",pos:"v.",zh:"擔心",ex:"Don't *worry* about the test.",lv:0,cefr:"B1"},
  {w:"wrap",ph:"/ræp/",pos:"v. 動詞",zh:"包裝；纏繞",ex:"*Wrap* the gift.",lv:0,cefr:"A2"},
  {w:"wrist",ph:"/rɪst/",pos:"n. 名詞",zh:"手腕",ex:"She wore a bracelet on her *wrist*.",lv:0,cefr:"A2"},
  {w:"write",ph:"/raɪt/",pos:"v.",zh:"寫",ex:"*Write* your name.",lv:0,cefr:"A2"},
  {w:"wrong",ph:"/rɒŋ/",pos:"adj.",zh:"錯誤的",ex:"That is *wrong*.",lv:0,cefr:"A2"},
  {w:"yard",ph:"nan",pos:"n.",zh:"院子",ex:"Play in the *yard*.",lv:0,cefr:"A2"},
  {w:"yawn",ph:"/jɔːn/",pos:"v. 動詞",zh:"打哈欠",ex:"She *yawned* because she was tired.",lv:0,cefr:"A2"},
  {w:"year",ph:"/jɪər/",pos:"n.",zh:"年",ex:"Twelve *years* old.",lv:0,cefr:"A1"},
  {w:"yellow",ph:"/ˈjɛloʊ/",pos:"adj.",zh:"黃色的",ex:"Bananas are *yellow*.",lv:0,cefr:"A1"},
  {w:"yesterday",ph:"/ˈjɛstərdeɪ/",pos:"n. 名詞",zh:"昨天",ex:"I saw her *yesterday*.",lv:0,cefr:"A2"},
  {w:"yet",ph:"/jɛt/",pos:"adv.",zh:"還；已經",ex:"Have you eaten *yet*?",lv:1,cefr:"B1"},
  {w:"yoga",ph:"/ˈjoʊɡə/",pos:"n. 名詞",zh:"瑜伽",ex:"She does *yoga* every day.",lv:0,cefr:"A2"},
  {w:"young",ph:"/jʌŋ/",pos:"adj.",zh:"年輕的",ex:"She looks *young*.",lv:0,cefr:"A1"},
  {w:"zero",ph:"/ˈzɪroʊ/",pos:"num. 數詞",zh:"零",ex:"The score is *zero*.",lv:0,cefr:"A1"},
  {w:"zipper",ph:"/ˈzɪpər/",pos:"n. 名詞",zh:"拉鍊",ex:"The *zipper* is stuck.",lv:0,cefr:"A2"},
  {w:"zoo",ph:"/zuː/",pos:"n.",zh:"動物園",ex:"We visited the *zoo*.",lv:0,cefr:"A1"}
];

const GRAMMAR=[
  {lv:0,topic:"be 動詞",stem:"She ___ a student.",opts:["is","are","am","be"],ans:0,explain:"主詞是第三人稱單數 She，be 動詞用 is。"},
  {lv:0,topic:"現在簡單式",stem:"They ___ to school every day.",opts:["go","goes","going","went"],ans:0,explain:"主詞 They 為複數，現在簡單式動詞不加 s。"},
  {lv:0,topic:"冠詞",stem:"I have ___ apple on my desk.",opts:["a","an","the","(不填)"],ans:1,explain:"apple 以母音 a 開頭，冠詞用 an。"},
  {lv:0,topic:"所有格",stem:"This is ___ book. It belongs to Tom.",opts:["Tom's","Toms","Toms'","of Tom"],ans:0,explain:"表所有格，在名字後加 's。"},
  {lv:0,topic:"複數名詞",stem:"There are three ___ in the classroom.",opts:["child","childs","children","childrens"],ans:2,explain:"child 的不規則複數是 children。"},
  {lv:0,topic:"現在進行式",stem:"Look! The dog ___ in the garden now.",opts:["runs","run","is running","ran"],ans:2,explain:"now 表示正在進行，用現在進行式 is running。"},
  {lv:0,topic:"疑問句",stem:"___ he like pizza?",opts:["Do","Does","Is","Are"],ans:1,explain:"第三人稱單數 he，助動詞用 Does。"},
  {lv:0,topic:"否定句",stem:"I ___ like spicy food.",opts:["don't","doesn't","isn't","aren't"],ans:0,explain:"主詞是 I，否定助動詞用 don't。"},
  {lv:0,topic:"人稱代名詞",stem:"___ is my best friend.",opts:["Him","He","His","Her"],ans:1,explain:"作主詞用主格，應選 He。"},
  {lv:0,topic:"人稱代名詞",stem:"I gave ___ a gift.",opts:["she","her","hers","herself"],ans:1,explain:"給「她」，作受詞用受格 her。"},
  {lv:0,topic:"人稱代名詞",stem:"This book is ___. Don't take it.",opts:["I","me","my","mine"],ans:3,explain:"Is 後面接所有代名詞 mine（我的）。"},
  {lv:0,topic:"所有格",stem:"___ mother is a teacher.",opts:["They","Them","Their","Theirs"],ans:2,explain:"後面接名詞 mother，用所有格 Their。"},
  {lv:0,topic:"所有格",stem:"Is this pencil ___?",opts:["your","you","yours","yourself"],ans:2,explain:"Is 後不接名詞，用所有代名詞 yours。"},
  {lv:0,topic:"be 動詞",stem:"Tom and Jerry ___ good friends.",opts:["is","am","are","be"],ans:2,explain:"複數主詞 Tom and Jerry，be 動詞用 are。"},
  {lv:0,topic:"be 動詞",stem:"___ you a student?",opts:["Is","Am","Are","Be"],ans:2,explain:"主詞是 you，疑問句 be 動詞用 Are。"},
  {lv:0,topic:"be 動詞",stem:"I ___ not hungry right now.",opts:["is","am","are","be"],ans:1,explain:"主詞是 I，be 動詞用 am。"},
  {lv:0,topic:"be 動詞",stem:"The boys ___ in the gym.",opts:["is","am","are","was"],ans:2,explain:"複數名詞 boys，be 動詞用 are。"},
  {lv:0,topic:"現在簡單式",stem:"She ___ breakfast every morning.",opts:["eat","eats","eating","eaten"],ans:1,explain:"第三人稱單數 she，動詞加 s → eats。"},
  {lv:0,topic:"現在簡單式",stem:"My parents ___ coffee every day.",opts:["drink","drinks","drinking","drank"],ans:0,explain:"主詞 parents 是複數，動詞不加 s。"},
  {lv:0,topic:"現在簡單式",stem:"He ___ to school by bus.",opts:["go","goes","going","went"],ans:1,explain:"第三人稱單數 he，go → goes。"},
  {lv:0,topic:"現在簡單式",stem:"They ___ in a big apartment.",opts:["live","lives","living","lived"],ans:0,explain:"複數主詞 they，動詞原形 live。"},
  {lv:0,topic:"現在簡單式",stem:"The sun ___ in the east.",opts:["rise","rises","rising","rose"],ans:1,explain:"第三人稱單數，rise → rises。"},
  {lv:0,topic:"現在簡單式",stem:"Dogs ___ bones.",opts:["like","likes","liking","liked"],ans:0,explain:"複數 dogs，動詞原形 like。"},
  {lv:0,topic:"否定句",stem:"She ___ eat meat.",opts:["don't","doesn't","isn't","aren't"],ans:1,explain:"第三人稱單數 she，否定用 doesn't。"},
  {lv:0,topic:"否定句",stem:"They ___ play basketball on weekdays.",opts:["don't","doesn't","isn't","aren't"],ans:0,explain:"複數 they，否定用 don't。"},
  {lv:0,topic:"否定句",stem:"I ___ happy today.",opts:["don't","doesn't","am not","isn't"],ans:2,explain:"be 動詞 am 的否定是 am not。"},
  {lv:0,topic:"疑問句",stem:"___ your sister like music?",opts:["Do","Does","Is","Are"],ans:1,explain:"第三人稱單數 your sister，用 Does。"},
  {lv:0,topic:"疑問句",stem:"___ they play baseball?",opts:["Do","Does","Is","Are"],ans:0,explain:"複數主詞 they，用 Do。"},
  {lv:0,topic:"疑問句",stem:"___ your parents at home now?",opts:["Do","Does","Is","Are"],ans:3,explain:"複數 parents，be 動詞疑問句用 Are。"},
  {lv:0,topic:"疑問句",stem:"___ he your teacher?",opts:["Do","Does","Is","Are"],ans:2,explain:"第三人稱單數 he，be 動詞疑問句用 Is。"},
  {lv:0,topic:"現在進行式",stem:"She ___ a book now.",opts:["reads","read","is reading","are reading"],ans:2,explain:"now 表正在進行，she 用 is reading。"},
  {lv:0,topic:"現在進行式",stem:"They ___ soccer in the park.",opts:["play","plays","is playing","are playing"],ans:3,explain:"複數 they 現在進行式用 are playing。"},
  {lv:0,topic:"現在進行式",stem:"___ he sleeping?",opts:["Do","Does","Is","Are"],ans:2,explain:"he 的現在進行式疑問句用 Is。"},
  {lv:0,topic:"現在進行式",stem:"I am ___ my homework.",opts:["do","does","doing","done"],ans:2,explain:"am 後面接現在分詞 doing。"},
  {lv:0,topic:"冠詞",stem:"She is ___ honest person.",opts:["a","an","the","x"],ans:1,explain:"honest 以母音音素 /h/ 開頭（但 h 不發音），用 an。"},
  {lv:0,topic:"冠詞",stem:"___ moon is very bright tonight.",opts:["A","An","The","x"],ans:2,explain:"特指那個月亮，用定冠詞 The。"},
  {lv:0,topic:"冠詞",stem:"I want to be ___ engineer.",opts:["a","an","the","x"],ans:1,explain:"engineer 以母音 e 開頭，用 an。"},
  {lv:0,topic:"冠詞",stem:"She plays ___ piano every day.",opts:["a","an","the","x"],ans:2,explain:"play the piano 是固定用法，用 the。"},
  {lv:0,topic:"冠詞",stem:"He is ___ student in my class.",opts:["a","an","the","x"],ans:0,explain:"student 以子音開頭，用不定冠詞 a。"},
  {lv:0,topic:"複數名詞",stem:"There are five ___ in the bag.",opts:["book","books","bookes","bookies"],ans:1,explain:"一般名詞複數加 s → books。"},
  {lv:0,topic:"複數名詞",stem:"I see two ___ in the yard.",opts:["cat","cats","cates","caties"],ans:1,explain:"cat 複數加 s → cats。"},
  {lv:0,topic:"複數名詞",stem:"She has three ___.",opts:["watch","watches","watchs","watchies"],ans:1,explain:"字尾是 ch，複數加 es → watches。"},
  {lv:0,topic:"複數名詞",stem:"The ___ are very loud.",opts:["child","childs","children","childrens"],ans:2,explain:"child 不規則複數是 children。"},
  {lv:0,topic:"複數名詞",stem:"There are many ___ on the farm.",opts:["sheep","sheeps","sheepes","sheepies"],ans:0,explain:"sheep 單複數同形，不加 s。"},
  {lv:0,topic:"複數名詞",stem:"Two ___ flew past the window.",opts:["birds","birdes","bird","birdies"],ans:0,explain:"bird 複數加 s → birds。"},
  {lv:0,topic:"複數名詞",stem:"The ___ are in the aquarium.",opts:["fishs","fishes","fish","fishies"],ans:2,explain:"fish 通常單複數同形。"},
  {lv:0,topic:"介系詞",stem:"The library is ___ the school.",opts:["in","on","next to","under"],ans:2,explain:"圖書館在學校隔壁，用 next to。"},
  {lv:0,topic:"介系詞",stem:"She was born ___ July 4.",opts:["in","on","at","by"],ans:1,explain:"特定日期用 on。"},
  {lv:0,topic:"介系詞",stem:"I get up ___ seven o'clock.",opts:["in","on","at","by"],ans:2,explain:"特定時刻用 at。"},
  {lv:0,topic:"介系詞",stem:"He studied ___ the morning.",opts:["in","on","at","by"],ans:0,explain:"一天中的某段時間用 in（in the morning）。"},
  {lv:0,topic:"介系詞",stem:"The cat is hiding ___ the sofa.",opts:["in","on","under","next to"],ans:2,explain:"躲在沙發下面，用 under。"},
  {lv:0,topic:"介系詞",stem:"There is a picture ___ the wall.",opts:["in","on","at","by"],ans:1,explain:"貼在牆上用 on the wall。"},
  {lv:0,topic:"介系詞",stem:"She will go to Japan ___ summer.",opts:["in","on","at","during"],ans:0,explain:"季節前用 in（in summer）。"},
  {lv:0,topic:"介系詞",stem:"We eat dinner ___ 7 p.m.",opts:["in","on","at","by"],ans:2,explain:"特定時刻 7 p.m. 前用 at。"},
  {lv:0,topic:"介系詞",stem:"The post office is ___ the bank and the school.",opts:["between","among","in","beside"],ans:0,explain:"兩者之間用 between。"},
  {lv:0,topic:"連接詞",stem:"I like cats ___ dogs.",opts:["but","or","and","so"],ans:2,explain:"並列兩個喜歡的東西，用 and。"},
  {lv:0,topic:"連接詞",stem:"She was tired, ___ she went to bed early.",opts:["but","or","and","so"],ans:3,explain:"前因後果，用 so（所以）。"},
  {lv:0,topic:"連接詞",stem:"Would you like tea ___ coffee?",opts:["and","but","or","so"],ans:2,explain:"在選擇問句中提供選項，用 or。"},
  {lv:0,topic:"連接詞",stem:"He is small ___ strong.",opts:["and","but","or","so"],ans:1,explain:"轉折關係，用 but（但是）。"},
  {lv:0,topic:"連接詞",stem:"I stayed home ___ it was raining.",opts:["and","but","or","because"],ans:3,explain:"表示原因，用 because（因為）。"},
  {lv:0,topic:"形容詞",stem:"This is a ___ bag.",opts:["beauty","beautiful","beautifully","beautify"],ans:1,explain:"修飾名詞 bag，用形容詞 beautiful。"},
  {lv:0,topic:"形容詞",stem:"She is very ___. She never tells lies.",opts:["honest","honesty","honestly","dishonest"],ans:0,explain:"be 動詞後用形容詞 honest（誠實的）。"},
  {lv:0,topic:"副詞",stem:"She speaks English very ___.",opts:["good","well","nice","fine"],ans:1,explain:"修飾動詞 speaks，用副詞 well。"},
  {lv:0,topic:"副詞",stem:"He runs ___.",opts:["quick","quickly","quickness","quicker"],ans:1,explain:"修飾動詞 runs，用副詞 quickly。"},
  {lv:0,topic:"副詞",stem:"She ___ forgets her homework.",opts:["never","ever","always","sometime"],ans:2,explain:"always 表示她總是忘記，符合語意。也可 never，但由語境判斷。"},
  {lv:0,topic:"比較級",stem:"Tom is ___ than Jerry.",opts:["tall","talls","taller","tallest"],ans:2,explain:"兩人比較用比較級，tall → taller。"},
  {lv:0,topic:"比較級",stem:"This test is ___ than the last one.",opts:["easy","easier","easiest","more easy"],ans:1,explain:"easy → easier，字尾 y 變 i 加 er。"},
  {lv:0,topic:"比較級",stem:"She is ___ student in the class.",opts:["good","better","best","the best"],ans:3,explain:"全班中最好，用最高級 the best。"},
  {lv:0,topic:"比較級",stem:"This movie is ___ interesting than that one.",opts:["more","most","much","many"],ans:0,explain:"多音節形容詞比較級用 more。"},
  {lv:0,topic:"最高級",stem:"She is ___ girl in the school.",opts:["pretty","prettier","prettiest","the prettiest"],ans:3,explain:"最高級要加 the，pretty → the prettiest。"},
  {lv:0,topic:"最高級",stem:"This is ___ book I have ever read.",opts:["an interesting","more interesting","the most interesting","most interesting"],ans:2,explain:"最高級前要加 the，多音節用 the most。"},
  {lv:0,topic:"指示代名詞",stem:"___ is my dog.",opts:["This","These","Those","They"],ans:0,explain:"指近處單數事物，用 This。"},
  {lv:0,topic:"指示代名詞",stem:"___ are my classmates.",opts:["This","That","These","She"],ans:2,explain:"指近處複數人物，用 These。"},
  {lv:0,topic:"指示代名詞",stem:"What are ___?",opts:["this","that","those","it"],ans:2,explain:"those 指遠處複數事物。"},
  {lv:0,topic:"there is/are",stem:"___ a cat under the table.",opts:["There is","There are","There have","There has"],ans:0,explain:"單數 a cat 用 There is。"},
  {lv:0,topic:"there is/are",stem:"___ many students in the library.",opts:["There is","There are","There have","There has"],ans:1,explain:"複數 many students 用 There are。"},
  {lv:0,topic:"there is/are",stem:"___ any milk in the fridge?",opts:["Is there","Are there","Have there","Do there"],ans:0,explain:"milk 不可數，疑問句用 Is there。"},
  {lv:0,topic:"頻率副詞",stem:"She ___ eats breakfast.",opts:["never","always","sometime","often"],ans:1,explain:"always 放在 be 動詞後、一般動詞前，語意通順。"},
  {lv:0,topic:"頻率副詞",stem:"I ___ watch TV on weekdays.",opts:["never","always","seldom","often"],ans:2,explain:"seldom 表示很少，符合合理語意。"},
  {lv:0,topic:"頻率副詞",stem:"He is ___ late for school.",opts:["never","always","sometime","often"],ans:0,explain:"never 表示他從不遲到。"},
  {lv:0,topic:"助動詞 can",stem:"She ___ speak three languages.",opts:["can","cans","is able","able"],ans:0,explain:"助動詞 can 後接原形動詞。"},
  {lv:0,topic:"助動詞 can",stem:"___ you help me, please?",opts:["Can","Cans","Do","Are"],ans:0,explain:"請求幫忙用 Can you...?"},
  {lv:0,topic:"助動詞 can",stem:"She ___ swim when she was five.",opts:["can","could","will","is"],ans:1,explain:"過去的能力用 could。"},
  {lv:0,topic:"助動詞 should",stem:"You ___ brush your teeth twice a day.",opts:["should","can","must","will"],ans:0,explain:"建議或應當做的事用 should。"},
  {lv:0,topic:"助動詞 must",stem:"Students ___ wear uniforms at school.",opts:["can","should","must","might"],ans:2,explain:"校規義務，用 must（必須）。"},
  {lv:0,topic:"助動詞 will",stem:"I ___ call you tomorrow.",opts:["will","am","do","have"],ans:0,explain:"表示未來計劃，用 will。"},
  {lv:0,topic:"助動詞 will",stem:"___ you close the window?",opts:["Will","Do","Are","Have"],ans:0,explain:"請求對方做某事，用 Will you...?"},
  {lv:0,topic:"現在式 vs 進行式",stem:"She ___ TV every evening.",opts:["watch","watches","is watching","are watching"],ans:1,explain:"every evening 表習慣，用現在式 watches。"},
  {lv:0,topic:"現在式 vs 進行式",stem:"Look! She ___ the piano.",opts:["plays","play","is playing","are playing"],ans:2,explain:"Look! 表示正在進行，用 is playing。"},
  {lv:0,topic:"現在式 vs 進行式",stem:"I ___ my homework right now.",opts:["do","does","am doing","are doing"],ans:2,explain:"right now 表正在進行，用 am doing。"},
  {lv:0,topic:"祈使句",stem:"___ quiet in the library.",opts:["Be","Are","Is","Am"],ans:0,explain:"祈使句用動詞原形，Be quiet 保持安靜。"},
  {lv:0,topic:"祈使句",stem:"___ run in the hallway.",opts:["Not","No","Don't","Doesn't"],ans:2,explain:"否定祈使句用 Don't + 原形動詞。"},
  {lv:0,topic:"祈使句",stem:"___ your hand before eating.",opts:["Wash","Washes","Washing","Washed"],ans:0,explain:"祈使句用動詞原形 Wash。"},
  {lv:0,topic:"感嘆句",stem:"___ beautiful flower this is!",opts:["What a","What an","How","What"],ans:0,explain:"感嘆句 What a + 形容詞 + 單數名詞。"},
  {lv:0,topic:"感嘆句",stem:"___ tall she is!",opts:["What a","What an","How","What"],ans:2,explain:"感嘆句 How + 形容詞/副詞，不接名詞。"},
  {lv:0,topic:"感嘆句",stem:"___ exciting game this is!",opts:["What a","What an","How","What"],ans:1,explain:"exciting 以母音開頭，用 What an。"},
  {lv:0,topic:"時間副詞",stem:"She goes to the gym ___ Mondays.",opts:["in","on","at","by"],ans:1,explain:"星期幾前面用介系詞 on。"},
  {lv:0,topic:"時間副詞",stem:"I was born ___ 2010.",opts:["in","on","at","by"],ans:0,explain:"年份前用 in。"},
  {lv:0,topic:"時間副詞",stem:"We will meet ___ noon.",opts:["in","on","at","by"],ans:2,explain:"特定時間點 noon 前用 at。"},
  {lv:0,topic:"There be 否定",stem:"There ___ any water in the bottle.",opts:["isn't","aren't","don't","doesn't"],ans:0,explain:"water 不可數，用 There isn't。"},
  {lv:0,topic:"There be 否定",stem:"There ___ any students in the room.",opts:["isn't","aren't","don't","doesn't"],ans:1,explain:"複數 students 用 There aren't。"},
  {lv:0,topic:"問句 wh-",stem:"___ does she live?",opts:["What","When","Where","Who"],ans:2,explain:"問住在哪裡，用 Where。"},
  {lv:0,topic:"問句 wh-",stem:"___ is your birthday?",opts:["What","When","Where","Who"],ans:1,explain:"問時間，用 When。"},
  {lv:0,topic:"問句 wh-",stem:"___ is your teacher?",opts:["What","When","Where","Who"],ans:3,explain:"問「誰」，用 Who。"},
  {lv:0,topic:"問句 wh-",stem:"___ is your favorite subject?",opts:["What","When","Where","Who"],ans:0,explain:"問「什麼」，用 What。"},
  {lv:0,topic:"問句 wh-",stem:"___ do you go to school?",opts:["What","When","Where","How"],ans:3,explain:"問「如何/怎麼」去，用 How。"},
  {lv:0,topic:"問句 wh-",stem:"___ books do you have?",opts:["How many","How much","How long","How often"],ans:0,explain:"book 可數，問數量用 How many。"},
  {lv:0,topic:"問句 wh-",stem:"___ water do you drink a day?",opts:["How many","How much","How long","How often"],ans:1,explain:"water 不可數，問數量用 How much。"},
  {lv:0,topic:"數量詞",stem:"There are ___ students in the class.",opts:["much","many","a little","a lots of"],ans:1,explain:"students 可數，用 many。"},
  {lv:0,topic:"數量詞",stem:"She drinks ___ water every day.",opts:["much","many","a few","lots"],ans:0,explain:"water 不可數，用 much（大量）。"},
  {lv:0,topic:"數量詞",stem:"I have ___ friends in this city.",opts:["a few","a little","much","many"],ans:0,explain:"friends 可數，少量用 a few。"},
  {lv:0,topic:"數量詞",stem:"There is only ___ sugar left.",opts:["a few","a little","many","much"],ans:1,explain:"sugar 不可數，少量用 a little。"},
  {lv:0,topic:"數量詞",stem:"She has ___ money to buy the toy.",opts:["enough","many","few","little"],ans:0,explain:"enough 修飾不可數名詞，表示足夠。"},
  {lv:0,topic:"可數與不可數",stem:"Can I have ___ information?",opts:["a","an","some","many"],ans:2,explain:"information 不可數，疑問/肯定句中用 some。"},
  {lv:0,topic:"可數與不可數",stem:"She bought ___ furniture.",opts:["a","an","some","many"],ans:2,explain:"furniture 不可數，用 some。"},
  {lv:0,topic:"及物與不及物",stem:"She ___ at me and walked away.",opts:["looked","watched","saw","stared"],ans:0,explain:"looked at 後接受詞，表示看著某人。"},
  {lv:0,topic:"反身代名詞",stem:"He hurt ___ while cooking.",opts:["he","him","his","himself"],ans:3,explain:"主詞和受詞同為 he，用反身代名詞 himself。"},
  {lv:0,topic:"反身代名詞",stem:"She made the cake by ___.",opts:["she","her","hers","herself"],ans:3,explain:"by oneself 表示「自己」做，用 herself。"},
  {lv:0,topic:"時態練習",stem:"She ___ TV when I called her.",opts:["watches","watched","was watching","is watching"],ans:2,explain:"電話時正在看電視，用過去進行式 was watching。"},
  {lv:0,topic:"時態練習",stem:"He ___ his homework before dinner.",opts:["finish","finishes","finished","has finish"],ans:2,explain:"before dinner 是過去，用過去式 finished。"},
  {lv:0,topic:"時態練習",stem:"I ___ to school on foot yesterday.",opts:["walk","walks","walked","walking"],ans:2,explain:"yesterday 表過去，用過去式 walked。"},
  {lv:0,topic:"過去式",stem:"She ___ her keys last night.",opts:["lose","loses","lost","losing"],ans:2,explain:"last night 是過去，lose 的過去式是 lost。"},
  {lv:0,topic:"過去式",stem:"They ___ a great time at the party.",opts:["have","has","had","having"],ans:2,explain:"at the party 是過去，have 的過去式是 had。"},
  {lv:0,topic:"過去式",stem:"He ___ up at 6 this morning.",opts:["wake","wakes","woke","woken"],ans:2,explain:"this morning 是過去，wake 的過去式是 woke。"},
  {lv:0,topic:"過去式",stem:"She ___ a letter to her friend.",opts:["write","writes","wrote","written"],ans:2,explain:"write 的過去式是 wrote。"},
  {lv:0,topic:"過去式",stem:"We ___ to the park last Sunday.",opts:["go","goes","went","gone"],ans:2,explain:"last Sunday 是過去，go 的過去式是 went。"},
  {lv:0,topic:"過去式否定",stem:"She ___ go to school yesterday.",opts:["don't","doesn't","didn't","wasn't"],ans:2,explain:"過去式否定助動詞用 didn't。"},
  {lv:0,topic:"過去式疑問",stem:"___ you watch the game last night?",opts:["Do","Does","Did","Were"],ans:2,explain:"過去式一般動詞疑問句用 Did。"},
  {lv:0,topic:"過去進行式",stem:"She ___ when the phone rang.",opts:["sleeps","slept","was sleeping","is sleeping"],ans:2,explain:"電話響時正在睡覺，用過去進行式 was sleeping。"},
  {lv:0,topic:"過去進行式",stem:"___ they playing football when it rained?",opts:["Do","Did","Were","Was"],ans:2,explain:"複數 they 過去進行式疑問句用 Were。"},
  {lv:0,topic:"未來式",stem:"She ___ visit her grandparents next week.",opts:["will","would","is","are"],ans:0,explain:"next week 表將來，用 will。"},
  {lv:0,topic:"未來式",stem:"___ you be free this weekend?",opts:["Will","Do","Are","Were"],ans:0,explain:"問將來是否有空，用 Will you...?"},
  {lv:0,topic:"未來式",stem:"She ___ going to study abroad next year.",opts:["is","are","was","were"],ans:0,explain:"be going to 表示計劃，she 用 is。"},
  {lv:0,topic:"未來式",stem:"I don't think it ___ rain tomorrow.",opts:["will","is","does","has"],ans:0,explain:"tomorrow 表將來，用 will。"},
  {lv:0,topic:"不定詞",stem:"She wants ___ a doctor.",opts:["be","being","to be","been"],ans:2,explain:"want 後接不定詞 to + 原形動詞。"},
  {lv:0,topic:"不定詞",stem:"It is important ___ healthy food.",opts:["eat","eating","to eat","eaten"],ans:2,explain:"It is + adj + to V，用不定詞。"},
  {lv:0,topic:"不定詞",stem:"He decided ___ hard.",opts:["study","studies","to study","studying"],ans:2,explain:"decide 後接不定詞 to + 原形動詞。"},
  {lv:0,topic:"動名詞",stem:"She enjoys ___ books.",opts:["read","reads","to read","reading"],ans:3,explain:"enjoy 後接動名詞 -ing。"},
  {lv:0,topic:"動名詞",stem:"___ is good for your health.",opts:["Swim","Swims","Swimming","To swimming"],ans:2,explain:"主詞位置用動名詞 Swimming。"},
  {lv:0,topic:"動名詞",stem:"He finished ___ his homework.",opts:["do","does","to do","doing"],ans:3,explain:"finish 後接動名詞 doing。"},
  {lv:0,topic:"動名詞",stem:"She is afraid of ___ alone.",opts:["walk","walks","to walk","walking"],ans:3,explain:"be afraid of 後接動名詞 walking。"},
  {lv:0,topic:"連綴動詞",stem:"The soup ___ delicious.",opts:["smells","smelling","is smelling","smelled"],ans:0,explain:"smell 作連綴動詞，後接形容詞。"},
  {lv:0,topic:"連綴動詞",stem:"She ___ tired after the long walk.",opts:["looks","looked","is look","be looking"],ans:1,explain:"past tense, look 作連綴動詞 → looked tired。"},
  {lv:0,topic:"連綴動詞",stem:"This cake ___ really good.",opts:["taste","tastes","tasting","is tasted"],ans:1,explain:"第三人稱單數 cake，taste → tastes。"},
  {lv:0,topic:"介系詞片語",stem:"She is interested ___ music.",opts:["in","on","at","to"],ans:0,explain:"be interested in 是固定搭配。"},
  {lv:0,topic:"介系詞片語",stem:"He is good ___ math.",opts:["in","on","at","to"],ans:2,explain:"be good at 是固定搭配。"},
  {lv:0,topic:"介系詞片語",stem:"She is afraid ___ dogs.",opts:["in","on","of","to"],ans:2,explain:"be afraid of 是固定搭配。"},
  {lv:0,topic:"介系詞片語",stem:"He is different ___ his brother.",opts:["from","of","to","in"],ans:0,explain:"be different from 是固定搭配。"},
  {lv:0,topic:"介系詞片語",stem:"She is proud ___ her daughter.",opts:["in","on","of","to"],ans:2,explain:"be proud of 是固定搭配。"},
  {lv:0,topic:"形容詞順序",stem:"She has a ___ dog.",opts:["small white cute","cute small white","cute white small","white small cute"],ans:1,explain:"形容詞順序：感受→大小→顏色，cute small white。"},
  {lv:0,topic:"主動被動辨別",stem:"The window ___ by the wind.",opts:["broke","breaks","was broken","is breaking"],ans:2,explain:"窗戶被風打破，被動語態 was broken。"},
  {lv:0,topic:"主動被動辨別",stem:"The letter ___ by her mother.",opts:["write","writes","was written","is writing"],ans:2,explain:"信被母親寫，被動語態 was written。"},
  {lv:0,topic:"頻率副詞位置",stem:"She ___ is late for school.",opts:["never","always","sometime","often"],ans:0,explain:"never 放 be 動詞後，語意合理。"},
  {lv:0,topic:"頻率副詞位置",stem:"He ___ eats breakfast.",opts:["always","sometime","ever","rarely"],ans:0,explain:"always 在一般動詞前，語意合理。"},
  {lv:0,topic:"問短答",stem:"Are you hungry? — Yes, ___ am.",opts:["I","you","she","he"],ans:0,explain:"肯定回答用 Yes, I am。"},
  {lv:0,topic:"問短答",stem:"Does she like coffee? — No, ___ doesn't.",opts:["I","she","her","hers"],ans:1,explain:"短答主詞一致，用 she。"},
  {lv:0,topic:"問短答",stem:"Can you swim? — Yes, ___ can.",opts:["I","you","she","he"],ans:0,explain:"問 you，答 Yes, I can。"},
  {lv:0,topic:"問短答",stem:"Did they go to school? — Yes, ___ did.",opts:["they","them","their","theirs"],ans:0,explain:"短答用主格 they。"},
  {lv:0,topic:"連接詞 when",stem:"___ she was young, she loved dancing.",opts:["While","When","Because","Although"],ans:1,explain:"表達「當她年幼時」，用 When。"},
  {lv:0,topic:"連接詞 because",stem:"I stayed home ___ I was sick.",opts:["and","but","or","because"],ans:3,explain:"because 表原因（因為）。"},
  {lv:0,topic:"連接詞 if",stem:"___ it rains, we will cancel the trip.",opts:["When","If","Although","Because"],ans:1,explain:"條件句用 If。"},
  {lv:0,topic:"連接詞 although",stem:"___ she was tired, she kept working.",opts:["If","Because","Although","When"],ans:2,explain:"Although 表雖然（讓步）。"},
  {lv:0,topic:"so...that",stem:"She was ___ tired that she fell asleep.",opts:["such","so","very","too"],ans:1,explain:"so + 形容詞 + that 表示「如此...以至於」。"},
  {lv:0,topic:"too...to",stem:"He is ___ short to reach the shelf.",opts:["so","too","very","such"],ans:1,explain:"too + 形容詞 + to V，表太...而不能。"},
  {lv:0,topic:"enough to",stem:"She is old ___ to drive a car.",opts:["for","enough","too","so"],ans:1,explain:"形容詞 + enough + to V，表足夠...能做某事。"},
  {lv:0,topic:"either...or",stem:"___ Tom or Jerry will go to the party.",opts:["Both","Either","Neither","Not"],ans:1,explain:"Either...or 表「不是...就是...」二選一。"},
  {lv:0,topic:"both...and",stem:"___ Tom and Jerry like pizza.",opts:["Both","Either","Neither","Not"],ans:0,explain:"Both...and 表兩者都。"},
  {lv:0,topic:"neither...nor",stem:"___ she nor her brother likes carrots.",opts:["Both","Either","Neither","Not"],ans:2,explain:"Neither...nor 表兩者都不。"},
  {lv:0,topic:"not only...but also",stem:"She is not only smart ___ hardworking.",opts:["but also","and","so","or"],ans:0,explain:"Not only...but also 表示「不只...也...」。"},
  {lv:0,topic:"There be 過去式",stem:"___ a cat on the roof last night.",opts:["There is","There are","There was","There were"],ans:2,explain:"last night 是過去，單數 a cat 用 There was。"},
  {lv:0,topic:"There be 過去式",stem:"___ many people at the concert.",opts:["There is","There are","There was","There were"],ans:3,explain:"many people 複數，過去用 There were。"},
  {lv:0,topic:"名詞子句",stem:"I know ___ she is right.",opts:["what","if","that","which"],ans:2,explain:"I know that... 用 that 引導名詞子句。"},
  {lv:0,topic:"關係代名詞",stem:"The boy ___ won the race is my brother.",opts:["which","whose","who","whom"],ans:2,explain:"先行詞是人 the boy，關係代名詞用 who。"},
  {lv:0,topic:"關係代名詞",stem:"The book ___ she borrowed is mine.",opts:["who","whose","that","whom"],ans:2,explain:"先行詞是物 the book，可用 that 或 which。"},
  {lv:0,topic:"關係代名詞",stem:"The girl ___ mother is a doctor is in my class.",opts:["who","whose","which","that"],ans:1,explain:"先行詞是人，後接名詞，用所有格 whose。"},
  {lv:0,topic:"分詞形容詞",stem:"The movie was very ___.",opts:["bore","boring","bored","bores"],ans:1,explain:"電影讓人無聊，主動含義用 boring。"},
  {lv:0,topic:"分詞形容詞",stem:"She felt ___ after the long trip.",opts:["tire","tiring","tired","tires"],ans:2,explain:"她感到疲倦，被動含義用 tired。"},
  {lv:0,topic:"分詞形容詞",stem:"The news was very ___.",opts:["excite","exciting","excited","excites"],ans:1,explain:"消息令人興奮，主動含義用 exciting。"},
  {lv:0,topic:"主詞一致",stem:"The number of students ___ increasing.",opts:["are","were","is","have"],ans:2,explain:"the number of... 作主詞，視為單數，用 is。"},
  {lv:0,topic:"主詞一致",stem:"A number of students ___ absent today.",opts:["is","was","are","has"],ans:2,explain:"a number of... 意為「許多」，視為複數，用 are。"},
  {lv:0,topic:"主詞一致",stem:"Everyone in the class ___ passed the test.",opts:["have","has","are","were"],ans:1,explain:"Everyone 是單數，用 has。"},
  {lv:0,topic:"主詞一致",stem:"Neither of them ___ ready.",opts:["are","were","is","have"],ans:2,explain:"Neither 視為單數，用 is。"},
  {lv:0,topic:"時態一致",stem:'She said, "I ___ happy."',opts:["am","was","is","were"],ans:0,explain:"直接引語保持原時態，用 am。"},
  {lv:0,topic:"主動語態",stem:"The chef ___ the cake.",opts:["bake","bakes","baked","was baked"],ans:2,explain:"主動語態過去式，bake → baked。"},
  {lv:0,topic:"被動語態",stem:"The cake ___ by the chef.",opts:["bake","bakes","baked","was baked"],ans:3,explain:"被動語態過去式：was + 過去分詞。"},
  {lv:0,topic:"現在完成式",stem:"I ___ already eaten dinner.",opts:["have","has","had","am"],ans:0,explain:"主詞是 I，現在完成式用 have。"},
  {lv:0,topic:"現在完成式",stem:"She ___ never visited Japan.",opts:["have","has","had","is"],ans:1,explain:"主詞是 she（第三人稱單數），用 has。"},
  {lv:0,topic:"現在完成式",stem:"They ___ lived here for ten years.",opts:["have","has","had","are"],ans:0,explain:"複數 they，現在完成式用 have。"},
  {lv:0,topic:"現在完成式",stem:"He has ___ the book three times.",opts:["read","reads","reading","to read"],ans:0,explain:"has 後接過去分詞，read 的過去分詞也是 read。"},
  {lv:0,topic:"現在完成式 since/for",stem:"She has lived here ___ 2015.",opts:["for","since","during","in"],ans:1,explain:"2015 是時間點，用 since。"},
  {lv:0,topic:"現在完成式 since/for",stem:"He has studied English ___ five years.",opts:["for","since","during","in"],ans:0,explain:"five years 是一段時間，用 for。"},
  {lv:0,topic:"現在完成式 yet/already",stem:"Have you finished your homework ___?",opts:["yet","already","still","just"],ans:0,explain:"yet 用於否定句和疑問句，表「已（否）」。"},
  {lv:0,topic:"現在完成式 yet/already",stem:"She has ___ left.",opts:["yet","already","still","just"],ans:1,explain:"already 用於肯定句，表「已經」。"},
  {lv:0,topic:"句型 let",stem:"Let ___ help you.",opts:["I","me","my","mine"],ans:1,explain:"Let 後接受格代名詞 me。"},
  {lv:0,topic:"句型 make",stem:"She makes her son ___ his room.",opts:["clean","cleans","cleaning","to clean"],ans:0,explain:"make + 受詞 + 原形動詞（不加 to）。"},
  {lv:0,topic:"句型 help",stem:"He helped me ___ the problem.",opts:["solve","solves","solving","to solve"],ans:0,explain:"help + 受詞 + 原形動詞（to 可加可不加，一般不加）。"},
  {lv:0,topic:"句型 want + O + to V",stem:"She wants him ___ the truth.",opts:["tell","tells","telling","to tell"],ans:3,explain:"want + 受詞 + to V，用不定詞。"},
  {lv:0,topic:"句型 ask + O + to V",stem:"The teacher asked us ___ quiet.",opts:["be","to be","being","been"],ans:1,explain:"ask + 受詞 + to V，用不定詞。"},
  {lv:0,topic:"句型 tell + O + to V",stem:"Mom told me ___ home early.",opts:["come","comes","to come","coming"],ans:2,explain:"tell + 受詞 + to V，用不定詞。"},
  {lv:0,topic:"感官動詞",stem:"I heard her ___ her name.",opts:["call","calls","called","calling"],ans:3,explain:"感官動詞 hear + 受詞 + Ving（正在進行）。"},
  {lv:0,topic:"感官動詞",stem:"She saw him ___ across the street.",opts:["run","runs","to run","running"],ans:3,explain:"see + 受詞 + Ving，表示正在跑。"},
  {lv:0,topic:"with 介系詞片語",stem:"She sat there ___ her eyes closed.",opts:["with","by","of","in"],ans:0,explain:"with + 名詞 + 形容詞/分詞，表附帶狀況。"},
  {lv:0,topic:"片語動詞",stem:"Please ___ the light before leaving.",opts:["turn on","turn off","turn up","turn down"],ans:1,explain:"離開前關燈，用 turn off。"},
  {lv:0,topic:"片語動詞",stem:"I need to ___ early tomorrow.",opts:["get up","get on","get in","get out"],ans:0,explain:"明天要早起，用 get up。"},
  {lv:0,topic:"片語動詞",stem:"She ___ her mother in appearance.",opts:["takes after","takes off","takes up","takes over"],ans:0,explain:"take after 表示「長得像」某人。"},
  {lv:0,topic:"片語動詞",stem:"He ___ a new hobby last year.",opts:["took after","took off","took up","took over"],ans:2,explain:"take up 表示「開始從事」某嗜好。"},
  {lv:0,topic:"倒裝句練習",stem:"___ I know the answer!",opts:["Little","A little","Less","Least"],ans:0,explain:"Little 置句首，後面倒裝，表強調「我根本不知道答案！」。"},
  {lv:0,topic:"附加問句",stem:"She is smart, ___ she?",opts:["isn't","is","doesn't","does"],ans:0,explain:"前面是肯定句 she is，附加問句用否定 isn't she。"},
  {lv:0,topic:"附加問句",stem:"They don't like fish, ___ they?",opts:["do","don't","are","aren't"],ans:0,explain:"前面是否定句，附加問句用肯定 do they。"},
  {lv:0,topic:"附加問句",stem:"He went to the party, ___ he?",opts:["did","didn't","does","doesn't"],ans:1,explain:"前面是肯定過去式，附加問句用否定 didn't he。"},
  {lv:0,topic:"直接/間接引語",stem:'She said, "I like cats." → She said ___ she liked cats.',opts:["what","that","if","which"],ans:1,explain:"直述句間接引語用 that 連接。"},
  {lv:0,topic:"直接/間接引語",stem:'He asked, "Are you okay?" → He asked ___ I was okay.',opts:["that","what","if","which"],ans:2,explain:"是非疑問句間接引語用 if/whether。"},
  {lv:0,topic:"數字基數/序數",stem:"She lives on the ___ floor.",opts:["three","third","thirty","thirtieth"],ans:1,explain:"floor 前用序數，three → third。"},
  {lv:0,topic:"數字基數/序數",stem:"Today is the ___ of May.",opts:["ten","tenth","ten's","tens"],ans:1,explain:"日期用序數，ten → tenth。"},
  {lv:1,topic:"過去簡單式",stem:"She ___ to Paris last summer.",opts:["go","goes","went","has gone"],ans:2,explain:"last summer 是過去，用過去簡單式 went。"},
  {lv:1,topic:"現在完成式",stem:"I ___ never eaten sushi before.",opts:["have","has","had","did"],ans:0,explain:"主詞 I 用 have，搭配 never 表示到目前為止的經驗。"},
  {lv:1,topic:"比較級",stem:"This bag is ___ than that one.",opts:["heavy","heavier","heaviest","most heavy"],ans:1,explain:"兩個事物比較用比較級，heavy → heavier。"},
  {lv:1,topic:"被動語態",stem:"The window ___ by the storm last night.",opts:["broke","breaks","was broken","is broken"],ans:2,explain:"last night 是過去，被動語態用 was + 過去分詞。"},
  {lv:1,topic:"不定詞",stem:"She wants ___ a doctor in the future.",opts:["be","being","to be","been"],ans:2,explain:"want 後面接不定詞 to + 原形動詞。"},
  {lv:1,topic:"連接詞",stem:"I studied hard, ___ I passed the exam.",opts:["but","so","because","although"],ans:1,explain:"前因後果，用 so 表示「因此」。"},
  {lv:1,topic:"關係代名詞",stem:"The girl ___ sits next to me is my best friend.",opts:["which","whose","who","whom"],ans:2,explain:"先行詞是人（girl），用 who 引導關係子句。"},
  {lv:1,topic:"助動詞",stem:"You ___ wear a seatbelt. It's the law.",opts:["can","should","must","might"],ans:2,explain:"表示義務，用 must。"},
  {lv:2,topic:"假設語氣",stem:"If I ___ rich, I would travel the world.",opts:["am","was","were","be"],ans:2,explain:"與現在事實相反，if 子句用 were（不論人稱）。"},
  {lv:2,topic:"分詞構句",stem:"___ the homework, she went out to play.",opts:["Finish","Finishing","Finished","To finish"],ans:1,explain:"表示完成動作後，分詞構句用現在分詞 Finishing。"},
  {lv:2,topic:"倒裝句",stem:"Not only ___ he late, but he also forgot his homework.",opts:["was","is","did","does"],ans:0,explain:"否定副詞 Not only 置首，後面倒裝，過去式用 was。"},
  {lv:2,topic:"名詞子句",stem:"I don't know ___ she will come to the party.",opts:["that","what","whether","which"],ans:2,explain:"不確定的事情用 whether（是否），引導名詞子句。"},
  {lv:2,topic:"形容詞子句",stem:"The book ___ cover is red belongs to me.",opts:["who","whose","which","that"],ans:1,explain:"關係詞後接名詞（cover），所有格用 whose。"},
  {lv:2,topic:"副詞子句",stem:"She left early ___ she could catch the last train.",opts:["so that","even though","as long as","in case"],ans:0,explain:"表目的，用 so that（以便）。"},
  {lv:2,topic:"時態一致",stem:"He said that he ___ very tired.",opts:["is","will be","was","has been"],ans:2,explain:"主句是過去式 said，從句時態退一格，用 was。"},
];

let currentUser="",currentUserDisplay="",currentUserId="",currentUserGrade="国一",vLevel=0,vIdx=0,vAnswered=[],vScore=0,vRevealed=[],vPool=[],vAutoTimer=null,autoNext=true,vocabTabActive=false;
let sLevel=0,sIdx=0,sAnswered=[],sScore=0,sPool=[],sHinted=[],sAutoNext=true,sAutoTimer=null;
let gLevel=0,gIdx=0,gAnswered=[],gScore=0,gPool=[],gAutoNext=true,gAutoTimer=null;
let mLevel=0,myWords=[],myFilter=-1,todaySeenWords={};
let chartRange=7;
let stats={totalDays:0,streak:0,cV:0,tV:0,cS:0,tS:0,cG:0,tG:0,week:new Array(30).fill(0)};

function S(id){return document.getElementById(id)}
function showScreen(id){document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));S(id).classList.add("active")}

// ── 登入 / 登出 / 註冊 ────────────────────────────────────────

// 切換登入/註冊表單 Tab
function switchLoginTab(tab){
  const isLogin=(tab==='login');
  S('loginForm').style.display   = isLogin?'block':'none';
  S('registerForm').style.display= isLogin?'none':'block';
  S('ltab-login').classList.toggle('active',isLogin);
  S('ltab-reg').classList.toggle('active',!isLogin);
  S('lerr').style.display='none';
  S('rerr').style.display='none';
  S('rsuc').style.display='none';
}

// ── 登入 ─────────────────────────────────────────────────────
async function doLogin(){
  const u=S("lu").value.trim(), p=S("lp").value.trim();
  if(!u||!p){showLoginErr('請輸入帳號和密碼');return;}

  const btn=S('btnLogin');
  btn.disabled=true; btn.textContent='登入中…';

  try{
    const sb=getSB();
    if(!sb){
      // 離線備用：示範用，允許任意帳號 / 密碼 "1234"
      if(p==='1234'){S("lerr").style.display="none";currentUser=u;currentUserDisplay=u;initMain();}
      else showLoginErr('帳號或密碼錯誤，請再試一次');
      return;
    }

    const hash = await sha256(p);
    const {data, error} = await sb.rpc('verify_login',{
      p_username: u,
      p_hash: hash
    });

    if(error){showLoginErr('登入失敗：'+error.message);return;}
    if(!data||data.length===0){showLoginErr('帳號或密碼錯誤，請再試一次');return;}

    const user=data[0];
    if(user.status==='pending'){
      showLoginErr('帳號尚未審核，請等待管理員批准');return;
    }
    if(user.status==='rejected'){
      showLoginErr('帳號已被拒絕，請聯絡管理員');return;
    }

    // 登入成功
    S("lerr").style.display="none";
    currentUser        = u;
    currentUserDisplay = user.display_name;
    currentUserId      = user.id;
    currentUserGrade   = user.grade;
    initMain();

  }catch(e){
    showLoginErr('網路錯誤，請稍後再試');
    console.error(e);
  }finally{
    btn.disabled=false; btn.textContent='登入';
  }
}

function showLoginErr(msg){
  const el=S('lerr'); el.textContent=msg; el.style.display='block';
}

// ── 註冊 ─────────────────────────────────────────────────────
async function doRegister(){
  const username    = S('ru').value.trim();
  const displayName = S('rname').value.trim();
  const grade       = S('rgrade').value;
  const pass        = S('rp').value.trim();
  const pass2       = S('rp2').value.trim();

  S('rerr').style.display='none';
  S('rsuc').style.display='none';

  if(!username||!displayName||!pass){showRegErr('請填寫所有欄位');return;}
  if(!/^[a-zA-Z0-9_\-\.]{3,20}$/.test(username)){
    showRegErr('帳號只能含英文字母/數字，長度 3-20 字元');return;
  }
  if(pass.length<6){showRegErr('密碼至少 6 個字元');return;}
  if(pass!==pass2){showRegErr('兩次密碼不一致');return;}

  const btn=S('btnRegister');
  btn.disabled=true; btn.textContent='送出中…';

  try{
    const sb=getSB();
    if(!sb){showRegErr('無法連線到伺服器，請確認網路');return;}

    const hash = await sha256(pass);
    const {error} = await sb.from('vocab_users').insert({
      username,
      display_name: displayName,
      password_hash: hash,
      grade,
      status: 'pending',
      is_admin: false
    });

    if(error){
      if(error.code==='23505') showRegErr('此帳號已被使用，請換一個');
      else showRegErr('註冊失敗：'+error.message);
      return;
    }

    // 成功
    S('rsuc').style.display='block';
    S('ru').value=''; S('rname').value=''; S('rp').value=''; S('rp2').value='';

  }catch(e){
    showRegErr('網路錯誤，請稍後再試');
    console.error(e);
  }finally{
    btn.disabled=false; btn.textContent='送出申請';
  }
}

function showRegErr(msg){
  const el=S('rerr'); el.textContent=msg; el.style.display='block';
}

// 按 Enter 觸發登入
document.addEventListener('DOMContentLoaded',()=>{
  const lp=S("lp");
  if(lp) lp.addEventListener("keydown",e=>{if(e.key==="Enter")doLogin()});
});

function doLogout(){
  currentUser=''; currentUserDisplay=''; currentUserId=''; currentUserGrade='';
  showScreen("loginScreen");
  S("lu").value=""; S("lp").value="";
  switchLoginTab('login');
}

function initMain(){
  loadData();
  S("userLabel").textContent=currentUserDisplay||currentUser;
  S("streakLabel").textContent="🔥 "+stats.streak+"天";
  showScreen("mainScreen");
  vocabTabActive=false;
  document.querySelectorAll(".tab-content").forEach(t=>t.style.display="none");
  S("tab-stats").style.display="block";
  document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));
  document.querySelector('.tab[onclick*="stats"]').classList.add("active");
  // Apply saved CEFR level to all practice areas
  if(stats.cefrLevel){
    const lv={"A1":0,"A2":0,"B1":1,"B2":1,"C1":2,"C2":2}[stats.cefrLevel]??0;
    vLevel=lv;sLevel=lv;gLevel=lv;
    ["#ptab-content-vocab .lbtn","#ptab-content-spell .lbtn","#ptab-content-grammar .lbtn"].forEach(sel=>{
      document.querySelectorAll(sel).forEach((b,i)=>b.classList.toggle("active",i===lv));
    });
    S("levelBadge").textContent=LV[lv];
  }
  initVocab();initSpell();initGrammar();renderMyWords();renderStats();
  // Show last placement result if exists
  if(stats.placementResult){
    const pl=S("ptLastResult"),ps=S("ptLastScore");
    if(pl)pl.style.display="block";
    if(ps)ps.textContent=stats.placementResult.cefr+" · "+stats.placementResult.pct+"% · "+stats.placementResult.date;
  }
}
function loadData(){
  try{
    const d=JSON.parse(localStorage.getItem("engapp4_"+currentUser)||"{}");
    myWords=d.myWords||[];
    todaySeenWords=d.todaySeenWords||{};
    const savedStats=d.stats||{};if(!savedStats.week||savedStats.week.length<30){savedStats.week=new Array(30).fill(0);}
stats=Object.assign({totalDays:0,streak:0,cV:0,tV:0,cS:0,tS:0,cG:0,tG:0,week:new Array(30).fill(0),tV_today:0,tS_today:0,tG_today:0,cV_today:0,cS_today:0,cG_today:0,gramErrors:{},cefrLevel:"",gradeSetting:"",placementResult:null},savedStats);
    const today=new Date().toDateString();
    if(d.lastDay!==today){
      stats.streak=(d.lastDay===new Date(Date.now()-86400000).toDateString())?stats.streak+1:1;
      stats.totalDays++;if(!stats.week||stats.week.length<30)stats.week=new Array(30).fill(0);stats.week.shift();stats.week.push(0);
      stats.tV_today=0;stats.tS_today=0;stats.tG_today=0;
      stats.cV_today=0;stats.cS_today=0;stats.cG_today=0;
      missionFireSent=false;chartRange=7;
      saveData(today);
    }
  }catch(e){myWords=[];todaySeenWords={};stats={totalDays:1,streak:1,cV:0,tV:0,cS:0,tS:0,cG:0,tG:0,week:[0,0,0,0,0,0,0]}}
}
function saveData(today){localStorage.setItem("engapp4_"+currentUser,JSON.stringify({myWords,stats,todaySeenWords,lastDay:today||new Date().toDateString()}))}

function switchTab(name,btn){
  // 'vocab','spell','grammar','reading' now live inside 'practice'
  const practiceSubTabs=["vocab","spell","grammar","reading"];
  if(practiceSubTabs.includes(name)){
    switchTab("practice", document.querySelector('.tab[onclick*="practice"]'));
    switchPTab(name, S("ptab-btn-"+name));
    return;
  }
  vocabTabActive=(name==="practice");
  if(name!=="practice"&&speechSynthesis)speechSynthesis.cancel();
  document.querySelectorAll(".tab-content").forEach(d=>d.style.display="none");
  document.querySelectorAll(".tab").forEach(b=>b.classList.remove("active"));
  const el=S("tab-"+name);
  if(el)el.style.display="block";
  if(btn)btn.classList.add("active");
  if(name==="stats"){renderStats();renderCEFR();refreshPlacementEntryCard();}
  if(name==="practice"){
    // activate whichever ptab is current
    const active=document.querySelector(".ptab.active");
    const curPTab=active?active.id.replace("ptab-btn-",""):"vocab";
    switchPTab(curPTab,active);
  }
  if(name==="manage"){renderWordList();}
}

function switchPTab(name,btn){
  document.querySelectorAll(".ptab-content").forEach(d=>d.style.display="none");
  document.querySelectorAll(".ptab").forEach(b=>{
    b.classList.remove("active");
    b.style.background="none";b.style.border="none";b.style.color="#5F5E5A";b.style.fontWeight="500";
  });
  const el=S("ptab-content-"+name);
  if(el)el.style.display="block";
  if(btn){
    btn.classList.add("active");
    btn.style.background="#fff";btn.style.border="1px solid #B4B2A9";btn.style.color="#2C2C2A";btn.style.fontWeight="600";
  }
  if(name==="vocab"){initVocab();}
  if(name==="spell"){initSpell();}
  if(name==="grammar"){initGrammar();}
  if(name==="reading"){backToReadingSelector();}
}

function openPlacementModal(){
  const m=S("placementModal");if(!m)return;
  m.style.display="block";
  document.body.style.overflow="hidden";
  S("pm-home").style.display="block";
  S("pm-test").style.display="none";
  S("pm-result").style.display="none";
  if(stats.placementResult){
    const pl=S("ptLastResult"),ps=S("ptLastScore");
    if(pl)pl.style.display="block";
    if(ps)ps.textContent=stats.placementResult.cefr+" · "+stats.placementResult.pct+"% · "+stats.placementResult.date;
  }
}
function closePlacementModal(){
  const m=S("placementModal");if(!m)return;
  m.style.display="none";document.body.style.overflow="";
}
function refreshPlacementEntryCard(){
  if(stats.placementResult){
    const c2=S("ptLastResult2"),s2=S("ptLastScore2");
    if(c2)c2.style.display="block";
    if(s2)s2.textContent=stats.placementResult.cefr+" · "+stats.placementResult.pct+"% · "+stats.placementResult.date;
  }
}

function getPool(lv){
  const all=[...BUILTIN,...myWords].filter(v=>v.lv===lv);
  return [...all].sort(()=>Math.random()-0.5).slice(0,10);
}
function countByLevel(lv){return [...BUILTIN,...myWords].filter(v=>v.lv===lv).length}

function setLevel(lv,btn){vLevel=lv;document.querySelectorAll("#ptab-content-vocab .lbtn").forEach(b=>b.classList.remove("active"));btn.classList.add("active");S("levelBadge").textContent=LV[lv];initVocab()}
function setSLevel(lv,btn){sLevel=lv;document.querySelectorAll("#ptab-content-spell .lbtn").forEach(b=>b.classList.remove("active"));btn.classList.add("active");initSpell()}
function setGLevel(lv,btn){gLevel=lv;document.querySelectorAll("#ptab-content-grammar .lbtn").forEach(b=>b.classList.remove("active"));btn.classList.add("active");initGrammar()}
function setMLevel(lv){mLevel=lv;["mL0","mL1","mL2"].forEach((id,i)=>S(id).classList.toggle("active",i===lv))}

function toggleAutoNext(){
  autoNext=!autoNext;
  S("autoNextBtn").textContent="⚡ 自動切換："+(autoNext?"開":"關");
  S("autoNextBtn").style.background=autoNext?"#E1F5EE":"#F1EFE8";
  S("autoNextBtn").style.color=autoNext?"#085041":"#888780";
  S("autoNextBtn").style.borderColor=autoNext?"#1D9E75":"#D3D1C7";
}

function initVocab(){
  const allPool=[...BUILTIN,...myWords].filter(v=>v.lv===vLevel);
  const today=new Date().toDateString();
  if(!todaySeenWords[today])todaySeenWords[today]={};
  const todaySeen=todaySeenWords[today];
  const wrongWords=allPool.filter(v=>todaySeen[v.w]==="wrong");
  const unseen=allPool.filter(v=>!todaySeen[v.w]);
  const combined=[...wrongWords,...unseen].sort(()=>Math.random()-0.5);
  vPool=combined.slice(0,10);
  vIdx=0;vAnswered=new Array(vPool.length).fill(null);vRevealed=new Array(vPool.length).fill(false);vScore=0;vAutoTimer=null;
  S("vPoolCount").textContent="詞庫共 "+countByLevel(vLevel)+" 個";
  renderVocab();
}

function renderVocab(){
  if(!vPool.length){S("quizBlock").innerHTML="<p class='empty'>此難度沒有單字</p>";S("revealBlock").style.display="none";return}
  if(vAutoTimer){clearTimeout(vAutoTimer);vAutoTimer=null;}
  const v=vPool[vIdx];
  S("vWord").textContent=v.w;S("vPhonetic").textContent=v.ph||"";S("vPos").textContent=v.pos;S("vMeaning").textContent=v.zh;
  const _cc={"A1":"#27500A","A2":"#0C447C","B1":"#633806","B2":"#534AB7","C1":"#7D2D7A"};
  const _cb={"A1":"#EAF3DE","A2":"#E6F1FB","B1":"#FAEEDA","B2":"#EEEDFE","C1":"#F5ECFE"};
  const _ce=S("vCEFR");if(_ce&&v.cefr){_ce.textContent=v.cefr;_ce.style.background=_cb[v.cefr]||"#F1EFE8";_ce.style.color=_cc[v.cefr]||"#444";}
  S("vExample").innerHTML=v.ex.replace(/\*(.*?)\*/g,"<em style='color:#3C3489;font-style:normal;font-weight:600'>$1</em>");
  S("vProgressText").textContent="第 "+(vIdx+1)+" / "+vPool.length+" 個單字";
  S("vProgress").style.width=(((vIdx+1)/vPool.length)*100)+"%";
  S("vPrev").disabled=vIdx===0;
  const last=vIdx===vPool.length-1;
  S("vNext").textContent=last?"完成練習 ✓":"下一個 →";S("vNext").onclick=last?finishVocab:()=>vGo(1);
  S("vFeedback").textContent="";S("vFeedback").className="feedback";
  const rev=vRevealed[vIdx];
  S("quizBlock").style.display=rev?"none":"block";S("revealBlock").style.display=rev?"block":"none";
  if(!rev)renderVQuiz();
  if(vocabTabActive)setTimeout(()=>speak('v'),400);
}

function renderVQuiz(){
  const v=vPool[vIdx],opts=buildOpts(vIdx),grid=S("quizOpts"),ans=vAnswered[vIdx];
  grid.innerHTML="";
  opts.forEach((o,i)=>{
    const b=document.createElement("button");b.className="opt-btn";b.textContent=o;
    if(ans!==null){
      b.disabled=true;
      if(o===v.zh)b.classList.add("correct");else if(i===ans&&o!==v.zh)b.classList.add("wrong");
      const ok=opts[ans]===v.zh;
      S("vFeedback").textContent=ok?(autoNext?"✓ 答對了！":"✓ 答對了！太棒了！"):"✗ 答錯了，繼續加油！";
      S("vFeedback").className="feedback "+(ok?"fok":"fno");
    } else b.onclick=()=>checkV(i,opts,v.zh);
    grid.appendChild(b);
  });
}

function buildOpts(idx){
  const correct=vPool[idx].zh;
  const others=[...new Set([...BUILTIN,...myWords].map(v=>v.zh).filter(z=>z!==correct))].sort(()=>Math.random()-0.5).slice(0,3);
  return [...others,correct].sort(()=>Math.random()-0.5);
}

function checkV(chosen,opts,correct){
  const ok=opts[chosen]===correct;
  vAnswered[vIdx]=chosen;
  if(ok){vScore++;stats.cV++}stats.tV++;stats.week[stats.week.length-1]++;
  const today=new Date().toDateString();
  if(!todaySeenWords[today])todaySeenWords[today]={};
  todaySeenWords[today][vPool[vIdx].w]=ok?"ok":"wrong";
  stats.tV_today=(stats.tV_today||0)+1;
  if(ok)stats.cV_today=(stats.cV_today||0)+1;
  saveData();renderStats();
  document.querySelectorAll("#quizOpts .opt-btn").forEach((b,i)=>{
    b.disabled=true;
    if(opts[i]===correct)b.classList.add("correct");else if(i===chosen&&opts[i]!==correct)b.classList.add("wrong");
  });
  if(ok){
    const last=vIdx===vPool.length-1;
    if(autoNext){
      S("vFeedback").textContent="✓ 答對了！2秒後自動切換…";S("vFeedback").className="feedback fok";
      vAutoTimer=setTimeout(()=>{vAutoTimer=null;if(last)finishVocab();else vGo(1);},2000);
    } else {
      S("vFeedback").textContent="✓ 答對了！太棒了！";S("vFeedback").className="feedback fok";
    }
  } else {
    S("vFeedback").textContent="✗ 答錯了，繼續加油！";S("vFeedback").className="feedback fno";
  }
}

function revealMeaning(){vRevealed[vIdx]=true;S("quizBlock").style.display="none";S("revealBlock").style.display="block"}
function vGo(dir){vIdx=Math.max(0,Math.min(vPool.length-1,vIdx+dir));renderVocab()}
function vGoNext(){S("vNext").onclick()}

function finishVocab(){
  const pct=vPool.length?Math.round(vScore/vPool.length*100):0;
  let msg=pct>=80?"🎉 太厲害了！繼續保持！":pct>=60?"😊 不錯喔！再加把勁！":pct>=40?"🙂 有進步空間，繼續努力！":"💪 別灰心，多練習就會進步！";
  const ds=buildDailyStats();
  showResultModal(vScore,vPool.length,pct,msg,ds);
}

function speak(ctx){
  const w=ctx==='v'?vPool[vIdx]?.w:sPool[sIdx]?.w;if(!w)return;
  if('speechSynthesis' in window){const u=new SpeechSynthesisUtterance(w);u.lang="en-US";u.rate=0.8;speechSynthesis.speak(u)}else alert("瀏覽器不支援語音");
}

function toggleSpellAutoNext(){
  sAutoNext=!sAutoNext;
  S("sAutoNextBtn").textContent="⚡ 自動切換："+(sAutoNext?"開":"關");
  S("sAutoNextBtn").style.background=sAutoNext?"#E1F5EE":"#F1EFE8";
  S("sAutoNextBtn").style.color=sAutoNext?"#085041":"#888780";
  S("sAutoNextBtn").style.borderColor=sAutoNext?"#1D9E75":"#D3D1C7";
}
function toggleGrammarAutoNext(){
  gAutoNext=!gAutoNext;
  S("gAutoNextBtn").textContent="⚡ 自動切換："+(gAutoNext?"開":"關");
  S("gAutoNextBtn").style.background=gAutoNext?"#E1F5EE":"#F1EFE8";
  S("gAutoNextBtn").style.color=gAutoNext?"#085041":"#888780";
  S("gAutoNextBtn").style.borderColor=gAutoNext?"#1D9E75":"#D3D1C7";
}
function initSpell(){
  const allPool=[...BUILTIN,...myWords].filter(v=>v.lv===sLevel);
  const today=new Date().toDateString();
  if(!todaySeenWords[today])todaySeenWords[today]={};
  const todaySeen=todaySeenWords[today];
  const wrongWords=allPool.filter(v=>todaySeen[v.w]==="wrong");
  const unseen=allPool.filter(v=>!todaySeen[v.w]);
  const combined=[...wrongWords,...unseen].sort(()=>Math.random()-0.5);
  sPool=combined.slice(0,10);
  sIdx=0;sAnswered=new Array(sPool.length).fill(null);sHinted=new Array(sPool.length).fill(0);sScore=0;renderSpell();
}
function renderSpell(){
  if(!sPool.length){S("spellCard").innerHTML="<p class='empty'>此難度沒有單字</p>";return}
  const v=sPool[sIdx];
  S("sProgressText").textContent="第 "+(sIdx+1)+" / "+sPool.length+" 題";
  S("sProgress").style.width=(((sIdx+1)/sPool.length)*100)+"%";
  S("sScoreLabel").textContent="已答對 "+sScore+" 題";
  S("sPrev").disabled=sIdx===0;
  const last=sIdx===sPool.length-1;
  S("sNext").textContent=last?"完成拼字練習 ✓":"下一題 →";S("sNext").onclick=last?finishSpell:()=>sGo(1);
  S("sFeedback").textContent="";S("sFeedback").className="feedback";S("spellAnswerReveal").style.display="none";
  S("sZhArea").style.display="block";
  S("sZhArea").innerHTML=`<div style="display:flex;align-items:center;justify-content:center;gap:12px;margin-bottom:14px">
    <div class="spell-zh" style="flex:1;text-align:center">${v.zh}</div>
    <button onclick="speak('s')" style="padding:8px 14px;font-size:13px;border:1.5px solid #EF9F27;border-radius:99px;background:#FAEEDA;color:#633806;cursor:pointer;white-space:nowrap">🔊 再播</button>
  </div>`;
  if(S("ptab-content-spell")&&S("ptab-content-spell").style.display!=="none")setTimeout(()=>speak('s'),300);
  renderLetterBoxes("");
  const inp=S("spellInput");inp.value="";inp.className="spell-input";inp.disabled=false;
  S("confirmSpellBtn").style.display="block";
  S("confirmSpellBtn").textContent="確認答案";
  S("confirmSpellBtn").disabled=true;
  S("confirmSpellBtn").style.opacity="0.4";
  if(sAnswered[sIdx]!==null){
    const ok=sAnswered[sIdx]===true;inp.value=v.w;inp.disabled=true;
    inp.className="spell-input "+(ok?"ok":"bad");renderLetterBoxes(v.w,ok?"ok":"bad");
    S("sFeedback").textContent=ok?"✓ 拼對了！太棒了！":"✗ 拼錯了，正確拼法：";
    S("sFeedback").className="feedback "+(ok?"fok":"fno");
    if(!ok){S("spellAnswerReveal").style.display="block";S("spellAnswerReveal").innerHTML=`<div class="spell-answer-reveal">${v.w}</div>`}
    S("confirmSpellBtn").style.display="none";
  } else {
    setTimeout(()=>inp.focus(),50);
  }
}
function renderLetterBoxes(typed,state){
  const v=sPool[sIdx];if(!v)return;const target=v.w.toLowerCase(),boxes=S("letterBoxes");boxes.innerHTML="";
  for(let i=0;i<target.length;i++){const box=document.createElement("span");box.className="l-box";const t=typed[i]||"";if(t){box.textContent=t;if(state==="ok")box.classList.add("ok");else if(state==="bad")box.classList.add("bad");else box.classList.add("filled")}boxes.appendChild(box)}
}
function onSpellInput(){
  const v=sPool[sIdx];if(!v||sAnswered[sIdx]!==null)return;
  const typed=this.value.toLowerCase();
  renderLetterBoxes(typed);
  const btn=S("confirmSpellBtn");
  if(typed.length>0){btn.disabled=false;btn.style.opacity="1";}
  else{btn.disabled=true;btn.style.opacity="0.4";}
  if(typed.length===v.w.length){checkSpell();}
}
setTimeout(()=>{
  S("spellInput").addEventListener("keydown",function(e){if(e.key==="Enter"&&!S("confirmSpellBtn").disabled)checkSpell()});
  S("spellInput").addEventListener("input",onSpellInput);
},500);
function checkSpell(){
  const v=sPool[sIdx];if(!v||sAnswered[sIdx]!==null)return;
  const typed=S("spellInput").value.trim().toLowerCase();if(!typed)return;
  const ok=typed===v.w.toLowerCase();sAnswered[sIdx]=ok;if(ok){sScore++;stats.cS++}stats.tS++;stats.week[stats.week.length-1]++;
  const today=new Date().toDateString();
  if(!todaySeenWords[today])todaySeenWords[today]={};
  if(!todaySeenWords[today][v.w])todaySeenWords[today][v.w]={status:ok?"ok":"wrong",src:"spell"};
  else if(ok)todaySeenWords[today][v.w]={status:"ok",src:"spell"};
  stats.tS_today=(stats.tS_today||0)+1;
  if(ok)stats.cS_today=(stats.cS_today||0)+1;
  saveData();renderStats();
  S("spellInput").className="spell-input "+(ok?"ok":"bad");S("spellInput").disabled=true;renderLetterBoxes(typed,ok?"ok":"bad");
  S("sFeedback").textContent=ok?"✓ 拼對了！太棒了！":"✗ 拼錯了，正確拼法：";S("sFeedback").className="feedback "+(ok?"fok":"fno");
  if(!ok){S("spellAnswerReveal").style.display="block";S("spellAnswerReveal").innerHTML=`<div class="spell-answer-reveal">${v.w}</div>`}
  S("sScoreLabel").textContent="已答對 "+sScore+" 題";
  S("confirmSpellBtn").style.display="none";
  if(ok&&sAutoNext){
    const last=sIdx===sPool.length-1;
    S("sFeedback").textContent="✓ 拼對了！2秒後自動切換…";
    sAutoTimer=setTimeout(()=>{sAutoTimer=null;if(last)finishSpell();else sGo(1);},2000);
  }
}
function giveHint(){
  const v=sPool[sIdx];if(!v||sAnswered[sIdx]!==null)return;
  sHinted[sIdx]=Math.min(sHinted[sIdx]+1,v.w.length-1);
  S("spellInput").value=v.w.slice(0,sHinted[sIdx]);S("spellInput").focus();renderLetterBoxes(v.w.slice(0,sHinted[sIdx]));
  const btn=S("confirmSpellBtn");btn.disabled=false;btn.style.opacity="1";
  S("sFeedback").textContent="提示："+v.w.slice(0,sHinted[sIdx])+"_".repeat(v.w.length-sHinted[sIdx]);S("sFeedback").className="feedback";
}
function showSpellAnswer(){
  const v=sPool[sIdx];if(!v||sAnswered[sIdx]!==null)return;sAnswered[sIdx]=false;
  S("spellInput").value=v.w;S("spellInput").className="spell-input bad";S("spellInput").disabled=true;renderLetterBoxes(v.w,"bad");
  S("spellAnswerReveal").style.display="block";S("spellAnswerReveal").innerHTML=`<div class="spell-answer-reveal">${v.w}</div>`;
  S("sFeedback").textContent="正確答案如上";S("sFeedback").className="feedback fno";
  S("confirmSpellBtn").style.display="none";
}
function sGo(dir){if(sAutoTimer){clearTimeout(sAutoTimer);sAutoTimer=null;}sIdx=Math.max(0,Math.min(sPool.length-1,sIdx+dir));renderSpell()}
function sGoNext(){S("sNext").onclick()}
function finishSpell(){
  const pct=sPool.length?Math.round(sScore/sPool.length*100):0;
  let msg=pct>=80?"🎉 拼字高手！太厲害了！":pct>=60?"😊 不錯喔！繼續加油！":pct>=40?"🙂 有進步空間，繼續努力！":"💪 別灰心，多練習就會進步！";
  const ds=buildDailyStats();
  showSpellResultModal(sScore,sPool.length,pct,msg,ds);
}



function buildDailyStats(){
  const tv=stats.tV_today||0, cv=stats.cV_today||0;
  const ts=stats.tS_today||0, cs=stats.cS_today||0;
  const tg=stats.tG_today||0, cg=stats.cG_today||0;
  return {
    vT:tv, vC:cv, vPct:tv?Math.round(cv/tv*100):0,
    sT:ts, sC:cs, sPct:ts?Math.round(cs/ts*100):0,
    gT:tg, gC:cg, gPct:tg?Math.round(cg/tg*100):0,
  };
}

function showResultModal(score,total,pct,msg,ds){
  if(vAutoTimer){clearTimeout(vAutoTimer);vAutoTimer=null;}
  const overlay=document.createElement("div");
  overlay.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:9999;padding:1rem";
  const box=document.createElement("div");
  box.style.cssText="background:#fff;border-radius:20px;padding:1.5rem;max-width:400px;width:100%;text-align:center;position:relative";
  const stars=pct>=80?"⭐⭐⭐":pct>=60?"⭐⭐":"⭐";
  box.innerHTML=`
    <div style="font-size:38px;margin-bottom:8px">${pct>=80?"🎉":pct>=60?"😊":"💪"}</div>
    <div style="font-size:24px;font-weight:700;color:#534AB7;margin-bottom:2px">${score} / ${total}</div>
    <div style="font-size:24px;margin-bottom:6px">${stars}</div>
    <div style="font-size:17px;font-weight:600;color:#2C2C2A;margin-bottom:4px">${pct}% 正確率</div>
    <div style="font-size:13px;color:#5F5E5A;margin-bottom:12px">${msg}</div>
    <div style="background:#F1EFE8;border-radius:10px;padding:10px;margin-bottom:16px">
      <div style="font-size:11px;font-weight:600;color:#888780;margin-bottom:8px">今日累積</div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;text-align:center">
        <div style="background:#fff;border-radius:8px;padding:8px 4px">
          <div style="font-size:11px;color:#888780;margin-bottom:3px">📖 單字</div>
          <div style="font-size:14px;font-weight:700;color:#534AB7">${ds.vC}/${ds.vT}</div>
          <div style="font-size:11px;color:#534AB7">${ds.vPct}%</div>
        </div>
        <div style="background:#fff;border-radius:8px;padding:8px 4px">
          <div style="font-size:11px;color:#888780;margin-bottom:3px">✏️ 拼字</div>
          <div style="font-size:14px;font-weight:700;color:#1D9E75">${ds.sC}/${ds.sT}</div>
          <div style="font-size:11px;color:#1D9E75">${ds.sPct}%</div>
        </div>
        <div style="background:#fff;border-radius:8px;padding:8px 4px">
          <div style="font-size:11px;color:#888780;margin-bottom:3px">📝 文法</div>
          <div style="font-size:14px;font-weight:700;color:#BA7517">${ds.gC}/${ds.gT}</div>
          <div style="font-size:11px;color:#BA7517">${ds.gPct}%</div>
        </div>
      </div>
    </div>
    <div style="display:flex;gap:10px">
      <button id="modalContinue" style="flex:1;padding:10px;background:#534AB7;color:#EEEDFE;border:none;border-radius:10px;font-size:15px;font-weight:600;cursor:pointer">繼續練習</button>
      <button id="modalEnd" style="flex:1;padding:10px;background:#F1EFE8;color:#5F5E5A;border:1.5px solid #D3D1C7;border-radius:10px;font-size:15px;font-weight:500;cursor:pointer">結束</button>
    </div>`;
  overlay.appendChild(box);
  document.body.appendChild(overlay);
  if(pct>=80)startConfetti(overlay);
  box.querySelector("#modalContinue").onclick=()=>{overlay.remove();initVocab();};
  box.querySelector("#modalEnd").onclick=()=>{overlay.remove();};
}

function showSpellResultModal(score,total,pct,msg,ds){
  const overlay=document.createElement("div");
  overlay.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:9999;padding:1rem";
  const box=document.createElement("div");
  box.style.cssText="background:#fff;border-radius:20px;padding:1.5rem;max-width:400px;width:100%;text-align:center;position:relative";
  const stars=pct>=80?"⭐⭐⭐":pct>=60?"⭐⭐":"⭐";
  box.innerHTML=`
    <div style="font-size:38px;margin-bottom:8px">${pct>=80?"🎉":pct>=60?"😊":"💪"}</div>
    <div style="font-size:24px;font-weight:700;color:#1D9E75;margin-bottom:2px">${score} / ${total}</div>
    <div style="font-size:24px;margin-bottom:6px">${stars}</div>
    <div style="font-size:17px;font-weight:600;color:#2C2C2A;margin-bottom:4px">${pct}% 正確率</div>
    <div style="font-size:13px;color:#5F5E5A;margin-bottom:12px">${msg}</div>
    <div style="background:#F1EFE8;border-radius:10px;padding:10px;margin-bottom:16px">
      <div style="font-size:11px;font-weight:600;color:#888780;margin-bottom:8px">今日累積</div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;text-align:center">
        <div style="background:#fff;border-radius:8px;padding:8px 4px">
          <div style="font-size:11px;color:#888780;margin-bottom:3px">📖 單字</div>
          <div style="font-size:14px;font-weight:700;color:#534AB7">${ds.vC}/${ds.vT}</div>
          <div style="font-size:11px;color:#534AB7">${ds.vPct}%</div>
        </div>
        <div style="background:#fff;border-radius:8px;padding:8px 4px">
          <div style="font-size:11px;color:#888780;margin-bottom:3px">✏️ 拼字</div>
          <div style="font-size:14px;font-weight:700;color:#1D9E75">${ds.sC}/${ds.sT}</div>
          <div style="font-size:11px;color:#1D9E75">${ds.sPct}%</div>
        </div>
        <div style="background:#fff;border-radius:8px;padding:8px 4px">
          <div style="font-size:11px;color:#888780;margin-bottom:3px">📝 文法</div>
          <div style="font-size:14px;font-weight:700;color:#BA7517">${ds.gC}/${ds.gT}</div>
          <div style="font-size:11px;color:#BA7517">${ds.gPct}%</div>
        </div>
      </div>
    </div>
    <div style="display:flex;gap:10px">
      <button id="sModalContinue" style="flex:1;padding:10px;background:#1D9E75;color:#fff;border:none;border-radius:10px;font-size:15px;font-weight:600;cursor:pointer">繼續練習</button>
      <button id="sModalEnd" style="flex:1;padding:10px;background:#F1EFE8;color:#5F5E5A;border:1.5px solid #D3D1C7;border-radius:10px;font-size:15px;font-weight:500;cursor:pointer">結束</button>
    </div>`;
  overlay.appendChild(box);
  document.body.appendChild(overlay);
  if(pct>=80)startConfetti(overlay);
  box.querySelector("#sModalContinue").onclick=()=>{overlay.remove();initSpell();};
  box.querySelector("#sModalEnd").onclick=()=>{overlay.remove();};
}

function showGrammarResultModal(score,total,pct,msg,ds){
  const overlay=document.createElement("div");
  overlay.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:9999;padding:1rem";
  const box=document.createElement("div");
  box.style.cssText="background:#fff;border-radius:20px;padding:1.5rem;max-width:400px;width:100%;text-align:center;position:relative";
  const stars=pct>=80?"⭐⭐⭐":pct>=60?"⭐⭐":"⭐";
  box.innerHTML=`
    <div style="font-size:38px;margin-bottom:8px">${pct>=80?"🎉":pct>=60?"😊":"💪"}</div>
    <div style="font-size:24px;font-weight:700;color:#BA7517;margin-bottom:2px">${score} / ${total}</div>
    <div style="font-size:24px;margin-bottom:6px">${stars}</div>
    <div style="font-size:17px;font-weight:600;color:#2C2C2A;margin-bottom:4px">${pct}% 正確率</div>
    <div style="font-size:13px;color:#5F5E5A;margin-bottom:12px">${msg}</div>
    <div style="background:#F1EFE8;border-radius:10px;padding:10px;margin-bottom:16px">
      <div style="font-size:11px;font-weight:600;color:#888780;margin-bottom:8px">今日累積</div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;text-align:center">
        <div style="background:#fff;border-radius:8px;padding:8px 4px">
          <div style="font-size:11px;color:#888780;margin-bottom:3px">📖 單字</div>
          <div style="font-size:14px;font-weight:700;color:#534AB7">${ds.vC}/${ds.vT}</div>
          <div style="font-size:11px;color:#534AB7">${ds.vPct}%</div>
        </div>
        <div style="background:#fff;border-radius:8px;padding:8px 4px">
          <div style="font-size:11px;color:#888780;margin-bottom:3px">✏️ 拼字</div>
          <div style="font-size:14px;font-weight:700;color:#1D9E75">${ds.sC}/${ds.sT}</div>
          <div style="font-size:11px;color:#1D9E75">${ds.sPct}%</div>
        </div>
        <div style="background:#fff;border-radius:8px;padding:8px 4px">
          <div style="font-size:11px;color:#888780;margin-bottom:3px">📝 文法</div>
          <div style="font-size:14px;font-weight:700;color:#BA7517">${ds.gC}/${ds.gT}</div>
          <div style="font-size:11px;color:#BA7517">${ds.gPct}%</div>
        </div>
      </div>
    </div>
    <div style="display:flex;gap:10px">
      <button id="gModalContinue" style="flex:1;padding:10px;background:#BA7517;color:#fff;border:none;border-radius:10px;font-size:15px;font-weight:600;cursor:pointer">繼續練習</button>
      <button id="gModalEnd" style="flex:1;padding:10px;background:#F1EFE8;color:#5F5E5A;border:1.5px solid #D3D1C7;border-radius:10px;font-size:15px;font-weight:500;cursor:pointer">結束</button>
    </div>`;
  overlay.appendChild(box);
  document.body.appendChild(overlay);
  if(pct>=80)startConfetti(overlay);
  box.querySelector("#gModalContinue").onclick=()=>{overlay.remove();initGrammar();};
  box.querySelector("#gModalEnd").onclick=()=>{overlay.remove();};
}

function startConfetti(container){
  const colors=["#534AB7","#1D9E75","#EF9F27","#E24B4A","#D4537E","#378ADD"];
  const canvas=document.createElement("canvas");
  canvas.style.cssText="position:fixed;inset:0;pointer-events:none;z-index:10000";
  canvas.width=window.innerWidth;canvas.height=window.innerHeight;
  document.body.appendChild(canvas);
  const ctx=canvas.getContext("2d");
  const pieces=Array.from({length:120},()=>({
    x:Math.random()*canvas.width,y:-20,
    r:Math.random()*6+3,
    d:Math.random()*80+40,
    color:colors[Math.floor(Math.random()*colors.length)],
    tilt:Math.random()*10-5,
    tiltAngle:0,tiltSpeed:Math.random()*0.1+0.05,vy:Math.random()*3+2,vx:(Math.random()-0.5)*3
  }));
  try{const ac=new(window.AudioContext||window.webkitAudioContext)();const o=ac.createOscillator();const g=ac.createGain();o.connect(g);g.connect(ac.destination);o.frequency.setValueAtTime(523,ac.currentTime);o.frequency.setValueAtTime(659,ac.currentTime+0.15);o.frequency.setValueAtTime(784,ac.currentTime+0.3);g.gain.setValueAtTime(0.3,ac.currentTime);g.gain.exponentialRampToValueAtTime(0.01,ac.currentTime+0.8);o.start();o.stop(ac.currentTime+0.8);}catch(e){}
  let frame=0;
  function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    pieces.forEach(p=>{
      p.tiltAngle+=p.tiltSpeed;p.y+=p.vy;p.x+=p.vx;p.tilt=Math.sin(p.tiltAngle)*12;
      ctx.beginPath();ctx.lineWidth=p.r;ctx.strokeStyle=p.color;
      ctx.moveTo(p.x+p.tilt+p.r/2,p.y);ctx.lineTo(p.x+p.tilt,p.y+p.tilt+p.r/2);
      ctx.stroke();
    });
    frame++;if(frame<150)requestAnimationFrame(draw);else canvas.remove();
  }
  draw();
  setTimeout(()=>{if(canvas.parentNode)canvas.remove();},4000);
  container.addEventListener("remove",()=>{if(canvas.parentNode)canvas.remove()},true);
}

function initGrammar(){gPool=GRAMMAR.filter(q=>q.lv===gLevel).sort(()=>Math.random()-0.5).slice(0,10);gIdx=0;gAnswered=new Array(gPool.length).fill(null);gScore=0;renderGrammar()}
function renderGrammar(){
  if(!gPool.length)return;const q=gPool[gIdx];
  S("gTopic").textContent=q.topic;S("gIdx").textContent="第 "+(gIdx+1)+" / "+gPool.length+" 題";
  S("gProgressText").textContent="第 "+(gIdx+1)+" / "+gPool.length+" 題";S("gProgress").style.width=(((gIdx+1)/gPool.length)*100)+"%";
  S("gStem").innerHTML=q.stem.replace("___","<span style='display:inline-block;min-width:60px;border-bottom:2px solid #B4B2A9;text-align:center;color:#888780'>&nbsp;&nbsp;&nbsp;&nbsp;</span>");
  S("gFeedback").textContent="";S("gFeedback").className="feedback";S("gExplain").style.display="none";
  S("gPrev").disabled=gIdx===0;S("gNext").textContent=gIdx===gPool.length-1?"完成文法練習 ✓":"下一題 →";S("gNext").onclick=gIdx===gPool.length-1?finishGrammar:()=>gGo(1);
  const grid=S("gOpts");grid.innerHTML="";
  q.opts.forEach((o,i)=>{
    const b=document.createElement("button");b.className="opt-btn";b.textContent=o;
    if(gAnswered[gIdx]!==null){b.disabled=true;if(i===q.ans)b.classList.add("correct");else if(i===gAnswered[gIdx]&&i!==q.ans)b.classList.add("wrong");S("gFeedback").textContent=gAnswered[gIdx]===q.ans?"✓ 答對了！":"✗ 答錯了，正確答案是："+q.opts[q.ans];S("gFeedback").className="feedback "+(gAnswered[gIdx]===q.ans?"fok":"fno");S("gExplain").style.display="block";S("gExplain").textContent="📝 "+q.explain}
    else b.onclick=()=>checkG(i,q);grid.appendChild(b);
  });
}
function checkG(chosen,q){
  const ok=chosen===q.ans;gAnswered[gIdx]=chosen;
  if(ok){gScore++;stats.cG++;stats.cG_today=(stats.cG_today||0)+1;}
  else{if(!stats.gramErrors)stats.gramErrors={};stats.gramErrors[q.topic]=(stats.gramErrors[q.topic]||0)+1;}
  stats.tG++;stats.tG_today=(stats.tG_today||0)+1;saveData();renderStats();
  document.querySelectorAll("#gOpts .opt-btn").forEach((b,i)=>{b.disabled=true;if(i===q.ans)b.classList.add("correct");else if(i===chosen&&i!==q.ans)b.classList.add("wrong")});
  S("gFeedback").textContent=ok?"✓ 答對了！":"✗ 答錯了，正確答案是："+q.opts[q.ans];S("gFeedback").className="feedback "+(ok?"fok":"fno");
  S("gExplain").style.display="block";S("gExplain").textContent="📝 "+q.explain;
  if(ok&&gAutoNext){
    const last=gIdx===gPool.length-1;
    S("gFeedback").textContent="✓ 答對了！2秒後自動切換…";
    gAutoTimer=setTimeout(()=>{gAutoTimer=null;if(last)finishGrammar();else gGo(1);},2000);
  }
}
function gGo(dir){if(gAutoTimer){clearTimeout(gAutoTimer);gAutoTimer=null;}gIdx=Math.max(0,Math.min(gPool.length-1,gIdx+dir));renderGrammar()}
function gGoNext(){S("gNext").onclick()}
function finishGrammar(){
  const pct=gPool.length?Math.round(gScore/gPool.length*100):0;
  let msg=pct>=80?"🎉 文法高手！太棒了！":pct>=60?"😊 不錯喔！繼續加油！":pct>=40?"🙂 有進步空間，繼續努力！":"💪 別灰心，多練習就會進步！";
  const ds=buildDailyStats();
  showGrammarResultModal(gScore,gPool.length,pct,msg,ds);
}

function addWord(){
  const w=S("mWord").value.trim(),zh=S("mMean").value.trim(),ex=S("mEx").value.trim();
  if(!w||!zh){S("mMsg").style.display="block";S("mMsg").style.color="#A32D2D";S("mMsg").textContent="請填寫英文單字和中文意思！";return}
  myWords.push({w,ph:S("mPhon").value.trim(),pos:S("mPos").value,zh,ex:ex||w+" is a useful word.",lv:mLevel,custom:true});saveData();
  S("mMsg").style.display="block";S("mMsg").style.color="#3B6D11";S("mMsg").textContent="✓ 已新增「"+w+"」！";
  S("mWord").value="";S("mPhon").value="";S("mMean").value="";S("mEx").value="";renderMyWords();renderStats();setTimeout(()=>S("mMsg").style.display="none",2500);
}
function filterW(lv,btn){myFilter=lv;btn.closest(".card").querySelectorAll(".lbtn").forEach(b=>b.classList.remove("active"));btn.classList.add("active");renderMyWords()}
function renderMyWords(){
  const list=S("myWordList"),show=myFilter===-1?myWords:myWords.filter(w=>w.lv===myFilter);
  if(!show.length){list.innerHTML="<p class='empty'>尚無自訂單字</p>";return}list.innerHTML="";
  show.forEach(w=>{const idx=myWords.indexOf(w);const row=document.createElement("div");row.className="wl-item";row.innerHTML=`<div style="flex:1"><span style="font-weight:600;font-size:15px;color:#2C2C2A">${w.w}</span> <span style="font-size:13px;color:#888780">${w.zh}</span></div><span class="badge ${LB_CLS[w.lv]}" style="margin-right:8px">${LV[w.lv]}</span><button class="btn-sm" style="color:#A32D2D;font-size:12px;padding:4px 10px" onclick="removeWord(${idx})">刪除</button>`;list.appendChild(row)});
}
function removeWord(idx){if(confirm("確定刪除「"+myWords[idx].w+"」嗎？")){myWords.splice(idx,1);saveData();renderMyWords();renderStats()}}

function renderStats(){
  S("stD").textContent=stats.totalDays;S("stS").textContent=stats.streak;
  const tot=stats.tV+stats.tS+stats.tG;
  S("stA").textContent=tot?Math.round((stats.cV+stats.cS+stats.cG)/tot*100)+"%":"—";
  S("stV").textContent=stats.tV;S("stSp").textContent=stats.tS;S("stG").textContent=stats.tG;
  renderChart();
  renderMissions();
  renderPracticedWords('all');
  renderGramErrorCard();
  renderCEFR();
}

let practicedFilter='all';
function filterPracticed(f,btn){
  practicedFilter=f;
  document.querySelectorAll("#tab-stats .card:last-child .lbtn").forEach(b=>b.classList.remove("active"));
  btn.classList.add("active");
  renderPracticedWords(f);
}
function renderPracticedWords(filter){
  const today=new Date().toDateString();
  const seen=todaySeenWords[today]||{};
  const allSeen=Object.keys(seen);
  const filtered=filter==='all'?allSeen:filter==='ok'?allSeen.filter(w=>seen[w]==="ok"):allSeen.filter(w=>seen[w]==="wrong");
  const allWords=[...BUILTIN,...myWords];
  S("practicedWordCount").textContent="共 "+allSeen.length+" 個（今日）";
  const list=S("practicedWordList");list.innerHTML="";
  if(!filtered.length){list.innerHTML='<p class="empty" style="padding:1rem">尚無練習記錄</p>';return;}
  filtered.forEach(w=>{
    const entry=allWords.find(v=>v.w===w)||{w,zh:"",pos:""};
    const ok=seen[w]==="ok";
    const row=document.createElement("div");
    row.style.cssText="display:flex;align-items:center;gap:8px;padding:8px 0;border-bottom:0.5px solid #D3D1C7;";
    row.innerHTML=`<span style="font-size:14px;font-weight:600;color:#2C2C2A;flex:1">${entry.w}</span><span style="font-size:12px;color:#888780">${entry.zh}</span><span style="font-size:12px;padding:2px 8px;border-radius:99px;background:${ok?"#EAF3DE":"#FCEBEB"};color:${ok?"#27500A":"#A32D2D"}">${ok?"✓":"✗"}</span>`;
    list.appendChild(row);
  });
  renderReviewWrongCard();
}

function getAllWrongWords(){
  const allWords=[...BUILTIN,...myWords];
  const wrongSet={};
  Object.values(todaySeenWords).forEach(dayMap=>{
    Object.entries(dayMap).forEach(([w,entry])=>{
      // 相容新格式 {status,src} 與舊格式 "wrong"
      const status=typeof entry==="object"?entry.status:entry;
      const src=typeof entry==="object"?entry.src:"vocab";
      if(status==="wrong"&&!wrongSet[w]){
        const word=allWords.find(v=>v.w===w)||{w,zh:"",pos:""};
        wrongSet[w]={...word,wrongSrc:src};
      }
    });
  });
  return Object.values(wrongSet);
}

function renderReviewWrongCard(){
  const wrongs=getAllWrongWords();
  const card=S("reviewWrongCard");if(!card)return;
  if(!wrongs.length){card.style.display="none";return;}
  card.style.display="block";
  S("reviewWrongCount").textContent=wrongs.length+" 個";
  const list=S("reviewWrongList");list.innerHTML="";
  wrongs.forEach(entry=>{
    const row=document.createElement("div");
    row.style.cssText="display:flex;align-items:center;gap:8px;padding:7px 0;border-bottom:0.5px solid #D3D1C7;";
    row.innerHTML=`<span style="font-size:14px;font-weight:600;color:#2C2C2A;flex:1">${entry.w}</span><span style="font-size:13px;color:#888780">${entry.zh}</span>`;
    list.appendChild(row);
  });
}

function startWrongReview(){
  const wrongs=getAllWrongWords();if(!wrongs.length)return;
  vPool=wrongs.sort(()=>Math.random()-0.5).slice(0,10);
  vIdx=0;vAnswered=new Array(vPool.length).fill(null);vRevealed=new Array(vPool.length).fill(false);vScore=0;vAutoTimer=null;
  switchTab("practice", document.querySelector('.tab[onclick*="practice"]'));
  switchPTab("vocab", S("ptab-btn-vocab"));
  S("vPoolCount").textContent="複習錯誤單字："+vPool.length+" 個";
  renderVocab();
}

function setChartRange(n,btn){
  chartRange=n;
  document.querySelectorAll("#chart7btn,#chart30btn").forEach(b=>b&&b.classList.remove("active"));
  if(btn)btn.classList.add("active");
  renderChart();
}

function renderChart(){
  const chart=S("weekChart"),labels=S("weekLabels"),dates=S("weekDates");
  if(!chart||!labels)return;
  chart.innerHTML="";labels.innerHTML="";if(dates)dates.innerHTML="";
  const dayNames=["日","一","二","三","四","五","六"];
  const n=chartRange||7;
  const data=stats.week||[];
  const slice=data.slice(Math.max(0,data.length-n));
  const maxV=Math.max(...slice,1);
  const todayDate=new Date();
  slice.forEach((v,i)=>{
    const dayOffset=-(n-1-i);
    const d=new Date(todayDate);d.setDate(d.getDate()+dayOffset);
    const isToday=i===slice.length-1;
    const barW=n<=7?"flex:1":"min-width:22px;width:22px";
    const bar=document.createElement("div");
    bar.style.cssText=barW+";background:"+(isToday?"#534AB7":"#CECBF6")+";border-radius:4px 4px 0 0;height:"+Math.round((v/maxV)*70+5)+"px;min-height:5px;flex-shrink:0";
    chart.appendChild(bar);
    const lbl=document.createElement("div");
    lbl.style.cssText=(barW)+";text-align:center;font-size:11px;color:"+(isToday?"#534AB7":"#888780")+";font-weight:"+(isToday?"600":"400")+";flex-shrink:0";
    lbl.textContent=dayNames[d.getDay()];
    labels.appendChild(lbl);
    if(dates){
      const dlbl=document.createElement("div");
      dlbl.style.cssText=(barW)+";text-align:center;font-size:10px;color:#B4B2A9;flex-shrink:0";
      dlbl.textContent=(d.getMonth()+1)+"/"+(d.getDate());
      dates.appendChild(dlbl);
    }
  });
}

let missionFireSent=false;
function renderMissions(){
  const today=new Date().toDateString();
  if(S("missionDate"))S("missionDate").textContent=today;
  const seen=todaySeenWords[today]||{};
  const vocabDone=Math.min(stats.tV_today||0,10);
  const spellDone=Math.min(stats.tS_today||0,10);
  const gramDone=Math.min(stats.tG_today||0,10);
  const vPct=Math.round(vocabDone/10*100);
  const sPct=Math.round(spellDone/10*100);
  const gPct=Math.round(gramDone/10*100);
  setMissionBar("mVocabBar","mVocabCount",vocabDone,vPct,"#534AB7");
  setMissionBar("mSpellBar","mSpellCount",spellDone,sPct,"#1D9E75");
  setMissionBar("mGramBar","mGramCount",gramDone,gPct,"#BA7517");
  const allDone=vocabDone>=10&&spellDone>=10&&gramDone>=10;
  S("allDoneMsg").style.display=allDone?"block":"none";
  if(allDone&&!missionFireSent){missionFireSent=true;startCelebration();showAllDoneModal();}
}

function setMissionBar(barId,countId,done,pct,color){
  const bar=S(barId),cnt=S(countId);if(!bar||!cnt)return;
  bar.style.width=pct+"%";
  cnt.textContent=done+" / 10";
  if(pct>=100){
    bar.style.background="linear-gradient(90deg,"+color+",#AFA9EC,"+color+",#5DCAA5,"+color+")";
    bar.style.backgroundSize="200% 100%";
    bar.style.animation="shimmer 1.5s linear infinite";
  } else {
    bar.style.background=color;bar.style.animation="";
  }
}

function startCelebration(){
  startConfetti(document.body);
  startConfetti(document.body);
  setTimeout(()=>startConfetti(document.body),800);
  try{
    const ac=new(window.AudioContext||window.webkitAudioContext)();
    const freqs=[523,659,784,1047,1319];
    freqs.forEach((f,i)=>{
      const o=ac.createOscillator(),g=ac.createGain();
      o.connect(g);g.connect(ac.destination);
      o.frequency.value=f;o.type="sine";
      g.gain.setValueAtTime(0,ac.currentTime+i*0.15);
      g.gain.linearRampToValueAtTime(0.25,ac.currentTime+i*0.15+0.05);
      g.gain.exponentialRampToValueAtTime(0.01,ac.currentTime+i*0.15+0.4);
      o.start(ac.currentTime+i*0.15);o.stop(ac.currentTime+i*0.15+0.5);
    });
    setTimeout(()=>{
      const o2=ac.createOscillator(),g2=ac.createGain();
      o2.connect(g2);g2.connect(ac.destination);
      o2.type="square";o2.frequency.setValueAtTime(440,ac.currentTime);
      o2.frequency.exponentialRampToValueAtTime(880,ac.currentTime+0.5);
      o2.frequency.exponentialRampToValueAtTime(1760,ac.currentTime+1);
      g2.gain.setValueAtTime(0.15,ac.currentTime);
      g2.gain.exponentialRampToValueAtTime(0.01,ac.currentTime+1.2);
      o2.start();o2.stop(ac.currentTime+1.3);
    },800);
  }catch(e){}
}


// ═══════════════════════════════════
// WHACK-A-MOLE GAME
// ═══════════════════════════════════
let gLevel_game=0, gDiff=1, gScore_v=0, gTimer_v=0, gTimerInterval=null;
let gPool_game=[], gIdx_game=0, gCorrect=0, gWrong=0, gCombo_v=0, gMaxCombo=0;
let gMistakes=[], gTotalTime=45, gAnswered_game=false;
const GDIFF_CFG=[
  {opts:3,time:60,label:"入門"},
  {opts:4,time:45,label:"標準"},
  {opts:5,time:35,label:"挑戰"},
  {opts:6,time:25,label:"地獄"}
];

function setGameLevel(lv,btn){
  gLevel_game=lv;
  ["glv0","glv1","glv2"].forEach((id,i)=>{const b=S(id);if(b)b.classList.toggle("active",i===lv);});
}
function setGameDiff(d){
  gDiff=d;
  [0,1,2,3].forEach(i=>{
    const el=S("gDiff"+i);if(!el)return;
    el.style.borderColor=i===d?"#534AB7":"transparent";
    el.style.background=i===d?"#EEEDFE":"#F1EFE8";
    const title=el.querySelector("div:nth-child(2)");
    if(title)title.style.color=i===d?"#534AB7":"#2C2C2A";
  });
}

function buildGamePool(){
  const all=[...BUILTIN,...myWords].filter(v=>v.lv===gLevel_game);
  const today=new Date().toDateString();
  const seen=todaySeenWords[today]||{};
  const wrong=all.filter(v=>seen[v.w]==="wrong");
  const unseen=all.filter(v=>!seen[v.w]);
  const known=all.filter(v=>seen[v.w]==="ok");
  // Mix: wrong first, then unseen, then some known as fillers
  const base=[...wrong,...unseen].sort(()=>Math.random()-0.5);
  const fillers=known.sort(()=>Math.random()-0.5).slice(0,10);
  return [...base,...fillers];
}

function startGame(){
  gPool_game=buildGamePool();
  if(gPool_game.length<4){alert("單字不足，請先練習更多單字！");return;}
  gPool_game=gPool_game.sort(()=>Math.random()-0.5);
  gIdx_game=0;gScore_v=0;gCorrect=0;gWrong=0;gCombo_v=0;gMaxCombo=0;gMistakes=[];
  gTotalTime=GDIFF_CFG[gDiff].time;gTimer_v=gTotalTime;
  S("game-lobby").style.display="none";S("game-over").style.display="none";
  S("game-play").style.display="block";
  S("gScore").textContent="0";S("gCombo").textContent="";
  updateGameTimer();
  renderMole();
  gTimerInterval=setInterval(()=>{
    gTimer_v--;
    updateGameTimer();
    if(gTimer_v<=3&&gTimer_v>0)speakCountdown(String(gTimer_v));
    if(gTimer_v<=0){clearInterval(gTimerInterval);gTimerInterval=null;speakCountdown("END");endGame(false);}
  },1000);
}

function updateGameTimer(){
  S("gTimer").textContent=gTimer_v;
  const pct=(gTimer_v/gTotalTime)*100;
  S("gTimerBar").style.width=pct+"%";
  S("gTimerBar").style.background=pct>40?"linear-gradient(90deg,#534AB7,#1D9E75)":pct>20?"#EF9F27":"#E24B4A";
}

function renderMole(){
  if(gIdx_game>=gPool_game.length){gPool_game=buildGamePool().sort(()=>Math.random()-0.5);gIdx_game=0;}
  const target=gPool_game[gIdx_game];
  S("gQuestion").textContent=target.zh;
  S("gHintPos").textContent=target.pos;
  gAnswered_game=false;
  const cfg=GDIFF_CFG[gDiff];
  const n=cfg.opts;
  const allWords=[...BUILTIN,...myWords].filter(v=>v.lv===gLevel_game&&v.w!==target.w);
  const distractors=allWords.sort(()=>Math.random()-0.5).slice(0,n-1);
  const options=[...distractors,target].sort(()=>Math.random()-0.5);
  const grid=S("gMoles");
  grid.style.gridTemplateColumns=n<=4?"1fr 1fr":"1fr 1fr 1fr";
  grid.innerHTML="";
  options.forEach(opt=>{
    const btn=document.createElement("button");
    btn.className="mole-btn";btn.textContent=opt.w;
    btn.onclick=()=>whack(btn,opt.w===target.w,target,options);
    grid.appendChild(btn);
  });
  S("gFeedbackFlash").textContent="";
}

function whack(btn,isCorrect,target,options){
  if(gAnswered_game)return;
  gAnswered_game=true;
  document.querySelectorAll(".mole-btn").forEach(b=>{b.disabled=true;});
  if(isCorrect){
    btn.classList.add("hit-ok");
    gCorrect++;gCombo_v++;gMaxCombo=Math.max(gMaxCombo,gCombo_v);
    const bonus=gCombo_v>=5?3:gCombo_v>=3?2:1;
    gScore_v+=10*bonus;
    S("gScore").textContent=gScore_v;
    S("gCombo").textContent=gCombo_v>=2?"🔥 "+gCombo_v+"連擊！":"";
    const fb=S("gFeedbackFlash");
    fb.style.color="#3B6D11";
    fb.style.animation="feedback-pop .3s ease-out";
    fb.textContent=gCombo_v>=5?"🔥🔥🔥 超神連擊 +"+10*bonus:gCombo_v>=3?"🔥 連擊 +"+10*bonus:"✓ 答對 +10";
    setTimeout(()=>{if(!gAnswered_game||gTimerInterval)nextMole();},600);
  } else {
    btn.classList.add("hit-bad");
    // highlight correct
    document.querySelectorAll(".mole-btn").forEach(b=>{if(b.textContent===target.w)b.classList.add("hit-ok");});
    gWrong++;gCombo_v=0;gScore_v=Math.max(0,gScore_v-5);
    S("gScore").textContent=gScore_v;S("gCombo").textContent="";
    const fb=S("gFeedbackFlash");fb.style.color="#A32D2D";fb.textContent="✗ 錯了 -5";
    if(!gMistakes.find(m=>m.w===target.w))gMistakes.push(target);
    setTimeout(()=>{if(gTimerInterval)nextMole();},900);
  }
}

function nextMole(){
  gIdx_game++;renderMole();
}

function endGame(manual){
  if(gTimerInterval){clearInterval(gTimerInterval);gTimerInterval=null;}
  S("game-play").style.display="none";S("game-over").style.display="block";
  S("goScore").textContent=gScore_v;
  S("goCorrect").textContent=gCorrect;
  S("goWrong").textContent=gWrong;
  S("goCombo").textContent=gMaxCombo;
  const pct=gCorrect+gWrong>0?Math.round(gCorrect/(gCorrect+gWrong)*100):0;
  let emoji="😊",msg="";
  if(gScore_v>=200){emoji="🏆";msg="超強！你是打地鼠王者！";}
  else if(gScore_v>=120){emoji="🎉";msg="非常厲害！繼續加油！";}
  else if(gScore_v>=60){emoji="😊";msg="不錯喔！多練習更厲害！";}
  else{emoji="💪";msg="繼續努力，你可以的！";}
  S("goEmoji").textContent=emoji;S("goMsg").textContent=msg;
  saveScore("mole", gScore_v, LV[gLevel_game]+" "+GDIFF_CFG[gDiff].label);
  const hist=getHistory("mole"); const best=hist.length>1?Math.max(...hist.map(r=>r.score)):gScore_v;
  if(gScore_v>=best&&hist.length===1){S("goNew").textContent="🌟 新紀錄！";S("goNew").style.color="#BA7517";if(gScore_v>=120)startConfetti(document.body);}
  else{S("goNew").textContent="最高紀錄："+best+" 分";S("goNew").style.color="#888780";}
  const mList=S("goMistakeList"),mCard=S("goMistakes");
  mList.innerHTML="";
  if(gMistakes.length){
    mCard.style.display="block";
    gMistakes.forEach(m=>{
      const row=document.createElement("div");
      row.style.cssText="display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:0.5px solid #D3D1C7";
      row.innerHTML=`<span style="font-size:14px;font-weight:600;color:#2C2C2A;flex:1">${m.w}</span><span style="font-size:13px;color:#888780">${m.zh}</span>`;
      mList.appendChild(row);
    });
  } else mCard.style.display="none";
  loadLeaderboard();
}

function replayGame(){S("game-over").style.display="none";startGame();}
function backToLobby(){
  S("game-play").style.display="none";S("game-over").style.display="none";
  S("game-lobby").style.display="block";loadLeaderboard();
}

function saveScore(gameKey, score, extra){
  const k="gHistory_"+currentUser+"_"+gameKey;
  const hist=JSON.parse(localStorage.getItem(k)||"[]");
  hist.unshift({score, extra, date:new Date().toLocaleDateString("zh-TW")});
  localStorage.setItem(k, JSON.stringify(hist.slice(0,20)));
}
function getHistory(gameKey){
  return JSON.parse(localStorage.getItem("gHistory_"+currentUser+"_"+gameKey)||"[]");
}
function loadLeaderboard(){
  const card=S("gLeaderCard"),list=S("gLeaderList");if(!card||!list)return;
  let html="";
  const games=[
    {key:"mole",label:"🦔 打地鼠",unit:"分",higher:true},
    {key:"flip",label:"🃏 翻牌",unit:"秒",higher:false},
    {key:"wordle",label:"🟩 Wordle",unit:"次猜中",higher:false},
    {key:"wordcross",label:"✏️ 填字",unit:"秒",higher:false},
  ];
  let anyData=false;
  games.forEach(g=>{
    const hist=getHistory(g.key);
    if(!hist.length)return;
    anyData=true;
    html+=`<div style="margin-bottom:14px"><div style="font-size:13px;font-weight:600;color:#2C2C2A;margin-bottom:6px">${g.label}</div>`;
    hist.slice(0,5).forEach((r,i)=>{
      const medal=i===0?"🥇":i===1?"🥈":i===2?"🥉":"";
      html+=`<div style="display:flex;align-items:center;gap:8px;padding:5px 0;border-bottom:0.5px solid #D3D1C7;font-size:13px">
        <span>${medal||"&nbsp;&nbsp;"}</span>
        <span style="flex:1;color:#2C2C2A;font-weight:600">${r.score} ${g.unit}</span>
        <span style="color:#888780;font-size:12px">${r.extra||""}</span>
        <span style="color:#B4B2A9;font-size:11px">${r.date}</span>
      </div>`;
    });
    html+="</div>";
  });
  if(!anyData){card.style.display="none";return;}
  card.style.display="block";
  card.querySelector("p").textContent="🏅 遊戲紀錄";
  list.innerHTML=html;
}


// ═══════════════════════════════════════
// GAME NAVIGATION
// ═══════════════════════════════════════
let currentGame=null,fTimerInterval=null;
function openGame(g){
  currentGame=g;
  S("game-selector").style.display="none";
  ["mole","flip","wordle","wordcross"].forEach(x=>{const el=S("game-"+x);if(el)el.style.display="none";});
  const target=S("game-"+g);if(target)target.style.display="block";
  if(g==="flip"){S("flip-lobby").style.display="block";if(S("flip-play"))S("flip-play").style.display="none";if(S("flip-over"))S("flip-over").style.display="none";}
  if(g==="wordle"){S("wordle-lobby").style.display="block";if(S("wordle-play"))S("wordle-play").style.display="none";if(S("wordle-over"))S("wordle-over").style.display="none";}
  if(g==="wordcross"){S("wc-lobby").style.display="block";if(S("wc-play"))S("wc-play").style.display="none";if(S("wc-over"))S("wc-over").style.display="none";}
}
function backToGameSelector(){
  if(fTimerInterval){clearInterval(fTimerInterval);fTimerInterval=null;}
  if(wcTimerInterval){clearInterval(wcTimerInterval);wcTimerInterval=null;}
  ["mole","flip","wordle","wordcross"].forEach(x=>{const el=S("game-"+x);if(el)el.style.display="none";});
  const sel=S("game-selector");if(sel)sel.style.display="block";
  currentGame=null;loadLeaderboard();
}

// ═══════════════════════════════════
// FLIP CARD GAME
// ═══════════════════════════════════
let fLevel=0,fPairs=6,fFlipCount=0,fMatched_v=0,fFirst=null,fSecond=null,fLocked=false,fStartTime=null,fCards=[];

function setFlipLevel(lv,btn){
  fLevel=lv;
  ["flv0","flv1","flv2"].forEach((id,i)=>{const b=S(id);if(b)b.classList.toggle("active",i===lv);});
}
function setFlipPairs(n,el){
  fPairs=n;
  [0,1,2,3].forEach(i=>{
    const b=S("fpairs"+i);if(!b)return;
    const paired=[6,8,10,12][i];
    b.style.background=paired===n?"#E1F5EE":"#F1EFE8";
    b.style.borderColor=paired===n?"#1D9E75":"transparent";
    const t=b.querySelector("div:nth-child(2)");if(t)t.style.color=paired===n?"#085041":"#2C2C2A";
  });
}
function startFlip(){
  const lb=S("flip-lobby"),fp=S("flip-play"),fo=S("flip-over");
  if(lb)lb.style.display="none";if(fo)fo.style.display="none";if(fp)fp.style.display="block";
  fFlipCount=0;fMatched_v=0;fFirst=null;fSecond=null;fLocked=false;fCards=[];
  if(fTimerInterval){clearInterval(fTimerInterval);fTimerInterval=null;}
  fStartTime=Date.now();
  fTimerInterval=setInterval(updateFlipTimer,500);
  if(S("fFlips"))S("fFlips").textContent="0";
  if(S("fMatched"))S("fMatched").textContent="0";
  if(S("fTotal"))S("fTotal").textContent=fPairs;
  buildFlipGrid();
}
function buildFlipGrid(){
  const all=[...BUILTIN,...myWords].filter(v=>v.lv===fLevel);
  const pool=all.sort(()=>Math.random()-0.5).slice(0,fPairs);
  fCards=[];
  pool.forEach((w,i)=>{
    fCards.push({id:"w"+i,pairId:i,type:"en",text:w.w,matched:false});
    fCards.push({id:"z"+i,pairId:i,type:"zh",text:w.zh,matched:false});
  });
  fCards.sort(()=>Math.random()-0.5);
  const grid=S("flipGrid");if(!grid)return;
  const cols=fPairs<=6?3:4;
  grid.style.gridTemplateColumns="repeat("+cols+",1fr)";
  grid.innerHTML="";
  fCards.forEach((c,idx)=>{
    const card=document.createElement("div");
    card.dataset.idx=idx;
    card.style.cssText="aspect-ratio:1;border-radius:10px;background:#534AB7;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:600;color:#534AB7;border:2px solid #AFA9EC;user-select:none;transition:background .2s,color .2s;overflow:hidden;padding:4px;text-align:center;word-break:break-all;line-height:1.3";
    card.textContent="";
    card.onclick=()=>flipCard(card,idx);
    grid.appendChild(card);
  });
}
function flipCard(card,idx){
  if(fLocked||fCards[idx].matched||card.style.color!=="rgb(83, 74, 183)")return;
  card.style.background="#fff";card.style.color="#2C2C2A";
  card.textContent=fCards[idx].text;
  fFlipCount++;if(S("fFlips"))S("fFlips").textContent=fFlipCount;
  if(!fFirst){fFirst={card,idx};return;}
  if(fFirst.idx===idx)return;
  fSecond={card,idx};fLocked=true;
  if(fCards[fFirst.idx].pairId===fCards[idx].pairId){
    fFirst.card.style.background="#EAF3DE";fFirst.card.style.color="#27500A";fFirst.card.style.borderColor="#639922";
    card.style.background="#EAF3DE";card.style.color="#27500A";card.style.borderColor="#639922";
    fCards[fFirst.idx].matched=true;fCards[idx].matched=true;
    fMatched_v++;if(S("fMatched"))S("fMatched").textContent=fMatched_v;
    fFirst=null;fSecond=null;fLocked=false;
    if(fMatched_v>=fPairs)setTimeout(finishFlip,300);
  } else {
    setTimeout(()=>{
      fFirst.card.style.background="#534AB7";fFirst.card.style.color="#534AB7";fFirst.card.textContent="";fFirst.card.style.borderColor="#AFA9EC";
      fSecond.card.style.background="#534AB7";fSecond.card.style.color="#534AB7";fSecond.card.textContent="";fSecond.card.style.borderColor="#AFA9EC";
      fFirst=null;fSecond=null;fLocked=false;
    },700);
  }
}
function updateFlipTimer(){
  if(!fStartTime)return;
  const el=Math.floor((Date.now()-fStartTime)/1000),m=Math.floor(el/60),s=el%60;
  if(S("fTimer"))S("fTimer").textContent=m+":"+(s<10?"0":"")+s;
}
function finishFlip(){
  if(fTimerInterval){clearInterval(fTimerInterval);fTimerInterval=null;}
  const elapsed=Math.floor((Date.now()-fStartTime)/1000);
  const m=Math.floor(elapsed/60),s=elapsed%60;
  const fp=S("flip-play"),fo=S("flip-over");
  if(fp)fp.style.display="none";if(fo)fo.style.display="block";
  if(S("foTime"))S("foTime").textContent="完成時間："+m+"分"+s+"秒";
  if(S("foFlips"))S("foFlips").textContent="共翻牌 "+fFlipCount+" 次";
  saveScore("flip", elapsed, LV[fLevel]+" "+fPairs+"對");
  const fhist=getHistory("flip"); const fbest=fhist.length>1?Math.min(...fhist.map(r=>r.score)):elapsed;
  const foNew=S("foNew");
  if(elapsed<=fbest&&fhist.length===1){if(foNew){foNew.textContent="🌟 新紀錄！";foNew.style.color="#BA7517";}if(fFlipCount<=fPairs*2+4)startConfetti(document.body);}
  else{const bm=Math.floor(fbest/60),bs=fbest%60;if(foNew){foNew.textContent="最快紀錄："+bm+"分"+bs+"秒";foNew.style.color="#888780";}}
}

// ═══════════════════════════════════
// WORDLE GAME
// ═══════════════════════════════════
let wLevel=0,wTarget=null,wGuesses=[],wMaxGuesses=6,wGameOver=false;
function setWordleLevel(lv,btn){
  wLevel=lv;
  ["wlv0","wlv1","wlv2"].forEach((id,i)=>{const b=S(id);if(b)b.classList.toggle("active",i===lv);});
}
function startWordle(){
  const pool=[...BUILTIN,...myWords].filter(v=>v.lv===wLevel&&v.w.length>=3&&v.w.length<=9&&/^[a-z]+$/i.test(v.w));
  if(!pool.length){alert("此難度無合適單字！");return;}
  wTarget=pool[Math.floor(Math.random()*pool.length)];
  wGuesses=[];wGameOver=false;
  const wl=S("wordle-lobby"),wp=S("wordle-play"),wo=S("wordle-over");
  if(wl)wl.style.display="none";if(wo)wo.style.display="none";if(wp)wp.style.display="block";
  if(S("wClue"))S("wClue").textContent=wTarget.zh;
  if(S("wPos"))S("wPos").textContent=wTarget.pos;
  if(S("wLen"))S("wLen").textContent=wTarget.w.length+"字母";
  const wi=S("wInput");if(wi){wi.value="";wi.maxLength=wTarget.w.length;}
  if(S("wFeedback"))S("wFeedback").textContent="";
  buildWordleGrid();buildWordleKbd();
}
function buildWordleGrid(){
  const grid=S("wGrid");if(!grid)return;
  grid.innerHTML="";
  const len=wTarget.w.length;
  for(let r=0;r<wMaxGuesses;r++){
    const row=document.createElement("div");row.style.cssText="display:flex;gap:5px;justify-content:center";row.id="wRow"+r;
    for(let c=0;c<len;c++){
      const cell=document.createElement("div");cell.id="wCell_"+r+"_"+c;
      cell.style.cssText="width:42px;height:46px;border:2px solid #D3D1C7;border-radius:7px;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:700;color:#2C2C2A;background:#fff;transition:background .3s;font-family:monospace";
      row.appendChild(cell);
    }
    grid.appendChild(row);
  }
  wGuesses.forEach((_,r)=>renderWordleRow(r));
}
function buildWordleKbd(){
  const kbdEl=S("wKbd");if(!kbdEl)return;
  kbdEl.innerHTML="";
  ["qwertyuiop","asdfghjkl","zxcvbnm"].forEach((row,ri)=>{
    const div=document.createElement("div");div.style.cssText="display:flex;gap:4px;justify-content:center";
    if(ri===1){
      const del=document.createElement("button");del.textContent="⌫";
      del.style.cssText="padding:8px 10px;border:none;border-radius:6px;background:#D3D1C7;color:#2C2C2A;font-size:14px;cursor:pointer";
      del.onclick=()=>{const i=S("wInput");if(i)i.value=i.value.slice(0,-1);};
      div.appendChild(del);
    }
    row.split("").forEach(k=>{
      const btn=document.createElement("button");btn.id="wk_"+k;btn.textContent=k.toUpperCase();
      btn.style.cssText="padding:8px 6px;min-width:28px;border:none;border-radius:6px;background:#D3D1C7;color:#2C2C2A;font-size:12px;font-weight:600;cursor:pointer;font-family:monospace";
      btn.onclick=()=>{if(!wGameOver&&wTarget){const i=S("wInput");if(i&&i.value.length<wTarget.w.length)i.value+=k;}};
      div.appendChild(btn);
    });
    kbdEl.appendChild(div);
  });
}
function submitWordle(){
  if(wGameOver||!wTarget)return;
  const wi=S("wInput");if(!wi)return;
  const guess=wi.value.trim().toLowerCase();
  const fb=S("wFeedback");
  if(guess.length!==wTarget.w.length){if(fb){fb.textContent="需要 "+wTarget.w.length+" 個字母！";fb.style.color="#A32D2D";}return;}
  if(fb)fb.textContent="";
  const result=scoreWordle(guess,wTarget.w.toLowerCase());
  wGuesses.push({guess,result});
  renderWordleRow(wGuesses.length-1);
  updateWordleKbd(guess,result);
  wi.value="";
  const won=result.every(r=>r==="correct");
  if(won||wGuesses.length>=wMaxGuesses)setTimeout(()=>showWordleOver(won),500);
}
function scoreWordle(guess,target){
  const res=Array(target.length).fill("absent"),tArr=target.split(""),used=Array(target.length).fill(false);
  for(let i=0;i<guess.length;i++){if(guess[i]===tArr[i]){res[i]="correct";used[i]=true;}}
  for(let i=0;i<guess.length;i++){if(res[i]==="correct")continue;const j=tArr.findIndex((c,k)=>!used[k]&&c===guess[i]);if(j>=0){res[i]="present";used[j]=true;}}
  return res;
}
function renderWordleRow(r){
  const {guess,result}=wGuesses[r];
  guess.split("").forEach((ch,c)=>{
    const cell=S("wCell_"+r+"_"+c);if(!cell)return;
    cell.textContent=ch.toUpperCase();
    cell.style.background=result[c]==="correct"?"#EAF3DE":result[c]==="present"?"#FAEEDA":"#F1EFE8";
    cell.style.borderColor=result[c]==="correct"?"#639922":result[c]==="present"?"#BA7517":"#888780";
    cell.style.color=result[c]==="correct"?"#27500A":result[c]==="present"?"#633806":"#444441";
  });
}
function updateWordleKbd(guess,result){
  guess.split("").forEach((ch,i)=>{
    const btn=S("wk_"+ch);if(!btn)return;
    const cur=btn.dataset.state||"";
    if(cur==="correct")return;
    if(result[i]==="correct"){btn.style.background="#EAF3DE";btn.style.color="#27500A";btn.dataset.state="correct";}
    else if(result[i]==="present"&&cur!=="correct"){btn.style.background="#FAEEDA";btn.style.color="#633806";btn.dataset.state="present";}
    else if(result[i]==="absent"&&!cur){btn.style.background="#D3D1C7";btn.style.color="#888780";btn.dataset.state="absent";}
  });
}
function showWordleOver(won){
  const wp=S("wordle-play"),wo=S("wordle-over");
  if(wp)wp.style.display="none";if(wo)wo.style.display="block";
  if(S("woEmoji"))S("woEmoji").textContent=won?"🎉":"😢";
  if(S("woMsg"))S("woMsg").textContent=won?"太厲害了！（"+wGuesses.length+"/"+wMaxGuesses+"次）":"沒猜到，答案是：";
  if(S("woAnswer"))S("woAnswer").textContent=wTarget.w;
  if(S("woMeaning"))S("woMeaning").textContent=wTarget.zh+" · "+wTarget.pos;
  if(won){saveScore("wordle", wGuesses.length, "猜"+wGuesses.length+"次（"+wTarget.w+"）");if(wGuesses.length<=3)startConfetti(document.body);}
}
setTimeout(()=>{
  const wi=S("wInput");if(!wi)return;
  wi.addEventListener("keydown",e=>{if(e.key==="Enter")submitWordle();});
  wi.addEventListener("input",function(){if(wTarget)this.value=this.value.replace(/[^a-zA-Z]/g,"").slice(0,wTarget.w.length).toLowerCase();});
},800);


// ═══════════════════════════════════════
// ALL-DONE MODAL
// ═══════════════════════════════════════
function showAllDoneModal(){
  if(document.getElementById("allDoneOverlay"))return;
  const overlay=document.createElement("div");
  overlay.id="allDoneOverlay";
  overlay.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,0.55);display:flex;align-items:center;justify-content:center;z-index:9999;padding:1.5rem";
  overlay.innerHTML=`
    <div style="background:#fff;border-radius:24px;padding:2rem 1.5rem;max-width:360px;width:100%;text-align:center;position:relative">
      <div style="font-size:52px;margin-bottom:8px">🏆</div>
      <div style="font-size:22px;font-weight:700;color:#3C3489;margin-bottom:6px">今日任務全部完成！</div>
      <div style="font-size:15px;color:#534AB7;margin-bottom:18px">太厲害了！三項任務都達成了！</div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:20px">
        <div style="background:#EEEDFE;border-radius:10px;padding:10px 4px;text-align:center">
          <div style="font-size:18px;margin-bottom:2px">📖</div>
          <div style="font-size:12px;font-weight:600;color:#3C3489">單字 ✓</div>
        </div>
        <div style="background:#E1F5EE;border-radius:10px;padding:10px 4px;text-align:center">
          <div style="font-size:18px;margin-bottom:2px">✏️</div>
          <div style="font-size:12px;font-weight:600;color:#085041">拼字 ✓</div>
        </div>
        <div style="background:#FAEEDA;border-radius:10px;padding:10px 4px;text-align:center">
          <div style="font-size:18px;margin-bottom:2px">📝</div>
          <div style="font-size:12px;font-weight:600;color:#633806">文法 ✓</div>
        </div>
      </div>
      <p style="font-size:13px;color:#888780;margin-bottom:16px">明天繼續保持，進步看得見！</p>
      <button onclick="document.getElementById('allDoneOverlay').remove()" style="width:100%;padding:12px;background:#534AB7;color:#EEEDFE;border:none;border-radius:12px;font-size:15px;font-weight:600;cursor:pointer">太好了！繼續加油！</button>
    </div>`;
  document.body.appendChild(overlay);
  overlay.addEventListener("click",e=>{if(e.target===overlay)overlay.remove();});
}

// ═══════════════════════════════════════
// GRAMMAR ERROR STATS
// ═══════════════════════════════════════
function renderGramErrorCard(){
  const card=S("gramErrorCard");if(!card)return;
  const errors=stats.gramErrors||{};
  const entries=Object.entries(errors).sort((a,b)=>b[1]-a[1]);
  const count=S("gramErrorCount");
  const list=S("gramErrorList");
  const btn=S("gramReviewBtn");
  if(!entries.length){
    if(count)count.textContent="尚無錯誤紀錄";
    if(list)list.innerHTML='<p style="font-size:13px;color:#888780;padding:4px 0">繼續練習文法，錯誤統計會在這裡顯示</p>';
    if(btn)btn.style.display="none";
    return;
  }
  if(count)count.textContent="共 "+entries.length+" 種類型";
  if(btn)btn.style.display=entries.length?"block":"none";
  if(!list)return;
  list.innerHTML="";
  const maxErr=entries[0][1];
  entries.slice(0,8).forEach(([topic,cnt],i)=>{
    const pct=Math.round(cnt/maxErr*100);
    const row=document.createElement("div");
    row.style.cssText="margin-bottom:10px";
    row.innerHTML=`
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
        <span style="font-size:13px;font-weight:500;color:#2C2C2A">${topic}</span>
        <span style="font-size:12px;color:#A32D2D;font-weight:600">錯 ${cnt} 次</span>
      </div>
      <div style="background:#D3D1C7;border-radius:99px;height:6px;overflow:hidden">
        <div style="height:6px;border-radius:99px;width:${pct}%;background:${i===0?"#E24B4A":i<=2?"#EF9F27":"#BA7517"};transition:width .4s"></div>
      </div>`;
    list.appendChild(row);
  });
}

function startGramErrorReview(){
  const errors=stats.gramErrors||{};
  const badTopics=Object.entries(errors).sort((a,b)=>b[1]-a[1]).slice(0,5).map(e=>e[0]);
  if(!badTopics.length)return;
  gPool=GRAMMAR.filter(q=>q.lv===gLevel&&badTopics.includes(q.topic)).sort(()=>Math.random()-0.5).slice(0,10);
  if(!gPool.length){gPool=GRAMMAR.filter(q=>q.lv===gLevel).sort(()=>Math.random()-0.5).slice(0,10);}
  gIdx=0;gAnswered=new Array(gPool.length).fill(null);gScore=0;
  document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));
  document.querySelector('.tab[onclick*="grammar"]').classList.add("active");
  document.querySelectorAll(".tab-content").forEach(t=>t.style.display="none");
  switchTab("practice",document.querySelector('.tab[onclick*="practice"]')); switchPTab("grammar",S("ptab-btn-grammar"));
  renderGrammar();
}

// ═══════════════════════════════════════
// CEFR SYSTEM
// ═══════════════════════════════════════
const CEFR_DATA={
  A1:{color:"#1D9E75",bg:"#E1F5EE",label:"初學者",advice:"建議從國一基礎單字開始，每天完成單字練習10個，拼字練習10個。先熟悉最常用的200個生活單字，不需要太在意文法規則。",vocab:"國一基礎單字（lv:0）",gram:"be動詞・現在式・基礎疑問句"},
  A2:{color:"#534AB7",bg:"#EEEDFE",label:"基礎",advice:"已掌握基礎詞彙，開始加強文法練習。同時練習單字和拼字各10題，文法重點是現在式、過去式和冠詞。每週目標：練習150個單字。",vocab:"國一單字（全部）",gram:"過去式・冠詞・複數名詞・介系詞"},
  B1:{color:"#BA7517",bg:"#FAEEDA",label:"中級",advice:"具備日常溝通能力，建議挑戰國二單字。每天三項任務都要完成，文法重點是完成式、被動語態和比較級。",vocab:"國二單字（lv:1）",gram:"現在完成式・被動語態・比較級・連接詞"},
  B2:{color:"#D85A30",bg:"#FAECE7",label:"中高級",advice:"能夠理解複雜句型，建議主攻國二進階和國三單字。每天練習後玩遊戲鞏固記憶，挑戰Wordle和打地鼠地獄難度。",vocab:"國二＋國三單字（lv:1~2）",gram:"假設語氣・分詞構句・倒裝句"},
  C1:{color:"#185FA5",bg:"#E6F1FB",label:"高級",advice:"學術能力強，國三單字是重點。建議挑戰所有文法類型，目標每天正確率達到80%以上，遊戲全選困難難度。",vocab:"國三學術單字（lv:2）",gram:"所有文法類型・高級句型"},
  C2:{color:"#639922",bg:"#EAF3DE",label:"精通",advice:"已達精通水準，可作為學弟妹的榜樣！建議每天複習易錯單字，用遊戲保持語感。持續練習保持競爭力。",vocab:"所有單字複習",gram:"複習文法錯誤類型"},
};

function setCEFR(level,btn){
  stats.cefrLevel=level;saveData();renderCEFR();
}
function renderCEFR(){
  const lv=stats.cefrLevel||"";
  document.querySelectorAll(".cefr-btn").forEach(b=>{
    b.style.borderColor="#D3D1C7";b.style.background="#fff";
    b.querySelector("div:first-child").style.color="#2C2C2A";
  });
  const badge=S("cefrCurrentBadge");
  const adv=S("cefrAdvice");
  if(!lv||!CEFR_DATA[lv]){
    if(badge)badge.textContent="未設定";
    if(adv)adv.style.display="none";
    return;
  }
  const data=CEFR_DATA[lv];
  const btn=S("cefrBtn-"+lv);
  if(btn){btn.style.borderColor=data.color;btn.style.background=data.bg;btn.querySelector("div:first-child").style.color=data.color;}
  if(badge){badge.textContent=lv+" "+data.label;badge.style.background=data.bg;badge.style.color=data.color;}
  if(adv){
    adv.style.display="block";
    adv.innerHTML=`<div style="font-weight:600;color:#2C2C2A;margin-bottom:6px">${lv} 程度學習建議</div>
      <div style="margin-bottom:8px">${data.advice}</div>
      <div style="display:flex;flex-direction:column;gap:4px">
        <div style="font-size:12px"><span style="font-weight:600;color:#534AB7">📖 適合詞彙：</span>${data.vocab}</div>
        <div style="font-size:12px"><span style="font-weight:600;color:#BA7517">📝 文法重點：</span>${data.gram}</div>
      </div>`;
  }
}

// ═══════════════════════════════════════
// WORD CROSS (填字遊戲)
// ═══════════════════════════════════════
let wcLevel=0, wcWords=[], wcGrid=[], wcCells={}, wcSelected=null, wcDir="across", wcStartTime=null, wcTimerInterval=null, wcCompleted=0;
let wcRelaxMode=false, wcScore=0, wcTotalTime=180, wcTimeLeft=180;

function setWCLevel(lv,btn){
  wcLevel=lv;
  ["wclv0","wclv1","wclv2"].forEach((id,i)=>{const b=S(id);if(b)b.classList.toggle("active",i===lv);});
}

function startWC(relaxMode){
  if(relaxMode===undefined)relaxMode=false;
  wcRelaxMode=!!relaxMode;
  const lb=S("wc-lobby"),wp=S("wc-play"),wo=S("wc-over");
  if(lb)lb.style.display="none";if(wo)wo.style.display="none";if(wp)wp.style.display="block";
  if(wcTimerInterval){clearInterval(wcTimerInterval);wcTimerInterval=null;}
  wcCompleted=0;wcSelected=null;wcDir="across";wcCells={};wcWords=[];wcGrid=[];
  wcStartTime=Date.now();
  wcScore=0;wcTotalTime=180;wcTimeLeft=wcTotalTime;
  const td=S("wcTimerDisplay");
  const rb=S("wcRevealBtn");
  if(wcRelaxMode){
    if(td)td.textContent="";
    if(rb)rb.style.display="";
  } else {
    if(rb)rb.style.display="none";
    if(td)td.textContent="⏱ 剩餘 3:00";
    wcTimerInterval=setInterval(()=>{
      wcTimeLeft--;
      const m=Math.floor(wcTimeLeft/60),s=wcTimeLeft%60;
      if(td)td.textContent="⏱ 剩餘 "+m+":"+(s<10?"0":"")+s;
      if(wcTimeLeft<=3&&wcTimeLeft>0)speakCountdown(String(wcTimeLeft));
      if(wcTimeLeft<=0){speakCountdown("END");clearInterval(wcTimerInterval);wcTimerInterval=null;finishWC(wcTotalTime,true);}
    },1000);
  }
  const pool=[...BUILTIN,...myWords].filter(v=>v.lv===wcLevel&&v.w.length>=3&&v.w.length<=10&&/^[a-z]+$/i.test(v.w));
  pool.sort(()=>Math.random()-0.5);
  buildCrossword(pool.slice(0,40));
}

function buildCrossword(pool){
  const SIZE=14;
  const grid=Array.from({length:SIZE},()=>Array(SIZE).fill(null));
  const placed=[];
  // Try to place words into a crossword
  const tryPlace=(word,row,col,dir)=>{
    const letters=word.w.split("");
    if(dir==="across"){
      if(col+letters.length>SIZE)return false;
      // Check cells
      for(let c=0;c<letters.length;c++){
        const cell=grid[row][col+c];
        if(cell&&cell!==letters[c])return false;
        // check neighbors (no adjacent words)
        if(!cell){
          if(col+c>0&&grid[row][col+c-1]&&c===0)return false;
          if(col+c<SIZE-1&&grid[row][col+c+1]&&c===letters.length-1)return false;
          if(row>0&&grid[row-1][col+c]&&!placed.some(p=>p.row===row-1&&p.col<=col+c&&p.col+p.word.w.length>col+c&&p.dir==="across"))return false;
          if(row<SIZE-1&&grid[row+1][col+c]&&!placed.some(p=>p.row===row+1&&p.col<=col+c&&p.col+p.word.w.length>col+c&&p.dir==="across"))return false;
        }
      }
      letters.forEach((l,c)=>grid[row][col+c]=l);
      placed.push({word,row,col,dir:"across"});
      return true;
    } else {
      if(row+letters.length>SIZE)return false;
      for(let r=0;r<letters.length;r++){
        const cell=grid[row+r][col];
        if(cell&&cell!==letters[r])return false;
      }
      letters.forEach((l,r)=>grid[row+r][col]=l);
      placed.push({word,row,col,dir:"down"});
      return true;
    }
  };
  // Place first word in center
  const first=pool[0];const mid=Math.floor(SIZE/2);
  tryPlace(first,mid,Math.floor((SIZE-first.w.length)/2),"across");
  // Try to intersect remaining words
  let idx=1;let attempts=0;
  while(idx<pool.length&&placed.length<8&&attempts<300){
    attempts++;
    const word=pool[idx];const letters=word.w.split("");
    let placed_this=false;
    // find intersection
    for(const p of placed){
      const pl=p.word.w.split("");
      if(p.dir==="across"){
        for(let pc=0;pc<pl.length&&!placed_this;pc++){
          const ch=pl[pc];
          for(let wc=0;wc<letters.length&&!placed_this;wc++){
            if(letters[wc]===ch){
              placed_this=tryPlace(word,p.row-wc,p.col+pc,"down");
            }
          }
        }
      } else {
        for(let pr=0;pr<pl.length&&!placed_this;pr++){
          const ch=pl[pr];
          for(let wc=0;wc<letters.length&&!placed_this;wc++){
            if(letters[wc]===ch){
              placed_this=tryPlace(word,p.row+pr,p.col-wc,"across");
            }
          }
        }
      }
    }
    if(placed_this)idx++;else idx++;
  }
  if(placed.length<2){buildCrossword(pool.sort(()=>Math.random()-0.5));return;}
  // Number the words
  let num=1;
  const numbering=[];
  const startCells={};
  placed.forEach(p=>{
    const key=p.row+"_"+p.col;
    if(!startCells[key]){startCells[key]=num++;numbering.push({...p,num:startCells[key]});}
    else{numbering.push({...p,num:startCells[key]});}
  });
  wcWords=numbering;
  wcGrid=grid;
  wcCompleted=0;
  renderCrossword(grid,numbering,SIZE);
  renderClues(numbering);
  if(S("wcProgress"))S("wcProgress").textContent="完成 0 / "+wcWords.length+" 個單字";
}

function renderCrossword(grid,words,SIZE){
  const container=S("wcGrid");if(!container)return;
  container.innerHTML="";
  const CELL=32;
  // Find bounding box
  let minR=SIZE,maxR=0,minC=SIZE,maxC=0;
  for(let r=0;r<SIZE;r++)for(let c=0;c<SIZE;c++)if(grid[r][c]){minR=Math.min(minR,r);maxR=Math.max(maxR,r);minC=Math.min(minC,c);maxC=Math.max(maxC,c);}
  const rows=maxR-minR+1,cols=maxC-minC+1;
  const table=document.createElement("div");
  table.style.cssText="display:inline-grid;gap:2px;grid-template-columns:repeat("+cols+","+CELL+"px)";
  const startMap={};
  words.forEach(w=>{startMap[w.row+"_"+w.col]=(startMap[w.row+"_"+w.col]||[]).concat(w.num);});
  wcCells={};
  for(let r=minR;r<=maxR;r++){
    for(let c=minC;c<=maxC;c++){
      const letter=grid[r][c];
      const cell=document.createElement("div");
      cell.style.cssText="width:"+CELL+"px;height:"+CELL+"px;position:relative;";
      if(letter){
        cell.style.background="#fff";cell.style.border="1.5px solid #D3D1C7";cell.style.borderRadius="4px";cell.style.cursor="pointer";
        const key=r+"_"+c;
        const inp=document.createElement("div");
        inp.id="wcc_"+key;inp.dataset.row=r;inp.dataset.col=c;inp.dataset.answer=letter;
        inp.style.cssText="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:600;color:#2C2C2A;font-family:monospace;text-transform:uppercase";
        inp.textContent="";
        cell.appendChild(inp);
        wcCells[key]={row:r,col:c,answer:letter,filled:""};
        const numEl=startMap[key];
        if(numEl){
          const nb=document.createElement("div");
          nb.style.cssText="position:absolute;top:1px;left:2px;font-size:8px;font-weight:600;color:#888780;line-height:1";
          nb.textContent=numEl.join("/");
          cell.appendChild(nb);
        }
        cell.onclick=()=>wcCellClick(r,c);
      } else {
        cell.style.background="transparent";
      }
      table.appendChild(cell);
    }
  }
  container.appendChild(table);
  // Keyboard
  document.addEventListener("keydown",wcKeyHandler);
}

let wcKeyHandler_fn=null;
function wcKeyHandler(e){
  if(!wcSelected)return;
  const {row,col}=wcSelected;
  if(e.key.match(/^[a-zA-Z]$/)&&e.key.length===1){
    const key=row+"_"+col;
    if(wcCells[key]){
      wcCells[key].filled=e.key.toLowerCase();
      const el=S("wcc_"+key);if(el){el.textContent=e.key.toUpperCase();el.style.color=wcCells[key].filled===wcCells[key].answer?"#27500A":"#2C2C2A";}
      wcAdvanceCursor();wcCheckComplete();
    }
    e.preventDefault();
  } else if(e.key==="Backspace"){
    const key=row+"_"+col;
    if(wcCells[key]&&wcCells[key].filled){wcCells[key].filled="";const el=S("wcc_"+key);if(el){el.textContent="";el.style.color="#2C2C2A";}}
    else wcRetreatCursor();
    e.preventDefault();
  }
}

function wcCellClick(row,col){
  const key=row+"_"+col;
  if(!wcCells[key])return;
  // If clicking same cell, toggle direction
  if(wcSelected&&wcSelected.row===row&&wcSelected.col===col){
    wcDir=wcDir==="across"?"down":"across";
    if(!wcWordAt(row,col,wcDir))wcDir=wcDir==="across"?"down":"across";
  } else {
    wcSelected={row,col};
    if(!wcWordAt(row,col,wcDir)){wcDir=wcDir==="across"?"down":"across";}
  }
  wcSelected={row,col};
  wcHighlight();
}

function wcWordAt(row,col,dir){
  return wcWords.find(w=>w.dir===dir&&(dir==="across"?w.row===row&&w.col<=col&&w.col+w.word.w.length>col:w.col===col&&w.row<=row&&w.row+w.word.w.length>row));
}

function wcHighlight(){
  Object.keys(wcCells).forEach(key=>{
    const el=S("wcc_"+key);if(!el)return;
    const p=el.parentElement;
    p.style.background="#fff";p.style.borderColor="#D3D1C7";
  });
  if(!wcSelected)return;
  const word=wcWordAt(wcSelected.row,wcSelected.col,wcDir);
  if(word){
    const len=word.word.w.length;
    for(let i=0;i<len;i++){
      const key=word.dir==="across"?(word.row+"_"+(word.col+i)):((word.row+i)+"_"+word.col);
      const el=S("wcc_"+key);if(el){el.parentElement.style.background="#EEEDFE";el.parentElement.style.borderColor="#AFA9EC";}
    }
  }
  const selKey=wcSelected.row+"_"+wcSelected.col;
  const selEl=S("wcc_"+selKey);if(selEl){selEl.parentElement.style.background="#FAEEDA";selEl.parentElement.style.borderColor="#EF9F27";}
}

function wcAdvanceCursor(){
  if(!wcSelected)return;
  const {row,col}=wcSelected;
  const word=wcWordAt(row,col,wcDir);if(!word)return;
  if(wcDir==="across"){if(col+1<word.col+word.word.w.length)wcSelected={row,col:col+1};}
  else{if(row+1<word.row+word.word.w.length)wcSelected={row:row+1,col};}
  wcHighlight();
}
function wcRetreatCursor(){
  if(!wcSelected)return;
  const {row,col}=wcSelected;
  const word=wcWordAt(row,col,wcDir);if(!word)return;
  if(wcDir==="across"){if(col-1>=word.col)wcSelected={row,col:col-1};}
  else{if(row-1>=word.row)wcSelected={row:row-1,col};}
  wcHighlight();
}

function wcCheckComplete(){
  let done=0;
  wcWords.forEach(w=>{
    const len=w.word.w.length;let correct=true;
    for(let i=0;i<len;i++){
      const key=w.dir==="across"?(w.row+"_"+(w.col+i)):((w.row+i)+"_"+w.col);
      if(!wcCells[key]||wcCells[key].filled!==wcCells[key].answer){correct=false;break;}
    }
    if(correct)done++;
  });
  wcCompleted=done;
  if(S("wcProgress"))S("wcProgress").textContent="完成 "+done+" / "+wcWords.length+" 個單字";
  if(done===wcWords.length){
    const elapsed=Math.floor((Date.now()-wcStartTime)/1000);
    setTimeout(()=>finishWC(elapsed,false),400);
  }
}

function finishWC(elapsed,timeout){
  if(wcTimerInterval){clearInterval(wcTimerInterval);wcTimerInterval=null;}
  document.removeEventListener("keydown",wcKeyHandler);
  const wp=S("wc-play"),wo=S("wc-over");
  if(wp)wp.style.display="none";if(wo)wo.style.display="block";
  const m=Math.floor(elapsed/60),s=elapsed%60;
  if(wcRelaxMode){
    if(S("wcOverTime"))S("wcOverTime").textContent="完成時間："+m+"分"+s+"秒・共 "+wcWords.length+" 個單字";
    if(S("wcOverNew")){S("wcOverNew").textContent="悠閒模式，不計分";S("wcOverNew").style.color="#888780";}
  } else {
    const score=timeout?Math.round(wcCompleted/wcWords.length*500):Math.round((1+(wcTotalTime-elapsed)/wcTotalTime)*500);
    wcScore=score;
    if(S("wcOverTime"))S("wcOverTime").textContent=(timeout?"時間到！":"完成！")+" 完成 "+wcCompleted+"/"+wcWords.length+" 個單字";
    saveScore("wordcross",score,"限時・"+wcWords.length+"個單字");
    const hist=getHistory("wordcross");const best=hist.length>1?Math.max(...hist.map(r=>r.score)):score;
    if(S("wcOverNew")){
      if(score>=best&&hist.length<=1){S("wcOverNew").textContent="🌟 新紀錄！"+score+"分";S("wcOverNew").style.color="#BA7517";if(!timeout)startConfetti(document.body);}
      else{S("wcOverNew").textContent="最高紀錄："+best+" 分";S("wcOverNew").style.color="#888780";}
    }
  }
}

function wcRevealAll(){
  Object.keys(wcCells).forEach(key=>{
    wcCells[key].filled=wcCells[key].answer;
    const el=S("wcc_"+key);if(el){el.textContent=wcCells[key].answer.toUpperCase();el.style.color="#888780";}
  });
}

function renderClues(words){
  const across=words.filter(w=>w.dir==="across").sort((a,b)=>a.num-b.num);
  const down=words.filter(w=>w.dir==="down").sort((a,b)=>a.num-b.num);
  const clueEl=(id,list)=>{
    const el=S(id);if(!el)return;el.innerHTML="";
    list.forEach(w=>{
      const div=document.createElement("div");
      div.style.cssText="padding:5px 0;border-bottom:0.5px solid #D3D1C7;cursor:pointer";
      div.innerHTML=`<span style="font-size:12px;font-weight:600;color:#534AB7;margin-right:4px">${w.num}.</span><span style="font-size:12px;color:#5F5E5A">${w.word.zh}</span><span style="font-size:11px;color:#B4B2A9;margin-left:4px">(${w.word.w.length})</span>`;
      div.onclick=()=>{wcSelected={row:w.row,col:w.col};wcDir=w.dir;wcHighlight();};
      el.appendChild(div);
    });
  };
  clueEl("wcCluesAcross",across);
  clueEl("wcCluesDown",down);
}


// ══════════════════════════════════════
// COUNTDOWN VOICE
// ══════════════════════════════════════
function speakCountdown(text){
  if('speechSynthesis' in window){
    speechSynthesis.cancel();
    const u=new SpeechSynthesisUtterance(text==="END"?"End!":text);
    u.lang="en-US";u.rate=1.1;u.pitch=1.2;u.volume=1;
    speechSynthesis.speak(u);
  }
}

// ══════════════════════════════════════
// LEVEL SETTINGS MODAL
// ══════════════════════════════════════
const GRADE_TO_LV={
  "小學低年級":0,"小學中年級":0,"小學高年級":0,
  "國中一年級":0,"國中二年級":1,"國中三年級":2,
  "高中":2,"大學":2
};
const GRADE_CEFR={
  "小學低年級":"A1","小學中年級":"A1","小學高年級":"A2",
  "國中一年級":"A2","國中二年級":"B1","國中三年級":"B1",
  "高中":"B2","大學":"C1"
};
const CEFR_TO_LV={"A1":0,"A2":0,"B1":1,"B2":1,"C1":2,"C2":2};

function openLevelModal(){
  if(document.getElementById("levelModalOverlay"))return;
  const lv=stats.cefrLevel||"";
  const overlay=document.createElement("div");
  overlay.id="levelModalOverlay";
  overlay.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,0.55);display:flex;align-items:flex-end;justify-content:center;z-index:9998;padding:0";
  overlay.innerHTML=`
    <div style="background:#fff;border-radius:20px 20px 0 0;padding:1.5rem;width:100%;max-width:540px;max-height:90vh;overflow-y:auto">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
        <p style="font-size:16px;font-weight:600;color:#2C2C2A">⚙️ 程度設定</p>
        <button onclick="document.getElementById('levelModalOverlay').remove()" style="border:none;background:none;font-size:20px;cursor:pointer;color:#888780">✕</button>
      </div>

      <p style="font-size:13px;font-weight:600;color:#5F5E5A;margin-bottom:8px">依學習階段選擇</p>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:16px" id="gradeGrid">
        ${["小學低年級","小學中年級","小學高年級","國中一年級","國中二年級","國中三年級","高中","大學"].map(g=>`
        <div onclick="selectGrade('${g}')" id="grade-${g.replace(/\s/g,'_')}" style="padding:10px 8px;border:1.5px solid #D3D1C7;border-radius:10px;cursor:pointer;text-align:center;font-size:13px;font-weight:500;color:#2C2C2A;background:#fff">${g}</div>`).join("")}
      </div>

      <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">
        <div style="flex:1;height:0.5px;background:#D3D1C7"></div>
        <span style="font-size:12px;color:#888780">或依 CEFR 程度選擇</span>
        <div style="flex:1;height:0.5px;background:#D3D1C7"></div>
      </div>

      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:16px">
        ${["A1","A2","B1","B2","C1","C2"].map(c=>{
          const d={A1:"初學者",A2:"基礎",B1:"中級",B2:"中高級",C1:"高級",C2:"精通"};
          return `<div onclick="selectCEFR_modal('${c}')" id="cefrM-${c}" style="padding:10px 4px;border:1.5px solid #D3D1C7;border-radius:10px;cursor:pointer;text-align:center;background:#fff">
            <div style="font-size:16px;font-weight:600;color:#2C2C2A">${c}</div>
            <div style="font-size:11px;color:#888780;margin-top:2px">${d[c]}</div>
          </div>`;
        }).join("")}
      </div>

      <div id="modalLevelAdvice" style="background:#F1EFE8;border-radius:10px;padding:12px;font-size:13px;color:#5F5E5A;line-height:1.7;display:none;margin-bottom:12px"></div>

      <button onclick="applyLevelModal()" style="width:100%;padding:12px;background:#534AB7;color:#EEEDFE;border:none;border-radius:12px;font-size:15px;font-weight:600;cursor:pointer">套用設定</button>
    </div>`;
  _modalSelectedCEFR=stats.cefrLevel||"";
  _modalSelectedGrade=stats.gradeSetting||"";
  document.body.appendChild(overlay);
  overlay.addEventListener("click",e=>{if(e.target===overlay)overlay.remove();});
  // Restore current selection
  if(lv&&CEFR_DATA[lv])highlightCEFRModal(lv);
  if(stats.gradeSetting)highlightGradeModal(stats.gradeSetting);
}

let _modalSelectedCEFR="", _modalSelectedGrade="";
// Reset modal selection each time it opens
function selectGrade(g){
  _modalSelectedGrade=g;_modalSelectedCEFR=GRADE_CEFR[g]||"";
  highlightGradeModal(g);
  if(_modalSelectedCEFR)highlightCEFRModal(_modalSelectedCEFR);
  showModalAdvice(_modalSelectedCEFR);
}
function selectCEFR_modal(c){
  _modalSelectedCEFR=c;_modalSelectedGrade="";
  document.querySelectorAll("#gradeGrid>div").forEach(d=>{d.style.borderColor="#D3D1C7";d.style.background="#fff";d.style.color="#2C2C2A";});
  highlightCEFRModal(c);showModalAdvice(c);
}
function highlightGradeModal(g){
  document.querySelectorAll("#gradeGrid>div").forEach(d=>{d.style.borderColor="#D3D1C7";d.style.background="#fff";d.style.color="#2C2C2A";});
  const btn=document.getElementById("grade-"+g.replace(/\s/g,"_"));
  if(btn){btn.style.borderColor="#534AB7";btn.style.background="#EEEDFE";btn.style.color="#3C3489";}
}
function highlightCEFRModal(c){
  ["A1","A2","B1","B2","C1","C2"].forEach(x=>{const b=document.getElementById("cefrM-"+x);if(b){b.style.borderColor="#D3D1C7";b.style.background="#fff";b.querySelector("div").style.color="#2C2C2A";}});
  const btn=document.getElementById("cefrM-"+c);
  if(btn&&CEFR_DATA[c]){btn.style.borderColor=CEFR_DATA[c].color;btn.style.background=CEFR_DATA[c].bg;btn.querySelector("div").style.color=CEFR_DATA[c].color;}
}
function showModalAdvice(c){
  const adv=document.getElementById("modalLevelAdvice");if(!adv||!CEFR_DATA[c])return;
  const data=CEFR_DATA[c];
  adv.style.display="block";
  adv.innerHTML=`<b style="color:#2C2C2A">${c} ${data.label} 學習建議</b><br>${data.advice}<br><span style="font-size:12px">📖 ${data.vocab}</span>`;
}
function applyLevelModal(){
  const cefr=_modalSelectedCEFR||stats.cefrLevel;
  if(!cefr){alert("請選擇程度");return;}
  stats.cefrLevel=cefr;
  if(_modalSelectedGrade)stats.gradeSetting=_modalSelectedGrade;
  const lv=CEFR_TO_LV[cefr]??0;
  // Apply to all three practice areas
  vLevel=lv;sLevel=lv;gLevel=lv;
  // Update level buttons in all tabs
  ["#ptab-content-vocab .lbtn","#ptab-content-spell .lbtn","#ptab-content-grammar .lbtn"].forEach(sel=>{
    document.querySelectorAll(sel).forEach((b,i)=>b.classList.toggle("active",i===lv));
  });
  S("levelBadge").textContent=LV[lv];
  saveData();renderCEFR();
  initVocab();initSpell();initGrammar();
  document.getElementById("levelModalOverlay").remove();
  // Show brief toast
  const toast=document.createElement("div");
  toast.style.cssText="position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#534AB7;color:#EEEDFE;padding:10px 20px;border-radius:10px;font-size:14px;font-weight:500;z-index:9999;pointer-events:none";
  toast.textContent="✓ 程度已設定為 "+cefr;
  document.body.appendChild(toast);
  setTimeout(()=>toast.remove(),2500);
}


// ═══════════════════════════════════════════════════
// READING & LISTENING PASSAGES
// ═══════════════════════════════════════════════════
const PASSAGES = [
  {
    lv:0, title:"My Daily Routine",
    text:"My name is Amy. I wake up at seven o'clock every morning. First, I wash my face and brush my teeth. Then I eat breakfast with my family. We usually have eggs and toast. After breakfast, I walk to school with my friend Tom. School starts at eight thirty. I like my school because my teachers are kind and my classmates are fun. In the afternoon, I go home and do my homework. In the evening, I watch TV for one hour, then I read a book before I go to bed.",
    vocab:["routine","usually","classmates","afternoon","evening"],
    questions:[
      {q:"What time does Amy wake up?",opts:["Six o'clock","Seven o'clock","Eight o'clock","Nine o'clock"],ans:1},
      {q:"How does Amy go to school?",opts:["By bus","By bike","She walks","By car"],ans:2},
      {q:"What does Amy do before sleeping?",opts:["Watches TV","Eats dinner","Reads a book","Talks to friends"],ans:2},
      {q:"What does Amy think about her teachers?",opts:["Strict","Boring","Kind","Young"],ans:2},
    ]
  },
  {
    lv:0, title:"Animals at the Zoo",
    text:"Last Sunday, my family went to the zoo. There were many animals there. I saw lions, elephants, and pandas. My favorite animal is the panda. Pandas are black and white. They eat bamboo all day. They look very cute and lazy! We also saw a dolphin show. The dolphins jumped high and caught fish in the air. My little brother was very excited and shouted, 'Wow!' We took many photos and bought ice cream. It was a wonderful day.",
    vocab:["favorite","bamboo","excited","wonderful","dolphins"],
    questions:[
      {q:"Where did Amy's family go last Sunday?",opts:["The park","The beach","The zoo","The museum"],ans:2},
      {q:"What do pandas eat?",opts:["Fish","Bamboo","Bananas","Leaves"],ans:1},
      {q:"Who was very excited at the dolphin show?",opts:["Amy","Amy's parents","Amy's little brother","All of them"],ans:2},
      {q:"Which word best describes the pandas in the story?",opts:["Dangerous","Fast","Cute and lazy","Loud"],ans:2},
    ]
  },
  {
    lv:0, title:"A Rainy Day",
    text:"Yesterday was a rainy day. The sky was gray and it rained all morning. I could not go outside to play. I stayed at home and helped my mother bake cookies. We mixed flour, sugar, butter, and eggs together. The cookies smelled wonderful when they came out of the oven. My mother said I was a great helper! In the afternoon, the rain stopped and the sun came out. I saw a beautiful rainbow in the sky. It had seven colors. Even though it rained, it was still a happy day.",
    vocab:["stayed","bake","mixture","rainbow","beautiful"],
    questions:[
      {q:"Why couldn't the person go outside?",opts:["It was too hot","It was raining","The park was closed","It was dark"],ans:1},
      {q:"What did they bake?",opts:["A cake","Bread","Cookies","Muffins"],ans:2},
      {q:"How many colors does a rainbow have?",opts:["Five","Six","Seven","Eight"],ans:2},
      {q:"What happened in the afternoon?",opts:["It snowed","The rain stopped","They went shopping","A storm came"],ans:1},
    ]
  },
  {
    lv:1, title:"The Power of Reading",
    text:"Reading is one of the most powerful habits a person can develop. When you read, you learn new words and ideas without even realizing it. Studies show that students who read for pleasure at least 20 minutes a day score significantly higher on tests than those who do not. Reading also improves your ability to focus, since it requires sustained attention. Fiction books help readers understand different perspectives and develop empathy, while non-fiction books expand general knowledge. Whether you prefer stories or facts, the important thing is to read something you enjoy every day. Even reading on a tablet or phone counts — what matters is the habit.",
    vocab:["powerful","significantly","sustained","perspectives","empathy"],
    questions:[
      {q:"According to the passage, how long should students read each day for better test scores?",opts:["10 minutes","20 minutes","30 minutes","An hour"],ans:1},
      {q:"What skill does reading improve according to the text?",opts:["Memory","Focus","Speed","Writing"],ans:1},
      {q:"What do fiction books help readers develop?",opts:["Math skills","Empathy","Vocabulary only","Speed reading"],ans:1},
      {q:"What does the passage suggest is most important about reading?",opts:["Reading printed books","Reading non-fiction","Making it a daily habit","Reading at least an hour"],ans:2},
    ]
  },
  {
    lv:1, title:"Social Media and Teenagers",
    text:"Social media platforms have become a major part of teenagers' lives. On average, teens spend more than three hours per day on social media. While these platforms allow young people to stay connected with friends and explore their interests, there are significant concerns. Research suggests that excessive use is linked to anxiety, poor sleep, and lower academic performance. Cyberbullying is another serious issue that affects many young users. However, social media also has positive effects — it can be a place to find support communities, learn new skills, and discover creative inspiration. Experts recommend that teens set daily limits and take regular breaks from their screens to maintain a healthy balance.",
    vocab:["platforms","excessive","anxiety","cyberbullying","inspiration"],
    questions:[
      {q:"How many hours per day do teens spend on social media on average?",opts:["One hour","Two hours","More than three hours","Five hours"],ans:2},
      {q:"Which of the following is NOT mentioned as a negative effect?",opts:["Anxiety","Poor sleep","Lower grades","Losing friends"],ans:3},
      {q:"What do experts recommend to maintain a healthy balance?",opts:["Quit social media","Set daily limits and take breaks","Only use educational apps","Use phones only on weekends"],ans:1},
      {q:"What positive effect of social media is mentioned?",opts:["Improving sleep","Learning new skills","Better academic results","Making more friends at school"],ans:1},
    ]
  },
  {
    lv:2, title:"Artificial Intelligence in Education",
    text:"Artificial intelligence is reshaping the landscape of education in profound ways. Adaptive learning systems now analyze individual students' performance patterns and automatically adjust the difficulty and style of content to match each learner's needs. This personalization, previously possible only through private tutoring, is becoming accessible to students worldwide. AI-powered tools can also provide instant feedback on writing assignments, detect grammatical errors, suggest improvements, and even evaluate the coherence of arguments. However, critics caution that over-reliance on AI may undermine critical thinking if students passively accept AI-generated responses rather than engaging in genuine intellectual struggle. The most effective use of AI in education, educators argue, is as a scaffold — a tool that supports learning without replacing the cognitive effort that leads to deep understanding.",
    vocab:["adaptive","personalization","coherence","undermine","scaffold"],
    questions:[
      {q:"What do adaptive learning systems do?",opts:["Replace teachers entirely","Adjust content to individual learner needs","Only teach mathematics","Provide standardized tests"],ans:1},
      {q:"What concern do critics raise about AI in education?",opts:["It is too expensive","It only works for advanced students","It may undermine critical thinking","It cannot detect grammar errors"],ans:2},
      {q:"According to educators, what is the best use of AI in learning?",opts:["To replace textbooks","As a scaffold to support learning","To reduce homework","To evaluate teachers"],ans:1},
      {q:"What does 'scaffold' mean in this context?",opts:["A building structure","A tool that replaces cognitive effort","A supporting tool for learning","An AI grading system"],ans:2},
    ]
  },
];

let readLevel=0, readMode="read", readPassageIdx=0, readAnswers=[], readPassage=null, readAlreadySubmitted=false;

function setReadLevel(lv,btn){
  readLevel=lv;
  ["rlv0","rlv1","rlv2"].forEach((id,i)=>{const b=S(id);if(b)b.classList.toggle("active",i===lv);});
}
function openReading(mode){
  readMode=mode;
  const sel=S("reading-selector"),play=S("reading-play");
  if(sel)sel.style.display="none";if(play)play.style.display="block";
  S("readingModeLabel").textContent=mode==="read"?"📖 閱讀測驗":"🎧 聽力測驗";
  S("readingLevelBadge").textContent=["國一","國二","國三"][readLevel];
  S("readListenBtn").style.display=mode==="read"?"block":"none";
  loadReadingPassage();
}
function backToReadingSelector(){
  if(speechSynthesis)speechSynthesis.cancel();
  S("reading-selector").style.display="block";S("reading-play").style.display="none";
}
function loadReadingPassage(){
  let pool=PASSAGES.filter(p=>p.lv===readLevel);
  if(!pool.length){readLevel=0;pool=[...PASSAGES.filter(p=>p.lv===0)];}
  readPassage=pool[readPassageIdx%pool.length];readPassageIdx++;
  readAnswers=new Array(readPassage.questions.length).fill(null);
  readAlreadySubmitted=false;
  S("readingTitle").textContent=readPassage.title;
  if(readMode==="read"){
    S("readingPassage").style.display="block";S("listeningArea").style.display="none";
    // Highlight vocab words
    let html=readPassage.text;
    readPassage.vocab.forEach(w=>{html=html.replace(new RegExp('\\b'+w+'\\b','gi'),m=>`<span style="background:#FAEEDA;color:#633806;border-radius:3px;padding:0 2px;font-weight:600">${m}</span>`);});
    S("readingPassage").innerHTML=html;
  } else {
    S("readingPassage").style.display="none";S("listeningArea").style.display="block";
    setTimeout(()=>readAloud(),500);
  }
  // Vocab highlights
  const vh=S("vocabHighlights");vh.innerHTML="";
  readPassage.vocab.forEach(w=>{
    const entry=[...BUILTIN,...myWords].find(v=>v.w===w)||{w,zh:"",pos:""};
    const chip=document.createElement("span");
    chip.style.cssText="background:#EEEDFE;color:#3C3489;padding:3px 10px;border-radius:99px;font-size:12px;font-weight:500;cursor:pointer";
    chip.textContent=w+(entry.zh?" · "+entry.zh:"");
    chip.onclick=()=>speakWord(w);
    vh.appendChild(chip);
  });
  renderReadingQuestions();
  S("readingSubmitBtn").style.display="block";
  S("readingResult").style.display="none";
  S("readingNextBtn").style.display="none";
}
function speakWord(w){
  if('speechSynthesis' in window){speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(w);u.lang="en-US";u.rate=0.8;speechSynthesis.speak(u);}
}
function readAloud(){
  if('speechSynthesis' in window){
    speechSynthesis.cancel();
    const u=new SpeechSynthesisUtterance(readPassage.text);
    u.lang="en-US";u.rate=0.85;u.pitch=1;speechSynthesis.speak(u);
  }
}
function renderReadingQuestions(){
  const container=S("readingQuestions");container.innerHTML="";
  readPassage.questions.forEach((q,qi)=>{
    const block=document.createElement("div");
    block.className="card";block.style.marginBottom="10px";
    block.innerHTML=`<p style="font-size:14px;font-weight:500;color:#2C2C2A;margin-bottom:10px">${qi+1}. ${q.q}</p><div id="rqOpts_${qi}" style="display:flex;flex-direction:column;gap:8px"></div>`;
    container.appendChild(block);
    const optsDiv=block.querySelector("#rqOpts_"+qi);
    q.opts.forEach((opt,oi)=>{
      const btn=document.createElement("button");
      btn.className="opt-btn";btn.textContent=opt;btn.dataset.qi=qi;btn.dataset.oi=oi;
      btn.onclick=()=>selectReadAns(qi,oi);
      optsDiv.appendChild(btn);
    });
  });
}
function selectReadAns(qi,oi){
  if(readAlreadySubmitted)return;
  readAnswers[qi]=oi;
  const optsDiv=S("rqOpts_"+qi);if(!optsDiv)return;
  optsDiv.querySelectorAll(".opt-btn").forEach((b,i)=>{
    b.classList.toggle("selected-opt",i===oi);
    b.style.background=i===oi?"#EEEDFE":"";b.style.borderColor=i===oi?"#534AB7":"#D3D1C7";
  });
}
function submitReading(){
  if(readAlreadySubmitted)return;
  readAlreadySubmitted=true;
  let score=0;
  readPassage.questions.forEach((q,qi)=>{
    const chosen=readAnswers[qi];const correct=q.ans;const ok=(chosen===correct);
    if(ok)score++;
    const optsDiv=S("rqOpts_"+qi);if(!optsDiv)return;
    optsDiv.querySelectorAll(".opt-btn").forEach((b,i)=>{
      b.disabled=true;
      if(i===correct)b.classList.add("correct");
      else if(i===chosen&&chosen!==correct)b.classList.add("wrong");
    });
  });
  const pct=Math.round(score/readPassage.questions.length*100);
  const result=S("readingResult");result.style.display="block";
  result.innerHTML=`<div class="card" style="text-align:center;padding:1.5rem">
    <div style="font-size:36px;margin-bottom:6px">${pct>=80?"🎉":pct>=60?"😊":"💪"}</div>
    <div style="font-size:22px;font-weight:700;color:#534AB7;margin-bottom:2px">${score} / ${readPassage.questions.length}</div>
    <div style="font-size:15px;color:#888780">${pct}% 正確率</div>
    <div style="font-size:13px;color:#5F5E5A;margin-top:8px">${pct>=80?"閱讀理解非常好！":"多練習閱讀，理解力會越來越強！"}</div>
  </div>`;
  S("readingSubmitBtn").style.display="none";
  S("readingNextBtn").style.display="block";
}
function nextReadingPassage(){loadReadingPassage();}

// ═══════════════════════════════════════════════════
// PLACEMENT TEST
// ═══════════════════════════════════════════════════
const PT_QUESTIONS=[
  // A1 (0-5)
  {lv:"A1",cat:"📖 詞彙",inst:"選出正確的中文意思",stem:"book",opts:["書","狗","貓","樹"],ans:0},
  {lv:"A1",cat:"📝 文法",inst:"選出正確的句子",stem:"She ___ a student.",opts:["am","is","are","be"],ans:1},
  {lv:"A1",cat:"📖 詞彙",inst:"選出正確的中文意思",stem:"happy",opts:["生氣的","悲傷的","快樂的","害怕的"],ans:2},
  {lv:"A1",cat:"🔡 句子完成",inst:"選出最適合的單字",stem:"I go to ___ every day.",opts:["work","school","sleep","eat"],ans:1},
  {lv:"A1",cat:"📝 文法",inst:"選出正確的句子",stem:"There ___ many students in the class.",opts:["is","am","are","be"],ans:2},
  {lv:"A1",cat:"📖 詞彙",inst:"選出正確的中文意思",stem:"family",opts:["朋友","學校","家庭","城市"],ans:2},
  // A2 (6-11)
  {lv:"A2",cat:"📖 詞彙",inst:"選出正確的中文意思",stem:"arrive",opts:["離開","到達","等待","出發"],ans:1},
  {lv:"A2",cat:"📝 文法",inst:"選出正確的句子",stem:"She ___ her homework yesterday.",opts:["finish","finishes","finished","finishing"],ans:2},
  {lv:"A2",cat:"🔡 句子完成",inst:"選出最適合的單字",stem:"I am very tired ___ I worked all day.",opts:["so","but","because","and"],ans:2},
  {lv:"A2",cat:"📖 詞彙",inst:"選出正確的中文意思",stem:"careful",opts:["粗心的","小心的","快樂的","緊張的"],ans:1},
  {lv:"A2",cat:"📝 文法",inst:"選出正確的句子",stem:"She ___ lived in Taipei for three years.",opts:["is","was","has","have"],ans:2},
  {lv:"A2",cat:"🔡 句子完成",inst:"選出最適合的單字",stem:"This movie is ___ boring that I fell asleep.",opts:["too","such","so","very"],ans:2},
  // B1 (12-17)
  {lv:"B1",cat:"📖 詞彙",inst:"選出正確的中文意思",stem:"efficient",opts:["有效率的","昂貴的","危險的","友善的"],ans:0},
  {lv:"B1",cat:"📝 文法",inst:"選出正確的句子",stem:"If it ___ tomorrow, we will cancel the trip.",opts:["rain","rains","rained","will rain"],ans:1},
  {lv:"B1",cat:"📚 閱讀理解",inst:"根據以下短文回答",stem:'Mark reads for 30 minutes before bed. He says it helps him relax. His sister prefers watching TV instead. Who reads before sleeping?',opts:["Mark's sister","Mark","Both of them","Neither"],ans:1},
  {lv:"B1",cat:"🔡 句子完成",inst:"選出最適合的單字",stem:"Not only ___ she smart, but she is also hardworking.",opts:["is","are","was","be"],ans:0},
  {lv:"B1",cat:"📖 詞彙",inst:"選出正確的中文意思",stem:"persist",opts:["放棄","持續努力","理解","比較"],ans:1},
  {lv:"B1",cat:"📝 文法",inst:"選出正確的句子",stem:"The letter ___ written by the principal.",opts:["is","was","has","have"],ans:1},
  // B2 (18-23)
  {lv:"B2",cat:"📖 詞彙",inst:"選出正確的中文意思",stem:"ambiguous",opts:["清楚的","模糊不明的","危險的","重要的"],ans:1},
  {lv:"B2",cat:"📝 文法",inst:"選出正確的句子",stem:"Had she studied harder, she ___ passed the exam.",opts:["would","would have","will","had"],ans:1},
  {lv:"B2",cat:"📚 閱讀理解",inst:"根據以下短文回答",stem:'Despite the heavy rain, the match continued. The home team, already exhausted, conceded two goals in the final ten minutes. What happened to the home team?',opts:["They won the match","They scored two goals","They lost in the final minutes","They stopped playing due to rain"],ans:2},
  {lv:"B2",cat:"🔡 句子完成",inst:"選出最適合的單字",stem:"She gave a speech so ___ that the audience stood up and applauded.",opts:["moving","moved","move","mover"],ans:0},
  {lv:"B2",cat:"📖 詞彙",inst:"選出正確的中文意思",stem:"scrutinize",opts:["忽視","仔細審查","慶祝","提出"],ans:1},
  {lv:"B2",cat:"📝 文法",inst:"選出正確的句子",stem:"___ to her strict diet, she managed to lose 10 kg in three months.",opts:["Attributing","Attributed","Due","Owing"],ans:3},
  // C1 (24-29)
  {lv:"C1",cat:"📖 詞彙",inst:"選出正確的中文意思",stem:"equivocate",opts:["明確表達","故意說模糊話","誇大其詞","嚴正抗議"],ans:1},
  {lv:"C1",cat:"📚 閱讀理解",inst:"根據以下短文回答",stem:"The study posits that correlation does not imply causation. Researchers found that cities with more ice cream sales had higher crime rates, yet concluded that ice cream does not cause crime. What logical principle does this illustrate?",opts:["Confirmation bias","Correlation vs causation","The placebo effect","Sample size error"],ans:1},
  {lv:"C1",cat:"📝 文法",inst:"選出正確的句子",stem:"No sooner ___ she arrived than the meeting started.",opts:["had","has","did","was"],ans:0},
  {lv:"C1",cat:"🔡 句子完成",inst:"選出最適合的單字",stem:"The policy was met with considerable ___ from the academic community.",opts:["acclaim","skepticism","indifference","clarity"],ans:1},
  {lv:"C1",cat:"📖 詞彙",inst:"選出正確的中文意思",stem:"ephemeral",opts:["永恆的","短暫的","巨大的","模糊的"],ans:1},
  {lv:"C1",cat:"📝 文法",inst:"選出正確的句子",stem:"___ the complexity of the issue, a swift resolution seems unlikely.",opts:["Given","Giving","Given that","With given"],ans:0},
];

let ptIdx=0, ptAnswers=[], ptScore={vocab:0,gram:0,read:0,total:0}, ptTotal={vocab:0,gram:0,read:0};
let ptResult="", ptAutoTimer=null;

function startPlacement(){
  S("pm-home").style.display="none";
  S("pm-result").style.display="none";
  S("pm-test").style.display="block";
  ptIdx=0;ptAnswers=[];ptScore={vocab:0,gram:0,read:0,total:0};ptTotal={vocab:0,gram:0,read:0};
  PT_QUESTIONS.forEach(q=>{
    if(q.cat.includes("詞彙"))ptTotal.vocab++;
    else if(q.cat.includes("文法"))ptTotal.gram++;
    else if(q.cat.includes("閱讀"))ptTotal.read++;
  });
  renderPTQuestion();
}
function renderPTQuestion(){
  if(ptIdx>=PT_QUESTIONS.length){showPlacementResult();return;}
  const q=PT_QUESTIONS[ptIdx];
  S("ptProgressText").textContent="題目 "+(ptIdx+1)+" / "+PT_QUESTIONS.length;
  S("ptProgressBar").style.width=Math.round((ptIdx/PT_QUESTIONS.length)*100)+"%";
  S("ptCategory").textContent=q.cat;
  S("ptInstruction").textContent=q.inst;
  S("ptStem").textContent=q.stem;
  S("ptFeedback").textContent="";
  const opts=S("ptOpts");opts.innerHTML="";
  q.opts.forEach((opt,i)=>{
    const btn=document.createElement("button");
    btn.className="opt-btn";btn.textContent=opt;
    btn.onclick=()=>answerPT(i);
    opts.appendChild(btn);
  });
}
function answerPT(chosen){
  if(ptAutoTimer){clearTimeout(ptAutoTimer);ptAutoTimer=null;}
  const q=PT_QUESTIONS[ptIdx];
  const ok=(chosen===q.ans);
  document.querySelectorAll("#ptOpts .opt-btn").forEach((b,i)=>{
    b.disabled=true;
    if(i===q.ans)b.classList.add("correct");
    else if(i===chosen&&!ok)b.classList.add("wrong");
  });
  if(ok){
    ptScore.total++;
    if(q.cat.includes("詞彙"))ptScore.vocab++;
    else if(q.cat.includes("文法"))ptScore.gram++;
    else if(q.cat.includes("閱讀"))ptScore.read++;
    S("ptFeedback").textContent="✓ 答對了！";S("ptFeedback").style.color="#27500A";
  } else {
    S("ptFeedback").textContent="✗ 答錯了";S("ptFeedback").style.color="#A32D2D";
  }
  ptAnswers.push({q,chosen,ok});
  ptAutoTimer=setTimeout(()=>{ptIdx++;renderPTQuestion();},1200);
}
function showPlacementResult(){
  S("pm-test").style.display="none";
  S("pm-result").style.display="block";
  // Calculate CEFR from score
  const pct=ptScore.total/PT_QUESTIONS.length;
  const byLv={A1:0,A2:0,B1:0,B2:0,C1:0};
  const countLv={A1:0,A2:0,B1:0,B2:0,C1:0};
  ptAnswers.forEach(a=>{countLv[a.q.lv]++;if(a.ok)byLv[a.q.lv]++;});
  let cefr="A1";
  const lvOrder=["A1","A2","B1","B2","C1"];
  for(let i=0;i<lvOrder.length;i++){
    const lv=lvOrder[i];const pass=countLv[lv]>0?(byLv[lv]/countLv[lv])>=0.5:false;
    if(pass)cefr=lv;else break;
  }
  ptResult=cefr;
  const data=CEFR_DATA[cefr]||{label:"",advice:"",color:"#534AB7",bg:"#EEEDFE"};
  S("prEmoji").textContent=pct>=0.8?"🏆":pct>=0.6?"🎉":"😊";
  S("prLevel").textContent=cefr;S("prLevel").style.color=data.color;
  S("prLevelName").textContent=data.label;S("prLevelName").style.color=data.color;
  S("prDesc").textContent=data.advice;
  const vPct=ptTotal.vocab>0?Math.round(ptScore.vocab/ptTotal.vocab*100)+"%":"—";
  const gPct=ptTotal.gram>0?Math.round(ptScore.gram/ptTotal.gram*100)+"%":"—";
  const rPct=ptTotal.read>0?Math.round(ptScore.read/ptTotal.read*100)+"%":"—";
  S("prVocab").textContent=vPct;S("prGram").textContent=gPct;S("prRead").textContent=rPct;
  S("prAdvice").textContent=data.advice;
  // Save result
  stats.placementResult={cefr,pct:Math.round(pct*100),date:new Date().toLocaleDateString("zh-TW")};
  saveData();
  const ptLast=S("ptLastResult"),ptLastScore=S("ptLastScore");
  if(ptLast)ptLast.style.display="block";
  if(ptLastScore)ptLastScore.textContent=cefr+" · "+Math.round(pct*100)+"% · "+stats.placementResult.date;
  if(pct>=0.7)startConfetti(document.body);
}
function applyPlacementResult(){
  if(!ptResult)return;
  stats.cefrLevel=ptResult;saveData();renderCEFR();
  const lv={"A1":0,"A2":0,"B1":1,"B2":1,"C1":2,"C2":2}[ptResult]??0;
  vLevel=lv;sLevel=lv;gLevel=lv;
  ["#ptab-content-vocab .lbtn","#ptab-content-spell .lbtn","#ptab-content-grammar .lbtn"].forEach(sel=>{
    document.querySelectorAll(sel).forEach((b,i)=>b.classList.toggle("active",i===lv));
  });
  S("levelBadge").textContent=LV[lv];
  initVocab();initSpell();initGrammar();
  // Show toast
  const toast=document.createElement("div");
  toast.style.cssText="position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#534AB7;color:#EEEDFE;padding:10px 20px;border-radius:10px;font-size:14px;font-weight:500;z-index:9999;pointer-events:none";
  toast.textContent="✓ 程度已設定為 "+ptResult;
  document.body.appendChild(toast);setTimeout(()=>toast.remove(),2500);
  closePlacementModal();
}
function resetPlacement(){
  S("pm-result").style.display="none";
  S("pm-home").style.display="block";
  if(stats.placementResult){
    const pl=S("ptLastResult"),ps=S("ptLastScore");
    if(pl)pl.style.display="block";
    if(ps)ps.textContent=stats.placementResult.cefr+" · "+stats.placementResult.pct+"% · "+stats.placementResult.date;
  }
}



// ═══════════════════════════════════════════════════════════
// 複習錯誤單字 — 獨立功能
// ═══════════════════════════════════════════════════════════
let wrPool=[], wrIdx=0, wrScore=0, wrMode='all', wrSessionScore=0, wrSessionTotal=0;
let wrThisRoundWrong=[];  // 本輪答錯的

function openWrongReview(){
  const wrongs = getAllWrongWords();
  const wrModal = S('wrongReviewOverlay');
  
  // 重設到首頁
  S('wrHome').style.display='block';
  S('wrSession').style.display='none';
  S('wrRoundEnd').style.display='none';
  
  if(!wrongs.length){
    S('wrSourceBtns').innerHTML='';
    S('wrBtnAll').style.display='none';
    S('wrNoError').style.display='block';
  } else {
    S('wrNoError').style.display='none';
    S('wrBtnAll').style.display='block';
    
    // 統計各來源
    const vocabWrong = wrongs.filter(w=>w.wrongSrc==='vocab');
    const spellWrong = wrongs.filter(w=>w.wrongSrc==='spell');
    const mixWrong   = wrongs.filter(w=>!w.wrongSrc||w.wrongSrc==='vocab');  // 舊資料當 vocab

    let btns = '';
    if(vocabWrong.length)
      btns += `<button onclick="startWrongSession('vocab')" style="width:100%;padding:12px;background:#fff;border:2px solid #A32D2D;border-radius:12px;font-size:14px;font-weight:600;color:#A32D2D;cursor:pointer;text-align:left">
        📖 單字練習錯誤 <span style="float:right;background:#A32D2D;color:#fff;border-radius:20px;padding:2px 10px">${vocabWrong.length} 個</span></button>`;
    if(spellWrong.length)
      btns += `<button onclick="startWrongSession('spell')" style="width:100%;padding:12px;background:#fff;border:2px solid #2E4057;border-radius:12px;font-size:14px;font-weight:600;color:#2E4057;cursor:pointer;text-align:left">
        ✏️ 拼字練習錯誤 <span style="float:right;background:#2E4057;color:#fff;border-radius:20px;padding:2px 10px">${spellWrong.length} 個</span></button>`;
    S('wrSourceBtns').innerHTML = btns;
    S('wrSubtitle').textContent = `共 ${wrongs.length} 個錯誤單字`;
  }
  wrModal.style.display='block';
  document.body.style.overflow='hidden';
}

function closeWrongReview(){
  S('wrongReviewOverlay').style.display='none';
  document.body.style.overflow='';
}

function startWrongSession(mode){
  const all = getAllWrongWords();
  let pool;
  if(mode==='vocab')       pool = all.filter(w=>w.wrongSrc==='vocab'||!w.wrongSrc);
  else if(mode==='spell')  pool = all.filter(w=>w.wrongSrc==='spell');
  else                     pool = all;

  if(!pool.length) return;
  wrMode = mode;
  wrPool = pool.sort(()=>Math.random()-0.5);
  wrIdx = 0; wrScore = 0; wrSessionScore=0; wrSessionTotal=pool.length;
  wrThisRoundWrong = [];

  S('wrHome').style.display='none';
  S('wrRoundEnd').style.display='none';
  S('wrSession').style.display='block';

  renderWrQuestion();
}

function renderWrQuestion(){
  if(wrIdx >= wrPool.length){ showWrRoundEnd(); return; }
  const w = wrPool[wrIdx];
  const pct = Math.round(wrIdx/wrPool.length*100);
  S('wrProgress').textContent = `第 ${wrIdx+1} / ${wrPool.length} 題`;
  S('wrScore').textContent = `✓ ${wrScore}`;
  S('wrProgressBar').style.width = pct+'%';
  S('wrFeedback').style.display='none';
  S('wrNextBtn').style.display='none';

  if(wrMode==='spell'){
    renderWrSpell(w);
  } else {
    renderWrVocab(w);
  }
}

// ── Vocab 模式 ─────────────────────────────────────────────
function renderWrVocab(w){
  S('wrVocabCard').style.display='block';
  S('wrSpellCard').style.display='none';
  S('wrWord').textContent = w.w;
  S('wrPron').textContent = w.ph||w.p||'';
  S('wrPos').textContent  = w.pos||'';

  // 4選1：1個正確 + 3個干擾
  const all = [...BUILTIN,...myWords];
  const distractors = all.filter(v=>v.w!==w.w && v.lv===w.lv)
    .sort(()=>Math.random()-0.5).slice(0,3).map(v=>v.zh);
  const choices = [w.zh, ...distractors].sort(()=>Math.random()-0.5);

  S('wrVocabChoices').innerHTML = choices.map(c=>
    `<button onclick="checkWrVocab(this,'${w.zh}','${w.w}')"
      style="padding:12px;background:#fff;border:2px solid #E0DDD6;border-radius:12px;font-size:15px;cursor:pointer;text-align:left;transition:all 0.15s">${c}</button>`
  ).join('');
}

function checkWrVocab(btn, correct, wordStr){
  // 鎖住所有按鈕
  document.querySelectorAll('#wrVocabChoices button').forEach(b=>b.onclick=null);
  const ok = btn.textContent.trim()===correct;
  if(ok){
    btn.style.background='#C6EFCE'; btn.style.borderColor='#4CAF50';
    wrScore++;
    showWrFeedback(true, wordStr, correct);
  } else {
    btn.style.background='#FFC7CE'; btn.style.borderColor='#E53935';
    // 標綠正確
    document.querySelectorAll('#wrVocabChoices button').forEach(b=>{
      if(b.textContent.trim()===correct){ b.style.background='#C6EFCE'; b.style.borderColor='#4CAF50'; }
    });
    showWrFeedback(false, wordStr, correct);
    wrThisRoundWrong.push(wordStr);
  }
  S('wrNextBtn').style.display='block';
}

// ── Spell 模式 ──────────────────────────────────────────────
function renderWrSpell(w){
  S('wrVocabCard').style.display='none';
  S('wrSpellCard').style.display='block';
  S('wrSpellFeedback').style.display='none';
  S('wrSpellZh').textContent = w.zh||'';
  S('wrSpellPos').textContent = w.pos||'';
  // 提示：顯示首字母 + 字長
  const hint = w.w[0] + '_'.repeat(w.w.length-1) + ` (${w.w.length}個字母)`;
  S('wrSpellHint').textContent = `提示：${hint}`;
  S('wrSpellInput').value='';
  S('wrSpellInput').style.borderColor='#E0DDD6';
  S('wrSpellInput').style.background='#fff';
  S('wrSpellInput').disabled=false;
  S('wrSpellInput').focus();
}

function checkWrSpell(){
  const w = wrPool[wrIdx];
  const input = S('wrSpellInput').value.trim().toLowerCase();
  if(!input) return;
  S('wrSpellInput').disabled=true;
  const ok = input === w.w.toLowerCase();
  if(ok){ wrScore++; S('wrSpellInput').style.background='#C6EFCE'; }
  else { S('wrSpellInput').style.background='#FFC7CE'; wrThisRoundWrong.push(w.w); }

  // 顯示答案
  const ex = (w.ex||'').replace(/<b>|<\/b>/g,'');
  S('wrSpellAnswer').textContent = w.w;
  S('wrSpellAnswer').style.color = ok?'#2E7D32':'#C62828';
  S('wrSpellEx').textContent = ex;
  S('wrSpellFeedback').style.display='block';
  showWrFeedback(ok, w.w, w.zh);
  S('wrNextBtn').style.display='block';
}

function showWrFeedback(ok, wordStr, zhStr){
  const fb = S('wrFeedback');
  fb.style.display='block';
  fb.style.background = ok?'#C6EFCE':'#FFC7CE';
  S('wrFeedbackIcon').textContent = ok?'✅':'❌';
  S('wrFeedbackText').textContent = ok?'答對了！':'答錯了';
  S('wrFeedbackWord').textContent = ok?`「${wordStr}」= ${zhStr}`:`正確答案：${wordStr} = ${zhStr}`;
}

function wrNext(){
  wrIdx++;
  S('wrFeedback').style.display='none';
  S('wrNextBtn').style.display='none';
  renderWrQuestion();
}

// ── 輪次結束 ────────────────────────────────────────────────
function showWrRoundEnd(){
  S('wrSession').style.display='none';
  S('wrRoundEnd').style.display='block';
  const total = wrPool.length;
  const pct = Math.round(wrScore/total*100);

  S('wrEndIcon').textContent = pct===100?'🎉': pct>=70?'👍':'💪';
  S('wrEndTitle').textContent = pct===100?'全對！太厲害了！': pct>=70?`答對 ${wrScore}/${total}！繼續加油！`:`答對 ${wrScore}/${total}，再練一次吧`;
  S('wrEndMsg').textContent = `本輪正確率 ${pct}%`;

  if(wrThisRoundWrong.length){
    S('wrStillWrong').style.display='block';
    S('wrStillWrongList').innerHTML = wrThisRoundWrong
      .map(ww=>{ const found=[...BUILTIN,...myWords].find(v=>v.w===ww); return `<span style="display:inline-block;background:#fff;border-radius:6px;padding:2px 8px;margin:2px;font-weight:600">${ww}</span>${found?` ${found.zh}`:''}` })
      .join('&nbsp; ');
    S('wrContinueBtn').style.display='block';
    S('wrContinueBtn').textContent = `再練一輪（${wrThisRoundWrong.length} 個錯誤）`;
  } else {
    S('wrStillWrong').style.display='none';
    S('wrContinueBtn').textContent = '再練一遍（全部）';
    S('wrContinueBtn').style.display='block';
  }
}

function continueWrongReview(){
  // 如果上輪有錯，只練錯的；否則全部再練
  if(wrThisRoundWrong.length){
    const all=[...BUILTIN,...myWords];
    wrPool = wrThisRoundWrong.map(ww=>{ 
      const found=all.find(v=>v.w===ww)||{w:ww,zh:'',pos:''};
      return {...found, wrongSrc:wrMode==='spell'?'spell':'vocab'};
    }).sort(()=>Math.random()-0.5);
  } else {
    wrPool = wrPool.sort(()=>Math.random()-0.5);
  }
  wrIdx=0; wrScore=0; wrThisRoundWrong=[];
  S('wrRoundEnd').style.display='none';
  S('wrSession').style.display='block';
  renderWrQuestion();
}
