// строгий режим
"use strict"
window.addEventListener('load', function (win) {
   // Определение устройства PC / Mobile (mouse / touchScreen)

   const isMobile = {
      Android: function () {
         return navigator.userAgent.match(/Android/i);
      },
      BlackBerry: function () {
         return navigator.userAgent.match(/BlackBerry/i);
      },
      iOS: function () {
         return navigator.userAgent.match(/iPhone|iPad|iPod/i);
      },
      Opera: function () {
         return navigator.userAgent.match(/Opera Mini/i);
      },
      Windows: function () {
         return navigator.userAgent.match(/IEMobile/i);
      },
      any: function () {
         return (
            isMobile.Android() ||
            isMobile.BlackBerry() ||
            isMobile.iOS() ||
            isMobile.Opera() ||
            isMobile.Windows());
      }
   };

   if (isMobile.any()) {
      document.body.classList.add('_touch');
   } else {
      document.body.classList.add('_pc');
   };


   let tabsItemElement = document.querySelectorAll('.tabs__item-element');




   $('.slider_documents').slick({
      speed: 500,   // время перелистывания
      cssEase: 'ease',
      slidesToShow: 3,  // сколько слайдов показывать
      slidesToScroll: 1,  // сколько слайдов листать за раз
      //  focusOnSelect: true,
      draggable: false, // отключает воздействие мышкой
      touchThreshold: 10, // Чтобы перемещаться по слайдам, пользователь должен провести по экрану на расстояние, равное (1/touchThreshold) * ширину слайдера.
      touchMove: false,  // Включить движение слайдов касанием
      waitForAnimate: true,  // ожидание анимации, если false то можно быстро листать
      mobileFirst: false, // включение mobileFirst   false - (max-width)   true – (min-width) */
      responsive: [   //  изменение настроек при breakpoint (min-width)
         {
            breakpoint: 766.98,
            settings: {
               slidesToShow: 1,
               draggable: true,
               arrows: false,
               infinite: true,
               arrows: true,

            }
         }
      ],
   })




   // demo
   class ShapeOverlays {
      constructor(elm) {
         this.elm = elm;
         this.path = elm.querySelectorAll('path');
         this.numPoints = 2;
         this.duration = 600;
         this.delayPointsArray = [];
         this.delayPointsMax = 0;
         this.delayPerPath = 200;
         this.timeStart = Date.now();
         this.isOpened = false;
         this.isAnimating = false;
      }
      toggle() {
         this.isAnimating = true;
         for (var i = 0; i < this.numPoints; i++) {
            this.delayPointsArray[i] = 0;
         }
         if (this.isOpened === false) {
            this.open();
         } else {
            this.close();
         }
      }
      open() {
         this.isOpened = true;
         this.elm.classList.add('is-opened');
         this.timeStart = Date.now();
         this.renderLoop();
      }
      close() {
         this.isOpened = false;
         this.elm.classList.remove('is-opened');
         this.timeStart = Date.now();
         this.renderLoop();
      }
      updatePath(time) {
         const points = [];
         for (var i = 0; i < this.numPoints; i++) {
            const thisEase = this.isOpened ?
               (i == 1) ? ease.cubicOut : ease.cubicInOut :
               (i == 1) ? ease.cubicInOut : ease.cubicOut;
            points[i] = thisEase(Math.min(Math.max(time - this.delayPointsArray[i], 0) / this.duration, 1)) * 100
         }

         let str = '';
         str += (this.isOpened) ? `M 0 0 V ${points[0]} ` : `M 0 ${points[0]} `;
         for (var i = 0; i < this.numPoints - 1; i++) {
            const p = (i + 1) / (this.numPoints - 1) * 100;
            const cp = p - (1 / (this.numPoints - 1) * 100) / 2;
            str += `C ${cp} ${points[i]} ${cp} ${points[i + 1]} ${p} ${points[i + 1]} `;
         }
         str += (this.isOpened) ? `V 0 H 0` : `V 100 H 0`;
         return str;
      }
      render() {
         if (this.isOpened) {
            for (var i = 0; i < this.path.length; i++) {
               this.path[i].setAttribute('d', this.updatePath(Date.now() - (this.timeStart + this.delayPerPath * i)));
            }
         } else {
            for (var i = 0; i < this.path.length; i++) {
               this.path[i].setAttribute('d', this.updatePath(Date.now() - (this.timeStart + this.delayPerPath * (this.path.length - i - 1))));
            }
         }
      }
      renderLoop() {
         this.render();
         if (Date.now() - this.timeStart < this.duration + this.delayPerPath * (this.path.length - 1) + this.delayPointsMax) {
            requestAnimationFrame(() => {
               this.renderLoop();
            });
         }
         else {
            this.isAnimating = false;
         }
      }
   }

   const ease = {
      exponentialIn: (t) => {
         return t == 0.0 ? t : Math.pow(2.0, 10.0 * (t - 1.0));
      },
      exponentialOut: (t) => {
         return t == 1.0 ? t : 1.0 - Math.pow(2.0, -10.0 * t);
      },
      exponentialInOut: (t) => {
         return t == 0.0 || t == 1.0
            ? t
            : t < 0.5
               ? +0.5 * Math.pow(2.0, (20.0 * t) - 10.0)
               : -0.5 * Math.pow(2.0, 10.0 - (t * 20.0)) + 1.0;
      },
      sineOut: (t) => {
         const HALF_PI = 1.5707963267948966;
         return Math.sin(t * HALF_PI);
      },
      circularInOut: (t) => {
         return t < 0.5
            ? 0.5 * (1.0 - Math.sqrt(1.0 - 4.0 * t * t))
            : 0.5 * (Math.sqrt((3.0 - 2.0 * t) * (2.0 * t - 1.0)) + 1.0);
      },
      cubicIn: (t) => {
         return t * t * t;
      },
      cubicOut: (t) => {
         const f = t - 1.0;
         return f * f * f + 1.0;
      },
      cubicInOut: (t) => {
         return t < 0.5
            ? 4.0 * t * t * t
            : 0.5 * Math.pow(2.0 * t - 2.0, 3.0) + 1.0;
      },
      quadraticOut: (t) => {
         return -t * (t - 2.0);
      },
      quarticOut: (t) => {
         return Math.pow(t - 1.0, 3.0) * (1.0 - t) + 1.0;
      },
   }

   const headerButtonSell = document.querySelector('.header__button-sell');
   const headerAnhorParagraph = document.querySelectorAll('.header__anhor-paragraph');
   const elmOverlay = document.querySelector('.shape-overlays');
   const overlay = new ShapeOverlays(elmOverlay);

   // события
   document.addEventListener('click', function (event) {
      if (event.target.closest('.tabs__item-element')) {
         tabsItemElement.forEach(e => {
            if (event.target.closest('.tabs__item-element') == e) {
               e.classList.toggle('tabs__open');
            } else {
               e.classList.remove('tabs__open');
            }
         })
      } else {
         tabsItemElement.forEach(e => {
            e.classList.remove('tabs__open');
         })
      }

      // фон меню
      if (event.target.closest('.header__burger')) {
         overlay.toggle();
         document.querySelector('.header__burger').classList.toggle('header__burger-active')
         headerAnhorParagraph.forEach(e => {
            e.classList.toggle('is-opened', overlay.isOpened);
         })
         headerButtonSell.classList.toggle('header__button-sell-active', overlay.isOpened);
         document.body.classList.toggle('body_overflow', overlay.isOpened);
      } else {
         if (overlay.isOpened) {
            overlay.close();
            document.querySelector('.header__burger').classList.remove('header__burger-active');
            headerAnhorParagraph.forEach(e => {
               e.classList.remove('is-opened');
            })
            headerButtonSell.classList.remove('header__button-sell-active');
            document.body.classList.remove('body_overflow', overlay.isOpened);
         }
      }
   })


   // заброс стрелок в кнопки слайдера
   // закрытие меню при увеличении экрана
   let arrowLeft = document.querySelector('.arrow_left');
   let arrowFight = document.querySelector('.arrow_fight');

   window.addEventListener('resize', checkMediaQuery);
   function checkMediaQuery() {
      if (window.innerWidth < '767') {
         setTimeout(e => {
            document.querySelector('.slick-prev').prepend(arrowFight);
            document.querySelector('.slick-next').prepend(arrowLeft);
         }, 500)
      } else {
         if (overlay.isOpened) {
            overlay.close();
            headerAnhorParagraph.forEach(e => {
               e.classList.remove('is-opened');
            })
            headerButtonSell.classList.remove('header__button-sell-active');
            document.body.classList.remove('body_overflow', overlay.isOpened);
         }
      }
   }
   checkMediaQuery();

   /* эффект при прокрутке, ленивая подгрузка */
   if (document.querySelector('.observer')) {
      let options = {
         rootMargin: '-100px 0px',
         threshold: [0, 1],
      }
      let callback = function (entries, observer) {
         entries.forEach(entry => {
            if (entry.isIntersecting) {
               entry.target.style.opacity = "1";
               entry.target.style.transform = "translate(0px, 0px)";
            }
         })
      };
      let observer = new IntersectionObserver(callback, options);
      let target = document.querySelectorAll('.observer');

      target.forEach(function (element) {
         observer.observe(element);
      })
   }



   /*   плавная прокрутка "якорь"   */
   let dataPoint = document.querySelectorAll('[data-point]');
   if (dataPoint.length > 0) { // проверка наличия data-point атрибутов, если их нет, код не выполняется
      dataPoint.forEach(function (e) {
         let sectionPoint = document.querySelector(e.dataset.point);
         if (sectionPoint) { // проверка наличия блока с классом, указанным в  data-point
            e.addEventListener('click', function (event) {
               window.scrollTo({
                  top: sectionPoint.offsetTop - document.querySelector('header').offsetHeight,
                  behavior: "smooth"
               })
               event.preventDefault();
            })
         }
      })
   }





})