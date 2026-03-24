#!/usr/bin/env python3
"""
generate-csv.py — Scan a folder of artwork images and generate artworks.csv

Usage:
    python generate-csv.py /path/to/gallery/still-life/images

Expected filename format:
    {Title} - {Medium} on {Substrate} - {Price}.jpg
    e.g. Red Roses - Oils on Polymin - £650.jpg

Output:
    artworks.csv in the parent directory of the images folder
"""

import os
import sys
import csv
import re


def parse_filename(filename):
    """Parse an artwork filename into its components.

    Expected format: {Title} - {Medium} on {Substrate} - {Price}.jpg
    Returns a dict or None if the format doesn't match.
    """
    name = os.path.splitext(filename)[0]  # strip extension

    # Pattern: Title - Medium on Substrate - Price
    match = re.match(r'^(.+?)\s*-\s*(.+?)\s+on\s+(.+?)\s*-\s*(.+)$', name)
    if not match:
        return None

    return {
        'filename': filename,
        'title': match.group(1).strip(),
        'medium': match.group(2).strip(),
        'substrate': match.group(3).strip(),
        'price': match.group(4).strip(),
        'sold': 'n',
        'show_price': 'y',
        'sold_style': 'dot'
    }


def main():
    if len(sys.argv) < 2:
        print('Usage: python generate-csv.py <folder-path>')
        print('  folder-path: path to the images folder (e.g. gallery/still-life/images)')
        sys.exit(1)

    folder = sys.argv[1]

    if not os.path.isdir(folder):
        print(f'Error: "{folder}" is not a valid directory.')
        sys.exit(1)

    # Find all .jpg files
    files = sorted([
        f for f in os.listdir(folder)
        if f.lower().endswith(('.jpg', '.jpeg'))
    ])

    if not files:
        print(f'No .jpg files found in "{folder}".')
        sys.exit(0)

    rows = []
    skipped = []

    for f in files:
        parsed = parse_filename(f)
        if parsed:
            rows.append(parsed)
        else:
            skipped.append(f)

    # Write CSV to parent directory of the images folder
    output_dir = os.path.dirname(os.path.abspath(folder))
    output_path = os.path.join(output_dir, 'artworks.csv')

    fieldnames = ['filename', 'title', 'medium', 'substrate', 'price', 'sold', 'show_price', 'sold_style']

    with open(output_path, 'w', newline='', encoding='utf-8') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    print(f'Generated {output_path}')
    print(f'  {len(rows)} artworks parsed successfully.')

    if skipped:
        print(f'  {len(skipped)} files skipped (unrecognised format):')
        for s in skipped:
            print(f'    - {s}')


if __name__ == '__main__':
    main()
