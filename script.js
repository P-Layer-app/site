console.log("script.js DEBUG AGAIN VERSION loaded and executing!");

document.addEventListener('DOMContentLoaded', () => {
  console.log("DOMContentLoaded fired in script.js DEBUG AGAIN VERSION");

  // --- Scroll Reveal Logic ---
  const scrollRevealElements = document.querySelectorAll('.scroll-reveal');

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  scrollRevealElements.forEach(el => observer.observe(el));

  // --- Carousel Logic ---
  const slides = document.querySelectorAll('.carousel-img');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  let currentSlide = 0;

  const showSlide = (index) => {
    slides.forEach((slide, i) => {
      slide.classList.remove('active');
      if (i === index) {
        slide.classList.add('active');
      }
    });
  };

  if (prevBtn && nextBtn && slides.length > 0) {
    prevBtn.addEventListener('click', () => {
      currentSlide = (currentSlide - 1 + slides.length) % slides.length;
      showSlide(currentSlide);
    });

    nextBtn.addEventListener('click', () => {
      currentSlide = (currentSlide + 1) % slides.length;
      showSlide(currentSlide);
    });
  }

  // --- Logo Dynamic Animation Logic ---
  const logoContainer = document.querySelector('.logo-container');
  const header = document.querySelector('.header');

  console.log('Logo Container Element (DOM):', logoContainer); 
  console.log('Header Element (DOM):', header); 

  if (logoContainer && header) {
    let logoX, logoY, logoVX, logoVY, logoRotation, logoVR;
    let logoSize;
    let mouseX = -1, mouseY = -1; 
    let isMouseOverHeader = false; 

    const initializeLogoState = () => {
      logoSize = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--logo-size'));

      const currentHeaderRect = header.getBoundingClientRect();
      const headerStyle = getComputedStyle(header);
      const paddingTop = parseFloat(headerStyle.paddingTop);
      const paddingBottom = parseFloat(headerStyle.paddingBottom);
      const paddingLeft = parseFloat(headerStyle.paddingLeft);
      const paddingRight = parseFloat(headerStyle.paddingRight);

      const minX = paddingLeft;
      const maxX = currentHeaderRect.width - paddingRight - logoSize; 
      const minY = paddingTop;
      const maxY = currentHeaderRect.height - paddingBottom - logoSize; 

      // Log calculated boundaries and initial values
      console.log('Init Header Rect (Dimensions):', currentHeaderRect.width, currentHeaderRect.height);
      console.log('Init Padding:', paddingTop, paddingBottom, paddingLeft, paddingRight);
      console.log('Init Logo Size:', logoSize);
      console.log('Init MinX:', minX, 'MaxX:', maxX, 'MinY:', minY, 'MaxY:', maxY); 

      logoX = minX + Math.random() * (maxX - minX);
      logoY = minY + Math.random() * (maxY - minY);
      
      logoX = Math.max(minX, Math.min(logoX, maxX));
      logoY = Math.max(minY, Math.min(logoY, maxY));

      // Ensure non-zero initial speeds
      logoVX = (Math.random() > 0.5 ? 1 : -1) * (1 + Math.random() * 1); // 1 to 2 px/frame
      logoVY = (Math.random() > 0.5 ? 1 : -1) * (1 + Math.random() * 1); // 1 to 2 px/frame
      logoRotation = Math.random() * 360;
      logoVR = (Math.random() > 0.5 ? 1 : -1) * (0.3 + Math.random() * 0.5); // 0.3 to 0.8 deg/frame

      console.log('Initial logoX:', logoX, 'logoY:', logoY);
      console.log('Initial logoVX:', logoVX, 'logoVY:', logoVY);
      console.log('Initial logoVR:', logoVR);

      logoContainer.style.transform = `translate(${logoX}px, ${logoY}px) rotate(${logoRotation}deg)`;
      console.log('Logo initial transform applied:', logoContainer.style.transform); 
    };

    initializeLogoState();

    window.addEventListener('resize', initializeLogoState);

    header.addEventListener('mouseenter', () => { isMouseOverHeader = true; console.log('Mouse entered header'); });
    header.addEventListener('mouseleave', () => { isMouseOverHeader = false; console.log('Mouse left header'); });
    header.addEventListener('mousemove', (e) => {
      const headerRect = header.getBoundingClientRect(); 
      mouseX = e.clientX - headerRect.left; 
      mouseY = e.clientY - headerRect.top; 
    });

    const animateLogo = () => {
      // console.log('animateLogo loop running'); // Uncomment for very verbose logging
      const headerRect = header.getBoundingClientRect(); 
      const headerStyle = getComputedStyle(header);
      const paddingTop = parseFloat(headerStyle.paddingTop);
      const paddingBottom = parseFloat(headerStyle.paddingBottom);
      const paddingLeft = parseFloat(headerStyle.paddingLeft);
      const paddingRight = parseFloat(headerStyle.paddingRight);

      const minX = paddingLeft;
      const maxX = headerRect.width - paddingRight - logoSize; 
      const minY = paddingTop;
      const maxY = headerRect.height - paddingBottom - logoSize; 
      
      let targetX, targetY;
      const followStrength = 0.03; 
      const maxRotationSpeed = 1.0; 

      if (isMouseOverHeader) {
        targetX = Math.max(minX, Math.min(mouseX - logoSize / 2, maxX));
        targetY = Math.max(minY, Math.min(mouseY - logoSize / 2, maxY));

        logoX += (targetX - logoX) * followStrength;
        logoY += (targetY - logoY) * followStrength;

        logoRotation += logoVR;
      } else {
        logoX += logoVX;
        logoY += logoVY;
        logoRotation += logoVR;
      }

      const prevLogoX = logoX;
      const prevLogoY = logoY;

      logoX = Math.max(minX, Math.min(logoX, maxX)); 
      logoY = Math.max(minY, Math.min(logoY, maxY)); 

      if (logoX !== prevLogoX) { 
          logoVX *= -1; 
          logoVR += (Math.random() - 0.5) * 0.3; 
      }
      if (logoY !== prevLogoY) { 
          logoVY *= -1; 
          logoVR += (Math.random() - 0.5) * 0.3; 
      }
      
      logoVR = Math.max(-maxRotationSpeed, Math.min(logoVR, maxRotationSpeed)); 

      logoContainer.style.transform = `translate(${logoX}px, ${logoY}px) rotate(${logoRotation}deg)`;

      requestAnimationFrame(animateLogo);
    };

    animateLogo(); 
  }
});