---
title: Home
layout: home
---

# ALPRs

Automatic License Plate Readers (ALPRs) are cameras -- usually developed by private companies to **skirt constitutional protections** -- that capture and analyze images of _all_ captured vehicles in a dragnet surveillance system. Data inclues identifying data such as location, date, time, make, model, color, dents, stickers, etc. which are accumululated into massive, searchable databases.

This suveillance is conducted **without warrants** and in direct violation of the **fourth amendment**, supported by private companies which derive profits from building mass surveillance systems.

_Functionally, this is the same as placing a tracker in every vehicle within the United States to track their movement._

# Tracking the spread of ALPR Surveillance

We map Automatic License Plate Reader (ALPR) infrastructure and document how it impacts our privacy and civil liberties.

See the [map]({{site.baseurl}}/map/)

<div>
Currently, <strong id="alpr-count">...</strong> ALPRs have been mapped in San Diego.
<script>
  fetch('https://theflockers.opencodingsociety.com/alpr/locations')
    .then(response => {
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    })
    .then(data => {
      const features = data.features || data;
      const totalCameras = features.length;
      document.getElementById('alpr-count').innerText = totalCameras.toLocaleString();
    })
    .catch(error => {
      console.error("Error fetching camera count:", error);
      document.getElementById('alpr-count').innerText = "many";
    });
</script>
</div>
