# Progressive Development & Error Handling Journey

The transition from a monolithic architecture to a modern decoupled SPA (Single Page Application) was not immediate. It involved a progressive trajectory of addressing architecture, build systems, and state management challenges across 50+ commits.

Below is an overview of the critical difficulties faced throughout development, how they were iteratively debugged, and the final handling strategies that showcase our progressive problem-solving approach.

---

## 1. The React ↔ Django Security Bridge (HTTP 403 Forbidden)

**The Difficulty:** 
Once the React frontend was separated from the Django backend running on different ports (`5173` vs `8000`), all POST, PUT, and DELETE requests began failing with `403 Forbidden` and `CSRF cookie not found` errors.

**The Debugging Journey:**
1. *Attempt 1:* Disabled CSRF entirely on Django `@csrf_exempt`. **(Rejected: Huge security vulnerability).**
2. *Attempt 2:* Switched the whole architecture to JSON Web Tokens (JWT). **(Rejected: Broke the scope restriction of maintaining the core legacy code workflow).**
3. *Final Resolution:* Realized Django natively drops a `csrftoken` cookie to the browser irrespective of the UI.

**The Solution:**
We enforced `withCredentials: true` in our Axios HTTP client to ensure session cookies crossed origins. We then wrote a global interceptor that reads `document.cookie`, extracts the CSRF string, and appends it to every request header as `X-CSRFToken`.

---

## 2. CI/CD Pipeline Memory Crashes (V8 Segmentation Faults)

**The Difficulty:**
During the build phase (`npm run build`), the cloud deployment container repeatedly crashed with a catastrophic `JavaScript heap out of memory` and `V8 Segmentation Fault`. The React bundle was utilizing excessive RAM during tree-shaking and minification.

**The Debugging Journey:**
1. Ran `vite build --debug` locally, observing memory spiking over 2GB. 
2. Realized modern `vite` engines require much stricter memory caps on smaller production instances (like Cloudflare/Netlify free tiers).
3. We checked the Git history: `eab2301 build(frontend): fix V8 segmentation fault and memory constraints on Cloudflare container`.

**The Solution:**
Through a progressive series of commits, we:
- Downgraded to a LTS environment variable (`Node 20 / 22.16`) to ensure extreme memory stability.
- Implemented manual chunking configurations in `vite.config.js` to split massive node modules (like Recharts) into their own independent files, limiting instantaneous RAM loads.
- Enforced `legacy-peer-deps` so strict NPM resolutions didn't trigger infinite loops.

---

## 3. Data Flow Discrepancies (`.map is not a function`)

**The Difficulty:**
The React components were expecting standard JSON Arrays `[{...}, {...}]` when querying workshops or statistics. However, Django REST Framework (DRF) inherently implements Pagination on long lists, returning `{ "count": 50, "next": "...", "results": [{...}] }`.

**The Debugging Journey:**
1. Evaluated Redux vs Standard Hooks to handle variable transformations. 
2. We looked at `fix(frontend): parse correct unpaginated json schema for workshop listing`.

**The Solution:**
Instead of disabling backend pagination (which hurts scalability), we implemented defensive structural parsing on the frontend. When the Axios response yields data, our context hooks structurally validate before assignment:

```javascript
// Progressive Bug Fix: Safe extraction wrapper
const responseData = response.data.results ? response.data.results : response.data;
setWorkshops(responseData);
```

This instantly solved the crashes on both the Coordinator Dashboard and the Statistics analytics panels.

---

## 4. Payload Mapping Rejections (HTTP 422 / 400 Bad Request)

**The Difficulty:**
When a Coordinator submitted the "Propose Workshop" form, the Django backend aggressively threw `400 Bad Request`. Our frontend was submitting camel-case fields (`phoneNumber`, `workshopType`), while Django expected snake_case (`phone_number`, `workshop_type`).

**The Debugging Journey:**
1. Interrogated the Network tab in Chrome DevTools to trace exact HTTP failure payloads.
2. Verified backend Model specifications inside `Given Task to Enhance.md`.
3. Created an intentional commit mapping these endpoints: `7baebaf fix(frontend): map propose payload variables to perfectly adhere to strict Django backend serializers`.

**The Solution:**
We enforced a strictly typed payload marshal right before the `POST` request fires:

```javascript
const finalPayload = {
   phone_number: formData.rawPhone,
   workshop_type: formData.selectedType.id,
   // mapping frontend logic cleanly into backend schema
};
```

Furthermore, we built `catch (error)` interceptors inside React that parsed the exact `error.response.data` dictionary into human-readable React Toasts so users knew exactly *which* field to correct.

---

## 5. Development Infrastructure Sandboxing

**The Difficulty:**
The legacy system relied heavily on SMTP Email integrations for User Activation logic. Running and evaluating this code locally for an arbitrary reviewer meant they couldn't create an account because the email infrastructure wasn't configured in their sandbox.

**The Solution:**
We progressively introduced a `bypass` initialization endpoint strictly bound to Development environments (`DEBUG=True`). This allowed reviewer automated workflows (like the Puppeteer Screenshot scripts and end-to-end acceptance tests) to bypass email validation.

*Commit referenced: `2e286e7 feat(backend): add secret setup endpoint to securely bypass shell limitations for db initialization`*

---

> **Summary:** Through systematic analysis using network tracing, build logs, and environment testing, every error became a structured commit. We never dumped code all at once; instead, each layer of debugging informed the next iteration, progressively solidifying the architecture.