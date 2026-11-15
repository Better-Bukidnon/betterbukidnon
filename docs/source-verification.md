# Shared Source Verification Standard (BB-14)

Every civic record in BetterBukidnon (LGUs, barangays, officials, government offices, emergency contacts, demographics, and map coordinates) must follow this verification schema so visitors can distinguish confirmed official information from pending or historical records.

## Verification Statuses

| Status | Meaning | UI Presentation |
| --- | --- | --- |
| `verified` | Confirmed against an authoritative primary source or corroborated official records for the current term/census. | Green verified badge with source link and verification date |
| `pending_verification` | Current-term or current-period official record has not yet been confirmed online. | Neutral amber "Pending Verification" badge; never displays historical names as current |
| `historical` | Record from a prior term or earlier census (e.g., 2020 CPH, 2023–2025 barangay directory). | Muted "Historical" badge clearly stating the effective period/year |
| `unavailable` | Official record, seal, portrait, or public contact channel is not published or does not exist. | Neutral "Not Published" / fallback state |
| `disputed` | Authoritative or public sources conflict and require manual resolution. | Warning badge noting the discrepancy and citing both sources |

## Official Source Priority

1. **Tier 1 (Primary Statutory & Government Portals)**
   - Philippine Statistics Authority (`psa.gov.ph` — PSGC, POPCEN, CPH)
   - Department of the Interior and Local Government (`dilg.gov.ph`, `region10.dilg.gov.ph`)
   - Commission on Elections (`comelec.gov.ph`)
   - Provincial Government of Bukidnon (`bukidnon.gov.ph`)
   - Official City/Municipal Government websites (`*.gov.ph`)
2. **Tier 2 (Official Government Publications & Directories)**
   - DBM, DPWH, DOH, PNP, BFP, and Sanggunian published resolutions/ordinances
3. **Tier 3 (Corroborated Civic & Media References)**
   - Established national/regional news election trackers (Rappler, ABS-CBN, GMA, Inquirer, Metro CDO Dev)
   - Wikimedia Commons / Wikipedia (for seal attribution and coordinates, cross-checked against OSM)

## Source Reference Object Schema

```json
{
  "agency": "Philippine Statistics Authority (PSA)",
  "title": "PSGC Publication — Province of Bukidnon",
  "url": "https://psa.gov.ph/classification/psgc",
  "tier": 1,
  "publication_date": "2024-06-30",
  "effective_period": "2025–2028",
  "last_verified": "2026-11-15",
  "status": "verified",
  "scope": "LGU and barangay PSGC identifiers and counts"
}
```

## Rules

- Never fabricate names, titles, phone numbers, email addresses, coordinates, or government seals.
- Never publish personal phone numbers or private email addresses.
- Preserve original spellings, titles, and official designations.
- Keep source history when updating or correcting records (`source_history` array).
- Never mark a 2025–2028 LGU official as `verified` unless confirmed directly on an official `.gov.ph` LGU or national government portal; records compiled from secondary 2025 election results trackers must use `status: "pending_verification"` (Tier 3) until confirmed against an official LGU or DILG Region X directory.
- Barangay leadership sourced from the 2023–2025 DILG Region X Punong Barangay Directory must use `status: "historical"` (`term: "2023 - 2025"`) until current-term barangay rosters are officially published.
- Never publish mobile phone numbers (`09xx` / `+639xx`) in `data/contacts.json` unless verified on an official Tier-1 source as a permanent institutional agency line rather than an individual officer's personal phone.
