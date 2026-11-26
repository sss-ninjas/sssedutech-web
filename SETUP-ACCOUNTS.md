# Student login, registration form, payment and invoice — setup

Everything is controlled from the `SITE` block at the top of `courses.js`.

## How it works now
1. Student adds course(s) to cart (or clicks **Buy now**) → **Proceed to checkout**.
2. If not logged in, a **Login / Create account** window opens (name, email, mobile, password).
3. After login, the **Student registration form** opens (prefilled; saved to the student's account for next time).
4. Student picks **UPI / Credit card / Debit card** and pays through Razorpay (only that method is shown).
5. After payment succeeds, the **invoice is generated automatically** (CGST+SGST for Karnataka students, IGST for other states),
   shown on screen with *Download / Print* (choose "Save as PDF"), and saved under **My account → My orders & invoices**.

## Go-live checklist
### A. Student accounts + saved invoices (Firebase, free plan is enough to start)
1. https://console.firebase.google.com → Add project → **Build → Authentication → Sign-in method → Email/Password → Enable**.
2. **Build → Firestore Database → Create database** (production mode), then open **Rules** and paste:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{db}/documents {
    match /users/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
      match /orders/{id} {
        allow read, create: if request.auth != null && request.auth.uid == uid;
        allow update, delete: if false;
      }
    }
    match /counters/invoice { allow read, write: if request.auth != null; }
  }
}
```
3. Project settings → **Your apps → Web app (</>)** → copy the config and paste into `SITE.firebase` in `courses.js`.
4. Authentication → Settings → **Authorized domains** → add `www.sssedutechsolutions.com` (and `sssedutechsolutions.com`).

### B. Payments (Razorpay)
1. Create a Razorpay account, complete KYC, copy the **Key ID** (`rzp_test_…` first, `rzp_live_…` later) into `SITE.razorpayKey`.
2. In the Razorpay Dashboard → Payment Methods, keep only **UPI** and **Cards** enabled (turn off Netbanking, Wallets, EMI, Pay Later).
3. Test with Razorpay's test UPI/card details before switching to the live key.

### C. Invoice details
Fill `SITE.company` (full address, **GSTIN**, state). If GSTIN is empty the document is titled "INVOICE" instead of "TAX INVOICE".
Confirm the GST rate, SAC code and invoice numbering with your accountant.

## Trying it without any accounts
Open `index.html` through a local server (e.g. `python -m http.server`) — on `localhost` the whole flow runs in **test mode**:
accounts are kept in your browser only, no money is charged, and invoices carry a TEST watermark.
On the live site test mode stays off unless you set `demoPayments: true`.

## Important limits (read this)
* This is a static site. The payment result is confirmed in the student's browser. For a fully tamper-proof setup, add a small server
  (e.g. Firebase Cloud Function) that creates the Razorpay order and verifies the payment signature/webhook before saving the invoice.
* Invoices are shown/printed on screen. Emailing the bill to the student needs a server side step (e.g. Firebase "Trigger Email" extension).
* Razorpay's `types: ["credit"|"debit"]` card filter should be confirmed in your Razorpay test mode.
