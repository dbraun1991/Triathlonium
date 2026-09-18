# Data review notes (2026-09-18)

Findings from the unattended 2027 research run. Nothing here changed
`data/triathlons-nrw-2026.json`; items are for a human to decide.

## Possible errors in the spreadsheet export

| Event | Sheet says (2026) | Found | Source |
|-------|-------------------|-------|--------|
| Sparkassen-Triathlon Dortmund | 2026-09-20 | organiser site says **19 July 2026** (the spreadsheet's date may be the old Kanal course or a typo) | https://sparkassen-triathlon-dortmund.de/ |
| Hückeswagener Triathlon | 2026-06-21 | search results say "end of August 2026", matching 2025 (24 Aug) | https://www.triathlondeutschland.de/aktive/wettkaempfe/veranstaltungskalender/08-2025/40-hueckeswagener-triathlon |
| ITH-Hennesee-Triathlon | 2026-06-27 | a search hit is titled "Cancellation of the 17th ITH Hennesee Triathlon"; not read, so unclear what it refers to | https://www.ith.com/en/news/cancellation-of-the-17th-ith-hennesee-triathlon/ |

Consequence: the "only Dortmund is left in 2026" remark made earlier in this
project's chat rested on the sheet's Dortmund date and is probably wrong.

## 2027 result

15 dates confirmed, 3 tentative, 1 new event (Enni-Triathlon Moers), all in
`data/2027.json` with a `source_url` each. Checked, but no 2027 date found:
Stadtwerke-Ratingen-Triathlon (registration for 2027 is open, date not on the
page), Sparkassen Triathlon Dortmund, Stadtwerke Bochum-Triathlon, Covestro
Triathlon Krefeld, Weseler Sparkassentriathlon, Hückeswagener Triathlon,
Nibelungen-Triathlon Xanten (aggregators say "end of August"), Carglass Köln
Triathlon.

**Not searched at all:** Aachen, Gladbeck, Steinfurt, Gütersloh, Hagen,
Bielefeld, Petershagen (aggregator shows only "June 1–31"), Kamen, Rheine,
Minden, Goch, Siegburg, Hörstel, Höxter, Löhne, Willich, Vreden, Hilchenbach,
Kalkar-adjacent smaller races.

**Other events aggregators list that are not triathlons and were left out:**
Col d'Allrath (Grevenbroich, bike/run), Swim & Run Köln (aquathlon).

## Events not in the original spreadsheet (search on 2026-09-18)

**Added** (`data/2026.json`, ADR-0011): Menden Cross-Triathlon (29 Aug 2026), Wuppertaler
Sparkassen Crosstriathlon (20 Sep 2026) — both cross triathlons. Enni-Triathlon Moers
(2026 debut, 2027 date) was added earlier in `data/2027.json`.

**Leads not added — need a look:**

| Event | Why not added |
|-------|---------------|
| Stadtwerke Dinslaken Triathlon (TV Jahn Hiesfeld) | Held in past years (3rd edition 5 May 2024); the only 2026 date found (18 Sep) is on an aggregator and looks wrong. Adult class is 0.4/21.6/5.6 (roughly sprint). |
| Friesathlon Bonn-Friesdorf (5 Jul 2026, 17th edition) | "Fun triathlon" 0.5/11/8 km — below sprint distance |
| PSD Bank Triathlon Düsseldorf | Sprint/Olympic on the website, but nothing found showing it still runs (last dated result: 2023) |
| Dalkeman (Gütersloh) 2027 | One aggregator says 30 May 2027; not confirmed by the organiser |

**Deliberately excluded:** duathlons (Powerman Alsdorf/Würselen, Mettmann,
Hünsborn, Schleiden), aquathlons / swim-runs (Swim & Run Köln, Haaren, Haan,
Düsseldorf), kids-only events (Riesenbecker and Langenfelder Kindertriathlon),
Familientriathlon Düsseldorf, Eifel Hero Triathlon (discontinued since 2024) and
Raiffeisen Triathlon Hamm (Sieg), which is in Rhineland-Palatinate. "Bonn-Triathlon
Beuel" on one aggregator is the Bonn Triathlon itself (same day, same organiser).

**Further confirmation of a spreadsheet error:** hdsports also lists Dortmund on
19 Jul 2026, as the organiser does — the sheet's 20 Sep is wrong.

**Search limits:** the calendars read were hdsports (NRW, full 2026),
running.life, the NRW federation (partial view) and targeted searches;
triafreunde and ahotu returned no usable list. Small club events not on these
calendars can still be missing.
