---
layout: section
permalink: /investigators/keeper-reference/
title: Keeper Character Reference
display_title: Keeper Character Reference
top_nav: investigators
hide_context_rail: true
hide_info_rail: true
keeper_reference: true
breadcrumb: The Rippers / Investigator / Keeper Reference
kicker: Live table
summary: A local, Keeper-directed view of the five issued investigators. Open it only on the Keeper's device.
---
<section class="keeper-reference frame dark-frame" data-keeper-reference>
  <header><span>Investigator Quick Reference</span></header>
  <div class="frame-body">
    <div data-keeper-closed>
      <p>Five investigator summaries for use while running the game.</p>
      <button type="button" class="keeper-open" data-keeper-open aria-controls="keeper-reference-content" aria-expanded="false">Open Keeper Reference</button>
    </div>
    <div id="keeper-reference-content" data-keeper-content hidden>
      <p class="keeper-local-note">Open on this browser. This view does not change player dossiers or campaign records.</p>
      <div class="keeper-tabs" role="tablist" aria-label="Investigators">
        {% for slot in site.data.investigator_slots %}
          {% assign person = site.data.player_characters[slot.slug] %}
          <button type="button" role="tab" id="keeper-tab-{{ slot.slug }}" aria-controls="keeper-panel-{{ slot.slug }}" aria-selected="{% if forloop.first %}true{% else %}false{% endif %}" tabindex="{% if forloop.first %}0{% else %}-1{% endif %}" data-keeper-tab="{{ slot.slug }}">{{ person.publication_name }}</button>
        {% endfor %}
      </div>
      {% for slot in site.data.investigator_slots %}
        {% assign person = site.data.player_characters[slot.slug] %}
        {% assign mechanics = site.data.characters[slot.slug] %}
        {% assign guide = site.data.keeper_reference[slot.slug] %}
        <article class="keeper-panel" id="keeper-panel-{{ slot.slug }}" role="tabpanel" aria-labelledby="keeper-tab-{{ slot.slug }}" data-keeper-panel="{{ slot.slug }}"{% unless forloop.first %} hidden{% endunless %}>
          <div class="keeper-identity">
            <div><small>Investigator · {{ slot.numeral }}</small><h2>{{ person.publication_name }}</h2><p>{{ person.age }} · {{ person.occupation_display }}</p><p>{{ person.summary }}</p></div>
            <p class="keeper-role"><span>Table approach</span>{{ person.roleplay_anchor }}</p>
          </div>

          <section aria-label="Core values">
            <h3>Core Values</h3>
            <dl class="keeper-stats">
              <div><dt>HP</dt><dd>{{ person.derived.hp }}</dd></div>
              <div><dt>SAN</dt><dd>{{ person.derived.sanity }}</dd></div>
              <div><dt>Luck</dt><dd>{{ person.derived.luck }}</dd></div>
              <div><dt>MP</dt><dd>{{ person.derived.mp }}</dd></div>
              <div><dt>MOV</dt><dd>{{ person.derived.mov }}</dd></div>
              <div><dt>Build</dt><dd>{{ person.derived.build }}</dd></div>
              <div><dt>DB</dt><dd>{{ person.derived.db }}</dd></div>
            </dl>
            <dl class="keeper-characteristics">{% for characteristic in person.characteristics %}<div><dt>{{ characteristic.name }}</dt><dd>{{ characteristic.value }}</dd></div>{% endfor %}</dl>
          </section>

          <div class="keeper-columns">
            <section>
              <h3>Key Skills</h3>
              <p class="keeper-section-lead">Strongest / most relevant</p>
              <dl class="keeper-skills featured">{% for skill in mechanics.skills %}{% if guide.featured contains skill.id %}<div><dt>{{ skill.name }}</dt><dd>{{ skill.value }}%</dd></div>{% endif %}{% endfor %}</dl>
              <p class="keeper-section-lead">Other useful skills</p>
              <dl class="keeper-skills">{% for skill in mechanics.skills %}{% if guide.useful contains skill.id %}<div><dt>{{ skill.name }}</dt><dd>{{ skill.value }}%</dd></div>{% endif %}{% endfor %}</dl>
            </section>
            <section>
              <h3>Combat &amp; Pulp</h3>
              <dl class="keeper-combat">
                <div><dt>Fighting (Brawl)</dt><dd>{{ person.combat.brawl }}</dd></div>
                <div><dt>Unarmed damage</dt><dd>{{ person.combat.unarmed_damage }}</dd></div>
                <div><dt>Dodge</dt><dd>{{ person.combat.dodge }}</dd></div>
                <div><dt>Firearm</dt><dd>{{ person.combat.firearm }}</dd></div>
              </dl>
              <p class="keeper-talent"><strong>{{ person.talent.name }}</strong><span>{{ person.talent.effect }} {{ person.talent.note }}</span></p>
            </section>
          </div>

          <div class="keeper-columns">
            <section>
              <h3>Adventure I Hook</h3>
              <p>{{ guide.hook }}</p>
              <h3>Competence Spotlight</h3>
              <p><strong>{{ person.player_edges[0].title }}</strong> — {{ person.player_edges[0].text }}</p>
              <h3>Pressure Point</h3>
              <p>{{ person.known_pressure }}</p>
            </section>
            <section>
              <h3>Access &amp; Authority</h3>
              <ul>{% for access in person.professional_access %}<li>{{ access }}</li>{% endfor %}</ul>
              <p><strong>Requires permission:</strong> {{ person.requires_permission | join: ' ' }}</p>
              <p><strong>Limits:</strong> {{ person.access_limits | join: ' ' }}</p>
            </section>
          </div>

          <div class="keeper-columns">
            <section>
              <h3>Key Relationships</h3>
              <ul class="keeper-relations">{% for relation in person.people %}<li><strong>{{ relation.name }}</strong> · {{ relation.relationship }} — {{ relation.text }}</li>{% endfor %}{% for relation in person.relationships %}<li><strong>{{ relation.name }}</strong> · {{ relation.relationship }} — {{ relation.text }}</li>{% endfor %}</ul>
            </section>
            <section class="keeper-use">
              <h3>Keeper Use</h3>
              <dl>
                <div><dt>Know automatically</dt><dd>{{ guide.automatic }}</dd></div>
                <div><dt>Spotlight when</dt><dd>{{ guide.spotlight }}</dd></div>
                <div><dt>Natural avenue</dt><dd>{{ guide.clue }}</dd></div>
                <div><dt>Do not grant automatically</dt><dd>{{ guide.not_automatic }}</dd></div>
              </dl>
            </section>
          </div>
        </article>
      {% endfor %}
    </div>
  </div>
</section>
<script defer src="{{ '/assets/keeper-reference.js' | relative_url }}"></script>
