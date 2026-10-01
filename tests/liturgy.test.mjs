import assert from "node:assert/strict";
import test from "node:test";
import { getLiturgyDate, getLiturgySourceUrl, parseDailyGospel } from "../lib/liturgy.ts";

const date = getLiturgyDate(new Date("2026-10-02T12:00:00Z"));
const sample = (day = "02") => `
  <hgroup class="content-header">
    <span class='dia'>${day}</span><span class='mes'>Oct</span><span class='ano'>2026</span>
    <h1 class="entry-title">Celebração de teste | Sexta-feira</h1>
  </hgroup>
  <li id="evangelho"><a href="#liturgia-4"><div class="referencia">Mt 18,1-5.10</div></a></li>
  <div id="liturgia-1"><p>Esta outra leitura não deve ser usada.</p></div>
  <div id="liturgia-4">
    <p><div><iframe src="https://example.com/"></iframe></div></p>
    <p>Proclama&ccedil;&atilde;o do Evangelho de Jesus Cristo.</p>
    <p><strong>- Gl&oacute;ria a v&oacute;s, Senhor.</strong></p>
    <p><strong>1</strong> Texto fict&iacute;cio para verificar a extra&ccedil;&atilde;o segura da leitura e sua apresenta&ccedil;&atilde;o breve com palavras suficientes para testar o limite do trecho sem copiar uma leitura b&iacute;blica completa.</p>
    <p>— Palavra da Salvação.</p>
  </div></article>`;

test("uses the parish's day before and after midnight in Brasília", () => {
  assert.equal(getLiturgyDate(new Date("2026-10-02T02:59:59Z")).iso, "2026-10-01");
  assert.equal(getLiturgyDate(new Date("2026-10-02T03:00:00Z")).iso, "2026-10-02");
  assert.equal(getLiturgyDate(new Date("2027-01-01T02:00:00Z")).iso, "2026-12-31");
});

test("rejects an old reading even when the publisher request succeeded", () => {
  assert.throws(() => parseDailyGospel(sample("01"), date), /another day/);
});

test("extracts the Gospel only, decodes accents and limits the preview", () => {
  const result = parseDailyGospel(sample(), date);
  assert.equal(result.status, "ready");
  assert.equal(result.reference, "Mt 18,1-5.10");
  assert.match(result.excerpt, /^Texto fictício/);
  assert.equal(result.excerpt.split(/\s+/).length, 24);
  assert.match(result.excerpt, /…$/);
  assert.doesNotMatch(result.excerpt, /outra leitura|iframe|<|&|^1/);
  assert.equal(result.celebration, "Celebração de teste");
});

test("rejects missing content and keeps source links tied to the requested date", () => {
  assert.throws(() => parseDailyGospel("<html>Temporariamente indisponível</html>", date));
  assert.throws(() => parseDailyGospel(sample().replace('id="evangelho"', 'id="salmo"'), date));
  assert.equal(getLiturgySourceUrl(date), "https://liturgia.cancaonova.com/pb/?sAno=2026&sMes=10&sDia=2");
});
