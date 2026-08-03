# SDLC Implementation Plan – Phase 3 (WMS)

## 1) Objectives
Phase 3 focuses on stabilizing and hardening the current Flask + SQLite Workforce Management System (WMS) by addressing the highest-risk gaps identified in Phase 2:

- **Security baseline**: enforce authentication across modules, introduce CSRF protection, and eliminate unsafe destructive actions.
- **UI/UX and template correctness**: fix URL-encoded/broken Jinja links, normalize template structure, and complete CRUD actions.
- **Database integrity and correctness**: enforce foreign keys, define delete behaviors, standardize date/time formats, and add uniqueness constraints.

## 2) Delivery Approach
- **Cadence**: 3 sprints, 2 weeks each (6 weeks total).
- **Method**: incremental, test-backed changes with clear acceptance criteria.
- **Environments**: local dev (SQLite) with production-safe config patterns (env vars).

## 3) Team & Responsibilities (Suggested)
- **Solution Architect / TPM**: roadmap, dependency management, acceptance criteria, release notes.
- **Backend Engineer**: Flask routes, decorators (auth/RBAC), security controls, DB integrity enforcement.
- **Frontend Engineer**: Jinja templates, navigation, form changes, UX consistency.
- **QA/Tester**: regression + smoke tests for auth/CSRF, CRUD flows, and integrity checks.

## 4) Roadmap, Sprint Breakdown, and Timeline

### Sprint 1 (Weeks 1–2): Security Baseline & Safe Operations
**Goal**: Ensure the app is safe-by-default (auth everywhere, CSRF on forms, safe deletes, secure config).

**Jira**: Parent **WMS-212**

#### Sprint 1 Work Items
- **WMS-215**: Enforce authentication on all routes + RBAC scaffolding
  - Apply `login_required` to all module routes and all create/update/delete endpoints.
  - Add `role` column to `users` (admin/manager/employee) with default `employee`.
  - Add minimal `@role_required(...)` decorator (admin-only for destructive actions).
- **WMS-216**: Add CSRF protection to all forms
  - Add Flask-WTF `CSRFProtect`.
  - Update all templates to include CSRF token for POST forms.
- **WMS-217**: Convert destructive actions from GET to POST and add confirmations
  - Replace `/delete_*` GET routes with POST endpoints (e.g., `/employees/<id>/delete`).
  - Ensure GET access returns 404/405 and nothing is mutated.
- **WMS-218**: Externalize SECRET_KEY and disable debug in production
  - Read `SECRET_KEY` and environment flags from environment variables.
  - Fail-fast in production when `SECRET_KEY` is not set.

**Definition of Done (Sprint 1)**
- Anonymous users are redirected to login for all module pages.
- All HTML forms include CSRF; invalid/missing token requests are rejected.
- Deletes are POST-only; no record is deleted via GET.
- App runs with configuration provided through environment variables.

---

### Sprint 2 (Weeks 3–4): UI/Template Fixes & CRUD UX Completion
**Goal**: Fix broken templates/navigation and complete end-user CRUD actions.

**Jira**: Parent **WMS-213**

#### Sprint 2 Work Items
- **WMS-219**: Repair templates (decode Jinja links + normalize HTML structure)
  - Fix URL-encoded Jinja tokens like `%7B%7B url_for(...) %7D%7D` across all templates.
  - Normalize templates to consistent header/nav/footer patterns.
  - Add a consistent flash message section.
- **WMS-220**: Add action controls and complete CRUD UX (edit/update + delete)
  - Add Edit/Delete controls to list pages (employees, shifts, attendance, tasks).
  - Implement edit/update routes + forms for Employees and Tasks (MVP).
  - Ensure delete uses POST + CSRF.
- **WMS-221**: Basic input validation + user feedback consistency
  - Server-side required-field validation.
  - Standardize flash messages and error display.

**Definition of Done (Sprint 2)**
- All templates render valid navigation links (no encoded Jinja artifacts).
- List pages show working Edit/Delete controls where applicable.
- Validation prevents empty/invalid submissions with clear feedback.

---

### Sprint 3 (Weeks 5–6): Database Integrity, Schema Hardening & Correctness
**Goal**: Prevent orphan data, enforce constraints, and standardize date handling.

**Jira**: Parent **WMS-214**

#### Sprint 3 Work Items
- **WMS-222**: Enable foreign keys and define ON DELETE behavior
  - Ensure `PRAGMA foreign_keys=ON` for every SQLite connection (update `database.py`).
  - Implement explicit ON DELETE policy (RESTRICT recommended; CASCADE if business approves).
- **WMS-223**: Standardize date/time fields + add attendance uniqueness constraint
  - Validate ISO-8601 `YYYY-MM-DD` dates.
  - Add DB constraint: `UNIQUE(employee_id, date)` to attendance.
  - Handle constraint errors gracefully with user-friendly messaging.

**Migration Approach (SQLite-safe)**
1. Create new table(s) with desired constraints.
2. Copy data with any required transformations.
3. Swap tables (rename) and recreate indexes.
4. Verify counts and integrity via queries.

**Definition of Done (Sprint 3)**
- FK enforcement enabled for all DB connections.
- No orphan records remain after deletions per defined policy.
- Attendance duplicates are prevented (DB constraint + app validation).

## 5) Dependencies
- CSRF relies on templates being updated to include tokens.
- POST-delete conversion relies on route and template changes.
- DB delete policy must be confirmed (RESTRICT vs CASCADE).

## 6) Risks & Mitigations
- **Template regressions** → smoke test each route; verify nav and forms.
- **SQLite schema changes** → backup DB; migration scripts; verification queries.
- **Auth/RBAC breaking flows** → minimal automated tests for redirects/403.

## 7) Test Plan (Minimum)
- Auth redirect tests for each module route.
- CSRF negative tests (missing/invalid token).
- CRUD smoke tests for employees/tasks.
- Integrity tests for delete behavior with dependent records.
- Attendance uniqueness test for duplicate employee/date.

## 8) Release Plan
- Merge to `main` at end of each sprint after QA signoff.
- Tag releases: `phase3-sprint1`, `phase3-sprint2`, `phase3-sprint3`.
- Update README with secure configuration/run instructions.
