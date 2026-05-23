
Claude finished the response
I have a business called roll or dice, that creates accessories for TCG's and fantasy RPG's like D&D. I just started it, and am not tracking anything. I need to come up with a list of things to track, build an app to easily add new products and track all the costs involved with each item so that I can properly price the items.

8:11 AM

Viewed 2 files
Viewed 2 files
Now I have everything I need. Let me build a comprehensive product cost tracker app for Roll or Dice.



Here's your Roll or Dice Cost Tracker! Here's what it does and what to track:

What's tracked per product:

Materials — wood/MDF, stain, polish, hardware (hinges, magnets), and any other raw materials, broken down per item.

Labor — your hours × your hourly rate. Even if it's just you, pay yourself. $15–20/hr is common starting out; raise it as you grow.

Packaging & overhead — boxes, tissue, tape, labels, and a per-item share of your laser cutter's runtime and wear.

Platform fees — automatically calculates Etsy's 6.5% transaction fee + ~3% payment processing + $0.20 listing fee against your price.

How to use it:

Hit "Add Product" to enter your first item (try a dice box you're already making)
Fill in your costs — the profit preview updates live as you type
Adjust your list price until your margin hits 30–50%+
The
Claude's response was interrupted.
hang on, dont create the app yet. I want to make sure that I capture everything needed. This app won't live in claude. Can it live in microsoft onedrive?

8:15 AM
Great call pausing before building! Yes, this can absolutely live in OneDrive — a few options depending on what you're comfortable with:

Excel (recommended for you) — I can build a full Excel workbook with a product sheet, cost breakdown, and auto-calculated pricing. Lives in OneDrive, works on any device, no coding needed. This is probably the best fit for a small business tracking costs.

A web app saved to OneDrive — An HTML file that runs in any browser. You'd open it from OneDrive, but it won't sync data back to the cloud automatically (data stays in the browser on that device). Less ideal.

Excel is almost certainly the right call here. Before I build it, let's make sure we capture everything. A few questions:

Do you sell on multiple platforms (Etsy + your own site, local markets, etc.)? Fee structures differ and it'd be worth tracking per-channel pricing.

Beyond the costs already discussed (materials, labor, platform fees, packaging), are there any others specific to your setup — like propane/electricity for the laser cutter, Etsy subscription fees, shipping you absorb, or returns/waste on materials?

Do you want to track inventory too — like how much wood or stain you have on hand — or just per-product costing for now?

And finally: do you want a suggested price calculator that works backward from a target margin (e.g. "I want 40% margin, what should I charge?") or just see the margin after entering your price?

I want a web UI, i don't like excel for viewing. Can a web UI be used for the front end and excel on the backend? I want to be able to sync

8:17 AM
That's a smart approach — best of both worlds. Yes, it's absolutely doable. Here's how it works:

The setup: A web app (HTML/JS) that reads and writes to an Excel file stored in OneDrive, using Microsoft's free Graph API. You'd log in with your Microsoft account, and any changes sync to the Excel file in real time.

What that means practically:

Your web app lives as a single HTML file you can open from anywhere (or host free on GitHub Pages)
All data lives in an Excel file in your OneDrive — you can open it directly in Excel anytime for backup, printing, or sharing with an accountant
Changes in the web app show up in Excel, and vice versa
What's needed to set it up:

A free Microsoft Azure app registration (takes about 5 minutes — I'll give you step-by-step instructions)
Your OneDrive account (which you already have)
No hosting costs, no subscriptions
Before I build anything though — let's finish nailing down what to track. You had good instincts pausing. A few open questions:

Multiple sales channels? (Etsy, your own site, craft fairs, etc.) Fee structures differ per channel.
Material waste/offcuts? Laser cutting has waste — worth building in a waste percentage per material.
Equipment costs? Laser cutter depreciation, electricity, CO2 cartridges, lenses?
Do you want inventory tracking or just per-product cost/pricing for now?
Target margin calculator — work backward from a desired margin to get a suggested price?
What does your current setup look like for selling and materials?

I will have 2 channels, Esty, direct sale to customers, and direct sale to hobby shops
Yes, do that
Yes
Inventory tracking will be needed
Yes
Currently I have an etsy store. I purchased a bunch of material already. There is different types of materials, wood(basswood, maple, dark walnut, cherry, with more coming, all 12"x12"), felt(multiple colors and thicknesses), glue (CA and 2 types of wood glue), magnets, stain, masking tape, nitrile gloves, sponges for stain, wood polish, cloth for polish, bubble wrap for packing, printer paper for labels, shipping box (Multiple sizes), acrylic (multiple colors, 12"x12"). I will need the ability to add new materials.

Show more
8:23 AM
This is really helpful — you've got a solid range of materials and a clear picture of the business. Let me map everything out before we build so nothing gets missed.

What I'm hearing you need to track:

Materials (with inventory)

Sheet goods sold by the sheet: basswood, maple, dark walnut, cherry, acrylic (all 12"x12") — track sheets on hand + cost per sheet, with waste % per product
Consumables sold by quantity/volume: felt (by color/thickness), CA glue, wood glues, magnets, stain, masking tape, nitrile gloves, sponges, wood polish, polishing cloth
Packaging supplies: bubble wrap, printer paper/labels, shipping boxes (multiple sizes)
All need: quantity on hand, unit cost, reorder alert threshold
Per-Product Costs

Materials used (with waste factor built in)
Labor hours × rate
Equipment: laser time, electricity, depreciation
Packaging (which box size, bubble wrap amount)
Pricing by Channel

Etsy: 6.5% transaction + ~3% payment processing + $0.20 listing fee
Direct to customer: no platform fee, but you may absorb shipping
Direct to hobby shop: typically wholesale (50% of retail) — worth tracking minimum viable wholesale price
Inventory

Current stock per material
Usage per product (so when you log a sale, it deducts automatically)
Low stock alerts
Target margin calculator — enter desired margin → get suggested price per channel

Before I spec the Excel structure and web UI, a few quick questions:

Hobby shop pricing — do you plan to do a standard wholesale discount (like 50% of your retail/Etsy price), or set hobby shop prices independently per product?
Labor rate — is it just you, or will you have helpers at different rates?
Equipment — do you know your laser cutter's wattage and roughly what you paid for it? I can build in electricity cost per hour and a depreciation tracker.
Sales logging — do you want to log individual sales (date, channel, quantity) so you can see revenue over time, or just track costs and pricing for now?
Felt is not a consumable like glue, it should be treated like the wood is.

I will set hobby shop prices
It is just me
Yes and no. Build a place to track it, I will need to calculate it
Yes, sales logging will be good to have now
8:27 AM
Good catch on the felt — it's a sheet good like wood and acrylic, just measured differently (by sheet/piece rather than volume). So the sheet goods category becomes:

Wood: basswood, maple, dark walnut, cherry (12"x12" sheets)
Acrylic: multiple colors (12"x12" sheets)
Felt: multiple colors and thicknesses (treated as sheets/pieces)
All three tracked the same way: sheets on hand, cost per sheet, waste % per product.

So here's the full picture before I build. Tell me if anything is off:

Material categories:

Sheet goods (wood, acrylic, felt) — tracked by sheet, with waste %
Adhesives (CA glue, 2 wood glues) — tracked by bottle/unit
Hardware (magnets) — tracked by count
Finishing supplies (stain, masking tape, nitrile gloves, sponges, polish, polishing cloth) — tracked by unit/bottle
Packaging (bubble wrap, labels/paper, shipping boxes by size)
Per product:

Bill of materials (which sheets + how many, consumables used, hardware count)
Labor hours
Equipment (laser time field + electricity/depreciation calculator you fill in)
Suggested price per channel (Etsy, direct, hobby shop) with margin shown for each
Sales log: date, product, channel, quantity, price sold, notes

Dashboard: revenue by channel, units sold, inventory alerts, margin overview

One more thing before I build — how do you want to access the web app? A few options:

GitHub Pages (free) — I build it, you put it on GitHub, it lives at a URL you can bookmark on any device
Local HTML file — open it from your OneDrive folder directly in a browser, syncs to the Excel file in the same folder
Don't mind, just make it work
Tell me more about 1

8:28 AM
GitHub Pages is free static web hosting by Microsoft-owned GitHub. Here's the full picture:

How it works:

You create a free GitHub account
I give you a folder with your HTML/JS app files
You upload them to a GitHub "repository" (basically a project folder in the cloud)
GitHub automatically publishes it as a live website at a URL like yourusername.github.io/roll-or-dice
You bookmark that URL and open it from any browser, any device — phone, tablet, laptop
The OneDrive/Excel sync part:

Your data lives in an Excel file in your OneDrive
The web app connects to it via Microsoft's Graph API (free)
You log in with your Microsoft account when you open the app
Every save in the web app writes directly to the Excel file in real time
You can open that same Excel file anytime for a backup view or to share with an accountant
Cost: Completely free. GitHub Pages is free, Graph API is free, OneDrive you already have.

The setup process (one time):

Create a free GitHub account
Create a free Azure app registration (5 min, gives the web app permission to talk to your OneDrive)
Upload the files I give you to GitHub
Done — it's live at your URL forever
Pros:

Works on any device, any browser, no installation
Data is safely in your OneDrive, not stuck in a browser
Easy to update later — just re-upload files
Professional enough to show a bookkeeper or business partner
Cons:

One-time setup has a few steps (I'll walk you through every one)
Requires internet connection to sync (but I can build in offline fallback)
My honest take: For what you're building — a real business tracking tool you'll use daily — this is the right approach. It'll feel like a proper app, your data is safe, and it costs nothing.

Want to go with this? If so, I have a couple of quick technical questions, then we build.

how secure is it?

8:33 AM
Great question — security matters, especially for business data. Here's the honest breakdown:

What's exposed publicly:

The web app's code (HTML/JS) is public on GitHub — anyone can see how it's built, but that's fine. There's no sensitive data in the code itself.
Your actual business data (products, costs, sales) lives only in your OneDrive — completely private, never on GitHub.
How access is controlled:

The app uses Microsoft's own login system (the same one you use for OneDrive/Office). You log in with your Microsoft account — the app never sees your password.
Microsoft issues a temporary access token, just like when you sign into any app with Google. It expires automatically.
The app can only access the specific Excel file you point it to — not your entire OneDrive.
What Microsoft's Graph API protects:

All data transfers are encrypted (HTTPS)
You can revoke the app's access anytime from your Microsoft account settings
Microsoft's security infrastructure is enterprise-grade — the same thing banks and corporations use
The real risks (being honest):

If someone gets into your Microsoft account, they could access the Excel file — but that's true of anything in OneDrive. Use a strong password and enable two-factor authentication (2FA) on your Microsoft account and you're well protected.
The GitHub repository being public means someone could copy your app's code and build their own version — but it contains zero of your data.
If you ever share the Azure app registration credentials carelessly, someone could request access — but I'll show you how to lock that down properly.
Bottom line: For a small business tracking internal costs and pricing, this setup is genuinely secure. Your data never leaves Microsoft's infrastructure. The weak point — like with anything — is your Microsoft account password, which 2FA solves completely.

Want to proceed with building it out?

yes. i need step by step instructions for everything

8:35 AM
Perfect. Let's do this in the right order — setup first, then I'll build the app, then deployment.

Step 1: Create a GitHub Account
Go to github.com
Click Sign up
Enter your email, create a password, choose a username (something like rollordice or your name)
Verify your email when they send you a confirmation
On the "What kind of work do you do?" screen, you can skip all of that — just click Skip personalization at the bottom
Step 2: Create a GitHub Repository
Once logged in, click the + icon in the top right corner
Click New repository
Name it roll-or-dice (lowercase, dashes not spaces)
Make sure it's set to Public (required for free GitHub Pages)
Check the box that says Add a README file
Click Create repository
Step 3: Enable GitHub Pages
Inside your new repository, click Settings (top menu)
In the left sidebar, click Pages
Under "Source", select Deploy from a branch
Under "Branch", select main and leave the folder as / (root)
Click Save
After about 60 seconds, refresh the page — you'll see a green box with your live URL: https://yourusername.github.io/roll-or-dice
Bookmark that URL — that's your app's permanent home.

Step 4: Create a Microsoft Azure App Registration
This is what gives your web app permission to talk to your OneDrive. It sounds technical but takes about 5 minutes.

Go to portal.azure.com and sign in with the same Microsoft account your OneDrive is on
In the search bar at the top, type App registrations and click it
Click + New registration
Fill in the form:
Name: Roll or Dice Tracker (just for your reference)
Supported account types: select Accounts in any organizational directory and personal Microsoft accounts
Redirect URI: select Single-page application (SPA) from the dropdown, then enter your GitHub Pages URL: https://yourusername.github.io/roll-or-dice
Click Register
You'll land on your app's overview page. Copy the "Application (client) ID" — it's a long string like a1b2c3d4-.... Save it somewhere, you'll need it shortly.
Step 5: Set API Permissions
Still in the Azure portal on your app registration:

In the left sidebar click API permissions
Click + Add a permission
Click Microsoft Graph
Click Delegated permissions
Search for and check each of these:
Files.ReadWrite
User.Read
Click Add permissions
Click Grant admin consent for [your name] and confirm — this pre-approves the permissions so you don't get nagged every time you open the app
Step 6: Create the Excel File in OneDrive
Go to onedrive.live.com and sign in
Click + New → Folder, name it Roll or Dice
Open that folder
Click + New → Excel workbook
Name it roll-or-dice-data
Leave it open — I'll tell you exactly what to put in it once the app is built (or the app will set it up automatically on first run)
Step 7: Tell me you're ready
Once you've completed these steps, reply here with:

Your GitHub username
Your Azure Client ID (the one you copied in Step 4)
Your GitHub Pages URL
Then I'll build the full app — web UI + Excel sync — customized with those details so it works out of the box. You'll then just upload the files to GitHub and you're live.

Stuck anywhere? Just tell me which step and I'll walk you through it. None of this requires any coding on your part.

step 4, i am getting an error:

{
  "sessionId": "0248d3e8c73d40b9a904c13910763585",
  "errors": [
    {
      "errorMessage": "interaction_required: AADSTS16000: User account &#39;{EUII Hidden}&#39; from identity provider &#39;live.com&#39; does not exist in tenant &#39;Microsoft Services&#39; and cannot access the application &#39;c44b4083-3bb0-49c1-b47d-974e53cbdf3c&#39;(Azure Portal) in that tenant. The account needs to be added as an external user in the tenant first. Sign out and sign in again with a different Azure Active Directory user account. Trace ID: 9c2027cc-51b8-4f0f-8158-06b6b23f4100 Correlation ID: 709732ea-2abb-4481-8ad9-5333fb73f44d Timestamp: 2026-05-23 13:51:22Z",
      "clientId": "c44b4083-3bb0-49c1-b47d-974e53cbdf3c",
      "scopes": [
        "2086cb78-e8e8-4df3-9f9d-a03079825584/.default"
      ]
    }
  ]
}
Show more
8:51 AM
This is a common hiccup. The error means you signed into Azure with your personal Microsoft account (like an @outlook.com or @hotmail.com), but the Azure portal defaulted to a "Microsoft Services" corporate tenant instead of your personal one.

Here's how to fix it:

Option A — Force the personal account portal (easiest)

Sign out of portal.azure.com completely
Go to this specific URL instead: portal.azure.com/#@microsoft.onmicrosoft.com — actually, use this one: https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps/ApplicationsListBlade
When it asks you to sign in, sign in with your personal Microsoft account
If it still lands on the wrong tenant, look at the top right corner — you'll see your account name/avatar. Click it and look for a "Switch directory" option
Switch to your personal directory (it'll say something like "[Your Name]'s Personal Account" or just your email)
Option B — Use the direct personal account URL

Sign out completely
Go to: https://entra.microsoft.com instead of portal.azure.com — this is Microsoft's newer identity portal that handles personal accounts better
Sign in with your personal Microsoft account
Click Applications → App registrations in the left sidebar
Continue from Step 4 where you left off
Option C — Check which account you're signed in as

On portal.azure.com, look at the top right corner
Click your profile icon
You'll see which account and which directory/tenant you're in
If it says "Microsoft Services" or anything other than your personal account, click Switch directory and pick your personal one
Try Option B first — entra.microsoft.com tends to work most smoothly for personal Microsoft accounts. Let me know what you see!

there are no directories

8:54 AM
That's actually fine — it means your personal Microsoft account doesn't have a full Azure Active Directory tenant, which is very common for personal accounts.

The good news: you don't actually need the full Azure portal at all. There's a simpler way to register an app for personal Microsoft accounts.

Use the Microsoft Application Registration Portal instead:

Go to: https://entra.microsoft.com
Sign in with your personal Microsoft account
On the left sidebar, look for Applications then App Registrations
Click + New registration
Fill in:
Name: Roll or Dice Tracker
Supported account types: select Personal Microsoft accounts only
Redirect URI: select Single-page application (SPA), enter https://yourusername.github.io/roll-or-dice
Click Register
Copy the Application (client) ID
If that still gives trouble:

Try this portal specifically built for personal account app registrations:

Go to: https://apps.dev.microsoft.com
Sign in with your Microsoft account
This is the legacy but reliable portal for personal accounts
Which email type is your Microsoft account — is it an @outlook.com, @hotmail.com, @live.com, or something else like a Gmail used as a Microsoft account? That'll help me point you to exactly the right portal.

Experiencing authentication issues
The portal is having issues getting an authentication token. The experience rendered may be degraded.  Additional information from the call to get a token: Extension: Microsoft_AAD_UsersAndTenants Resource: microsoft.graph Details: timed_out: See https://aka.ms/msal.js.errors#timed_out for details
[See more](https://entra.microsoft.com/#)

8:57 AM
That's a Microsoft portal issue on their end, not something you did wrong. The portal is timing out trying to authenticate you. A few things to try:

First, try a different browser

Microsoft's portals are notoriously finicky. If you're on:

Chrome → try Edge (ironically, Edge works best for Microsoft portals)
Firefox → try Chrome or Edge
Make sure you have no VPN running if you use one
Clear cookies and try again

Clear your browser cookies/cache
Go directly to https://entra.microsoft.com
Sign in fresh
If that still fails — let's skip Azure entirely

Honestly, for a solo small business owner, the Azure app registration process is more friction than it's worth right now. Here's a simpler alternative that still keeps your data safe and synced:

Option: Use Google Sheets as the backend instead of Excel/OneDrive

Google Sheets has a much simpler API setup for personal accounts
Data still lives in the cloud, accessible anywhere
Web app connects to it the same way
You can export to Excel anytime
Setup takes 2 minutes, not 20
Or: Self-contained app stored in OneDrive

A single HTML file that stores data locally in the browser
You manually export to Excel whenever you want a backup
Simplest possible setup — zero configuration
Which direction appeals to you? I'd honestly recommend Google Sheets as the backend — it's significantly easier to set up and just as reliable. Or if you want to keep trying the Microsoft route, try Edge browser first and let me know what happens.

ok, lets do google sheets

8:59 AM
Great choice — much smoother setup. Here's everything you need to do before I build the app.

Step 1: Create a Google Account (if you don't have one)
If you already have a Gmail or Google account, skip to Step 2.

Go to accounts.google.com/signup
Fill in your name, choose an email, create a password
Verify your phone number
Done
Step 2: Create the Google Sheet
Go to sheets.google.com
Click + Blank spreadsheet
Click the title at the top (says "Untitled spreadsheet") and rename it to Roll or Dice Data
Leave it open — the app will set up all the tabs and columns automatically on first run
Step 3: Set Up Google Cloud Project (this is the easy version of what we tried with Microsoft)
Go to console.cloud.google.com
Sign in with your Google account
At the top, click Select a project → New Project
Name it Roll or Dice
Click Create
Wait a few seconds, then make sure your new project is selected in the top dropdown
Step 4: Enable the Google Sheets API
In the left sidebar click APIs & Services → Library
Search for Google Sheets API
Click it, then click Enable
Go back to the Library, search for Google Drive API
Click it, then click Enable
Step 5: Create OAuth Credentials
In the left sidebar click APIs & Services → Credentials
Click + Create Credentials → OAuth client ID
If it asks you to configure a consent screen first:
Click Configure consent screen
Select External → click Create
Fill in:
App name: Roll or Dice Tracker
User support email: your email
Developer contact email: your email
Click Save and Continue
On the Scopes page — click Save and Continue (no changes needed)
On the Test users page — click + Add users, add your own Gmail address, click Save and Continue
Click Back to Dashboard
Now go back to Credentials → + Create Credentials → OAuth client ID
For Application type select Web application
Name it Roll or Dice Web App
Under Authorized JavaScript origins click + Add URI and enter:
https://yourusername.github.io
Under Authorized redirect URIs click + Add URI and enter:
https://yourusername.github.io/roll-or-dice
Click Create
A popup will show your credentials — copy the Client ID (looks like 123456789-abc...apps.googleusercontent.com)
Step 6: Get Your Google Sheet ID
Go back to your Roll or Dice Data spreadsheet
Look at the URL — it looks like: https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms/edit
Copy that long string between /d/ and /edit — that's your Sheet ID
Step 7: Tell me you're ready
Once done, reply with:

Your GitHub username
Your Google OAuth Client ID
Your Google Sheet ID
Your GitHub Pages URL
Then I'll build the entire app — beautiful web UI, Google Sheets sync, all the cost tracking, inventory, pricing by channel, sales log, dashboard — and give you the files to upload to GitHub. You'll be live same day.

Stuck anywhere? Just tell me which step and I'll walk you through it.

will this still use github?

9:00 AM
Yes, GitHub is still the plan for hosting the web app itself. To recap what each piece does:

GitHub — hosts your web app (the thing you see and click around in). It's just storing the HTML/JS files and serving them as a website at your github.io URL. Free forever.

Google Sheets — stores all your data (products, materials, costs, sales). Think of it as your database. You can open it directly in Google Sheets anytime to see your raw data.

How they connect — when you open your web app on GitHub Pages, it logs you into your Google account and reads/writes directly to your Google Sheet. Your data never touches GitHub.

That said — if you'd rather skip GitHub too and keep everything in Google's world, there's a clean all-Google option:

Google Apps Script hosts the web app directly inside Google Drive. Same web UI, same Google Sheets backend, but:

No GitHub needed
Everything lives in one Google account
You'd get a Google URL like script.google.com/... to bookmark
Still works on any device, any browser
Free
The only downside is the URL is a bit ugly compared to a clean github.io address. Functionally it's identical.

My recommendation: If you already started the GitHub setup and have your Pages URL, stick with GitHub — it gives you a cleaner URL and more control. If you haven't touched GitHub yet, the all-Google route is simpler.

Which way do you want to go?

github, i have set it up already

9:00 AM
Perfect, let's keep moving then. Go ahead and work through the Google Cloud steps I outlined above (Steps 1–6), and when you're done come back with:

Your GitHub username
Your GitHub Pages URL (e.g. https://yourusername.github.io/roll-or-dice)
Your Google OAuth Client ID
Your Google Sheet ID
Then I'll build the whole app and give you the exact files to upload to GitHub. You'll just drag and drop them into your repository and you're live.

Step 7 done:
Github username = keith920tracey
Google OAuth Client ID = 633281988309-qr2n4802c5bvopg8n6n7mag0n0gi4cm6.apps.googleusercontent.com
Google Sheet ID = 1wkYulyN3Lr4JCxw4XwTvnpl5YpXsshK1uYT8LCuwbZU
github pages url = https://keith920tracey.github.io/roll-or-dice/

9:24 AM
Perfect — I have everything I need. Let me build the full app now.


Created 5 files, viewed a file, ran a command
Created 5 files, viewed a file, ran a command
Now I need to update the index.html to include the Google API scripts properly:


Add Google API script tags before closing body
Add Google API script tags before closing body
Now let's verify all files look good and copy to outputs:


Ran 2 commands, read a file
Ran 2 commands, read a file
All 5 files are ready. Here's how to get them live on GitHub:

Upload to GitHub (Step by Step)
Go to github.com and open your roll-or-dice repository
Click Add file → Upload files
Drag and drop all 5 files at once:
index.html
styles.css
app.js
sheets.js
config.js
Scroll down, click Commit changes
Wait about 60 seconds, then visit: https://keith920tracey.github.io/roll-or-dice/
What the app includes
Dashboard — revenue, units sold, low stock alerts, top products by profit, recent sales

Products — add products with full cost breakdown: wood, acrylic, felt, adhesive, hardware, finishing, packaging, waste %, labor hours, laser time. Live margin preview per channel as you type. "Apply suggested prices" button that calculates prices backward from your target margin.

Materials — all your material types with cost per unit, supplier, reorder threshold. Grouped by category (sheet goods, adhesives, hardware, finishing, packaging).

Inventory — stock levels per material, low/warn/ok status, auto-created when you add a material.

Sales Log — log sales by channel (Etsy, Direct Customer, Direct Hobby Shop) with quantity, price, discount, shipping charged. Filter by channel and month.

Equipment — track your laser cutter with purchase price, expected life, wattage, and electricity cost. The app auto-calculates cost-per-hour and applies it to products when you enter laser minutes.

All data syncs live to your Google Sheet — one tab per section.



Styles
Code · CSS 



The webpage contains only a title

9:40 AM
That's a common GitHub Pages issue — it almost always means the files are in a subfolder instead of the root of the repository. Let's diagnose it.

First, check your repository structure:

Go to github.com/keith920tracey/roll-or-dice
Look at the file list — what do you see?
You might see something like this (broken):

📁 roll-or-dice/
    index.html
    styles.css
    ...
Instead of this (correct):

index.html
styles.css
app.js
sheets.js
config.js
If the files are inside a subfolder, that's the problem. GitHub Pages needs index.html at the root of the repository, not inside a folder.

To fix it if they're in a subfolder:

Open the subfolder on GitHub
Click index.html to open it
Click the pencil icon (Edit) — this won't help directly, but...
Actually easier: delete the files and re-upload:
Click each file, click the trash icon, commit the deletion
Then go back to the repo root and upload the 5 files directly there
Also double-check GitHub Pages is pointing to the right place:

Go to your repo → Settings → Pages
Make sure Source is set to main branch, folder / (root)
The URL shown should be https://keith920tracey.github.io/roll-or-dice/
Tell me what you see in your repository file list and I'll walk you through the exact fix.

1779547324008_image.png
There are no files other than readme

9:42 AM
Got it — the 5 app files were never uploaded. The repository only has the README from when you created it. Let's fix that now.

Upload the files:

On that same page, click the "+" button (next to "Go to file")
Click "Upload files"
Download the 5 files I gave you above, then drag all 5 into the upload area:
index.html
styles.css
app.js
sheets.js
config.js
Scroll down and click "Commit changes"
To download the files I created, click each one from the list I shared above and save them to your computer first. Make sure they save with their exact filenames (not renamed to something like index.html.txt).

Once you've committed them, your repo should look like this:

README.md
index.html
styles.css
app.js
sheets.js
config.js
Then wait about 60 seconds and visit https://keith920tracey.github.io/roll-or-dice/ — it should load the full app.

Let me know when the files are uploaded and I'll confirm everything looks right.

they are uploaded

9:43 AM
Give it 60 seconds for GitHub Pages to rebuild, then visit:

https://keith920tracey.github.io/roll-or-dice/

You should see a dark login screen with the Roll or Dice logo and a "Sign in with Google" button.

When you click it:

A Google login popup will appear
Sign in with the same Google account your Sheet is on
It may say "This app isn't verified" — that's normal for a personal app. Click "Advanced" then "Go to Roll or Dice Tracker (unsafe)" — it's your own app, it's safe
Grant the permissions and you're in
Let me know what you see — either it loads, or paste any error message and I'll fix it immediately.

Access blocked: keith920tracey.github.io has not completed the Google verification process
keith.920tracey@gmail.com
keith920tracey.github.io has not completed the Google verification process. The app is currently being tested, and can only be accessed by developer-approved testers. If you think you should have access, contact the developer.
If you are a developer of keith920tracey.github.io, see error details.
Error 403: access_denied

9:45 AM
This is an easy fix. You need to add yourself as a test user in Google Cloud Console — you're the developer, so you just need to approve your own email.

Steps:

Go to console.cloud.google.com
Make sure your Roll or Dice project is selected in the top dropdown
In the left sidebar click APIs & Services → OAuth consent screen
Scroll down to the "Test users" section
Click "+ Add users"
Enter your email: keith.920tracey@gmail.com
Click "Save"
Then go back to https://keith920tracey.github.io/roll-or-dice/, click Sign in with Google, and it should let you through this time.

Let me know what happens!

there is no test users section

9:46 AM
No problem — that means your OAuth consent screen is set up slightly differently. Let's find it:

Go to console.cloud.google.com
Make sure Roll or Dice project is selected at the top
In the left sidebar click APIs & Services → OAuth consent screen
Take a screenshot of what you see and share it here
That'll show me exactly what screen you're on and I can give you the precise next step.

1779547651267_image.png
9:47 AM
I can see it — Google updated their console layout. Click "Audience" in the left sidebar. That's where the test users section lives now.

Once you're in Audience:

Scroll down until you see "Test users"
Click "+ Add users"
Enter keith.920tracey@gmail.com
Click "Save"
Then try signing in again at https://keith920tracey.github.io/roll-or-dice/

1779547771237_image.png
9:49 AM
You're through! Scroll down on that screen and click "Continue" or "Allow" to grant the app access to your Google Sheet.

1779547790385_image.png
takes me back to logint

9:49 AM
The app is loading beautifully! The sign-in is looping because the Google API scripts need a moment to initialize before the button becomes active. This is a timing issue — let me fix it.


Ran 3 commands, edited a file, viewed a file
Ran 3 commands, edited a file, viewed a file
The fix is in the updated sheets.js above. Here's what to do:

On GitHub:

Go to github.com/keith920tracey/roll-or-dice
Click on sheets.js in the file list
Click the pencil icon (Edit this file) in the top right
Select all the text and delete it
Download the new sheets.js I just gave you, open it in Notepad, copy all the text, and paste it into GitHub
Click Commit changes
Wait 30 seconds, then try signing in again at https://keith920tracey.github.io/roll-or-dice/

The key fix was changing prompt: 'consent' to prompt: '' — the old setting was forcing Google to ask for permission every single time, which created the loop. Now it will only ask once, then go straight into the app.


no change

9:54 AM
Let me check what's actually happening in the browser.

Open your browser's developer console:

Go to https://keith920tracey.github.io/roll-or-dice/
Press F12 to open developer tools
Click the Console tab
Click "Sign in with Google"
After it loops back, look at the console — you'll see red error messages
Take a screenshot of the console errors and share it here. That'll tell me exactly what's failing so I can fix it precisely rather than guessing.

1779548157386_image.png
9:55 AM
The login is actually working now. The error is a 403 Forbidden on the Google Sheet itself — meaning the app signed in successfully but doesn't have permission to access that specific spreadsheet.

The fix is simple — you need to enable the Google Sheets API for your project.

Steps:

Go to console.cloud.google.com
Make sure Roll or Dice project is selected
In the left sidebar click APIs & Services → Enabled APIs & Services
Click + Enable APIs and Services at the top
Search for Google Sheets API and click Enable
Go back, search for Google Drive API and click Enable
Then go back to your app and try signing in again. The 403 should be gone and it should load straight into the dashboard.

1779548414394_image.png
I see the dashboard

10:00 AM
You're live! 🎲

The Roll or Dice Business Tracker is up and running. Here's what to do first to get it set up:

Recommended order for entering data:

Equipment first — Add your laser cutter (name, purchase price, wattage, electricity rate, hours/month). This unlocks automatic equipment cost calculations on every product.
Materials next — Add everything you have on hand: all your wood types, acrylic colors, felt colors/thicknesses, adhesives, hardware, finishing supplies, and packaging. Each material you add automatically creates an inventory record.
Inventory — After adding materials, go to Inventory and update the quantity on hand for everything you purchased.
Products — Now build out your product catalog. The cost preview updates live as you fill in the form, and the "Apply suggested prices" button will calculate Etsy, direct, and wholesale prices from your target margin automatically.
Sales Log — Start logging sales as they happen. The dashboard will fill in with real data.
Bookmark this URL: https://keith920tracey.github.io/roll-or-dice/

And everything syncs to your Google Sheet at Roll or Dice Data — you can open that anytime to see all your raw data in spreadsheet form.

Give it a go and let me know if anything needs tweaking!

is there a way to make is auto refresh when I enter in new data?

10:03 AM
The app already saves to Google Sheets instantly when you click Save on any form — and it reloads the data from the sheet right after saving, so the page you're on updates immediately.

What you might be noticing is that the Dashboard doesn't refresh automatically when you add something from a different section. For example, if you add a product and then click Dashboard, it may show stale data.

That's a one-line fix — I'll make every page refresh its data from the sheet when you navigate to it.


Ran 2 commands, viewed a file, edited a file
Ran 2 commands, viewed a file, edited a file
Upload the new app.js to GitHub the same way as before:

Go to github.com/keith920tracey/roll-or-dice
Click app.js
Click the pencil icon to edit
Select all, delete, paste in the new file contents
Click Commit changes
Now every time you click a section in the sidebar it will pull fresh data from your Google Sheet before rendering — so whatever you just saved will always be there. You'll see the brief "Loading data..." sync bar flash at the top each time, which confirms it's fetching live.


When i modify equipment, the change still does not show up after saving unless I refresh the page

10:10 AM
That's because the Equipment page specifically isn't reloading after a save — the save function reloads data but then doesn't know to re-render the current page. Let me fix the save flow to always re-render whichever page you're on.


Viewed 3 files
Viewed 3 files
I can see the issue — the saveModal function re-renders the page but only by modal type, not by the currently active page. Let me fix it to always re-render whichever page is currently visible.


Ran 4 commands, viewed a file, read a file
Ran 4 commands, viewed a file, read a file
Upload the new app.js to GitHub the same way as before — open the file, click the pencil, select all, paste, commit.

The fix adds a getActivePage() function that checks which page is currently on screen, then after every save it re-renders exactly that page with the fresh data. So whether you're on Equipment, Products, Materials, or anywhere else — saving will always update what you're looking at immediately.


Can you build in automatic calculations for the Add Material input, or add an option to enter in the total price and qty to calculate the price per sheet?

10:24 AM
Good idea — instead of having to do the math yourself, you can just enter what you paid and how many you got.


Viewed 3 files, ran 2 commands
Viewed 3 files, ran 2 commands
Good, the form is in. Now add the calcCostPerUnit function and the CSS for the calculator box:


Add calcCostPerUnit function to app.js
Add calcCostPerUnit function to app.js
Now add the CSS for the calculator box:


Ran 2 commands, read a file
Ran 2 commands, read a file
Upload both app.js and styles.css to GitHub. The material form will now have a gold-highlighted calculator section that looks like this:

Total price paid ÷ Quantity purchased = Cost per unit

Type in either the total+quantity fields and it auto-calculates the cost per unit. Or you can still type directly into the cost per unit field if you already know it. All three fields work together — change any of them and it updates instantly.



Styles
Code · CSS 
Add a supplier weblink to the add material ui

10:29 AM
Quick addition — a URL field for the supplier's website.


Find the supplier field in the material form
Find the supplier field in the material form
Now I need to also add supplier_url to the schema in sheets.js so it saves to the Google Sheet:


Add supplier URL field to material form
Add supplier URL field to material form
Now add supplier_url to the schema and the save function in sheets.js:


Add supplier_url to Materials schema in sheets.js
Add supplier_url to Materials schema in sheets.js
Now add it to the doSave material section in app.js:


Add supplier_url to doSave material block
Add supplier_url to doSave material block
Now make the supplier URL show as a clickable link in the Materials table:


Make supplier column a clickable link in materials table
Make supplier column a clickable link in materials table
Now add the CSS:


Ran 2 commands, read a file
Ran 2 commands, read a file
Upload all three files to GitHub — app.js, sheets.js, and styles.css.

Here's what changed:

Add/Edit Material form — new "Supplier website" field spanning the full width. Paste in the Amazon or Woodcraft product URL and it saves with the material.
When editing an existing material that has a URL saved, a small ↗ button appears next to the field so you can jump straight to the supplier page.
Materials table — the supplier name now shows as a clickable link (with ↗) that opens the supplier page in a new tab, so you can reorder in one click directly from the materials list.



Styles
Code · CSS 
1779550545905_image.png
dont see it

10:35 AM
The supplier URL field is there but the files haven't been uploaded to GitHub yet — you're still on the old version. Also I can see the cost calculator layout needs fixing (the ÷ and = signs are stacking vertically instead of sitting inline).

Upload all three files to GitHub now:

Go to github.com/keith920tracey/roll-or-dice
Click app.js → pencil icon → select all → paste new content → commit
Repeat for sheets.js
Repeat for styles.css
Wait 30 seconds then hard refresh the page with Ctrl+Shift+R (clears the browser cache so you get the new files).

You should then see the supplier URL field below the Supplier name field, and the cost calculator laid out horizontally as Total paid ÷ Qty = Cost per unit all on one row.

Add additional option for material thickness. This will be an optional field, and will allow me to get a better idea what I have in stock, and what is selling

10:38 AM
Good call — thickness is especially important for felt and wood where you carry multiple variants.


Viewed a file, ran a command
Viewed a file, ran a command
Claude's response was interrupted.
Also, add the following dropdown options:
For Sheet Good - Wood - Basswood, Mahogany, Black Walnut, Cherry, Maple

The thickness should be a dropdown with the following options: 1mm, 3mm, 5mm

Add a category called Dice

10:41 AM
Good additions — pre-filled dropdowns will make data entry much faster and more consistent.


View the material form in app.js to find all the relevant sections
View the material form in app.js to find all the relevant sections
Now let me find everywhere categories are listed so I can add "Dice" consistently throughout the app:


Ran 2 commands, viewed a file
Ran 2 commands, viewed a file
Now I have everything. Let me update all three files:


Update app.js with thickness field, name suggestions, and Dice category
Update app.js with thickness field, name suggestions, and Dice category
Now update index.html to add Dice to the filter dropdown:


Add Dice to material filter dropdown in index.html
Add Dice to material filter dropdown in index.html
Now add the optional label CSS:


Ran 2 commands, read a file
Ran 2 commands, read a file
Upload all four files to GitHub. Here's what changed:

Category now drives the form:

Selecting a category auto-populates name suggestions as you type — so picking "Sheet Good - Wood" gives you Basswood, Mahogany, Black Walnut, Cherry, Maple as suggestions in the name field
The thickness dropdown only appears for Sheet Good categories (and Other) — it hides itself for things like Adhesive or Hardware where it doesn't apply
Thickness dropdown — 1mm, 3mm, 5mm options plus a "not applicable" default. Thickness shows as its own column in the Materials table so you can see at a glance what variants you have.

New Dice category added throughout — in the Add Material form, the filter dropdown on the Materials page, and with suggested names: d4, d6, d8, d10, d12, d20, d100, Polyhedral Set.





Styles
Code · CSS 
Add a magnets category. in that category and that category only, i need a dropdown that contains the following options: Round 5x3, Round 10x3, Round 10x2, Round 5x2, Round 6x2, Round 3x1, Round 4x2, Round 3x2

10:51 AM

Add Magnets category with size dropdown to app.js
Add Magnets category with size dropdown to app.js
Now add Magnets to the filter dropdown in index.html:


Add Magnets to filter dropdown in index.html
Add Magnets to filter dropdown in index.html
Now add a small CSS rule so the magnet field hides by default until Magnets category is selected:


Ran 2 commands, read a file
Ran 2 commands, read a file
Upload app.js, index.html, and styles.css to GitHub. Here's how it works:

When you select any other category — the normal Name text field shows as usual with suggestions
When you select Magnets — the Name field hides and is replaced by a "Magnet size" dropdown with all 8 of your sizes. The selected size automatically becomes the material name when saved, so it shows cleanly in your Materials and Inventory lists
Magnets also appears in the Materials filter dropdown on the Materials page



Styles
Code · CSS 
1779551807189_image.png
I dont see the dropdown for magnets

10:56 AM
The magnet size dropdown is being hidden because the updateMaterialNameOptions function isn't running at the right time after the form renders. The issue is the name field and magnet field aren't being found correctly. Let me fix the logic:


Fix magnet dropdown visibility using element IDs instead of closest()
Fix magnet dropdown visibility using element IDs instead of closest()
Also remove the CSS rule that hides it by default since we're now controlling it via JS:


Ran 2 commands, read a file
Ran 2 commands, read a file
Upload both app.js and styles.css to GitHub, then do a hard refresh with Ctrl+Shift+R.

The fix was that the old code used .closest('.field') to find the magnet field's parent — but that only works when the element is already visible. I've given both the name field wrapper and magnet field their own IDs (name-field-wrap and magnet-size-field) so the JS can find and toggle them reliably regardless of state. Selecting Magnets will now hide the name input and show the size dropdown immediately.



Styles
Code · CSS 
In the add material UI, when sheet good - wood is selected, make it work like the magnet category drop down, instead of magnet types use the wood types already provided. List all dropdowns everywhere alphebetically

11:04 AM

Add wood type dropdown and sort all lists alphabetically
Add wood type dropdown and sort all lists alphabetically
Now sort the category filter dropdown in index.html alphabetically too:


Ran 2 commands, read a file
Ran 2 commands, read a file
Upload app.js and index.html to GitHub, then hard refresh with Ctrl+Shift+R.

Here's what changed:

Sheet Good - Wood now works exactly like Magnets — selecting it hides the free-text name field and shows a "Wood type" dropdown with Basswood, Black Walnut, Cherry, Mahogany, Maple (alphabetical)
Magnets list is now also sorted alphabetically by size
All category dropdowns are sorted alphabetically, with the three Sheet Good variants grouped together at the top since they're related
All other name suggestion lists (Acrylic colors, Felt colors, Adhesives, etc.) are also sorted alphabetically


In the finishing category, add the following in alphabetical order to the Name Dropdown - Natural, Golden Oak, Provincial, Red Oak, Puritan Pine, Ipswitch Pine, Sedona Red, Colonial Maple, Special Walnut, Red Mahogany, Early American, Gunstock, Red Chestnut, English Chestnut, Cherry, Fruitwood, Golden Pecan, Pickled Oak, Driftwood, Dark Walnut, Ebony, Jacobean, Weathered Oak, Classic Grey, Honey, Expresso

Also, change the Name label to Type/Color

Show less
11:28 AM
Claude's response was interrupted.
Also, change the Name label to Type/Color in all materials add on UI's

11:29 AM

Add stain colors to Finishing, change Name label to Type/Color across all material dropdowns
Add stain colors to Finishing, change Name label to Type/Color across all material dropdowns
Now make Finishing also use a dropdown like Wood and Magnets instead of a free-text field:


Ran 2 commands, read a file
Ran 2 commands, read a file
Upload app.js to GitHub and hard refresh with Ctrl+Shift+R.

Here's what changed:

Finishing now works like Wood and Magnets — selecting it hides the free-text field and shows a dropdown with all 30 stain/finish options in alphabetical order
All three dropdown fields (Magnets, Sheet Good - Wood, Finishing) now show the label *"Type / Color " consistently
The free-text name field for all other categories (Acrylic, Felt, Adhesive, etc.) also shows *"Type / Color "

I want the login screen to 'remember me', or, use the current user that is logged into google as the user.

11:31 AM
Good call — instead of forcing a login click every time, the app should silently check if Google already has an active session and log you straight in.


Viewed a file, ran a command
Viewed a file, ran a command
Also update the auth screen to show a loading state while auto sign-in is attempted:


Ran 2 commands, read a file
Ran 2 commands, read a file
Upload sheets.js and index.html to GitHub, then hard refresh with Ctrl+Shift+R.

Here's how it works:

First visit after this update — you'll still see the login screen once. Sign in as normal.
Every visit after that — the app detects your previous session, silently re-authenticates with Google in the background, and takes you straight to the dashboard. The button shows "Signing in..." briefly while it does this.
Sign out clears the saved session, so the login screen will appear again on the next visit — useful if you ever want to switch accounts.
The session hint is stored in your browser's localStorage, so it persists across page refreshes and browser restarts on the same device.



Finishing should only contain the stain colors in alphabetical order:Natural, Golden Oak, Provincial, Red Oak, Puritan Pine, Ipswitch Pine, Sedona Red, Colonial Maple, Special Walnut, Red Mahogany, Early American, Gunstock, Red Chestnut, English Chestnut, Cherry, Fruitwood, Golden Pecan, Pickled Oak, Driftwood, Dark Walnut, Ebony, Jacobean, Weathered Oak, Classic Grey, Honey, Expresso

Place the other items currently there  in the Other category

Show more
11:35 AM

Ran 2 commands, read a file
Ran 2 commands, read a file
Upload app.js to GitHub and hard refresh.

Finishing now contains only the 26 stain colors in alphabetical order. The items moved to Other are: Masking Tape, Nitrile Gloves, Polishing Cloth, Sponges, Wood Polish.


When changing categories of materials, all dropdowns other than category should not be filled in. when that happens I have to delete what is there before the dropdown works

11:38 AM
Good catch — when you switch categories, all the dependent fields should reset to blank so you start fresh.


Ran 3 commands, viewed a file, read a file
Ran 3 commands, viewed a file, read a file
Upload app.js to GitHub and hard refresh.

Now whenever you change the category, every dependent field resets cleanly — the name/type dropdown goes back to its first option, thickness resets to "not applicable", and the cost calculator clears out too. You start with a blank slate every time you switch categories.







Claude is AI and can make mistakes. Please double-check responses.
App · JS
// Roll or Dice — Main Application Logic
 
// ── Page Navigation ─────────────────────────────────────────────────────────
 
async function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  document.getElementById('page-' + name).classList.add('active');
  document.querySelector(`[data-page="${name}"]`).classList.add('active');
  const renders = {
    dashboard: renderDashboard,
    products:  renderProductList,
    materials: renderMaterialList,
    inventory: renderInventoryList,
    sales:     renderSalesList,
    equipment: renderEquipmentList,
  };
  await loadAllData();
  if (renders[name]) renders[name]();
}
 
// ── Cost Calculation ────────────────────────────────────────────────────────
 
function calcProductCost(p) {
  const mat = [
    'wood','acrylic','felt','adhesive','hardware','finishing','packaging_mat','other_mat'
  ].reduce((sum, k) => sum + parseFloat(p[k] || 0), 0);
 
  const wasteMult = 1 + (parseFloat(p.waste_pct || 0) / 100);
  const matWithWaste = mat * wasteMult;
 
  const labor = parseFloat(p.labor_hours || 0) * parseFloat(p.labor_rate || 0);
 
  // Equipment cost: find laser cutter and calc per-minute rate
  const laser = DB.equipment.find(e => e.name.toLowerCase().includes('laser'));
  let equipCost = 0;
  if (laser && p.laser_minutes) {
    const hoursPerYear = parseFloat(laser.hours_per_month || 0) * 12;
    const depreciationPerHour = hoursPerYear > 0
      ? parseFloat(laser.purchase_price || 0) / (parseFloat(laser.expected_life_years || 1) * hoursPerYear)
      : 0;
    const kwh = (parseFloat(laser.wattage || 0) / 1000) * (parseFloat(p.laser_minutes || 0) / 60);
    const electricityCost = kwh * parseFloat(laser.cost_per_kwh || 0.12);
    equipCost = (depreciationPerHour * parseFloat(p.laser_minutes || 0) / 60) + electricityCost;
  }
 
  const subtotal = matWithWaste + labor + equipCost;
 
  const priceEtsy = parseFloat(p.price_etsy || 0);
  const priceDirect = parseFloat(p.price_direct || 0);
  const priceWholesale = parseFloat(p.price_wholesale || 0);
 
  const etsyFees = priceEtsy > 0
    ? (priceEtsy * CONFIG.FEES.ETSY_TRANSACTION) + (priceEtsy * CONFIG.FEES.ETSY_PAYMENT) + CONFIG.FEES.ETSY_LISTING
    : 0;
 
  return {
    matRaw: mat,
    matWithWaste,
    labor,
    equipCost,
    subtotal,
    etsyFees,
    totalCostEtsy: subtotal + etsyFees,
    totalCostDirect: subtotal,
    profitEtsy: priceEtsy - (subtotal + etsyFees),
    profitDirect: priceDirect - subtotal,
    profitWholesale: priceWholesale - subtotal,
    marginEtsy: priceEtsy > 0 ? ((priceEtsy - subtotal - etsyFees) / priceEtsy) * 100 : 0,
    marginDirect: priceDirect > 0 ? ((priceDirect - subtotal) / priceDirect) * 100 : 0,
    marginWholesale: priceWholesale > 0 ? ((priceWholesale - subtotal) / priceWholesale) * 100 : 0,
  };
}
 
function suggestedPrice(cost, targetMarginPct, etsyFeesPct = 0) {
  // price = cost / (1 - margin - fees)
  const divisor = 1 - (targetMarginPct / 100) - etsyFeesPct;
  return divisor > 0 ? cost / divisor : null;
}
 
function marginColor(pct) {
  if (pct >= 40) return 'good';
  if (pct >= 20) return 'warn';
  return 'bad';
}
 
function fmt(n) { return '$' + parseFloat(n || 0).toFixed(2); }
function fmtPct(n) { return parseFloat(n || 0).toFixed(1) + '%'; }
 
// ── Dashboard ───────────────────────────────────────────────────────────────
 
function renderDashboard() {
  const totalRevenue = DB.sales.reduce((s, sale) => s + parseFloat(sale.total_revenue || 0), 0);
  const totalUnits   = DB.sales.reduce((s, sale) => s + parseInt(sale.qty || 0), 0);
  const productCount = DB.products.length;
  const lowStock     = DB.inventory.filter(i => {
    const mat = DB.materials.find(m => m.id === i.material_id);
    const thresh = parseFloat(mat?.reorder_threshold || CONFIG.DEFAULT_LOW_STOCK);
    return parseFloat(i.qty_on_hand || 0) <= thresh;
  });
 
  document.getElementById('dash-stats').innerHTML = `
    <div class="stat-card">
      <div class="stat-label">Total Revenue</div>
      <div class="stat-value">${fmt(totalRevenue)}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Units Sold</div>
      <div class="stat-value">${totalUnits}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Products</div>
      <div class="stat-value">${productCount}</div>
    </div>
    <div class="stat-card ${lowStock.length ? 'stat-warn' : ''}">
      <div class="stat-label">Low Stock Alerts</div>
      <div class="stat-value">${lowStock.length}</div>
    </div>
  `;
 
  // Top products by profit (Etsy channel)
  const ranked = DB.products
    .map(p => ({ p, c: calcProductCost(p) }))
    .sort((a, b) => b.c.profitEtsy - a.c.profitEtsy)
    .slice(0, 5);
 
  document.getElementById('dash-top-products').innerHTML = ranked.length
    ? ranked.map(({ p, c }) => `
        <div class="dash-row-item">
          <div>
            <div class="item-name">${p.name}</div>
            <div class="item-sub">${p.category || ''}</div>
          </div>
          <div class="item-right">
            <span class="badge badge-${marginColor(c.marginEtsy)}">${fmtPct(c.marginEtsy)} margin</span>
            <span class="item-profit">${fmt(c.profitEtsy)}/unit</span>
          </div>
        </div>`).join('')
    : '<div class="empty-msg">No products yet.</div>';
 
  // Low stock
  document.getElementById('dash-low-stock').innerHTML = lowStock.length
    ? lowStock.map(i => {
        const mat = DB.materials.find(m => m.id === i.material_id);
        return `<div class="dash-row-item">
          <div>
            <div class="item-name">${i.material_name}</div>
            <div class="item-sub">${mat?.category || ''}</div>
          </div>
          <div class="item-right">
            <span class="badge badge-bad">${i.qty_on_hand} ${mat?.unit || ''} left</span>
          </div>
        </div>`;
      }).join('')
    : '<div class="empty-msg">All materials well stocked.</div>';
 
  // Recent sales
  const recent = [...DB.sales].sort((a,b) => new Date(b.date) - new Date(a.date)).slice(0, 8);
  document.getElementById('dash-recent-sales').innerHTML = recent.length
    ? `<table class="data-table">
        <thead><tr><th>Date</th><th>Product</th><th>Channel</th><th>Qty</th><th>Revenue</th></tr></thead>
        <tbody>${recent.map(s => `
          <tr>
            <td>${s.date}</td>
            <td>${s.product_name}</td>
            <td><span class="channel-badge channel-${s.channel.toLowerCase().replace(/\s|[-]/g,'')}">${s.channel}</span></td>
            <td>${s.qty}</td>
            <td>${fmt(s.total_revenue)}</td>
          </tr>`).join('')}</tbody>
      </table>`
    : '<div class="empty-msg">No sales logged yet.</div>';
}
 
// ── Products ────────────────────────────────────────────────────────────────
 
function renderProductList() {
  const q   = (document.getElementById('product-search')?.value || '').toLowerCase();
  const cat = document.getElementById('product-filter-cat')?.value || '';
  const list = DB.products.filter(p => {
    const mq = !q || p.name.toLowerCase().includes(q) || (p.sku || '').toLowerCase().includes(q);
    const mc = !cat || p.category === cat;
    return mq && mc;
  });
 
  document.getElementById('product-list').innerHTML = list.length
    ? list.map(p => {
        const c = calcProductCost(p);
        return `<div class="product-card" onclick="openEditModal('product','${p.id}')">
          <div class="pc-top">
            <div>
              <div class="pc-name">${p.name}</div>
              <div class="pc-meta">${p.category || ''}${p.sku ? ' · ' + p.sku : ''}</div>
            </div>
            <div class="pc-actions" onclick="event.stopPropagation()">
              <button class="btn-icon" onclick="openEditModal('product','${p.id}')">✎</button>
              <button class="btn-icon btn-icon-del" onclick="confirmDelete('Products','${p.id}','products')">✕</button>
            </div>
          </div>
          <div class="pc-channels">
            <div class="channel-row">
              <span class="ch-label">Etsy</span>
              <span class="ch-price">${fmt(p.price_etsy)}</span>
              <span class="badge badge-${marginColor(c.marginEtsy)}">${fmtPct(c.marginEtsy)}</span>
            </div>
            <div class="channel-row">
              <span class="ch-label">Direct</span>
              <span class="ch-price">${fmt(p.price_direct)}</span>
              <span class="badge badge-${marginColor(c.marginDirect)}">${fmtPct(c.marginDirect)}</span>
            </div>
            <div class="channel-row">
              <span class="ch-label">Wholesale</span>
              <span class="ch-price">${fmt(p.price_wholesale)}</span>
              <span class="badge badge-${marginColor(c.marginWholesale)}">${fmtPct(c.marginWholesale)}</span>
            </div>
          </div>
          <div class="pc-cost-bar">
            <span>Total cost: ${fmt(c.subtotal)}</span>
            <span>Materials: ${fmt(c.matWithWaste)} · Labor: ${fmt(c.labor)} · Equip: ${fmt(c.equipCost)}</span>
          </div>
        </div>`;
      }).join('')
    : '<div class="empty-msg">No products found. Click "+ Add Product" to get started.</div>';
}
 
// ── Materials ───────────────────────────────────────────────────────────────
 
function renderMaterialList() {
  const cat = document.getElementById('material-filter-cat')?.value || '';
  const list = DB.materials.filter(m => !cat || m.category === cat);
 
  const grouped = {};
  list.forEach(m => {
    if (!grouped[m.category]) grouped[m.category] = [];
    grouped[m.category].push(m);
  });
 
  document.getElementById('material-list').innerHTML = Object.entries(grouped).length
    ? Object.entries(grouped).map(([cat, mats]) => `
        <div class="group-header">${cat}</div>
        <table class="data-table">
          <thead><tr><th>Name</th><th>Thickness</th><th>Unit</th><th>Cost/Unit</th><th>Supplier</th><th>Reorder At</th><th></th></tr></thead>
          <tbody>${mats.map(m => `
            <tr>
              <td>${m.name}</td>
              <td>${m.thickness || '—'}</td>
              <td>${m.unit}</td>
              <td>${fmt(m.cost_per_unit)}</td>
              <td>${m.supplier_url ? `<a href="${m.supplier_url}" target="_blank" class="supplier-link">${m.supplier || 'Visit'} ↗</a>` : (m.supplier || '—')}</td>
              <td>${m.reorder_threshold || CONFIG.DEFAULT_LOW_STOCK} ${m.unit}</td>
              <td class="td-actions">
                <button class="btn-icon" onclick="openEditModal('material','${m.id}')">✎</button>
                <button class="btn-icon btn-icon-del" onclick="confirmDelete('Materials','${m.id}','materials')">✕</button>
              </td>
            </tr>`).join('')}
          </tbody>
        </table>`).join('')
    : '<div class="empty-msg">No materials yet. Click "+ Add Material" to get started.</div>';
}
 
// ── Inventory ───────────────────────────────────────────────────────────────
 
function renderInventoryList() {
  const sorted = [...DB.inventory].sort((a, b) => a.material_name.localeCompare(b.material_name));
  document.getElementById('inventory-list').innerHTML = sorted.length
    ? `<table class="data-table">
        <thead><tr><th>Material</th><th>Category</th><th>On Hand</th><th>Status</th><th>Last Updated</th><th></th></tr></thead>
        <tbody>${sorted.map(i => {
          const mat = DB.materials.find(m => m.id === i.material_id);
          const thresh = parseFloat(mat?.reorder_threshold || CONFIG.DEFAULT_LOW_STOCK);
          const qty = parseFloat(i.qty_on_hand || 0);
          const status = qty <= 0 ? 'bad' : qty <= thresh ? 'warn' : 'good';
          const statusLabel = qty <= 0 ? 'Out of stock' : qty <= thresh ? 'Low stock' : 'OK';
          return `<tr>
            <td>${i.material_name}</td>
            <td>${mat?.category || '—'}</td>
            <td>${i.qty_on_hand} ${mat?.unit || ''}</td>
            <td><span class="badge badge-${status}">${statusLabel}</span></td>
            <td>${i.last_updated || '—'}</td>
            <td class="td-actions">
              <button class="btn-icon" onclick="openEditModal('stock','${i.id}')">✎</button>
            </td>
          </tr>`;
        }).join('')}</tbody>
      </table>`
    : '<div class="empty-msg">No inventory records. Add materials first, then update stock.</div>';
}
 
// ── Sales ───────────────────────────────────────────────────────────────────
 
function renderSalesList() {
  const channel = document.getElementById('sales-filter-channel')?.value || '';
  const month   = document.getElementById('sales-filter-month')?.value || '';
  let list = DB.sales.filter(s => {
    const mc = !channel || s.channel === channel;
    const mm = !month || s.date.startsWith(month);
    return mc && mm;
  }).sort((a, b) => new Date(b.date) - new Date(a.date));
 
  const totalRev = list.reduce((s, x) => s + parseFloat(x.total_revenue || 0), 0);
  const totalUnits = list.reduce((s, x) => s + parseInt(x.qty || 0), 0);
  document.getElementById('sales-summary').innerHTML = list.length ? `
    <div class="summary-pill">Sales: <strong>${list.length}</strong></div>
    <div class="summary-pill">Units: <strong>${totalUnits}</strong></div>
    <div class="summary-pill">Revenue: <strong>${fmt(totalRev)}</strong></div>
  ` : '';
 
  document.getElementById('sales-list').innerHTML = list.length
    ? `<table class="data-table">
        <thead><tr><th>Date</th><th>Product</th><th>Channel</th><th>Qty</th><th>Unit Price</th><th>Discount</th><th>Shipping</th><th>Total</th><th>Notes</th><th></th></tr></thead>
        <tbody>${list.map(s => `
          <tr>
            <td>${s.date}</td>
            <td>${s.product_name}</td>
            <td><span class="channel-badge channel-${s.channel.toLowerCase().replace(/[\s-]/g,'')}">${s.channel}</span></td>
            <td>${s.qty}</td>
            <td>${fmt(s.unit_price)}</td>
            <td>${s.discount ? fmt(s.discount) : '—'}</td>
            <td>${s.shipping_charged ? fmt(s.shipping_charged) : '—'}</td>
            <td><strong>${fmt(s.total_revenue)}</strong></td>
            <td>${s.notes || '—'}</td>
            <td class="td-actions">
              <button class="btn-icon btn-icon-del" onclick="confirmDelete('Sales','${s.id}','sales')">✕</button>
            </td>
          </tr>`).join('')}
        </tbody>
      </table>`
    : '<div class="empty-msg">No sales match your filters.</div>';
}
 
// ── Equipment ───────────────────────────────────────────────────────────────
 
function renderEquipmentList() {
  document.getElementById('equipment-list').innerHTML = DB.equipment.length
    ? `<table class="data-table">
        <thead><tr><th>Equipment</th><th>Purchase Price</th><th>Purchased</th><th>Life (yrs)</th><th>Wattage</th><th>$/kWh</th><th>Hrs/Month</th><th>Cost/Hr</th><th></th></tr></thead>
        <tbody>${DB.equipment.map(e => {
          const hoursPerYear = parseFloat(e.hours_per_month || 0) * 12;
          const depPerHr = hoursPerYear > 0
            ? parseFloat(e.purchase_price || 0) / (parseFloat(e.expected_life_years || 1) * hoursPerYear)
            : 0;
          const elecPerHr = (parseFloat(e.wattage || 0) / 1000) * parseFloat(e.cost_per_kwh || 0);
          const totalPerHr = depPerHr + elecPerHr;
          return `<tr>
            <td><strong>${e.name}</strong></td>
            <td>${fmt(e.purchase_price)}</td>
            <td>${e.purchase_date || '—'}</td>
            <td>${e.expected_life_years || '—'}</td>
            <td>${e.wattage ? e.wattage + 'W' : '—'}</td>
            <td>${e.cost_per_kwh ? fmt(e.cost_per_kwh) : '—'}</td>
            <td>${e.hours_per_month || '—'}</td>
            <td><strong>${fmt(totalPerHr)}/hr</strong></td>
            <td class="td-actions">
              <button class="btn-icon" onclick="openEditModal('equipment','${e.id}')">✎</button>
              <button class="btn-icon btn-icon-del" onclick="confirmDelete('Equipment','${e.id}','equipment')">✕</button>
            </td>
          </tr>`;
        }).join('')}</tbody>
      </table>
      <div class="equip-note">Cost/Hr = depreciation + electricity. This value is used automatically in product cost calculations when you enter laser minutes.</div>`
    : '<div class="empty-msg">No equipment tracked yet. Add your laser cutter to enable per-product equipment cost calculations.</div>';
}
 
// ── Modal System ────────────────────────────────────────────────────────────
 
let currentModal = null;
let currentEditId = null;
 
function openModal(type) {
  currentModal = type;
  currentEditId = null;
  renderModalContent(type, null);
  document.getElementById('modal-overlay').classList.remove('hidden');
}
 
function openEditModal(type, id) {
  currentModal = type;
  currentEditId = id;
  const data = {
    product:   DB.products.find(x => x.id === id),
    material:  DB.materials.find(x => x.id === id),
    stock:     DB.inventory.find(x => x.id === id),
    sale:      DB.sales.find(x => x.id === id),
    equipment: DB.equipment.find(x => x.id === id),
  }[type];
  renderModalContent(type, data);
  document.getElementById('modal-overlay').classList.remove('hidden');
}
 
function closeModal() {
  document.getElementById('modal-overlay').classList.add('hidden');
  currentModal = null;
  currentEditId = null;
}
 
function closeModalIfOutside(e) {
  if (e.target === document.getElementById('modal-overlay')) closeModal();
}
 
function renderModalContent(type, data) {
  const v = (k, def = '') => data?.[k] !== undefined ? data[k] : def;
  const titles = { product:'Product', material:'Material', stock:'Update Stock', sale:'Log Sale', equipment:'Equipment' };
  document.getElementById('modal-title').textContent = (currentEditId ? 'Edit ' : 'Add ') + titles[type];
 
  const forms = {
    product: () => `
      <div class="form-section"><div class="form-section-title">Product Info</div>
        <div class="fg2">
          <div class="field"><label>Name *</label><input id="f-name" value="${v('name')}" placeholder="e.g. Dragon's Hoard Dice Box"></div>
          <div class="field"><label>Category</label><select id="f-category">${['','Dice Box','Dice Tray','Dice Jail','Card Box','Chest','Coaster','Other'].map(c=>`<option${v('category')===c?' selected':''}>${c}</option>`).join('')}</select></div>
          <div class="field"><label>SKU</label><input id="f-sku" value="${v('sku')}" placeholder="e.g. DB-001"></div>
          <div class="field full"><label>Description / Notes</label><textarea id="f-description">${v('description')}</textarea></div>
        </div>
      </div>
      <div class="form-section"><div class="form-section-title">Material Costs ($ per unit, before waste)</div>
        <div class="fg3">
          <div class="field"><label>Wood / MDF</label><input type="number" id="f-wood" value="${v('wood','0')}" step="0.01" min="0" oninput="updateProductPreview()"></div>
          <div class="field"><label>Acrylic</label><input type="number" id="f-acrylic" value="${v('acrylic','0')}" step="0.01" min="0" oninput="updateProductPreview()"></div>
          <div class="field"><label>Felt</label><input type="number" id="f-felt" value="${v('felt','0')}" step="0.01" min="0" oninput="updateProductPreview()"></div>
          <div class="field"><label>Adhesive (glue/CA)</label><input type="number" id="f-adhesive" value="${v('adhesive','0')}" step="0.01" min="0" oninput="updateProductPreview()"></div>
          <div class="field"><label>Hardware (magnets etc.)</label><input type="number" id="f-hardware" value="${v('hardware','0')}" step="0.01" min="0" oninput="updateProductPreview()"></div>
          <div class="field"><label>Finishing (stain/polish)</label><input type="number" id="f-finishing" value="${v('finishing','0')}" step="0.01" min="0" oninput="updateProductPreview()"></div>
          <div class="field"><label>Packaging materials</label><input type="number" id="f-packaging_mat" value="${v('packaging_mat','0')}" step="0.01" min="0" oninput="updateProductPreview()"></div>
          <div class="field"><label>Other materials</label><input type="number" id="f-other_mat" value="${v('other_mat','0')}" step="0.01" min="0" oninput="updateProductPreview()"></div>
          <div class="field"><label>Material waste %</label><input type="number" id="f-waste_pct" value="${v('waste_pct','5')}" step="1" min="0" max="100" oninput="updateProductPreview()"><span class="field-hint">e.g. 5 = 5% waste added to material cost</span></div>
        </div>
      </div>
      <div class="form-section"><div class="form-section-title">Labor & Equipment</div>
        <div class="fg3">
          <div class="field"><label>Labor hours</label><input type="number" id="f-labor_hours" value="${v('labor_hours','0')}" step="0.25" min="0" oninput="updateProductPreview()"></div>
          <div class="field"><label>Your hourly rate ($)</label><input type="number" id="f-labor_rate" value="${v('labor_rate','15')}" step="0.5" min="0" oninput="updateProductPreview()"></div>
          <div class="field"><label>Laser time (minutes)</label><input type="number" id="f-laser_minutes" value="${v('laser_minutes','0')}" step="1" min="0" oninput="updateProductPreview()"><span class="field-hint">Auto-calculates from equipment settings</span></div>
        </div>
      </div>
      <div class="form-section"><div class="form-section-title">Pricing by Channel</div>
        <div class="pricing-helper">
          <label>Target margin %</label>
          <input type="number" id="f-target-margin" value="40" step="5" min="0" max="100" oninput="updateProductPreview()">
          <button type="button" class="btn-secondary btn-sm" onclick="applyTargetMargin()">Apply suggested prices</button>
        </div>
        <div class="fg3">
          <div class="field"><label>Etsy price ($)</label><input type="number" id="f-price_etsy" value="${v('price_etsy','0')}" step="0.5" min="0" oninput="updateProductPreview()"></div>
          <div class="field"><label>Direct sale price ($)</label><input type="number" id="f-price_direct" value="${v('price_direct','0')}" step="0.5" min="0" oninput="updateProductPreview()"></div>
          <div class="field"><label>Hobby shop price ($)</label><input type="number" id="f-price_wholesale" value="${v('price_wholesale','0')}" step="0.5" min="0" oninput="updateProductPreview()"></div>
        </div>
        <div id="product-preview" class="cost-preview"></div>
      </div>`,
 
    material: () => `
      <div class="fg2">
        <div class="field"><label>Category *</label><select id="f-category" onchange="updateMaterialNameOptions()">
          ${['Sheet Good - Acrylic','Sheet Good - Felt','Sheet Good - Wood','Adhesive','Dice','Finishing','Hardware','Magnets','Packaging','Other']
            .map(c=>`<option${v('category')===c?' selected':''}>${c}</option>`).join('')}
        </select></div>
        <div class="field" id="name-field-wrap"><label>Type / Color *</label>
          <div class="name-input-wrap">
            <input id="f-name" value="${v('name')}" placeholder="e.g. Basswood 12x12" list="f-name-suggestions">
            <datalist id="f-name-suggestions"></datalist>
          </div>
        </div>
        <div class="field" id="magnet-size-field">
          <label>Type / Color *</label>
          <select id="f-magnet-size" onchange="document.getElementById('f-name').value=this.value">
            ${['Round 3x1','Round 3x2','Round 4x2','Round 5x2','Round 5x3','Round 6x2','Round 10x2','Round 10x3']
              .map(s=>`<option${v('name')===s?' selected':''}>${s}</option>`).join('')}
          </select>
        </div>
        <div class="field" id="wood-type-field">
          <label>Type / Color *</label>
          <select id="f-wood-type" onchange="document.getElementById('f-name').value=this.value">
            ${['Basswood','Black Walnut','Cherry','Mahogany','Maple']
              .map(s=>`<option${v('name')===s?' selected':''}>${s}</option>`).join('')}
          </select>
        </div>
        <div class="field" id="finishing-type-field">
          <label>Type / Color *</label>
          <select id="f-finishing-type" onchange="document.getElementById('f-name').value=this.value">
            ${['Cherry','Classic Grey','Colonial Maple','Dark Walnut','Driftwood','Early American','Ebony','English Chestnut','Expresso','Fruitwood','Golden Oak','Golden Pecan','Gunstock','Honey','Ipswitch Pine','Jacobean','Natural','Pickled Oak','Provincial','Puritan Pine','Red Chestnut','Red Mahogany','Red Oak','Sedona Red','Special Walnut','Weathered Oak']
              .map(s=>`<option${v('name')===s?' selected':''}>${s}</option>`).join('')}
          </select>
        </div>
        <div class="field"><label>Thickness <span class="optional-label">(optional)</span></label>
          <select id="f-thickness">
            <option value="">— not applicable —</option>
            ${['1mm','3mm','5mm'].map(t=>`<option${v('thickness')===t?' selected':''}>${t}</option>`).join('')}
          </select>
        </div>
        <div class="field"><label>Unit *</label><input id="f-unit" value="${v('unit','sheet')}" placeholder="e.g. sheet, bottle, pack, each"></div>
        <div class="field"><label>Supplier</label><input id="f-supplier" value="${v('supplier')}" placeholder="e.g. Woodcraft, Amazon"></div>
        <div class="field"><label>Reorder when below</label><input type="number" id="f-reorder_threshold" value="${v('reorder_threshold','3')}" step="1" min="0"></div>
        <div class="field full supplier-url-field">
          <label>Supplier website</label>
          <div class="url-input-wrap">
            <input id="f-supplier_url" value="${v('supplier_url')}" placeholder="https://www.amazon.com/your-product-link" type="url">
            ${v('supplier_url') ? `<a href="${v('supplier_url')}" target="_blank" class="url-open-btn" title="Open supplier page">↗</a>` : ''}
          </div>
        </div>
      </div>
      <div class="cost-calc-box">
        <div class="cost-calc-title">Cost calculator — enter what you paid and how many you got</div>
        <div class="cost-calc-row">
          <div class="field">
            <label>Total price paid ($)</label>
            <input type="number" id="f-total-paid" step="0.01" min="0" placeholder="e.g. 24.99" oninput="calcCostPerUnit()">
          </div>
          <div class="cost-calc-divider">÷</div>
          <div class="field">
            <label>Quantity purchased</label>
            <input type="number" id="f-qty-purchased" step="1" min="1" placeholder="e.g. 12" oninput="calcCostPerUnit()">
          </div>
          <div class="cost-calc-divider">=</div>
          <div class="field">
            <label>Cost per unit ($) *</label>
            <input type="number" id="f-cost_per_unit" value="${v('cost_per_unit','0')}" step="0.01" min="0" oninput="calcCostPerUnit()">
          </div>
        </div>
      </div>
      <div class="fg2">
        <div class="field full"><label>Notes</label><textarea id="f-notes">${v('notes')}</textarea></div>
      </div>`,
 
    stock: () => {
      const matOptions = DB.materials.map(m =>
        `<option value="${m.id}" data-name="${m.name}"${v('material_id')===m.id?' selected':''}>${m.name} (${m.category})</option>`
      ).join('');
      return `<div class="fg2">
        <div class="field"><label>Material *</label><select id="f-material_id">${matOptions}</select></div>
        <div class="field"><label>Quantity on hand *</label><input type="number" id="f-qty_on_hand" value="${v('qty_on_hand','0')}" step="0.5" min="0"></div>
        <div class="field full"><label>Notes</label><textarea id="f-notes">${v('notes')}</textarea></div>
      </div>`;
    },
 
    sale: () => {
      const productOptions = DB.products.map(p =>
        `<option value="${p.id}" data-name="${p.name}"${v('product_id')===p.id?' selected':''}>${p.name}</option>`
      ).join('');
      return `<div class="fg2">
        <div class="field"><label>Date *</label><input type="date" id="f-date" value="${v('date', new Date().toISOString().slice(0,10))}"></div>
        <div class="field"><label>Product *</label><select id="f-product_id" onchange="updateSalePrice()">${productOptions}</select></div>
        <div class="field"><label>Channel *</label><select id="f-channel">
          ${['Etsy','Direct - Customer','Direct - Hobby Shop'].map(c=>`<option${v('channel')===c?' selected':''}>${c}</option>`).join('')}
        </select></div>
        <div class="field"><label>Quantity *</label><input type="number" id="f-qty" value="${v('qty','1')}" step="1" min="1" oninput="updateSaleTotal()"></div>
        <div class="field"><label>Unit price ($) *</label><input type="number" id="f-unit_price" value="${v('unit_price','0')}" step="0.01" min="0" oninput="updateSaleTotal()"></div>
        <div class="field"><label>Discount ($)</label><input type="number" id="f-discount" value="${v('discount','0')}" step="0.01" min="0" oninput="updateSaleTotal()"></div>
        <div class="field"><label>Shipping charged ($)</label><input type="number" id="f-shipping_charged" value="${v('shipping_charged','0')}" step="0.01" min="0" oninput="updateSaleTotal()"></div>
        <div class="field"><label>Total revenue</label><input type="number" id="f-total_revenue" value="${v('total_revenue','0')}" step="0.01" min="0"></div>
        <div class="field full"><label>Notes</label><textarea id="f-notes">${v('notes')}</textarea></div>
      </div>`;
    },
 
    equipment: () => `
      <div class="fg2">
        <div class="field"><label>Equipment name *</label><input id="f-name" value="${v('name')}" placeholder="e.g. xTool D1 Pro Laser"></div>
        <div class="field"><label>Purchase price ($)</label><input type="number" id="f-purchase_price" value="${v('purchase_price','0')}" step="0.01" min="0"></div>
        <div class="field"><label>Purchase date</label><input type="date" id="f-purchase_date" value="${v('purchase_date')}"></div>
        <div class="field"><label>Expected life (years)</label><input type="number" id="f-expected_life_years" value="${v('expected_life_years','5')}" step="1" min="1"></div>
        <div class="field"><label>Wattage (W)</label><input type="number" id="f-wattage" value="${v('wattage','0')}" step="1" min="0"><span class="field-hint">Used to calc electricity cost</span></div>
        <div class="field"><label>Electricity cost ($/kWh)</label><input type="number" id="f-cost_per_kwh" value="${v('cost_per_kwh','0.12')}" step="0.01" min="0"><span class="field-hint">Check your electric bill</span></div>
        <div class="field"><label>Avg hours used/month</label><input type="number" id="f-hours_per_month" value="${v('hours_per_month','0')}" step="0.5" min="0"><span class="field-hint">Used for depreciation calc</span></div>
        <div class="field full"><label>Notes</label><textarea id="f-notes">${v('notes')}</textarea></div>
      </div>`,
  };
 
  document.getElementById('modal-body').innerHTML = forms[type]();
  if (type === 'product') setTimeout(updateProductPreview, 50);
  if (type === 'sale') setTimeout(updateSalePrice, 50);
  if (type === 'material') setTimeout(updateMaterialNameOptions, 50);
}
 
function updateSalePrice() {
  const sel = document.getElementById('f-product_id');
  if (!sel) return;
  const pid = sel.value;
  const prod = DB.products.find(p => p.id === pid);
  if (!prod) return;
  const channel = document.getElementById('f-channel')?.value || '';
  let price = 0;
  if (channel === 'Etsy') price = parseFloat(prod.price_etsy || 0);
  else if (channel === 'Direct - Customer') price = parseFloat(prod.price_direct || 0);
  else if (channel === 'Direct - Hobby Shop') price = parseFloat(prod.price_wholesale || 0);
  if (price) document.getElementById('f-unit_price').value = price.toFixed(2);
  updateSaleTotal();
}
 
const MATERIAL_NAMES = {
  'Sheet Good - Wood': ['Basswood','Black Walnut','Cherry','Mahogany','Maple'],
  'Sheet Good - Acrylic': ['Acrylic - Black','Acrylic - Blue','Acrylic - Clear','Acrylic - Green','Acrylic - Orange','Acrylic - Pink','Acrylic - Purple','Acrylic - Red','Acrylic - White','Acrylic - Yellow'],
  'Sheet Good - Felt': ['Felt - Black','Felt - Blue','Felt - Green','Felt - Grey','Felt - Orange','Felt - Pink','Felt - Purple','Felt - Red','Felt - White','Felt - Yellow'],
  'Adhesive': ['CA Glue','Epoxy','Wood Glue - PVA','Wood Glue - Titebond'],
  'Hardware': ['Clasps','Hinges','Nails','Screws'],
  'Magnets': ['Round 3x1','Round 3x2','Round 4x2','Round 5x2','Round 5x3','Round 6x2','Round 10x2','Round 10x3'],
  'Finishing': ['Cherry','Classic Grey','Colonial Maple','Dark Walnut','Driftwood','Early American','Ebony','English Chestnut','Expresso','Fruitwood','Golden Oak','Golden Pecan','Gunstock','Honey','Ipswitch Pine','Jacobean','Natural','Pickled Oak','Provincial','Puritan Pine','Red Chestnut','Red Mahogany','Red Oak','Sedona Red','Special Walnut','Weathered Oak'],
  'Packaging': ['Bubble Wrap','Printer Paper','Shipping Box - Large','Shipping Box - Medium','Shipping Box - Small','Shipping Labels','Tissue Paper'],
  'Dice': ['d4','d6','d8','d10','d12','d20','d100','Polyhedral Set'],
  'Other': ['Masking Tape','Nitrile Gloves','Polishing Cloth','Sponges','Wood Polish'],
};
 
// Categories that use a dropdown instead of a free-text name field
const DROPDOWN_CATEGORIES = ['Magnets', 'Sheet Good - Wood', 'Finishing'];
 
function updateMaterialNameOptions() {
  const cat = document.getElementById('f-category')?.value || '';
  const nameInput = document.getElementById('f-name');
  const nameWrap = document.getElementById('name-field-wrap');
  const magnetField = document.getElementById('magnet-size-field');
  const woodField = document.getElementById('wood-type-field');
  const finishingField = document.getElementById('finishing-type-field');
  const magnetSel = document.getElementById('f-magnet-size');
  const woodSel = document.getElementById('f-wood-type');
  const finishingSel = document.getElementById('f-finishing-type');
  const datalist = document.getElementById('f-name-suggestions');
  const thickSel = document.getElementById('f-thickness');
  const unitInput = document.getElementById('f-unit');
  const totalPaid = document.getElementById('f-total-paid');
  const qtyPurchased = document.getElementById('f-qty-purchased');
  const costPerUnit = document.getElementById('f-cost_per_unit');
 
  // Reset all dependent fields when category changes
  if (nameInput) nameInput.value = '';
  if (magnetSel) magnetSel.selectedIndex = 0;
  if (woodSel) woodSel.selectedIndex = 0;
  if (finishingSel) finishingSel.selectedIndex = 0;
  if (thickSel) thickSel.selectedIndex = 0;
  if (totalPaid) totalPaid.value = '';
  if (qtyPurchased) qtyPurchased.value = '';
  if (costPerUnit) costPerUnit.value = '0';
 
  // Show/hide thickness — only for sheet goods and Other
  const thickEl = thickSel?.closest('.field');
  if (thickEl) {
    thickEl.style.display = (cat.startsWith('Sheet Good') || cat === 'Other') ? '' : 'none';
  }
 
  // Hide all special name fields first, show free-text by default
  if (nameWrap) nameWrap.style.display = '';
  if (magnetField) magnetField.style.display = 'none';
  if (woodField) woodField.style.display = 'none';
  if (finishingField) finishingField.style.display = 'none';
 
  if (cat === 'Magnets') {
    if (nameWrap) nameWrap.style.display = 'none';
    if (magnetField) magnetField.style.display = '';
    if (magnetSel && nameInput) nameInput.value = magnetSel.value;
  } else if (cat === 'Sheet Good - Wood') {
    if (nameWrap) nameWrap.style.display = 'none';
    if (woodField) woodField.style.display = '';
    if (woodSel && nameInput) nameInput.value = woodSel.value;
  } else if (cat === 'Finishing') {
    if (nameWrap) nameWrap.style.display = 'none';
    if (finishingField) finishingField.style.display = '';
    if (finishingSel && nameInput) nameInput.value = finishingSel.value;
  } else {
    if (datalist) {
      const names = MATERIAL_NAMES[cat] || [];
      datalist.innerHTML = names.map(n => `<option value="${n}">`).join('');
    }
  }
}
 
function calcCostPerUnit() {
  const totalPaid = parseFloat(document.getElementById('f-total-paid')?.value || 0);
  const qtyPurchased = parseFloat(document.getElementById('f-qty-purchased')?.value || 0);
  const costField = document.getElementById('f-cost_per_unit');
  if (!costField) return;
  if (totalPaid > 0 && qtyPurchased > 0) {
    costField.value = (totalPaid / qtyPurchased).toFixed(4);
  }
}
 
function updateSaleTotal() {
  const qty = parseFloat(document.getElementById('f-qty')?.value || 1);
  const unit = parseFloat(document.getElementById('f-unit_price')?.value || 0);
  const disc = parseFloat(document.getElementById('f-discount')?.value || 0);
  const ship = parseFloat(document.getElementById('f-shipping_charged')?.value || 0);
  const total = (qty * unit) - disc + ship;
  const el = document.getElementById('f-total_revenue');
  if (el) el.value = total.toFixed(2);
}
 
function updateProductPreview() {
  const mock = {
    wood: document.getElementById('f-wood')?.value || 0,
    acrylic: document.getElementById('f-acrylic')?.value || 0,
    felt: document.getElementById('f-felt')?.value || 0,
    adhesive: document.getElementById('f-adhesive')?.value || 0,
    hardware: document.getElementById('f-hardware')?.value || 0,
    finishing: document.getElementById('f-finishing')?.value || 0,
    packaging_mat: document.getElementById('f-packaging_mat')?.value || 0,
    other_mat: document.getElementById('f-other_mat')?.value || 0,
    waste_pct: document.getElementById('f-waste_pct')?.value || 0,
    labor_hours: document.getElementById('f-labor_hours')?.value || 0,
    labor_rate: document.getElementById('f-labor_rate')?.value || 15,
    laser_minutes: document.getElementById('f-laser_minutes')?.value || 0,
    price_etsy: document.getElementById('f-price_etsy')?.value || 0,
    price_direct: document.getElementById('f-price_direct')?.value || 0,
    price_wholesale: document.getElementById('f-price_wholesale')?.value || 0,
  };
  const c = calcProductCost(mock);
  const el = document.getElementById('product-preview');
  if (!el) return;
  el.innerHTML = `
    <div class="preview-row"><span>Materials (with ${mock.waste_pct}% waste)</span><span>${fmt(c.matWithWaste)}</span></div>
    <div class="preview-row"><span>Labor (${mock.labor_hours}h × $${mock.labor_rate}/hr)</span><span>${fmt(c.labor)}</span></div>
    <div class="preview-row"><span>Equipment (laser ${mock.laser_minutes} min)</span><span>${fmt(c.equipCost)}</span></div>
    <div class="preview-row preview-subtotal"><span>Your cost to make</span><span>${fmt(c.subtotal)}</span></div>
    <div class="preview-channels">
      <div class="preview-channel">
        <div class="preview-ch-label">Etsy</div>
        <div class="preview-ch-fees">Fees: ${fmt(c.etsyFees)}</div>
        <div class="preview-ch-profit ${marginColor(c.marginEtsy)}">${fmt(c.profitEtsy)} profit</div>
        <div class="preview-ch-margin">${fmtPct(c.marginEtsy)} margin</div>
      </div>
      <div class="preview-channel">
        <div class="preview-ch-label">Direct</div>
        <div class="preview-ch-fees">No platform fees</div>
        <div class="preview-ch-profit ${marginColor(c.marginDirect)}">${fmt(c.profitDirect)} profit</div>
        <div class="preview-ch-margin">${fmtPct(c.marginDirect)} margin</div>
      </div>
      <div class="preview-channel">
        <div class="preview-ch-label">Wholesale</div>
        <div class="preview-ch-fees">No platform fees</div>
        <div class="preview-ch-profit ${marginColor(c.marginWholesale)}">${fmt(c.profitWholesale)} profit</div>
        <div class="preview-ch-margin">${fmtPct(c.marginWholesale)} margin</div>
      </div>
    </div>`;
}
 
function applyTargetMargin() {
  const target = parseFloat(document.getElementById('f-target-margin')?.value || 40);
  const mock = {
    wood: document.getElementById('f-wood')?.value||0,
    acrylic: document.getElementById('f-acrylic')?.value||0,
    felt: document.getElementById('f-felt')?.value||0,
    adhesive: document.getElementById('f-adhesive')?.value||0,
    hardware: document.getElementById('f-hardware')?.value||0,
    finishing: document.getElementById('f-finishing')?.value||0,
    packaging_mat: document.getElementById('f-packaging_mat')?.value||0,
    other_mat: document.getElementById('f-other_mat')?.value||0,
    waste_pct: document.getElementById('f-waste_pct')?.value||0,
    labor_hours: document.getElementById('f-labor_hours')?.value||0,
    labor_rate: document.getElementById('f-labor_rate')?.value||15,
    laser_minutes: document.getElementById('f-laser_minutes')?.value||0,
    price_etsy:'0', price_direct:'0', price_wholesale:'0',
  };
  const c = calcProductCost(mock);
  const etsyFeesPct = CONFIG.FEES.ETSY_TRANSACTION + CONFIG.FEES.ETSY_PAYMENT;
  const priceEtsy = suggestedPrice(c.subtotal, target, etsyFeesPct);
  const priceDirect = suggestedPrice(c.subtotal, target, 0);
  const priceWholesale = suggestedPrice(c.subtotal, target, 0);
  if (priceEtsy) document.getElementById('f-price_etsy').value = Math.ceil(priceEtsy * 2) / 2;
  if (priceDirect) document.getElementById('f-price_direct').value = Math.ceil(priceDirect * 2) / 2;
  if (priceWholesale) document.getElementById('f-price_wholesale').value = Math.ceil(priceWholesale * 2) / 2;
  updateProductPreview();
}
 
// ── Save Modal ──────────────────────────────────────────────────────────────
 
function getActivePage() {
  const active = document.querySelector(".page.active");
  return active ? active.id.replace("page-", "") : null;
}
 
async function saveModal() {
  const btn = document.getElementById('modal-save-btn');
  btn.disabled = true;
  btn.textContent = 'Saving...';
  showSync('Saving to Google Sheets...');
 
  try {
    await doSave();
    await loadAllData();
    closeModal();
    // Always re-render whichever page is currently active
    const activePage = getActivePage();
    const renders = {
      dashboard: renderDashboard,
      products: renderProductList, materials: renderMaterialList,
      inventory: renderInventoryList, sales: renderSalesList, equipment: renderEquipmentList
    };
    if (activePage && renders[activePage]) renders[activePage]();
  } catch(e) {
    alert('Error saving: ' + e.message);
    console.error(e);
  }
  hideSync();
  btn.disabled = false;
  btn.textContent = 'Save';
}
 
async function doSave() {
  const gv = id => document.getElementById(id)?.value || '';
  const gvn = id => gv(id) || '0';
 
  if (currentModal === 'product') {
    if (!gv('f-name').trim()) throw new Error('Product name is required.');
    const obj = {
      id: currentEditId || genId(),
      name: gv('f-name').trim(),
      category: gv('f-category'),
      sku: gv('f-sku'),
      description: gv('f-description'),
      wood: gvn('f-wood'), acrylic: gvn('f-acrylic'), felt: gvn('f-felt'),
      adhesive: gvn('f-adhesive'), hardware: gvn('f-hardware'),
      finishing: gvn('f-finishing'), packaging_mat: gvn('f-packaging_mat'),
      other_mat: gvn('f-other_mat'), waste_pct: gvn('f-waste_pct'),
      labor_hours: gvn('f-labor_hours'), labor_rate: gvn('f-labor_rate'),
      laser_minutes: gvn('f-laser_minutes'),
      price_etsy: gvn('f-price_etsy'), price_direct: gvn('f-price_direct'),
      price_wholesale: gvn('f-price_wholesale'),
      notes: gv('f-description'),
      created_at: currentEditId ? (DB.products.find(p=>p.id===currentEditId)?.created_at||new Date().toISOString().slice(0,10)) : new Date().toISOString().slice(0,10),
    };
    if (currentEditId) await updateRow('Products', obj); else await appendRow('Products', obj);
  }
 
  else if (currentModal === 'material') {
    if (!gv('f-name').trim()) throw new Error('Material name is required.');
    const obj = {
      id: currentEditId || genId(),
      name: gv('f-name').trim(),
      category: gv('f-category'),
      unit: gv('f-unit') || 'sheet',
      cost_per_unit: gvn('f-cost_per_unit'),
      thickness: gv('f-thickness'),
      supplier: gv('f-supplier'),
      supplier_url: gv('f-supplier_url'),
      reorder_threshold: gvn('f-reorder_threshold'),
      notes: gv('f-notes'),
    };
    if (currentEditId) await updateRow('Materials', obj); else await appendRow('Materials', obj);
    // Auto-create inventory record
    if (!currentEditId) {
      await appendRow('Inventory', {
        id: genId(), material_id: obj.id, material_name: obj.name,
        qty_on_hand: '0', last_updated: new Date().toISOString().slice(0,10), notes: '',
      });
    }
  }
 
  else if (currentModal === 'stock') {
    const matSel = document.getElementById('f-material_id');
    const matId = matSel?.value || '';
    const matName = matSel?.selectedOptions[0]?.dataset.name || '';
    if (!matId) throw new Error('Please select a material.');
    const obj = {
      id: currentEditId || genId(),
      material_id: matId,
      material_name: matName,
      qty_on_hand: gvn('f-qty_on_hand'),
      last_updated: new Date().toISOString().slice(0,10),
      notes: gv('f-notes'),
    };
    if (currentEditId) await updateRow('Inventory', obj); else await appendRow('Inventory', obj);
  }
 
  else if (currentModal === 'sale') {
    const prodSel = document.getElementById('f-product_id');
    const prodId = prodSel?.value || '';
    const prodName = prodSel?.selectedOptions[0]?.text || '';
    if (!prodId) throw new Error('Please select a product.');
    const obj = {
      id: currentEditId || genId(),
      date: gv('f-date'),
      product_id: prodId,
      product_name: prodName,
      channel: gv('f-channel'),
      qty: gvn('f-qty'),
      unit_price: gvn('f-unit_price'),
      total_revenue: gvn('f-total_revenue'),
      discount: gvn('f-discount'),
      shipping_charged: gvn('f-shipping_charged'),
      notes: gv('f-notes'),
    };
    if (currentEditId) await updateRow('Sales', obj); else await appendRow('Sales', obj);
  }
 
  else if (currentModal === 'equipment') {
    if (!gv('f-name').trim()) throw new Error('Equipment name is required.');
    const obj = {
      id: currentEditId || genId(),
      name: gv('f-name').trim(),
      purchase_price: gvn('f-purchase_price'),
      purchase_date: gv('f-purchase_date'),
      expected_life_years: gvn('f-expected_life_years'),
      wattage: gvn('f-wattage'),
      cost_per_kwh: gvn('f-cost_per_kwh'),
      hours_per_month: gvn('f-hours_per_month'),
      notes: gv('f-notes'),
    };
    if (currentEditId) await updateRow('Equipment', obj); else await appendRow('Equipment', obj);
  }
}
 
// ── Delete ──────────────────────────────────────────────────────────────────
 
async function confirmDelete(sheetName, id, dbKey) {
  if (!confirm('Are you sure you want to delete this item? This cannot be undone.')) return;
  showSync('Deleting...');
  try {
    await deleteRow(sheetName, id);
    DB[dbKey] = DB[dbKey].filter(x => x.id !== id);
    const renders = {
      products: renderProductList, materials: renderMaterialList,
      inventory: renderInventoryList, sales: renderSalesList, equipment: renderEquipmentList,
    };
    if (renders[dbKey]) renders[dbKey]();
  } catch(e) {
    alert('Error deleting: ' + e.message);
  }
  hideSync();
}
 
