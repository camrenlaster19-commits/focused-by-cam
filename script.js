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

document.getElementById(
  "currentYear"
).textContent =
  new Date().getFullYear();

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