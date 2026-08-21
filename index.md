---
layout: section
permalink: /
title: Home
display_title: Player Archive
top_nav: home
section_title: Player Archive
section_note: The landing page surfaces the roster, current file, and material newly available to players.
breadcrumb: The Rippers / Home
page_status: Case File I
page_status_class: active
kicker: The Rippers
summary: One compact entry point for the investigators, shared material, and the three linked case files.
---
<div class="frame-grid home-grid">
  <a class="frame feature-frame" href="{{ '/investigators/' | relative_url }}">
    <header><span>Investigators</span><b>01</b></header>
    <div class="feature-character">
      <img src="{{ '/assets/images/clara-portrait.webp' | relative_url }}" alt="Portrait of Clara Whitcombe">
      <div><small>Prototype dossier</small><strong>Clara Whitcombe</strong><p>Open the investigator roster and enter an individual dossier.</p></div>
    </div>
  </a>

  <a class="frame dark-frame" href="{{ '/campaign-files/' | relative_url }}">
    <header><span>Campaign Files</span><b>02</b></header>
    <div class="frame-body campaign-mini">
      <div class="mini-file active"><b>I</b><span>Active</span></div>
      <div class="mini-file sealed"><b>II</b><span>Sealed</span></div>
      <div class="mini-file sealed"><b>III</b><span>Sealed</span></div>
    </div>
  </a>

  <a class="frame parchment-frame" href="{{ '/documents/' | relative_url }}">
    <header><span>Shared Archive</span><b>03</b></header>
    <div class="frame-body"><strong>Documents</strong><p>Material released to the whole table belongs here. Personal material remains inside an investigator dossier.</p></div>
  </a>
</div>

<div class="frame-grid two-one home-secondary">
  <article class="frame parchment-frame">
    <header><span>Recently Added</span><b>04</b></header>
    <div class="frame-body list-lines">
      <a href="{{ '/characters/clara-whitcombe/correspondence/' | relative_url }}"><small>Correspondence</small><strong>Sealed demonstration letter</strong><span>Clara Whitcombe</span></a>
      <a href="{{ '/characters/clara-whitcombe/' | relative_url }}"><small>Dossier</small><strong>Character overview</strong><span>Clara Whitcombe</span></a>
    </div>
  </article>
  <article class="frame dark-frame">
    <header><span>Purpose</span><b>05</b></header>
    <div class="frame-body"><p>The home screen is intentionally small: it tells a player what changed and gives them one-click access to their dossier or released material.</p></div>
  </article>
</div>
