---
layout: section
permalink: /documents/
title: Documents
display_title: Shared Documents
top_nav: documents
hide_info_rail: true
breadcrumb: The Rippers / Documents
kicker: Shared Material
summary: Material currently available to the whole table.
---
{% assign listed = site.data.documents.items | where: "listed", true | where: "visibility", "shared" %}
{% assign images = listed | where: "section", "images" %}
{% assign correspondence = listed | where: "section", "correspondence" %}
{% assign reports = listed | where: "section", "reports" %}
{% assign notes = listed | where: "section", "notes" %}

{% if listed.size == 0 %}
<section class="document-empty-state">
  <span class="document-empty-mark">R</span>
  <small>Shared archive</small>
  <strong>No shared documents are filed yet.</strong>
  <p>Only material deliberately listed for the table will appear here.</p>
</section>
{% else %}
<div class="document-library">
  {% if images.size > 0 %}<section class="document-shelf" id="photographs"><header><div><small>Images & Maps</small><strong>Visual Records</strong></div><span>{{ images.size }}</span></header>{% for doc in images %}{% include document-record.html doc=doc %}{% endfor %}</section>{% endif %}
  {% if correspondence.size > 0 %}<section class="document-shelf" id="correspondence"><header><div><small>Correspondence</small><strong>Letters & Telegrams</strong></div><span>{{ correspondence.size }}</span></header>{% for doc in correspondence %}{% include document-record.html doc=doc %}{% endfor %}</section>{% endif %}
  {% if reports.size > 0 %}<section class="document-shelf" id="reports"><header><div><small>Press & Reports</small><strong>Published & Formal Records</strong></div><span>{{ reports.size }}</span></header>{% for doc in reports %}{% include document-record.html doc=doc %}{% endfor %}</section>{% endif %}
  {% if notes.size > 0 %}<section class="document-shelf" id="notes"><header><div><small>Notes & Records</small><strong>Other Filed Material</strong></div><span>{{ notes.size }}</span></header>{% for doc in notes %}{% include document-record.html doc=doc %}{% endfor %}</section>{% endif %}
</div>
{% endif %}
