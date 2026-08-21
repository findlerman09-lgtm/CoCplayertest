---
layout: section
permalink: /characters/clara-whitcombe/sheet/
title: Character Sheet
display_title: At the Table
top_nav: investigators
character_slug: clara-whitcombe
context_nav: sheet
breadcrumb: The Rippers / Investigators / Clara Whitcombe
page_status: Live Tracker
page_status_class: active
kicker: Clara Whitcombe
summary: Current condition, skills, and improvement marks.
---
{% assign c = site.data.characters[page.character_slug] %}

<div class="sheet-tracker">
  <div class="tracker-card">
    <span>Hit Points</span>
    <div class="tracker-value-row"><button type="button" data-state-key="hp" data-state-delta="-1" data-state-max="{{ c.max_hp }}">−</button><input type="number" min="0" max="{{ c.max_hp }}" value="{{ c.hp }}" data-state-input="hp"><button type="button" data-state-key="hp" data-state-delta="1" data-state-max="{{ c.max_hp }}">+</button></div>
    <small>Maximum {{ c.max_hp }}</small>
    <label class="wound-toggle"><input type="checkbox" data-state-input="majorWound"> Major wound marked</label>
  </div>
  <div class="tracker-card">
    <span>Sanity</span>
    <div class="tracker-value-row"><button type="button" data-state-key="sanity" data-state-delta="-1" data-state-max="{{ c.max_sanity }}">−</button><input type="number" min="0" max="{{ c.max_sanity }}" value="{{ c.sanity }}" data-state-input="sanity"><button type="button" data-state-key="sanity" data-state-delta="1" data-state-max="{{ c.max_sanity }}">+</button></div>
    <small>Current value is remembered on this device</small>
  </div>
  <div class="tracker-card">
    <span>Luck</span>
    <div class="tracker-value-row"><button type="button" data-state-key="luck" data-state-delta="-1" data-state-max="99">−</button><input type="number" min="0" max="99" value="{{ c.luck }}" data-state-input="luck"><button type="button" data-state-key="luck" data-state-delta="1" data-state-max="99">+</button></div>
    <small>Current value is remembered on this device</small>
  </div>
</div>

<div class="frame-grid two-one">
  <article class="frame parchment-frame">
    <header><span>Skills</span><b>01</b></header>
    <div class="frame-body">
      <p>Mark a skill after a successful use that qualifies for an improvement check. A skill only needs to be marked once before the next improvement phase.</p>
      <div class="interactive-skill-list">
        {% for skill in c.skills %}
        <label class="skill-check-row{% unless skill.improvable %} disabled{% endunless %}">
          {% if skill.improvable %}<input type="checkbox" data-skill-check="{{ skill.id }}" data-skill-name="{{ skill.name }}" data-skill-value="{{ skill.value }}">{% else %}<span></span>{% endif %}
          <span>{{ skill.name }}{% unless skill.improvable %}<small>Not improvement-check eligible</small>{% endunless %}</span><b>{{ skill.value }}%</b>
        </label>
        {% endfor %}
      </div>
    </div>
  </article>

  <div class="frame-grid">
    <article class="frame dark-frame">
      <header><span>Improvement Queue</span><b>02</b></header>
      <div class="frame-body">
        <p>Marked skills collect here for the next improvement phase.</p>
        <ul class="improvement-list" data-improvement-list><li class="empty-improvement">No skill checks marked yet.</li></ul>
        <div class="improvement-actions"><button class="small-action" type="button" data-clear-skill-checks>Clear resolved checks</button></div>
      </div>
    </article>
    <article class="frame dark-frame">
      <header><span>Quick Reference</span><b>03</b></header>
      <div class="frame-body"><strong>Keen Vision</strong><p>Bonus die to Spot Hidden. Brawl 40% · Dodge 30% · Damage Bonus +1D4 · Build 1 · Move 7.</p><button class="small-action" type="button" data-reset-character-state>Reset local tracker</button><p class="sheet-note">Resetting restores this device's HP, SAN, Luck, wound marker, and skill marks to the dossier defaults.</p></div>
    </article>
  </div>
</div>
