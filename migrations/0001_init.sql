-- Schema for the Cloudflare D1 mirror of data/*.json (ADR-0003).
CREATE TABLE events (
  id TEXT PRIMARY KEY,            -- slug of the event name
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  travel_text TEXT,               -- raw "112 km / 1:20 Zug"
  travel_km INTEGER,
  travel_min INTEGER,
  cost_min REAL,
  cost_max REAL,
  cost_approx INTEGER,
  cost_surcharge TEXT,            -- JSON: {"surcharge_eur":[21],"surcharge_note":"..."}
  swim_venue TEXT,
  bike_course TEXT,
  run_course TEXT,
  url TEXT,
  format TEXT,                    -- NULL = road triathlon, or 'cross'
  swim_type TEXT                  -- pool | open-water, derived from swim_venue
);

CREATE TABLE editions (
  event_id TEXT NOT NULL REFERENCES events(id),
  year INTEGER NOT NULL,
  date TEXT,                      -- ISO yyyy-mm-dd
  status TEXT NOT NULL,           -- confirmed | tentative | unverified
  edition_no INTEGER,
  source_url TEXT,
  PRIMARY KEY (event_id, year)
);
CREATE INDEX editions_by_date ON editions(year, date);

CREATE TABLE distances (
  event_id TEXT NOT NULL REFERENCES events(id),
  class TEXT NOT NULL,            -- sprint | short | middle
  swim_km REAL,
  bike_km REAL,
  run_km REAL,
  bike_laps TEXT,
  run_laps TEXT,
  PRIMARY KEY (event_id, class)
);
