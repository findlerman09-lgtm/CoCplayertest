---
layout: section
permalink: /campaign-files/
title: Case Files
display_title: Case Files
top_nav: campaign
hide_info_rail: true
breadcrumb: The Rippers / Case Files
kicker: Filed Material
summary: Shared material and known developments associated with cases already opened in play.
---
{% assign visible_files = site.data.case_files.files | where: "visible", true %}

{% if visible_files.size == 0 %}
<section class="document-empty-state">
  <span class="document-empty-mark">R</span>
  <small>Case archive</small>
  <strong>No case file is available.</strong>
</section>
{% else %}
<div class="frame-grid">
  {% for file in visible_files %}
    {% assign case_documents = site.data.documents.items | where: "released", true | where: "visibility", "shared" | where: "case_file", file.id %}
    <article class="frame dark-frame" id="case-{{ file.id }}">
      <header><span>{{ file.title }}</span><b>{{ file.status_label | default: file.status }}</b></header>
      <div class="frame-body">
        <p>{{ file.summary }}</p>

        {% if case_documents.size > 0 %}
        <section class="document-shelf case-folder-shelf">
          <header><div><small>Filed Material</small><strong>Shared Documents</strong></div><span>{{ case_documents.size }}</span></header>
          <div class="archive-document-links">
            {% for doc in case_documents %}
            <a href="{{ '/documents/#document-' | append: doc.id | relative_url }}"><small>{{ doc.type_label | default: doc.type }}</small><strong>{{ doc.title }}</strong><span>{{ doc.summary }}</span></a>
            {% endfor %}
          </div>
        </section>
        {% endif %}

        {% assign people_count = file.known_people | size %}
        {% assign location_count = file.known_locations | size %}
        {% if people_count > 0 or location_count > 0 %}
        <div class="frame-grid two-one case-known-grid">
          {% if people_count > 0 %}
          <section class="frame parchment-frame">
            <header><span>Known People</span><b>{{ people_count }}</b></header>
            <div class="frame-body people-preview-list">
              {% for person in file.known_people %}
              <div class="case-known-entry"><span class="person-initial">{{ person.name | slice: 0 }}</span><div><strong>{{ person.name }}</strong>{% if person.note %}<p>{{ person.note }}</p>{% endif %}</div></div>
              {% endfor %}
            </div>
          </section>
          {% endif %}

          {% if location_count > 0 %}
          <section class="frame parchment-frame">
            <header><span>Known Locations</span><b>{{ location_count }}</b></header>
            <div class="frame-body people-preview-list">
              {% for place in file.known_locations %}
              <div class="case-known-entry"><span class="person-initial">⌖</span><div><strong>{{ place.name }}</strong>{% if place.note %}<p>{{ place.note }}</p>{% endif %}</div></div>
              {% endfor %}
            </div>
          </section>
          {% endif %}
        </div>
        {% endif %}

        {% if case_documents.size == 0 and people_count == 0 and location_count == 0 %}
        <p class="case-folder-empty">Nothing else has been filed to this case yet.</p>
        {% endif %}
      </div>
    </article>
  {% endfor %}
</div>
{% endif %}
