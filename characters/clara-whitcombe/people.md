---
layout: section
permalink: /characters/clara-whitcombe/people/
title: People
display_title: People Who Matter
top_nav: investigators
character_slug: clara-whitcombe
context_nav: people
breadcrumb: The Rippers / Investigators / Clara Whitcombe
kicker: Relationships & Connections
summary: The people Clara knows, trusts, works with, or would rather avoid.
---
{% assign dossier_pages = site.pages | where: "character_slug", page.character_slug %}
{% assign dossier = dossier_pages | where: "context_nav", "overview" | first %}

<div class="relationship-grid">
  {% for person in dossier.people %}
  <article class="frame parchment-frame relationship-card">
    <header><span>{{ person.name }}</span><b>0{{ forloop.index }}</b></header>
    <div class="frame-body">
      <div class="relationship-heading"><span class="person-initial large">{{ person.name | slice: 0 }}</span><div><small>{{ person.relationship }}</small><strong>{{ person.name }}</strong></div></div>
      <p>{{ person.text }}</p>
    </div>
  </article>
  {% endfor %}
</div>

<article class="frame dark-frame relationship-note">
  <header><span>Favors Have Limits</span><b>04</b></header>
  <div class="frame-body"><p>These people belong to Clara's ordinary life. Their help, patience, and willingness to become involved can change through play, especially when a favor costs time, money, reputation, or safety.</p></div>
</article>
