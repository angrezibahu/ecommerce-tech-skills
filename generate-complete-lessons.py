#!/usr/bin/env python3
"""
Comprehensive script to add all missing lesson content
"""

# Read the file
with open('/home/user/ecommerce-tech-skills/js/lessons-data.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Find insertion point for Days 2-7 (after Day 1, line ~25)
# Find replacement points for Days 22-30 (lines ~193-201)

print(f"Total lines in file: {len(lines)}")

# Find Day 1 end
for i, line in enumerate(lines):
    if 'day: 1,' in line:
        print(f"Day 1 starts at line {i+1}")
    if 'DAY 8 - HTML5 SEMANTICS' in line:
        print(f"Day 8 starts at line {i+1}")
        print("Days 2-7 should be inserted before this line")
    if 'day: 22,' in line:
        print(f"Day 22 placeholder at line {i+1}")
    if 'day: 30,' in line:
        print(f"Day 30 placeholder at line {i+1}")

print("\nFile analysis complete. Ready to generate comprehensive content.")
