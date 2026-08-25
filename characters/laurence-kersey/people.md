---
layout: section
permalink: /characters/laurence-kersey/people/
title: People
display_title: People Who Matter
top_nav: investigators
character_slug: laurence-kersey
context_nav: people
breadcrumb: The Rippers / Investigators / Laurence Kersey
kicker: Relationships & Connections
summary: Family, professional colleagues, and trusted working relationships in Kersey's ordinary medical life.
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
<article class="frame dark-frame relationship-note"><header><span>Professional Boundary</span><b>05</b></header><div class="frame-body"><p>A patient is still a patient when information would be useful. Medical access creates duties as well as opportunities; referral, injury, or distress never becomes automatic permission to interrogate or disclose.</p></div></article>
