---
layout: section
permalink: /investigators/
title: Investigator
display_title: Private Dossier
top_nav: investigators
hide_info_rail: true
hide_context_rail: true
breadcrumb: The Rippers / Investigator
---
<section class="investigator-entry-screen" data-investigator-cabinet>
  <div class="lock-card investigator-entry-card">
    <div class="lock-mark">R</div>
    <p class="eyebrow">Private investigator dossier</p>
    <h1>Password Required</h1>
    <p>Enter the dossier password issued to you for play.</p>
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
