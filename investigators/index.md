---
layout: section
permalink: /investigators/
title: Investigators
display_title: Private Dossier
top_nav: investigators
hide_info_rail: true
hide_context_rail: true
breadcrumb: The Rippers / Investigators
---
{% assign team_view = site.data.site_state.team_view %}
{% if team_view %}
<section class="team-roster-view">
  <div class="section-intro team-intro">
    <p class="eyebrow">Investigators</p>
    <p class="section-summary">The people now known to be involved.</p>
  </div>
  <div class="team-roster-grid">
    {% for slot in site.data.investigator_slots %}
      {% if slot.slug %}
        {% assign person = site.data.characters[slot.slug] %}
        <a class="team-investigator-card" href="{{ '/characters/' | append: slot.slug | append: '/' | relative_url }}">
          <span class="slot-roman">{{ slot.numeral }}</span>
          <img src="{{ person.portrait | relative_url }}" alt="{{ person.name }}">
          <div class="team-investigator-copy"><small>{{ person.occupation }}</small><strong>{{ person.name }}</strong><span>Open dossier →</span></div>
        </a>
      {% endif %}
    {% endfor %}
  </div>
</section>
{% else %}
<section class="investigator-entry-screen" data-investigator-cabinet>
  <div class="lock-card investigator-entry-card">
    <div class="lock-mark">R</div>
    <p class="eyebrow">Private investigator dossier</p>
    <h1>Password Required</h1>
    <p>Enter the personal dossier password you created before play.</p>
    <form class="lock-form" data-dossier-key-form>
      <label><span>Dossier password</span><input type="password" autocomplete="current-password" autofocus></label>
      <button type="submit">Open Dossier</button>
      <p class="lock-status" data-dossier-key-status>Your successful unlock will be remembered on this device.</p>
    </form>

    <div class="dossier-candidates" hidden aria-hidden="true">
      {% for slot in site.data.investigator_slots %}
        {% if slot.slug %}
          {% assign person = site.data.characters[slot.slug] %}
          <span data-dossier-candidate data-dossier-slug="{{ slot.slug }}" data-salt="{{ person.lock.salt }}" data-verifier="{{ person.lock.verifier }}" data-iterations="{{ person.lock.iterations }}" data-target="{{ '/characters/' | append: slot.slug | append: '/' | relative_url }}"></span>
        {% endif %}
      {% endfor %}
    </div>
  </div>
</section>
{% endif %}
