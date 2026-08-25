---
layout: section
permalink: /characters/arthur-bell/people/
title: People
display_title: People Who Matter
top_nav: investigators
character_slug: arthur-bell
context_nav: people
breadcrumb: The Rippers / Investigators / Arthur Bell
kicker: Relationships & Connections
summary: Approved connections in Bell's ordinary life.
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
<article class="frame dark-frame relationship-note"><header><span>Filing Hold</span><b>03</b></header><div class="frame-body"><p>Eliza Price and Henry Pritchard are approved Bell relationships. Their final reveal-safe relationship descriptions have not yet been supplied to this implementation pass. The unresolved reporter relationship is intentionally absent until its final identity is approved.</p></div></article>
