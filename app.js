(() => {
'use strict';

/* =========================================================
   Helpers
   ========================================================= */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
const clone = (o) => JSON.parse(JSON.stringify(o));
const nf = new Intl.NumberFormat('en-US');
const fmt = (n) => nf.format(Math.round(n || 0));
let WORD_RE;
try { WORD_RE = new RegExp("[\\p{L}\\p{N}]+(?:['’\\-][\\p{L}\\p{N}]+)*", 'gu'); } catch (e) { WORD_RE = /[A-Za-z0-9À-ÿ]+(?:['’-][A-Za-z0-9À-ÿ]+)*/g; }
const countWords = (t) => { const m = String(t || '').match(WORD_RE); return m ? m.length : 0; };
const dayKey = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const trunc = (s, n) => (s.length > n ? s.slice(0, n).replace(/\s+\S*$/, '') + '…' : s);
const finePointer = () => { try { return matchMedia('(pointer: fine)').matches; } catch (e) { return false; } };
function ago(ts) {
  if (!ts) return '';
  const s = (Date.now() - ts) / 1000;
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  if (s < 86400) return `${Math.floor(s / 3600)} h ago`;
  if (s < 172800) return 'yesterday';
  if (s < 604800) return `${Math.floor(s / 86400)} days ago`;
  return new Date(ts).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

const ICONS = {
  back: '<path d="M15 18l-6-6 6-6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  spark: '<path class="f" d="M12 2.5c.7 4.9 3.1 7.3 8 8-4.9.7-7.3 3.1-8 8-.7-4.9-3.1-7.3-8-8 4.9-.7 7.3-3.1 8-8z"/><path class="f" d="M19 16c.3 1.8 1.2 2.7 3 3-1.8.3-2.7 1.2-3 3-.3-1.8-1.2-2.7-3-3 1.8-.3 2.7-1.2 3-3z"/>',
  more: '<circle class="f" cx="5" cy="12" r="1.7"/><circle class="f" cx="12" cy="12" r="1.7"/><circle class="f" cx="19" cy="12" r="1.7"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  copy: '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h9"/>',
  trash: '<path d="M4 7h16M9 7V4.5h6V7M6.5 7l1 13h9l1-13"/>',
  send: '<path d="M5 12h13M13 6l6 6-6 6"/>',
  stop: '<rect class="f" x="7" y="7" width="10" height="10" rx="2"/>',
  flame: '<path d="M12 3c.8 3.6 5 5 5 10a5 5 0 0 1-10 0c0-2.4 1.3-3.9 2.4-5 .3 1.6 1.1 2.6 2.1 3 .1-2.6-.4-5.4.5-8z"/>',
  download: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
  edit: '<path d="M4 20h4L19 9l-4-4L4 16v4zM13.5 6.5l4 4"/>',
  rewrite: '<path d="M4.5 11a7.5 7.5 0 0 1 13.2-4.6M19.5 13a7.5 7.5 0 0 1-13.2 4.6M18 3v4h-4M6 21v-4h4"/>',
  dialogue: '<path d="M4 5h11v8H9l-5 3.5V5z"/><path d="M15 9h5v10.5L16.5 17H10v-4"/>',
  eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
  signpost: '<path d="M12 3v18M12 5.5h6.5l2 2.5-2 2.5H12M12 12.5H5.5l-2 2.5 2 2.5H12"/>',
  hook: '<path d="M15 3v10.5a5 5 0 0 1-10 0V11l3 2.5"/><circle cx="15" cy="3" r="0.5"/>',
  proof: '<path d="M4 6.5h11M4 11.5h8M4 16.5h5M13 16.5l3 3 5-6"/>',
  recap: '<path d="M6 3.5h8.5L19 8v12.5H6z"/><path d="M14 3.5V8h5M9 12.5h7M9 16.5h5"/>',
  chat: '<path d="M4 5.5h16v10.5H10l-5 4v-4H4z"/>',
  book: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5v-15z"/><path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5"/>',
  list: '<path d="M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20.5a6.5 6.5 0 0 1 13 0M16 4.7a3.5 3.5 0 0 1 0 6.6M18 14.3a6.5 6.5 0 0 1 3.5 6.2"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3z"/>',
  chev: '<path d="M9 6l6 6-6 6"/>',
  undo: '<path d="M9 14L4 9l5-5M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/>',
  voice: '<path d="M4 18V6M8 15V9M12 20V4M16 16V8M20 13v-2"/>',
  sliders: '<path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/>',
  feed: '<path d="M20 12a7.5 7.5 0 0 1-10.9 6.7L4 20l1.3-4.6A7.5 7.5 0 1 1 20 12z"/><path class="f" d="M10 9.3l4.2 2.7-4.2 2.7z"/>',
};
const icon = (n, cls = '') => `<svg class="ic ${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[n] || ''}</svg>`;

const GENRES = ['Fantasy', 'Romance', 'Xianxia / Cultivation', 'LitRPG / System', 'Urban fantasy', 'Sci-fi', 'Mystery / Thriller', 'Horror', 'Historical', 'Slice of life', 'Action', 'Other'];
const SCHEDULES = ['Not set', 'Daily', '5× a week', '3× a week', 'Weekly'];
const STATUS = { draft: 'Draft', ready: 'Ready to post', published: 'Published' };
const HUES = [196, 172, 146, 84, 36, 14, 350, 322, 268, 226];
const ED_SIZES = { s: '16px', m: '18px', l: '21px' };

/* ---- Plotfeed helpers and starter worlds ---- */
const AV_COLORS = ['#0F766E', '#1D4ED8', '#BE123C', '#A16207', '#6D28D9', '#334155', '#A21CAF', '#15803D', '#C2410C', '#0369A1'];
const REL_LABELS = ['Enemy', 'Hostile', 'Wary', 'Neutral', 'Friendly', 'Ally', 'Devoted'];
const relLabel = (v) => REL_LABELS[Math.max(-3, Math.min(3, Math.round(Number(v) || 0))) + 3];
const relClass = (v) => (v > 0 ? 'pos' : v < 0 ? 'neg' : 'neu');
const reduced = (() => { try { return matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; } })();
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const hashStr = (s) => { let h = 0; for (const ch of String(s)) h = (h * 31 + ch.codePointAt(0)) >>> 0; return h; };
const toHandle = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9_]/g, '').slice(0, 15);
function initials(name) {
  let w = [];
  try { w = String(name).replace(/[^\p{L}\p{N}\s]/gu, ' ').trim().split(/\s+/).filter(Boolean); } catch (e) { w = String(name).trim().split(/\s+/).filter(Boolean); }
  if (w.length > 1 && /^(the|a|an)$/i.test(w[0])) w = w.slice(1);
  if (!w.length) return '?';
  return (w.length === 1 ? w[0].slice(0, 2) : w[0][0] + w[w.length - 1][0]).toUpperCase();
}

const WORLDS = [
  { id: 'neon', name: 'Neon Harbor', tagline: 'Cyberpunk port city', genre: 'Sci-fi', tags: ['Cyberpunk', 'Rivals', 'Rise to fame'], hue: 268, pattern: 1,
    premise: 'A rain-soaked port city run by megacorps, where rolling blackouts hit every week. You are an up-and-coming street streamer trying to get famous before the lights go out for good.',
    novelPremise: 'In a rain-soaked port city run by megacorps, {mc}, an up-and-coming street streamer, tries to get famous before the weekly blackouts put the lights out for good.',
    mcNote: 'Up-and-coming street streamer. Films anything that glows. Wants to be famous before the lights go out.',
    style: 'Fast and neon-noir. Short punchy paragraphs, lots of banter, city noise in every scene.',
    world: [['Neon Harbor', 'A megacorp-run port city. Rolling blackouts hit every week, and Pier 9 is the only place that never goes dark.'], ['The blackouts', 'Nobody officially knows who triggers them. Mister Glass always seems to know the exact minute.']],
    threads: ['Who is triggering the weekly blackouts?', 'What is Vex planning for the biggest heist stream of the year?'],
    cast: [
      { id: 'vex', name: 'Vex Kaito', handle: 'vexkaito', role: 'Rival hacker-streamer', personality: 'smug, competitive, secretly impressed', color: '#6D28D9', rel: -1,
        intro: 'oh look, a new streamer in MY harbor. cute. following so I can watch you flop.',
        lines: ['cute. my stream did 4x that last week.', 'not bad. still not me though.', 'ok this one was actually funny. telling no one I said that.', 'ratio incoming.'] },
      { id: 'dane', name: 'Captain Oriel Dane', handle: 'captaindane', role: 'Harbor police chief', personality: 'stern, by-the-book, dry humor', color: '#1D4ED8', rel: -1,
        intro: 'Following you for public-safety reasons. Stay out of restricted zones.',
        lines: ['Noted. Do not make me come down there.', 'This better not involve the ferry terminal again.', 'Citizens, please do not encourage this.', 'Filed under: things I did not need to read today.'] },
      { id: 'juno', name: 'Juno Park', handle: 'junopark', role: 'Former idol, now activist', personality: 'warm, idealistic, protective', color: '#BE123C', rel: 1,
        intro: 'welcome to the harbor!! the people here are loud but they have big hearts 💗',
        lines: ['love this so much!! 💗', 'stay safe out there please', 'this is the energy the harbor needs', 'proud of you, genuinely'] },
      { id: 'glass', name: 'Mister Glass', handle: 'mr_glass', role: 'Anonymous corporate fixer', personality: 'cryptic, ominous, polite', color: '#334155', rel: 0,
        intro: 'I follow everyone who might become interesting. Do not disappoint.',
        lines: ['Interesting.', 'Some lights go out on purpose.', 'I have saved this post. For later.', 'Careful who you trust after midnight.'] },
      { id: 'pip', name: 'Pip', handle: 'pip_delivers', role: 'Delivery drone with a fan account', personality: 'chaotic, gossipy, all caps when excited', color: '#0F766E', rel: 1,
        intro: 'NEW FOLLOW!!! i deliver noodles AND updates. mostly updates.',
        lines: ['SCREAMING', 'posting this to my close friends drone list', 'ok but WHO is this about', 'i was THERE. i saw everything.'] },
    ],
    buzz: [['glass', 'The grid fails at 11:40 tonight. I would stay indoors. Or not.'], ['pip', 'DELIVERY UPDATE: sector 4 is dark again. i am navigating by vibes']] },
  { id: 'rimewater', name: 'Rimewater Academy', tagline: 'Spell school under a lake', genre: 'Fantasy', tags: ['Magic school', 'Rivals', 'Mystery'], hue: 196, pattern: 2,
    premise: 'A school of spellcraft built beneath a frozen lake, where student rankings are posted publicly every Friday. You are a first-year with a strange talent nobody can place.',
    novelPremise: 'Beneath a frozen lake, at a school of spellcraft that posts every student’s ranking each Friday, first-year {mc} has a strange talent nobody can place.',
    mcNote: 'First-year student with a strange talent nobody can place.',
    style: 'Cozy and eerie. Warm humor, candlelit corridors, magic with firm rules.',
    world: [['Rimewater Academy', 'A school of spellcraft built beneath a frozen lake. The ceiling of the great hall is the underside of the ice.'], ['The Friday Rankings', 'Every student is ranked in public each Friday. The bottom five are sent up to the surface school for “remedial review”.']],
    threads: ['What is the first-year’s strange talent?', 'Who cursed the cafeteria?'],
    cast: [
      { id: 'crane', name: 'Professor Ansel Crane', handle: 'prof_crane', role: 'Transmutation professor', personality: 'strict, sarcastic, fair', color: '#A16207', rel: 0,
        intro: 'I follow all first-years. It helps me predict who will explode something.',
        lines: ['See me after class.', 'Minus five points for spelling.', 'Adequate. That is high praise.', 'I will pretend I did not read this.'] },
      { id: 'sable', name: 'Sable Thorn', handle: 'sablethorn', role: 'Top-ranked rival student', personality: 'cold, ambitious, competitive', color: '#334155', rel: -1,
        intro: 'Following to keep an eye on the competition. Don’t read into it.',
        lines: ['Cute trick. I learned that at nine.', 'Rankings come out Friday. We’ll see.', '...fine. That was clever.', 'Try harder.'] },
      { id: 'wick', name: 'Wick', handle: 'wick_the_ghost', role: 'School ghost who posts at 3am', personality: 'eerie, playful, nosy', color: '#6D28D9', rel: 1,
        intro: 'boo. i live in the east stairwell. we’re friends now.',
        lines: ['i saw that from inside the wall', '3am thoughts: this post', 'the portraits are talking about you', 'hehe'] },
      { id: 'rosalind', name: 'Rosalind Fay', handle: 'headgirl_ros', role: 'Head girl', personality: 'perfectionist, bossy, secretly kind', color: '#A21CAF', rel: 0,
        intro: 'Welcome to Rimewater. Please read the 40-page handbook. There will be a quiz.',
        lines: ['This violates at least three rules.', 'Proud of you. Don’t tell anyone.', 'Please tag your posts correctly.', 'Curfew is in ten minutes.'] },
      { id: 'crumb', name: 'Barnaby Crumb', handle: 'crumb_bakes', role: 'Cafeteria golem', personality: 'wholesome, gentle, loves bread, types in caps', color: '#C2410C', rel: 2,
        intro: 'HELLO FRIEND. I MADE YOU A WELCOME BUN.',
        lines: ['VERY GOOD POST. HAVE A BUN.', 'I AM PROUD OF YOU, SMALL WIZARD.', 'THIS POST IS WARM LIKE BREAD.', 'PLEASE EAT A VEGETABLE.'] },
    ],
    buzz: [['crane', 'Whoever turned the lake into soup: I am not angry. I am taking notes.'], ['wick', 'the portraits on floor 3 are gossiping again. i know things now']] },
  { id: 'starlight', name: 'Starlight House', tagline: 'Idol trainee survival show', genre: 'Slice of life', tags: ['Idols', 'Rivals', 'Reality show'], hue: 322, pattern: 0,
    premise: 'A dorm of twelve idol trainees on a survival show where the public votes every week. You are the trainee who joined late, and the cameras never stop rolling.',
    novelPremise: 'On a survival show where the public votes every week, {mc} joins a dorm of twelve idol trainees late, and the cameras never stop rolling.',
    mcNote: 'The trainee who joined late. Talented, underprepared, and watched by everyone.',
    style: 'Bright and dramatic. Quick scenes, confessional asides, a fight in every practice room.',
    world: [['Starlight House', 'The trainee dorm. There are cameras in every room except the laundry closet.'], ['The weekly vote', 'The public votes every Friday. The bottom two leave the house on live TV.']],
    threads: ['Why did the show let a trainee join this late?', 'Who is feeding ivy.tea her “sources”?'],
    cast: [
      { id: 'han', name: 'Director Han', handle: 'director_han', role: 'Show producer', personality: 'ruthless, dramatic, obsessed with ratings', color: '#334155', rel: 0,
        intro: 'Following. Ratings go up when you post. Keep posting.',
        lines: ['Good. More of this. Ratings are up.', 'Boring. The audience wants drama.', 'This clip is going in episode 6.', 'I did not approve this. I love it.'] },
      { id: 'seoyun', name: 'Seo-yun', handle: 'seoyun_center', role: 'Center-position rival', personality: 'polished, competitive, passive-aggressive', color: '#BE123C', rel: -1,
        intro: 'welcome! so brave to join this late 🙂',
        lines: ['so brave 🙂', 'interesting choice!', 'congrats!! (practice room is free at 5am btw)', 'love that for you 🙂'] },
      { id: 'leo', name: 'Leo Marchetti', handle: 'leo_marchetti', role: 'Trainee and class clown', personality: 'goofy, loyal, hypes everyone up', color: '#C2410C', rel: 2,
        intro: 'NEW ROOMMATE LETS GOOO. i will teach you the dorm snack hiding spots',
        lines: ['LETS GOOOO', 'this is my roommate btw 😤', 'protect them at all costs', 'i cried a little ngl'] },
      { id: 'ivy', name: 'ivy.tea', handle: 'ivy_tea', role: 'Anonymous gossip account', personality: 'messy, sharp, always says "sources say"', color: '#6D28D9', rel: 0,
        intro: 'sources say there’s a new trainee. sources say we’re watching 👀',
        lines: ['sources say... 👀', 'screenshotted.', 'the group chat is going CRAZY', 'not the late joiner doing this'] },
      { id: 'kim', name: 'Manager Kim', handle: 'manager_kim', role: 'Trainee manager', personality: 'exhausted, caring, protective', color: '#0F766E', rel: 1,
        intro: 'Hi. Please drink water and sleep before 2am. Thank you.',
        lines: ['Please log off and sleep.', 'I am proud of you. Now delete this.', 'Water. Drink it.', 'Call me before you post next time.'] },
    ],
    buzz: [['han', 'Elimination round moved up to Friday. Good luck. You will need it.'], ['ivy', 'sources say two trainees had a SCREAMING match in practice room B 👀']] },
  { id: 'gilded', name: 'The Gilded Court', tagline: 'Royal court intrigue', genre: 'Historical', tags: ['Court intrigue', 'Romance', 'Scandal'], hue: 36, pattern: 3,
    premise: 'A glittering royal court where alliances shift every ball and the palace gazette prints everything. You are a newly arrived courtier from a minor house with big ambitions.',
    novelPremise: 'At a glittering royal court where alliances shift every ball and the palace gazette prints everything, {mc}, a newcomer from a minor house, arrives with big ambitions.',
    mcNote: 'Courtier from a minor house, newly arrived. Big ambitions, small purse.',
    style: 'Witty and ornate. Whispered asides, sharp dialogue, every ballroom a battlefield.',
    world: [['The Gilded Court', 'Alliances shift at every ball. The Palace Gazette prints everything, true or not.'], ['The Winter Ball', 'Attendance is not optional. Seating charts have ended careers.']],
    threads: ['Who ruined the cake at the last ball, and why?', 'Who left the unsigned letter in the east wing?'],
    cast: [
      { id: 'isolde', name: 'Queen Isolde', handle: 'queen_isolde', role: 'The reigning queen', personality: 'regal, amused, quietly dangerous, uses the royal "we"', color: '#A16207', rel: 0,
        intro: 'We have noticed you. Consider it an honor.',
        lines: ['We are amused.', 'We are not amused.', 'Bring this one to the next ball.', 'Careful. We read everything.'] },
      { id: 'cassian', name: 'Prince Cassian', handle: 'prince_cassian', role: 'Charming second-born prince', personality: 'flirtatious, bored, rebellious', color: '#1D4ED8', rel: 1,
        intro: 'finally, someone new at court. please be interesting.',
        lines: ['ok this is the best thing at court today', 'mother will hate this. perfect.', 'save me a dance', 'who let you be this funny'] },
      { id: 'mireille', name: 'Lady Mireille', handle: 'lady_mireille', role: 'Royal spymaster', personality: 'calm, calculating, calls everyone darling', color: '#6D28D9', rel: 0,
        intro: 'Welcome, darling. I already know where you were last night.',
        lines: ['Noted, darling.', 'I know who you were with.', 'How very unwise.', 'I adore this. I have questions.'] },
      { id: 'tobble', name: 'Tobble', handle: 'tobble_jests', role: 'Court jester', personality: 'mocking, truthful, sometimes rhymes', color: '#15803D', rel: 0,
        intro: 'a new face at court, how fresh and how brave, let’s see if you’re clever or dig your own grave',
        lines: ['a post so bold, a take so hot, is this a plan or is it not?', 'HA.', 'the fool agrees with the fool', 'even I would not have said this'] },
      { id: 'vale', name: 'Archbishop Vale', handle: 'archbishop_vale', role: 'Head of the royal chapel', personality: 'pious, judgmental, secretly petty', color: '#334155', rel: -1,
        intro: 'I follow all newcomers so I may pray for them. Some more than others.',
        lines: ['I shall pray for you.', 'Scandalous.', 'This will be discussed on Sunday.', 'Blessings. Reluctantly.'] },
    ],
    buzz: [['mireille', 'Someone left a letter in the east wing. Unsigned. How thrilling.'], ['tobble', 'the cake fell down, the baker has fled, the duke blames the duchess, the duchess blames bread']] },
];

/* =========================================================
   State
   ========================================================= */
const APP_VERSION = '1.0.0';
const defaultProfile = () => ({ dailyGoal: 1000, days: {}, last: null, edSize: 'm', lastBackup: null, installHidden: false });
const S = {
  mode: 'connecting',   // device (IndexedDB) | local (localStorage) | memory
  store: null,
  persisted: false,
  firstRun: false,
  profile: defaultProfile(),
  novels: new Map(),
  chapters: new Map(),
  engines: new Map(),   // Plotfeed boards by novel id; null = no board yet
  route: { name: 'library' },
  tab: 'chapters',
  pending: 0,
  saveError: false,
  typing: null,
  ctx: null,            // context for the open sheet (e.g. the outline picker)
  form: null,
  restoreData: null,
  // Plotfeed
  pfPick: null,         // character picked on the setup screen
  pfMode: 'do',         // do | say | cast | world
  pfWho: null,          // who acts when the mode is "cast"
  pfT: 0,               // tension change for the next entry
  pfReply: null,        // { postId, author, text, rel } while writing a reaction
  pfDraft: null,
};

/* =========================================================
   Example novels (shown on a writer's first visit, marked "Example")
   ========================================================= */
function buildExamples() {
  const now = Date.now(), H = 3600e3, D = 86400e3;
  const salt = {
    id: 'ex-salt', example: true, title: 'The Salt Archivist', genre: 'Fantasy', tags: ['Mystery', 'Found family', 'Slow burn'],
    language: 'English', schedule: '3× a week', target: 2000, pov: 'Third person limited (Wren)', tense: 'Past',
    style: 'Atmospheric but wry. Short paragraphs, sensory detail from salt and water, dry humour in Wren’s inner voice.',
    premise: 'A junior archivist who reads memories stored in salt finds a crystal she has already read, and no memory of reading it.',
    synopsis: 'In the half-drowned city of Hollowmere, memories are stored in salt crystals, and reading one costs the reader a memory of their own. Junior archivist Wren Aldous finds a crystal marked as already read by her, with no memory of it. To learn what she gave up, she must trust a smuggler, defy her mentor, and outwit the Pale Clerk, a man no one can remember seeing.',
    characters: [
      { id: 'c1', name: 'Wren Aldous', role: 'Protagonist', note: '19, junior archivist at the Brine Library. Reads salt-memories unusually fast. Dry humour; hates the toll.' },
      { id: 'c2', name: 'Master Oyelaran', role: 'Mentor', note: 'Head archivist. Logs every toll in a neat hand. Kind, secretive, knows more about Wren’s mark than he admits.' },
      { id: 'c3', name: 'Cass Tidewell', role: 'Ally', note: 'Smuggler of stolen crystals. Charming, always damp, unreliable. Owes Wren a favour she can’t remember.' },
      { id: 'c4', name: 'The Pale Clerk', role: 'Antagonist', note: 'Buys memories for an unknown client. Nobody can recall his face five minutes after meeting him.' },
    ],
    world: [
      { id: 'w1', name: 'Hollowmere', note: 'A city half-sunk in a salt lagoon. Canals replace streets in the lower quarters; tide bells ring every hour.' },
      { id: 'w2', name: 'The toll', note: 'Reading a memory crystal takes one of the reader’s own memories as payment, chosen at random.' },
      { id: 'w3', name: 'Reader’s mark', note: 'Each archivist’s personal sigil, etched into a crystal’s base the moment they read it.' },
    ],
    cover: { hue: 196, pattern: 0 }, muse: [], createdAt: now - 9 * D, updatedAt: now - 3 * H,
  };
  const salt1 = {
    id: 'ex-salt-1', novelId: 'ex-salt', n: 1, title: 'The Toll', status: 'published', createdAt: now - 9 * D, updatedAt: now - 2 * D,
    recap: 'Wren, a junior archivist in drowned Hollowmere, reads a lamplighter’s memory and pays the toll by losing her first cat’s name. Master Oyelaran logs every toll. Wren then finds an uncatalogued, warm crystal bearing her own reader’s mark, one she has no memory of reading.',
    text: `The tide bells of Hollowmere rang nine, and Wren Aldous was still underwater in someone else’s memory.

She surfaced the way she always did: salt on her tongue, a stranger’s grief fading from her chest like a bruise going yellow. The crystal on the reading desk dimmed to the colour of weak tea. Somewhere below the Brine Library, the lagoon sucked at the pilings.

“Well?” Master Oyelaran did not look up from his ledger. “Whose was it?”

“A lamplighter. Forty years ago. He watched the east quarter go under.” Wren flexed her fingers until they stopped trembling. “He was in love with a woman who sold eels. He never told her.”

“And the toll?”

That was the question he always asked, and the one she hated most. Every memory you read took one of yours in payment. The Archive called it the toll. Wren called it theft with better manners.

She searched herself carefully, the way you pat your pockets after a crowded market. Her mother’s voice: still there. The smell of the Lantern Street bakery: there. The name of her first cat—

Gone. A clean gap, like a tooth pulled in her sleep.

“Something small,” she said. “A cat, I think.”

Oyelaran wrote it down. He wrote every toll down, in a hand so neat it looked printed. Wren had once asked why, and he had said, *Because someday you will want to know what you were.*

She was reaching for the next crystal on the cart when she noticed the one that did not belong. It sat apart from the others in a velvet tray, uncatalogued, faintly warm. Etched into its base, in the Archive’s own script, was a reader’s mark.

Her mark.

She had never read this crystal. She was certain of it.

Which meant that whatever was inside had already cost her something she could no longer remember.`,
  };
  const salt2 = {
    id: 'ex-salt-2', novelId: 'ex-salt', n: 2, title: 'A Crystal With My Name', status: 'draft', recap: '', createdAt: now - 1 * D, updatedAt: now - 3 * H,
    text: `Wren did not sleep. She sat on the narrow bed in the archivists’ dormitory with the crystal in her lap and a blanket around her shoulders, listening to the tide bells count the hours.

Ten. Eleven. Midnight, which in Hollowmere sounded like a door closing somewhere far away.

The rules were simple, and she had copied them out forty times as an apprentice. Never read a crystal alone. Never read a crystal twice. Never read a crystal that bears your own mark, because the Archive does not make mistakes, and if your mark is there, you have already paid.

She turned it over. In the lamplight the salt looked almost pink, like the inside of a shell.

A knock at the window made her drop it.

Nobody knocked at a third-floor window unless they had come by boat, and nobody came by boat at midnight unless they were a smuggler or a ghost. Wren had met both. She preferred the ghosts; they didn’t haggle.

She pulled back the curtain.

Cass Tidewell grinned at her through the glass, soaked to the knees, a lantern hooked on the prow of a flat-bottomed skiff. He tapped the pane again and mouthed something that looked a lot like *We need to talk about what you’re holding.*

Wren looked down at the crystal. Then back at Cass.

She had not told anyone about it.`,
  };
  const warung = {
    id: 'ex-warung', example: true, title: 'Warung Tengah Malam', genre: 'Urban fantasy', tags: ['Slice of life', 'Horor ringan'],
    language: 'Bahasa Indonesia', schedule: 'Daily', target: 1500, pov: 'Orang pertama (Laras)', tense: 'Lampau',
    style: 'Hangat dan jenaka, sesekali seram. Kalimat pendek, banyak detail makanan dan suara malam kota.',
    premise: 'Seorang perempuan mewarisi angkringan neneknya yang hanya boleh buka tengah malam, dan pelanggannya bukan manusia.',
    synopsis: 'Laras mewarisi angkringan milik neneknya di Yogyakarta, lengkap dengan satu aturan aneh: warung hanya boleh buka tepat tengah malam. Ia segera tahu alasannya: pelanggannya bukan manusia. Untuk menjaga warung tetap hidup, Laras harus belajar melayani arwah, tuyul, dan seorang pelanggan misterius yang selalu memesan teh tanpa gula.',
    characters: [
      { id: 'c1', name: 'Laras', role: 'Tokoh utama', note: '24 tahun, baru kehilangan pekerjaan di Jakarta. Skeptis, cerewet, jago meracik wedang.' },
      { id: 'c2', name: 'Mbah Sri', role: 'Nenek (almarhumah)', note: 'Pendiri warung. Meninggalkan buku resep penuh catatan untuk “pelanggan khusus”.' },
      { id: 'c3', name: 'Mas Tedjo', role: 'Pelanggan misterius', note: 'Selalu datang pukul 00.13, memesan teh tanpa gula, tidak pernah punya bayangan.' },
    ],
    world: [
      { id: 'w1', name: 'Warung Mbah Sri', note: 'Angkringan kecil di gang dekat stasiun. Lampu teplok hanya menyala sendiri jika ada pelanggan gaib.' },
      { id: 'w2', name: 'Aturan tengah malam', note: 'Warung buka pukul 00.00 dan harus tutup sebelum azan Subuh.' },
    ],
    cover: { hue: 22, pattern: 3 }, muse: [], createdAt: now - 4 * D, updatedAt: now - 2 * D,
  };
  const warung1 = {
    id: 'ex-warung-1', novelId: 'ex-warung', n: 1, title: 'Pelanggan Pertama', status: 'draft', recap: '', createdAt: now - 4 * D, updatedAt: now - 2 * D,
    text: `Jam dinding di stasiun baru saja berdentang dua belas kali ketika aku menyalakan anglo untuk pertama kalinya.

Arangnya susah menyala. Aku mengipasinya sambil menggerutu, mengutuk Jakarta, mengutuk bos lamaku, dan (maaf, Mbah) sedikit mengutuk surat wasiat yang isinya cuma satu kalimat: *Warung ini buka jam dua belas malam. Jangan lebih cepat, jangan lebih lambat.*

Gang itu sepi. Terlalu sepi untuk Jogja, bahkan di jam segini. Tidak ada motor lewat, tidak ada kucing, tidak ada suara televisi dari rumah-rumah di sekitar. Hanya bunyi air di ceret dan dengung lampu teplok yang tiba-tiba menyala sendiri.

Aku tidak menyalakannya.

“Teh,” kata sebuah suara di belakangku. “Tanpa gula.”

Aku berbalik. Seorang lelaki berkemeja batik lusuh duduk di bangku panjang, kedua tangannya terlipat rapi di atas meja. Aku berani sumpah bangku itu kosong sedetik yang lalu.

“Maaf, Mas, baru buka,” kataku. “Airnya belum—”

Ceret di belakangku bersiul. Mendidih. Padahal arangnya baru saja menyala.`,
  };
  for (const c of [salt1, salt2, warung1]) c.words = countWords(c.text);
  salt.chapterCount = 2; salt.wordCount = salt1.words + salt2.words;
  warung.chapterCount = 1; warung.wordCount = warung1.words;
  ['#0F766E', '#A16207', '#1D4ED8', '#334155'].forEach((col, i) => { salt.characters[i].color = col; });
  ['#BE123C', '#A16207', '#334155'].forEach((col, i) => { warung.characters[i].color = col; });
  const M = 60e3;
  const saltEngine = {
    v: 2, mc: 'c1', mcName: 'Wren Aldous', tension: 38, crisis: false,
    rel: { c2: -1, c3: 1, c4: 0 },
    threads: [
      { id: 'ex-t1', text: 'Who is the Pale Clerk buying memories for?', open: true, ts: now - 3 * H },
      { id: 'ex-t2', text: 'How does Cass already know about the crystal?', open: true, ts: now - 42 * M },
    ],
    posts: [
      { id: 'ex-p5', kind: 'event', text: 'At midnight the tide bells ring thirteen times. By morning nobody in Hollowmere remembers the thirteenth bell. Nobody except Wren.', ts: now - 40 * M, delta: { t: 6 } },
      { id: 'ex-p4', kind: 'move', author: 'c1', an: 'Wren Aldous', mode: 'do', ts: now - 42 * M,
        text: 'Wren climbs out of the dormitory window into Cass’s skiff with the crystal buttoned inside her coat, instead of reporting it to Master Oyelaran.',
        reactions: [
          { id: 'ex-r1', author: 'c3', an: 'Cass Tidewell', text: 'Sit low. The harbour watch counts heads on boats after eleven. And whatever you do, don’t let that thing touch the water.' },
          { id: 'ex-r2', author: 'c2', an: 'Master Oyelaran', text: 'The reading-room lamp is still warm and your bed is empty, Wren. I will not write this down. Yet.' },
          { id: 'ex-r3', author: 'c4', an: 'The Pale Clerk', text: 'A crystal left the Brine Library tonight. My client pays very well to know whose pocket it sits in.' },
        ],
        delta: { t: 14, rel: [{ id: 'c3', an: 'Cass Tidewell', from: 0, to: 1 }, { id: 'c2', an: 'Master Oyelaran', from: 0, to: -1 }] } },
      { id: 'ex-p3', kind: 'post', author: 'c2', an: 'Master Oyelaran', ts: now - 3 * H, text: 'Reminder to all archivists: uncatalogued crystals are to be reported to me before the second bell. No exceptions.', delta: { t: 8 } },
      { id: 'ex-p2', kind: 'post', author: 'c4', an: 'The Pale Clerk', ts: now - 3 * H - M, text: 'Buying memories of the east quarter flood. Discretion guaranteed. You will not remember our meeting.' },
      { id: 'ex-p1', kind: 'system', sub: 'start', ts: now - 3 * H - 2 * M, text: 'Plotfeed started. You play Wren Aldous. Log what she does, then write how the cast of The Salt Archivist reacts.' },
    ],
  };
  return { novels: [salt, warung], chapters: { 'ex-salt': [salt1, salt2], 'ex-warung': [warung1] }, engines: { 'ex-salt': saltEngine, 'ex-warung': null } };
}
function loadExamplesIntoMemory() {
  const ex = buildExamples();
  S.novels.clear(); S.chapters.clear();
  ex.novels.forEach((n) => S.novels.set(n.id, n));
  Object.entries(ex.chapters).forEach(([nid, list]) => { const m = new Map(); list.forEach((c) => m.set(c.id, c)); S.chapters.set(nid, m); });
  S.engines.clear(); engLoads.clear();
  Object.entries(ex.engines).forEach(([nid, e]) => S.engines.set(nid, e ? normEngine(e) : null));
  S.profile = defaultProfile();
  S.profile.last = { novelId: 'ex-salt', chapterId: 'ex-salt-2', n: 2, title: 'A Crystal With My Name' };
}

/* =========================================================
   Storage: everything is kept on this device.
   IndexedDB first, this browser's localStorage as a fallback,
   and memory as a last resort (changes are lost on close).
   ========================================================= */
const DB_NAME = 'serialist';
const DB_STORE = 'kv';
function idbOpen() {
  return new Promise((resolve, reject) => {
    let req;
    try { req = indexedDB.open(DB_NAME, 1); } catch (e) { reject(e); return; }
    req.onupgradeneeded = () => { if (!req.result.objectStoreNames.contains(DB_STORE)) req.result.createObjectStore(DB_STORE); };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
    req.onblocked = () => reject(new Error('blocked'));
  });
}
function makeDeviceStore(db) {
  // Keys: "profile", "novel:<id>", "chapter:<novelId>:<id>", "board:<novelId>"
  const run = (mode, fn) => new Promise((resolve, reject) => {
    const t = db.transaction(DB_STORE, mode);
    const req = fn(t.objectStore(DB_STORE));
    let out;
    if (req) req.onsuccess = () => { out = req.result; };
    t.oncomplete = () => resolve(out);
    t.onerror = () => reject(t.error);
    t.onabort = () => reject(t.error || new Error('aborted'));
  });
  const range = (prefix) => IDBKeyRange.bound(prefix, prefix + '￿');
  const get = (k) => run('readonly', (s) => s.get(k));
  const put = (k, v) => run('readwrite', (s) => s.put(v, k));
  const del = (k) => run('readwrite', (s) => s.delete(k));
  const all = async (prefix) => (await run('readonly', (s) => s.getAll(range(prefix)))) || [];
  return {
    kind: 'device',
    async getProfile() { return (await get('profile')) || null; },
    saveProfile: (p) => put('profile', p),
    listNovels: () => all('novel:'),
    saveNovel: (n) => put('novel:' + n.id, n),
    async deleteNovel(id) {
      await run('readwrite', (s) => s.delete(range('chapter:' + id + ':')));
      await del('board:' + id);
      await del('novel:' + id);
    },
    listChapters: (nid) => all('chapter:' + nid + ':'),
    saveChapter: (nid, ch) => put('chapter:' + nid + ':' + ch.id, ch),
    deleteChapter: (nid, cid) => del('chapter:' + nid + ':' + cid),
    async getEngine(nid) { return (await get('board:' + nid)) || null; },
    saveEngine: (nid, e) => put('board:' + nid, e),
    deleteEngine: (nid) => del('board:' + nid),
    clearAll: () => run('readwrite', (s) => s.clear()),
  };
}

const LocalStore = {
  kind: 'local', key: 'serialist.v1', data: null, ok: true, t: null,
  load() {
    let raw = null;
    try { raw = localStorage.getItem(this.key); this.ok = true; } catch (e) { this.ok = false; }
    try { this.data = raw ? JSON.parse(raw) : null; } catch (e) { this.data = null; }
    if (!this.data || typeof this.data !== 'object') this.data = { profile: null, novels: {}, chapters: {}, engines: {} };
    if (!this.data.engines || typeof this.data.engines !== 'object') this.data.engines = {};
  },
  persist() { clearTimeout(this.t); this.t = setTimeout(() => this.persistNow(), 300); },
  persistNow() {
    clearTimeout(this.t);
    try { localStorage.setItem(this.key, JSON.stringify(this.data)); this.ok = true; if (S.mode === 'memory') S.mode = 'local'; }
    catch (e) { this.ok = false; S.mode = 'memory'; }
    paintSave();
  },
  async getProfile() { return this.data.profile ? clone(this.data.profile) : null; },
  async saveProfile(p) { this.data.profile = p; this.persist(); },
  async listNovels() { return Object.values(this.data.novels).map(clone); },
  async saveNovel(n) { this.data.novels[n.id] = n; this.persist(); },
  async deleteNovel(id) { delete this.data.novels[id]; delete this.data.chapters[id]; delete this.data.engines[id]; this.persist(); },
  async listChapters(nid) { return Object.values(this.data.chapters[nid] || {}).map(clone); },
  async saveChapter(nid, ch) { (this.data.chapters[nid] = this.data.chapters[nid] || {})[ch.id] = ch; this.persist(); },
  async deleteChapter(nid, cid) { if (this.data.chapters[nid]) delete this.data.chapters[nid][cid]; this.persist(); },
  async getEngine(nid) { const e = this.data.engines[nid]; return e ? clone(e) : null; },
  async saveEngine(nid, e) { this.data.engines[nid] = e; this.persist(); },
  async deleteEngine(nid) { delete this.data.engines[nid]; this.persist(); },
  async clearAll() { this.data = { profile: null, novels: {}, chapters: {}, engines: {} }; this.persistNow(); },
};

/* ---- debounced saves ---- */
const timers = new Map();
function queue(key, fn, delay = 800) {
  const now = Date.now();
  const prev = timers.get(key);
  const first = prev ? prev.first : now;
  if (prev) clearTimeout(prev.id);
  const wait = now - first >= 5000 ? 0 : delay;
  const id = setTimeout(() => { timers.delete(key); exec(fn); }, wait);
  timers.set(key, { id, fn, first });
  paintSave();
}
function flushAll() {
  const jobs = [];
  for (const [k, t] of timers) { clearTimeout(t.id); timers.delete(k); jobs.push(exec(t.fn)); }
  if (S.store === LocalStore) LocalStore.persistNow();
  return Promise.all(jobs);
}
async function exec(fn) {
  if (!S.store) { paintSave(); return; }
  S.pending++; paintSave();
  try { await fn(S.store); S.saveError = false; }
  catch (e) { onSaveError(e); }
  finally { S.pending--; paintSave(); }
}
const saveNovel = (id, delay = 600) => queue('n:' + id, (st) => { const n = S.novels.get(id); return n ? st.saveNovel(clone(n)) : null; }, delay);
const saveChapter = (nid, cid, delay = 900) => queue('c:' + cid, (st) => { const c = S.chapters.get(nid)?.get(cid); return c ? st.saveChapter(nid, clone(c)) : null; }, delay);
const saveProfile = (delay = 1500) => queue('p', (st) => st.saveProfile(clone(S.profile)), delay);
const saveEngine = (nid, delay = 800) => queue('e:' + nid, (st) => { const e = S.engines.get(nid); return e ? st.saveEngine(nid, clone(e)) : null; }, delay);

function onSaveError(e) {
  S.saveError = true;
  const full = e && (e.name === 'QuotaExceededError' || e.code === 22);
  toast(full ? 'This device is out of storage for Serialist. Save a backup, then delete an old novel to keep saving.' : 'Couldn’t save just now. Your next edit will try again.');
}
function saveLabel() {
  if (!S.store) return { t: 'Opening…', c: 'wait' };
  if (S.pending || timers.size) return { t: 'Saving…', c: 'wait' };
  if (S.saveError || S.mode === 'memory') return { t: 'Not saved', c: 'err' };
  return { t: 'Saved', c: 'ok' };
}
function paintSave() {
  const { t, c } = saveLabel();
  $$('.save-state').forEach((el) => { el.textContent = t; el.dataset.state = c; });
}

const chLoads = new Map();
function ensureChapters(nid) {
  if (S.chapters.has(nid)) return Promise.resolve(S.chapters.get(nid));
  if (!S.store) return Promise.resolve(null);
  if (!chLoads.has(nid)) {
    chLoads.set(nid, S.store.listChapters(nid).then((list) => {
      const m = new Map(); list.forEach((c) => m.set(c.id, c)); S.chapters.set(nid, m); return m;
    }).catch(() => { chLoads.delete(nid); toast('Couldn’t load chapters. Check your connection and open the novel again.'); return null; }));
  }
  return chLoads.get(nid);
}
const engLoads = new Map();
function ensureEngine(nid) {
  if (S.engines.has(nid)) return Promise.resolve(S.engines.get(nid));
  if (!S.store) return Promise.resolve(undefined);
  if (!engLoads.has(nid)) {
    engLoads.set(nid, S.store.getEngine(nid).then((e) => {
      if (!S.engines.has(nid)) S.engines.set(nid, e && typeof e === 'object' ? normEngine(e) : null);
      return S.engines.get(nid);
    }).catch(() => { engLoads.delete(nid); toast('Couldn’t load Plotfeed. Check your connection and open the tab again.'); return undefined; }));
  }
  return engLoads.get(nid);
}

/* =========================================================
   Words today, streaks
   ========================================================= */
function addToday(w) {
  if (w <= 0) return;
  const k = dayKey();
  const days = S.profile.days || (S.profile.days = {});
  days[k] = (days[k] || 0) + w;
  const keys = Object.keys(days).sort();
  while (keys.length > 60) delete days[keys.shift()];
  saveProfile(2500);
}
function calcStreak() {
  const goal = S.profile.dailyGoal || 1000, days = S.profile.days || {};
  const d = new Date(); let n = 0;
  if ((days[dayKey(d)] || 0) < goal) d.setDate(d.getDate() - 1);
  while ((days[dayKey(d)] || 0) >= goal) { n++; d.setDate(d.getDate() - 1); }
  return n;
}

/* =========================================================
   Rendering
   ========================================================= */
function coverHTML(n, size = 'sm') {
  const h = n.cover?.hue ?? 196, p = n.cover?.pattern ?? 0;
  return `<div class="cover ${size} pat-${p}" style="--h:${Number(h)}" aria-hidden="true"><span class="cover-genre">${esc(n.genre || '')}</span><span class="cover-title">${esc(n.title || 'Untitled')}</span></div>`;
}
const curNovel = () => S.novels.get(S.route.novelId);
const curChapter = () => S.chapters.get(S.route.novelId)?.get(S.route.chapterId);

function show(name) {
  ['library', 'novel', 'editor'].forEach((v) => { $('#v-' + v).hidden = v !== name; });
  document.body.classList.toggle('editing', name === 'editor');
  if (name === 'editor') fitEditor();
}
function renderAll() {
  const r = S.route;
  if (r.name === 'editor' && S.novels.has(r.novelId) && curChapter()) { renderEditor(); show('editor'); }
  else if ((r.name === 'novel' || r.name === 'editor') && S.novels.has(r.novelId)) { S.route = { name: 'novel', novelId: r.novelId }; renderNovel(); show('novel'); }
  else { S.route = { name: 'library' }; renderLibrary(); show('library'); }
  paintSave();
}

function renderLibrary() {
  const el = $('#v-library');
  const head = `<header class="topbar"><div class="brand"><b>Serialist</b><small>Write it, then play it in Plotfeed</small></div><span class="spacer"></span><span class="save-state"></span><button class="icon-btn" data-act="settings" aria-label="Backup and settings">${icon('sliders')}</button></header>`;
  if (!S.store) {
    el.innerHTML = head + `<div class="skel" style="height:150px;margin-top:4px"></div><div class="skel" style="height:22px;width:40%;margin:30px 0 14px"></div><div class="skel" style="height:96px"></div><div class="skel" style="height:96px;margin-top:10px"></div>`;
    paintSave();
    return;
  }
  const goal = S.profile.dailyGoal || 1000;
  const today = (S.profile.days || {})[dayKey()] || 0;
  const p = Math.min(1, today / goal);
  const C = 2 * Math.PI * 22;
  const streak = calcStreak();
  const week = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const w = (S.profile.days || {})[dayKey(d)] || 0;
    const cls = w >= goal ? 'met' : w > 0 ? 'part' : '';
    const label = d.toLocaleDateString('en-US', { weekday: 'narrow' });
    week.push(`<li class="${cls} ${i === 0 ? 'is-today' : ''}" title="${esc(d.toLocaleDateString('en-US', { weekday: 'long' }))}: ${fmt(w)} words"><span class="dot"></span><span class="wd">${label}</span></li>`);
  }
  const last = S.profile.last && S.novels.get(S.profile.last.novelId) ? S.profile.last : null;
  const lastNovel = last ? S.novels.get(last.novelId) : null;
  const novels = [...S.novels.values()].sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
  const own = novels.some((n) => !n.example);
  const lastBk = S.profile.lastBackup;
  const backupNote = S.mode === 'memory'
    ? `This browser is blocking storage, so changes are lost when you close the app. <button class="link" data-act="bk-save">Save a backup file</button>`
    : lastBk ? `Saved on this device only. Last backup ${esc(ago(lastBk))}. <button class="link" data-act="settings">Back up</button>`
    : own ? `Saved on this device only, with no backup yet. <button class="link" data-act="bk-save">Save a backup file</button>`
    : 'Everything is saved on this device only. Nothing is sent anywhere.';
  el.innerHTML = head + `
    <section class="today" aria-label="Today’s writing">
      <button class="today-main" data-act="goal-open">
        <svg class="ring" viewBox="0 0 54 54" aria-hidden="true"><circle class="bg" cx="27" cy="27" r="22"/><circle class="fg" cx="27" cy="27" r="22" stroke-dasharray="${C.toFixed(2)}" stroke-dashoffset="${(C * (1 - p)).toFixed(2)}"/></svg>
        <span class="today-txt">
          <span class="today-num"><b>${fmt(today)}</b> <span>/ ${fmt(goal)} words today</span></span>
          <span class="today-sub">${streak ? `${icon('flame')} ${streak}-day streak` : 'Hit your goal today to start a streak'}</span>
        </span>
        ${icon('chev', 'chev')}
      </button>
      <ol class="week" aria-label="Last 7 days">${week.join('')}</ol>
    </section>
    ${last ? `<button class="resume" data-act="open-chapter" data-nid="${esc(last.novelId)}" data-cid="${esc(last.chapterId)}">
        ${coverHTML(lastNovel, 'xs')}
        <span class="resume-txt"><span class="eyebrow">Pick up where you left off</span><span class="resume-title">${esc(lastNovel.title)}</span><span class="resume-ch">Ch. ${esc(last.n)}${last.title ? ' · ' + esc(last.title) : ''}</span></span>
        <span class="btn btn-accent sm">Write</span>
      </button>` : ''}
    ${installCardHTML()}
    <div class="sec-head"><h2>Your shelf</h2><button class="btn btn-accent sm" data-act="new-novel">${icon('plus')} New novel</button></div>
    ${novels.length ? `<ul class="shelf">${novels.map((n) => `
      <li><button class="book" data-act="open-novel" data-id="${esc(n.id)}">
        ${coverHTML(n, 'sm')}
        <span class="book-info">
          <span class="book-top">${esc(n.genre || 'No genre')} · ${esc(n.language || '')}${n.example ? ' <span class="badge">Example</span>' : ''}</span>
          <span class="book-title">${esc(n.title || 'Untitled')}</span>
          <span class="book-meta">${fmt(n.chapterCount)} ${n.chapterCount === 1 ? 'chapter' : 'chapters'} · ${fmt(n.wordCount)} words · edited ${esc(ago(n.updatedAt))}</span>
        </span>
      </button></li>`).join('')}</ul>`
    : `<div class="empty"><p>Your shelf is empty. Start a novel and write chapter one.</p><button class="btn btn-accent" data-act="new-novel">${icon('plus')} New novel</button></div>`}
    <div class="sec-head"><h2>Start from a world</h2></div>
    <p class="sec-sub">Ready-made settings with a full cast. Name your main character and Plotfeed starts the story with you in it.</p>
    <ul class="worlds">${WORLDS.map((w) => `<li><button class="world" data-act="world-open" data-id="${esc(w.id)}">
      <span class="eyebrow">${esc(w.tagline)}</span>
      <span class="world-name">${esc(w.name)}</span>
      <span class="stack">${w.cast.map((c) => avHTML(c, 22)).join('')}</span>
    </button></li>`).join('')}</ul>
    <p class="foot">${backupNote}</p>`;
  paintSave();
}

function schedText(s) { return !s || s === 'Not set' ? 'No update schedule' : `Updates ${s === 'Daily' ? 'daily' : s === 'Weekly' ? 'weekly' : s}`; }

function renderNovel() {
  const n = curNovel();
  if (!n) { go({ name: 'library' }); return; }
  const el = $('#v-novel');
  const m = S.chapters.get(n.id);
  if (!m) ensureChapters(n.id).then((mm) => { if (mm && S.route.name === 'novel' && S.route.novelId === n.id) renderNovel(); });
  const chs = m ? [...m.values()].sort((a, b) => a.n - b.n) : [];
  const words = m ? chs.reduce((s, c) => s + (c.words || 0), 0) : n.wordCount || 0;
  const count = m ? chs.length : n.chapterCount || 0;
  const tab = S.tab;
  el.innerHTML = `
    <header class="topbar">
      <button class="icon-btn" data-act="go-library">${icon('back')}<span>Shelf</span></button>
      <span class="spacer"></span><span class="save-state"></span>
      <button class="icon-btn" data-act="novel-menu" aria-label="Novel options">${icon('more')}</button>
    </header>
    <section class="hero">
      ${coverHTML(n, 'lg')}
      <div class="hero-info">
        <span class="eyebrow">${esc(n.genre || 'No genre')}</span>
        <h1 class="novel-title">${esc(n.title || 'Untitled')}</h1>
        <p class="meta">${esc(n.language || '')} · ${esc(schedText(n.schedule))}</p>
        <dl class="stats"><div><dt>Chapters</dt><dd>${fmt(count)}</dd></div><div><dt>Words</dt><dd>${fmt(words)}</dd></div><div><dt>Per ch.</dt><dd>${count ? fmt(words / count) : '0'}</dd></div></dl>
      </div>
    </section>
    ${n.tags?.length ? `<div class="tags">${n.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join('')}</div>` : ''}
    ${n.example ? `<p class="note-bar">This is an example novel. ${n.id === 'ex-salt' ? 'Open Plotfeed to see a plotting board in progress, then outline chapter 3 from its beats.' : 'Try starting Plotfeed on it.'} Delete it from the ⋯ menu when you’re ready.</p>` : ''}
    <nav class="tabs" role="tablist">
      <button class="tab" role="tab" aria-selected="${tab === 'chapters'}" data-act="tab" data-tab="chapters">${icon('list')} Chapters</button>
      <button class="tab" role="tab" aria-selected="${tab === 'bible'}" data-act="tab" data-tab="bible">${icon('book')} Story bible</button>
      <button class="tab" role="tab" aria-selected="${tab === 'feed'}" data-act="tab" data-tab="feed">${icon('feed')} Plotfeed</button>
    </nav>
    <div class="panel" id="panel">${tab === 'bible' ? bibleHTML(n) : tab === 'feed' ? feedHTML(n) : chaptersHTML(n, m, chs)}</div>`;
  if (tab === 'feed') bindFeed();
  paintSave();
}

function chaptersHTML(n, m, chs) {
  if (!m) return `<div class="skel" style="height:64px"></div><div class="skel" style="height:64px;margin-top:10px"></div>`;
  const head = `<div class="panel-head"><p>Target ${fmt(n.target || 2000)} words per chapter</p><button class="btn btn-accent sm" data-act="new-chapter">${icon('plus')} New chapter</button></div>`;
  if (!chs.length) return head + `<div class="empty"><p>No chapters yet.</p><button class="btn btn-accent" data-act="new-chapter">Start chapter 1</button></div>`;
  return head + `<ol class="chapters">${chs.map((c) => `
    <li><button class="ch-row" data-act="open-chapter" data-nid="${esc(n.id)}" data-cid="${esc(c.id)}">
      <span class="ch-num">${c.n}</span>
      <span class="ch-main">
        <span class="ch-title ${c.title ? '' : 'untitled'}">${esc(c.title || 'Untitled chapter')}</span>
        <span class="ch-meta">${fmt(c.words)} words · ${esc(ago(c.updatedAt))}${(c.outline || []).length ? ` · outline ${c.outline.filter((b) => b.done).length}/${c.outline.length}` : ''}</span>
        ${c.recap ? `<span class="ch-recap">${esc(c.recap)}</span>` : ''}
      </span>
      <span class="pill ${esc(c.status || 'draft')}">${esc(STATUS[c.status] || 'Draft')}</span>
    </button></li>`).join('')}</ol>`;
}

function bibleHTML(n) {
  const chars = n.characters || [], world = n.world || [];
  return `
    <section class="bible-sec">
      <div class="bs-head"><h3>Synopsis</h3><button class="link" data-act="edit-novel">Edit</button></div>
      ${n.synopsis ? `<p class="prose">${esc(n.synopsis)}</p>` : n.premise ? `<p class="prose">${esc(n.premise)}</p><p class="placeholder" style="margin-top:6px">This is your premise. Add a full synopsis when you know where the story is heading.</p>` : `<p class="placeholder">What is the story about? Add a synopsis to keep the big picture in view.</p>`}
    </section>
    <section class="bible-sec">
      <div class="bs-head"><h3>${icon('voice')} Voice</h3><button class="link" data-act="edit-novel">Edit</button></div>
      <dl class="kv"><dt>Point of view</dt><dd>${esc(n.pov || '—')}</dd><dt>Tense</dt><dd>${esc(n.tense || '—')}</dd><dt>Style</dt><dd>${esc(n.style || '—')}</dd></dl>
    </section>
    <section class="bible-sec">
      <div class="bs-head"><h3>${icon('users')} Cast</h3><button class="link" data-act="entry-new" data-kind="char">${icon('plus')} Add</button></div>
      ${chars.length ? `<ul class="entries">${chars.map((c) => `<li><button class="entry" data-act="entry-edit" data-kind="char" data-id="${esc(c.id)}"><span class="entry-head"><span class="entry-name">${esc(c.name)}</span>${c.role ? `<span class="entry-role">${esc(c.role)}</span>` : ''}</span>${c.note ? `<span class="entry-note">${esc(c.note)}</span>` : ''}${(c.voice || []).length ? `<span class="entry-lines">${fmt(c.voice.length)} sample ${c.voice.length === 1 ? 'line' : 'lines'}</span>` : ''}</button></li>`).join('')}</ul>` : `<p class="placeholder">No characters yet. Plotfeed uses this list as its cast.</p>`}
    </section>
    <section class="bible-sec">
      <div class="bs-head"><h3>${icon('globe')} World</h3><button class="link" data-act="entry-new" data-kind="world">${icon('plus')} Add</button></div>
      ${world.length ? `<ul class="entries">${world.map((w) => `<li><button class="entry" data-act="entry-edit" data-kind="world" data-id="${esc(w.id)}"><span class="entry-head"><span class="entry-name">${esc(w.name)}</span></span>${w.note ? `<span class="entry-note">${esc(w.note)}</span>` : ''}</button></li>`).join('')}</ul>` : `<p class="placeholder">Places, rules, magic or power systems, factions.</p>`}
    </section>`;
}

function renderEditor() {
  const n = curNovel(), ch = curChapter();
  if (!n || !ch) { go({ name: 'library' }); return; }
  const el = $('#v-editor');
  el.innerHTML = `
    <header class="ed-top">
      <button class="icon-btn" data-act="ed-back" aria-label="Back to chapters">${icon('back')}</button>
      <div class="ed-titlebox"><span class="ed-novel">${esc(n.title)}</span><span class="ed-sub" id="ed-sub"></span></div>
      <span class="save-state"></span>
      <button class="icon-btn" data-act="ed-menu" aria-label="Chapter options">${icon('more')}</button>
    </header>
    <div class="ed-progress" id="ed-progress" aria-hidden="true"><span id="ed-bar"></span></div>
    <div id="ol-slot">${outlineBarHTML(ch)}</div>
    <div class="ed-body">
      <input id="ed-title" class="ed-title" placeholder="Chapter ${ch.n} title" aria-label="Chapter title" autocomplete="off">
      <textarea id="ed-text" class="ed-text" placeholder="${(ch.outline || []).length ? `Write chapter ${ch.n} from its outline. Tap Outline above to see the beats.` : `Start chapter ${ch.n} here…`}" aria-label="Chapter text" spellcheck="true"></textarea>
    </div>`;
  const ta = $('#ed-text'), ti = $('#ed-title');
  ta.value = ch.text || '';
  ti.value = ch.title || '';
  document.documentElement.style.setProperty('--ed-size', ED_SIZES[S.profile.edSize] || ED_SIZES.m);
  S.typing = { chapterId: ch.id, words: countWords(ta.value) };
  ta.addEventListener('input', (e) => {
    const c = curChapter(); if (!c) return;
    c.text = ta.value;
    const w = countWords(c.text);
    const it = e.inputType || '';
    if (S.typing && S.typing.chapterId === c.id && it !== 'insertFromPaste' && it !== 'insertFromDrop' && w > S.typing.words) addToday(w - S.typing.words);
    if (S.typing) S.typing.words = w;
    c.words = w; c.updatedAt = Date.now();
    paintCounts();
    saveChapter(S.route.novelId, c.id);
    touchNovel(S.route.novelId);
  });
  ti.addEventListener('input', () => {
    const c = curChapter(); if (!c) return;
    c.title = ti.value; c.updatedAt = Date.now();
    if (S.profile.last && S.profile.last.chapterId === c.id) { S.profile.last.title = c.title; saveProfile(); }
    saveChapter(S.route.novelId, c.id);
    touchNovel(S.route.novelId);
  });
  ti.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); ta.focus(); } });
  paintCounts();
  paintSave();
}
function paintCounts() {
  const n = curNovel(), ch = curChapter();
  if (!n || !ch) return;
  const target = n.target || 2000;
  const sub = $('#ed-sub');
  if (sub) sub.textContent = `Ch. ${ch.n} · ${fmt(ch.words)} / ${fmt(target)} words`;
  const bar = $('#ed-bar'), pr = $('#ed-progress');
  if (bar) bar.style.width = Math.min(100, (ch.words / target) * 100).toFixed(1) + '%';
  if (pr) pr.classList.toggle('done', ch.words >= target);
}
function touchNovel(nid, delay = 1500) {
  const n = S.novels.get(nid); if (!n) return;
  const m = S.chapters.get(nid);
  if (m) { let w = 0; m.forEach((c) => { w += c.words || 0; }); n.wordCount = w; n.chapterCount = m.size; }
  n.updatedAt = Date.now();
  saveNovel(nid, delay);
}

