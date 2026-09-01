const bookingLink =
  "https://book.squareup.com/appointments/8svbsbzt2lox14/location/LZG7V12MR849J/services";

const loader = document.getElementById("loader");
const header = document.getElementById("header");
const menuButton = document.getElementById("menuButton");
const navMenu = document.getElementById("navMenu");

window.addEventListener("load", () => {
  setTimeout(() => {
    loader.classList.add("hidden");
  }, 600);
});

window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 40);
});

menuButton.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("open");

  document.body.classList.toggle(
    "menu-open",
    isOpen
  );
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

navMenu
  .querySelectorAll("a")
  .forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("open");

      document.body.classList.remove(
        "menu-open"
      );
    });
  });

const revealObserver =
  new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(
            "visible"
          );
        }
      });
    },
    {
      threshold: 0.12
    }
  );

document
  .querySelectorAll(".reveal")
  .forEach((element) => {
    revealObserver.observe(element);
  });

const galleryItems = [
  ...document.querySelectorAll(
    ".gallery-item"
  )
];

document
  .querySelectorAll(".filter")
  .forEach((button) => {
    button.addEventListener("click", () => {
      document
        .querySelectorAll(".filter")
        .forEach((item) => {
          item.classList.remove("active");
        });

      button.classList.add("active");

      const selectedFilter =
        button.dataset.filter;

      galleryItems.forEach((item) => {
        const categories =
          item.dataset.category.split(" ");

        const shouldHide =
          selectedFilter !== "all" &&
          !categories.includes(
            selectedFilter
          );

        item.classList.toggle(
          "hidden",
          shouldHide
        );
      });
    });
  });

document
  .querySelectorAll(".choose")
  .forEach((button) => {
    button.addEventListener("click", () => {
      window.open(
        bookingLink,
        "_blank",
        "noopener,noreferrer"
      );
    });
  });

document
  .querySelectorAll(
    ".square-booking-button"
  )
  .forEach((button) => {
    button.href = bookingLink;
  });

const currentYear = document.getElementById("currentYear");
if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}

const lightbox =
  document.getElementById("lightbox");

const lightboxImage =
  document.getElementById(
    "lightboxImage"
  );

const lightboxCaption =
  document.getElementById(
    "lightboxCaption"
  );

let currentIndex = 0;

function getVisibleItems() {
  return galleryItems.filter(
    (item) =>
      !item.classList.contains("hidden")
  );
}

function showImage(index) {
  const visibleItems = getVisibleItems();

  if (visibleItems.length === 0) {
    return;
  }

  currentIndex =
    (index + visibleItems.length) %
    visibleItems.length;

  const item =
    visibleItems[currentIndex];

  const image =
    item.querySelector("img");

  lightboxImage.src = image.src;
  lightboxImage.alt = image.alt;

  lightboxCaption.textContent =
    item.dataset.caption || image.alt;
}

galleryItems.forEach((item) => {
  item.addEventListener("click", () => {
    currentIndex =
      getVisibleItems().indexOf(item);

    showImage(currentIndex);

    lightbox.classList.add("open");

    document.body.classList.add(
      "lightbox-open"
    );
  });
});

document.getElementById(
  "lightboxClose"
).onclick = () => {
  lightbox.classList.remove("open");

  document.body.classList.remove(
    "lightbox-open"
  );
};

document.getElementById(
  "lightboxPrev"
).onclick = () => {
  showImage(currentIndex - 1);
};

document.getElementById(
  "lightboxNext"
).onclick = () => {
  showImage(currentIndex + 1);
};

lightbox.addEventListener(
  "click",
  (event) => {
    if (event.target === lightbox) {
      document
        .getElementById(
          "lightboxClose"
        )
        .click();
    }
  }
);

