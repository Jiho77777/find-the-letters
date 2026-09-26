'use client'

import { useEffect, useMemo, useState } from 'react'

type Mode = 'country' | 'food' | 'animal' | 'fruit' | 'color'
type Difficulty = 'normal' | 'hard'
type Theme = 'default' | 'sunset' | 'galaxy' | 'forest' | 'sakura' | 'royal' | 'aqua' | 'coral' | 'lavender' | 'mint' | 'ocean' | 'berry'
type Round = { name: string; hint: string }

const rawRounds = {
  country: [
    ['대한민국', '아시아에 위치하며 K-컬처의 중심인 나라'], ['미국', '자유의 여신상과 뉴욕이 있는 북아메리카 대국'], ['프랑스', '에펠탑과 루브르 박물관이 있는 예술의 나라'], ['일본', '스시와 온천, 벚꽃으로 유명한 이웃 나라'], ['영국', '빅벤과 타워브리지가 있는 신사의 나라'], ['이탈리아', '장화 모양 지형과 피자, 파스타의 고향'], ['캐나다', '메이플 시럽과 넓은 자연경관을 가진 북쪽 나라'], ['호주', '캥거루와 코알라가 사는 나라'], ['독일', '소시지와 맥주, 자동차 산업으로 유명한 국가'], ['스위스', '알프스 산맥과 아름다운 호수가 있는 국가'], ['브라질', '축구와 거대한 예수상이 있는 남미 국가'], ['스페인', '열정의 플라멩코와 투우의 나라'], ['이집트', '피라미드와 스핑크스가 있는 고대 문명의 나라'], ['베트남', '쌀국수와 하롱베이로 유명한 국가'], ['태국', '황금 사원과 길거리 음식이 가득한 나라'], ['멕시코', '타코와 마야 문명의 유적이 있는 국가'], ['그리스', '산토리니와 신화의 고향'], ['노르웨이', '피오르드와 오로라를 볼 수 있는 국가'], ['인도', '타지마할과 커리의 나라'], ['뉴질랜드', '대자연의 섬나라']],
  food: [
    ['스테이크', '육즙이 살아있는 최고급 고기 요리'], ['크림파스타', '부드럽고 고소한 크림소스 면요리'], ['마라탕', '얼얼하고 매콤한 중독적인 국물 요리'], ['떡볶이', '매콤달콤 국민 간식'], ['초밥', '신선한 회와 밥의 조화'], ['치킨', '바삭바삭 맛있는 국민 야식'], ['햄버거', '두툼한 패티와 빵의 패스트푸드 왕'], ['김치볶음밥', '잘 익은 김치로 만든 밥요리'], ['팬케이크', '달콤한 메이플 시럽을 얹은 디저트'], ['랍스터', '고급스러운 바다의 집게발 진미'], ['짜장면', '까만 춘장소스에 비벼먹는 면요리'], ['피자', '치즈와 토핑이 듬뿍 올라간 음식'], ['삼겹살', '노릇노릇 구워먹는 한국인의 소울푸드'], ['냉면', '시원한 육수에 쫄깃한 면발'], ['타코야키', '동글동글한 일본 길거리 간식'], ['샌드위치', '채소와 재료가 듬뿍 든 식사'], ['카레라이스', '향신료 소스와 밥을 먹는 요리'], ['제육볶음', '매콤하게 양념한 돼지고기 요리'], ['설렁탕', '뽀얗고 진한 사골 국물 요리'], ['빙수', '얼음 위에 달콤한 토핑이 가득한 디저트']],
  fruit: [
    ['사과', '아삭하고 달콤한 대표 과일'], ['바나나', '노랗고 부드러운 열대 과일'], ['딸기', '빨갛고 새콤달콤한 봄 과일'], ['포도', '알알이 맺혀 달콤한 과일'], ['수박', '여름에 시원하게 먹는 큰 과일'], ['복숭아', '보드랍고 향긋한 여름 과일'], ['오렌지', '상큼한 향과 비타민 C가 풍부한 과일'], ['파인애플', '껍질은 거칠지만 속은 달콤한 열대 과일'], ['망고', '진하고 달콤한 열대 과일의 왕'], ['체리', '작고 예쁜 빨간색 과일'], ['키위', '초록 속살과 씨앗이 특징인 과일'], ['레몬', '새콤한 맛과 노란색이 특징인 과일'], ['감', '가을에 익어 달콤해지는 과일'], ['자두', '보랏빛 껍질의 새콤달콤한 과일'], ['석류', '작은 보석 같은 알맹이가 가득한 과일'], ['멜론', '향긋하고 부드러운 과육의 과일'], ['블루베리', '작고 진한 보랏빛 열매'], ['귤', '겨울에 즐겨 먹는 상큼한 과일'], ['무화과', '독특한 식감과 은은한 단맛의 과일'], ['코코넛', '단단한 껍질 속에 물과 과육이 있는 열대 과일'],
  ],
  color: [
    ['빨강', '열정과 사랑을 상징하는 강렬한 색'], ['주황', '따뜻하고 활기찬 느낌의 색'], ['노랑', '밝고 긍정적인 햇살의 색'], ['초록', '자연과 평화를 떠올리게 하는 색'], ['파랑', '시원하고 차분한 하늘과 바다의 색'], ['보라', '신비롭고 우아한 느낌의 색'], ['분홍', '사랑스럽고 부드러운 느낌의 색'], ['하늘색', '맑은 하늘을 닮은 산뜻한 색'], ['민트색', '상쾌하고 청량한 느낌의 색'], ['남색', '깊고 차분한 밤하늘의 색'], ['갈색', '나무와 흙을 닮은 포근한 색'], ['하얀색', '깨끗하고 순수한 느낌의 색'], ['검은색', '세련되고 깊이 있는 색'], ['회색', '차분하고 균형 잡힌 중간 색'], ['금색', '반짝이는 보물 같은 고급스러운 색'], ['은색', '빛나는 금속을 닮은 색'], ['연두색', '새싹처럼 싱그러운 색'], ['청록색', '파랑과 초록이 만난 신선한 색'], ['자주색', '깊고 풍부한 붉은 보랏빛'], ['무지개색', '여러 색이 함께 빛나는 색'],
  ],
  animal: [
    ['사자', '밀림의 왕이자 멋진 갈기를 가진 맹수'], ['코끼리', '커다란 귀와 긴 코를 가진 동물'], ['기린', '목이 아주 긴 동물'], ['호랑이', '주황색 줄무늬의 용맹한 맹수'], ['원숭이', '나무를 잘 타는 동물'], ['팬더', '대나무를 좋아하는 곰'], ['펭귄', '남극에 사는 헤엄 잘 치는 새'], ['돌고래', '똑똑한 바다 동물'], ['토끼', '긴 귀로 깡충깡충 뛰는 동물'], ['다람쥐', '도토리를 모으는 작은 동물'], ['표범', '점박이 무늬의 빠른 맹수'], ['하마', '물속을 좋아하는 둥근 동물'], ['캥거루', '배에 주머니가 있는 호주 동물'], ['북극곰', '얼음 나라에 사는 하얀 곰'], ['얼룩말', '검은색과 흰색 줄무늬 동물'], ['여우', '뾰족한 주둥이와 꼬리가 매력적인 동물'], ['수달', '물가에서 조개를 깨먹는 동물'], ['부엉이', '밤에 활동하는 지혜로운 새'], ['치타', '가장 빠르게 달리는 맹수'], ['알파카', '보들보들한 털을 가진 동물'],
  ],
}
const rounds = Object.entries(rawRounds).reduce((acc, [key, list]) => ({ ...acc, [key]: list.map(([name, hint]) => ({ name, hint })) }), {} as Record<Mode, Round[]>)