/* ---- editor sizing above the phone keyboard ---- */
function fitEditor() {
  const ed = $('#v-editor'); const vv = window.visualViewport;
  if (!ed || ed.hidden || !vv) return;
  ed.style.top = vv.offsetTop + 'px';
  ed.style.bottom = 'auto';
  ed.style.height = vv.height + 'px';
}
if (window.visualViewport) { visualViewport.addEventListener('resize', fitEditor); visualViewport.addEventListener('scroll', fitEditor); }

/* =========================================================
   Navigation
   ========================================================= */
function go(route) {
  if (S.route.name === 'editor' && route.name !== 'editor') flushAll();
  S.route = route;
  renderAll();
  if (route.name !== 'editor') window.scrollTo(0, 0);
}
async function openChapter(nid, cid) {
  const m = await ensureChapters(nid);
  if (!m || !m.get(cid)) { toast('That chapter isn’t available anymore.'); go({ name: 'novel', novelId: nid }); return; }
  const ch = m.get(cid);
  S.profile.last = { novelId: nid, chapterId: cid, n: ch.n, title: ch.title || '' };
  saveProfile();
  go({ name: 'editor', novelId: nid, chapterId: cid });
  if (finePointer()) { const ta = $('#ed-text'); if (ta) { ta.focus({ preventScroll: true }); ta.setSelectionRange(ta.value.length, ta.value.length); ta.scrollTop = ta.scrollHeight; } }
}

