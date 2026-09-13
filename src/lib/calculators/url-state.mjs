export const DEFAULT_IMPERMANENT_LOSS_STATE = Object.freeze({
  mode: 'weighted',
  priceA0: 2000,
  priceA1: 3000,
  priceB0: 1,
  priceB1: 1,
  capital: 10000,
  feesEarned: 260,
  days: 45,
  weightA: 0.5,
  lowerPrice: 1500,
  upperPrice: 3500,
});

const fields = [
  ['priceA0', 'a0'],
  ['priceA1', 'a1'],
  ['priceB0', 'b0'],
  ['priceB1', 'b1'],
  ['capital', 'capital'],
  ['feesEarned', 'fees'],
  ['days', 'days'],
  ['weightA', 'weight'],
  ['lowerPrice', 'lower'],
  ['upperPrice', 'upper'],
];

export function encodeImpermanentLossState(state) {
  const params = new URLSearchParams();
  params.set('mode', state.mode);
  for (const [field, key] of fields) params.set(key, String(state[field]));
  return params.toString();
}

export function decodeImpermanentLossState(search) {
  const params = new URLSearchParams(search);
  const mode = params.get('mode');
  if (mode !== 'weighted' && mode !== 'concentrated') return { ...DEFAULT_IMPERMANENT_LOSS_STATE };
  const state = { ...DEFAULT_IMPERMANENT_LOSS_STATE, mode };
  for (const [field, key] of fields) {
    const raw = params.get(key);
    if (raw === null) continue;
    const value = Number(raw);
    if (!Number.isFinite(value)) return { ...DEFAULT_IMPERMANENT_LOSS_STATE };
    state[field] = value;
  }
  const valid = state.priceA0 > 0 && state.priceA1 > 0 && state.priceB0 > 0 && state.priceB1 > 0
    && state.capital > 0 && state.feesEarned >= 0 && state.days >= 1
    && state.weightA > 0 && state.weightA < 1 && state.lowerPrice > 0 && state.upperPrice > state.lowerPrice;
  return valid ? state : { ...DEFAULT_IMPERMANENT_LOSS_STATE };
}
