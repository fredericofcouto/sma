import assert from 'node:assert/strict';
import test from 'node:test';
import { getReadingsDate, shiftReadingDay, shiftReadingMonth, parseFullLiturgy, getFullLiturgy } from '../lib/daily-readings.ts';

const date = getReadingsDate('2026-10-01');
const sample = (value = '01/10/2026') => ({
  data: value, liturgia: 'Celebração de teste', cor: 'Branco',
  leituras: {
    primeiraLeitura: [
      {referencia:'Primeira referência',titulo:'Leitura de teste',texto:'Texto fictício da primeira leitura.'},
      {referencia:'Forma breve',titulo:'Leitura alternativa',texto:'Texto fictício da alternativa.'},
    ],
    salmo:[{referencia:'Salmo de teste',refrao:'Refrão fictício.',texto:'Estrofe de teste.\nOutra estrofe de teste.'}],
    segundaLeitura:[],
    evangelho:[{referencia:'Evangelho de teste',titulo:'Proclamação de teste',texto:'Texto fictício do evangelho.'}],
    extras:[{tipo:'Leitura adicional',referencia:'Outra referência',texto:'Texto fictício adicional.'}],
  },
});

test('validates calendar dates and moves correctly across leap days and years', () => {
  assert.equal(getReadingsDate('2024-02-29').iso, '2024-02-29');
  for (const invalid of ['2026-02-29','2026-04-31','2026-13-01','2026-10-1','0000-01-01','not-a-date']) {
    assert.equal(getReadingsDate(invalid), undefined);
  }
  assert.equal(shiftReadingDay('2024-02-28', 1), '2024-02-29');
  assert.equal(shiftReadingDay('2027-01-01', -1), '2026-12-31');
  assert.equal(shiftReadingMonth('2026-12', 1), '2027-01');
});

test('keeps complete texts, alternate readings, refrains and extra readings without inventing a second reading', () => {
  const result = parseFullLiturgy(sample(), date);
  assert.equal(result.status, 'ready');
  assert.equal(result.groups.some(g => g.id === 'segunda-leitura'), false);
  assert.equal(result.groups[0].readings.length, 2);
  assert.equal(result.groups.find(g => g.id === 'salmo').readings[0].refrain, 'Refrão fictício.');
  assert.equal(result.groups.find(g => g.id === 'evangelho').readings[0].text, 'Texto fictício do evangelho.');
  assert.equal(result.groups.find(g => g.id === 'outras-leituras').readings[0].title, 'Leitura adicional');
});

test('rejects a different date and incomplete provider responses', () => {
  assert.throws(() => parseFullLiturgy(sample('30/09/2026'), date), /another date/);
  assert.throws(() => parseFullLiturgy({...sample(),leituras:{evangelho:[]}}, date), /Missing Gospel/);
  const malformed = sample();
  malformed.leituras.evangelho[0].texto = '';
  assert.throws(() => parseFullLiturgy(malformed, date), /Empty reading/);
});

test('coalesces requests, caches by date, and never reuses another day after a provider failure', async () => {
  const originalFetch = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = async (url) => {
    calls++;
    const day = new URL(url).searchParams.get('dia');
    if (day !== '1') return new Response('Temporary failure', {status:503});
    await Promise.resolve();
    return Response.json(sample('01/10/2030'));
  };
  try {
    const selected = getReadingsDate('2030-10-01');
    const [a,b] = await Promise.all([getFullLiturgy(selected),getFullLiturgy(selected)]);
    assert.equal(a.status, 'ready');
    assert.equal(b.date.iso, selected.iso);
    assert.equal(calls, 1);
    await getFullLiturgy(selected);
    assert.equal(calls, 1);
    const next = await getFullLiturgy(getReadingsDate('2030-10-02'));
    assert.equal(next.status, 'unavailable');
    assert.equal(next.date.iso, '2030-10-02');
    assert.deepEqual(next.groups, []);
  } finally { globalThis.fetch = originalFetch; }
});
