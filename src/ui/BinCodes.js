import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { APPROVED_BINS, BIN_PREFIX } from '../game/data';
import { Sheet } from './bits';
import { QrCode } from 'lucide-react';

// The stickers a city prints for its bins. Shown in-app so a pilot can print
// them (or scan them from a second screen while testing).
const BinCodes = ({ onClose }) => {
  const [codes, setCodes] = useState({});
  useEffect(() => {
    let live = true;
    Promise.all(APPROVED_BINS.map((b) => QRCode.toDataURL(BIN_PREFIX + b.id, { margin: 2, width: 360, errorCorrectionLevel: 'M' })
      .then((url) => [b.id, url])))
      .then((pairs) => { if (live) setCodes(Object.fromEntries(pairs)); })
      .catch(() => {});
    return () => { live = false; };
  }, []);

  return (
    <Sheet onClose={onClose} tall>
      <div className="px-5 pb-8">
        <h2 className="text-white font-black text-xl tracking-tight flex items-center gap-2 mt-1">
          <QrCode className="h-5 w-5 text-quest-300" /> Approved bin stickers
        </h2>
        <p className="text-white/45 text-[12px] font-semibold mt-0.5">
          Print one per bin. Points only bank when the camera reads one of these on a real bin.
        </p>
        <div className="mt-4 space-y-4">
          {APPROVED_BINS.map((b) => (
            <div key={b.id} className="rounded-3xl bg-white p-4 text-center">
              {codes[b.id]
                ? <img src={codes[b.id]} alt={`QR sticker for ${b.name}`} className="mx-auto h-56 w-56" />
                : <div className="mx-auto h-56 w-56 rounded-xl bg-slate-200 animate-pulse" />}
              <p className="cq-pixel text-slate-900 text-[13px] mt-1">CLEANQUEST BIN {b.id}</p>
              <p className="text-slate-500 text-[11px] font-bold">{b.name} · {b.kind}</p>
            </div>
          ))}
        </div>
      </div>
    </Sheet>
  );
};

export default BinCodes;