const themes: { id: Theme; name: string; emoji: string; price: number; description: string; bg: string }[] = [
  { id: 'default', name: '기본 깔끔한 배경', emoji: '◻️', price: 0, description: '그라데이션이 없는 기본 화면', bg: 'bg-gray-100' },
  { id: 'sunset', name: '선셋 블레이즈', emoji: '🌅', price: 80, description: '따뜻한 노을빛', bg: 'bg-gradient-to-tr from-amber-200 via-orange-300 to-rose-400' },
  { id: 'galaxy', name: '네온 갤럭시', emoji: '🌌', price: 150, description: '신비로운 우주 은하수', bg: 'bg-gradient-to-tr from-slate-900 via-purple-950 to-indigo-900' },
  { id: 'forest', name: '에메랄드 숲', emoji: '🌿', price: 120, description: '편안하고 싱그러운 숲', bg: 'bg-gradient-to-tr from-emerald-200 via-teal-300 to-green-500' },
  { id: 'sakura', name: '벚꽃 블로섬', emoji: '🌸', price: 200, description: '화사한 봄날 핑크빛', bg: 'bg-gradient-to-tr from-pink-200 via-rose-200 to-purple-300' },
  { id: 'royal', name: '골든 로열', emoji: '👑', price: 250, description: '고급스러운 황금빛', bg: 'bg-gradient-to-tr from-amber-300 via-yellow-200 to-amber-700' },
  { id: 'aqua', name: '오로라 아쿠아', emoji: '⚡', price: 300, description: '시원한 청량감의 오로라', bg: 'bg-gradient-to-tr from-cyan-200 via-teal-200 to-blue-500' },
  { id: 'coral', name: '코랄 피치', emoji: '🪸', price: 180, description: '산뜻한 산호빛과 복숭아빛', bg: 'bg-gradient-to-tr from-orange-200 via-rose-300 to-pink-400' },
  { id: 'lavender', name: '라벤더 드림', emoji: '💜', price: 220, description: '차분하고 몽환적인 보랏빛', bg: 'bg-gradient-to-tr from-violet-200 via-purple-300 to-fuchsia-400' },
  { id: 'mint', name: '민트 소다', emoji: '🫧', price: 240, description: '상쾌하고 가벼운 민트빛', bg: 'bg-gradient-to-tr from-emerald-100 via-cyan-200 to-sky-400' },
  { id: 'ocean', name: '딥 오션', emoji: '🌊', price: 350, description: '깊고 시원한 바닷빛', bg: 'bg-gradient-to-tr from-blue-700 via-cyan-700 to-slate-900' },
  { id: 'berry', name: '베리 크러시', emoji: '🍇', price: 400, description: '달콤하고 진한 베리빛', bg: 'bg-gradient-to-tr from-fuchsia-500 via-purple-600 to-rose-700' },
]

