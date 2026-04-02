# Vivaha - Wedding Planning App

 Project Objective
Real-World Problem
Planning a destination wedding in India is notoriously fragmented. Couples juggle dozens of vendors across spreadsheets, WhatsApp groups, and word-of-mouth referrals  with no central platform that speaks the language of luxury. The current landscape forces high-spending couples (₹10L–₹30L+ budgets) to:

Independently discover and vet photographers, decorators, caterers, venues, and makeup artists across different cities
Manually coordinate between vendors who have no established working relationships
Lose track of budgets, timelines, and task lists without dedicated tooling
Receive generic AI suggestions not tailored to Indian wedding culture or destination event logistics

VIVAHA solves this by acting as a luxury digital wedding concierge a single platform where couples discover vendors, manage their entire wedding workflow, and get AI-powered planning assistance, all wrapped in a premium, high-trust experience.

##  Features

* Role-based Login (Admin / Vendor)
* Couple Dashboard (Guest management, budget, checklist)
* Vendor Dashboard (Manage services & bookings)
* Admin Dashboard (Manage users & vendors)
* Booking System
* Notifications
* Splash Screen UI

 Features Implemented
Mapped to Functional Requirements (FRs):
FR-01 · Authentication & Role Management

Mobile number and email login
OTP-based verification (phone + email)
Role selection: To-Be Bride / To-Be Groom / Vendor
Separate onboarding flows per role

FR-02 · Client Onboarding

Personal details form (name, DOB, address, city, state, zip)
Wedding details (date, city decision, budget bracket: ₹10L–₹30L+)
Conditional wedding city fields (shown only if location is decided)

FR-03 · Vendor Onboarding & Verification

Business registration form (company name, address, city, state, zip)
Multi-select service checklist (12 categories)
Mandatory verification: GST number, Aadhaar, Government ID, Business proof
Portfolio upload: photos, videos, event galleries

FR-04 · Power Pair Vendor Feature

Vendors can link with a collaboration partner
Power Pair badges displayed on vendor cards
Couples can book both vendors in a single flow (e.g., Photographer + Decorator)

FR-05 · Client Homepage

Maroon hero card showing couple names, wedding date, and location
"To Be Finalized" fallback when location is not set


icon to invite fiancé via phone number or email


Shared account management post-acceptance

FR-06 · Live Vendor Offers

Dynamic offer tiles below the hero card
Offer categories: photography, venue, décor bundles
Offer unlock gated behind VIVAHA Premium subscription

FR-07 · Premium Subscription

One-time upgrade: ₹10,000
Unlocks: vendor offers, AI assistant, priority booking, personalized checklists, exclusive destination vendors
Upgrade CTA banner on homepage

FR-08 · To-Do List / Task Manager

Pre-loaded wedding task tiles (book venue, hire photographer, etc.)
Drag-and-drop reordering
Mark tasks complete
Add custom tasks

FR-09 · AI Checklist Assistant (Premium)

Floating chatbot icon (Premium-only)
Generates personalized wedding checklist
Suggests timeline and priorities based on wedding date and budget

FR-10 · Inspiration Boards

Create boards by category (Decor, Outfits, Venue, Photography, Food, Other)
Upload images or paste Pinterest links with auto-preview fetch
Per-board notes for color palettes, ideas, and inspirations
Real wedding gallery from VIVAHA-planned events

FR-11 · Build Wedding Package Page

Tab interface: Power Pairs / Solo Experts / Top Vendors
Filter by: category, budget, location, rating
Book individual vendors or Power Pair bundles

FR-12 · Vendor Dashboard

Booking request management
Upcoming wedding calendar
Service listing editor
Client messaging inbox
Review display
Revenue overview panel

FR-13 · Messaging System

Conversation list with timestamp
Real-time chat interface (client ↔ vendor)
Image sharing support

FR-14 · Profile Page

View and edit: user details, wedding details, budget, fiancé account link
Saved vendors list
Subscription status display

FR-15 · Navigation

Bottom navigation bar: Home · To-Do List · Inspiration Boards · Build Package · Profile
All 5 tabs fully functional with distinct views
---

##  Tech Stack

* HTML, CSS, JavaScript
* LocalStorage

---