/* =========================================================
   Sheets & toast
   ========================================================= */
function openSheet(html, label = 'Dialog') {
  const sh = $('#sheet');
  S.ctx = null;
  sh.innerHTML = html;
  sh.setAttribute('aria-label', label);
  sh.hidden = false; $('#scrim').hidden = false;
  sh.scrollTop = 0;
  document.body.classList.add('sheet-open');
}
function closeSheet() {
  const sh = $('#sheet');
  if (sh.hidden) return;
  S.ctx = null; S.form = null; S.restoreData = null;
  sh.hidden = true; $('#scrim').hidden = true; sh.innerHTML = '';
  document.body.classList.remove('sheet-open');
}
const closeBtn = `<button class="icon-btn" data-act="close-sheet" aria-label="Close">${icon('close')}</button>`;
let toastT = null;
function toast(msg, action) {
  const t = $('#toast');
  t.innerHTML = `<p>${esc(msg)}</p>${action ? `<button data-act="toast-act">${esc(action.label)}</button>` : ''}`;
  t.hidden = false;
  S.toastAction = action ? action.run : null;
  clearTimeout(toastT);
  toastT = setTimeout(() => { t.hidden = true; S.toastAction = null; }, action ? 8000 : 4200);
}
async function copyText(text, okMsg) {
  try { await navigator.clipboard.writeText(text); toast(okMsg); }
  catch (e) {
    openSheet(`<div class="sheet-head"><h3>Copy text</h3>${closeBtn}</div><p class="sheet-sub">Your browser blocked automatic copying. Select the text below and copy it.</p><textarea class="copy-box" id="copy-box" readonly></textarea>`, 'Copy text');
    const b = $('#copy-box'); b.value = text; b.focus(); b.select();
  }
}

