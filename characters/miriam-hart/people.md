---
layout: section
permalink: /characters/miriam-hart/people/
title: People
display_title: People Who Matter
top_nav: investigators
character_slug: miriam-hart
context_nav: people
breadcrumb: The Rippers / Investigators / Miriam Hart
kicker: Relationships & Connections
summary: The people Miriam knows, trusts, and accepts responsibility toward.
---
{% assign dossier_pages = site.pages | where: "character_slug", page.character_slug %}
{% assign dossier = dossier_pages | where: "context_nav", "overview" | first %}
<div class="relationship-grid">
  {% for person in dossier.people %}
  <article class="frame parchment-frame relationship-card">
    <header><span>{{ person.name }}</span><b>0{{ forloop.index }}</b></header>
    <div class="frame-body"><div class="relationship-heading"><span class="person-initial large">{{ person.name | slice: 0 }}</span><div><small>{{ person.relationship }}</small><strong>{{ person.name }}</strong></div></div><p>{{ person.text }}</p></div>
  </article>
  {% endfor %}
</div>
<article class="frame dark-frame relationship-note"><header><span>Reciprocal Trust</span><b>03</b></header><div class="frame-body"><p>People who trust Miriam still own their information. Familiarity can make a conversation possible, but it never guarantees disclosure, obedience, or access to another household's private affairs.</p></div></article>
