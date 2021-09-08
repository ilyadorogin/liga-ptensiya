// const pug = require('pug');

$(function () {
  // header
  const headerBackButton = $('#header__back-btn');
  if (headerBackButton) {
    headerBackButton.on('click', function () {
      window.history.back();
    });
  }

  // input
  $('.input-group').each(function () {
    const input = $(this).find('.input-group__control');
    const inputStartValue = input.val();

    if (inputStartValue) {
      $(this).addClass('active');
    }

    input.on('change input', e => {
      const val = input.val();
      if (val) {
        $(this).addClass('active');
      } else {
        $(this).removeClass('active');
      }
    })
    input.on('focus', () => {
      $(this).addClass('focus');
    })
    input.on('blur', () => {
      $(this).removeClass('focus');
    })
  });

  function passwordField(inputGroupSelector) {
    const suffix = $(`${inputGroupSelector} .suffix`);
    const input = $(inputGroupSelector).find('input');

    suffix?.on('click', function () {
      if ($(this).hasClass('ic_eye-hide')) {
        $(this).removeClass('ic_eye-hide');
        $(this).addClass('ic_eye-unhide');
        input.attr('type', 'text');
      } else {
        $(this).removeClass('ic_eye-unhide');
        $(this).addClass('ic_eye-hide');
        input.attr('type', 'password');
      }
    });
  }

  // ============= auth
  passwordField('#login #password_inputGroup');
  passwordField('#reset-password-step2 #newPassword_inputGroup');
  passwordField('#reset-password-step2 #newPasswordCheck_inputGroup');
  passwordField('#registration #password_inputGroup');
  passwordField('#registration #passwordCheck_inputGroup');

  // verify
  const registrationVerifyCodeForm = document.querySelector('[name="verify"]');
  if (registrationVerifyCodeForm) {
    const inputs = registrationVerifyCodeForm.querySelectorAll('.inputs input');

    function handleInput(e) {
      // check for data that was inputtted and if there is a next input, focus it
      const input = e.target;
      if (input.nextElementSibling && input.value) {
        input.nextElementSibling.focus();
      }
      if (!input.nextElementSibling) {
        submit();
      }

    }

    function handlePaste(e) {
      const paste = e.clipboardData.getData('text');
      // loop over each input, and populate with the index of that string
      inputs.forEach((input, i) => {
        input.value = paste[i] || '';
      });
    }

    inputs[0].addEventListener('paste', handlePaste);

    registrationVerifyCodeForm.addEventListener('input', handleInput);


    function submit() {
      console.log('submit');
    }
  }

  function listDefault(mainPageId, listItemClass, pagesIdPrefix, backBtnId, [mainCallback, ...pagesCallbacks]) {
    const listPage = $(`#${mainPageId}`);
    if (listPage.length) {
      const items = $(`#${mainPageId} .${listItemClass}`);
      let openedIndex = undefined;

      items.each(function (i) {
        const itemPage = $(`#${pagesIdPrefix}${i}`);
        $(this).on('click', function () {
          listPage.addClass('d-none');
          itemPage.removeClass('d-none');

          if (typeof mainCallback?.close === 'function') mainCallback.close();
          if (typeof pagesCallbacks[i]?.open === 'function') mainCallback.open();

          openedIndex = i;
        });
      })

      $(`#${backBtnId}`).on('click', function () {
        if (listPage.hasClass('d-none')) {
          listPage.removeClass('d-none');
          $(`[id^=${pagesIdPrefix}]`).addClass('d-none');

          // open/close callback
          if (typeof pagesCallbacks[openedIndex]?.close === 'function') mainCallback.close();
          if (typeof mainCallback?.open === 'function') mainCallback.open();

          openedIndex = undefined;
        } else {
          window.history.back();
        }
      })
    }
  }

  // profile
  if ($('#profile').length) {
    listDefault(
      'profile-main',
      'profile__page-btn',
      'profile-page__',
      'profile-back-btn',
      [{
        open: () => {
          $('.bottom-swipe-menu').show();
        },
        close: () => {
          $('.bottom-swipe-menu').hide();
        }
      }]
    );

    $('.slick-slider').slick({
      arrows: false,
      dots: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      infinite: true,
    });


    // top up
    const profileTabsContainer = $('#profile-tabs');
    const nextBtn = $('#profile-tabs-next-btn');
    const finishBtn = $('#profile-tabs-finish-btn');
    const tabLinks = $('.profile__tabs .profile__tabs__link');
    let activeTab = 0;

    profileTabsContainer.tabs();
    nextBtn.on('click', () => {
      if (activeTab < 2) {
        tabLinks[activeTab].classList.remove('active');
        tabLinks[activeTab].classList.add('completed');

        activeTab++;
        tabLinks[activeTab].classList.add('active');
        profileTabsContainer.tabs({active: activeTab/*`#profile-tab-${activeTab+1}`*/});
      }
      if (activeTab === 2) {
        tabLinks[activeTab].classList.add('completed');
        nextBtn.addClass('d-none');
        finishBtn.removeClass('d-none');
      }
    });

    // bottom menu
    bottomSwipeMenu();

    function bottomSwipeMenu() {
      const bottomSwipeMenuEl = $('.bottom-swipe-menu');
      const overlay = $('.bottom-swipe-menu .bottom-swipe-menu__overlay');
      const mainBottomPos = $('#profile-main').height();
      const menuHeight = 440;

      let opened = false;

      bottomSwipeMenuEl.css('top', mainBottomPos);

      const shouldOpen = $('#profile').height() - menuHeight <= mainBottomPos;

      if (shouldOpen) {
        _overlayShow();

        overlay.on('click', function (e) {
          let openedMenuTopPos = $('#profile').height() - menuHeight;

          if (!opened) {
            opened = true;
            bottomSwipeMenuEl.css('top', openedMenuTopPos);
            _overlayHide();
          }
        });

        bottomSwipeMenuEl.on('click', function (e) {
          e.stopPropagation();
        })

        $(document).click(function () {
          opened = false;
          bottomSwipeMenuEl.css('top', mainBottomPos);
          _overlayShow();
        });
      }


      function _overlayShow() {
        overlay.css('top', 0);
        overlay.css('bottom', 0);
        overlay.css('left', 0);
        overlay.css('right', 0);
      }

      function _overlayHide() {
        overlay.css('top', 'unset');
        overlay.css('bottom', 'unset');
        overlay.css('left', 'unset');
        overlay.css('right', 'unset');
      }

    }

  }

  // docs
  listDefault(
    'docs-list-page',
    'list__item',
    'doc-page__',
    'documents-back-btn',
    []
  );

  // faq
  const faqsListPage = $('#faq-list-page');
  if (faqsListPage.length) {
    const items = $('#faq-list-page .list__item');

    items.each(function (i) {
      const faqPage = $(`#faq-page__${i}`);
      const accordion = $(`#faq-page__${i} .accordion`);

      $(this).on('click', function () {
        faqsListPage.addClass('d-none');
        faqPage.removeClass('d-none');
      });

      accordion.accordion({active: false, collapsible: true,});
    });

    $('#faq-back-btn').on('click', function () {
      if (faqsListPage.hasClass('d-none')) {
        faqsListPage.removeClass('d-none');
        $('[id^=faq-page__]').addClass('d-none');
      } else {
        window.history.back();
      }
    })
  }

  function cardList(listSelector, itemSelector) {
    const cardList = $(listSelector);
    cardList.listSwipe({
      leftAction: false,
    });

    const cards = $(itemSelector);
    cards.each(function () {
      const card = $(this);
      const cardInput = $(this).find('input');

      cardInput.change(function () {
        cards.removeClass('active');
        card.addClass('active');
      })
    })
  }

  // settings
  if ($('#settings').length) {
    listDefault(
      'settings-main',
      'list__item',
      'settings-page__',
      'settings-back-btn',
      []
    );

    cardList('.card-list', '#settings .card-list .card, #settings .settings__other-pay-methods .settings__other-pay-methods__item');
  }

  // regular payment
  if ($('#regular-payment').length) {
    cardList('.card-list', '.card-list .card');

    listDefault(
      'regular-payment-main',
      'regular-payment-page-link',
      'regular-payment-page__',
      'regular-payment-back-btn',
      []
    );

    $('.slick-slider').slick({
      arrows: false,
      dots: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      infinite: true,
    });
  }

  if ($('#regular-payment-edit').length) {
    $('.regular-payment__edit-list').each(function () {
      $(this).change(function (e) {
        const items = $(this).find('.regular-payment__edit-list__item');
        const input = $(e.target);
        // const value = input.val();

        items.removeClass('active');
        input.closest('.regular-payment__edit-list__item').addClass('active');
      });
    });

    $('.slick-slider').slick({
      arrows: false,
      dots: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      infinite: true,
    });
  }

  // datepicker
  $.datepicker.regional.uk = {
    closeText: "Закрити",
    prevText: "&#x3C;",
    nextText: "&#x3E;",
    currentText: "Сьогодні",
    monthNames: [ "Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень", "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень" ],
    monthNamesShort: [ "Січ", "Лют", "Бер", "Кві", "Тра", "Чер", "Лип", "Сер", "Вер", "Жов", "Лис", "Гру" ],
    dayNames: [ "неділя", "понеділок", "вівторок", "середа", "четвер", "п’ятниця", "субота" ],
    dayNamesShort: [ "нед", "пнд", "вів", "срд", "чтв", "птн", "сбт" ],
    dayNamesMin: [ "Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб" ],
    weekHeader: "Тиж",
    dateFormat: "dd.mm.yy",
    firstDay: 1,
    isRTL: false,
    showMonthAfterYear: false,
    yearSuffix: "",
  };
  $.datepicker.setDefaults($.datepicker.regional['uk']);
  $('.datepicker input').datepicker();

  // account statement
  if ($('#account-statement').length) {
    const dateFormat = "mm/dd/yy"

    const from = $("#account-statement #startDate").datepicker({
      defaultDate: "+1w",
      changeMonth: true,
      numberOfMonths: 3,
    }).on("change", function () {
      to.datepicker("option", "minDate", getDate(this));
    });

    const to = $("#account-statement #endDate").datepicker({
      defaultDate: "+1w",
      changeMonth: true,
      numberOfMonths: 3,

    }).on("change", function () {
      from.datepicker("option", "maxDate", getDate(this));
    });

    function getDate(element) {
      let date;
      try {
        date = $.datepicker.parseDate(dateFormat, element.value);
      } catch (error) {
        date = null;
      }
      return date;
    }
  }


})

