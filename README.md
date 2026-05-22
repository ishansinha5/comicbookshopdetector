# Comic Shop Curator: Distributed Microservices Architecture

An enterprise-grade, compute-optimized system for comic book shop localization, release tracking, and machine-learning-driven recommendations. 

This project is currently undergoing a complete architectural refactoring from a serverless monolith into a high-performance, containerized microservices ecosystem optimized for "Green AI" and minimal GPU footprint.

## Current Status: Phase 1 (Deployed)
- **Frontend Client:** The lightweight, responsive web client is currently live and deployed via Vercel. 
- **Legacy Systems Deprecated:** Initial integrations with Google Places API and monolithic ML scripts have been phased out to make way for the Phase 2 backend orchestration.

## Target Architecture: Phase 2 (Active Development)
The system is built as a distributed microservices architecture, orchestrated via **Docker Compose** within a WSL environment. The technology stack is strictly purpose-driven, with a focus on compute optimization and spatial data processing.

### Zone 1: The Client Layer (Frontend)
* **Tech:** HTML, CSS, Vanilla JavaScript.
* **Role:** A lightning-fast, zero-bloat presentation layer. Ensures mobile and desktop responsiveness, handling user inputs, image uploads, and routing to the API Gateway.

### Zone 2: The Orchestrator (API Gateway & Business Logic)
* **Tech:** Java (Spring Boot) + PostgreSQL (PostGIS).
* **Role:** The central nervous system. Manages secure user authentication, asynchronous release calendar event buses (webhooks), and highly efficient spatial queries for localized shop routing using seeded SQL data.

### Zone 3: The Efficiency Layer (High-Performance Bouncer)
* **Tech:** Native C++ (Compiled Microservice).
* **Role:** The core "Green Compute" optimization. GPU inference is computationally expensive. When an image is uploaded for analysis, this layer instantly generates a Perceptual Hash (pHash) at the byte level. It checks PostgreSQL for duplicate hashes; if a match is found, it serves cached data instantly—completely bypassing the ML layer and saving massive compute cycles.

### Zone 4: The ML Brain (Vision Analytics)
* **Tech:** Python (FastAPI), Jupyter Notebooks, CLIP (or equivalent vision model).
* **Role:** Triggered *only* when the C++ layer encounters a novel, unhashed image. Jupyter serves as the prototyping environment, while FastAPI serves the production weights via a clean REST API endpoint. 

## Future Roadmap
- **League of Comic Geeks Integration:** Modularize the Vision Identifier REST API and Release Calendar event bus for seamless integration with the League of Comic Geeks platform.

## Local Development
*Instructions for WSL / Docker Compose bootstrapping will be added as Phase 2 development continues.*