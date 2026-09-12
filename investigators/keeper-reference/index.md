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
summary: A local, Keeper-directed view of the five investigators and the Adventure I running notes. Open it only on the Keeper's device.
---
<section class="keeper-reference frame dark-frame" data-keeper-reference>
  <header><span>Investigator Quick Reference</span></header>
  <div class="frame-body">
    <div data-keeper-closed>
      <p>Five investigator summaries and Adventure I running notes for use at the table.</p>
      <form class="lock-form keeper-key-form" data-keeper-key-form>
        <label for="keeper-reference-key"><span>Keeper passcode</span><input id="keeper-reference-key" type="password" autocomplete="off" autocapitalize="characters" spellcheck="false" required></label>
        <button type="submit" class="keeper-open" data-keeper-open aria-controls="keeper-reference-content" aria-expanded="false">Open Keeper Reference</button>
        <p class="lock-status" data-keeper-key-status role="status" aria-live="polite">Your successful unlock will be remembered on this device.</p>
      </form>
    </div>
    <div id="keeper-reference-content" data-keeper-content hidden>
      <p class="keeper-local-note">Open on this browser. This view does not change player dossiers or campaign records.</p>
      <div class="keeper-tabs" role="tablist" aria-label="Keeper reference sections">
        {% for slot in site.data.investigator_slots %}
          {% assign person = site.data.player_characters[slot.slug] %}
          <button type="button" role="tab" id="keeper-tab-{{ slot.slug }}" aria-controls="keeper-panel-{{ slot.slug }}" aria-selected="{% if forloop.first %}true{% else %}false{% endif %}" tabindex="{% if forloop.first %}0{% else %}-1{% endif %}" data-keeper-tab="{{ slot.slug }}">{{ person.publication_name }}</button>
        {% endfor %}
        <button type="button" role="tab" id="keeper-tab-scenario" aria-controls="keeper-panel-scenario" aria-selected="false" tabindex="-1" data-keeper-tab="scenario">Scenario</button>
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
      <article class="keeper-panel" id="keeper-panel-scenario" role="tabpanel" aria-labelledby="keeper-tab-scenario" data-keeper-panel="scenario" hidden>
        <div class="keeper-identity">
          <div><small>Adventure I · London, 30 September–1 October 1888</small><h2>Who Is Jack?</h2><p>One session: 215 designed minutes and 25 minutes of protected elasticity.</p></div>
          <p class="keeper-role"><span>Keeper truth</span>Edwin Vale is the human killer. The Clockwork Surgeon is an impossible physical apparatus that requires his placement and manipulation; it does not act on its own.</p>
        </div>

        <div class="keeper-columns">
          <section>
            <h3>Investigation spine</h3>
            <ol>
              <li>Establish the human offender's need for privacy, position, access, carrying, concealment, and storage.</li>
              <li>Compare viable commercial trades; reach Penfold through ordinary inquiry.</li>
              <li>Use records, workers, and contradictions to identify Vale. Preserve at least two independent evidence families plus corroboration.</li>
              <li>Follow the move to Act III. Reveal gross impossibility directly, teach stable geometry through visible cause and effect, and let the players disrupt the operation and stop Vale.</li>
            </ol>
          </section>
          <section>
            <h3>Table clock</h3>
            <ul>
              <li><strong>0:22</strong> · Prologue closes; cut toward Monday.</li>
              <li><strong>1:14</strong> · Penfold reached; Act I ends.</li>
              <li><strong>2:19</strong> · Vale known; investigation becomes movement.</li>
              <li><strong>3:22</strong> · Act III complete; Vale stopped and Surgeon unusable.</li>
              <li><strong>3:35</strong> · Designed play complete; elasticity begins.</li>
              <li><strong>3:45</strong> · Add no fresh complexity; resolve only Surgeon state and Vale outcome.</li>
              <li><strong>3:58</strong> · State the real victory and stop.</li>
            </ul>
          </section>
        </div>

        <div class="keeper-columns">
          <section>
            <h3>Beats to protect</h3>
            <ul>
              <li>Mitre Square's outer murder window is <strong>1:30–1:44 a.m.</strong>; relay the Goulston apron discovery at about <strong>2:55 a.m.</strong>, not earlier.</li>
              <li>Cadosch: “I looked” → “He looked at me” → a brief impossible downward glimpse. His account identifies neither Vale nor Penfold and teaches no Surgeon operating rule.</li>
              <li>Keep facts separate from hypotheses. The first direct, testable Surgeon revelation belongs in Act III.</li>
              <li>Default to no new victim. Early seizure, restraint, containment, or prevented deployment is a legitimate win.</li>
            </ul>
          </section>
          <section>
            <h3>Handout release reminders</h3>
            <ul>
              <li><strong>H1 · Chronology:</strong> at synthesis after the principal times are gathered.</li>
              <li><strong>H2 · Penfold day book:</strong> when the office record is secured by ordinary access, persuasion, or search.</li>
              <li><strong>H3 · Merton's Query:</strong> when the correspondence is found or produced.</li>
              <li><strong>H4 · Canning's Key Note:</strong> with the relevant key or office material.</li>
              <li><strong>H5 · Working Hypotheses:</strong> at first group synthesis; leave it on the table.</li>
            </ul>
            <h3>When play slows</h3>
            <p>Give automatic information for a reasonable professional action. Roll for extra detail, speed, cooperation, or risk; failure changes cost or position, not whether the essential route exists. At 3:45 remove secondary complications, not earned consequences.</p>
          </section>
        </div>
      </article>
    </div>
  </div>
</section>
<script defer src="{{ '/assets/keeper-reference.js' | relative_url }}"></script>
