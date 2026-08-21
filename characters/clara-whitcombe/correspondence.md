---
layout: section
permalink: /characters/clara-whitcombe/correspondence/
title: Correspondence
display_title: Correspondence
top_nav: investigators
character_slug: clara-whitcombe
context_nav: correspondence
breadcrumb: The Rippers / Investigator / Clara Whitcombe
page_status: 1 Sealed Item
page_status_class: sealed
kicker: Private Material
summary: Letters and telegrams addressed specifically to Clara.
---
{% assign released = site.data.documents.items | where: "released", true | where: "visibility", "personal" | where: "owner", page.character_slug | where: "channel", "correspondence" %}

{% if released.size == 0 %}
<section class="document-empty-state personal-empty">
  <span class="document-empty-mark">CW</span>
  <small>Correspondence</small>
  <strong>No private correspondence is filed yet.</strong>
</section>
{% else %}
<div class="document-library personal-library">
  <section class="document-shelf correspondence-shelf">
    <header><div><small>Private Correspondence</small><strong>Letters & Telegrams</strong></div><span>{{ released.size }}</span></header>
    {% for doc in released %}{% include document-record.html doc=doc %}{% endfor %}
  </section>
</div>
{% endif %}
