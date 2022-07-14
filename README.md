# Wat is dit?

Een website die het (hopelijk) wat makkelijker maakt om uit te rekenen hoeveel de buitenlandse valuta die je als loon hebt ontvangen waard is in euro's, volgens de Belastingdienst.

# Hoe werkt het?

De app download XML bestanden van de Belastingdienst, leest ze uit en presenteert dat op een wat makkelijker te gebruiken manier aan de gebruiker. 

Alle berekeningen worden client-side gedaan. De webserver ziet alleen dat iemand de bestanden heeft opgevraagd, maar voor de rest niets.

# English

## What is this?

A small website that makes it a lot easier to calculate how much money you earned, according to the monthly currency exchange rates provided by the Belastingdienst.


## How does it work?

We simply fetch the XML files that the Belastingdienst publishes, and do some nice formatting on them.

All processing happens clientside, all the server knows (and caches) is the fact that you request XML files for a specific month.

# License

This project is licensed under the 0bsd license.

See `LICENSE` for more information.