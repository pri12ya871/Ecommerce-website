// Lightweight embedded datastore with a mongoose-like API.
// Replaces MongoDB so the project runs with zero external services —
// collections are persisted as JSON files under backend/storage/.
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, 'storage');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const newId = () => crypto.randomBytes(12).toString('hex');

// ---- query matching (supports the operators used by the routers) ----

function matchValue(docVal, cond) {
  if (cond instanceof RegExp) {
    return typeof docVal === 'string' && cond.test(docVal);
  }
  if (cond !== null && typeof cond === 'object' && !Array.isArray(cond)) {
    return Object.entries(cond).every(([op, val]) => {
      switch (op) {
        case '$gte': return Number(docVal) >= Number(val);
        case '$lte': return Number(docVal) <= Number(val);
        case '$gt': return Number(docVal) > Number(val);
        case '$lt': return Number(docVal) < Number(val);
        case '$ne': return String(docVal) !== String(val);
        case '$in':
          return (val || []).some((x) =>
            x instanceof RegExp
              ? typeof docVal === 'string' && x.test(docVal)
              : String(x) === String(docVal)
          );
        default:
          return JSON.stringify(docVal) === JSON.stringify(cond);
      }
    });
  }
  // Loose equality so string route params match stored numbers/booleans.
  if (typeof docVal === 'number') return Number(cond) === docVal;
  if (typeof docVal === 'boolean') return cond === docVal || String(cond) === String(docVal);
  return docVal === cond;
}

function matches(doc, query) {
  return Object.entries(query || {}).every(([key, cond]) => {
    if (key === '$and') return cond.every((q) => matches(doc, q));
    if (key === '$or') return cond.some((q) => matches(doc, q));
    if (key === '$nor') return !cond.some((q) => matches(doc, q));
    return matchValue(doc[key], cond);
  });
}

// ---- collection storage ----

class Collection {
  constructor(name) {
    this.file = path.join(DATA_DIR, `${name}.json`);
    this.docs = [];
    if (fs.existsSync(this.file)) {
      try {
        this.docs = JSON.parse(fs.readFileSync(this.file, 'utf-8'));
      } catch {
        this.docs = [];
      }
    }
  }

  flush() {
    fs.writeFileSync(this.file, JSON.stringify(this.docs, null, 1));
  }
}

const collections = new Map();
const getCollection = (name) => {
  if (!collections.has(name)) collections.set(name, new Collection(name));
  return collections.get(name);
};

// ---- model factory ----

export function model(name, { defaults = {} } = {}) {
  const col = getCollection(name);

  const wrap = (raw) => {
    if (!raw) return null;
    const doc = { ...raw };
    Object.defineProperty(doc, 'save', {
      enumerable: false,
      value: async function save() {
        const idx = col.docs.findIndex((d) => d._id === this._id);
        const plain = { ...this };
        plain.updatedAt = new Date().toISOString();
        if (idx >= 0) {
          col.docs[idx] = plain;
        } else {
          col.docs.push(plain);
        }
        col.flush();
        return wrap(plain);
      },
    });
    return doc;
  };

  const stampNew = (data) => ({
    ...defaults,
    ...data,
    _id: data._id || newId(),
    createdAt: data.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  class Model {
    constructor(data) {
      const doc = stampNew(data);
      Object.assign(this, doc);
      Object.defineProperty(this, 'save', {
        enumerable: false,
        value: async () => {
          const plain = JSON.parse(JSON.stringify(this));
          const idx = col.docs.findIndex((d) => d._id === plain._id);
          if (idx >= 0) col.docs[idx] = plain;
          else col.docs.push(plain);
          col.flush();
          return wrap(plain);
        },
      });
    }

    static async find(query = {}) {
      return col.docs.filter((d) => matches(d, query)).map(wrap);
    }

    static async findOne(query = {}) {
      const found = col.docs.find((d) => matches(d, query));
      return wrap(found);
    }

    static async findById(id) {
      return wrap(col.docs.find((d) => String(d._id) === String(id)));
    }

    static async create(data) {
      const doc = stampNew(data);
      col.docs.push(doc);
      col.flush();
      return wrap(doc);
    }

    static async insertMany(items) {
      const created = items.map((it) => stampNew(it));
      col.docs.push(...created);
      col.flush();
      return created.map(wrap);
    }

    static async findOneAndUpdate(filter, updates, _options) {
      const idx = col.docs.findIndex((d) => matches(d, filter));
      if (idx < 0) return null;
      col.docs[idx] = {
        ...col.docs[idx],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      col.flush();
      return wrap(col.docs[idx]);
    }

    static async updateMany(filter, updates, _options) {
      let n = 0;
      col.docs = col.docs.map((d) => {
        if (matches(d, filter)) {
          n += 1;
          return { ...d, ...updates, updatedAt: new Date().toISOString() };
        }
        return d;
      });
      col.flush();
      return { acknowledged: true, modifiedCount: n };
    }

    static async remove(query = {}) {
      const before = col.docs.length;
      col.docs = col.docs.filter((d) => !matches(d, query));
      col.flush();
      return { acknowledged: true, deletedCount: before - col.docs.length };
    }

    static count(query, cb) {
      const n = col.docs.filter((d) => matches(d, query || {})).length;
      if (typeof cb === 'function') {
        cb(null, n);
        return undefined;
      }
      return Promise.resolve(n);
    }

    static async countDocuments(query = {}) {
      return col.docs.filter((d) => matches(d, query)).length;
    }
  }

  return Model;
}

export default { model };
