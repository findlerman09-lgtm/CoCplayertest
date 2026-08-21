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
summary: Current condition, fast mechanical reference, and improvement marks.
---
{% assign c = site.data.characters[page.character_slug] %}
{% assign dossier_pages = site.pages | where: "character_slug", page.character_slug %}
{% assign dossier = dossier_pages | where: "context_nav", "overview" | first %}

<div class="condition-banner-row">
  <div><small>Physical</small><strong class="condition-chip stable" data-hp-condition>Stable</strong></div>
  <div><small>Mental</small><strong class="condition-chip stable" data-san-condition>Stable</strong></div>
</div>

<div class="sheet-tracker event-aware-tracker">
  <section class="tracker-card event-tracker-card">
    <div class="tracker-heading"><span>Hit Points</span><b><span data-state-display="hp">{{ c.hp }}</span> / {{ c.max_hp }}</b></div>
    <div class="tracker-value-row"><button type="button" data-state-key="hp" data-state-delta="-1" data-state-max="{{ c.max_hp }}">−</button><input type="number" min="0" max="{{ c.max_hp }}" value="{{ c.hp }}" data-state-input="hp" aria-label="Current hit points"><button type="button" data-state-key="hp" data-state-delta="1" data-state-max="{{ c.max_hp }}">+</button></div>
    <small class="manual-note">Use − / + for corrections and healing.</small>
    <div class="event-entry-block">
      <label for="damage-entry">Damage from one attack</label>
      <div class="event-entry-row"><input id="damage-entry" type="number" min="0" inputmode="numeric" data-damage-entry><button type="button" data-apply-damage>Apply</button></div>
    </div>
    <p class="tracker-alert" data-hp-alert>Enter damage from one attack to apply wound rules automatically.</p>
    <label class="wound-toggle"><input type="checkbox" data-state-input="majorWound"> Major Wound marked</label>
  </section>

  <section class="tracker-card event-tracker-card sanity-card">
    <div class="tracker-heading"><span>Sanity</span><b><span data-state-display="sanity">{{ c.sanity }}</span> / {{ c.max_sanity }}</b></div>
    <div class="tracker-value-row"><button type="button" data-state-key="sanity" data-state-delta="-1" data-state-max="{{ c.max_sanity }}">−</button><input type="number" min="0" max="{{ c.max_sanity }}" value="{{ c.sanity }}" data-state-input="sanity" aria-label="Current sanity"><button type="button" data-state-key="sanity" data-state-delta="1" data-state-max="{{ c.max_sanity }}">+</button></div>
    <small class="manual-note">Use − / + only for manual correction or recovery.</small>
    <div class="event-entry-block">
      <label for="sanity-loss-entry">SAN lost from one event</label>
      <div class="event-entry-row"><input id="sanity-loss-entry" type="number" min="0" inputmode="numeric" data-sanity-loss-entry><button type="button" data-apply-sanity-loss>Apply</button></div>
    </div>
    <div class="sanity-period-meter"><span>Current period</span><b><span data-sanity-period-loss>0</span> / <span data-sanity-threshold>9</span></b><small>Started at <span data-sanity-period-start>{{ c.sanity }}</span> SAN</small></div>
    <p class="tracker-alert" data-san-alert>Enter SAN lost from one event to test one-time and cumulative thresholds.</p>
    <div class="temp-resolution" data-temp-resolution-panel hidden>
      <span>Resolve the required INT roll:</span>
      <div><button type="button" data-temp-resolution="success">INT Success</button><button type="button" data-temp-resolution="failure">INT Failure</button></div>
    </div>
    <div class="tracker-utility-row"><button type="button" class="small-action" data-reset-sanity-period>New SAN period</button><button type="button" class="small-action" data-clear-sanity-condition>Clear insanity condition</button></div>
  </section>

  <section class="tracker-card luck-card">
    <div class="tracker-heading"><span>Luck</span><b data-state-display="luck">{{ c.luck }}</b></div>
    <div class="tracker-value-row"><button type="button" data-state-key="luck" data-state-delta="-1" data-state-max="99">−</button><input type="number" min="0" max="99" value="{{ c.luck }}" data-state-input="luck" aria-label="Current Luck"><button type="button" data-state-key="luck" data-state-delta="1" data-state-max="99">+</button></div>
    <small class="manual-note">Current Luck is remembered on this device.</small>
    <div class="quick-derived">
      <div><span>MP</span><b>9</b></div>
      <div><span>Move</span><b>{{ dossier.combat.mov }}</b></div>
      <div><span>Build</span><b>{{ dossier.combat.build }}</b></div>
      <div><span>DB</span><b>{{ dossier.combat.db }}</b></div>
    </div>
  </section>
</div>

<article class="frame dark-frame characteristic-frame">
  <header><span>Characteristics</span><b>01</b></header>
  <div class="frame-body characteristic-grid">
    {% for stat in dossier.characteristics %}
    <div class="characteristic-card"><span>{{ stat.name }}</span><b>{{ stat.value }}</b><small>{{ stat.half }} / {{ stat.fifth }}</small></div>
    {% endfor %}
  </div>
</article>

<div class="frame-grid two-one sheet-working-grid">
  <article class="frame parchment-frame">
    <header><span>Skills</span><b>02</b></header>
    <div class="frame-body">
      <p class="skill-instruction">Mark an eligible skill after a qualifying successful use. One mark is enough before the next improvement phase.</p>
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

  <div class="frame-grid sheet-side-stack">
    <article class="frame dark-frame">
      <header><span>Improvement Queue</span><b>03</b></header>
      <div class="frame-body">
        <p>Marked skills collect here for the next improvement phase.</p>
        <ul class="improvement-list" data-improvement-list><li class="empty-improvement">No skill checks marked yet.</li></ul>
        <div class="improvement-actions"><button class="small-action" type="button" data-clear-skill-checks>Clear resolved checks</button></div>
      </div>
    </article>

    <article class="frame dark-frame">
      <header><span>Talent & Combat</span><b>04</b></header>
      <div class="frame-body quick-rule-stack">
        <div><small>Talent</small><strong>{{ dossier.talent.name }}</strong><p>{{ dossier.talent.text }}</p></div>
        <div><small>Brawl</small><strong>{{ dossier.combat.brawl }}</strong></div>
        <div><small>Dodge</small><strong>{{ dossier.combat.dodge }}</strong></div>
        <button class="small-action" type="button" data-reset-character-state>Reset local tracker</button>
        <p class="sheet-note">Reset restores this device's condition and improvement state to the dossier defaults.</p>
      </div>
    </article>
  </div>
</div>
