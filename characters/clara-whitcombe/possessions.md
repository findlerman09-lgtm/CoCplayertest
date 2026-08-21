---
layout: section
permalink: /characters/clara-whitcombe/possessions/
title: Possessions
display_title: Possessions & Means
top_nav: investigators
character_slug: clara-whitcombe
context_nav: possessions
breadcrumb: The Rippers / Investigators / Clara Whitcombe
kicker: Equipment & Resources
summary: Carried gear, professional equipment, and financial means.
---
{% assign dossier_pages = site.pages | where: "character_slug", page.character_slug %}
{% assign dossier = dossier_pages | where: "context_nav", "overview" | first %}

<div class="frame-grid two-one possessions-grid">
  <article class="frame parchment-frame">
    <header><span>Professional & Carried Equipment</span><b>01</b></header>
    <div class="frame-body possession-list">
      {% for item in dossier.gear %}
      <div class="possession-row"><span>◆</span><p>{{ item }}</p></div>
      {% endfor %}
    </div>
  </article>

  <div class="frame-grid possession-side-stack">
    <article class="frame dark-frame means-card">
      <header><span>Means</span><b>02</b></header>
      <div class="frame-body"><strong class="big-number">{{ dossier.credit_rating }}%</strong><p>Credit Rating</p><p>{{ dossier.wealth_note }}</p></div>
    </article>
    <article class="frame dark-frame">
      <header><span>Professional Access</span><b>03</b></header>
      <div class="frame-body"><p>Clara's photographic work gives her ordinary reasons to possess delicate equipment, chemicals, plates, measuring glassware, and records that would look unusual in someone else's hands.</p></div>
    </article>
  </div>
</div>
