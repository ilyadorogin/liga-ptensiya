
$(function () {
  let loading; // loading.open(), loading.close()

  if ($('#loading-page').length) {
    loading = Modal('loading-page', 'loading-page-modal');
  }

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

  // ============= auth
  passwordField('#login #password_inputGroup');
  passwordField('#reset-password-step2 #newPassword_inputGroup');
  passwordField('#reset-password-step2 #newPasswordCheck_inputGroup');
  passwordField('#registration #password_inputGroup');
  passwordField('#registration #passwordCheck_inputGroup');

  if ($('#registration').length) {
    const modalError = Modal('#registration-modal-1');

    // on register error
    modalError.click(function () {
      modalError.close();
    });
  }

  if ($('#registration-code').length) {
    const modalVerify = Modal('#registration-code-modal-1');

    $('#registration-code-modal-1-accept').click(function () {
      window.location.href = 'registration-success.html';
    });

    $('#registration-code-modal-1-cancel').click(function () {
      modalVerify.close();
    });

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
        modalVerify.open();
      }
    }
  }

  if ($('#demo').length) {
    $('.slick-slider').slick({
      arrows: false,
      dots: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      infinite: true,
    });
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
    const modal1 = Modal('profile-modal-1');
    const modal2 = Modal('profile-modal-2');


    const profileTabsContainer = $('#profile-tabs');
    const nextBtn = $('#profile-tabs-next-btn');
    const finishBtn = $('#profile-tabs-finish-btn');
    const tabLinks = $('.profile__tabs .profile__tabs__link');
    let activeTab = 0;

    profileTabsContainer.tabs();
    nextBtn.on('click', () => {
      if (activeTab === 0) {
        tabLinks[activeTab].classList.remove('active');
        tabLinks[activeTab].classList.add('completed');

        activeTab++;
        tabLinks[activeTab].classList.add('active');
        profileTabsContainer.tabs({active: activeTab});
      } else if (activeTab === 1) {
        modal1.open();

        const modal1Btn = $('#profile-modal-1-accept');
        modal1Btn.unbind('click');
        modal1Btn.on('click', function () {

          modal1.close();
          modal2.open();

          const modal2Btn = $('#profile-modal-2-cancel');
          modal2Btn.unbind('click');
          modal2Btn.on('click', function () {
            // Перехід на сторонню платіжну систему
            // ...

            modal2.close();

            tabLinks[activeTab].classList.remove('active');
            tabLinks[activeTab].classList.add('completed');
            activeTab++;
            tabLinks[activeTab].classList.add('active');
            profileTabsContainer.tabs({active: activeTab});

            nextBtn.addClass('d-none');
            finishBtn.removeClass('d-none');
            tabLinks[activeTab].classList.add('completed');
          })
        })
      }
    });

    // $(document).swiperight(function (e) {
    //   console.log(e);
    // })

    $('.profile__tabs li:first-child').click(function () {
      activeTab = 0;
      profileTabsContainer.tabs({active: activeTab});
      tabLinks[0].classList.remove('completed');
      tabLinks[0].classList.add('active');
      tabLinks[1].classList.remove('completed');
      tabLinks[1].classList.remove('active');
      tabLinks[2].classList.remove('completed');
      tabLinks[2].classList.remove('active');
    })

    // bottom menu
    bottomSwipeMenu();

    function bottomSwipeMenu() {
      const bottomSwipeMenuEl = $('.bottom-swipe-menu');
      const overlay = $('.bottom-swipe-menu .bottom-swipe-menu__overlay');
      const mainBottomPos = $('#profile-main').height();
      const hOverlay = new Hammer(document.getElementById('bottom-swipe-menu-overlay'));
      const hHeader = new Hammer(document.getElementById('bottom-swipe-menu-header'));
      const menuHeight = 440;

      let opened = false;

      bottomSwipeMenuEl.css('top', mainBottomPos);

      const shouldOpen = $('#profile').height() - menuHeight <= mainBottomPos;

      if (shouldOpen) {
        _overlayShow();

        overlay.on('click', function (e) {
          _openBSM();
        });
        hOverlay.on('panup panleft panright', function (e) {
          _openBSM();
        });

        bottomSwipeMenuEl.on('click', function (e) {
          e.stopPropagation();
        });

        $(document).click(function () {
          _closeBSM();
        });
        hHeader.on('pandown panleft panright', function (e) {
          _closeBSM();
        });
      }

      function _openBSM() {
        let openedMenuTopPos = $('#profile').height() - menuHeight;

        if (!opened) {
          opened = true;
          bottomSwipeMenuEl.css('top', openedMenuTopPos);
          _overlayHide();
        }
      }
      function _closeBSM() {
        opened = false;
        bottomSwipeMenuEl.css('top', mainBottomPos);
        _overlayShow();
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
    });


    const modal1 = Modal('faq-modal');
    $('form[name="question-form"]').submit(function (e) {
      e.preventDefault();

      // отправить вопрос ...

      modal1.open();
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

    const modalDelete = Modal('settings-modal-1');
    const modalDeleteSuccess = Modal('settings-modal-2');
    const modalSaveSuccess = Modal('settings-modal-3');
    const modalLogout = Modal('settings-modal-4');
    const modalShare = Modal('settings-modal-5');


    $('.card-list .card').each(function () {
      const cardId = $(this).attr('for');
      const deleteButton = $(this).find('.card__right-button');

      deleteButton.click(function () {
        modalDelete.open();
      });
    });

    $('#settings-modal-1-delete').click(function () {
      modalDelete.close();

      // delete card
      // ...

      modalDeleteSuccess.open();
    });

    $('#settings-modal-1-cancel').click(function () {
      modalDelete.close();
    });

    $('#settings-save').click(function () {
      // save settings
      // ...

      modalSaveSuccess.open();
    });

    $('#settings-logout').click(function () {
      modalLogout.open();
    });

    $('#settings-modal-4-logout').click(function () {
      // logout
      // ...

      window.location.href = '../index.html';
    });

    $('#settings-modal-4-cancel').click(function () {
      modalLogout.close();
    });

    $('#settings-share').click(function () {
      modalShare.open();
    });
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

    $('.card-list .card .regular-payment__item__content__more').click(function () {
      modalEdit.open();
      const regularPaymentId = $(this).closest('label').attr('for');

      // get regularPayment data
      // ...
    });

    $('.card-list .card .card__right-button').click(function () {
      modalDelete.open();
    });


    const modalEdit = Modal('regular-payment-modal-1');
    const modalDelete = Modal('regular-payment-modal-2');
    const modalDeleteSuccess = Modal('regular-payment-modal-3');

    $('#regular-payment-delete').click(function () {
      modalEdit.close();
      modalDelete.open();
    });

    $('#regular-payment-delete-accept').click(function () {
      modalDelete.close();

      // delete regular payment
      // ...

      modalDeleteSuccess.open();
    });

    $('#regular-payment-delete-cancel').click(function () {
      modalDelete.close();
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

    const modal1 = Modal('regular-payment-edit-modal-1');
    const modal2 = Modal('regular-payment-edit-modal-2');
    const modal3 = Modal('regular-payment-edit-modal-3');

    $('#regular-payment-edit-save').click(function () {
      modal1.open();
    });

    $('#regular-payment-edit-modal-1-accept').click(function () {
      modal1.close();
      modal2.open();
    });

    $('#regular-payment-edit-modal-2-save-btn').click(function () {
      // $(this).find('.unsaved').addClass('d-none');
      // $(this).find('.saved').removeClass('d-none');
      modal2.close();

      // save regular payment
      // ...

      modal3.open();
    })

  }

  // datepicker
  if ($.datepicker) {
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
  }

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

    const modal1 = Modal('account-statement-modal-1');
    const modal2 = Modal('account-statement-modal-2');

    $('#get-account-statement').click(function () {
      modal1.open();
      // get account statement
      // ...
    });

    $('#account-statement-modal-1-print').click(function () {
      modal1.close();

      // print account statement
      // ...

      modal2.open();
    });

    $('#account-statement-modal-1-save').click(function () {
      modal1.close();

      // save account statement
      // ...
    });

  }


  // investment
  if ($('#investment').length) {
    listDefault(
      'investment-main',
      'investment-page-link',
      'investment-page__',
      'investment-back-btn',
      []
    );

    // charts

    const _chartFund = ChartFund(
      document.getElementById('chart1'),
      ['10.18', '02.19', '06.19', '10.19', '02.20', '06.20', '10.20', '02.21'],
      [0, 4, 7, 13, 23, 20, 28, 35],
      [0, 3, 4, 2, 5, 8, 9, 17],
    );

    const chartAsset = document.getElementById('chart2').getContext('2d');
    const gradient1 = chartAsset.createLinearGradient(0, 0, 0, 250);
    gradient1.addColorStop(0, 'rgba(242, 169, 0, 1)');
    gradient1.addColorStop(1, 'rgba(242, 169, 0, 0)');
    const gradient2 = chartAsset.createLinearGradient(0, 0, 0, 250);
    gradient2.addColorStop(0, 'rgba(88, 11, 107, 1)');
    gradient2.addColorStop(1, 'rgba(88, 11, 107, 0)');
    const gradient3 = chartAsset.createLinearGradient(0, 0, 0, 250);
    gradient3.addColorStop(0, 'rgba(17, 94, 103, 1)');
    gradient3.addColorStop(1, 'rgba(255, 255, 255, 0.98)');
    const gradient4 = chartAsset.createLinearGradient(0, 0, 0, 250);
    gradient4.addColorStop(0, 'rgba(72, 99, 197, 1)');
    gradient4.addColorStop(1, 'rgba(255, 255, 255, 1)');
    const gradient5 = chartAsset.createLinearGradient(0, 0, 0, 250);
    gradient5.addColorStop(0, 'rgba(243, 48, 224, 0.75)');
    gradient5.addColorStop(1, 'rgba(255, 255, 255, 1)');

    const _chartAssets = ChartAssets(
      chartAsset,
      [
        {
          label: 'Облігації внутрішньої державної позики 49,41 %',
          amount: 49.41,
          // color: '#F2A900',
          color: gradient1,
        },
        {
          label: 'Депозити та грошові кошти 27,84 %',
          amount: 47.83,
          // color: '#580B6B',
          color: gradient2,
        },
        {
          label: 'Акції 3,12 %',
          amount: 3.12,
          // color: '#4863C5',
          color: gradient3,
        },
        {
          label: 'Муніціпальні облігації 8,07 %',
          amount: 8.07,
          // color: '#F330E0',
          color: gradient4,
        },
        {
          label: 'Облігації підприємств 11,36 %',
          amount: 11.36,
          // color: '#115E67',
          color: gradient5,
        },
      ]
    )


  }

  function ChartFund(
    element,
    labels,
    line1DataPoints,
    line2DataPoints,
  ) {
    const maxValue = Math.ceil(Math.max(...line1DataPoints, ...line2DataPoints) / 10) * 10;

    const data = {
      labels: labels,
      datasets: [
        {
          label: 'Доходність НФП «Взаємодопомога», %',
          data: line1DataPoints,
          borderColor: '#F2A900',
          fill: false,
          tension: 0.4,
        },
        {
          label: 'Інфляція, %',
          data: line2DataPoints,
          borderColor: '#115E67',
          fill: false,
          tension: 0.4
        }
      ]
    };

    const config = {
      type: 'line',
      data: data,
      options: {
        responsive: true,
        plugins: {
          title: {
            display: false,
          },
          legend: {
            display: false,
          }
        },
        interaction: {
          intersect: false,
        },
        scales: {
          x: {
            display: true,
            grid: {
              display: false
            }
          },
          y: {
            display: true,
            ticks: {
              stepSize: 5
            },
            grid: {
              display: false
            },
            suggestedMin: 0,
            suggestedMax: maxValue
          }
        }
      },
    }

    return new Chart(element, config);
  }

  function ChartAssets(
    element,
    data
  ) {
    const NUMBER_CFG = {count: data.length, min: 0, max: 100};

    const _data = {
      labels: data.map(item => item.label),
      datasets: [
        {
          data: data.map(item => item.amount),
          backgroundColor: data.map(item => item.color),
        }
      ]
    };

    const config = {
      type: 'doughnut',
      data: _data,
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: false,
          }
        }
      },
    };

    return new Chart(element, config);
  }

  function Modal(id, _class) {
    const m = $('#'+id.replace('#',''));

    m.dialog({
      classes : {
        'ui-dialog': 'modal ' + _class ?? '',
        'ui-dialog-titlebar': 'd-none',
        // 'ui-dialog-content': 'modal__content',
      },
      width: 316,
      modal: true,
    });
    m.dialog('close');

    m.open = () => {
      m.dialog('open');
    }
    m.close = () => {
      m.dialog('close');
    }

    m.find('.modal__close-btn').on('click', function () {
      m.close();
    });

    return m;
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

})

