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
    const input = $(this).find('input');
    const inputStartValue = input.val();

    if (inputStartValue) {
      $(this).addClass('active');
    }

    input.on('input', e => {
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

  let passwordField = (inputGroupSelector) => {
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
        console.log(input);
        input.value = paste[i] || '';
      });
    }

    inputs[0].addEventListener('paste', handlePaste);

    registrationVerifyCodeForm.addEventListener('input', handleInput);


    function submit() {
      console.log('submit');
    }
  }

  // profile tabs
  const profileTabsContainer = $('#profile-tabs');
  if (profileTabsContainer.length) {
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
        profileTabsContainer.tabs({ active: activeTab/*`#profile-tab-${activeTab+1}`*/ });
      }
      if (activeTab === 2) {
        tabLinks[activeTab].classList.add('completed');
        nextBtn.addClass('d-none');
        finishBtn.removeClass('d-none');
      }
    })
  }

  const listDefault = (containerId, pagesIdPrefix, backBtnId) => {
    const listPage = $(`#${containerId}`);
    if (listPage.length) {
      const items = $(`#${containerId} .list__item`);

      items.each(function (i) {
        const itemPage = $(`#${pagesIdPrefix}${i}`);
        $(this).on('click', function () {
          listPage.addClass('d-none');
          itemPage.removeClass('d-none');
        })
      })

      $(`#${backBtnId}`).on('click', function () {
        if (listPage.hasClass('d-none')) {
          listPage.removeClass('d-none');
          $(`[id^=${pagesIdPrefix}]`).addClass('d-none');
        } else {
          window.history.back();
        }
      })
    }
  }

  // docs
  listDefault('docs-list-page', 'doc-page__', 'documents-back-btn');

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

      accordion.accordion({ active: false, collapsible: true, });
    });

    $('#faq-back-btn').on('click', function () {
      if (docsListPage.hasClass('d-none')) {
        faqsListPage.removeClass('d-none');
        $('[id^=faq-page__]').addClass('d-none');
      } else {
        window.history.back();
      }
    })
  }

  // settings
  listDefault('settings-main', 'settings-page__', 'settings-back-btn');

  // settings
  if ($('#settings').length) {
    const cardList = $('.card-list');
    cardList.listSwipe({
      leftAction: false,
    });

    const cards = $('#settings .card-list .card');
    cards.each(function () {
      const card = $(this);
      const cardInput = $(this).find('input');

      cardInput.change(function () {
        cards.removeClass('active');
        card.addClass('active');
        // console.log($(this).closest('.card'));

      })
    })
  }



})

