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
    {% assign case_documents = site.data.documents.items | where: "listed", true | where: "visibility", "shared" | where: "case_file", file.id %}
    {% assign case_releases = site.data.case_releases.items | where: "listed", true | where: "case_file", file.id %}
    {% assign people_count = file.known_people | size %}
    {% assign location_count = file.known_locations | size %}
    {% assign initial_release_count = 0 %}
    {% for release in case_releases %}{% unless release.source_lock %}{% assign initial_release_count = initial_release_count | plus: 1 %}{% endunless %}{% endfor %}
    <article class="frame dark-frame" id="case-{{ file.id }}">
      <header><span>{{ file.title }}</span><b>{{ file.status_label | default: file.status }}</b></header>
      <div class="frame-body">
        <p>{{ file.summary }}</p>

        {% if file.status == 'sealed' %}
        <section class="case-file-sealed">
          <span aria-hidden="true">R</span>
          <strong>File Sealed</strong>
          <p>No contents are available from this file yet.</p>
        </section>
        {% else %}
          <div class="case-file-progress-row" aria-label="Case file summary">
            <div class="case-file-progress-chip"><b data-case-file-open-count>0</b><span>opened records</span></div>
            <div class="case-file-progress-chip"><b data-case-known-location-count data-base-count="{{ location_count }}">{{ location_count }}</b><span>known locations</span></div>
            <div class="case-file-progress-chip"><b data-case-known-people-count data-base-count="{{ people_count }}">{{ people_count }}</b><span>known people</span></div>
          </div>

          {% if case_documents.size > 0 %}
          <section class="document-shelf case-folder-shelf">
            <header><div><small>Filed Material</small><strong>Opened Shared Documents</strong></div><span><span data-case-file-document-count>0</span> open</span></header>
            <div class="archive-document-links">
              {% for doc in case_documents %}
              <a href="{{ '/documents/#document-' | append: doc.id | relative_url }}" hidden data-case-file-opened-link="{{ doc.lock.id }}"><small>{{ doc.type_label | default: doc.type }}</small><strong data-case-file-opened-title>{{ doc.title }}</strong><span>{{ doc.summary }}</span></a>
              {% endfor %}
            </div>
            <p class="case-folder-empty" data-case-file-open-empty>No shared document has been opened on this browser profile yet.</p>
          </section>
          {% endif %}

          {% if case_releases.size > 0 %}
          <section class="case-release-shelf" aria-label="Sealed case releases">
            <header><div><small>Keeper-controlled release</small><strong>People & Visual Records</strong></div><span><span data-case-release-visible-count>{{ initial_release_count }}</span> filed</span></header>
            <div class="case-release-grid">
              {% for release in case_releases %}
                {% include case-release-record.html release=release %}
              {% endfor %}
            </div>
          </section>
          {% endif %}

          <div class="frame-grid two-one case-known-grid">
            <section class="frame parchment-frame">
              <header><span>Known People</span><b data-case-known-people-count data-base-count="{{ people_count }}">{{ people_count }}</b></header>
              <div class="frame-body people-preview-list">
                {% for person in file.known_people %}
                <div class="case-known-entry" data-case-known-person-base="{{ person.name | escape }}"><span class="person-initial">{{ person.name | slice: 0 }}</span><div><strong>{{ person.name }}</strong>{% if person.note %}<p>{{ person.note }}</p>{% endif %}</div></div>
                {% endfor %}
                <div data-case-known-people></div>
                {% if people_count == 0 %}<p class="case-known-empty" data-case-known-people-empty>People will be added here as opened records make them part of the filed case.</p>{% endif %}
              </div>
            </section>

            <section class="frame parchment-frame">
              <header><span>Known Locations</span><b data-case-known-location-count data-base-count="{{ location_count }}">{{ location_count }}</b></header>
              <div class="frame-body people-preview-list">
                {% for place in file.known_locations %}
                <div class="case-known-entry" data-case-known-location-base="{{ place.name | escape }}"><span class="person-initial">⌖</span><div><strong>{{ place.name }}</strong>{% if place.note %}<p>{{ place.note }}</p>{% endif %}</div></div>
                {% endfor %}
                <div data-case-known-locations></div>
              </div>
            </section>
          </div>

          {% if case_documents.size == 0 and case_releases.size == 0 and people_count == 0 and location_count == 0 %}
          <p class="case-folder-empty">Nothing else has been filed to this case yet.</p>
          {% endif %}
        {% endif %}
      </div>
    </article>
  {% endfor %}
</div>
{% endif %}

<script defer src="{{ '/assets/case-desk.js' | relative_url }}"></script>
