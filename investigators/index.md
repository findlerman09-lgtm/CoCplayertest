---
layout: section
permalink: /investigators/
title: Investigators
display_title: Private Dossiers
top_nav: investigators
hide_info_rail: true
breadcrumb: The Rippers / Investigators
kicker: Private Files
summary: Enter the personal dossier key you created before play.
---
{% assign team_view = site.data.site_state.team_view %}
<section class="dossier-cabinet" data-investigator-cabinet>
  {% unless team_view %}
  <div class="dossier-key-panel">
    <small>Personal access</small>
    <strong>One key opens one dossier.</strong>
    <form class="dossier-key-form" data-dossier-key-form>
      <label class="visually-hidden" for="dossier-key">Dossier key</label>
      <input id="dossier-key" type="password" autocomplete="current-password" placeholder="Enter your dossier key">
      <button type="submit">Open</button>
      <p class="dossier-key-status" data-dossier-key-status></p>
    </form>
  </div>
  {% else %}
  <div class="team-view-banner">Investigator roster available</div>
  {% endunless %}

  <div class="sealed-dossier-grid">
    {% for slot in site.data.investigator_slots %}
      {% assign person = nil %}
      {% if slot.slug %}{% assign person = site.data.characters[slot.slug] %}{% endif %}

      {% if team_view and person %}
      <a class="team-investigator-card" href="{{ '/characters/' | append: slot.slug | append: '/' | relative_url }}">
        <span class="slot-roman">{{ slot.numeral }}</span>
        <img src="{{ person.portrait | relative_url }}" alt="{{ person.name }}">
        <div class="team-investigator-copy"><small>{{ person.occupation }}</small><strong>{{ person.name }}</strong><span>Open dossier →</span></div>
      </a>
      {% else %}
      <article class="dossier-slot is-sealed" data-dossier-slot="{{ slot.numeral }}" {% if person %}data-dossier-candidate data-dossier-slug="{{ slot.slug }}" data-salt="{{ person.lock.salt }}" data-verifier="{{ person.lock.verifier }}" data-iterations="{{ person.lock.iterations }}"{% endif %}>
        <span class="slot-roman">{{ slot.numeral }}</span>
        <div class="sealed-card-face" data-sealed-face>
          <small>Private file</small>
          <strong>Sealed</strong>
        </div>
        {% if person %}
        <div class="unlocked-card-face" data-unlocked-face hidden>
          <small>Dossier key accepted</small>
          <strong>Your dossier</strong>
          <a class="dossier-open-link" href="{{ '/characters/' | append: slot.slug | append: '/' | relative_url }}">Open dossier →</a>
        </div>
        {% endif %}
      </article>
      {% endif %}
    {% endfor %}
  </div>
</section>
