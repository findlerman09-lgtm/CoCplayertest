---
layout: section
permalink: /archive/
title: Archive
display_title: Player Archive
archive_home: true
hide_context_rail: true
breadcrumb: The Rippers / Archive
page_status: Current File
page_status_class: active
kicker: London · 1888
summary: Your private investigator dossier and material already released in play.
---
{% assign case_documents = site.data.documents.items | where: "listed", true | where: "visibility", "shared" | where: "case_file", "current-file" %}
{% assign case_releases = site.data.case_releases.items | where: "listed", true | where: "case_file", "current-file" %}
{% assign current_case = site.data.case_files.files | where: "id", "current-file" | first %}
{% assign release_count = case_releases | size %}
{% assign document_count = case_documents | size %}
{% assign tracked_count = document_count | plus: release_count %}
{% assign location_count = current_case.known_locations | size %}

<section class="frame dark-frame" aria-label="Website rehearsal status">
  <header><span>Build status</span><b>{{ site.data.site_state.web_rc1.version }}</b></header>
  <div class="frame-body">
    <strong>{{ site.data.site_state.web_rc1.phase }}</strong>
    <p>{{ site.data.site_state.web_rc1.audit }}. {{ site.data.site_state.web_rc1.final_audit }}.</p>
  </div>
</section>

<div class="frame-grid archive-primary">
  <a class="frame feature-frame" href="{{ '/investigators/' | relative_url }}">
    <header><span>Investigator</span><b>01</b></header>
    <div class="archive-investigator-card-body">
      <div class="archive-dossier-symbol single" aria-hidden="true"><span>R</span></div>
      <div class="archive-investigator-copy"><strong>Private Dossier</strong><p>Your issued dossier password opens only your investigator file.</p></div>
    </div>
  </a>

  <a class="frame parchment-frame link-frame" href="{{ '/documents/' | relative_url }}">
    <header><span>Documents</span><b>02</b></header>
    <div class="frame-body"><strong>Shared Archive</strong><p>Letters, photographs, clippings, maps, and reports available to the whole table.</p></div>
  </a>

  <a class="frame dark-frame link-frame" href="{{ '/campaign-files/' | relative_url }}">
    <header><span>Case Files</span><b>03</b></header>
    <div class="frame-body"><strong>Current File</strong><p>Released material associated with the open case.</p></div>
  </a>
</div>

<section class="case-desk" aria-label="Current case desk">
  <header><span>Case desk</span><b>LOCAL DEVICE STATE</b></header>
  <div class="case-desk-body">
    <div class="case-desk-summary">
      <div class="case-desk-intro">
        <small>{{ current_case.title }}</small>
        <strong>Your filed material grows as seals are broken.</strong>
        <p>This desk reflects what has been opened on this browser profile. It is a convenience for play, not a measure of investigative success.</p>
      </div>
      <div class="case-desk-stat"><b><span data-case-desk-open>0</span>/<span data-case-desk-total>{{ tracked_count }}</span></b><span>records open</span></div>
      <div class="case-desk-stat"><b>{{ location_count }}</b><span>known locations</span></div>
    </div>

    <div class="case-progress-track" data-case-desk-progress role="progressbar" aria-label="Opened case records" aria-valuemin="0" aria-valuenow="0" aria-valuemax="{{ tracked_count }}"></div>

    <div class="case-progress-ledger">
      {% for doc in case_documents %}
      <a class="case-progress-entry is-sealed" href="{{ '/documents/#document-' | append: doc.id | relative_url }}" data-case-progress-lock="{{ doc.lock.id }}" data-case-safe-title="{{ doc.title | escape }}">
        <small>{{ doc.type_label | default: doc.type }}</small>
        <strong data-case-progress-title>{{ doc.title }}</strong>
        <span data-case-progress-status>SEALED</span>
      </a>
      {% endfor %}
      {% for release in case_releases %}
      <a class="case-progress-entry is-sealed" href="{{ '/campaign-files/#release-' | append: release.id | relative_url }}" data-case-progress-lock="{{ release.lock.id }}" data-case-safe-title="{{ release.safe_title | default: 'Filed Record' | escape }}">
        <small>{{ release.safe_label | default: 'Case material' }}</small>
        <strong data-case-progress-title>{{ release.safe_title | default: 'Filed Record' }}</strong>
        <span data-case-progress-status>SEALED</span>
      </a>
      {% endfor %}
    </div>

    <div class="case-recent-wrap" data-case-recent-wrap>
      <small>Recently opened on this device</small>
      <div class="case-recent-grid" data-case-recent hidden></div>
    </div>
  </div>
</section>

<script defer src="{{ '/assets/case-desk.js' | relative_url }}"></script>
