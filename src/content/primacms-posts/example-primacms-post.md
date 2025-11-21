---
title: "Example PrimaCMS Post"
excerpt: "This is an example blog post managed through PrimaCMS, demonstrating the merged content system."
date: "2024-01-15"
author: "PrimaCMS User"
authorRole: "Content Manager"
authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop"
category: "PrimaCMS"
image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=1200&h=600&fit=crop"
---

# Welcome to PrimaCMS

This is an example blog post created in the PrimaCMS content directory. It demonstrates how content from multiple sources can be merged together.

## Features

- Content from `src/content/posts/` and `src/content/primacms-posts/` are automatically merged
- All posts appear together in the blog index
- Posts maintain their original formatting and metadata

## How It Works

The system uses a utility function that:

1. Fetches posts from both collections
2. Merges them into a single array
3. Sorts them by date (newest first)
4. Returns the combined result

This allows you to manage content from multiple sources while presenting it as a unified blog.