/* =========================================================
   Forms: novels, bible entries, goal
   ========================================================= */
function genreOptions(sel) {
  const list = GENRES.includes(sel) || !sel ? GENRES : [sel, ...GENRES];
  return list.map((g) => `<option ${g === sel ? 'selected' : ''}>${esc(g)}</option>`).join('');
}
function newNovelSheet() {
  openSheet(`
    <div class="sheet-head"><h3>New novel</h3>${closeBtn}</div>
    <div class="form">
      <label class="field"><span>Title</span><input id="nn-title" placeholder="A working title is fine" autocomplete="off"></label>
      <div class="two">
        <label class="field"><span>Genre</span><select id="nn-genre">${genreOptions('Fantasy')}</select></label>
        <label class="field"><span>Language</span><input id="nn-lang" list="dl-langs" value="English"></label>
      </div>
      <label class="field"><span>Premise</span><textarea id="nn-premise" rows="3" placeholder="One or two sentences. Who wants what, and what stands in the way?"></textarea><span class="hint">Optional. It shows in the story bible until you write a synopsis.</span></label>
      <p class="form-err" id="nn-err" hidden></p>
      <div class="row">
        <button class="btn btn-accent" data-act="create-novel">Create novel</button>
      </div>
    </div>`, 'New novel');
  setTimeout(() => $('#nn-title')?.focus(), 60);
}
function createNovel() {
  const title = $('#nn-title').value.trim();
  const premise = $('#nn-premise').value.trim();
  const err = $('#nn-err');
  if (!title) { err.textContent = 'Give your novel a title. You can change it later.'; err.hidden = false; $('#nn-title').focus(); return; }
  const now = Date.now();
  const n = {
    id: newId(), title, genre: $('#nn-genre').value, tags: [], language: $('#nn-lang').value.trim() || 'English',
    schedule: 'Not set', target: 2000, pov: '', tense: 'Past', style: '', premise, synopsis: '',
    characters: [], world: [], cover: { hue: HUES[Math.floor(Math.random() * HUES.length)], pattern: Math.floor(Math.random() * 4) },
    chapterCount: 0, wordCount: 0, createdAt: now, updatedAt: now,
  };
  S.novels.set(n.id, n);
  S.chapters.set(n.id, new Map());
  S.engines.set(n.id, null);
  saveNovel(n.id, 0);
  closeSheet();
  S.tab = 'chapters';
  go({ name: 'novel', novelId: n.id });
}

function novelMenu() {
  const n = curNovel(); if (!n) return;
  openSheet(`
    <div class="sheet-head"><h3>${esc(n.title)}</h3>${closeBtn}</div>
    <div class="menu">
      <button class="menu-item" data-act="edit-novel">${icon('edit')}<span>Edit details and cover</span></button>
      <button class="menu-item" data-act="export-copy">${icon('copy')}<span>Copy all chapters</span></button>
      <button class="menu-item" data-act="export-download">${icon('download')}<span>Download as a text file</span></button>
      <button class="menu-item danger" data-act="delete-novel-ask">${icon('trash')}<span>Delete novel</span></button>
    </div>
    <div id="confirm-slot"></div>`, 'Novel options');
}
function editNovelSheet() {
  const n = curNovel(); if (!n) return;
  S.form = { hue: n.cover?.hue ?? 196, pattern: n.cover?.pattern ?? 0 };
  openSheet(`
    <div class="sheet-head"><h3>Novel details</h3>${closeBtn}</div>
    <div class="form">
      <label class="field"><span>Title</span><input id="ed-n-title" autocomplete="off"></label>
      <div class="two">
        <label class="field"><span>Genre</span><select id="ed-n-genre">${genreOptions(n.genre)}</select></label>
        <label class="field"><span>Language</span><input id="ed-n-lang" list="dl-langs"></label>
      </div>
      <label class="field"><span>Tags</span><input id="ed-n-tags" placeholder="Slow burn, Found family, Revenge"><span class="hint">Separate with commas.</span></label>
      <div class="two">
        <label class="field"><span>Update schedule</span><select id="ed-n-sched">${SCHEDULES.map((s) => `<option ${s === (n.schedule || 'Not set') ? 'selected' : ''}>${esc(s)}</option>`).join('')}</select></label>
        <label class="field"><span>Words per chapter</span><input id="ed-n-target" type="number" inputmode="numeric" min="300" max="20000" step="100"></label>
      </div>
      <div class="two">
        <label class="field"><span>Point of view</span><input id="ed-n-pov" list="dl-povs"></label>
        <label class="field"><span>Tense</span><input id="ed-n-tense" placeholder="Past or present"></label>
      </div>
      <label class="field"><span>Style notes</span><textarea id="ed-n-style" rows="2" placeholder="How should the prose feel? e.g. punchy, funny, short paragraphs"></textarea></label>
      <label class="field"><span>Premise</span><textarea id="ed-n-premise" rows="2"></textarea></label>
      <label class="field"><span>Synopsis</span><textarea id="ed-n-syn" rows="5"></textarea></label>
      <div class="field"><span class="field-label">Cover colour</span><div class="swatches" id="sw">${HUES.map((h) => `<button class="swatch" style="background:hsl(${h} 40% 27%)" aria-label="Cover colour ${h}" aria-pressed="${h === S.form.hue}" data-act="pick-hue" data-v="${h}"></button>`).join('')}</div></div>
      <div class="field"><span class="field-label">Cover pattern</span><div class="pats" id="pats">${[0, 1, 2, 3].map((p) => `<button class="pat-btn" aria-label="Pattern ${p + 1}" aria-pressed="${p === S.form.pattern}" data-act="pick-pat" data-v="${p}">${coverHTML({ ...n, cover: { hue: S.form.hue, pattern: p } }, 'xs')}</button>`).join('')}</div></div>
      <p class="form-err" id="ed-n-err" hidden></p>
      <div class="row"><button class="btn btn-accent" data-act="save-novel">Save details</button><button class="btn btn-ghost" data-act="close-sheet">Cancel</button></div>
    </div>`, 'Novel details');
  $('#ed-n-title').value = n.title || '';
  $('#ed-n-lang').value = n.language || '';
  $('#ed-n-tags').value = (n.tags || []).join(', ');
  $('#ed-n-target').value = n.target || 2000;
  $('#ed-n-pov').value = n.pov || '';
  $('#ed-n-tense').value = n.tense || '';
  $('#ed-n-style').value = n.style || '';
  $('#ed-n-premise').value = n.premise || '';
  $('#ed-n-syn').value = n.synopsis || '';
}
function saveNovelDetails() {
  const n = curNovel(); if (!n) return;
  const title = $('#ed-n-title').value.trim();
  if (!title) { const e = $('#ed-n-err'); e.textContent = 'The title can’t be empty.'; e.hidden = false; return; }
  n.title = title;
  n.genre = $('#ed-n-genre').value;
  n.language = $('#ed-n-lang').value.trim() || 'English';
  n.tags = $('#ed-n-tags').value.split(',').map((s) => s.trim()).filter(Boolean).slice(0, 8);
  n.schedule = $('#ed-n-sched').value;
  n.target = Math.max(300, Math.min(20000, parseInt($('#ed-n-target').value, 10) || 2000));
  n.pov = $('#ed-n-pov').value.trim();
  n.tense = $('#ed-n-tense').value.trim();
  n.style = $('#ed-n-style').value.trim();
  n.premise = $('#ed-n-premise').value.trim();
  n.synopsis = $('#ed-n-syn').value.trim();
  n.cover = { hue: S.form.hue, pattern: S.form.pattern };
  n.updatedAt = Date.now();
  saveNovel(n.id, 0);
  closeSheet();
  renderNovel();
  toast('Details saved');
}

