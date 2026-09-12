# GoreeCloud Feed Reading Experience

## Purpose

Define the next reading-focused improvements after the Stable web baseline. This document describes intended behavior and acceptance goals without claiming unfinished features are implemented.

## Reading modes

### Timeline mode

The default experience remains a chronological FreshRSS-backed timeline.

Goals:

- preserve user-controlled feed order and ownership;
- provide fast scanning of new articles;
- maintain clear source identity;
- avoid ranking, advertising, or engagement manipulation.

### Focus mode

A future distraction-reduced article reading surface.

Planned capabilities:

- larger typography;
- reduced interface chrome;
- quick next/previous article navigation;
- reading progress indication;
- keyboard and touch navigation.

### Saved reading queue

A dedicated saved workflow for articles intentionally kept by the user.

Planned capabilities:

- saved-only filtering;
- archive-style reading flow;
- clear completion state;
- synchronization through FreshRSS-backed mutations.

## Interaction improvements

Priority improvements:

1. smoother article transitions;
2. better mobile gestures;
3. improved empty/loading/error states;
4. richer accessibility announcements;
5. improved keyboard navigation.

## Privacy and security

Reading history, authentication data, and personal feed choices remain user-controlled. New features must preserve existing privacy boundaries and avoid analytics-based tracking.

## Acceptance

A feature is complete only after:

- Glaze UI review;
- accessibility validation;
- automated test coverage where applicable;
- web validation;
- native target validation when the feature applies to desktop or Android.
