---
layout: section
permalink: /characters/clara-whitcombe/documents/
title: Documents
display_title: Personal Documents
top_nav: investigators
character_slug: clara-whitcombe
context_nav: documents
breadcrumb: The Rippers / Investigator / Clara Whitcombe
kicker: Personal Archive
summary: Material Clara personally receives, creates, or keeps in her own files.
---
{% assign released = site.data.documents.items | where: "released", true | where: "visibility", "personal" | where: "owner", page.character_slug | where: "channel", "documents" %}

{% if released.size == 0 %}
<section class="document-empty-state personal-empty">
  <span class="document-empty-mark">CW</span>
  <small>Personal archive</small>
  <strong>No personal documents are filed yet.</strong>
  <p>Photographs, notes, reports, maps, and other material belonging specifically to Clara will collect here as they enter play.</p>
</section>
{% else %}
<div class="document-library personal-library">
  <section class="document-shelf"><header><div><small>Personal Archive</small><strong>Filed Material</strong></div><span>{{ released.size }}</span></header>{% for doc in released %}{% include document-record.html doc=doc %}{% endfor %}</section>
</div>
{% endif %}
