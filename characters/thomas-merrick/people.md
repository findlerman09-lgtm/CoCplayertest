---
layout: section
permalink: /characters/thomas-merrick/people/
title: People
display_title: People Who Matter
top_nav: investigators
character_slug: thomas-merrick
context_nav: people
breadcrumb: The Rippers / Investigators / Thomas Merrick
kicker: Relationships & Connections
summary: The people and institutions that matter in Merrick's ordinary life.
---
{% assign dossier_pages = site.pages | where: "character_slug", page.character_slug %}
{% assign dossier = dossier_pages | where: "context_nav", "overview" | first %}
<div class="relationship-grid">
  {% for person in dossier.people %}
  <article class="frame parchment-frame relationship-card"><header><span>{{ person.name }}</span><b>0{{ forloop.index }}</b></header><div class="frame-body"><div class="relationship-heading"><span class="person-initial large">{{ person.name | slice: 0 }}</span><div><small>{{ person.relationship }}</small><strong>{{ person.name }}</strong></div></div><p>{{ person.text }}</p></div></article>
  {% endfor %}
</div>
<article class="frame dark-frame relationship-note"><header><span>Standing Has Limits</span><b>03</b></header><div class="frame-body"><p>Merrick's professional relationships do not turn every request into an order. City Police standing is real inside its remit; cooperation outside it must still be obtained. The approved physician relationship is intentionally absent until that investigator's final identity is reconciled.</p></div></article>
