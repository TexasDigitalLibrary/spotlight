(function($) {
  $.fn.spotlightCheckUserExistence = function() {
    var formElements = this;
    var target;

    $(formElements).each(function() {
      $(this).on('blur', checkIfUserExists);
      $(this).on('change', cleanUpBlankUserField);
    });

    function checkIfUserExists() {
      target = $(this);
      if (validateEmail(target.val()) === false) {
        emailIsInvalid();
      }
      else {
        emailIsValid();
        if (target.val() !== '') {
          $.ajax(userExistsUrl())
           .success(userExists)
           .fail(userDoesNotExist);
        } else {
          userExists();
        }
      }
    }

    function emailIsValid() {
      invalidEmailNote().hide();
      submitButton().prop('disabled', true);
    }

    function emailIsInvalid() {
      invalidEmailNote().show();
      noUserNote().hide();
      submitButton().prop('disabled', true);
    }

    function validateEmail(email) {
        var re = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/i;
        return re.test(email);
    }

    function cleanUpBlankUserField() {
      if ($(this).val() === '') {
        userExists();
      }
    }

    function userExists() {
      noUserNote().hide();
      submitButton().prop('disabled', false);
    }

    function userDoesNotExist() {
      updateNoUserNoteLink();
      noUserNote().show();
      roleSelect().on('change', updateNoUserNoteLink);
      submitButton().prop('disabled', true);
    }

    function updateNoUserNoteLink() {
      var link = noUserNote().find('a');
      var originalHref = link.data('inviteUrl');
      var userName = target.val();
      var role = roleSelect().val();
      link.attr('href', originalHref + '?user=' + userName + '&role=' + role);
    }

    function roleSelect() {
      return target.closest('tr').find('select');
    }

    function noUserNote() {
      return target.closest('td')
                   .find('[data-behavior="no-user-note"]');
    }

    function invalidEmailNote() {
      return target.closest('td')
                   .find('[data-behavior="invalid-email-note"]');
    }

    function submitButton() {
      return target.closest('tr')
                   .next('tr')
                   .find('input[type="submit"]');
    }

    function userExistsUrl() {
      return $('[data-user-exists-url]').data('userExistsUrl') + '?user=' + target.val();
    }

    return this;
  };
})(jQuery);

Spotlight.onLoad(function() {
  $('[data-behavior="check-user-existence"]').spotlightCheckUserExistence();
});
