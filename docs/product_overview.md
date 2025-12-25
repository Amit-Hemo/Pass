# Product Overview

## Problem Statement

Clothing stores often face long queues, leading to customer frustration and lost sales. Traditional checkout processes are slow and require manual intervention by cashiers.

## Solution: Pass

"Pass" is a self-checkout solution for clothing stores that combines a mobile application with a Unified Security Product (Smart Tag) attached to the clothes. This allows customers to scan, pay for, and unlock the security tags themselves, effectively eliminating the need for cashiers.

## Key Features

- **Mobile App**: Allows users to scan items, view details, build a cart, and pay.
- **Unified Security Product**: A composed hardware model that integrates the microcontroller (Arduino), NFC Shield and tag (for communication), and a locking mechanism (Solenoid) into a single shell attached to the clothing.
- **NFC-Only Scanning**: The app uses the phone's NFC capability to read product data directly from the tag.
- **Flexible Payment Flow**:
  - **Single Payment**: Scan a product and pay for it immediately to release it.
  - **Cart Payment**: Scan multiple products, add them to a digital cart, and pay for all of them in one transaction.
- **Inventory Management**: Server tracks tag availability to prevent double-selling.

## Target Audience

- **Shoppers**: Who want a limitless, queue-free shopping experience.
- **Retailers**: Who want to reduce staffing costs and improve customer satisfaction.