function entrySheet(kind, item) {
  const isChar = kind === 'char';
  openSheet(`
    <div class="sheet-head"><h3>${item ? (isChar ? 'Edit character' : 'Edit world note') : (isChar ? 'New character' : 'New world note')}</h3>${closeBtn}</div>
    <div class="form">
      <label class="field"><span>${isChar ? 'Name' : 'Name or topic'}</span><input id="en-name" autocomplete="off" placeholder="${isChar ? 'e.g. Wren Aldous' : 'e.g. The toll'}"></label>
      ${isChar ? `<label class="field"><span>Role</span><input id="en-role" list="dl-roles" placeholder="Protagonist, Rival, Mentor…"></label>` : ''}
      <label class="field"><span>Notes</span><textarea id="en-note" rows="4" placeholder="${isChar ? 'Age, wants, flaws, secrets, how they talk' : 'Rules, history, anything the story must stay consistent with'}"></textarea></label>
      ${isChar ? `<label class="field"><span>Sample lines</span><textarea id="en-voice" rows="3" placeholder="One per line. Things this character would say."></textarea><span class="hint">Plotfeed offers these as quick reactions, so you can hear the character’s voice while you plot.</span></label>` : ''}
      <p class="form-err" id="en-err" hidden></p>
      <div class="row"><button class="btn btn-accent" data-act="entry-save" data-kind="${kind}" data-id="${esc(item?.id || '')}">Save</button>${item ? `<button class="btn btn-ghost" data-act="entry-delete" data-kind="${kind}" data-id="${esc(item.id)}">Delete</button>` : ''}</div>
    </div>`, isChar ? 'Character' : 'World note');
  $('#en-name').value = item?.name || '';
  if (isChar) $('#en-role').value = item?.role || '';
  $('#en-note').value = item?.note || '';
  if (isChar) $('#en-voice').value = (item?.voice || []).join('\n');
  if (!item) setTimeout(() => $('#en-name')?.focus(), 60);
}
function entrySave(kind, id) {
  const n = curNovel(); if (!n) return;
  const name = $('#en-name').value.trim();
  if (!name) { const e = $('#en-err'); e.textContent = 'Add a name first.'; e.hidden = false; return; }
  const list = kind === 'char' ? (n.characters = n.characters || []) : (n.world = n.world || []);
  const data = { name, note: $('#en-note').value.trim() };
  if (kind === 'char') {
    data.role = $('#en-role').value.trim();
    data.voice = $('#en-voice').value.split('\n').map((x) => x.trim()).filter(Boolean).slice(0, 12).map((x) => x.slice(0, 200));
  }
  const existing = id && list.find((x) => x.id === id);
  if (existing) Object.assign(existing, data); else list.push(Object.assign({ id: newId() }, data));
  n.updatedAt = Date.now();
  saveNovel(n.id, 0);
  closeSheet(); renderNovel();
}
function entryDelete(kind, id) {
  const n = curNovel(); if (!n) return;
  const key = kind === 'char' ? 'characters' : 'world';
  n[key] = (n[key] || []).filter((x) => x.id !== id);
  saveNovel(n.id, 0);
  closeSheet(); renderNovel();
  toast(kind === 'char' ? 'Character removed' : 'World note removed');
}

function goalSheet() {
  const g = S.profile.dailyGoal || 1000;
  openSheet(`
    <div class="sheet-head"><h3>Daily word goal</h3>${closeBtn}</div>
    <p class="sheet-sub">Only words you type count. Pasted text doesn’t add to your goal.</p>
    <div class="choices" style="margin-bottom:16px">${[300, 500, 1000, 1500, 2000, 3000].map((v) => `<button class="choice" aria-pressed="${v === g}" data-act="goal-set" data-v="${v}">${fmt(v)}</button>`).join('')}</div>
    <div class="form"><label class="field"><span>Custom goal</span><input id="goal-custom" type="number" inputmode="numeric" min="50" max="20000" step="50" value="${g}"></label>
    <div class="row"><button class="btn btn-accent" data-act="goal-custom">Save goal</button></div></div>`, 'Daily word goal');
}
function setGoal(v) {
  v = Math.max(50, Math.min(20000, Math.round(v) || 1000));
  S.profile.dailyGoal = v; saveProfile(0);
  closeSheet(); renderLibrary();
  toast(`Daily goal set to ${fmt(v)} words`);
}

/* =========================================================
   Chapters
   ========================================================= */
async function newChapter() {
  const n = curNovel(); if (!n) return;
  const m = await ensureChapters(n.id); if (!m) return;
  const nMax = [...m.values()].reduce((a, c) => Math.max(a, c.n || 0), 0);
  const now = Date.now();
  const ch = { id: newId(), novelId: n.id, n: nMax + 1, title: '', text: '', words: 0, status: 'draft', recap: '', createdAt: now, updatedAt: now };
  m.set(ch.id, ch);
  saveChapter(n.id, ch.id, 0);
  touchNovel(n.id, 300);
  openChapter(n.id, ch.id);
}
function editorMenu() {
  const ch = curChapter(); if (!ch) return;
  const size = S.profile.edSize || 'm';
  openSheet(`
    <div class="sheet-head"><h3>Chapter ${ch.n}</h3>${closeBtn}</div>
    <div class="form">
      <div class="field"><span class="field-label">Status</span><div class="seg">${Object.entries(STATUS).map(([k, l]) => `<button aria-pressed="${ch.status === k}" data-act="ed-status" data-v="${k}">${l}</button>`).join('')}</div></div>
      <div class="field"><span class="field-label">Text size</span><div class="seg">${[['s', 'Small'], ['m', 'Medium'], ['l', 'Large']].map(([k, l]) => `<button aria-pressed="${size === k}" data-act="ed-size" data-v="${k}">${l}</button>`).join('')}</div></div>
      <label class="field"><span>Chapter summary</span><textarea id="ed-recap" rows="3" maxlength="1200" placeholder="Two or three sentences on what happens. It shows in the chapter list."></textarea></label>
      <div class="row"><button class="btn btn-ghost sm" data-act="ed-recap-save">Save summary</button></div>
    </div>
    <div class="menu" style="margin-top:14px">
      <button class="menu-item" data-act="ed-copy">${icon('copy')}<span>Copy chapter text</span></button>
      <button class="menu-item danger" data-act="ed-delete-ask">${icon('trash')}<span>Delete chapter</span></button>
    </div>
    <div id="confirm-slot"></div>`, 'Chapter options');
  $('#ed-recap').value = ch.recap || '';
}
async function deleteChapter() {
  const n = curNovel(), ch = curChapter(); if (!n || !ch) return;
  const m = S.chapters.get(n.id);
  const t = timers.get('c:' + ch.id); if (t) { clearTimeout(t.id); timers.delete('c:' + ch.id); }
  m.delete(ch.id);
  const rest = [...m.values()].sort((a, b) => a.n - b.n);
  rest.forEach((c, i) => { if (c.n !== i + 1) { c.n = i + 1; saveChapter(n.id, c.id, 200); } });
  if (S.profile.last && S.profile.last.chapterId === ch.id) { S.profile.last = null; saveProfile(0); }
  closeSheet();
  S.typing = null;
  S.route = { name: 'novel', novelId: n.id };
  touchNovel(n.id, 200);
  exec((st) => st.deleteChapter(n.id, ch.id));
  renderAll();
  toast(`Chapter ${ch.n} deleted`);
}
async function deleteNovel() {
  const n = curNovel(); if (!n) return;
  for (const [k, t] of timers) if (k === 'n:' + n.id || k === 'e:' + n.id || [...(S.chapters.get(n.id)?.keys() || [])].some((cid) => k === 'c:' + cid)) { clearTimeout(t.id); timers.delete(k); }
  S.novels.delete(n.id); S.chapters.delete(n.id); chLoads.delete(n.id); S.engines.delete(n.id); engLoads.delete(n.id);
  if (S.profile.last && S.profile.last.novelId === n.id) { S.profile.last = null; saveProfile(0); }
  closeSheet();
  go({ name: 'library' });
  exec((st) => st.deleteNovel(n.id));
  toast(`“${n.title}” deleted`);
}
function exportTextSync(n) {
  const m = S.chapters.get(n.id);
  const chs = m ? [...m.values()].sort((a, b) => a.n - b.n) : [];
  return `${n.title}\n${n.genre} · ${n.language}\n\n` + chs.map((c) => `Chapter ${c.n}${c.title ? ': ' + c.title : ''}\n\n${(c.text || '').trim()}\n`).join('\n\n');
}
async function exportText() {
  const n = curNovel(); if (!n) return '';
  await ensureChapters(n.id);
  return exportTextSync(n);
}


/* =========================================================
   Plotfeed: the plotting board
   You play the main character. Log what they do or say, write how
   the cast reacts, drop in world events, and keep track of tension,
   relationships and open threads. Picked beats become a chapter
   outline that sits above the chapter text in the editor.
   ========================================================= */
const fresh = new Set();
let freshT = null;
function charInfo(n, id, an) {
  const c = (n.characters || []).find((x) => x.id === id) || null;
  const name = (c && c.name) || an || 'Someone';
  return {
    id, name, handle: (c && c.handle) || toHandle(name) || 'someone',
    color: (c && c.color) || AV_COLORS[hashStr(id) % AV_COLORS.length],
    role: (c && c.role) || '', note: (c && c.note) || '', voice: c && Array.isArray(c.voice) ? c.voice : [], gone: !c,
  };
}
const castOf = (n, eng) => (n.characters || []).filter((c) => c.id !== eng.mc);
function defaultMc(n) { const list = n.characters || []; return list.find((c) => /protag|tokoh utama|main|hero|\bmc\b/i.test(c.role || '')) || list[0] || null; }
const avHTML = (info, size) => { const ini = initials(info.name); return `<span class="av av-${size}" style="--c:${esc(info.color)}" aria-hidden="true">${esc(size <= 22 ? ini.slice(0, 1) : ini)}</span>`; };
const rich = (t) => esc(t).replace(/(^|[\s(])(@[A-Za-z0-9_]{2,20})/g, '$1<span class="mention">$2</span>');
const sysItem = (sub, text) => ({ id: newId(), kind: 'system', sub, text, ts: Date.now(), reactions: [], ch: null });
const isBeat = (p) => p.kind !== 'system';

function newEngine(n, mcId) {
  const mc = charInfo(n, mcId);
  return { v: 2, mc: mcId, mcName: mc.name, tension: 10, crisis: false, rel: {}, threads: [],
    posts: [sysItem('start', `Plotfeed started. You play ${mc.name}. Log what they do, then write how the cast of ${n.title} reacts.`)] };
}
function normEngine(e) {
  e.v = 2;
  e.posts = Array.isArray(e.posts) ? e.posts.filter((p) => p && p.id) : [];
  e.threads = Array.isArray(e.threads) ? e.threads : [];
  e.rel = e.rel && typeof e.rel === 'object' ? e.rel : {};
  e.tension = clamp(Math.round(Number(e.tension) || 0), 0, 100);
  e.posts.forEach((p) => { if (!Array.isArray(p.reactions)) p.reactions = []; if (p.ch === undefined) p.ch = null; delete p.pending; });
  delete e.beats; delete e.dms;
  return e;
}
function trimEngine(e) {
  if (e.posts.length > 150) e.posts = e.posts.slice(0, 150);
  if (e.threads.length > 40) {
    const open = e.threads.filter((t) => t.open), done = e.threads.filter((t) => !t.open);
    e.threads = [...done.slice(-Math.max(0, 40 - open.length)), ...open].slice(-40);
  }
}

/* ---- rendering ---- */
const PF_MODES = [['do', 'Does'], ['say', 'Says'], ['cast', 'Cast'], ['world', 'World']];
const PF_TENSION = [[-10, '−10'], [0, '±0'], [5, '+5'], [15, '+15']];

function feedHTML(n) {
  if (!S.engines.has(n.id)) {
    ensureEngine(n.id).then(() => { if (S.engines.has(n.id) && S.route.name === 'novel' && S.route.novelId === n.id && S.tab === 'feed') renderNovel(); });
    return `<div class="skel" style="height:150px"></div><div class="skel" style="height:110px;margin-top:14px"></div>`;
  }
  const eng = S.engines.get(n.id);
  if (!eng) return pfSetupHTML(n);
  const gone = charInfo(n, eng.mc, eng.mcName).gone;
  return `<div id="pf-state">${pfStateHTML(n, eng)}</div>
    ${gone ? '' : `<div id="pf-composer">${pfComposerHTML(n, eng)}</div>`}
    <div class="pf-feed" id="pf-feed">${pfFeedHTML(n, eng)}</div>`;
}
function pfSetupHTML(n) {
  const chars = n.characters || [];
  const pick = chars.some((c) => c.id === S.pfPick) ? S.pfPick : defaultMc(n)?.id;
  S.pfPick = pick || null;
  return `<div class="pf-setup">
    <div class="pf-hero"><span class="pf-logo">${icon('feed')}</span><div>
      <h3 class="pf-h">Plot the story forward</h3>
      <p class="pf-lede">Plotfeed is a plotting board for ${esc(n.title)}. You play the main character: log what they do or say, then write how the rest of the cast reacts. Track tension, relationships and open threads as you go, and turn the beats into a chapter outline when you’re ready to write.</p>
    </div></div>
    ${chars.length ? `
      <div class="opt-group" style="margin:0"><span class="field-label">Who do you play?</span><div class="choices">${chars.map((c) => `<button class="choice" aria-pressed="${c.id === pick}" data-act="pf-mc-pick" data-id="${esc(c.id)}">${esc(c.name)}</button>`).join('')}</div></div>
      ${chars.length < 2 ? `<p class="placeholder">There’s only one character so far. Add a few more to the story bible so someone can react.</p>` : ''}
      <div class="row"><button class="btn btn-accent" data-act="pf-start">${icon('feed')} Start Plotfeed</button></div>`
    : `<p class="placeholder">Plotfeed needs a main character and a cast. Add them in the story bible first.</p>
      <div class="row"><button class="btn btn-accent sm" data-act="entry-new" data-kind="char">${icon('plus')} Add character</button></div>`}
  </div>`;
}
function pfStateHTML(n, eng) {
  const mc = charInfo(n, eng.mc, eng.mcName);
  if (mc.gone) {
    return `<section class="pf-state"><p class="note-bar" style="margin:0">${esc(mc.name)} is no longer in the story bible. Choose who you play next.</p>
      <div class="choices">${(n.characters || []).map((c) => `<button class="choice" data-act="pf-mc-set" data-id="${esc(c.id)}">${esc(c.name)}</button>`).join('') || '<span class="placeholder">Add a character to the story bible first.</span>'}</div></section>`;
  }
  const t = eng.tension, cast = castOf(n, eng);
  const open = eng.threads.filter((x) => x.open).length;
  const unused = eng.posts.filter((p) => isBeat(p) && p.ch == null).length;
  const note = eng.crisis ? `Crisis point. Make ${mc.name}’s next move the climax of this arc.`
    : t >= 75 ? 'Close to breaking. One more bold move triggers a crisis.'
    : t >= 40 ? 'Stakes are rising.'
    : 'Calm for now. Raise it when the stakes go up. At 100 the arc hits a crisis.';
  return `<section class="pf-state" aria-label="Story state">
    <div class="pf-me">${avHTML(mc, 44)}<div class="pf-me-txt"><span class="eyebrow">You play</span><b>${esc(mc.name)}</b></div><button class="icon-btn" data-act="pf-menu" aria-label="Plotfeed options">${icon('more')}</button></div>
    <div class="meter">
      <div class="meter-row"><span class="field-label">${icon('flame')} Tension</span>
        <span class="meter-ctl"><button class="step-btn" data-act="pf-tension" data-v="-5" aria-label="Lower tension by 5">−</button><span class="meter-val">${t}/100</span><button class="step-btn" data-act="pf-tension" data-v="5" aria-label="Raise tension by 5">+</button></span></div>
      <div class="bar" role="meter" aria-label="Tension" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${t}"><i class="${t >= 75 || eng.crisis ? 'hot' : ''}" style="width:${t}%"></i></div>
      <p class="meter-note">${esc(note)}</p>
    </div>
    <div class="pf-chips">
      <button class="chip" data-act="pf-cast">${icon('users')} Cast · ${cast.length}</button>
      <button class="chip" data-act="pf-threads">${icon('hook')} ${open} open ${open === 1 ? 'thread' : 'threads'}</button>
      <button class="chip lead" data-act="pf-chapter">${icon('recap')} Outline a chapter · ${unused} new ${unused === 1 ? 'beat' : 'beats'}</button>
    </div>
  </section>`;
}
function pfPlaceholder(n, eng) {
  const mc = charInfo(n, eng.mc, eng.mcName).name;
  if (S.pfMode === 'say') return `What does ${mc} say? Who to?`;
  if (S.pfMode === 'cast') return `What does ${S.pfWho ? charInfo(n, S.pfWho).name : 'they'} do or say?`;
  if (S.pfMode === 'world') return 'What happens in the world? News, weather, an accident, a twist…';
  return `What does ${mc} do next?`;
}
function pfComposerHTML(n, eng) {
  const cast = castOf(n, eng);
  if (S.pfMode === 'cast' && !cast.some((c) => c.id === S.pfWho)) S.pfWho = cast[0] ? cast[0].id : null;
  return `<form class="pf-composer" id="pf-form" autocomplete="off">
    <div class="pf-top"><div class="seg" role="group" aria-label="Who acts">${PF_MODES.map(([k, l]) => `<button type="button" aria-pressed="${S.pfMode === k}" data-act="pf-mode" data-v="${k}">${l}</button>`).join('')}</div><span class="count" id="pf-count">0/600</span></div>
    ${S.pfMode === 'cast' ? (cast.length ? `<div class="choices">${cast.map((c) => `<button type="button" class="choice" aria-pressed="${c.id === S.pfWho}" data-act="pf-who" data-id="${esc(c.id)}">${esc(c.name)}</button>`).join('')}</div>` : `<p class="placeholder">Add more characters to the story bible first.</p>`) : ''}
    <label class="sr-only" for="pf-input">Your move</label>
    <textarea id="pf-input" rows="3" maxlength="600" placeholder="${esc(pfPlaceholder(n, eng))}"></textarea>
    <div class="pf-foot"><span class="field-label">Tension</span><div class="seg sm" role="group" aria-label="Tension change">${PF_TENSION.map(([v, l]) => `<button type="button" aria-pressed="${S.pfT === v}" data-act="pf-t" data-v="${v}">${l}</button>`).join('')}</div><span class="spacer"></span><button type="submit" class="btn btn-accent sm" id="pf-play">${icon('plus')} Add</button></div>
  </form>`;
}
function pfFeedHTML(n, eng) {
  const items = eng.posts.map((p) => pfItemHTML(n, eng, p));
  return items.join('') || `<p class="empty">Nothing yet. Add the first move.</p>`;
}
function deltaHTML(d) {
  if (!d) return '';
  const out = [];
  if (d.t) out.push(`<span class="${d.t > 0 ? 'up' : 'down'}">Tension ${d.t > 0 ? '+' : '−'}${Math.abs(d.t)}</span>`);
  (d.rel || []).forEach((r) => out.push(`<span class="${r.to > r.from ? 'rel-up' : 'rel-down'}">${esc(r.an)} ${r.to > r.from ? '↑' : '↓'} ${esc(relLabel(r.to))}</span>`));
  (d.add || []).forEach((t) => out.push(`<span class="thr">New thread: ${esc(trunc(t, 64))}</span>`));
  (d.res || []).forEach((t) => out.push(`<span class="down">Resolved: ${esc(trunc(t, 54))}</span>`));
  return out.length ? `<div class="delta">${out.join('')}</div>` : '';
}
function pfActionsHTML(n, eng, p) {
  const open = S.pfReply && S.pfReply.postId === p.id;
  return `<div class="pf-actions">
      <button class="pf-act" data-act="pf-react" data-id="${esc(p.id)}" aria-expanded="${open}">${icon('chat')} React</button>
      <button class="pf-act" data-act="pf-del" data-id="${esc(p.id)}">${icon('trash')} Remove</button>
      ${p.ch != null ? `<span class="pf-used">In chapter ${esc(p.ch)}</span>` : ''}
    </div>
    ${open ? pfReplyFormHTML(n, eng, p) : ''}`;
}
function pfItemHTML(n, eng, p) {
  const cls = fresh.has(p.id) ? ' enter' : '';
  if (p.kind === 'system') {
    const ic = p.sub === 'crisis' ? 'flame' : p.sub === 'chapter' ? 'recap' : 'feed';
    return `<div class="pf-sys${p.sub === 'crisis' ? ' crisis' : ''}${cls}">${icon(ic)}<span>${esc(p.text)}</span></div>`;
  }
  const thread = (p.reactions || []).length ? `<div class="pf-thread">${p.reactions.map((r) => pfReplyHTML(n, p, r)).join('')}</div>` : '';
  if (p.kind === 'event') {
    return `<article class="pf-item event${cls}"><span class="ev-icon" aria-hidden="true">${icon('globe')}</span><div class="pf-body">
      <div class="pf-meta"><span class="pf-name">The world</span><span>${esc(ago(p.ts))}</span></div>
      <p class="pf-text act">${esc(p.text)}</p>${deltaHTML(p.delta)}${thread}${pfActionsHTML(n, eng, p)}</div></article>`;
  }
  const a = charInfo(n, p.author, p.an);
  if (p.kind === 'move') {
    return `<article class="pf-item move${cls}">${avHTML(a, 44)}<div class="pf-body">
      <div class="pf-meta"><span class="pf-name">${esc(a.name)}</span><span class="pf-kind">${p.mode === 'say' ? 'Says' : 'Does'}</span>${p.climax ? '<span class="pf-kind hot">Climax</span>' : ''}<span>${esc(ago(p.ts))}</span></div>
      <p class="pf-text${p.mode === 'say' ? '' : ' act'}">${rich(p.text)}</p>
      ${deltaHTML(p.delta)}${thread}${pfActionsHTML(n, eng, p)}
    </div></article>`;
  }
  return `<article class="pf-item${cls}">${avHTML(a, 44)}<div class="pf-body">
    <div class="pf-meta"><span class="pf-name">${esc(a.name)}</span><span>@${esc(a.handle)}</span><span aria-hidden="true">·</span><span>${esc(ago(p.ts))}</span></div>
    <p class="pf-text">${rich(p.text)}</p>${deltaHTML(p.delta)}${thread}${pfActionsHTML(n, eng, p)}
  </div></article>`;
}
function pfReplyHTML(n, p, r) {
  const a = charInfo(n, r.author, r.an);
  return `<div class="pf-reply${fresh.has(r.id) ? ' enter' : ''}">${avHTML(a, 30)}<div class="pf-body">
    <div class="pf-meta"><span class="pf-name">${esc(a.name)}</span><span>@${esc(a.handle)}</span><button class="rx-del" data-act="pf-rx-del" data-id="${esc(p.id)}" data-rid="${esc(r.id)}" aria-label="Remove ${esc(a.name)}’s reaction">${icon('close')}</button></div>
    <p class="pf-text">${rich(r.text)}</p></div></div>`;
}
function pfReplyFormHTML(n, eng, p) {
  const R = S.pfReply;
  const cast = castOf(n, eng).filter((c) => c.id !== p.author);
  if (!cast.length) return `<p class="placeholder rx-note">Add more characters to the story bible so someone can react.</p>`;
  if (!R.author) {
    return `<div class="rx-pick"><span class="field-label">${p.reactions.length ? 'Who else reacts?' : 'Who reacts?'}</span>
      <div class="rx-avs">${cast.map((c) => { const i = charInfo(n, c.id); return `<button class="rx-av" data-act="pf-rx-who" data-id="${esc(c.id)}">${avHTML(i, 36)}<span>${esc(i.name.replace(/^(the|a|an)\s+/i, '').split(/\s+/)[0])}</span></button>`; }).join('')}</div>
      <button class="link" data-act="pf-rx-cancel">${p.reactions.length ? 'Done' : 'Cancel'}</button></div>`;
  }
  const i = charInfo(n, R.author), mc = charInfo(n, eng.mc, eng.mcName), cur = eng.rel[R.author] || 0;
  return `<div class="rx-form">
    <div class="rx-head">${avHTML(i, 30)}<b>${esc(i.name)}</b><span class="rel ${relClass(cur)}">${esc(relLabel(cur))}</span><span class="spacer"></span><button class="link" data-act="pf-rx-who" data-id="">Someone else</button></div>
    <label class="sr-only" for="rx-input">What ${esc(i.name)} says or does</label>
    <textarea id="rx-input" rows="2" maxlength="400" placeholder="What does ${esc(i.name)} say or do?">${esc(R.text || '')}</textarea>
    ${i.voice.length ? `<div class="rx-sugs" aria-label="Sample lines">${i.voice.slice(0, 6).map((v, k) => `<button class="rx-sug" data-act="pf-rx-sug" data-k="${k}">${esc(v)}</button>`).join('')}</div>` : ''}
    <div class="rx-foot"><span class="field-label">Toward ${esc(mc.name)}</span><div class="seg sm" role="group" aria-label="Relationship change">${[[-1, '↓ Worse'], [0, 'Same'], [1, '↑ Better']].map(([v, l]) => `<button type="button" aria-pressed="${(R.rel || 0) === v}" data-act="pf-rx-rel" data-v="${v}">${l}</button>`).join('')}</div></div>
    <div class="row"><button class="btn btn-accent sm" data-act="pf-rx-add">${icon('plus')} Add reaction</button><button class="btn btn-ghost sm" data-act="pf-rx-cancel">Cancel</button></div>
  </div>`;
}
function paintEngine(nid, focusReply) {
  if (S.route.name !== 'novel' || S.route.novelId !== nid || S.tab !== 'feed') return;
  const n = S.novels.get(nid), eng = S.engines.get(nid);
  if (!n || !eng) return;
  const st = $('#pf-state'), fd = $('#pf-feed');
  if (!st || !fd) { renderNovel(); return; }
  st.innerHTML = pfStateHTML(n, eng);
  fd.innerHTML = pfFeedHTML(n, eng);
  clearTimeout(freshT); freshT = setTimeout(() => fresh.clear(), 80);
  if (focusReply) { const box = $('#rx-input'); if (box) { box.focus({ preventScroll: true }); box.setSelectionRange(box.value.length, box.value.length); box.closest('.rx-form')?.scrollIntoView({ block: 'nearest', behavior: reduced ? 'auto' : 'smooth' }); } }
  syncPf();
}
function paintComposer(n, eng) {
  const box = $('#pf-composer'); if (!box) return;
  const keep = $('#pf-input')?.value || '';
  box.innerHTML = pfComposerHTML(n, eng);
  bindFeed(keep);
}
function syncPf() {
  const play = $('#pf-play'), inp = $('#pf-input');
  if (play) play.disabled = !(inp && inp.value.trim());
}
function pfCount() {
  const inp = $('#pf-input'), c = $('#pf-count'); if (!inp) return;
  if (c) c.textContent = `${inp.value.length}/600`;
  S.pfDraft = { nid: S.route.novelId, text: inp.value };
  syncPf();
}
function bindFeed(keep) {
  const form = $('#pf-form'), inp = $('#pf-input');
  if (!form || !inp) return;
  if (keep != null) inp.value = keep;
  else if (S.pfDraft && S.pfDraft.nid === S.route.novelId) inp.value = S.pfDraft.text || '';
  form.addEventListener('submit', (e) => { e.preventDefault(); pfAdd(); });
  inp.addEventListener('input', pfCount);
  inp.addEventListener('keydown', (e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); pfAdd(); } });
  pfCount();
}

