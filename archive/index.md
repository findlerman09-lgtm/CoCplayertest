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
{% assign recent_documents = site.data.documents.items | where: "released", true | where: "visibility", "shared" | where: "recent", true %}
<div class="frame-grid archive-primary">
  <a class="frame feature-frame" href="{{ '/investigators/' | relative_url }}">
    <header><span>Investigator</span><b>01</b></header>
    <div class="archive-investigator-card-body">
      <div class="archive-dossier-symbol single" aria-hidden="true"><span>R</span></div>
      <div class="archive-investigator-copy"><strong>Private Dossier</strong><p>Your survey password opens only your investigator file.</p></div>
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

{% if recent_documents.size > 0 %}
<section class="archive-recent-documents">
  <div class="document-shelf">
    <header><div><small>Recently Filed</small><strong>New Shared Material</strong></div><span>{{ recent_documents.size }}</span></header>
    <div class="archive-document-links">
      {% for doc in recent_documents %}
      <a href="{{ '/documents/#document-' | append: doc.id | relative_url }}"><small>{{ doc.type_label | default: doc.type }}</small><strong>{{ doc.title }}</strong><span>{{ doc.summary }}</span></a>
      {% endfor %}
    </div>
  </div>
</section>
{% endif %}
