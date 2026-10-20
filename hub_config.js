/* =====================================================================
   hub_config.js ― Tの端末の「項目の一覧」と「クラスごとの表示」
   このファイルだけ直せば、すべてのページに反映されます（Web に置いたとき）
   ---------------------------------------------------------------------
   ■ えほん を追加するとき
     1. えほんの HTML を、このフォルダに入れる（ファイル名は英数字で）
     2. 下の items の、その行の file: '' に、ファイル名を書く（新しいえほんなら1行足す）
          id      … 半角英数字の名前（ほかと重ならないもの）
          gives   … クリアで手に入るもの（下の一覧から1つ）
     3. えほんの HTML の </body> のすぐ前に、次の3行を入れる（'www' は、その行の id）
          <script src="hub_config.js"></script>
          <script src="hub.js"></script>
          <script>window.DroneHub && DroneHub.autoQuiz('www');</script>
        ※ 確認クイズの点数を id="score" に「〇 / 〇 問正解。全問正解です！」と出すえほんなら、そのまま動きます
   ■ gives に書けるもの
     ハード：board(マザーボード) cpu mem(メモリ) psu(電源ユニット) hdd ssd disp(ディスプレイ)
             kbd(キーボード) mouse router(ルータ) spk(スピーカー) cam(Webカメラ)
     ソフト：os browser(Webブラウザ) doc(文書アプリ) sheet(表計算アプリ) tcpip mail(メールアプリ) sec(暗号化)
     ケーブル（スキル用）：pwr(電源コード) hdmi usb lan
   ■ クラスごとの表示（show）
     クラスの番号: [表示する id の一覧]　と書く。書いていないクラスは default を使う
     'all' は全部表示。生徒がクラス・班を選ぶまでは default
   ===================================================================== */
window.HUB_CONFIG = {
  items: [
  // ---- Tのえほん（確認クイズで全問正解 → gives のぶひん） ----
  { id: 'hw',     kind: 'note', title: 'ハードウェアとソフトウェア', file: 'hardware-software.html', gives: 'os' },
  { id: 'prog',   kind: 'note', title: 'プログラムが動くしくみ',     file: 'program-basic.html',     gives: 'cpu' },
  { id: 'net',    kind: 'note', title: 'インターネットのしくみ',     file: 'network-internet.html',  gives: 'router' },
  { id: 'pkt',    kind: 'note', title: 'パケットとプロトコル',       file: 'packet-protocol.html',   gives: 'tcpip' },
  { id: 'cs',     kind: 'note', title: 'クライアント・サーバとDNS',  file: 'client-server-dns.html', gives: 'mail' },
    // file が '' のあいだは「準備中」
  { id: 'www',    kind: 'note', title: 'WWW',                        file: 'www-webapp.html', gives: 'browser' },
  { id: 'crypto', kind: 'note', title: '暗号',                       file: '', gives: 'sec' },
  // ---- Tのスキル（脱出ゲーム。部屋2までクリア → gives のケーブル。needs をクリアすると開く） ----
  { id: 'var',  kind: 'escape', title: '変数ステージ', sub: 'ドローン基地からの脱出', rooms: '倉庫 → 管制室',         file: 'drone_variable.html', ledger: 'var2',   gives: 'pwr' },
  { id: 'arr',  kind: 'escape', title: '配列ステージ', sub: '格納庫からの脱出',       rooms: '格納庫 → 発進ゲート',   file: 'drone_array.html',    ledger: 'array2', gives: 'hdmi', needs: ['var'] },
  { id: 'func', kind: 'escape', title: '関数ステージ', sub: 'サーバールームの謎',     rooms: '整備室 → サーバールーム', file: 'drone_function.html', ledger: 'fn2', gives: 'usb', needs: ['arr'] },
  { id: 'app',  kind: 'escape', title: '応用ステージ', sub: '並べ替え・探索など',     rooms: '保管庫 → 倉庫 → 通信塔', file: '', gives: 'lan', needs: ['func'] }
],

  show: {
    default: 'all'
    // 例：1組はここまで進んだ、2組はまだ配列ステージまで、など
    // , 1: ['hw', 'prog', 'net', 'pkt', 'var', 'arr', 'func']
    // , 2: ['hw', 'prog', 'var', 'arr']
  }
};
