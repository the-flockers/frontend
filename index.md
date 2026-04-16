---
title: Home
layout: home
---

# Tracking the spread of ALPR Surveillance

We map Automatic License Plate Reader (ALPR) infrastructure and document how it impacts our privacy and civil liberties.

See the [map]({{site.baseurl}}/map/)

Currently, <strong id="alpr-count">...</strong> ALPRs have been mapped in San Diego.

<script>
  fetch('https://theflockers.opencodingsociety.com/alpr/locations')
    .then(response => response.json())
    .then(data => {
      const totalCameras = data.features.length;
      document.getElementById('alpr-count').innerText = totalCameras.toLocaleString();
    })
    .catch(error => {
      console.error("Error fetching camera count:", error);
      document.getElementById('alpr-count').innerText = "many";
    });
</script>

## ALPR Scanning

We are currently developing open-source software which can easily be run on the ESP32 microcontroller to scan for ALPRs. This scanning is done via BLE identification of ALPR hardware signatures, which has already been implemented by other groups (such as by [colonelpanichacks](https://github.com/colonelpanichacks/flock-you)), so this is really just a side project.

## Why?

ALPR systems, in their current and future standing, are systems explicitly intended for mass surveillance. That is, their intention is to track the movement of people to aid in the development of a surveillance state. Without fighting back, we allow these oppressive forces to proliferate and infringe upon our freedoms. It's high time to resist this bipartisan, authoritarian push for surveillance.
