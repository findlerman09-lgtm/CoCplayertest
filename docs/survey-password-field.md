# Historical note — survey-created dossier password

**Status: SUPERSEDED / DO NOT IMPLEMENT**

An earlier access model asked players to create a private dossier password as an administrative field on the spoiler-free character survey.

That model has been retired.

The current player site uses **campaign-issued dossier passwords** generated during dossier assembly. The spoiler-free survey should not request, score, store, or export a dossier password for this purpose.

Only salted PBKDF2 verifiers are stored in the public player-site repository; plaintext campaign-issued passwords are distributed separately to the relevant players.