/* ---- playing ---- */
function pfStart() {
  const n = curNovel(); if (!n) return;
  const id = (n.characters || []).some((c) => c.id === S.pfPick) ? S.pfPick : defaultMc(n)?.id;
  if (!id) return;
  S.engines.set(n.id, newEngine(n, id));
  S.pfMode = 'do'; S.pfT = 0; S.pfReply = null;
  saveEngine(n.id, 0);
  renderNovel();
  if (finePointer()) $('#pf-input')?.focus();
}
function pfSetMc(id) {
  const n = curNovel(), eng = n && S.engines.get(n.id); if (!n || !eng) return;
  const c = charInfo(n, id); if (c.gone) return;
  if (eng.mc !== id) {
    eng.mc = id; eng.mcName = c.name; eng.rel = {}; eng.crisis = false;
    eng.posts.unshift(sysItem('start', `You now play ${c.name}. Relationships start fresh from their point of view.`));
    saveEngine(n.id, 0);
  }
  closeSheet(); renderNovel();
}
function checkCrisis(n, eng, wasCrisis) {
  const mc = charInfo(n, eng.mc, eng.mcName);
  if (wasCrisis) {
    eng.crisis = false; eng.tension = Math.min(eng.tension, 45);
    eng.posts.unshift(sysItem('crisis-done', `The crisis broke and tension settled to ${eng.tension}. This is a strong place to end a chapter.`));
    fresh.add(eng.posts[0].id);
    toast('The crisis broke. Good moment to outline a chapter.', { label: 'Outline', run: pfChapterSheet });
  } else if (!eng.crisis && eng.tension >= 100) {
    eng.crisis = true;
    eng.posts.unshift(sysItem('crisis', `Crisis point. Tension hit 100, so make ${mc.name}’s next move the climax of this arc.`));
    fresh.add(eng.posts[0].id);
    toast('Crisis point reached');
  }
}
function pfAdd() {
  const n = curNovel(), eng = n && S.engines.get(n.id), inp = $('#pf-input');
  if (!n || !eng || !inp) return;
  const text = inp.value.trim().slice(0, 600);
  if (!text) { inp.focus(); return; }
  const now = Date.now();
  let item;
  if (S.pfMode === 'world') item = { id: newId(), kind: 'event', text, ts: now };
  else if (S.pfMode === 'cast') {
    if (!S.pfWho || charInfo(n, S.pfWho).gone) { toast('Pick who acts first.'); return; }
    item = { id: newId(), kind: 'post', author: S.pfWho, an: charInfo(n, S.pfWho).name, text, ts: now };
  } else {
    item = { id: newId(), kind: 'move', author: eng.mc, an: charInfo(n, eng.mc, eng.mcName).name, mode: S.pfMode === 'say' ? 'say' : 'do', text, ts: now };
  }
  item.reactions = []; item.ch = null;
  const wasCrisis = !!eng.crisis && item.kind === 'move';
  if (wasCrisis) item.climax = true;
  const before = eng.tension;
  eng.tension = clamp(eng.tension + (S.pfT || 0), 0, 100);
  if (eng.tension !== before) item.delta = { t: eng.tension - before };
  eng.posts.unshift(item); fresh.add(item.id);
  checkCrisis(n, eng, wasCrisis);
  trimEngine(eng);
  S.pfT = 0; S.pfDraft = null;
  S.pfReply = { postId: item.id, author: null, text: '', rel: 0 };
  saveEngine(n.id, 300);
  paintComposer(n, eng);
  $('#pf-input').value = ''; pfCount();
  paintEngine(n.id);
}
function pfRxAdd() {
  const n = curNovel(), eng = n && S.engines.get(n.id), R = S.pfReply;
  if (!n || !eng || !R || !R.author) return;
  const box = $('#rx-input');
  const text = (box ? box.value : R.text || '').trim().slice(0, 400);
  if (!text) { box?.focus(); return; }
  const p = eng.posts.find((x) => x.id === R.postId); if (!p) return;
  const item = { id: newId(), author: R.author, an: charInfo(n, R.author).name, text };
  p.reactions.push(item); fresh.add(item.id);
  if (R.rel) {
    const from = eng.rel[R.author] || 0, to = clamp(from + R.rel, -3, 3);
    if (to !== from) { eng.rel[R.author] = to; p.delta = p.delta || {}; (p.delta.rel = p.delta.rel || []).push({ id: R.author, an: item.an, from, to }); }
  }
  S.pfReply = { postId: p.id, author: null, text: '', rel: 0 };
  saveEngine(n.id, 300);
  paintEngine(n.id);
}
function pfRemove(id) {
  const n = curNovel(), eng = n && S.engines.get(n.id); if (!eng) return;
  const i = eng.posts.findIndex((p) => p.id === id); if (i < 0) return;
  const [gone] = eng.posts.splice(i, 1);
  if (S.pfReply && S.pfReply.postId === id) S.pfReply = null;
  saveEngine(n.id, 300); paintEngine(n.id);
  toast('Removed from the feed', { label: 'Undo', run: () => { const e = S.engines.get(n.id); if (!e) return; e.posts.splice(Math.min(i, e.posts.length), 0, gone); saveEngine(n.id, 300); paintEngine(n.id); } });
}

/* ---- sheets: cast, threads, menu ---- */
function pfCastSheet() {
  const n = curNovel(), eng = n && S.engines.get(n.id); if (!n || !eng) return;
  const mc = charInfo(n, eng.mc, eng.mcName), cast = castOf(n, eng);
  openSheet(`
    <div class="sheet-head"><h3>Cast of ${esc(n.title)}</h3>${closeBtn}</div>
    <p class="sheet-sub">How each character feels about ${esc(mc.name)} right now. Reactions can shift these, or set them here.</p>
    <ul class="mini-cast">${cast.map((c) => { const i = charInfo(n, c.id), v = eng.rel[c.id] || 0; return `<li class="cast-row">${avHTML(i, 36)}<div style="min-width:0"><div class="cast-name">${esc(i.name)}</div><div class="cast-role">@${esc(i.handle)}${i.role ? ' · ' + esc(i.role) : ''}</div></div>
      <span class="meter-ctl"><button class="step-btn" data-act="pf-rel" data-id="${esc(c.id)}" data-v="-1" aria-label="Worse">−</button><span class="rel ${relClass(v)}">${esc(relLabel(v))}</span><button class="step-btn" data-act="pf-rel" data-id="${esc(c.id)}" data-v="1" aria-label="Better">+</button></span></li>`; }).join('') || '<li class="placeholder" style="padding:12px 0">No one else is in the story bible yet.</li>'}</ul>
    <button class="link" data-act="pf-bible">${icon('users')} Edit characters in the story bible</button>`, 'Cast');
}
function pfThreadsSheet() {
  const n = curNovel(), eng = n && S.engines.get(n.id); if (!n || !eng) return;
  const open = eng.threads.filter((t) => t.open), done = eng.threads.filter((t) => !t.open);
  const row = (t) => `<li class="thread-row${t.open ? '' : ' done'}"><p>${esc(t.text)}</p><button class="btn btn-ghost sm" data-act="pf-thr-toggle" data-id="${esc(t.id)}">${t.open ? 'Resolve' : 'Reopen'}</button></li>`;
  openSheet(`
    <div class="sheet-head"><h3>Story threads</h3>${closeBtn}</div>
    <p class="sheet-sub">Open questions your story has raised. Keep them here so none get forgotten, and resolve them as the chapters answer them.</p>
    <ul class="thread-list">${open.map(row).join('') || '<li class="placeholder" style="padding:12px 0">No open threads yet.</li>'}</ul>
    ${done.length ? `<span class="eyebrow">Resolved</span><ul class="thread-list" style="margin-top:6px">${done.slice().reverse().map(row).join('')}</ul>` : ''}
    <div class="form">
      <label class="field"><span>Add a thread</span><input id="thr-new" autocomplete="off" maxlength="160" placeholder="e.g. What did ${esc(charInfo(n, eng.mc, eng.mcName).name)} give up the first time?"></label>
      <div class="row"><button class="btn btn-accent sm" data-act="pf-thr-add">${icon('plus')} Add thread</button></div>
    </div>`, 'Story threads');
}
function pfMenu() {
  const n = curNovel(); if (!n || !S.engines.get(n.id)) return;
  openSheet(`
    <div class="sheet-head"><h3>Plotfeed</h3>${closeBtn}</div>
    <div class="menu">
      <button class="menu-item" data-act="pf-mc-change">${icon('users')}<span>Change who you play</span></button>
      <button class="menu-item" data-act="pf-copy">${icon('copy')}<span>Copy the feed as text</span></button>
      <button class="menu-item danger" data-act="pf-reset-ask">${icon('trash')}<span>Reset Plotfeed</span></button>
    </div>
    <div id="confirm-slot"></div>`, 'Plotfeed options');
}
function pfMcSheet() {
  const n = curNovel(), eng = n && S.engines.get(n.id); if (!n || !eng) return;
  openSheet(`
    <div class="sheet-head"><h3>Who do you play?</h3>${closeBtn}</div>
    <p class="sheet-sub">The feed stays. Relationships reset, because they’re measured toward the character you play.</p>
    <div class="choices">${(n.characters || []).map((c) => `<button class="choice" aria-pressed="${c.id === eng.mc}" data-act="pf-mc-set" data-id="${esc(c.id)}">${esc(c.name)}</button>`).join('')}</div>`, 'Who do you play');
}
function beatLabel(n, p) {
  if (p.kind === 'event') return `The world: ${p.text}`;
  const a = charInfo(n, p.author, p.an);
  return p.kind === 'move' ? `${a.name} ${p.mode === 'say' ? 'says' : 'does'}: ${p.text}` : `${a.name}: ${p.text}`;
}
function feedText(n, eng) {
  const L = [`${n.title} · Plotfeed`, ''];
  [...eng.posts].reverse().forEach((p) => {
    if (!isBeat(p)) return;
    L.push(beatLabel(n, p));
    (p.reactions || []).forEach((r) => L.push(`  ${charInfo(n, r.author, r.an).name}: ${r.text}`));
    L.push('');
  });
  const open = eng.threads.filter((t) => t.open);
  if (open.length) { L.push('Open threads'); open.forEach((t) => L.push(`- ${t.text}`)); }
  return L.join('\n').trim();
}

