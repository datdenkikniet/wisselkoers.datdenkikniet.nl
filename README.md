# What is this?

A small website that makes it a lot easier to calculate how much money you earned, according to the monthly currency exchange rates provided by the Belastingdienst.

# How does it work?

We simply fetch the XML files that the Belastingdienst publishes, and do some nice formatting on them.

All processing happens clientside, all the server knows (and caches) is the fact that you request XML files for a specific month.