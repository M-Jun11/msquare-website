// ニュースの表示（データは /news.json の1か所だけ）。
// data-news="3" の <ul> には新しい順に3件、data-news="" には全件を出す。
(function () {
  var lists = document.querySelectorAll('[data-news]');
  if (!lists.length) return;

  function fmtDate(d) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(d);
    return m ? m[1] + '年' + Number(m[2]) + '月' + Number(m[3]) + '日' : d;
  }

  function item(n) {
    var li = document.createElement('li');
    li.className = 'news-item';
    var time = document.createElement('time');
    time.className = 'news-date';
    time.dateTime = n.date;
    time.textContent = fmtDate(n.date);
    var body = document.createElement('div');
    body.className = 'news-body';
    var p = document.createElement('p');
    p.className = 'news-text';
    p.textContent = n.text; // 改行は CSS（white-space: pre-line）で見せる
    body.appendChild(p);
    if (n.url) {
      var u = new URL(n.url, location.href);
      var a = document.createElement('a');
      a.className = 'news-link';
      a.href = u.href;
      if (u.host !== location.host) {
        a.target = '_blank';
        a.rel = 'noopener';
        a.textContent = u.host + ' ↗';
        a.setAttribute('aria-label', u.host + '（新しいタブで開きます）');
      } else {
        a.textContent = '詳しく見る →';
      }
      body.appendChild(a);
    }
    li.appendChild(time);
    li.appendChild(body);
    return li;
  }

  function valid(n) {
    if (!n || typeof n.text !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(n.date || '')) return false;
    if (n.url && !/^(https?:\/\/|\/)/.test(n.url)) return false;
    return true;
  }

  fetch('/news.json', { cache: 'no-cache' })
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function (all) {
      var items = all.filter(valid).sort(function (a, b) { return a.date < b.date ? 1 : a.date > b.date ? -1 : 0; });
      lists.forEach(function (ul) {
        var limit = Number(ul.getAttribute('data-news')) || items.length;
        ul.textContent = '';
        items.slice(0, limit).forEach(function (n) { ul.appendChild(item(n)); });
        ul.removeAttribute('aria-busy');
      });
    })
    .catch(function () {
      lists.forEach(function (ul) {
        ul.innerHTML = '<li class="news-empty">ニュースを読み込めませんでした。時間をおいて、もう一度開いてください。</li>';
        ul.removeAttribute('aria-busy');
      });
    });
})();