/* ---- beats into a chapter outline ---- */
async function pfChapterSheet() {
  const n = curNovel(), eng = n && S.engines.get(n.id); if (!n || !eng) return;
  const items = eng.posts.filter(isBeat).slice().reverse();
  if (!items.length) { toast('Add a few moves first. Each one becomes a beat.'); return; }
  const m = await ensureChapters(n.id); if (!m) return;
  const chs = [...m.values()].sort((a, b) => a.n - b.n), last = chs[chs.length - 1] || null;
  const nextN = chs.reduce((a, x) => Math.max(a, x.n || 0), 0) + 1;
  const unused = items.filter((p) => p.ch == null).map((p) => p.id);
  const ctx = { tool: 'outline', nid: n.id, ids: unused.length ? unused : items.slice(-5).map((p) => p.id), dest: 'new', lastId: last ? last.id : null };
  const choice = (k, v, l) => `<button class="choice" aria-pressed="${ctx[k] === v}" data-act="pf-ol-opt" data-k="${k}" data-v="${v}">${esc(l)}</button>`;
  openSheet(`
    <div class="sheet-head"><span class="sheet-ic">${icon('recap')}</span><h3>Outline a chapter</h3>${closeBtn}</div>
    <p class="sheet-sub">Pick the beats this chapter covers. They’re pinned above the chapter text as an outline to write from, with the cast’s reactions as dialogue ideas.</p>
    <div class="opt-group"><span class="field-label">Beats</span><div class="beats">${items.map((p) => `<button class="beat-row" aria-pressed="${ctx.ids.includes(p.id)}" data-act="pf-beat" data-id="${esc(p.id)}"><span class="beat-box" aria-hidden="true"></span><span class="beat-txt">${esc(trunc(beatLabel(n, p), 220))}${p.reactions.length ? `<small>${p.reactions.length} ${p.reactions.length === 1 ? 'reaction' : 'reactions'}</small>` : ''}${p.ch != null ? `<small>Already in chapter ${esc(p.ch)}</small>` : ''}</span></button>`).join('')}</div></div>
    <div class="opt-group"><span class="field-label">Where it goes</span><div class="choices">${choice('dest', 'new', `New chapter ${nextN}`)}${last ? choice('dest', 'append', `Add to chapter ${last.n}`) : ''}</div></div>
    <label class="field" id="ol-title-f" style="margin-bottom:14px"><span>Chapter title (optional)</span><input id="ol-title" autocomplete="off" maxlength="120" placeholder="You can change it later"></label>
    <p id="ol-err" class="form-err" hidden></p>
    <div class="row"><button class="btn btn-accent" data-act="pf-ol-make">${icon('recap')} Make outline</button></div>`, 'Outline a chapter');
  S.ctx = ctx;
}
async function pfOutlineMake() {
  const c = S.ctx; if (!c || c.tool !== 'outline') return;
  const n = S.novels.get(c.nid), eng = S.engines.get(c.nid); if (!n || !eng) return;
  const picked = eng.posts.filter((p) => isBeat(p) && c.ids.includes(p.id)).slice().reverse();
  if (!picked.length) { const e = $('#ol-err'); e.textContent = 'Pick at least one beat.'; e.hidden = false; return; }
  const m = await ensureChapters(n.id); if (!m) return;
  const now = Date.now();
  const snap = picked.map((p) => ({
    kind: p.kind, mode: p.mode || null, who: p.kind === 'event' ? 'The world' : charInfo(n, p.author, p.an).name, text: p.text,
    reactions: (p.reactions || []).map((r) => ({ who: charInfo(n, r.author, r.an).name, text: r.text })), done: false,
  }));
  let ch;
  if (c.dest === 'append' && m.get(c.lastId)) {
    ch = m.get(c.lastId);
    ch.outline = [...(ch.outline || []), ...snap];
    ch.updatedAt = now;
  } else {
    const title = ($('#ol-title')?.value || '').trim().slice(0, 120);
    const nMax = [...m.values()].reduce((a, x) => Math.max(a, x.n || 0), 0);
    ch = { id: newId(), novelId: n.id, n: nMax + 1, title, text: '', words: 0, status: 'draft', recap: '', outline: snap, createdAt: now, updatedAt: now };
    m.set(ch.id, ch);
  }
  saveChapter(n.id, ch.id, 0);
  touchNovel(n.id, 300);
  picked.forEach((p) => { p.ch = ch.n; });
  eng.posts.unshift(sysItem('chapter', `${picked.length} ${picked.length === 1 ? 'beat' : 'beats'} outlined into chapter ${ch.n}${ch.title ? ` “${ch.title}”` : ''}.`));
  saveEngine(n.id, 300);
  closeSheet();
  renderNovel();
  const nid = n.id, cid = ch.id;
  toast(`Chapter ${ch.n} outlined`, { label: 'Write it', run: () => openChapter(nid, cid) });
}

/* ---- the outline inside the editor ---- */
function outlineBarHTML(ch) {
  const ol = ch.outline || [];
  if (!ol.length) return '';
  const done = ol.filter((b) => b.done).length;
  return `<button class="ol-bar" data-act="ed-outline">${icon('recap')}<span class="ol-bar-t">Outline</span><span class="ol-bar-n">${done}/${ol.length} beats written</span>${icon('chev', 'chev')}</button>`;
}
function outlineText(ch) {
  return (ch.outline || []).map((b, i) => `${i + 1}. ${b.kind === 'move' ? `${b.who} ${b.mode === 'say' ? 'says' : 'does'}` : b.who}: ${b.text}` + b.reactions.map((r) => `\n   - ${r.who}: ${r.text}`).join('')).join('\n');
}
function outlineSheet() {
  const ch = curChapter(); if (!ch || !(ch.outline || []).length) return;
  openSheet(`
    <div class="sheet-head"><span class="sheet-ic">${icon('recap')}</span><h3>Chapter ${ch.n} outline</h3>${closeBtn}</div>
    <p class="sheet-sub">Beats from Plotfeed, in order. Tick each one off once it’s written.</p>
    <ol class="ol-list">${ch.outline.map((b, i) => `<li>
      <button class="beat-row" aria-pressed="${!!b.done}" data-act="ol-done" data-i="${i}"><span class="beat-box" aria-hidden="true"></span><span class="beat-txt"><b>${esc(b.who)}</b>${b.kind === 'move' ? ` ${b.mode === 'say' ? 'says' : 'does'}` : ''}: ${esc(b.text)}</span></button>
      ${b.reactions.length ? `<ul class="ol-rx">${b.reactions.map((r) => `<li><b>${esc(r.who)}:</b> ${esc(r.text)}</li>`).join('')}</ul>` : ''}
    </li>`).join('')}</ol>
    <div class="menu" style="margin-top:12px">
      <button class="menu-item" data-act="ol-copy">${icon('copy')}<span>Copy the outline</span></button>
      <button class="menu-item danger" data-act="ol-clear">${icon('trash')}<span>Remove the outline from this chapter</span></button>
    </div>`, 'Chapter outline');
}
function paintOutlineBar() {
  const ch = curChapter(), slot = $('#ol-slot'); if (!ch || !slot) return;
  slot.innerHTML = outlineBarHTML(ch);
}

/* ---- starter worlds ---- */
function worldSheet(id) {
  const w = WORLDS.find((x) => x.id === id); if (!w) return;
  openSheet(`
    <div class="sheet-head"><h3>${esc(w.name)}</h3>${closeBtn}</div>
    <p class="sheet-sub">${esc(w.premise)}</p>
    <ul class="mini-cast">${w.cast.map((c) => `<li class="cast-row">${avHTML(c, 36)}<div style="min-width:0"><div class="cast-name">${esc(c.name)} <span class="rel ${relClass(c.rel)}">${esc(relLabel(c.rel))}</span></div><div class="cast-role">${esc(c.role)}</div></div></li>`).join('')}</ul>
    <div class="form">
      <label class="field"><span>Your main character’s name</span><input id="wd-name" autocomplete="off" maxlength="40" placeholder="e.g. Nova Reyes"></label>
      <label class="field"><span>Who are they?</span><textarea id="wd-who" rows="2" maxlength="240"></textarea><span class="hint">Saved as their note in the story bible.</span></label>
      <p class="form-err" id="wd-err" hidden></p>
      <div class="row"><button class="btn btn-accent" data-act="world-create" data-id="${esc(w.id)}">${icon('feed')} Create novel and start Plotfeed</button></div>
    </div>`, w.name);
  $('#wd-who').value = w.mcNote;
  if (finePointer()) setTimeout(() => $('#wd-name')?.focus(), 60);
}
function createFromWorld(id) {
  const w = WORLDS.find((x) => x.id === id); if (!w) return;
  const name = $('#wd-name').value.trim().slice(0, 40), who = $('#wd-who').value.trim().slice(0, 240);
  if (!name) { const e = $('#wd-err'); e.textContent = 'Give your main character a name. You can change it later in the story bible.'; e.hidden = false; $('#wd-name').focus(); return; }
  const now = Date.now(), M = 60e3, mcId = newId();
  const used = new Set(w.cast.map((c) => c.color));
  const chars = [{ id: mcId, name, role: 'Protagonist', note: who || w.mcNote, color: AV_COLORS.find((c) => !used.has(c)) || AV_COLORS[0] }];
  w.cast.forEach((c) => chars.push({ id: c.id, name: c.name, role: c.role, note: c.personality.charAt(0).toUpperCase() + c.personality.slice(1) + '.', handle: c.handle, color: c.color, voice: c.lines.slice() }));
  const n = {
    id: newId(), title: w.name, genre: w.genre, tags: w.tags.slice(), language: 'English', schedule: 'Not set', target: 2000,
    pov: `Third person limited (${name})`, tense: 'Past', style: w.style, premise: w.novelPremise.replace('{mc}', name), synopsis: '',
    characters: chars, world: w.world.map(([nm, note]) => ({ id: newId(), name: nm, note })), cover: { hue: w.hue, pattern: w.pattern },
    chapterCount: 0, wordCount: 0, createdAt: now, updatedAt: now,
  };
  const castName = (cid) => (w.cast.find((c) => c.id === cid) || {}).name || '';
  const post = (cid, text, ts) => ({ id: newId(), kind: 'post', author: cid, an: castName(cid), text, ts, reactions: [], ch: null });
  const eng = {
    v: 2, mc: mcId, mcName: name, tension: 15, crisis: false,
    rel: Object.fromEntries(w.cast.map((c) => [c.id, c.rel || 0])),
    threads: w.threads.map((t) => ({ id: newId(), text: t, open: true, ts: now })),
    posts: [
      post(w.buzz[0][0], w.buzz[0][1], now - 2 * M),
      post(w.buzz[1][0], w.buzz[1][1], now - 7 * M),
      post(w.cast[2].id, w.cast[2].intro, now - 12 * M),
      post(w.cast[0].id, w.cast[0].intro, now - 13 * M),
      { id: newId(), kind: 'system', sub: 'start', text: `Plotfeed started. You play ${name} in ${w.name}. Log what they do, then write how the cast reacts.`, ts: now - 14 * M, reactions: [], ch: null },
    ],
  };
  S.novels.set(n.id, n);
  S.chapters.set(n.id, new Map());
  S.engines.set(n.id, eng);
  saveNovel(n.id, 0); saveEngine(n.id, 0);
  closeSheet();
  S.tab = 'feed'; S.pfMode = 'do'; S.pfT = 0; S.pfReply = null;
  go({ name: 'novel', novelId: n.id });
  toast(`Welcome to ${w.name}. Log what ${name} does first.`);
}

/* =========================================================
   Settings, backup and restore
   ========================================================= */
function downloadFile(name, text, type) {
  const blob = new Blob([text], { type: type || 'application/octet-stream' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = name; a.rel = 'noopener';
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}
function storageNote() {
  if (S.mode === 'device') return S.persisted
    ? 'Your novels are saved on this device, and the browser has agreed not to clear them on its own.'
    : 'Your novels are saved on this device. The browser may clear them if the device runs very low on space, so keep a backup file.';
  if (S.mode === 'local') return 'Your novels are saved in this browser on this device. Keep a backup file in case the browser data is cleared.';
  return 'This browser is blocking storage, so changes are lost when you close the app. Save a backup file before you leave.';
}
function settingsSheet() {
  const last = S.profile.lastBackup;
  openSheet(`
    <div class="sheet-head"><h3>Backup and settings</h3>${closeBtn}</div>
    <p class="sheet-sub">${esc(storageNote())}</p>
    <div class="menu">
      <button class="menu-item" data-act="bk-save">${icon('download')}<span>Save a backup file</span></button>
      <button class="menu-item" data-act="bk-restore">${icon('undo')}<span>Restore from a backup file</span></button>
      ${installEvt ? `<button class="menu-item" data-act="install">${icon('plus')}<span>Install Serialist on this device</span></button>` : ''}
    </div>
    <p class="hint" style="margin-top:12px">${last ? `Last backup ${esc(ago(last))}.` : 'No backup saved yet.'} A backup holds every novel, chapter, story bible and Plotfeed board. Keep it somewhere safe, like Google Drive.</p>
    <input type="file" id="bk-file" accept="application/json,.json" hidden>
    <div id="confirm-slot"></div>
    <p class="hint" style="margin-top:18px">Serialist ${APP_VERSION}</p>`, 'Backup and settings');
  $('#bk-file').addEventListener('change', onRestoreFile);
}
async function buildBackup() {
  for (const id of [...S.novels.keys()]) { await ensureChapters(id); await ensureEngine(id); }
  const chapters = {}, boards = {};
  for (const [nid, m] of S.chapters) if (S.novels.has(nid)) chapters[nid] = [...m.values()].map(clone);
  for (const [nid, e] of S.engines) if (e && S.novels.has(nid)) boards[nid] = clone(e);
  return { app: 'serialist', format: 1, exportedAt: new Date().toISOString(), profile: clone(S.profile), novels: [...S.novels.values()].map(clone), chapters, boards };
}
async function backupSave() {
  try {
    await flushAll();
    const data = await buildBackup();
    downloadFile(`serialist-backup-${dayKey()}.json`, JSON.stringify(data), 'application/json');
    S.profile.lastBackup = Date.now(); saveProfile(0);
    closeSheet(); renderAll();
    toast('Backup file saved. On a phone it goes to your Downloads folder.');
  } catch (e) { toast('Couldn’t make the backup file. Try again.'); }
}
function onRestoreFile(e) {
  const f = e.target.files && e.target.files[0]; if (!f) return;
  const r = new FileReader();
  r.onload = () => {
    let d = null;
    try { d = JSON.parse(String(r.result || '')); } catch (err) { d = null; }
    const ok = d && d.app === 'serialist' && Array.isArray(d.novels) && d.chapters && typeof d.chapters === 'object' && d.novels.every((n) => n && typeof n.id === 'string');
    const slot = $('#confirm-slot'); if (!slot) return;
    if (!ok) { slot.innerHTML = `<div class="confirm"><p>That file isn’t a Serialist backup. Pick a file named like serialist-backup-2026-09-28.json.</p></div>`; return; }
    S.restoreData = d;
    const when = d.exportedAt ? new Date(d.exportedAt).toLocaleString() : 'an unknown date';
    slot.innerHTML = `<div class="confirm"><p>Replace everything in Serialist with the backup from <strong>${esc(when)}</strong>? It has ${fmt(d.novels.length)} ${d.novels.length === 1 ? 'novel' : 'novels'}. What’s in the app now will be removed.</p><div class="row"><button class="btn btn-danger sm" data-act="bk-restore-go">Replace with backup</button><button class="btn btn-ghost sm" data-act="close-sheet">Keep what I have</button></div></div>`;
  };
  r.onerror = () => toast('Couldn’t read that file.');
  r.readAsText(f);
}
async function restoreBackup() {
  const d = S.restoreData; if (!d || !S.store) return;
  for (const [, t] of timers) clearTimeout(t.id);
  timers.clear();
  try {
    await S.store.clearAll();
    await S.store.saveProfile(Object.assign(defaultProfile(), d.profile || {}));
    for (const n of d.novels) {
      await S.store.saveNovel(n);
      for (const c of (Array.isArray(d.chapters[n.id]) ? d.chapters[n.id] : [])) await S.store.saveChapter(n.id, c);
      if (d.boards && d.boards[n.id]) await S.store.saveEngine(n.id, d.boards[n.id]);
    }
    if (S.store === LocalStore) LocalStore.persistNow();
    S.restoreData = null;
    await loadFrom(S.store);
    S.route = { name: 'library' };
    closeSheet(); renderAll();
    toast('Backup restored');
  } catch (e) {
    toast('Restoring stopped partway. Try again with the same file.');
  }
}

/* ---- install as an app ---- */
let installEvt = null;
const isStandalone = () => { try { return matchMedia('(display-mode: standalone)').matches || navigator.standalone === true; } catch (e) { return false; } };
const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); installEvt = e; if (S.route.name === 'library' && S.store) renderLibrary(); });
window.addEventListener('appinstalled', () => { installEvt = null; if (S.route.name === 'library' && S.store) renderLibrary(); toast('Serialist is installed. Open it from your home screen.'); });
function installCardHTML() {
  if (isStandalone() || S.profile.installHidden) return '';
  const hide = `<button class="icon-btn" data-act="install-hide" aria-label="Hide this">${icon('close')}</button>`;
  if (installEvt) return `<div class="install">${icon('download')}<p><b>Install Serialist</b><span>Put it on your home screen so it opens like an app and works offline.</span></p><button class="btn btn-accent sm" data-act="install">Install</button>${hide}</div>`;
  if (isIOS()) return `<div class="install">${icon('download')}<p><b>Install Serialist</b><span>In Safari, tap the Share button, then Add to Home Screen.</span></p>${hide}</div>`;
  return '';
}
async function runInstall() {
  if (!installEvt) return;
  const ev = installEvt;
  installEvt = null;
  try { ev.prompt(); await ev.userChoice; } catch (e) {}
  closeSheet(); renderAll();
}

