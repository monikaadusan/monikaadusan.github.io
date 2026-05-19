function initCountdown() {
  const weddingDate = new Date("October 3, 2026 15:00:00").getTime();
  
  setInterval(function() {
    const now = new Date().getTime();
    const distance = weddingDate - now;
    
    if (distance < 0) {
      document.getElementById("countdown").innerHTML = 
        "<div class='countdown-item'><span class='countdown-number'>...začíname!</span></div>";
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    const daysText = getPluralForm(days, 'deň', 'dni', 'dní');
    const hoursText = getPluralForm(hours, 'hodina', 'hodiny', 'hodín');
    const minutesText = getPluralForm(minutes, 'minúta', 'minúty', 'minút');
    const secondsText = getPluralForm(seconds, 'sekunda', 'sekundy', 'sekúnd');
    
    document.getElementById("countdown").innerHTML = `
      <div class="countdown-item">
        <span class="countdown-number">${days}</span>
        <span class="countdown-label">${daysText}</span>
      </div>
      <div class="countdown-item">
        <span class="countdown-number">${hours}</span>
        <span class="countdown-label">${hoursText}</span>
      </div>
      <div class="countdown-item">
        <span class="countdown-number">${minutes}</span>
        <span class="countdown-label">${minutesText}</span>
      </div>
      <div class="countdown-item">
        <span class="countdown-number">${seconds}</span>
        <span class="countdown-label">${secondsText}</span>
      </div>
    `;
  }, 1000);
}

function getPluralForm(count, singular, dual, plural) {
  if (count === 1) {
    return singular;
  } else if (count > 1 && count < 5) {
    return dual;
  } else {
    return plural;
  }
}


// map ----------------------------------------------------------------
function initMap() {
  var locations = [
    { lat: 47.756661, lng: 18.129949, title: 'Dôstojnícky Pavilón' },
    { lat: 47.757287, lng: 18.126820, title: 'Bazilika sv. Ondreja' },
    { lat: 47.758476, lng: 18.126275, title: 'Hotel Banderium' },
    { lat: 47.756625, lng: 18.124479, title: 'Hotel Danubius' },
  ];
  
  var map = L.map('map-container', {
    center: [47.757287, 18.126820],
    zoom: 13,
    zoomSnap: 0.25,
    zoomDelta: 0.25, 
    zoomControl: true,
    scrollWheelZoom: false,
    doubleClickZoom: false,
    touchZoom: true,       
    dragging: true
  });
  

  var CartoDB_Voyager = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    maxZoom: 20
  });

  CartoDB_Voyager.addTo(map);

  var bounds = L.latLngBounds();

  locations.forEach(function(location) {
    var marker = L.marker([location.lat, location.lng]).addTo(map);
    marker.bindTooltip(location.title, { 
      permanent: true, 
      direction: 'top',
      offset: [-15, -15]
    }).openTooltip();

    bounds.extend(marker.getLatLng());
  });

  var smallScreen = window.innerWidth <= 768;
  var middleScreen = window.innerWidth <= 980;
  
  map.fitBounds(bounds, {
    padding: [smallScreen ? 50 : 100, middleScreen ? 50 : 100]
  });
}

function initFloatingButtonVisibility(selector = '#rsvp', buttonSelector = '#rsvpBtn') {
  const section = document.querySelector(selector);
  const btn = document.querySelector(buttonSelector);

  if (!section || !btn) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          btn.classList.add('hidden');
        } else {
          btn.classList.remove('hidden');
        }
      });
    },
    {
      rootMargin: '0px 0px -200px 0px',
      threshold: 0,
    }
  );

  observer.observe(section);
}

function initCalendarButton() {
  const calendarBtn = document.querySelector('.calendar-btn');
  if (calendarBtn) {
    calendarBtn.addEventListener('click', function() {
      addToCalendar();
    });
  }
}

function addToCalendar() {
  const eventTitle = 'Svadba - Monika & Dušan';
  const eventDate = new Date('October 3, 2026 14:00:00');
  const eventEndDate = new Date('October 4, 2026 4:00:00');
  const eventLocation = 'Komárno, Slovakia';
  
  function formatDateForICS(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}${month}${day}T${hours}${minutes}${seconds}`;
  }
  
  const icsContent = `BEGIN:VCALENDAR
    VERSION:2.0
    PRODID:-//Wedding Calendar//EN
    CALSCALE:GREGORIAN
    BEGIN:VEVENT
    SUMMARY:${eventTitle}
    DTSTART:${formatDateForICS(eventDate)}
    DTEND:${formatDateForICS(eventEndDate)}
    LOCATION:${eventLocation}
    END:VEVENT
    END:VCALENDAR`;
  
  const blob = new Blob([icsContent], { type: 'text/calendar' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'svadba-monika-dusan.ics';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  alert('Udalosť bola pripravená na stiahnutie. Vložte ju do svojho kalendára.');
}

function initEmailCopy() {
  const emailElement = document.getElementById('email-copy');
  if (!emailElement) return;
  
  emailElement.addEventListener('click', function() {
    const email = this.textContent;
    navigator.clipboard.writeText(email).then(function() {
      const originalText = emailElement.textContent;
      emailElement.textContent = 'Skopírované!';
      emailElement.style.backgroundColor = 'rgba(168, 74, 0, 0.2)';
      
      setTimeout(function() {
        emailElement.textContent = originalText;
        emailElement.style.backgroundColor = '';
      }, 2000);
    }).catch(function(err) {
      console.error('Failed to copy email:', err);
      alert('Kopírovanie zlyhalo. Skúste znova.');
    });
  });
}

window.onload = function() {
  initMap();
  initCountdown();
  initFloatingButtonVisibility();
  initCalendarButton();
  initEmailCopy();
};