document.addEventListener(
  "keydown",
  (event) => {
    if (
      !lightbox.classList.contains(
        "open"
      )
    ) {
      return;
    }

    if (event.key === "Escape") {
      document
        .getElementById(
          "lightboxClose"
        )
        .click();
    }

    if (event.key === "ArrowLeft") {
      showImage(currentIndex - 1);
    }

    if (event.key === "ArrowRight") {
      showImage(currentIndex + 1);
    }
  }
);
// Group photos from the same shoot into one frame and cycle them automatically.
const shootCards = [...document.querySelectorAll('.shoot-card')];

shootCards.forEach((card, cardIndex) => {
  const slides = [...card.querySelectorAll('.shoot-slide')];
  const dots = [...card.querySelectorAll('.shoot-dot')];
  let slideIndex = 0;
  let timer;

  const setSlide = (index) => {
    if (!slides.length) return;
    slideIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle('active', i === slideIndex));
    dots.forEach((dot, i) => dot.classList.toggle('active', i === slideIndex));
  };

  const start = () => {
    if (slides.length < 2) return;
    clearInterval(timer);
    // Slight offset keeps every frame from changing at exactly the same moment.
    timer = setInterval(() => setSlide(slideIndex + 1), 3800 + ((cardIndex % 4) * 350));
  };

  dots.forEach((dot, i) => {
    dot.addEventListener('click', (event) => {
      event.stopPropagation();
      setSlide(i);
      start();
    });
  });

  card.addEventListener('mouseenter', () => clearInterval(timer));
  card.addEventListener('mouseleave', start);
  start();
});

// Filter whole shoots instead of separating photos from the same session.
document.querySelectorAll('.filter').forEach((button) => {
  button.addEventListener('click', () => {
    const selectedFilter = button.dataset.filter;
    shootCards.forEach((card) => {
      const categories = (card.dataset.category || '').split(' ');
      const shouldHide = selectedFilter !== 'all' && !categories.includes(selectedFilter);
      card.classList.toggle('hidden', shouldHide);
    });
  });
});

// Lightbox support for grouped shoot cards.
if (lightbox && lightboxImage && lightboxCaption) {
  let shootLightboxImages = [];
  let shootLightboxIndex = 0;

  const openShootLightbox = (card) => {
    const visibleCards = shootCards.filter((item) => !item.classList.contains('hidden'));
    shootLightboxImages = visibleCards.flatMap((item) =>
      [...item.querySelectorAll('.shoot-slide')].map((img) => ({
        src: img.src,
        alt: img.alt,
        caption: item.dataset.caption || 'Focused by Cam'
      }))
    );

    const active = card.querySelector('.shoot-slide.active') || card.querySelector('.shoot-slide');
    shootLightboxIndex = Math.max(0, shootLightboxImages.findIndex((item) => item.src === active.src));
    const item = shootLightboxImages[shootLightboxIndex];
    lightboxImage.src = item.src;
    lightboxImage.alt = item.alt;
    lightboxCaption.textContent = '';
    lightbox.classList.add('open');
    document.body.classList.add('lightbox-open');
  };

  const moveShootLightbox = (direction) => {
    if (!shootLightboxImages.length) return;
    shootLightboxIndex = (shootLightboxIndex + direction + shootLightboxImages.length) % shootLightboxImages.length;
    const item = shootLightboxImages[shootLightboxIndex];
    lightboxImage.src = item.src;
    lightboxImage.alt = item.alt;
    lightboxCaption.textContent = '';
  };

  shootCards.forEach((card) => card.addEventListener('click', () => openShootLightbox(card)));

  const prevButton = document.getElementById('lightboxPrev');
  const nextButton = document.getElementById('lightboxNext');
  if (prevButton) prevButton.addEventListener('click', (event) => {
    event.stopPropagation();
    if (shootLightboxImages.length) moveShootLightbox(-1);
  });
  if (nextButton) nextButton.addEventListener('click', (event) => {
    event.stopPropagation();
    if (shootLightboxImages.length) moveShootLightbox(1);
  });
}
