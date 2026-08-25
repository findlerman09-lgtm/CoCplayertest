---
layout: section
permalink: /characters/clara-mercer/people/
title: People
display_title: People Who Matter
top_nav: investigators
character_slug: clara-mercer
context_nav: people
breadcrumb: The Rippers / Investigators / Clara Mercer
kicker: Relationships & Sources
summary: The people Clara knows through family, the newspaper trade, and prior reporting.
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
<article class="frame dark-frame relationship-note"><header><span>A Source Is a Relationship</span><b>06</b></header><div class="frame-body"><p>Previous restraint, corrections, favors, payment, and trust can make a conversation possible. None of them guarantees cooperation. Sources may refuse, lie, bargain, protect somebody else, or decide that speaking to Clara is no longer worth the cost.</p></div></article>
