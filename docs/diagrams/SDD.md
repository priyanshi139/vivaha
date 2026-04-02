# Software Design Description (SDD)

## 1. Introduction

### 1.1 Purpose

This document describes the system design of the "Vivaha - AI-Based Wedding Planning App", developed using Google AI Studio and vibe coding techniques.

### 1.2 Scope

The document explains system architecture, modules, data handling, and integration of AI for intelligent wedding planning.

---

## 2. System Architecture

The system follows a modern AI-integrated architecture:

* Frontend: HTML, CSS, JavaScript
* AI Layer: Google AI Studio (Generative AI for recommendations and suggestions)
* Backend Logic: API-based interaction with AI services
* Data Handling: Local storage / structured data handling

---

## 3. Module Design

### 3.1 User Module

* User registration and login
* Role-based access (Admin, Vendor, Couple)

### 3.2 Vendor Module

* Vendor listing and management
* Service categorization

### 3.3 Booking Module

* Service booking functionality
* Booking status tracking

### 3.4 Budget Module

* Budget planning and expense tracking
* AI suggestions for cost optimization

### 3.5 Guest Management Module

* Guest list creation and management

### 3.6 AI Recommendation Module

* Suggests vendors based on user preferences
* Provides theme and decoration ideas
* Recommends budget-friendly options using AI

---

## 4. Data Design

The system manages:

* User profiles
* Vendor details
* Booking records
* Budget data
* Guest lists
* AI-generated recommendations

---

## 5. Interface Design

* Interactive and user-friendly UI
* Dashboard-based navigation
* AI-powered suggestion panels
* Forms for user input
* Dynamic content display

---

## 6. System Workflow

1. User logs into the application
2. Selects role (Admin/Vendor/Couple)
3. Enters preferences (budget, theme, location)
4. AI generates personalized recommendations
5. User books services and manages planning

---

## 7. Design Constraints

* Requires internet connection for AI functionality
* Dependent on Google AI Studio API availability
* Performance depends on network speed

---


