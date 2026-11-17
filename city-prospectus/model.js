/* Cairn financial model. One source for every figure on the page. Planning assumptions, not verified quotes. */
(function (root) {
  var BASE = {
    residents: 25000, adults: 19000, homes: 13500,
    rent: 1150,          // average monthly rent per home, $
    occ: 0.95,           // occupancy
    gsf: 680,            // gross sq ft per home incl. shared space
    costSf: 185,         // hard cost $/gsf with on-site panel factory
    infraPerHome: 38000, // streets, pipes, fiber, district loop
    energyCapex: 150e6, civicCapex: 180e6, foodCapex: 60e6,
    commercialSf: 1.0e6, commercialCostSf: 180, commercialRent: 24, commercialOcc: 0.92,
    lodgeCapex: 45e6, landWater: 70e6, soft: 0.15,
    housingOpex: 0.30,
    util: { energy: 50, water: 30, net: 30 },   // per adult per month
    netToOperator: 15,                           // fiber part of the $30 (rest is mobile plan pass-through)
    utilOpex: 14e6, commercialUtil: 9e6,
    food: 400, health: 340, mobility: 50, community: 110, personal: 150,
    foodNet: 9e6, lodgeNet: 7e6,
    debtShare: 0.60, debtRate: 0.055, exitCap: 0.0525, infl: 0.025,
    build: [0.06, 0.12, 0.14, 0.14, 0.14, 0.14, 0.14, 0.12], horizon: 12, saleCost: 0.015
  };
  function irr(cf) {
    var lo = -0.9, hi = 1.0;
    function npv(r) { var s = 0; for (var i = 0; i < cf.length; i++) s += cf[i] / Math.pow(1 + r, i + 1); return s; }
    if (npv(lo) < 0) return NaN;
    for (var k = 0; k < 80; k++) { var m = (lo + hi) / 2; if (npv(m) > 0) lo = m; else hi = m; }
    return (lo + hi) / 2;
  }
  function run(over) {
    var a = {}; for (var k in BASE) a[k] = BASE[k]; for (var j in over || {}) a[j] = over[j];
    var cap = {
      housing: a.homes * a.gsf * a.costSf,
      infra: a.homes * a.infraPerHome,
      energy: a.energyCapex, civic: a.civicCapex, food: a.foodCapex,
      commercial: a.commercialSf * a.commercialCostSf + a.lodgeCapex,
      land: a.landWater
    };
    var hard = 0; for (var c in cap) hard += cap[c];
    cap.soft = hard * a.soft;
    var total = hard + cap.soft;
    var rentRev = a.homes * a.rent * 12 * a.occ;
    var noi = {
      housing: rentRev * (1 - a.housingOpex),
      utilities: (a.util.energy + a.util.water + a.netToOperator) * a.adults * 12 + a.commercialUtil - a.utilOpex,
      commercial: a.commercialSf * a.commercialRent * a.commercialOcc,
      food: a.foodNet, lodging: a.lodgeNet
    };
    var noiTotal = 0; for (var n in noi) noiTotal += noi[n];
    var housingPerAdult = a.homes * a.rent / a.adults;
    var essentials = housingPerAdult + a.util.energy + a.util.water + a.util.net + a.food + a.health + a.mobility + a.community;
    var debt = total * a.debtShare, equity = total - debt;
    var coc = (noiTotal - debt * a.debtRate) / equity;
    // year-by-year, nominal
    var cf = [], bal = 0, cum = 0, eqIn = 0;
    for (var t = 1; t <= a.horizon; t++) {
      var f = Math.pow(1 + a.infl, t - 1);
      var capex = (a.build[t - 1] || 0) * total * f;
      var draw = capex * a.debtShare;
      var interest = (bal + draw / 2) * a.debtRate;
      var noiT = noiTotal * cum * f;
      bal += draw; cum += (a.build[t - 1] || 0); eqIn += capex - draw;
      cf.push(noiT - interest - (capex - draw));
    }
    var exitNoi = noiTotal * Math.pow(1 + a.infl, a.horizon);
    var exitVal = exitNoi / a.exitCap * (1 - a.saleCost);
    cf[cf.length - 1] += exitVal - bal;
    return { a: a, cap: cap, total: total, rentRev: rentRev, noi: noi, noiTotal: noiTotal, yoc: noiTotal / total,
      housingPerAdult: housingPerAdult, essentials: essentials, allIn: essentials + a.personal,
      debt: debt, equity: equity, coc: coc, irr: irr(cf), cf: cf, eqIn: eqIn, exitVal: exitVal, debtEnd: bal,
      perResident: total / a.residents };
  }
  root.CairnModel = { BASE: BASE, run: run };
})(typeof window !== 'undefined' ? window : globalThis);
