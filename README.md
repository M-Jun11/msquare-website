# msquare-website

## ニュースの追加
1. `news.json` の配列に `{"date": "YYYY-MM-DD", "text": "本文", "url": "https://…（任意）"}` を1件足す（順番は自由。表示は日付の新しい順）。
2. 本文の改行は `\n`。外部の URL は新しいタブで開く。トップには新しい3件、`/news/` には全件が出る。
3. `node -e "JSON.parse(require('fs').readFileSync('news.json','utf8'))"` で JSON が壊れていないか確かめてからコミットする（HTML は直さなくてよい）。
