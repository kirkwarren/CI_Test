import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const COLLECTIONS = [
  "patients",
  "appointments",
  "messages",
  "outbox",
  "notes",
  "ledger",
  "reviewRequests",
  "followups",
  "callLog",
  "meta"
];

export class Store {
  constructor(dir) {
    this.dir = dir;
    this.file = path.join(dir, "store.json");
    fs.mkdirSync(dir, { recursive: true });
    if (fs.existsSync(this.file)) {
      this.data = JSON.parse(fs.readFileSync(this.file, "utf8"));
      for (const c of COLLECTIONS) this.data[c] ||= [];
    } else {
      this.data = Object.fromEntries(COLLECTIONS.map((c) => [c, []]));
      this.save();
    }
  }

  save() {
    const tmp = this.file + ".tmp";
    fs.writeFileSync(tmp, JSON.stringify(this.data, null, 2));
    fs.renameSync(tmp, this.file);
  }

  list(collection, predicate = () => true) {
    return this.data[collection].filter(predicate);
  }

  get(collection, id) {
    return this.data[collection].find((d) => d.id === id) || null;
  }

  findOne(collection, predicate) {
    return this.data[collection].find(predicate) || null;
  }

  insert(collection, doc) {
    const record = {
      id: doc.id || crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      ...doc
    };
    this.data[collection].push(record);
    this.save();
    return record;
  }

  update(collection, id, patch) {
    const record = this.get(collection, id);
    if (!record) return null;
    Object.assign(record, patch, { updatedAt: new Date().toISOString() });
    this.save();
    return record;
  }

  getMeta(key, fallback = null) {
    const entry = this.findOne("meta", (m) => m.key === key);
    return entry ? entry.value : fallback;
  }

  setMeta(key, value) {
    const entry = this.findOne("meta", (m) => m.key === key);
    if (entry) {
      entry.value = value;
      this.save();
    } else {
      this.insert("meta", { key, value });
    }
  }
}

let singleton;

export function getStore(dir = process.env.DATA_DIR || "./data") {
  if (!singleton) singleton = new Store(dir);
  return singleton;
}