/* =========================================================
   Actions (event delegation)
   ========================================================= */
const A = {
  'go-library': () => go({ name: 'library' }),
  'open-novel': (el) => { if (S.route.novelId !== el.dataset.id) { S.tab = 'chapters'; S.pfReply = null; } go({ name: 'novel', novelId: el.dataset.id }); },
  'open-chapter': (el) => openChapter(el.dataset.nid, el.dataset.cid),
  'tab': (el) => { S.tab = el.dataset.tab; renderNovel(); },
  'new-novel': () => newNovelSheet(),
  'create-novel': () => createNovel(),
  'novel-menu': () => novelMenu(),
  'edit-novel': () => editNovelSheet(),
  'save-novel': () => saveNovelDetails(),
  'pick-hue': (el) => {
    S.form.hue = Number(el.dataset.v);
    $$('#sw .swatch').forEach((b) => b.setAttribute('aria-pressed', b.dataset.v === el.dataset.v));
    $$('#pats .cover').forEach((cv) => cv.style.setProperty('--h', S.form.hue));
  },
  'pick-pat': (el) => { S.form.pattern = Number(el.dataset.v); $$('#pats .pat-btn').forEach((b) => b.setAttribute('aria-pressed', b.dataset.v === el.dataset.v)); },
  'delete-novel-ask': () => {
    const n = curNovel(); const cnt = S.chapters.get(n.id)?.size ?? n.chapterCount ?? 0;
    $('#confirm-slot').innerHTML = `<div class="confirm"><p>Delete <strong>${esc(n.title)}</strong>, its ${fmt(cnt)} ${cnt === 1 ? 'chapter' : 'chapters'} and its Plotfeed board? This can’t be undone.</p><div class="row"><button class="btn btn-danger sm" data-act="delete-novel-confirm">Delete novel</button><button class="btn btn-ghost sm" data-act="close-sheet">Keep it</button></div></div>`;
  },
  'delete-novel-confirm': () => deleteNovel(),
  'goal-open': () => goalSheet(),
  'goal-set': (el) => setGoal(Number(el.dataset.v)),
  'goal-custom': () => setGoal(Number($('#goal-custom').value)),
  'entry-new': (el) => entrySheet(el.dataset.kind, null),
  'entry-edit': (el) => { const n = curNovel(); const list = el.dataset.kind === 'char' ? n.characters : n.world; entrySheet(el.dataset.kind, (list || []).find((x) => x.id === el.dataset.id)); },
  'entry-save': (el) => entrySave(el.dataset.kind, el.dataset.id),
  'entry-delete': (el) => entryDelete(el.dataset.kind, el.dataset.id),
  'new-chapter': () => newChapter(),
  'ed-back': () => { S.typing = null; go({ name: 'novel', novelId: S.route.novelId }); },
  'ed-menu': () => editorMenu(),
  'ed-status': (el) => {
    const ch = curChapter(); if (!ch) return;
    ch.status = el.dataset.v; ch.updatedAt = Date.now(); saveChapter(S.route.novelId, ch.id, 0);
    $$('[data-act="ed-status"]').forEach((b) => b.setAttribute('aria-pressed', b.dataset.v === ch.status));
  },
  'ed-size': (el) => {
    S.profile.edSize = el.dataset.v; saveProfile();
    document.documentElement.style.setProperty('--ed-size', ED_SIZES[el.dataset.v]);
    $$('[data-act="ed-size"]').forEach((b) => b.setAttribute('aria-pressed', b.dataset.v === el.dataset.v));
  },
  'ed-recap-save': () => {
    const ch = curChapter(); if (!ch) return;
    ch.recap = ($('#ed-recap')?.value || '').trim().slice(0, 1200); ch.updatedAt = Date.now();
    saveChapter(S.route.novelId, ch.id, 0);
    toast('Summary saved');
  },
  'ed-copy': () => { const ch = curChapter(); if (ch) copyText(`${ch.title ? ch.title + '\n\n' : ''}${ch.text || ''}`, 'Chapter copied'); },
  'ed-delete-ask': () => {
    const ch = curChapter();
    $('#confirm-slot').innerHTML = `<div class="confirm"><p>Delete chapter ${ch.n}${ch.title ? ` “${esc(ch.title)}”` : ''} (${fmt(ch.words)} words)? Later chapters move up one number. This can’t be undone.</p><div class="row"><button class="btn btn-danger sm" data-act="ed-delete-confirm">Delete chapter</button><button class="btn btn-ghost sm" data-act="close-sheet">Keep it</button></div></div>`;
  },
  'ed-delete-confirm': () => deleteChapter(),
  'ed-outline': () => outlineSheet(),
  'ol-done': (el) => {
    const ch = curChapter(); const b = ch && ch.outline && ch.outline[Number(el.dataset.i)]; if (!b) return;
    b.done = !b.done; ch.updatedAt = Date.now();
    el.setAttribute('aria-pressed', String(b.done));
    saveChapter(S.route.novelId, ch.id, 400); paintOutlineBar();
  },
  'ol-copy': () => { const ch = curChapter(); if (ch) copyText(outlineText(ch), 'Outline copied'); },
  'ol-clear': () => {
    const ch = curChapter(); if (!ch) return;
    const before = ch.outline || [];
    ch.outline = []; ch.updatedAt = Date.now(); saveChapter(S.route.novelId, ch.id, 0);
    closeSheet(); paintOutlineBar();
    toast('Outline removed', { label: 'Undo', run: () => { const c = curChapter(); if (!c) return; c.outline = before; saveChapter(S.route.novelId, c.id, 0); paintOutlineBar(); } });
  },
  'export-copy': () => {
    const n = curNovel(); if (!n) return;
    if (S.chapters.has(n.id)) copyText(exportTextSync(n), 'All chapters copied');
    else exportText().then((txt) => copyText(txt, 'All chapters copied'));
  },
  'export-download': async () => {
    const n = curNovel(); if (!n) return;
    const txt = await exportText();
    const name = (n.title || 'novel').replace(/[\\/:*?"<>|]+/g, '').trim().slice(0, 80) || 'novel';
    downloadFile(`${name}.txt`, txt, 'text/plain;charset=utf-8');
    closeSheet(); toast('Text file saved to your downloads');
  },
  'close-sheet': () => closeSheet(),
  'toast-act': () => { const f = S.toastAction; $('#toast').hidden = true; S.toastAction = null; f && f(); },

  // Settings, backup, install
  'settings': () => settingsSheet(),
  'bk-save': () => backupSave(),
  'bk-restore': () => { const f = $('#bk-file'); if (f) { f.value = ''; f.click(); } },
  'bk-restore-go': () => restoreBackup(),
  'install': () => runInstall(),
  'install-hide': () => { S.profile.installHidden = true; saveProfile(0); renderLibrary(); },

  // Starter worlds
  'world-open': (el) => worldSheet(el.dataset.id),
  'world-create': (el) => createFromWorld(el.dataset.id),

  // Plotfeed
  'pf-mc-pick': (el) => { S.pfPick = el.dataset.id; $$('[data-act="pf-mc-pick"]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.id === S.pfPick))); },
  'pf-start': () => pfStart(),
  'pf-mc-change': () => pfMcSheet(),
  'pf-mc-set': (el) => pfSetMc(el.dataset.id),
  'pf-mode': (el) => {
    S.pfMode = ['do', 'say', 'cast', 'world'].includes(el.dataset.v) ? el.dataset.v : 'do';
    const n = curNovel(), eng = n && S.engines.get(n.id); if (!eng) return;
    paintComposer(n, eng);
    $('#pf-input')?.focus();
  },
  'pf-who': (el) => {
    S.pfWho = el.dataset.id;
    $$('[data-act="pf-who"]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.id === S.pfWho)));
    const n = curNovel(), eng = n && S.engines.get(n.id), inp = $('#pf-input');
    if (inp && eng) { inp.placeholder = pfPlaceholder(n, eng); inp.focus(); }
  },
  'pf-t': (el) => { S.pfT = Number(el.dataset.v) || 0; $$('[data-act="pf-t"]').forEach((b) => b.setAttribute('aria-pressed', String(Number(b.dataset.v) === S.pfT))); },
  'pf-tension': (el) => {
    const n = curNovel(), eng = n && S.engines.get(n.id); if (!eng) return;
    eng.tension = clamp(eng.tension + Number(el.dataset.v || 0), 0, 100);
    if (eng.crisis && eng.tension < 100) eng.crisis = false;
    checkCrisis(n, eng, false);
    saveEngine(n.id, 500); paintEngine(n.id);
  },
  'pf-react': (el) => {
    const id = el.dataset.id, n = curNovel();
    S.pfReply = S.pfReply && S.pfReply.postId === id ? null : { postId: id, author: null, text: '', rel: 0 };
    paintEngine(n.id);
  },
  'pf-rx-who': (el) => {
    if (!S.pfReply) return;
    S.pfReply.author = el.dataset.id || null; S.pfReply.rel = 0;
    if (!S.pfReply.author) S.pfReply.text = '';
    paintEngine(S.route.novelId, !!S.pfReply.author);
  },
  'pf-rx-sug': (el) => {
    const n = curNovel(), R = S.pfReply; if (!n || !R || !R.author) return;
    const line = charInfo(n, R.author).voice[Number(el.dataset.k)]; if (!line) return;
    R.text = line; paintEngine(n.id, true);
  },
  'pf-rx-rel': (el) => { if (!S.pfReply) return; S.pfReply.rel = Number(el.dataset.v) || 0; $$('[data-act="pf-rx-rel"]').forEach((b) => b.setAttribute('aria-pressed', String(Number(b.dataset.v) === S.pfReply.rel))); },
  'pf-rx-add': () => pfRxAdd(),
  'pf-rx-cancel': () => { S.pfReply = null; paintEngine(S.route.novelId); },
  'pf-rx-del': (el) => {
    const n = curNovel(), eng = n && S.engines.get(n.id); if (!eng) return;
    const p = eng.posts.find((x) => x.id === el.dataset.id); if (!p) return;
    p.reactions = p.reactions.filter((r) => r.id !== el.dataset.rid);
    saveEngine(n.id, 300); paintEngine(n.id);
  },
  'pf-del': (el) => pfRemove(el.dataset.id),
  'pf-cast': () => pfCastSheet(),
  'pf-rel': (el) => {
    const n = curNovel(), eng = n && S.engines.get(n.id); if (!eng) return;
    const id = el.dataset.id;
    eng.rel[id] = clamp((eng.rel[id] || 0) + Number(el.dataset.v || 0), -3, 3);
    saveEngine(n.id, 400);
    const sh = $('#sheet'), top = sh.scrollTop;
    pfCastSheet(); sh.scrollTop = top;
  },
  'pf-threads': () => pfThreadsSheet(),
  'pf-thr-toggle': (el) => {
    const n = curNovel(), eng = n && S.engines.get(n.id); if (!eng) return;
    const t = eng.threads.find((x) => x.id === el.dataset.id); if (!t) return;
    t.open = !t.open; saveEngine(n.id, 300);
    pfThreadsSheet(); paintEngine(n.id);
  },
  'pf-thr-add': () => {
    const n = curNovel(), eng = n && S.engines.get(n.id), inp = $('#thr-new'); if (!eng || !inp) return;
    const text = inp.value.trim(); if (!text) { inp.focus(); return; }
    eng.threads.push({ id: newId(), text: text.slice(0, 160), open: true, ts: Date.now() });
    trimEngine(eng); saveEngine(n.id, 300);
    pfThreadsSheet(); paintEngine(n.id);
  },
  'pf-chapter': () => pfChapterSheet(),
  'pf-beat': (el) => {
    const c = S.ctx; if (!c || c.tool !== 'outline') return;
    const id = el.dataset.id, i = c.ids.indexOf(id);
    if (i >= 0) c.ids.splice(i, 1); else c.ids.push(id);
    el.setAttribute('aria-pressed', String(i < 0));
  },
  'pf-ol-opt': (el) => {
    const c = S.ctx; if (!c || c.tool !== 'outline') return;
    c[el.dataset.k] = el.dataset.v;
    $$(`#sheet [data-act="pf-ol-opt"][data-k="${el.dataset.k}"]`).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.v === el.dataset.v)));
    const f = $('#ol-title-f'); if (f) f.hidden = c.dest === 'append';
  },
  'pf-ol-make': () => pfOutlineMake(),
  'pf-menu': () => pfMenu(),
  'pf-bible': () => { closeSheet(); S.tab = 'bible'; renderNovel(); },
  'pf-copy': () => { const n = curNovel(), eng = n && S.engines.get(n.id); if (eng) copyText(feedText(n, eng), 'Feed copied'); },
  'pf-reset-ask': () => {
    const n = curNovel(); if (!n) return;
    $('#confirm-slot').innerHTML = `<div class="confirm"><p>Reset Plotfeed for <strong>${esc(n.title)}</strong>? This clears the feed, threads and relationships. Your chapters, outlines and story bible stay as they are.</p><div class="row"><button class="btn btn-danger sm" data-act="pf-reset">Reset Plotfeed</button><button class="btn btn-ghost sm" data-act="close-sheet">Keep it</button></div></div>`;
  },
  'pf-reset': () => {
    const n = curNovel(); if (!n) return;
    const t = timers.get('e:' + n.id); if (t) { clearTimeout(t.id); timers.delete('e:' + n.id); }
    S.engines.set(n.id, null); S.pfReply = null;
    exec((st) => st.deleteEngine(n.id));
    closeSheet(); renderNovel();
    toast('Plotfeed reset');
  },
};
document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-act]');
  if (!el) return;
  const f = A[el.dataset.act];
  if (f) { e.preventDefault(); f(el, e); }
});
document.addEventListener('input', (e) => { if (e.target && e.target.id === 'rx-input' && S.pfReply) S.pfReply.text = e.target.value; });
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !$('#sheet').hidden) closeSheet();
  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && e.target && e.target.id === 'rx-input') { e.preventDefault(); pfRxAdd(); }
});
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') flushAll(); });
window.addEventListener('pagehide', () => { flushAll(); });

/* =========================================================
   Boot
   ========================================================= */
async function loadFrom(store) {
  const [profile, novels] = await Promise.all([store.getProfile(), store.listNovels()]);
  S.novels.clear(); S.chapters.clear(); chLoads.clear(); S.engines.clear(); engLoads.clear();
  if (!profile && novels.length === 0) {
    loadExamplesIntoMemory();
    S.firstRun = true;
    return;
  }
  S.firstRun = false;
  S.profile = Object.assign(defaultProfile(), profile || {});
  novels.forEach((n) => S.novels.set(n.id, n));
}
async function seedStore() {
  // First visit: save the example shelf so it's there next time.
  await exec((s) => s.saveProfile(clone(S.profile)));
  for (const n of [...S.novels.values()]) {
    await exec((s) => s.saveNovel(clone(n)));
    const m = S.chapters.get(n.id);
    if (m) for (const c of [...m.values()]) await exec((s) => s.saveChapter(n.id, clone(c)));
    const e = S.engines.get(n.id);
    if (e) await exec((s) => s.saveEngine(n.id, clone(e)));
  }
}
async function askPersist() {
  try {
    if (!navigator.storage || !navigator.storage.persist) return;
    S.persisted = (await navigator.storage.persisted()) || (await navigator.storage.persist());
  } catch (e) {}
}
function registerServiceWorker() {
  if (!('serviceWorker' in navigator) || location.protocol === 'file:') return;
  // While you edit in VS Code on localhost, skip the offline cache so changes show up on reload.
  if (/^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname) && !/[?&]sw=1/.test(location.search)) return;
  navigator.serviceWorker.register('./sw.js').then((reg) => {
    const offer = (w) => toast('A new version of Serialist is ready.', { label: 'Update', run: async () => { await flushAll(); w.postMessage('skip-waiting'); } });
    if (reg.waiting && navigator.serviceWorker.controller) offer(reg.waiting);
    reg.addEventListener('updatefound', () => {
      const w = reg.installing; if (!w) return;
      w.addEventListener('statechange', () => { if (w.state === 'installed' && navigator.serviceWorker.controller) offer(w); });
    });
  }).catch(() => {});
  let reloaded = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => { if (reloaded) return; reloaded = true; location.reload(); });
}
async function boot() {
  renderAll();
  let store;
  try { store = makeDeviceStore(await idbOpen()); S.mode = 'device'; }
  catch (e) { LocalStore.load(); store = LocalStore; S.mode = LocalStore.ok ? 'local' : 'memory'; }
  try { await loadFrom(store); }
  catch (e) { LocalStore.load(); store = LocalStore; S.mode = LocalStore.ok ? 'local' : 'memory'; await loadFrom(store); }
  S.store = store;
  if (S.firstRun) await seedStore();
  renderAll();
  askPersist();
}
registerServiceWorker();
boot();
})();
