/* =====================================================================
   Tの端末（ハブ）― 記録のしくみ（全ページ共通。ふだんは直さなくてよい）
   ・項目の一覧と、クラスごとの表示は hub_config.js に書く（そちらを直す）
   ・hub_config.js が読めないとき（zip を展開せずに開いたなど）は、下の DEF_ITEMS を使う
   ===================================================================== */
(function () {
  'use strict';

  var DEF_ITEMS = [
    // ---- Tのえほん（確認クイズで全問正解 → gives のぶひん） ----
    { id: 'hw',     kind: 'note', title: 'ハードウェアとソフトウェア', file: 'hardware-software.html', gives: 'os' },
    { id: 'prog',   kind: 'note', title: 'プログラムが動くしくみ',     file: 'program-basic.html',     gives: 'cpu' },
    { id: 'net',    kind: 'note', title: 'インターネットのしくみ',     file: 'network-internet.html',  gives: 'router' },
    { id: 'pkt',    kind: 'note', title: 'パケットとプロトコル',       file: 'packet-protocol.html',   gives: 'tcpip' },
    { id: 'protocolEhon', kind: 'note', title: 'プロトコルのえほん', sub: 'よみもの', file: 'protocol-ehon.html', gives: 'tcpip' },
    { id: 'cs',     kind: 'note', title: 'クライアントとサーバ',       file: '', gives: 'mail' },      // file が '' のあいだは「準備中」
    { id: 'www',    kind: 'note', title: 'WWW',                        file: 'www-webapp.html', gives: 'browser' },
    { id: 'crypto', kind: 'note', title: '暗号',                       file: 'crypto.html', gives: 'sec' },
    { id: 'cryptoEhon', kind: 'note', title: '暗号のえほん', sub: 'よみもの', file: 'angou-ehon.html', gives: 'sec' },
    // ---- Tのスキル（脱出ゲーム。部屋2までクリア → gives のケーブル。needs をクリアすると開く） ----
    { id: 'var',  kind: 'escape', title: '変数ステージ', sub: 'ドローン基地からの脱出', rooms: '倉庫 → 管制室',         file: 'drone_variable.html', ledger: 'var2',   gives: 'pwr' },
    { id: 'arr',  kind: 'escape', title: '配列ステージ', sub: '格納庫からの脱出',       rooms: '格納庫 → 発進ゲート',   file: 'drone_array.html',    ledger: 'array2', gives: 'hdmi', needs: ['var'] },
    { id: 'func', kind: 'escape', title: '関数ステージ', sub: 'サーバールームの謎',     rooms: '整備室 → サーバールーム', file: 'drone_function.html', ledger: 'fn2', gives: 'usb', needs: ['arr'] },
    { id: 'lin',  kind: 'escape', title: '応用ステージ\n（線形探索）', sub: '倉庫の謎',         rooms: '資料室 → 倉庫',         file: 'drone_search.html', ledger: 'ls2', gives: 'lan', needs: ['func'] },
    { id: 'bin',  kind: 'escape', title: '応用ステージ\n（二分探索）', sub: '地下倉庫の謎',     rooms: '記録室 → 地下倉庫',     file: 'drone_binary.html', ledger: 'bs2', gives: 'mem', needs: ['lin'] }
  ];
  var CFG = window.HUB_CONFIG || {};
  var ITEMS = Array.isArray(CFG.items) && CFG.items.length ? CFG.items : DEF_ITEMS;
  var SHOW = CFG.show || {};

  // 班PCにつくもの。type：hard（ハード）・soft（ソフト）・cable（ケーブル）。can：できるようになること
  var GEAR = {
    board:   { type: 'hard',  name: 'マザーボード', can: 'ぶひんをつなぐ土台ができた' },
    cpu:     { type: 'hard',  name: 'CPU',         can: 'プログラムの命令を実行できるようになった' },
    mem:     { type: 'hard',  name: 'メモリ',       can: '作業中のデータを、一時的におぼえておけるようになった' },
    psu:     { type: 'hard',  name: '電源ユニット', can: 'コンセントの電気を、班PCで使える電気に変えられるようになった' },
    hdd:     { type: 'hard',  name: 'HDD',         can: 'データを保存できるようになった（でも読み書きは少しおそい）' },
    ssd:     { type: 'hard',  name: 'SSD',         can: 'データを保存できるようになった（HDDより速く読み書きできる）' },
    disp:    { type: 'hard',  name: 'ディスプレイ', can: '結果を画面に映せるようになった' },
    kbd:     { type: 'hard',  name: 'キーボード',   can: '文字を入力できるようになった' },
    mouse:   { type: 'hard',  name: 'マウス',       can: '画面の中を指して、操作できるようになった' },
    router:  { type: 'hard',  name: 'ルータ',       can: '班PCのネットワークと、インターネットを中継できるようになった' },
    spk:     { type: 'hard',  name: 'スピーカー',   can: '音を出せるようになった' },
    cam:     { type: 'hard',  name: 'Webカメラ',    can: '映像を取りこめるようになった' },
    os:      { type: 'soft',  name: 'OS',          can: 'ハードウェアとアプリの仲立ちをする、基本のソフトが入った' },
    browser: { type: 'soft',  name: 'Webブラウザ', can: 'Webページを見られるようになった（HTTPで通信）' },
    doc:     { type: 'soft',  name: '文書アプリ',   can: '文章を書いて、保存できるようになった' },
    sheet:   { type: 'soft',  name: '表計算アプリ', can: '表やグラフを作れるようになった' },
    tcpip:   { type: 'soft',  name: 'TCP/IP',      can: 'インターネットの通信のきまり（プロトコル）で、データをやりとりできるようになった' },
    mail:    { type: 'soft',  name: 'メールアプリ', can: 'メールサーバとやりとりして、メールを送ったり受け取ったりできるようになった' },
    sec:     { type: 'soft',  name: '暗号化（HTTPS）', can: '通信を暗号にして、安全にやりとりできるようになった' },
    pwr:     { type: 'cable', name: '電源コード',   can: 'コンセントから、班PCに電気が来るようになった' },
    hdmi:    { type: 'cable', name: 'HDMIケーブル', can: '本体とディスプレイがつながった' },
    usb:     { type: 'cable', name: 'USBケーブル',  can: 'キーボードとマウスが本体につながった' },
    lan:     { type: 'cable', name: 'LANケーブル',  can: '班PCとルータがつながった' }
  };
  var TYPE_ICON = { hard: '🔧', soft: '💿', cable: '🔌' };

  // 絵（viewBox 0 0 360 250）
  var PART_SVG = {
    disp:  '<rect x="16" y="18" width="178" height="118" rx="8" fill="#1e293b" stroke="#0f172a" stroke-width="3"/><rect class="pcScreen" x="26" y="28" width="158" height="96" rx="3" fill="#0ea5e9"/><rect x="92" y="136" width="26" height="16" fill="#334155"/><rect x="70" y="150" width="70" height="8" rx="3" fill="#475569"/>',
    cam:   '<rect x="95" y="8" width="20" height="10" rx="4" fill="#334155"/><circle cx="105" cy="13" r="3" fill="#38bdf8"/>',
    spk:   '<rect x="200" y="96" width="22" height="58" rx="5" fill="#475569"/><circle cx="211" cy="112" r="6" fill="#1e293b"/><circle cx="211" cy="137" r="8" fill="#1e293b"/>',
    router:'<rect x="198" y="44" width="34" height="16" rx="3" fill="#334155"/><g fill="#4ade80"><circle cx="205" cy="52" r="1.6"/><circle cx="211" cy="52" r="1.6"/><circle cx="217" cy="52" r="1.6"/></g><line x1="204" y1="44" x2="201" y2="32" stroke="#334155" stroke-width="2.5" stroke-linecap="round"/><line x1="226" y1="44" x2="229" y2="32" stroke="#334155" stroke-width="2.5" stroke-linecap="round"/>',
    kbd:   '<rect x="22" y="172" width="160" height="30" rx="5" fill="#cbd5e1"/><g fill="#94a3b8"><rect x="30" y="178" width="144" height="5" rx="1"/><rect x="30" y="186" width="144" height="5" rx="1"/><rect x="60" y="194" width="84" height="4" rx="1"/></g>',
    mouse: '<ellipse cx="204" cy="188" rx="10" ry="15" fill="#cbd5e1"/><line x1="204" y1="174" x2="204" y2="184" stroke="#94a3b8" stroke-width="2"/>',
    board: '<rect x="244" y="34" width="90" height="120" rx="3" fill="#15803d"/><g stroke="#4ade80" stroke-width="1.2" opacity=".7"><path d="M250 44 h30 v20 M326 44 v40 h-20 M252 140 h40 v-12 M320 146 h-16"/></g>',
    cpu:   '<rect x="266" y="54" width="30" height="30" rx="3" fill="#94a3b8" stroke="#475569" stroke-width="2"/><rect x="273" y="61" width="16" height="16" rx="2" fill="#334155"/>',
    mem:   '<rect x="306" y="46" width="7" height="58" rx="1.5" fill="#1d4ed8"/><rect x="317" y="46" width="7" height="58" rx="1.5" fill="#1d4ed8"/><g fill="#facc15"><rect x="307" y="96" width="5" height="6"/><rect x="318" y="96" width="5" height="6"/></g>',
    ssd:   '<rect x="248" y="162" width="34" height="14" rx="2" fill="#0f172a" stroke="#64748b" stroke-width="1.5"/><rect x="253" y="166" width="14" height="6" fill="#38bdf8"/>',
    hdd:   '<rect x="290" y="158" width="40" height="22" rx="2" fill="#64748b"/><circle cx="304" cy="169" r="7" fill="#cbd5e1"/><circle cx="304" cy="169" r="2" fill="#475569"/><line x1="314" y1="163" x2="324" y2="175" stroke="#334155" stroke-width="2"/>',
    psu:   '<rect x="244" y="186" width="90" height="32" rx="3" fill="#475569"/><circle cx="314" cy="202" r="11" fill="#1e293b"/><path d="M314 192 v20 M304 202 h20 M307 195 l14 14 M321 195 l-14 14" stroke="#64748b" stroke-width="1.5"/><path d="M252 196 l8 -6 l-3 6 l8 0 l-8 8 l3 -6 z" fill="#facc15"/>',
    // ソフト（左下の棚。ディスクの形）
    os:      '<circle cx="34" cy="232" r="11" fill="#e2e8f0"/><circle cx="34" cy="232" r="3" fill="#94a3b8"/><text x="50" y="236" font-size="10" font-weight="800" fill="#e2e8f0" font-family="system-ui,sans-serif">OS</text>',
    browser: '<circle cx="84" cy="232" r="11" fill="#38bdf8"/><circle cx="84" cy="232" r="3" fill="#0369a1"/><text x="100" y="236" font-size="10" font-weight="800" fill="#e2e8f0" font-family="system-ui,sans-serif">Web</text>',
    doc:     '<circle cx="140" cy="232" r="11" fill="#60a5fa"/><circle cx="140" cy="232" r="3" fill="#1d4ed8"/><text x="156" y="236" font-size="10" font-weight="800" fill="#e2e8f0" font-family="system-ui,sans-serif">文書</text>',
    sheet:   '<circle cx="194" cy="232" r="11" fill="#4ade80"/><circle cx="194" cy="232" r="3" fill="#15803d"/><text x="210" y="236" font-size="10" font-weight="800" fill="#e2e8f0" font-family="system-ui,sans-serif">表計算</text>',
    // ケーブル
    pwr:   '<path d="M334 208 C 350 208, 344 226, 352 228" fill="none" stroke="#f87171" stroke-width="3.5" stroke-linecap="round"/><rect x="348" y="220" width="10" height="14" rx="2" fill="#e2e8f0"/>',
    hdmi:  '<path d="M238 70 C 218 70, 226 112, 194 112" fill="none" stroke="#f87171" stroke-width="3.5" stroke-linecap="round"/>',
    usb:   '<path d="M182 186 C 214 204, 222 176, 238 172 M204 173 C 212 160, 226 164, 238 164" fill="none" stroke="#f87171" stroke-width="3" stroke-linecap="round"/>',
    lan:   '<path d="M238 96 C 222 96, 226 70, 216 60" fill="none" stroke="#f87171" stroke-width="3.5" stroke-linecap="round"/>'
  };
  var DRAW_ORDER = ['disp', 'cam', 'spk', 'router', 'kbd', 'mouse', 'board', 'cpu', 'mem', 'ssd', 'hdd', 'psu', 'os', 'browser', 'doc', 'sheet', 'pwr', 'hdmi', 'usb', 'lan'];
  var CASE_SVG = '<rect x="236" y="22" width="106" height="202" rx="8" fill="#0f172a" stroke="#64748b" stroke-width="3"/>';
  var OUTLETS = '<g opacity=".6"><rect x="347" y="218" width="12" height="18" rx="2" fill="#334155"/></g><line x1="14" y1="216" x2="240" y2="216" stroke="#1e293b" stroke-width="1"/>';

  var KEY = 'droneHub_v1';
  var TEAM_KEY = 'droneLessonTeam_set5';   // 脱出ゲームの記録（班・名前・ポイント）

  function read(k) { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return null; } }
  function rec() { var r = read(KEY); if (!r || typeof r !== 'object') r = {}; if (!r.cleared) r.cleared = {}; if (!Array.isArray(r.order)) r.order = []; return r; }
  function save(r) { try { localStorage.setItem(KEY, JSON.stringify(r)); } catch (e) { /* 保存できない環境 */ } }
  function item(id) { for (var i = 0; i < ITEMS.length; i++) if (ITEMS[i].id === id) return ITEMS[i]; return null; }

  // 脱出ゲームの「自分」の記録（部屋2のクリア）
  function ledgerCleared(key) {
    var t = read(TEAM_KEY);
    if (!t || t.me === null || t.me === undefined || !t.ledger) return false;
    var l = t.ledger[t.me] || {};
    return !!l[key];
  }
  function rawCleared(r, it) { return !!(r.cleared[it.id] || (it.ledger && ledgerCleared(it.ledger))); }
  // クリアした順（ぶひんの順）を記録にそろえる
  function sync() {
    var r = rec(), changed = false;
    ITEMS.forEach(function (it) { if (rawCleared(r, it) && r.order.indexOf(it.id) < 0) { r.order.push(it.id); changed = true; } });
    if (changed) save(r);
    return r;
  }
  function isCleared(id) { var it = item(id); return !!it && rawCleared(rec(), it); }
  function clear(id) {
    var r = rec();
    if (!r.cleared[id]) r.cleared[id] = Date.now();
    if (r.order.indexOf(id) < 0) r.order.push(id);
    save(r);
  }
  function isOpen(id) {
    var it = item(id); if (!it || !it.file) return false;
    return (it.needs || []).every(isCleared);
  }
  function kindOf(id) { var it = item(id); return it && it.kind === 'escape' ? 'cable' : 'part'; }
  // 手に入ったもの（手に入れた順）
  function parts() {
    var got = {};   // 同じぶひんを2つの項目でもらえるとき（えほんかクイズのどちらか）は、1つだけ数える
    return sync().order.map(item).filter(function (it) { if (!it || !GEAR[it.gives] || got[it.gives]) return false; got[it.gives] = 1; return true; }).map(function (it) {
      var g = GEAR[it.gives]; return { item: it.id, kind: kindOf(it.id), id: it.gives, part: { id: it.gives, name: g.name, can: g.can, type: g.type } };
    });
  }
  // その項目で手に入ったもの（まだなら null）
  function part(id) {
    var ps = parts(), x = ps.filter(function (p) { return p.item === id; })[0], it = item(id);
    if (!x && it && it.gives && isCleared(id)) x = ps.filter(function (p) { return p.id === it.gives; })[0];   // ほかの項目で、もう手に入れている
    return x ? x.part : null;
  }
  // クラス・班（一度決めたら変えられない。先生のリセットで外れる）
  var LOCK = 'droneGroupLock';
  function lockedGroup() { try { return localStorage.getItem(LOCK) || ''; } catch (e) { return ''; } }
  function setGroup(g) { try { if (/^\d組\d班$/.test(g) && !lockedGroup()) localStorage.setItem(LOCK, g); } catch (e) { /* なし */ } return lockedGroup(); }
  function team() {
    var t = read(TEAM_KEY) || {};
    var g = lockedGroup() || t.group || '';
    return { group: g, cls: (String(g).match(/^(\d)組/) || [])[1] || '', me: (t.group === g && t.names && t.me !== null && t.me !== undefined) ? (String(t.names[t.me] || '').trim() || (t.me + 1) + '号機') : '' };
  }
  // クラスごとの表示（hub_config.js の show）。書いていないクラスは default、それもなければ全部
  function visible(id) {
    var c = team().cls, list = (c && SHOW[c]) || SHOW['default'];
    if (!list || list === 'all') return true;
    return list.indexOf(id) >= 0;
  }

  // 班PCの絵：手に入れたものは色つき、まだのものは点線。hi のものは光らせる
  // 実際のパソコンと同じように、そろったもので動き方が決まる
  //   電源（電源ユニット＋電源コード）→ マザーボード・CPU・メモリ で動き出す → SSD（OS）で起動
  //   → ディスプレイ＋HDMIケーブル で画面に映る → キーボード・マウス＋USBケーブル で操作できる
  function owned() { var own = {}; parts().forEach(function (p) { own[p.id] = 1; }); return own; }
  function pcState(own) {
    own = own || owned();
    var store = own.ssd || own.hdd;
    var power = own.psu && own.pwr, post = power && own.board && own.cpu && own.mem, boot = post && store && own.os;
    var shown = boot && own.disp && own.hdmi, usable = shown && own.kbd && own.mouse && own.usb;
    var net = usable && own.lan && own.router && own.tcpip;
    var st = { power: power, post: post, boot: boot, shown: shown, usable: usable, net: net, web: net && own.browser, fast: !!own.ssd };
    var m = function (lv, msg) { st.lv = lv; st.msg = msg; return st; };
    if (!Object.keys(own).length) return m(0, 'まだ ぶひん がない');
    if (!own.psu) return m(1, '電源が入らない（電源ユニットがない）');
    if (!own.pwr) return m(1, 'コンセントにつながっていないので、電気が来ない（電源コードがない）');
    if (!own.board) return m(1, 'ぶひんをつなぐ土台がないので、動かない（マザーボードがない）');
    if (!own.cpu) return m(1, '電源は入るが、命令を実行する部品がないので動かない（CPUがない）');
    if (!own.mem) return m(1, '電源は入るが、作業する場所がないので起動できない（メモリがない）');
    if (!store) return m(2, '動き出したが、データをしまう場所がない（SSD か HDD がない）');
    if (!own.os) return m(2, '動き出したが、OS が入っていないので起動できない（OS がない）');
    var slow = own.ssd ? '' : '（HDDなので、起動に時間がかかる）';
    if (!own.disp) return m(3, '起動したが、画面がないので何も見えない（ディスプレイがない）' + slow);
    if (!own.hdmi) return m(3, '起動したが、ディスプレイにつながっていないので映らない（HDMIケーブルがない）');
    if (!own.kbd || !own.mouse) return m(4, '画面に映った！ でも、' + (!own.kbd && !own.mouse ? 'キーボードとマウス' : !own.kbd ? 'キーボード' : 'マウス') + 'がないので操作できない' + slow);
    if (!own.usb) return m(4, '画面に映った！ でも、キーボードとマウスが本体につながっていない（USBケーブルがない）');
    if (!net) return m(5, '🎉 班PCが使えるようになった！ ' + (!own.router ? '（インターネットには、ルータがないのでつながらない）' : !own.lan ? '（インターネットには、LANケーブルがないのでつながらない）' : '（インターネットには、通信のきまり TCP/IP がないのでつながらない）') + slow);
    if (!own.browser) return m(6, '🎉 班PCが使えるようになった！ インターネットにもつながった（Webブラウザがあれば、Webページが見られる）' + slow);
    return m(7, '🎉 班PCが使えるようになった！ インターネットにつながって、Webページも見られる' + (own.sec ? '（暗号化で安全に）' : '') + slow);
  }
  function pcSvg(hi, cls) {
    var own = owned(), st = pcState(own);
    var order = DRAW_ORDER;
    var g = order.map(function (k) {
      var has = !!own[k];
      return '<g class="' + (has ? 'pcHas' : 'pcGhost') + (k === hi ? ' pcHi' : '') + '">' + PART_SVG[k] + '</g>';
    }).join('');
    return '<svg class="' + (cls || 'pcSvg') + '" viewBox="0 0 360 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="班PCの完成状況">' +
      '<style>.pcGhost *{fill:none!important;stroke:#64748b!important;stroke-width:1.3!important;stroke-dasharray:4 3}.pcGhost{opacity:.55}.pcGhost text{fill:#64748b!important;stroke:none!important}' +
      '.pcHi{animation:pcHi 1.2s ease-in-out infinite}.pcHi path{stroke-width:5!important}@keyframes pcHi{0%,100%{filter:drop-shadow(0 0 0 #facc15)}50%{filter:drop-shadow(0 0 6px #facc15)}}' +
      (st.shown ? '' : '.pcHas .pcScreen{fill:#020617!important}') + '@media (prefers-reduced-motion:reduce){.pcHi{animation:none;filter:drop-shadow(0 0 4px #facc15)}}</style>' +
      OUTLETS + CASE_SVG + g +
      (own.disp && own.hdmi && st.post && !st.boot ? '<text x="34" y="46" font-size="9" font-weight="700" fill="#e2e8f0" font-family="ui-monospace,Consolas,monospace">No bootable device.</text><text x="34" y="60" font-size="9" fill="#94a3b8" font-family="ui-monospace,Consolas,monospace">Insert boot disk_</text>' : '') +
      (st.shown ? '<g font-family="system-ui,sans-serif"><text x="105" y="80" text-anchor="middle" font-size="16" font-weight="900" fill="#fff">' + (st.usable ? '班PC Ready!' : 'Hello!') + '</text><g fill="#e0f2fe" opacity=".85"><rect x="34" y="34" width="14" height="12" rx="2"/><rect x="34" y="52" width="14" height="12" rx="2"/><rect x="34" y="70" width="14" height="12" rx="2"/></g><rect x="26" y="114" width="158" height="10" fill="#0369a1"/></g>' : '') +
      (st.power && own.board ? '<circle cx="330" cy="30" r="3" fill="' + (st.post ? '#4ade80' : '#f59e0b') + '"/>' : '') + (st.shown && st.web ? '<text x="180" y="121" text-anchor="end" font-size="9" fill="#fff" font-family="system-ui,sans-serif">🌐</text>' : '') + (st.shown ? '<text x="30" y="121" font-size="7" fill="#e0f2fe" font-family="system-ui,sans-serif">' + (st.fast ? 'SSD' : 'HDD') + '</text>' : '') +
      '</svg>';
  }

  // ぶひんのカード（どのページのデザインにも合うよう、スタイルは中に書く）
  function partCard(id, opt) {
    var p = part(id); if (!p) return '';
    opt = opt || {};
    var cab = p.type === 'cable', col = cab ? '#f87171' : '#facc15';
    return '<div style="margin:14px auto;max-width:560px;background:#020617;border:' + (cab ? 3 : 2) + 'px solid ' + col + ';border-radius:14px;padding:14px 18px;color:#e2e8f0;font:700 15px/1.7 system-ui,-apple-system,\'Hiragino Sans\',sans-serif;text-align:center' + (cab ? ';box-shadow:0 0 18px rgba(248,113,113,.45)' : '') + '">' +
      '<div style="color:' + (cab ? '#fecaca' : '#fde68a') + ';font-size:17px;font-weight:900">' + (cab ? '🔌 スキルクリア！ 班PCの ケーブル を手に入れた！' : TYPE_ICON[p.type] + ' 班PCの ぶひん（' + (p.type === 'soft' ? 'ソフトウェア' : 'ハードウェア') + '）を手に入れた！') + '</div>' +
      '<div style="max-width:300px;margin:6px auto">' + pcSvg(p.id, 'pcSvgCard').replace('<svg ', '<svg style="width:100%;height:auto;display:block" ') + '</div>' +
      '<div style="font-size:20px;font-weight:900;color:#fef3c7">' + p.name + '</div>' +
      '<div style="font-size:14px;color:#cbd5e1">' + p.can + '</div>' +
      '<div style="margin-top:6px;font-size:13px;color:#94a3b8">いまの班PC：' + pcState().msg + '</div>' +
      (opt.link === false ? '' : '<a href="index.html" style="display:inline-block;margin-top:8px;background:#0ea5e9;color:#fff;border-radius:10px;padding:6px 16px;text-decoration:none">📱 Tの端末にもどる</a>') +
      '</div>';
  }

  // えほん：確認クイズを見張って、全問正解ならぶひんを出す。まちがいがあれば「もう一度」
  function autoQuiz(id) {
    function setup() {
      var score = document.getElementById('score');
      if (!score) return;
      var box = document.createElement('div');
      box.id = 'hubBox';
      var host = score.closest ? score.closest('.qhead') : null;
      (host && host.parentNode ? host.parentNode : score.parentNode).insertBefore(box, host ? host.nextSibling : score.nextSibling);
      var page = score.parentNode && score.parentNode.closest ? score.parentNode.closest('[id]') : null;
      function retry() {
        location.hash = page ? page.id : '';
        location.reload();
      }
      var note = function (t) { return '<div style="margin:10px auto;max-width:560px;text-align:center;font:700 14px/1.6 system-ui,sans-serif;color:#64748b">' + t + '</div>'; };
      function update() {
        var t = score.textContent || '';
        if (t.indexOf('全問正解') >= 0) { clear(id); box.innerHTML = partCard(id); return; }
        if (/問正解。/.test(t)) {
          box.innerHTML = '<div style="margin:12px auto;max-width:560px;text-align:center;font:700 15px/1.7 system-ui,sans-serif;color:#475569">全問正解で、班PCの ぶひん が手に入る。' +
            '<br><button type="button" id="hubRetryBtn" style="margin-top:6px;font:inherit;background:#0ea5e9;color:#fff;border:0;border-radius:10px;padding:6px 18px;cursor:pointer">🔁 もう一度ちょうせんする</button></div>';
          var b = document.getElementById('hubRetryBtn'); if (b) b.onclick = retry;
          return;
        }
        var p = part(id);
        box.innerHTML = p ? note('✓ クリアずみ（ぶひん：' + p.name + '）') : note('🔧 全問正解すると、班PCの ぶひん が手に入る');
      }
      new MutationObserver(update).observe(score, { childList: true, characterData: true, subtree: true });
      update();
      // Tの端末へもどるボタン（右下）
      var a = document.createElement('a');
      a.href = 'index.html'; a.textContent = '📱 Tの端末';
      a.setAttribute('style', 'position:fixed;right:12px;bottom:12px;z-index:9999;background:#0f172a;color:#fde68a;border:2px solid #facc15;border-radius:999px;padding:6px 14px;font:800 14px system-ui,sans-serif;text-decoration:none;box-shadow:0 2px 8px rgba(0,0,0,.35)');
      document.body.appendChild(a);
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setup); else setup();
  }

  window.DroneHub = {
    ITEMS: ITEMS, GEAR: GEAR, TYPE_ICON: TYPE_ICON, kindOf: kindOf, item: item, isCleared: isCleared, clear: clear, isOpen: isOpen,
    part: part, parts: parts, pcSvg: pcSvg, pcState: pcState, partCard: partCard, pieceCard: partCard,
    autoQuiz: autoQuiz, team: team, visible: visible, lockedGroup: lockedGroup, setGroup: setGroup,
    reset: function () { try { localStorage.removeItem(KEY); } catch (e) { /* なし */ } }
  };
})();