const extras = '가나다라마바사아자차카타파하고노도로모보소오조초코토포호구누두루무부수우주추쿠투푸후민왕산해양도섬대륙역명니메온새물풀숲끼리린랑숭미영독일호주인브라질스페인이집트베트남태국멕시코그'.split('')

export default function Page() {
  const [points, setPoints] = useState(0)
  const [theme, setTheme] = useState<Theme>('default')
  const [unlocked, setUnlocked] = useState<Theme[]>(['default'])
  const [difficulty, setDifficulty] = useState<Difficulty>('normal')
  const [mode, setMode] = useState<Mode>('country')
  const [limit, setLimit] = useState(5)
  const [gameRounds, setGameRounds] = useState<Round[]>([])
  const [roundIndex, setRoundIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [letters, setLetters] = useState<string[]>([])
  const [clicked, setClicked] = useState<number[]>([])
  const [time, setTime] = useState(20)
  const [screen, setScreen] = useState<'home' | 'game'>('home')
  const [modal, setModal] = useState<'shop' | 'round' | 'victory' | 'timeout' | null>(null)
  const [shopOpen, setShopOpen] = useState(false)

  const current = gameRounds[roundIndex]
  const word = current?.name ?? ''
  const selectedTheme = themes.find((item) => item.id === theme) ?? themes[0]
  const reward = difficulty === 'hard' ? 50 : 30

  useEffect(() => {
    setPoints(Number(localStorage.getItem('wordgame_points') ?? 0))
    setTheme((localStorage.getItem('wordgame_theme') as Theme) || 'default')
    setUnlocked(JSON.parse(localStorage.getItem('wordgame_unlocked') || '["default"]'))
  }, [])
  useEffect(() => { localStorage.setItem('wordgame_points', String(points)) }, [points])
  useEffect(() => { if (screen !== 'game' || modal) return; const timer = window.setInterval(() => setTime((value) => value - 1), 1000); return () => window.clearInterval(timer) }, [screen, modal, roundIndex])
  useEffect(() => { if (time <= 0 && screen === 'game' && !modal) { setPoints((value) => Math.max(0, value - 10)); setModal('timeout') } }, [time, screen, modal])

  const loadRound = (data: Round[], roundLimit = limit) => {
    const next = [...data].sort(() => Math.random() - 0.5).slice(0, roundLimit)
    setGameRounds(next); setRoundIndex(0); setProgress(0); setClicked([]); setTime(20); setScreen('game'); setModal(null)
    setLetters(buildLetters(next[0].name))
  }
  const buildLetters = (target: string) => [...target.split(''), ...Array.from({ length: 42 - target.length }, () => extras[Math.floor(Math.random() * extras.length)])].sort(() => Math.random() - 0.5)
  const startGame = (nextMode: Mode, nextLimit: number) => { setMode(nextMode); setLimit(nextLimit); loadRound(rounds[nextMode], nextLimit) }
  const nextRound = () => { const nextIndex = roundIndex + 1; if (nextIndex >= gameRounds.length) { const bonus = limit === 20 ? 150 : limit === 10 ? 90 : 50; setPoints((value) => value + bonus); setModal('victory'); return }; setRoundIndex(nextIndex); setProgress(0); setClicked([]); setTime(20); setLetters(buildLetters(gameRounds[nextIndex].name)); setModal(null) }
  const clickLetter = (letter: string, index: number) => { if (clicked.includes(index) || modal) return; if (letter === word[progress]) { const next = progress + 1; setProgress(next); setClicked((value) => [...value, index]); if (next === word.length) { setPoints((value) => value + reward); setModal('round') } } }
  const buyTheme = (item: typeof themes[number]) => { if (unlocked.includes(item.id)) { setTheme(item.id); return }; if (points < item.price) return; const next = [...unlocked, item.id]; setPoints((value) => value - item.price); setUnlocked(next); setTheme(item.id); localStorage.setItem('wordgame_unlocked', JSON.stringify(next)); localStorage.setItem('wordgame_theme', item.id) }
  const resetAll = () => { if (!confirm('정말로 모든 포인트와 상점 테마 데이터를 초기화할까요?')) return; setPoints(0); setTheme('default'); setUnlocked(['default']); localStorage.clear() }
  const restart = () => { setProgress(0); setClicked([]); setTime(20); setLetters(buildLetters(word)); setModal(null) }

  return <main className={`min-h-screen ${selectedTheme.bg} ${theme !== 'default' ? 'animated-gradient-bg' : ''} p-3 text-gray-800 transition-colors duration-700`}>
    <div className="mx-auto flex min-h-[calc(100vh-24px)] w-full max-w-md flex-col justify-center">
      {screen === 'home' ? <Home points={points} difficulty={difficulty} setDifficulty={setDifficulty} onShop={() => setShopOpen(true)} startGame={startGame} resetAll={resetAll} /> : <Game current={current} word={word} mode={mode} difficulty={difficulty} limit={limit} roundIndex={roundIndex} progress={progress} letters={letters} clicked={clicked} time={time} points={points} onHome={() => setScreen('home')} onLetter={clickLetter} onReset={restart} />}
    </div>
    {shopOpen && <Shop points={points} theme={theme} unlocked={unlocked} onClose={() => setShopOpen(false)} onBuy={buyTheme} />}
    {modal === 'round' && <Dialog icon={difficulty === 'hard' ? '🔥' : '🎉'} title="라운드 클리어!" description={`멋지게 완성했어요! +${reward}P 획득!`} button="다음 라운드로!" onClick={nextRound} />}
    {modal === 'timeout' && <Dialog icon="⏰" title="시간 초과!" description="포인트 -10P 차감 후 다시 도전하세요!" button="다시 도전하기!" onClick={restart} />}
    {modal === 'victory' && <Dialog icon="👑" title="모험 마스터 등극!" description="모든 단어를 찾았습니다! 포인트를 획득했어요." button="홈으로 돌아가기" onClick={() => { setScreen('home'); setModal(null) }} />}
  </main>
}

function Home({ points, difficulty, setDifficulty, onShop, startGame, resetAll }: { points: number; difficulty: Difficulty; setDifficulty: (d: Difficulty) => void; onShop: () => void; startGame: (m: Mode, l: number) => void; resetAll: () => void }) {
  const groups: [Mode, string, string, string][] = [['country', '✈️', '세계 나라 모험', 'indigo'], ['food', '🍲', '미식가 모험', 'orange'], ['animal', '🦁', '동물 왕국 모험', 'emerald'], ['fruit', '🍎', '알록달록 과일 모험', 'rose'], ['color', '🎨', '색깔 이름 모험', 'violet']]
  return <section className="animate-pop rounded-[28px] border-4 border-indigo-300 bg-white/95 p-5 text-center shadow-2xl backdrop-blur-md"><div className="mb-3 flex items-center justify-between"><span className="rounded-full border border-amber-300 bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">🪙 총 포인트: {points}P</span><button onClick={onShop} className="min-h-11 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-3 text-xs font-bold text-white shadow">🛍️ 상점</button></div><div className="mb-1 text-4xl">🌍✨</div><h1 className="text-xl font-bold text-indigo-600">단어 찾기 대모험</h1><p className="mb-3 text-[11px] text-gray-600">6×7 글자판에서 포인트를 모으며 단어를 완성하세요!</p><div className="mb-3 flex gap-2 rounded-xl bg-gray-100 p-1"><button onClick={() => setDifficulty('normal')} className={`min-h-11 flex-1 rounded-lg text-xs font-bold ${difficulty === 'normal' ? 'bg-indigo-600 text-white' : 'text-gray-600'}`}>🌟 일반 모드 (+30P)</button><button onClick={() => setDifficulty('hard')} className={`min-h-11 flex-1 rounded-lg text-xs font-bold ${difficulty === 'hard' ? 'bg-rose-600 text-white' : 'text-gray-600'}`}>🔥 하드 모드 (+50P)</button></div><div className="flex flex-col gap-2.5">{groups.map(([id, emoji, title, color]) => <div key={id} className={`rounded-2xl border border-${color}-200 bg-${color}-50/70 p-2.5`}><div className={`mb-1.5 text-xs font-bold text-${color}-700`}>{emoji} {title}</div><div className="grid grid-cols-3 gap-1.5">{[5, 10, 20].map((count, index) => <button key={count} onClick={() => startGame(id, count)} className="min-h-11 rounded-xl bg-gradient-to-r from-indigo-400 to-blue-500 px-1 text-xs font-bold text-white shadow">{count}라운드</button>)}</div></div>)}</div><button onClick={resetAll} className="mt-4 min-h-11 w-full rounded-xl border border-rose-200 bg-rose-50 text-xs font-bold text-rose-600">⚠️ 게��� 데이터 및 상점 전체 리셋</button></section>
}

function Game({ current, word, difficulty, limit, roundIndex, progress, letters, clicked, time, points, onHome, onLetter, onReset }: { current?: Round; word: string; mode: Mode; difficulty: Difficulty; limit: number; roundIndex: number; progress: number; letters: string[]; clicked: number[]; time: number; points: number; onHome: () => void; onLetter: (l: string, i: number) => void; onReset: () => void }) { return <section className="flex flex-col gap-3"><header className="rounded-2xl border border-indigo-200 bg-white/85 px-4 py-2 shadow-lg"><div className="flex items-center justify-between"><div><button onClick={onHome} className="mb-1 min-h-11 rounded-full bg-gray-100 px-3 text-xs font-bold">🏠 홈으로</button><div className="inline-block rounded-full bg-indigo-600 px-2.5 py-1 text-xs font-bold text-white">{roundIndex + 1} / {limit} 라운드</div><h1 className="mt-1 text-lg font-bold text-indigo-700">{difficulty === 'hard' ? '??? (하드모드)' : word}</h1></div><div className="text-right text-xs"><div className="text-gray-500">실시간 현황</div><div className="text-base font-bold text-rose-500">{progress} / {word.length} 글자</div></div></div><div className="mt-2 h-2.5 overflow-hidden rounded-full border border-gray-300 bg-gray-200"><div className="h-full rounded-full bg-rose-500 transition-all" style={{ width: `${time * 5}%` }} /></div><div className="flex justify-between px-1 text-xs font-bold text-gray-600"><span>⏱️ 제한 시간 (20초)</span><span className="text-rose-600">{Math.max(0, time)}초</span></div><div className="mt-2 rounded-full border border-indigo-200 bg-indigo-100/80 px-3 py-1 text-center text-xs text-indigo-900">💡 힌트: {current?.hint}</div></header><div className="rounded-2xl border border-indigo-100 bg-white/90 p-3 shadow-md"><div className="mb-1.5 flex justify-between text-[11px] font-bold text-gray-500"><span>📌 단어 완성 현황판</span><span className="text-indigo-600">진행률: {Math.round(progress / word.length * 100)}%</span></div><div className="flex flex-wrap justify-center gap-1.5">{word.split('').map((char, i) => <div key={`${char}-${i}`} className={`flex h-10 w-8 items-center justify-center rounded-xl border-2 text-base font-bold ${i < progress ? 'border-indigo-700 bg-indigo-600 text-white' : i === progress ? 'border-amber-400 bg-amber-100 text-amber-800' : 'border-dashed border-indigo-200 bg-indigo-50/50 text-indigo-400'}`}>{i < progress ? char : i === progress ? '?' : '·'}</div>)}</div></div><div className="grid grid-cols-6 gap-1.5 rounded-3xl border border-indigo-200 bg-white/70 p-3 shadow-xl">{letters.map((letter, index) => <button key={`${letter}-${index}`} disabled={clicked.includes(index)} onClick={() => onLetter(letter, index)} className={`grid-cell min-h-11 rounded-xl border-2 text-base font-bold shadow-sm ${clicked.includes(index) ? 'cursor-not-allowed border-gray-300 bg-gray-200 text-gray-400 opacity-50' : 'border-indigo-200 bg-white text-gray-800 hover:border-indigo-400 hover:bg-indigo-50'}`}>{letter}</button>)}</div><footer className="flex items-center justify-between px-4"><button onClick={onReset} className="min-h-11 rounded-xl bg-gray-200 px-3 text-xs font-bold text-gray-700">🔄 다시하기</button><div className="rounded-xl border border-indigo-200 bg-white/90 px-3 py-1.5 text-xs font-bold">🪙 실시간 포인트: <span className="text-sm text-amber-600">{points}P</span></div></footer></section> }

function Shop({ points, theme, unlocked, onClose, onBuy }: { points: number; theme: Theme; unlocked: Theme[]; onClose: () => void; onBuy: (item: typeof themes[number]) => void }) { return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"><div className="max-h-[90vh] w-full max-w-sm overflow-y-auto rounded-3xl border-4 border-purple-400 bg-white p-6 shadow-2xl"><div className="flex items-center justify-between"><h2 className="text-xl font-bold text-purple-700">🛍️ 그라데이션 포인트 상점</h2><button onClick={onClose} className="min-h-11 px-2 text-lg text-gray-400">✕</button></div><p className="mb-4 text-xs text-gray-600">플레이 포인트로 배경 테마를 구매해보세요!</p><div className="mb-4 flex justify-between rounded-2xl border border-purple-200 bg-purple-50 p-3 text-xs font-bold text-purple-900"><span>내 보유 포인트</span><span className="text-amber-600">{points}P</span></div><div className="flex flex-col gap-2.5">{themes.map((item) => { const owned = unlocked.includes(item.id); return <div key={item.id} className="flex items-center justify-between rounded-2xl border border-gray-200 bg-gray-50 p-3"><div><div className="text-xs font-bold">{item.emoji} {item.name}</div><div className="text-[10px] text-gray-500">{item.description} {item.price ? `(${item.price}P)` : ''}</div></div><button onClick={() => onBuy(item)} disabled={theme === item.id} className="min-h-11 rounded-xl bg-indigo-600 px-3 text-xs font-bold text-white disabled:bg-gray-300">{theme === item.id ? '사용중' : owned ? '적용하기' : '구매하기'}</button></div>})}</div><button onClick={onClose} className="mt-4 min-h-11 w-full rounded-xl bg-gray-100 text-xs font-bold">닫기</button></div></div> }

function Dialog({ icon, title, description, button, onClick }: { icon: string; title: string; description: string; button: string; onClick: () => void }) { return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm"><div className="animate-pop w-full max-w-xs rounded-3xl border-4 border-indigo-400 bg-white p-6 text-center shadow-2xl"><div className="mb-2 text-4xl">{icon}</div><h2 className="mb-1 text-xl font-bold text-indigo-600">{title}</h2><p className="mb-4 whitespace-pre-line text-sm text-gray-600">{description}</p><button onClick={onClick} className="min-h-11 w-full rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 text-sm font-bold text-white shadow-lg">{button}</button></div></div> }
