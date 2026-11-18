# Campus Stores

Campus Stores is a Product Engineer work sample set at a fictional campus media equipment desk. Work through a club’s screening, from equipment pickup to a partial return and the next morning’s handover. Open **Candidate brief** in the app for the assignment.

## Run the app

Open `index.html` in a modern browser. The app includes its scripts, styles, and icons and can run offline.

To serve it over local HTTP, run this from the repository folder and visit `http://localhost:8000`.

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Each browser stores its own sample shift locally when browser storage is available. **Restart sample shift** restores the fictional starting records.

## Prototype: keep the kit together

The Film Society request opens by default. Its equipment checklist now connects pickup, partial returns, and the next shift in one view. The yellow scenario box includes design commentary for each stage.

### Walk through the change

1. **Pickup:** choose PR-04, SP-02 (or SP-05), and AD-12 (or AD-15). Select Kabir Sen and issue the three items together. All approved equipment must have an available unit selected, making the essential laptop adapter visible before pickup is finished.
2. **Partial return:** move to return time and record the projector and speaker returns within the kit. The summary shows **2 of 3 returned · 1 outstanding**. On the adapter, open **Add item handover**, select Leela Das, enter “Saturday, 9 am,” and save a note. This records the expected return separately from the original Friday deadline. Saved item handovers automatically appear in the Desk book’s **Next shift handover**, grouped by request. General notes added in Desk book appear in that same handover section, alongside item handovers; club messages stay below. Editing updates the same entry; clearing all details removes it. Returned items move into **Resolved item handovers**. The summary uses the loan records directly, so it stays consistent with the kit and persists across reloads.
3. **Morning:** move to the next morning. The adapter's exact asset ID, original collector, and saved handover remain visible, including after reloading. Match the physical adapter ID before recording its return. The kit shows **3 of 3 returned** and marks the item handover resolved.

### Product decision

Keep the individual physical-unit loan slips, inventory availability, and approval checks: partial returns need that precision. Add the request-level checklist and item-linked handover so staff can follow the whole job without reconstructing it across separate records. Existing single-slip issuing, the Desk book, and other club requests still work. The kit form issues only approved equipment types that have not yet been issued for the request; it validates every selection before saving any slips.

At a real counter, observe whether a new operator can identify and close the correct outstanding item without contacting the previous shift. Compare the number of clarification questions with the original workflow. This is a hypothesis to test, not a measured outcome.

The prototype still uses fictional records and browser-local storage. Handover information is entered by the operator; advancing scenario time does not issue or return equipment automatically. “Record return” still assumes staff have checked the physical unit and its condition.

## Source

- `index.html` contains the desk layout, candidate brief, and bundled icons.
- `app.js` contains the sample records and interactions.
- `styles.css` defines the desktop and mobile layouts.

Icon license notices are in [third-party/lucide-LICENSE.txt](third-party/lucide-LICENSE.txt).


## Submit your work

1. [Fork Campus Stores](https://github.com/virinchi-healthcare/campus-stores/fork) into your GitHub account. Complete the candidate brief and push your changes to your public fork. In your README, point reviewers to your work and explain the decision you made.
2. In your fork, open **Commits**, select the final commit you want reviewed, and copy the page URL. It should look like `https://github.com/YOUR-USERNAME/campus-stores/commit/COMMIT-SHA`.
3. [Submit your work through the Google Form](https://docs.google.com/forms/d/e/1FAIpQLScvzoh1R4WS-SkiwAVBQbMvniieJYSoOEfLMyVo5CyjOvYUgQ/viewform). Your **roll number**, **email ID**, and **final commit link from your public fork** are required. Enter your roll number and email ID in the form only.
